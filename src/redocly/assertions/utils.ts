import type { Location } from '@redocly/openapi-core';

import type { CustomFunction } from '../types';

export const getLocation = (ctx: any): Location => ctx?.location ?? ctx;

export const buildAssertCustomFunction =
  (fn: CustomFunction): CustomFunction =>
  (value, options, ctx) =>
    fn.call(null, value, options, getLocation(ctx));

export const asResults = (issues: { message: string; location?: Location }[], baseLocation: Location) =>
  issues.map((issue) => ({
    message: issue.message,
    location: issue.location ?? baseLocation,
  }));

export const safeChild = (location: any, key: string | number | (string | number)[]) => {
  if (location && typeof location.child === 'function') {
    return location.child(key);
  }
  return location;
};
