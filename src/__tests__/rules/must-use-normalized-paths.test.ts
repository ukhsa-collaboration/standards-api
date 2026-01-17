import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-normalized-paths', [
  {
    name: 'valid: paths start with slash and avoid trailing slash',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '200':
          description: ok
  /pets/{id}:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
  {
    name: 'invalid: missing leading slash and trailing slash detected',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  pets:
    get:
      responses:
        '200':
          description: ok
  /widgets/:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: "Path must start with a slash and must not end with a slash (except root path '/')",
      },
      {
        severity: DiagnosticSeverity.Error,
        message: "Path must start with a slash and must not end with a slash (except root path '/')",
      },
    ],
  },
]);
