import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-have-info-value-chain', [
  {
    name: 'valid: x-value-chain uses allowed value',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-value-chain: detect
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: x-value-chain missing',
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
        message: 'Missing or wrong `info.x-value-chain`, "info.x-value-chain" property must be defined.',
      },
    ],
  },
  {
    name: 'invalid: x-value-chain uses unsupported value',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-value-chain: sunset
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message:
          'Missing or wrong `info.x-value-chain`, "sunset" must be equal to one of the allowed values: "prevent", "detect", "analyse", "respond", "cross-cutting", "enabling".',
      },
    ],
  },
]);
