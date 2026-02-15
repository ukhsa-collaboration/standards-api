import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-always-return-json-objects-as-top-level-data-structures', [
  {
    name: 'valid: response schema uses object as top-level',
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
          content:
            application/json:
              schema:
                type: object
                properties:
                  value:
                    type: string
`,
    errors: [],
  },
  {
    name: 'invalid: response schema uses array top-level',
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
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/items', 'get', 'responses', '200', 'content', 'application/json', 'schema'],
        message: 'Top-level data structure must be an object',
      },
    ],
  },
]);
