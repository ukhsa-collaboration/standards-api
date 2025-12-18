import { lintDocument } from '../__helpers__/redocly-helper';

const baseSpec = `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`;

describe('info.x-api-type', () => {
  it('warns when missing', async () => {
    const results = await lintDocument(baseSpec, ['rule/may-have-info-x-api-type']);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ruleId: 'rule/may-have-info-x-api-type',
          severity: 'warn',
        }),
      ])
    );
  });

  it('warns when invalid', async () => {
    const spec = baseSpec.replace('info:\n  title: Example', 'info:\n  title: Example\n  x-api-type: invalid');
    const results = await lintDocument(spec, ['rule/may-have-info-x-api-type']);
    expect(results[0].severity).toBe('warn');
    expect(results[0].ruleId).toBe('rule/may-have-info-x-api-type');
  });

  it('passes when valid', async () => {
    const spec = baseSpec.replace('info:\n  title: Example', 'info:\n  title: Example\n  x-api-type: standard');
    const results = await lintDocument(spec, ['rule/may-have-info-x-api-type']);
    expect(results).toHaveLength(0);
  });
});

describe('info.x-contains-sensitive-data', () => {
  it('warns when missing', async () => {
    const results = await lintDocument(baseSpec, ['rule/should-have-info-x-contains-sensitive-data']);
    expect(results[0]).toMatchObject({
      ruleId: 'rule/should-have-info-x-contains-sensitive-data',
      severity: 'warn',
    });
  });

  it('warns when invalid type', async () => {
    const spec = baseSpec.replace('version: 1.0.0', 'version: 1.0.0\n  x-contains-sensitive-data: "yes"');
    const results = await lintDocument(spec, ['rule/should-have-info-x-contains-sensitive-data']);
    expect(results[0].severity).toBe('warn');
  });

  it('passes when boolean provided', async () => {
    const spec = baseSpec.replace('version: 1.0.0', 'version: 1.0.0\n  x-contains-sensitive-data: false');
    const results = await lintDocument(spec, ['rule/should-have-info-x-contains-sensitive-data']);
    expect(results).toHaveLength(0);
  });
});
