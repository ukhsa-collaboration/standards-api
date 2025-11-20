import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-https-protocol-only', [
  {
    name: 'valid: only https servers are declared',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
servers:
  - url: https://api.example.com
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: http server triggers error',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
servers:
  - url: http://api.example.com
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Servers MUST be `https` and no other protocol is allowed.',
      },
    ],
  },
]);
