'use strict';

/*
Common Error Response Requirements (RFC 9457):

Every operation MUST include:
  - 400 Bad Request
  - 404 Not Found
  - 500 Internal Server Error
    → MUST use `application/problem+json` or `application/problem+xml`
    → MUST include examples

If the API or operation is secured, then also required:
  - 401 Unauthorized
  - 403 Forbidden

If an operation explicitly disables security (`security: []`) or the API has no global security:
  - 401 and 403 are NOT required

All responses must conform to the Problem Details standard (RFC 9457).
*/

type RulesetFunctionContext = {
  document?: {
    data?: {
      security?: unknown;
    };
  };
  path?: (string | number)[];
  rule: {
    severity: number;
  };
};

type RulesetFunction<T, O> = (
  targetVal: T,
  opts: O,
  context: RulesetFunctionContext,
) => Array<{ message: string; path?: (string | number)[] }>;

const REQUIRED_ALWAYS = ['400', '404', '500'] as const;
const REQUIRED_IF_SECURED = ['401', '403'] as const;

type MediaTypeObject = {
  examples?: Record<string, unknown>;
};

type ResponseObject = {
  content?: {
    [media: string]: MediaTypeObject;
  };
};

type OpenAPIResponse = ResponseObject;

interface OperationObject {
  responses?: Record<string, ResponseObject>;
  security?: unknown[] | unknown;
}

interface Options {
  mode?: 'critical' | 'explicit-security' | 'root-inherit';
}

interface ValidationIssue {
  statusCode: string;
  issues: string[];
}

/**
 * Checks if a response defines application/problem+json or application/problem+xml and includes at least one example.
 *
 * @param responses - The set of operation responses keyed by HTTP status code.
 * @param code - The HTTP status code being validated.
 * @returns The validation issue for the response, or `null` when it satisfies the requirements.
 */
function validateResponse(
  responses: Record<string, OpenAPIResponse> | undefined,
  code: string,
): ValidationIssue | null {
  const issues: string[] = [];
  const response = responses?.[code];
  if (!response) {
    issues.push('missing response');
  } else {
    const content =
      response?.content?.['application/problem+json'] ||
      response?.content?.['application/problem+xml'];

    if (!content) {
      issues.push('missing application/problem+json or application/problem+xml');
    } else if (!content.examples || Object.keys(content.examples).length === 0) {
      issues.push('missing example');
    }
  }

  return issues.length ? { statusCode: code, issues } : null;
}

/**
 * Custom ruleset function to validate common error responses on operations.
 *
 * @param targetVal - The operation being evaluated.
 * @param opts - Function options that adjust which status codes must be present.
 * @param context - The rule execution context.
 * @returns An array of rule results describing missing or invalid error responses.
 */
export const runRule: RulesetFunction<OperationObject, Options> = function (
  targetVal: OperationObject,
  opts: Options,
  context: RulesetFunctionContext,
) {
  try {
    const { responses = {}, security: opSecurity } = targetVal;
    const globalSecurity = (context.document?.data as { security?: any })?.security;
    const globalSecurityActive = Array.isArray(globalSecurity) && globalSecurity.length > 0;
    const path = context.path?.[1] || '';
    const isRoot = path === '/';
    const mode = opts?.mode;

    let requiredStatusCodes: string[] = [];
    let shouldRun = false;

    if (mode === 'critical') {
      requiredStatusCodes = [...REQUIRED_ALWAYS];
      shouldRun = true;
    }

    if (mode === 'explicit-security') {
      const securityExplicitlyDisabled = Array.isArray(opSecurity) && opSecurity.length === 0;
      const securityExplicitlyActive = Array.isArray(opSecurity) && opSecurity.length > 0;
      if (securityExplicitlyActive || (!securityExplicitlyDisabled && !isRoot && globalSecurityActive)) {
        requiredStatusCodes = [...REQUIRED_IF_SECURED];
        shouldRun = true;
      }
    }

    if (mode === 'root-inherit') {
      const isInheritingGlobalSecurity =
        isRoot && (opSecurity === undefined || opSecurity === null) && globalSecurityActive;

      if (isInheritingGlobalSecurity) {
        requiredStatusCodes = [...REQUIRED_IF_SECURED];
        shouldRun = true;
      }
    }

    if (!shouldRun) return [];

    const issues = requiredStatusCodes
      .map((code) => validateResponse(responses, code))
      .filter((x): x is ValidationIssue => Boolean(x));

    if (issues.length === 0) return [];

    const level = context.rule.severity === 0 ? 'MUST' : 'SHOULD';
    const details = issues
      .map((issue) => `${issue.statusCode} (${issue.issues.join(', ')})`)
      .join('; ');

    return [
      {
        message: `Each operation ${level} define Problem Details for: ${requiredStatusCodes.join(
          ', ',
        )}. Issues: ${details}.`,
      },
    ];
  } catch (_err) {
    return [];
  }
};

export default runRule;
