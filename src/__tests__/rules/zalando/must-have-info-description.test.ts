import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-have-info-description', [
  {
    name: 'invalid: missing description',
    document: `
openapi: 3.0.0
info:
  title: Payments API
  version: 1.0.0
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Must have API description defined in `info.description`',
      },
    ],
  },
  {
    name: 'valid: description provided',
    document: `
openapi: 3.0.0
info:
  title: Payments API
  version: 1.0.0
  description: Manage payments
paths: {}
`,
    errors: [],
  },
]);
