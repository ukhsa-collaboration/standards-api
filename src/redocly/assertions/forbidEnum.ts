import type { CustomFunction } from '../types';

const forbidEnumAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined) return [];
  return [
    {
      message: 'Should use x-extensible-enum instead of enum',
      location: baseLocation,
    },
  ];
};

export default forbidEnumAssertion;
