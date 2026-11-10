'use strict';

interface ServerObject {
  url?: string;
}

interface OpenApiDocument {
  paths?: Record<string, unknown>;
  servers?: ServerObject[];
}

const PATH_VERSION_PREFIX = /^\/v[0-9]+(?:\/|$)/;
const VERSION_SEGMENT = /(^|\/)v[0-9]+(\/|$)/;

function hasPathVersionPrefix(value: string): boolean {
  return PATH_VERSION_PREFIX.test(value);
}

function hasVersionSegment(value: string | undefined): boolean {
  return typeof value === 'string' && VERSION_SEGMENT.test(value);
}

/**
 * Custom ruleset function enforcing URI (path-based) versioning.
 *
 * A path is compliant if its first segment is the version, or if a version
 * segment appears consistently across every `servers[].url` (e.g.
 * gateway-prefixed APIs where the version lives ahead of the paths defined in
 * the OpenAPI definition).
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
  const serversVersioned = servers.length > 0 && servers.every((server) => hasVersionSegment(server?.url));

  if (serversVersioned) return [];

  return Object.keys(paths)
    .filter((pathKey) => !hasPathVersionPrefix(pathKey))
    .map((pathKey) => ({
      message: 'Path must use URI versioning',
      path: ['paths', pathKey],
    }));
};

export default runRule;

