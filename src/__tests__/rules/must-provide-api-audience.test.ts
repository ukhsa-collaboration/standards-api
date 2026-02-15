import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-provide-api-audience', [
  {
    name: 'rule disabled: missing info.x-audience does not fail legacy guidance',
    document: `
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
paths: {}
`,
    errors: [],
  },
]);
