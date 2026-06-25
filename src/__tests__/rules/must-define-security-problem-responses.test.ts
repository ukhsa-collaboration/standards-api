import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-define-security-problem-responses', [
  {
    name: 'valid: secured operation defines 401 and 403 Problem Details responses',
    document: `
openapi: 3.0.0
info:
  title: Secure API
  version: 1.0.0
paths:
  /accounts:
    get:
      security:
        - ApiKeyAuth: []
      responses:
        '401':
          description: unauthorized
          content:
            application/problem+json:
              examples:
                unauthorized:
                  value:
                    title: unauthorized
        '403':
          description: forbidden
          content:
            application/problem+json:
              examples:
                forbidden:
                  value:
                    title: forbidden
`,
    errors: [],
  },
  {
    name: 'invalid: secured operation missing 401 response',
    document: `
openapi: 3.0.0
info:
  title: Secure API
  version: 1.0.0
paths:
  /accounts:
    get:
      security:
        - ApiKeyAuth: []
      responses:
        '403':
          description: forbidden
          content:
            application/problem+json:
              examples:
                forbidden:
                  value:
                    title: forbidden
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/accounts', 'get', 'responses'],
        message:
          'Each operation SHOULD define Problem Details for: 401, 403. Issues: 401 (missing response).',
      },
    ],
  },
]);
