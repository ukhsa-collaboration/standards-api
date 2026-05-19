import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-use-normalized-paths-without-trailing-slash', [
  {
    name: 'rule disabled: trailing slash paths allowed',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /items/:
    get:
      responses:
        '200':
          description: ok
`,
    errors: [],
  },
]);
