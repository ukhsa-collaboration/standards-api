import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('should-support-application-json-content-request-body', [
  {
    name: 'valid: requestBody includes application/json content type',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
      responses:
        '201':
          description: created
`,
    errors: [],
  },
  {
    name: 'invalid: requestBody missing application/json',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    post:
      requestBody:
        content:
          application/xml:
            schema:
              type: object
      responses:
        '201':
          description: created
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths', '/items', 'post', 'requestBody', 'content'],
        message: 'Every request SHOULD support at least one `application/json` content type.',
      },
    ],
  },
]);
