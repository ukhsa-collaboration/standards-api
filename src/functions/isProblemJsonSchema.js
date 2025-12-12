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
 * @import Core from "@stoplight/spectral-core"
 */


/**
 * Asserts that the given schema is a valid Problem JSON schema.
 * @type {Core.RulesetFunction<any, null>}
 */
export const assertProblemSchema = (schema, _options, _context) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Problem json must have type 'object'" });
  }

  const type = (schema.properties || {}).type || {};
  if (type.type !== 'string' || type.format !== 'uri-reference') {
    results.push({ message: "Problem json must have property 'type' with type 'string' and format 'uri-reference'" });
  }

  const title = (schema.properties || {}).title || {};
  if (title.type !== 'string') {
    results.push({ message: "Problem json must have property 'title' with type 'string'" });
  }

  const status = (schema.properties || {}).status || {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    results.push({ message: "Problem json must have property 'status' with type 'integer' and format 'in32'" });
  }

  const detail = (schema.properties || {}).detail || {};
  if (detail.type !== 'string') {
    results.push({ message: "Problem json must have property 'detail' with type 'string'" });
  }

  const instance = (schema.properties || {}).instance || {};
  if (instance.type !== 'string') {
    results.push({ message: "Problem json must have property 'instance' with type 'string'" });
  }

  return results;
};

/**
 * Checks the schema for problem compliance, including handling combined schemas.
 * @type {Core.RulesetFunction<any, null>}
 */
const check = (schema, _options, _context) => {
  const combinedSchemas = [...(schema?.anyOf ?? []), ...(schema?.oneOf ?? []), ...(schema?.allOf ?? [])];

  if (combinedSchemas.length > 0) {
    const aggregated = [];
    for (const subSchema of combinedSchemas) {
      const res = check(subSchema, _options, _context);
      if (Array.isArray(res)) {
        aggregated.push(...res);
      }
    }
    return aggregated;
  }
  return assertProblemSchema(schema, _options, _context);
};

/**
 * Validates if the target value is a valid Problem JSON schema.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {Core.RulesetFunctionContext} _context - The context.
 */
export const runRule = (targetValue, _options, _context) => {
  if (targetValue === null || typeof targetValue !== "object") {
    return [];
  }

  try {
    return check(targetValue, _options, _context);
  } catch (/** @type {any} */ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};

export default runRule;
