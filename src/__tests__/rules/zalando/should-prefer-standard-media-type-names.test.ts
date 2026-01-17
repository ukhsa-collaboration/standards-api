import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('should-prefer-standard-media-type-names', [
  {
    name: 'invalid: non-standard media type used',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '200':
          description: ok
          content:
            text/plain:
              schema:
                type: string
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Response content should use a standard media type `application/json` or `application/problem+json` (required for problem schemas).',
      },
    ],
  },
  {
    name: 'valid: uses application/json',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '200':
          description: ok
          content:
            application/json:
              schema:
                type: object
`,
    errors: [],
  },
]);
