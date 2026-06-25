import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('should-define-api-root', [
  {
    name: 'valid: root path is present',
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
  /status:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
  {
    name: 'invalid: missing root path',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /status:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['paths'],
        message: 'APIs SHOULD have a root path (`/`) defined.',
      },
    ],
  },
]);
