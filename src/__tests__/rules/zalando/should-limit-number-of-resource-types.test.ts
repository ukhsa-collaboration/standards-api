import path from 'node:path';

import { DiagnosticSeverity } from '@stoplight/types';

import testRule, { expectRulesetFileExists, type RuleName } from '../../__helpers__/helper.mjs';

const ZALANDO_RULESET_PATH = path.resolve(process.cwd(), 'zalando.oas.rules.yml');
const testZalandoRule = (rule: RuleName | RuleName[], tests: Parameters<typeof testRule>[1]) =>
  testRule(rule, tests, { rulesetPath: ZALANDO_RULESET_PATH });

describe('zalando ruleset file', () => {
  it('exists', () => expectRulesetFileExists(ZALANDO_RULESET_PATH));
});

testZalandoRule('should-limit-number-of-resource-types', [
  {
    name: 'invalid: more than eight resource types',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /a:
    get:
      responses: { '200': { description: ok } }
  /b:
    get:
      responses: { '200': { description: ok } }
  /c:
    get:
      responses: { '200': { description: ok } }
  /d:
    get:
      responses: { '200': { description: ok } }
  /e:
    get:
      responses: { '200': { description: ok } }
  /f:
    get:
      responses: { '200': { description: ok } }
  /g:
    get:
      responses: { '200': { description: ok } }
  /h:
    get:
      responses: { '200': { description: ok } }
  /i:
    get:
      responses: { '200': { description: ok } }
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'More than 8 resource types found',
      },
    ],
  },
  {
    name: 'valid: at most eight root resource types',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /a:
    get:
      responses: { '200': { description: ok } }
  /b:
    get:
      responses: { '200': { description: ok } }
  /c:
    get:
      responses: { '200': { description: ok } }
  /d:
    get:
      responses: { '200': { description: ok } }
  /e:
    get:
      responses: { '200': { description: ok } }
  /f:
    get:
      responses: { '200': { description: ok } }
  /g:
    get:
      responses: { '200': { description: ok } }
  /h:
    get:
      responses: { '200': { description: ok } }
`,
    errors: [],
  },
]);
