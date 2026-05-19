import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('should-use-hyphenated-pascal-case-for-header-parameters', [
  {
    name: 'invalid: header not Hyphenated-Pascal-Case',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      parameters:
        - in: header
          name: x-custom-header
          schema:
            type: string
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Header parameters should be Hyphenated-Pascal-Case',
      },
    ],
  },
  {
    name: 'valid: header follows Hyphenated-Pascal-Case',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      parameters:
        - in: header
          name: X-Custom-Header
          schema:
            type: string
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
