import validateCommonErrorResponses from '../../functions/hasRequiredProblemDetailsErrorResponses.js';

type RulesetFunctionContext = {
  document?: {
    source?: string;
    data?: any;
    diagnostics?: any[];
    getRangeForJsonPath?: (...args: any[]) => any;
    trapAccess?: (...args: any[]) => any;
    [k: string]: any;
  };
  path?: Array<string | number>;
  rule?: any;
  documentInventory?: any;
  [k: string]: any;
};

const baseContext: RulesetFunctionContext = {
  document: {
    source: 'openapi.yaml',
    data: {
      security: [{ apiKey: [] }],
    },
    diagnostics: [],
    getRangeForJsonPath: () => void 0,
    trapAccess: () => ({} as any),
  },
  path: ['paths', '/pets', 'get'],
  rule: { severity: 0 } as any,
  documentInventory: {} as any,
};

describe('has-required-problem-details-error-responses', () => {
  it('passes when all required error responses are valid and security is enabled', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([]);
  });

  it('fails when 500 is missing example', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: {} } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message: 'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 500 (missing example).',
      },
    ]);
  });

  it('fails when 401 and 403 are missing and security is enabled', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message: 'Each operation MUST define Problem Details for: 401, 403. Issues: 401 (missing response); 403 (missing response).',
      },
    ]);
  });

  it('passes when security is disabled and 401/403 are missing', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: [],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result).toEqual([]);
  });

  it('fails when 400 response is completely missing', async () => {
    const targetVal = {
      responses: {
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message: 'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing response).',
      },
    ]);
  });

  it('fails when media type is present but missing application/problem+json', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/json': { examples: { example1: {} } } } },
        '404': { content: { 'application/json': { examples: { example1: {} } } } },
        '500': { content: { 'application/json': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing application/problem+json); 404 (missing application/problem+json); 500 (missing application/problem+json).',
      },
    ]);
  });

  it('fails when response has correct media type but no examples', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: {} } } },
        '404': { content: { 'application/problem+json': {} } },
        '500': { content: { 'application/problem+json': { examples: {} } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing example); 404 (missing example); 500 (missing example).',
      },
    ]);
  });

  it('fails when only application/problem+xml is present', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+xml': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+xml': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+xml': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing application/problem+json); 404 (missing application/problem+json); 500 (missing application/problem+json).',
      },
    ]);
  });

  it('skips validation when mode is not specified', async () => {
    const targetVal = {
      responses: {
        '400': {},
        '404': {},
        '500': {},
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, {}, baseContext) ?? [];
    expect(result).toEqual([]);
  });

  it('passes when root-inherit mode detects inherited global security', async () => {
    const inheritedContext: RulesetFunctionContext = {
      ...baseContext,
      path: ['paths', '/'],
      document: {
        ...baseContext.document,
        data: { security: [{ apiKey: [] }] },
      },
    };
    const targetVal = {
      responses: {
        '401': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '403': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: null,
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'root-inherit' }, inheritedContext) ?? [];
    expect(result).toEqual([]);
  });

  it('fails when a status code exists but response content is entirely missing', async () => {
    const targetVal = {
      responses: {
        '400': {},
        '404': {},
        '500': {},
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing application/problem+json); 404 (missing application/problem+json); 500 (missing application/problem+json).',
      },
    ]);
  });

  it('fails when a response object is completely missing for a secured status', async () => {
    const targetVal = {
      responses: {
        '400': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '404': { content: { 'application/problem+json': { examples: { example1: {} } } } },
        '500': { content: { 'application/problem+json': { examples: { example1: {} } } } },
      },
      security: [{}],
    };
    const result = await validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message: 'Each operation MUST define Problem Details for: 401, 403. Issues: 401 (missing response); 403 (missing response).',
      },
    ]);
  });

  it('fails gracefully when responses object is missing entirely', async () => {
    const targetVal = {
      // no "responses" key
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing response); 404 (missing response); 500 (missing response).',
      },
    ]);

  });

  it('fails gracefully when response structure is not an object', async () => {
    const targetVal = {
      responses: 'invalid-type' as any,
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing response); 404 (missing response); 500 (missing response).',
      },
    ]);

  });

  it('fails gracefully when content of a response is not an object', async () => {
    const targetVal = {
      responses: {
        '400': {
          content: 'invalid' as any,
        },
      },
      security: [{}],
    };

    const result = await validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext) ?? [];
    expect(result).toEqual([
      {
        message:
          'Each operation MUST define Problem Details for: 400, 404, 500. Issues: 400 (missing application/problem+json); 404 (missing response); 500 (missing response).',
      },
    ]);

  });



});
