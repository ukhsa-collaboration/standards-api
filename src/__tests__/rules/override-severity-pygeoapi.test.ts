import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';
import { EOL } from "node:os";

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule(['override-severity-pygeoapi', 'must-use-https-protocol-only'], [
  {
    name: 'x-api-type standard: must-use-https-protocol-only enforced',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: standard
servers:
  - url: http://api.example.com
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: 'Servers MUST be `https` and no other protocol is allowed.',
      },
    ],
  },
  {
    name: 'pygeoapi: must-use-https-protocol-only downgraded to warn by override-severity-pygeoapi',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: pygeoapi
servers:
  - url: http://api.example.com
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: `Servers MUST be \`https\` and no other protocol is allowed.${EOL}Severity has been downgraded from \`error\` due to \`info.x-api-type\` of \`pygeoapi\``,
      },
    ],
  },
]);
