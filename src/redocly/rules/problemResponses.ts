import type { AssertResult } from '../types';

type ProblemDetailMode = 'critical' | 'explicit-security';

const problemResponseRule = (mode: ProblemDetailMode): any => {
  const state: { globalSecurity?: unknown[] } = {};

  const resolveResponse = (response: any, ctx: any) => {
    if (response && typeof response.$ref === 'string' && typeof ctx.resolve === 'function') {
      const resolved = ctx.resolve(response);
      if (resolved?.node) return resolved.node;
    }
    return response;
  };

  return {
    Root(root: any) {
      if (Array.isArray((root as any).security)) {
        state.globalSecurity = (root as any).security;
      }
    },
    Operation(operation: any, ctx: any) {
      const responses = operation.responses ?? {};
      const globalSecurityActive = Array.isArray(state.globalSecurity) && state.globalSecurity.length > 0;
      const opSecurity = operation.security;

      const requiredAlways = ['400', '404', '500'];
      const requiredIfSecured = ['401', '403'];
      const required: string[] = [];

      if (mode === 'critical') {
        required.push(...requiredAlways);
      }

      if (mode === 'explicit-security') {
        const explicitDisable = Array.isArray(opSecurity) && opSecurity.length === 0;
        const explicitActive = Array.isArray(opSecurity) && opSecurity.length > 0;
        if (explicitActive || (!explicitDisable && globalSecurityActive)) {
          required.push(...requiredIfSecured);
        }
      }

      if (required.length === 0) return;

      const problems: AssertResult[] = [];
      for (const code of required) {
        const response = resolveResponse(responses[code], ctx);
        if (!response) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing response).`,
            location: ctx.location.child(['responses']),
          });
          continue;
        }

        const content =
          response?.content?.['application/problem+json'] || response?.content?.['application/problem+xml'];

        if (!content) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing application/problem+json or application/problem+xml).`,
            location: ctx.location.child(['responses', code]),
          });
          continue;
        }

        if (!content.examples || Object.keys(content.examples).length === 0) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing example).`,
            location: ctx.location.child(['responses', code, 'content']),
          });
        }
      }

      problems.forEach((problem) =>
        ctx.report({
          ...problem,
        }),
      );
    },
  };
};

export { problemResponseRule };
