import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('should-not-use-api-as-base-path', [
  {
    name: 'rule disabled: base path may start with /api without error',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /api/users:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
