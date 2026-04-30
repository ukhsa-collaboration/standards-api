import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-use-lowercase-with-hyphens-for-path-segments', [
  {
    name: 'invalid: uppercase and underscores in path',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /Orders/{orderId}/line_items:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Path segments have to be lowercase separate words with hyphens.',
      },
    ],
  },
  {
    name: 'valid: lowercase path segments with hyphens',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /orders/{orderId}/line-items:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
