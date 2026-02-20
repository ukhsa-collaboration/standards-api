'use strict';

/*
Minimal required ApiInfo json schema:

type: object
properties:
  name:
    type: string
    description: The name of the API.
    example: Test Results API
  version:
    type: string
    pattern: '^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$'
    description: The version of the API.
    example: 1.0.0
  status:
    type: string
    description: The status of the API version.
    x-extensible-enum:
      - ALPHA
      - BETA
      - LIVE
      - DEPRECATED
    example: LIVE
  releaseDate:
    type: string
    format: date
    description: The release date of this API version.
    example: 2025-02-26
  documentation:
    type: string
    format: uri
    description: A URL to the API documentation.
    example: https://developer.ukhsa.gov.uk/namespace/product/v1/docs
  releaseNotes:
    type: string
    format: uri
    description: A URL to the API release notes.
    example: https://developer.ukhsa.gov.uk/namespace/product/v1/releaseNotes
*/

/**
 * Asserts that the given schema is a valid ApiInfo JSON schema.
 * @param {any} schema
 * @returns {Array<{ message: string }>}
 */
export const assertApiInfoSchema = (schema) => {

  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "ApiInfo json must have type 'object'" });
  }

  const name = (schema.properties || {}).name || {};
  if (name.type !== 'string') {
    results.push({ message: "ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'" });
  }

  const version = (schema.properties || {}).version || {};
  const pattern = "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"

  if (version.type !== 'string' || version.pattern !== pattern) {
    results.push({ message: "ApiInfo json must have property 'version' with type 'string' and pattern for semver." });
  }

  const status = (schema.properties || {}).status || {};
  const requiredStatus = ["ALPHA", "BETA", "LIVE", "DEPRECATED"];
  if (status.type !== 'string' || !status["x-extensible-enum"] || !requiredStatus.every((value) => status["x-extensible-enum"].includes(value))) {
    results.push({ message: "ApiInfo json must have property 'status' with x-extensible-enum values: ALPHA, BETA, LIVE, DEPRECATED." });
  }

  const releaseDate = (schema.properties || {}).releaseDate || {};
  if (releaseDate.type !== 'string' || releaseDate.format !== 'date') {
    results.push({ message: "ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'" });
  }

  const documentation = (schema.properties || {}).documentation || {};
  if (documentation.type !== 'string' || documentation.format !== 'uri') {
    results.push({ message: "ApiInfo json must have property 'documentation' with type 'string' and format 'uri'" });
  }

  const releaseNotes = (schema.properties || {}).releaseNotes || {};
  if (releaseNotes.type !== 'string' || releaseNotes.format !== 'uri') {
    results.push({ message: "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'" });
  }

  return results;
};

/** @type {(schema: any, _options: any, _context: any, resolveRef: (schema: any) => any) => any} */
const check = (schema, _options, _context, resolveRef) => {
  const resolvedSchema = resolveRef(schema);
  const combinedSchemas = [
    ...(resolvedSchema?.anyOf ?? []),
    ...(resolvedSchema?.oneOf ?? []),
    ...(resolvedSchema?.allOf ?? []),
  ].map(resolveRef);

  if (combinedSchemas.length > 0) {
    const aggregated = [];
    for (const subSchema of combinedSchemas) {
      const res = check(subSchema, _options, _context, resolveRef);
      if (Array.isArray(res)) {
        aggregated.push(...res);
      }
    }
    return aggregated;
  }

  return assertApiInfoSchema(resolvedSchema);
};

/**
 * Validates if the target value is a valid ApiInfo JSON schema.
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {any} _context - The context.
 * @returns {Array<{ message: string; path?: (string | number)[] }>}
 */
export const runRule = (targetValue, _options, _context) => {
  const schema = targetValue?.schema ?? targetValue;

  if (schema === null || typeof schema !== "object") {
    return [];
  }

  try {
    /** @param {any} schemaNode */
    const resolveRef = (schemaNode) => schemaNode;
    return check(schema, _options, _context, resolveRef);
  } catch (/** @type {any} */ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};

export default runRule;
