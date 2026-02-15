import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-have-info-api-audience', [
  {
    name: 'valid: x-audience uses allowed value',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-audience: public-external
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: x-audience missing',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Missing or wrong `info.x-audience`, "info.x-audience" property must be defined.',
      },
    ],
  },
  {
    name: 'invalid: x-audience has unexpected value',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-audience: partners-only
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message:
          'Missing or wrong `info.x-audience`, "partners-only" must be equal to one of the allowed values: "company-internal", "partner-external", "premium-external", "public-external".',
      },
    ],
  },
]);
