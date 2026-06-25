import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('should-limit-number-of-sub-resource-levels', [
  {
    name: 'invalid: too many nested sub-resources',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /customers/{customerId}/orders/{orderId}/items/{itemId}/options/{optionId}/details:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Sub-resource levels should by <= 3',
      },
    ],
  },
  {
    name: 'valid: three sub-resources allowed',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /customers/{customerId}/orders/{orderId}/items/{itemId}/options:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
