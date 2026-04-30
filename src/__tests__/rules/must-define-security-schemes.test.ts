import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-define-security-schemes', [
  {
    name: 'valid: components contains securitySchemes',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-Api-Key
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: components missing securitySchemes',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
components: {}
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        path: ['components'],
        message: 'All APIs MUST have a security scheme defined.',
      },
    ],
  },
]);
