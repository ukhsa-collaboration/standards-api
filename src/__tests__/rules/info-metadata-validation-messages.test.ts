import { describe, expect, it } from '@jest/globals';
import { DiagnosticSeverity, runVacuumLint } from '../__helpers__/vacuum-helper.js';

describe('info metadata validation messages', () => {
  it('reports missing audience and value-chain with dedicated missing-property messages', () => {
    const results = runVacuumLint(`
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`);

    const relevant = results.filter(({ code }) =>
      [
        'must-have-info-api-audience-defined',
        'must-have-info-value-chain-defined',
      ].includes(code),
    );

    expect(relevant).toEqual([
      expect.objectContaining({
        code: 'must-have-info-api-audience-defined',
        severity: DiagnosticSeverity.Error,
        message: 'Missing `info.x-audience`.',
      }),
      expect.objectContaining({
        code: 'must-have-info-value-chain-defined',
        severity: DiagnosticSeverity.Error,
        message: 'Missing `info.x-value-chain`.',
      }),
    ]);
  });

  it('reports invalid audience and value-chain with interpolated schema errors', () => {
    const results = runVacuumLint(`
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-audience: nope
  x-value-chain: wrong
paths: {}
`);

    const relevant = results.filter(({ code }) =>
      [
        'must-have-info-api-audience',
        'must-have-info-value-chain',
      ].includes(code),
    );

    expect(relevant).toEqual([
      expect.objectContaining({
        code: 'must-have-info-api-audience',
        severity: DiagnosticSeverity.Error,
        message: "Missing or wrong `info.x-audience`, value must be one of 'company-internal', 'partner-external', 'premium-external', 'public-external'.",
      }),
      expect.objectContaining({
        code: 'must-have-info-value-chain',
        severity: DiagnosticSeverity.Error,
        message: "Missing or wrong `info.x-value-chain`, value must be one of 'prevent', 'detect', 'analyse', 'respond', 'cross-cutting', 'enabling'.",
      }),
    ]);
  });

  it('downgrades invalid pygeoapi audience and value-chain errors to warnings', () => {
    const results = runVacuumLint(`
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: pygeoapi
  x-audience: nope
  x-value-chain: wrong
paths: {}
`);

    const relevant = results.filter(({ code }) =>
      [
        'must-have-info-api-audience-pygeoapi-invalid',
        'must-have-info-value-chain-pygeoapi-invalid',
      ].includes(code),
    );

    expect(relevant).toEqual([
      expect.objectContaining({
        code: 'must-have-info-api-audience-pygeoapi-invalid',
        severity: DiagnosticSeverity.Warning,
        message: "Missing or wrong `info.x-audience`, value must be one of 'company-internal', 'partner-external', 'premium-external', 'public-external'.",
      }),
      expect.objectContaining({
        code: 'must-have-info-value-chain-pygeoapi-invalid',
        severity: DiagnosticSeverity.Warning,
        message: "Missing or wrong `info.x-value-chain`, value must be one of 'prevent', 'detect', 'analyse', 'respond', 'cross-cutting', 'enabling'.",
      }),
    ]);
  });
});
