import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-return-200-for-api-root', [
  {
    name: 'valid: root path defines 200 response',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
  {
    name: 'invalid: root path missing 200 response',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /:
    get:
      responses:
        '404':
          description: missing
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        path: ['paths', '/', 'get', 'responses'],
        message: 'Root path must define a 200 response.',
      },
    ],
  },
]);
