import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-have-info-contact-name', [
  {
    name: 'invalid: contact name missing',
    document: `
openapi: 3.0.0
info:
  title: Orders API
  version: 1.0.0
  contact:
    email: team@example.com
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Must have name defined in `info.contact.name`',
      },
    ],
  },
  {
    name: 'valid: contact name supplied',
    document: `
openapi: 3.0.0
info:
  title: Orders API
  version: 1.0.0
  contact:
    name: API Team
    email: team@example.com
paths: {}
`,
    errors: [],
  },
]);
