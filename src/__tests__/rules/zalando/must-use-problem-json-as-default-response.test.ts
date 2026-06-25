import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-use-problem-json-as-default-response', [
  {
    name: 'invalid: default response missing problem+json content',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        default:
          description: generic error
          content:
            application/json:
              schema:
                type: object
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Operation must use problem json as default response',
      },
    ],
  },
  {
    name: 'valid: default response uses problem+json',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      responses:
        default:
          description: generic error
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
