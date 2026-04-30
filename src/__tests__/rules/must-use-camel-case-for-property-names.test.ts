import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-camel-case-for-property-names', [
  {
    name: 'valid: response schema property uses camelCase',
    document: `
openapi: 3.0.0
info:
  title: Sample
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
                  inventoryCount:
                    type: integer
`,
    errors: [],
  },
  {
    name: 'invalid: response schema property uses snake_case',
    document: `
openapi: 3.0.0
info:
  title: Sample
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
                  inventory_count:
                    type: integer
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Properties must use lower camel case.',
      },
    ],
  },
]);
