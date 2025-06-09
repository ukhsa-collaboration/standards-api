import validateCommonErrorResponses from '../functions/has-required-problem-details-error-responses';
import type { IFunctionResult, RulesetFunctionContext } from '@stoplight/spectral-core';

const baseContext: RulesetFunctionContext = {
  document: {
    source: 'openapi.yaml',
    data: {
      security: [
        {
          apiKey: [],
        },
      ],
    },
    diagnostics: [],
    getRangeForJsonPath: () => void 0,
    trapAccess: () => ({} as any),
  },
  path: ['paths', '/pets', 'get'],
  rule: {
    severity: 0,
  } as any, // minimal mock; only severity is used
  documentInventory: {} as any, 
};

describe('has-required-problem-details-error-responses', () => {
  it('passes when all required error responses are valid and security is enabled', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([]);
  });

  it('fails when 500 is missing example', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {},
            },
          },
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result.some((r: IFunctionResult) => r.message.includes('500'))).toBe(true);
  });

  it('fails when 401 and 403 are missing and security is enabled', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result.some((r: IFunctionResult) => r.message.includes('401'))).toBe(true);
    expect(result.some((r: IFunctionResult) => r.message.includes('403'))).toBe(true);
  });

  it('passes when security is disabled and 401/403 are missing', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
      },
      security: [],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result).toEqual([]);
  });

  it('fails when 400 response is completely missing', async () => {
    const targetVal = {
      responses: {
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result.some((r: IFunctionResult) => r.message.includes('400'))).toBe(true);
  });

  it('fails when a response object is completely missing for a secured status', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '404': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
        '500': {
          content: {
            'application/problem+json': {
              examples: {
                example1: {},
              },
            },
          },
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result.some((r: IFunctionResult) => r.message.includes('401'))).toBe(true);
  });
});
