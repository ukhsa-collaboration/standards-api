import type { CustomFunction } from '../types';
import { asResults } from './utils';

const apiInfoSchemaAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) => apiInfoSchemaAssertion(schema, _options, baseLocation));
  }

  if (value.type !== 'object') {
    issues.push({ message: "ApiInfo json must have type 'object'" });
  }

  const name = (value.properties ?? {}).name ?? {};
  if (name.type !== 'string') {
    issues.push({
      message: "ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'",
    });
  }

  const version = (value.properties ?? {}).version ?? {};
  const pattern =
    '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';
  if (version.type !== 'string' || version.pattern !== pattern) {
    issues.push({
      message: "ApiInfo json must have property 'version' with type 'string' and pattern for semver.",
    });
  }

  const status = (value.properties ?? {}).status ?? {};
  const requiredStatus = ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED'];
  if (
    status.type !== 'string' ||
    !status['x-extensible-enum'] ||
    !requiredStatus.every((item) => status['x-extensible-enum'].includes(item))
  ) {
    issues.push({
      message: "ApiInfo json must have property 'status' with x-extensible-enum values: ALPHA, BETA, DEPRECATED, LIVE.",
    });
  }

  const releaseDate = (value.properties ?? {}).releaseDate ?? {};
  if (releaseDate.type !== 'string' || releaseDate.format !== 'date') {
    issues.push({
      message: "ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'",
    });
  }

  const documentation = (value.properties ?? {}).documentation ?? {};
  if (documentation.type !== 'string' || documentation.format !== 'uri') {
    issues.push({
      message: "ApiInfo json must have property 'documentation' with type 'string' and format 'uri'",
    });
  }

  const releaseNotes = (value.properties ?? {}).releaseNotes ?? {};
  if (releaseNotes.type !== 'string' || releaseNotes.format !== 'uri') {
    issues.push({
      message: "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'",
    });
  }

  return asResults(issues, baseLocation);
};

export default apiInfoSchemaAssertion;
