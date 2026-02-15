import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-camel-case-for-query-parameters', [
  {
    name: 'valid: query parameter uses camelCase',
    document: `
openapi: 3.0.0
info:
  title: Sample
  version: 1.0.0
paths:
  /items:
    get:
      parameters:
        - in: query
          name: pageSize
          schema:
            type: integer
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
  {
    name: 'invalid: query parameter uses snake_case',
    document: `
openapi: 3.0.0
info:
  title: Sample
  version: 1.0.0
paths:
  /items:
    get:
      parameters:
        - in: query
          name: page_size
          schema:
            type: integer
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Query parameters must use lower camel case.',
      },
    ],
  },
]);
