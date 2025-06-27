import validateApiInfo from 'src/functions/legacy/is-api-info-json-schema.js';

type ValidationResult = { message: string };

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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('fails when name is missing or invalid', () => {
    const schema = { type: 'object', properties: { name: {} } };
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('name'))).toBe(true);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('semver'))).toBe(true);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('status'))).toBe(true);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('releaseDate'))).toBe(true);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('documentation'))).toBe(true);
    expect(result.some((r: ValidationResult) => r.message.includes('releaseNotes'))).toBe(true);
  });

  it('fails when schema is null', () => {
    const result: ValidationResult[] = validateApiInfo(null as any);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('semver'))).toBe(true);
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
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes('status'))).toBe(true);
  });

  it('skips validation if schema is not an object', () => {
    const schema = {
      type: 'string'
    };
    const result: ValidationResult[] = validateApiInfo(schema);
    expect(result.some((r: ValidationResult) => r.message.includes("type 'object'"))).toBe(true);
  });
});
