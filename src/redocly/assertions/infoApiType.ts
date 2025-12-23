import type { CustomFunction } from '../types';

const infoApiTypeAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined) {
    return [
      {
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
        location: baseLocation,
      },
    ];
  }

  if (value !== 'standard' && value !== 'pygeoapi') {
    return [
      {
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
        location: baseLocation,
      },
    ];
  }

  return [];
};

export default infoApiTypeAssertion;
