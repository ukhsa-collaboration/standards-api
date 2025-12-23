import type { AssertResult, CustomFunction } from '../types';
import { safeChild } from './utils';

const locationHeaderAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (!value || typeof value !== 'object') return [];
  const headers = value as Record<string, unknown>;
  const locationHeader = headers.Location;
  if (!locationHeader || typeof locationHeader !== 'object') {
    return [{ message: '201 responses SHOULD define a Location header', location: baseLocation }];
  }

  const inner = locationHeader as Record<string, any>;
  if (typeof inner.$ref === 'string') {
    return [];
  }
  const schema = inner.schema ?? {};
  const issues: AssertResult[] = [];

  if (inner.description === undefined) {
    issues.push({
      message: 'Location header should include a description',
      location: safeChild(baseLocation, 'Location'),
    });
  }

  if (schema.type !== 'string' || schema.format !== 'uri') {
    issues.push({
      message: 'Location header schema should be a string with uri format',
      location: safeChild(safeChild(baseLocation, 'Location'), 'schema'),
    });
  }

  if (schema.example === undefined) {
    issues.push({
      message: 'Location header schema should include an example',
      location: safeChild(safeChild(baseLocation, 'Location'), 'schema'),
    });
  }

  return issues;
};

export default locationHeaderAssertion;
