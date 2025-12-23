import type { CustomFunction } from '../types';
import { asResults } from './utils';

const problemJsonAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) => problemJsonAssertion(schema, _options, baseLocation));
  }

  if (value.type !== 'object') {
    issues.push({ message: "Problem json must have type 'object'" });
  }

  const type = (value.properties ?? {}).type ?? {};
  if (type.type !== 'string' || type.format !== 'uri-reference') {
    issues.push({
      message: "Problem json must have property 'type' with type 'string' and format 'uri-reference'",
    });
  }

  const title = (value.properties ?? {}).title ?? {};
  if (title.type !== 'string') {
    issues.push({ message: "Problem json must have property 'title' with type 'string'" });
  }

  const status = (value.properties ?? {}).status ?? {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    issues.push({
      message: "Problem json must have property 'status' with type 'integer' and format 'in32'",
    });
  }

  const detail = (value.properties ?? {}).detail ?? {};
  if (detail.type !== 'string') {
    issues.push({ message: "Problem json must have property 'detail' with type 'string'" });
  }

  const instance = (value.properties ?? {}).instance ?? {};
  if (instance.type !== 'string') {
    issues.push({ message: "Problem json must have property 'instance' with type 'string'" });
  }

  return asResults(issues, baseLocation);
};

export default problemJsonAssertion;
