import type { CustomFunction } from '../types';

const countResourceTypesAssertion: CustomFunction = (value, options, baseLocation) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];

  const { max } = (options as { max?: number }) ?? {};
  if (typeof max !== 'number') return [];

  const paths = Object.keys(value);
  if (paths.length <= max) return [];

  const resourceTypes = new Set(paths.map((path) => path.split('/')[path.startsWith('/') ? 1 : 0]).filter(Boolean));

  if (resourceTypes.size <= max) return [];

  return [
    {
      message: `More than ${max} resource types found`,
      location: baseLocation,
    },
  ];
};

export default countResourceTypesAssertion;
