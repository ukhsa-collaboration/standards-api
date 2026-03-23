import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-define-critical-problem-responses', [
  {
    name: 'valid: 400, 404, and 500 error responses include Problem Details examples',
    document: `
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '400':
          description: bad request
          content:
            application/problem+json:
              examples:
                sample:
                  value:
                    title: bad request
        '404':
          description: not found
          content:
            application/problem+json:
              examples:
                sample:
                  value:
                    title: not found
        '500':
          description: server error
          content:
            application/problem+json:
              examples:
                sample:
                  value:
                    title: server error
`,
    errors: [],
  },
  {
    name: 'invalid: missing example for 404 response',
    document: `
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '400':
          description: bad request
          content:
            application/problem+json:
              examples:
                sample:
                  value:
                    title: bad request
        '404':
          description: not found
          content:
            application/problem+json: {}
        '500':
          description: server error
          content:
            application/problem+json:
              examples:
                sample:
                  value:
                    title: server error
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/pets', 'get', 'responses'],
        message:
          'Each operation SHOULD define Problem Details for: 400, 404, 500. Issues: 404 (missing example).',
      },
    ],
  },
]);
