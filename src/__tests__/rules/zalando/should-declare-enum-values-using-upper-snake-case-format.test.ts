import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('should-declare-enum-values-using-upper-snake-case-format', [
  {
    name: 'invalid: enum values not UPPER_SNAKE_CASE',
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
                properties:
                  state:
                    type: string
                    x-extensible-enum:
                      - PendingApproval
                      - Approved
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        path: [
          'paths',
          '/items',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'state',
          'x-extensible-enum',
          '0',
        ],
      },
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Enum values should be in UPPER_SNAKE_CASE format',
        path: [
          'paths',
          '/items',
          'get',
          'responses',
          '200',
          'content',
          'application/json',
          'schema',
          'properties',
          'state',
          'x-extensible-enum',
          '1',
        ],
      }
    ],
  },
  {
    name: 'valid: enum values follow UPPER_SNAKE_CASE',
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
                properties:
                  state:
                    type: string
                    x-extensible-enum:
                      - PENDING_APPROVAL
                      - APPROVED
`,
    errors: [],
  },
]);
