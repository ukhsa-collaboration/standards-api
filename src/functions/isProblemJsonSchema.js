'use strict';

/*
Minimal required problem json schema:

type: object
properties:
  type:
    type: string
    format: uri
  title:
    type: string
  status:
    type: integer
    format: int32
  detail:
    type: string
  instance:
    type: string
*/

/**
 * Asserts that the given schema is a valid Problem JSON schema.
 * @param {any} schema
 * @param {(string | number)[]} [basePath]
 * @returns {Array<{ message: string; path?: (string | number)[] }>}
 */
export const assertProblemSchema = (schema, basePath = []) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Problem json must have type 'object'", path: [...basePath, 'type'] });
  }

  const type = (schema.properties || {}).type || {};
  if (type.type !== 'string' || type.format !== 'uri-reference') {
    results.push({ message: "Problem json must have property 'type' with type 'string' and format 'uri-reference'", path: [...basePath, 'properties', 'type'] });
  }

  const title = (schema.properties || {}).title || {};
  if (title.type !== 'string') {
    results.push({ message: "Problem json must have property 'title' with type 'string'", path: [...basePath, 'properties', 'title'] });
  }

  const status = (schema.properties || {}).status || {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    results.push({ message: "Problem json must have property 'status' with type 'integer' and format 'int32'", path: [...basePath, 'properties', 'status'] });
  }

  const detail = (schema.properties || {}).detail || {};
  if (detail.type !== 'string') {
    results.push({ message: "Problem json must have property 'detail' with type 'string'", path: [...basePath, 'properties', 'detail'] });
  }

  const instance = (schema.properties || {}).instance || {};
  if (instance.type !== 'string') {
    results.push({ message: "Problem json must have property 'instance' with type 'string'", path: [...basePath, 'properties', 'instance'] });
  }

  return results;
};

/**
 * Validates if the target value is a valid Problem JSON schema.
 * @param {any} targetValue - The value to validate (content entry with schema property, or raw schema).
 * @param {null} _options - Additional options (not used).
 * @param {any} _context - The context.
 * @returns {Array<{ message: string; path?: (string | number)[] }>}
 */
export const runRule = (targetValue, _options, _context) => {
  try {
    // Extract schema from content entry if present, otherwise use targetValue directly
    // This handles both: content['application/problem+json'] entries (with .schema)
    // and direct schema objects
    const schema = targetValue?.schema ?? targetValue;

    if (schema === null || typeof schema !== "object") {
      return [
        {
          message: "Problem json must have type 'object'",
          path: Array.isArray(_context?.path) ? _context.path : [],
        },
      ];
    }

    return assertProblemSchema(schema, Array.isArray(_context?.path) ? _context.path : []);
  } catch (/** @type {any} */ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};

export default runRule;
