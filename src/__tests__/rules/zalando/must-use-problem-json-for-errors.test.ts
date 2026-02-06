import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-use-problem-json-for-errors', [
  {
    name: 'invalid: error response not problem+json',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '400':
          description: bad request
          content:
            application/json:
              schema:
                type: object
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Error response must be application/problem+json',
      },
    ],
  },
  {
    name: 'valid: error response uses application/problem+json',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        '400':
          description: bad request
          content:
            application/problem+json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                  status:
                    type: integer
                    format: int32
                  type:
                    type: string
                    format: uri-reference
                  detail:
                    type: string
                  instance:
                    type: string
`,
    errors: [],
  },
]);
