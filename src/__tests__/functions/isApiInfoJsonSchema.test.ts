import { type IFunctionResult } from '@stoplight/spectral-core';
import validateApiInfo from '../../functions/isApiInfoJsonSchema.js';

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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result).toEqual([]);
  });

  it('fails when name is missing or invalid', () => {
    const schema = { type: 'object', properties: { name: {} } };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('name'))).toBe(true);
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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('semver'))).toBe(true);
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
    const result = validateApiInfo(schema) as IFunctionResult[];
    expect(result.some((r: IFunctionResult) => r.message.includes('status'))).toBe(true);
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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('releaseDate'))).toBe(true);
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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('documentation'))).toBe(true);
    expect(result.some((r: IFunctionResult) => r.message.includes('releaseNotes'))).toBe(true);
  });

  it('fails when schema is null', () => {
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: IFunctionResult[] = validateApiInfo(null as any);
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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('semver'))).toBe(true);
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
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes('status'))).toBe(true);
  });

  it('skips validation if schema is not an object', () => {
    const schema = {
      type: 'string'
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: IFunctionResult[] = validateApiInfo(schema);
    expect(result.some((r: IFunctionResult) => r.message.includes("type 'object'"))).toBe(true);
  });

  it('resolves local $ref before validating', () => {
    const document = {
      components: {
        schemas: {
          ApiInfo: {
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
        }
      },
      paths: {
        '/': {
          get: {
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/ApiInfo'
                    }
                  }
                }
              }
            }
          }
        }
      }
    };

    const target = document.paths['/'].get.responses['200'].content['application/json'];
    // @ts-expect-error context typing not required for test
    const result: IFunctionResult[] = validateApiInfo(target, null, { document: { data: document } });
    expect(result).toEqual([]);
  });

  it('resolves $ref using specInfo bytes when document is absent', () => {
    const yaml = `
openapi: 3.0.4
paths:
  /:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiInfo'
components:
  schemas:
    ApiInfo:
      type: object
      properties:
        name:
          type: string
        version:
          type: string
          pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
        status:
          type: string
          x-extensible-enum: ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED']
        releaseDate:
          type: string
          format: date
        documentation:
          type: string
          format: uri
        releaseNotes:
          type: string
          format: uri
      required:
        - name
        - version
        - status
        - releaseDate
        - documentation
        - releaseNotes
`;

    const target = {
      schema: { $ref: '#/components/schemas/ApiInfo' }
    };

    const ctx = {
      // @ts-expect-error: the rule consumes `bytes` directly from the Spectral/Vacuum specInfo.
      specInfo: { bytes: Buffer.from(yaml, 'utf8') }
    };

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: IFunctionResult[] = validateApiInfo(target, null, ctx);
    expect(result).toEqual([]);
  });
});
