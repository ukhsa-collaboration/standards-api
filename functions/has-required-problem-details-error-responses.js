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

const REQUIRED_ALWAYS = ['400', '404', '500'];
const REQUIRED_IF_SECURED = ['401', '403'];

/**
 * Checks if a response defines application/problem+json and includes at least one example.
 */
function validateResponse(responses, code) {
  const issues = [];
  const response = responses?.[code];
  if (!response) {
    issues.push('missing response');
  } else {
    const content = response.content?.['application/problem+json'];
    if (!content) {
      issues.push('missing application/problem+json');
    } else if (!content.examples || Object.keys(content.examples).length === 0) {
      issues.push('missing example');
    }
  }
  return issues.length ? { statusCode: code, issues } : null;
}

/**
 * Spectral custom function to validate common error responses on operations.
 */
export default function validateCommonErrorResponses(targetVal, opts, context) {
  const { responses = {}, security: opSecurity } = targetVal;
  const globalSecurity = context.document?.data?.security;
  const path = context.path?.[1] || '';
  const isRoot = path === '/';
  const mode = opts?.mode;

  let requiredStatusCodes = [];
  let shouldRun = false;

  if (mode === 'critical') {
    requiredStatusCodes = REQUIRED_ALWAYS;
    shouldRun = true;
  }

  if (mode === 'explicit-security') {
    if (Array.isArray(opSecurity) && opSecurity.length > 0) {
      requiredStatusCodes = REQUIRED_IF_SECURED;
      shouldRun = true;
    }
  }

  if (mode === 'root-inherit') {
    const isInheritingGlobalSecurity =
      isRoot && (opSecurity === undefined || opSecurity === null) &&
      Array.isArray(globalSecurity) && globalSecurity.length > 0;

    if (isInheritingGlobalSecurity) {
      requiredStatusCodes = REQUIRED_IF_SECURED;
      shouldRun = true;
    }
  }

  if (!shouldRun) return [];

  const issues = requiredStatusCodes
    .map(code => validateResponse(responses, code))
    .filter(Boolean);

  if (issues.length === 0) return [];

  const level = context.rule.severity === 0 ? 'MUST' : 'SHOULD';
  const details = issues
    .map(issue => `${issue.statusCode} (${issue.issues.join(', ')})`)
    .join('; ');

  return [
    {
      message: `Each operation ${level} define Problem Details for: ${requiredStatusCodes.join(', ')}. Issues: ${details}.`,
      path: [...context.path, 'responses'],
    },
  ];
}
