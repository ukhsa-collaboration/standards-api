import validateProblemSchema from '../functions/legacy/is-problem-json-schema.js';

interface ValidationResult {
  message: string;
}

describe('is-problem-json-schema', () => {
  it('passes with a fully valid Problem schema', () => {
    const schema = {
      type: 'object',
      properties: {
        type: { type: 'string', format: 'uri-reference' },
        title: { type: 'string' },
        status: { type: 'integer', format: 'int32' },
        detail: { type: 'string' },
        instance: { type: 'string' }
      }
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result).toEqual([]);
  });

  it('fails when top-level type is not object', () => {
    const schema = { type: 'array' };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes("type 'object'"))).toBe(true);
  });

  it('fails when "type" is missing format', () => {
    const schema = {
      type: 'object',
      properties: {
        type: { type: 'string' },
        title: { type: 'string' },
        status: { type: 'integer', format: 'int32' },
        detail: { type: 'string' },
        instance: { type: 'string' }
      }
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes('type'))).toBe(true);
  });

  it('fails when status is not integer or wrong format', () => {
    const schema = {
      type: 'object',
      properties: {
        type: { type: 'string', format: 'uri-reference' },
        title: { type: 'string' },
        status: { type: 'string' }, // should be integer
        detail: { type: 'string' },
        instance: { type: 'string' }
      }
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes('status'))).toBe(true);
  });

  it('fails when detail or instance are not strings', () => {
    const schema = {
      type: 'object',
      properties: {
        type: { type: 'string', format: 'uri-reference' },
        title: { type: 'string' },
        status: { type: 'integer', format: 'int32' },
        detail: { type: 'number' }, // should be string
        instance: { type: 'boolean' } // should be string
      }
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes('detail'))).toBe(true);
    expect(result.some(r => r.message.includes('instance'))).toBe(true);
  });

  it('fails when all required fields are completely missing', () => {
    const schema = {
      type: 'object',
      properties: {}
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes('type'))).toBe(true);
    expect(result.some(r => r.message.includes('title'))).toBe(true);
    expect(result.some(r => r.message.includes('status'))).toBe(true);
    expect(result.some(r => r.message.includes('detail'))).toBe(true);
    expect(result.some(r => r.message.includes('instance'))).toBe(true);
  });

  it('handles combined schemas (anyOf)', () => {
    const schema = {
      anyOf: [
        {
          type: 'object',
          properties: {
            type: { type: 'string' },
            title: { type: 'string' },
            status: { type: 'integer', format: 'int32' },
            detail: { type: 'string' },
            instance: { type: 'string' }
          }
        }
      ]
    };
    const result: ValidationResult[] = validateProblemSchema(schema);
    expect(result.some(r => r.message.includes('type'))).toBe(true);
  });

  it('gracefully handles unexpected errors', () => {
    const proxy = new Proxy({}, {
      get: () => {
        throw new Error("Unexpected crash");
      }
    });

    const result: ValidationResult[] = validateProblemSchema(proxy as any);
    expect(result[0].message).toContain('Unexpected crash');
  });
});
