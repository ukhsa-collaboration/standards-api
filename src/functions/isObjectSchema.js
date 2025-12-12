'use strict';

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * Asserts that the given schema is a valid object schema.
 * @type {Core.RulesetFunction<any, null>}
 */
export const assertObjectSchema = (schema, _options, _context) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Schema type is not `object`" });
  }

  if (schema.additionalProperties) {
    results.push({ message: "Schema is a map" });
  }

  return results;
};

/**
 * Checks the schema for object compliance, including handling combined schemas.
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

  return assertObjectSchema(schema, _options, _context);
};

/**
 * Validates if the target value is a valid object schema.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {Core.RulesetFunctionContext} _context - The context.
 */
export const runRule = (targetValue, _options, _context) => {
  if(targetValue === null || typeof targetValue !== "object") {
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
