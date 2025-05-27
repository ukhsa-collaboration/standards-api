import validateCommonErrorResponses from '../functions/has-required-problem-details-error-responses.js';

const mockResponse = (includeExample = true) => ({
  content: {
    'application/problem+json': {
      ...(includeExample ? { examples: { sample: {} } } : {})
    }
  }
});

describe('has-required-problem-details-error-responses', () => {
  const baseContext = {
    path: ['paths', '/example', 'get'],
    document: {
      data: {
        security: [{}],
      }
    }
  };

  it('passes when all required error responses are valid and security is enabled', () => {
    const targetVal = {
      responses: {
        '400': mockResponse(),
        '404': mockResponse(),
        '500': mockResponse(),
        '401': mockResponse(),
        '403': mockResponse(),
      },
      security: [{}]
    };
    const result = validateCommonErrorResponses(targetVal, {}, baseContext);
    expect(result).toEqual([]);
  });

  it('fails when 500 is missing example', () => {
    const targetVal = {
      responses: {
        '400': mockResponse(),
        '404': mockResponse(),
        '500': mockResponse(false),
        '401': mockResponse(),
        '403': mockResponse(),
      },
      security: [{}]
    };
    const result = validateCommonErrorResponses(targetVal, {}, baseContext);
    expect(result.some(r => r.message.includes('500'))).toBe(true);
  });

  it('fails when 401 and 403 are missing and security is enabled', () => {
    const targetVal = {
      responses: {
        '400': mockResponse(),
        '404': mockResponse(),
        '500': mockResponse()
      }
    };
    const result = validateCommonErrorResponses(targetVal, {}, baseContext);
    expect(result.some(r => r.message.includes('401'))).toBe(true);
    expect(result.some(r => r.message.includes('403'))).toBe(true);
  });

  it('passes when security is disabled and 401/403 are missing', () => {
    const targetVal = {
      responses: {
        '400': mockResponse(),
        '404': mockResponse(),
        '500': mockResponse()
      },
      security: []
    };
    const context = {
      ...baseContext,
      document: {
        data: {
          security: null
        }
      }
    };
    const result = validateCommonErrorResponses(targetVal, {}, context);
    expect(result).toEqual([]);
  });

  it('fails when 400 response is completely missing', () => {
    const targetVal = {
      responses: {
        '404': mockResponse(),
        '500': mockResponse(),
        '401': mockResponse(),
        '403': mockResponse()
      }
    };
    const result = validateCommonErrorResponses(targetVal, {}, baseContext);
    expect(result.some(r => r.message.includes('400'))).toBe(true);
  });

  it('fails when a response object is completely missing for a secured status', () => {
    const targetVal = {
      responses: {
        '400': mockResponse(),
        '404': mockResponse(),
        '500': mockResponse(),
        '403': mockResponse() // '401' is missing
      },
      security: [{}]
    };
    const result = validateCommonErrorResponses(targetVal, {}, baseContext);
    expect(result.some(r => r.message.includes('401'))).toBe(true);
  });
});
