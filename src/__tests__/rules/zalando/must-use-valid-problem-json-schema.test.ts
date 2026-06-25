import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('must-use-valid-problem-json-schema', [
  {
    name: 'invalid: problem schema missing required fields',
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
          description: error response
          content:
            application/problem+json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                  status:
                    type: integer
                  detail:
                    type: string
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: "Problem json must have property 'type' with type 'string' and format 'uri-reference'",
      },
      {
        severity: DiagnosticSeverity.Error,
        message: "Problem json must have property 'status' with type 'integer' and format 'in32'",
      },
      {
        severity: DiagnosticSeverity.Error,
        message: "Problem json must have property 'instance' with type 'string'",
      },
    ],
  },
  {
    name: 'valid: full problem json schema present',
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
          description: error response
          content:
            application/problem+json:
              schema:
                type: object
                properties:
                  type:
                    type: string
                    format: uri-reference
                  title:
                    type: string
                  status:
                    type: integer
                    format: int32
                  detail:
                    type: string
                  instance:
                    type: string
`,
    errors: [],
  },
]);
