import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-have-info-contact-email', [
  {
    name: 'invalid: contact email missing',
    document: `
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
  contact:
    name: Users Team
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Must have email defined in `info.contact.email`',
      },
    ],
  },
  {
    name: 'valid: contact email provided',
    document: `
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
  contact:
    name: Users Team
    email: team@example.com
paths: {}
`,
    errors: [],
  },
]);
