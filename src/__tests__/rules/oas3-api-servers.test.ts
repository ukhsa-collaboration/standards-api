import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('oas3-api-servers', [
  {
    name: 'rule disabled: documents without servers do not raise diagnostics',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`,
    errors: [],
  },
]);
