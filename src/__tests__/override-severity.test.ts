import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from 'src/__tests__/__helpers__/helper.ts';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule(['override-severity', 'must-use-https-protocol-only'], [
  {
    name: 'wrong x-api-type: override not applied',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: not-pygeoapi
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
    name: 'non-pygeoapi: must-use-https-protocol-only enforced',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
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
    name: 'pygeoapi: must-use-https-protocol-only disabled by override-severity',
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
    errors: [],
  },
]);
