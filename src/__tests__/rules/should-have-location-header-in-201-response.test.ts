import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('should-have-location-header-in-201-response', [
  {
    name: 'valid: 201 response defines Location header schema',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      responses:
        '201':
          description: created
          headers:
            Location:
              description: resource url
              schema:
                type: string
                format: uri
                example: https://api.example.com/items/123
`,
    errors: [],
  },
  {
    name: 'invalid: 201 response missing Location header',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      responses:
        '201':
          description: created
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/items', 'post', 'responses', '201'],
      },
    ],
  },
]);
