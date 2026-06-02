/**
 * Unit tests for isApiInfoJsonSchema function.
 *
 * Note: These tests validate the function's schema validation logic directly.
 * When used with Vacuum, set `resolved: true` in the rule definition
 * so that $ref references are resolved before the function is called.
 */
import validateApiInfo from '../../functions/isApiInfoJsonSchema.js';

interface FunctionResult {
  message: string;
  path?: (string | number)[];
}

describe('is-api-info-json-schema', () => {
  it('passes with a fully valid ApiInfo schema', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: {
          type: 'string',
          pattern:
            '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
        },
        status: {
          type: 'string',
          'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
        },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('fails when name is missing or invalid', () => {
    const schema = { type: 'object', properties: { name: {} } };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'");
  });

  it('fails when version is missing semver pattern', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string', pattern: '^1.0$' },
        status: {
          type: 'string',
          'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
        },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'version' with type 'string' and pattern for semver.");
  });

  it('fails when status enum is invalid or missing', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string', pattern: 'valid-semver' },
        status: { type: 'string', 'x-extensible-enum': ['LIVE'] },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'status' with x-extensible-enum values: ALPHA, BETA, LIVE, DEPRECATED.");
  });

  it('fails when releaseDate is missing format', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string', pattern: 'valid' },
        status: {
          type: 'string',
          'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
        },
        releaseDate: { type: 'string' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'");
  });

  it('fails when documentation and releaseNotes formats are missing', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string', pattern: 'valid' },
        status: {
          type: 'string',
          'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
        },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string' },
        releaseNotes: { type: 'string' }
      }
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    const messages = result.map((r) => r.message);
    expect(messages).toContain("ApiInfo json must have property 'documentation' with type 'string' and format 'uri'");
    expect(messages).toContain("ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'");
  });

  it('returns empty array when schema is null', () => {
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(null);
    expect(result).toEqual([]);
  });

  it('fails when pattern is defined but invalid', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: {
          type: 'string',
          pattern: 'invalid-semver-pattern'
        },
        status: {
          type: 'string',
          'x-extensible-enum': ['ALPHA', 'BETA']
        },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'version' with type 'string' and pattern for semver.");
  });

  it('fails when x-extensible-enum is missing entirely', () => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: {
          type: 'string',
          pattern: 'valid'
        },
        status: { type: 'string' },
        releaseDate: { type: 'string', format: 'date' },
        documentation: { type: 'string', format: 'uri' },
        releaseNotes: { type: 'string', format: 'uri' }
      }
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have property 'status' with x-extensible-enum values: ALPHA, BETA, LIVE, DEPRECATED.");
  });

  it('fails if schema type is not object', () => {
    const schema = {
      type: 'string'
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.map((r) => r.message)).toContain("ApiInfo json must have type 'object'");
  });

  it('validates oneOf schemas', () => {
    const schema = {
      oneOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: {
              type: 'string',
              pattern:
                '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
            },
            status: {
              type: 'string',
              'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
            },
            releaseDate: { type: 'string', format: 'date' },
            documentation: { type: 'string', format: 'uri' },
            releaseNotes: { type: 'string', format: 'uri' }
          }
        }
      ]
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('validates anyOf schemas', () => {
    const schema = {
      anyOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: {
              type: 'string',
              pattern:
                '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
            },
            status: {
              type: 'string',
              'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
            },
            releaseDate: { type: 'string', format: 'date' },
            documentation: { type: 'string', format: 'uri' },
            releaseNotes: { type: 'string', format: 'uri' }
          }
        }
      ]
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('validates allOf schemas', () => {
    const schema = {
      allOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: {
              type: 'string',
              pattern:
                '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
            },
            status: {
              type: 'string',
              'x-extensible-enum': ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
            },
            releaseDate: { type: 'string', format: 'date' },
            documentation: { type: 'string', format: 'uri' },
            releaseNotes: { type: 'string', format: 'uri' }
          }
        }
      ]
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('handles schemas with invalid oneOf branches', () => {
    const schema = {
      oneOf: [
        {
          type: 'object',
          properties: {
            name: { type: 'number' }, // Invalid: should be string
          }
        }
      ]
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateApiInfo(schema);
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles errors during validation gracefully', () => {
    const proxy = new Proxy({}, {
      get: () => {
        throw new Error("Unexpected crash");
      }
    });

    // @ts-expect-error: intentionally testing error handling
    const result: FunctionResult[] = validateApiInfo(proxy);
    expect(result[0]).toBeDefined();
    expect(result[0].message).toBe('Unexpected crash');
  });
});
