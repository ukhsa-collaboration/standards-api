import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-snake-case-for-query-parameters', [
  {
    name: 'rule disabled: camelCase query names permitted',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items:
    get:
      parameters:
        - name: pageSize
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
