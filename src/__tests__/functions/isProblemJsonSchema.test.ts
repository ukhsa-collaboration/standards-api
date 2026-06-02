import validateProblemSchema from '../../functions/isProblemJsonSchema.js';

interface FunctionResult {
  message: string;
  path?: (string | number)[];
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
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    expect(result).toEqual([]);
  });

  it('fails when top-level type is not object', () => {
    const schema = { type: 'array' };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    expect(result.map((r) => r.message)).toContain("Problem json must have type 'object'");
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
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    expect(result.map((r) => r.message)).toContain("Problem json must have property 'type' with type 'string' and format 'uri-reference'");
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
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    expect(result.map((r) => r.message)).toContain("Problem json must have property 'status' with type 'integer' and format 'in32'");
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
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    const messages = result.map((r) => r.message);
    expect(messages).toContain("Problem json must have property 'detail' with type 'string'");
    expect(messages).toContain("Problem json must have property 'instance' with type 'string'");
  });

  it('fails when all required fields are completely missing', () => {
    const schema = {
      type: 'object',
      properties: {}
    };
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    const messages = result.map((r) => r.message);
    expect(messages).toContain("Problem json must have property 'type' with type 'string' and format 'uri-reference'");
    expect(messages).toContain("Problem json must have property 'title' with type 'string'");
    expect(messages).toContain("Problem json must have property 'status' with type 'integer' and format 'in32'");
    expect(messages).toContain("Problem json must have property 'detail' with type 'string'");
    expect(messages).toContain("Problem json must have property 'instance' with type 'string'");
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
    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(schema);
    expect(result.map((r) => r.message)).toContain("Problem json must have property 'type' with type 'string' and format 'uri-reference'");
  });

  it('gracefully handles unexpected errors', () => {
    const proxy = new Proxy({}, {
      get: () => {
        throw new Error("Unexpected crash");
      }
    });

    // @ts-expect-error: we don't care in this context that we are not passing options and context.
    const result: FunctionResult[] = validateProblemSchema(proxy as any);
    expect(result[0]).toBeDefined();
    expect(result[0].message).toBe('Unexpected crash');
  });
});
