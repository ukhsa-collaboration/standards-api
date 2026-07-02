'use strict';

/*
Common Error Response Requirements (RFC 9457):

Every operation MUST include:
  - 400 Bad Request
  - 404 Not Found
  - 500 Internal Server Error
    → MUST use `application/problem+json`
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

const globalSecurityCache = new WeakMap<object, boolean>();

function isGlobalSecurityActive(documentData: unknown): boolean {
  if (!documentData || typeof documentData !== 'object') {
    return false;
  }
  const cached = globalSecurityCache.get(documentData);
  if (cached !== undefined) {
    return cached;
  }
  const data = documentData as { security?: unknown };
  const active = Array.isArray(data.security) && data.security.length > 0;
  globalSecurityCache.set(documentData, active);
  return active;
}

/**
 * Checks if a response defines application/problem+json and includes at least one example.
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
    const content = response?.content?.['application/problem+json'];

    if (!content) {
      issues.push('missing application/problem+json');
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
export const validateCommonErrorResponses: RulesetFunction<OperationObject, Options> = function (
  targetVal: OperationObject,
  opts: Options,
  context: RulesetFunctionContext,
) {
  const { responses = {}, security: opSecurity } = targetVal;
  const globalSecurityActive = isGlobalSecurityActive(context.document?.data);
  const mode = opts?.mode as string | undefined;
  const pathValue = context.path?.[1];
  const isRoot = pathValue === '/';
  const securityExplicitlyDisabled = Array.isArray(opSecurity) && opSecurity.length === 0;
  const securityExplicitlyActive = Array.isArray(opSecurity) && opSecurity.length > 0;

  let shouldRun = false;
  let requiredStatusCodes: readonly string[];

  switch (mode) {
    case 'critical':
      shouldRun = true;
      requiredStatusCodes = REQUIRED_ALWAYS;
      break;
    case 'explicit-security':
      shouldRun = securityExplicitlyActive || (!securityExplicitlyDisabled && !isRoot && globalSecurityActive);
      requiredStatusCodes = REQUIRED_IF_SECURED;
      break;
    case 'root-inherit':
      shouldRun = isRoot && (opSecurity === undefined || opSecurity === null) && globalSecurityActive;
      requiredStatusCodes = REQUIRED_IF_SECURED;
      break;
    default:
      throw new Error(`Unsupported security mode received: "${mode}"`);
  }

  if (!shouldRun) {
    return [];
  }

  const issues = requiredStatusCodes
    .map((code) => validateResponse(responses, code))
    .filter((issue): issue is ValidationIssue => issue !== null);

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
};

export const runRule = validateCommonErrorResponses;

export default validateCommonErrorResponses;
