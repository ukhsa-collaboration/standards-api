import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-snake-case-for-property-names', [
  {
    name: 'rule disabled: camelCase property names permitted',
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
                  camelCaseName:
                    type: string
`,
    errors: [],
  },
]);
