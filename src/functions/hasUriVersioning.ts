'use strict';

interface ServerObject {
  url?: string;
}

interface OpenApiDocument {
  paths?: Record<string, unknown>;
  servers?: ServerObject[];
}

const PATH_VERSION = /^((?:\/[^/]+)*)\/v[0-9]+(\/.+)?$/;
const SERVER_VERSION_SUFFIX = /(?:^|\/)v[0-9]+\/?$/;

interface PathVersion {
  pathKey: string;
  prefix?: string;
  hasResource: boolean;
}

function parsePathVersion(pathKey: string): PathVersion {
  const match = PATH_VERSION.exec(pathKey);
  if (!match) return { pathKey, hasResource: false };

  const [, prefix, resource] = match;
  return {
    pathKey,
    prefix,
    hasResource: resource !== undefined,
  };
}

function getMostCommonResourcePrefix(pathVersions: PathVersion[]): string | undefined {
  const counts = new Map<string, number>();

  for (const { prefix, hasResource } of pathVersions) {
    if (prefix === undefined || !hasResource) continue;
    counts.set(prefix, (counts.get(prefix) ?? 0) + 1);
  }

  let expectedPrefix: string | undefined;
  let highestCount = 0;

  for (const [prefix, count] of counts) {
    if (count > highestCount) {
      expectedPrefix = prefix;
      highestCount = count;
    }
  }

  return expectedPrefix;
}

function serverEndsWithVersion(value: string | undefined): boolean {
  return typeof value === 'string' && SERVER_VERSION_SUFFIX.test(value);
}

/**
 * Custom ruleset function enforcing URI (path-based) versioning.
 *
 * A path is compliant if it contains an exact `vN` segment before its resource
 * and every path uses the same prefix before that version. A bare version root
 * such as `/v1` is also valid. Alternatively, every `servers[].url` may end
 * with an exact `vN` segment.
 *
 * @param targetVal - The root OpenAPI document.
 * @returns One violation per path missing a version segment, unless the
 *          servers already provide a consistent version prefix.
 */
export const runRule = (
  targetVal: OpenApiDocument,
): Array<{ message: string; path?: (string | number)[] }> => {
  if (!targetVal || typeof targetVal !== 'object') return [];

  const paths = targetVal.paths;
  if (!paths || typeof paths !== 'object') return [];

  const servers = Array.isArray(targetVal.servers) ? targetVal.servers : [];
  const serversVersioned = servers.length > 0 && servers.every((server) => serverEndsWithVersion(server?.url));

  if (serversVersioned) return [];

  const pathVersions = Object.keys(paths).map(parsePathVersion);
  const expectedPrefix = getMostCommonResourcePrefix(pathVersions);

  return pathVersions
    .filter(({ prefix, hasResource }) => {
      if (prefix === undefined) return true;
      if (hasResource) return prefix !== expectedPrefix;
      if (prefix === '') return expectedPrefix !== undefined && expectedPrefix !== '';
      return prefix !== expectedPrefix;
    })
    .map(({ pathKey }) => ({
      message: `Path "${pathKey}" must place an exact major version before the resource and use the same base prefix as every other path`,
      path: ['paths', pathKey],
    }));
};

export default runRule;

