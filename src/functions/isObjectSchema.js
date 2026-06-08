'use strict';

/**
 * Asserts that the given schema is a valid object schema.
 * @param {any} schema
 * @param {(string | number)[]} [basePath]
 * @returns {Array<{ message: string; path?: (string | number)[] }>}
 */
export const assertObjectSchema = (schema, basePath = []) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Schema type is not `object`", path: [...basePath, 'type'] });
  }

  if (schema.additionalProperties) {
    results.push({ message: "Schema is a map", path: [...basePath, 'additionalProperties'] });
  }

  return results;
};

/**
 * Validates if the target value is a valid object schema.
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {any} _context - The context.
 * @returns {Array<{ message: string; path?: (string | number)[] }>}
 */
export const runRule = (targetValue, _options, _context) => {
  try {
    if (targetValue === null || typeof targetValue !== "object") {
      return [
        {
          message: "Schema type is not `object`",
          path: Array.isArray(_context?.path) ? _context.path : [],
        },
      ];
    }

    return assertObjectSchema(targetValue, Array.isArray(_context?.path) ? _context.path : []);
  } catch (/** @type {any} */ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};

export default runRule;
