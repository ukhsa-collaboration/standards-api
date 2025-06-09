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

import type {
  IFunction,
  IFunctionResult,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';

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
  security?: unknown[];
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
 * Spectral custom function to validate common error responses on operations.
 */
const validateCommonErrorResponses = function (
  targetVal: OperationObject,
  opts: Options,
  context: RulesetFunctionContext,
): IFunctionResult[] {
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
      path: [...context.path, 'responses'],
    },
  ];
};

export default validateCommonErrorResponses as IFunction;
