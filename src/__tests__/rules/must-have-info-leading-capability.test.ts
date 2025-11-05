import { DiagnosticSeverity } from '@stoplight/types';
import testRule from '../__helpers__/helper.mjs';

const invalidMessage = "Missing or wrong `info.x-leading-capability`, should be a valid UKHSA Business Capability.";

testRule('must-have-info-leading-capability', [
  {
    name: 'valid: info.x-leading-capability matches a known capability',
    document: `
openapi: 3.1.0
info:
  title: Sample API
  version: 1.0.0
  x-leading-capability: Advice Management
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: info.x-leading-capability missing',
    document: `
openapi: 3.1.0
info:
  title: Sample API
  version: 1.0.0
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['info'],
        message: invalidMessage,
      },
    ],
  },
  {
    name: 'invalid: info.x-leading-capability not in controlled list',
    document: `
openapi: 3.1.0
info:
  title: Sample API
  version: 1.0.0
  x-leading-capability: Not A Real Capability
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['info', 'x-leading-capability'],
        message: invalidMessage,
      },
    ],
  },
]);
