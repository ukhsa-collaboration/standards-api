import type { CustomFunction } from '../types';

const infoContainsSensitiveDataAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined || typeof value !== 'boolean') {
    return [
      {
        message: "Missing or wrong 'info.x-contains-sensitive-data', should be 'boolean'.",
        location: baseLocation,
      },
    ];
  }

  return [];
};

export default infoContainsSensitiveDataAssertion;
