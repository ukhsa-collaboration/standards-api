import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-not-use-http-basic-authentication', [
  {
    name: 'valid: non-basic security scheme',
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
    name: 'invalid: HTTP basic scheme configured',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
components:
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        path: ['components', 'securitySchemes', 'BasicAuth', 'scheme'],
        message: 'APIs MUST NOT use `HTTP` Basic Authentication.',
      },
    ],
  },
]);
