import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-have-info-version', [
  {
    name: 'invalid: missing version',
    document: `
openapi: 3.0.0
info:
  title: Catalog API
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Must have API version defined in `info.version`',
      },
    ],
  },
  {
    name: 'invalid: non-semver version string',
    document: `
openapi: 3.0.0
info:
  title: Catalog API
  version: v1
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Must have API version defined in `info.version`',
      },
    ],
  },
  {
    name: 'valid: semver version provided',
    document: `
openapi: 3.0.0
info:
  title: Catalog API
  version: 1.2.3
paths: {}
`,
    errors: [],
  },
]);
