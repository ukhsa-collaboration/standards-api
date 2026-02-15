import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-use-normalized-paths-without-empty-path-segments', [
  {
    name: 'invalid: duplicate slash in path',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /pets//owners:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Empty path segments are not allowed',
      },
    ],
  },
  {
    name: 'valid: no empty path segments',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /pets/{petId}/owners:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
