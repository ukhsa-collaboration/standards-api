'use strict';

interface ServerObject {
  url?: string;
}

interface OpenApiDocument {
  paths?: Record<string, unknown>;
  servers?: ServerObject[];
}

// Matches a `vN` segment anywhere in a path or server URL, e.g. `/v1`, `/v1/`, or a bare `v1`.
const VERSION_SEGMENT = /(^|\/)v[0-9]+(\/|$)/;

function hasVersionSegment(value: string | undefined): boolean {
  return typeof value === 'string' && VERSION_SEGMENT.test(value);
}

/**
 * Custom ruleset function enforcing URI (path-based) versioning.
 *
 * A path is compliant if the version segment appears in the path itself, or
 * consistently across every `servers[].url` (e.g. gateway-prefixed APIs where
 * the version lives ahead of the paths defined in the OpenAPI definition).
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
    .filter((pathKey) => !hasVersionSegment(pathKey))
    .map((pathKey) => ({
      message: 'Path must use URI versioning',
      path: ['paths', pathKey],
    }));
};

export default runRule;

