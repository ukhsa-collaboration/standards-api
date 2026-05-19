import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('must-have-info-x-api-id', [
  {
    name: 'rule disabled: missing info.x-api-id is ignored',
    document: `
openapi: 3.0.0
info:
  title: Payments API
  version: 1.0.0
paths: {}
`,
    errors: [],
  },
]);
