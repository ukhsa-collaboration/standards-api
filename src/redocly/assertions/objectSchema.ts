import type { CustomFunction } from '../types';
import { asResults } from './utils';

const objectSchemaAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  if (typeof (value as any).$ref === 'string') {
    return [];
  }

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) => objectSchemaAssertion(schema, _options, baseLocation));
  }

  if (value.type !== 'object') {
    issues.push({ message: 'Schema type is not `object`' });
  }

  if (value.additionalProperties) {
    issues.push({ message: 'Schema is a map' });
  }

  return asResults(issues, baseLocation);
};

export default objectSchemaAssertion;
