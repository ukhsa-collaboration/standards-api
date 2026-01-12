'use strict';

/**
 * Asserts that the given schema is a valid object schema.
 * @param {any} schema
 * @param {any} _options
 * @param {any} _context
 * @returns {Array<{ message: string }>}
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
 * @param {any} schema
 * @param {any} _options
 * @param {any} _context
 * @returns {Array<{ message: string }>}
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
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {any} _context - The context.
 * @returns {Array<{ message: string }>}
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
