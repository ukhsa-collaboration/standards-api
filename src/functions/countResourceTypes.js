'use strict';

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * @typedef  {Object} CountResourceTypesOptions
 * @property {number} [max] - The maximum number of resource types allowed.
 */

/**
 * Extracts the resource type from a given path.
 * @param {string} path - The path to extract the resource type from.
 * @returns {string} The extracted resource type.
 */
export const extractResourceTypeFromPath = (path) => {
  if (typeof path !== 'string') return '';
  const parts = path.split('/');
  return path.startsWith('/') ? parts[1] ?? '' : parts[0] ?? '';
};

/**
 * Counts the number of resource types in the target value.
 * @type {Core.RulesetFunction<object, CountResourceTypesOptions>}
 * @param {object} targetValue
 * @param {CountResourceTypesOptions} [options]
 */
export const runRule = (targetValue, options = {}) => {
  if (!targetValue || typeof targetValue !== 'object') return [];

  const { max } = options;

  /** @type {number} */
  const limit = Number.isFinite(max) ? Number(max) : Infinity;
  const paths = Object.keys(targetValue);
  if (!paths.length || paths.length <= limit) return [];

  const resourceTypes = new Set(paths.map(extractResourceTypeFromPath).filter(Boolean));
  if (resourceTypes.size <= limit) return [];

  return [
    {
      message: `More than ${limit} resource types found`,
    },
  ];
};

export default runRule;
