'use strict';

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * @typedef  {Object} CountResourceTypesOptions
 * @property {number} max - The maximum number of resource types allowed.
 */

/**
 * Extracts the resource type from a given path.
 * @param {string} path - The path to extract the resource type from.
 * @returns {string} The extracted resource type.
 */
const extractResourceTypeFromPath = (path) => {
  return path.split('/')[path.startsWith('/') ? 1 : 0];
};

/**
 * Counts the number of resource types in the target value.
 * @type {Core.RulesetFunction<object, CountResourceTypesOptions>}
 */
export default (targetValue, { max }) => {
  const paths = Object.keys(targetValue);
  if (paths.length <= max) return [];

  const resourcesTypes = new Set(paths.map(extractResourceTypeFromPath));
  if (resourcesTypes.size <= max) return [];

  return [
    {
      message: `More than ${max} resource types found`,
    },
  ];
};