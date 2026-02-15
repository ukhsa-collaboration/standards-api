import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-not-define-request-body-for-get-requests', [
  {
    name: 'valid: GET request without requestBody',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
  {
    name: 'invalid: GET request defines requestBody',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      requestBody:
        required: false
        content:
          application/json:
            schema:
              type: object
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        path: ['paths', '/items', 'get', 'requestBody'],
        message: 'A GET request MUST NOT accept a request body.',
      },
    ],
  },
]);
