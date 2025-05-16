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
 * Checks if a response defines the application/problem+json content type.
 */
function hasProblemJsonContent(response) {
  return Boolean(response?.content?.['application/problem+json']);
}

/**
 * Checks if a response includes at least one example.
 */
function hasExamples(response) {
  const content = response?.content?.['application/problem+json'];
  return Boolean(content?.examples && Object.keys(content.examples).length);
}

/**
 * Determines if security is enabled for the operation or globally.
 */
function isSecurityEnabled(operationSecurity, globalSecurity) {
  if (Array.isArray(operationSecurity)) return operationSecurity.length > 0;
  if (Array.isArray(globalSecurity)) return globalSecurity.length > 0;
  return false;
}

/**
 * Validates a single response for presence, media type, and examples.
 */
function validateResponseRequirement(responses, statusCode, requireExample) {
  const issues = [];
  const response = responses?.[statusCode];
  if (!response) {
    issues.push('missing response');
    return { statusCode, issues };
  }
  if (!hasProblemJsonContent(response)) {
    issues.push('missing application/problem+json');
  }
  if (requireExample && !hasExamples(response)) {
    issues.push('missing example');
  }
  return issues.length ? { statusCode, issues } : null;
}

/**
 * Spectral custom function to validate common error responses on operations.
 */
export default function validateCommonErrorResponses(targetVal, _opts, context) {
  const operation = targetVal;
  const responses = operation.responses || {};
  const globalSecurity = context.document?.data?.security;
  const operationSecurity = operation.security;
  const securityEnabled = isSecurityEnabled(operationSecurity, globalSecurity);

  const requiredStatusCodes = [
    ...REQUIRED_ALWAYS,
    ...(securityEnabled ? REQUIRED_IF_SECURED : [])
  ];

  const issues = requiredStatusCodes
    .map(code => validateResponseRequirement(responses, code, true))
    .filter(Boolean);

  if (issues.length > 0) {
    const details = issues
      .map(item => `${item.statusCode} (${item.issues.join(', ')})`)
      .join('; ');

    return [{
      message: `Each operation must define Problem Details for: ${requiredStatusCodes.join(', ')}. Issues: ${details}.`,
      path: [...context.path, 'responses'],
    }];
  }

  return [];
}
