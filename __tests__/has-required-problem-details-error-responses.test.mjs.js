import validateCommonErrorResponses from '../functions/has-required-problem-details-error-responses.js';

const baseContext = {
  path: ['paths', '/pets', 'get'],
  document: {
    data: {
      security: [{ bearerAuth: [] }]
    }
  },
  rule: {
    severity: 0
  }
};

describe('has-required-problem-details-error-responses', () => {
  it('passes when all required error responses are valid and security is enabled', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': exampleResponse(),
        '401': exampleResponse(),
        '403': exampleResponse()
      },
      security: [{ bearerAuth: [] }]
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext);
    expect(result).toEqual([]);
  });

  it('fails when 500 is missing example', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': {
          content: {
            'application/problem+json': {
              examples: {}  // ❌ Empty examples
            }
          }
        }
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext);
    expect(result.some(r => r.message.includes('500'))).toBe(true);
  });

  it('fails when 401 and 403 are missing and security is enabled', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': exampleResponse()
      },
      security: [{ bearerAuth: [] }]
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext);
    expect(result.some(r => r.message.includes('401'))).toBe(true);
    expect(result.some(r => r.message.includes('403'))).toBe(true);
  });

  it('passes when security is disabled and 401/403 are missing', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': exampleResponse()
      },
      security: []  // operation disables security
    };

    const contextWithNoGlobalSecurity = {
      ...baseContext,
      document: {
        data: {
          security: []  // no global security
        }
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, contextWithNoGlobalSecurity);
    expect(result).toEqual([]);
  });

  it('fails when 400 response is completely missing', () => {
    const targetVal = {
      responses: {
        '404': exampleResponse(),
        '500': exampleResponse()
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext);
    expect(result.some(r => r.message.includes('400'))).toBe(true);
  });

  it('fails when a response object is completely missing for a secured status', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': exampleResponse(),
        '403': exampleResponse()  // 401 missing
      },
      security: [{ bearerAuth: [] }]
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'explicit-security' }, baseContext);
    expect(result.some(r => r.message.includes('401'))).toBe(true);
  });

  it('passes when XML content is used with examples', () => {
    const targetVal = {
      responses: {
        '400': xmlResponseWithExample(),
        '404': xmlResponseWithExample(),
        '500': xmlResponseWithExample()
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext);
    expect(result).toEqual([]);
  });

  it('fails when application/problem+json or +xml are both missing', () => {
    const targetVal = {
      responses: {
        '400': {
          content: {
            'application/json': {}  // ❌ not accepted
          }
        },
        '404': {
          content: {
            'application/json': {}
          }
        },
        '500': {
          content: {
            'application/json': {}
          }
        }
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'critical' }, baseContext);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].message).toMatch(/missing application\/problem\+json or application\/problem\+xml/);
  });

  it('skips check entirely if mode is unknown', () => {
    const targetVal = {
      responses: {
        '400': exampleResponse(),
        '404': exampleResponse(),
        '500': exampleResponse()
      }
    };

    const result = validateCommonErrorResponses(targetVal, { mode: 'noop' }, baseContext);
    expect(result).toEqual([]);
  });
});

function exampleResponse() {
  return {
    content: {
      'application/problem+json': {
        examples: {
          sample: {
            summary: 'example'
          }
        }
      }
    }
  };
}

function xmlResponseWithExample() {
  return {
    content: {
      'application/problem+xml': {
        examples: {
          xmlExample: {
            value: '<problem><type>example</type></problem>'
          }
        }
      }
    }
  };
}
