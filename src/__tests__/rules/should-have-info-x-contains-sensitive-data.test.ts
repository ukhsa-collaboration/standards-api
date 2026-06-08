import testRule, { expectRulesetFileExists } from '../__helpers__/vacuum-helper.js';

// Vacuum severity values: 0=error, 1=warning, 2=info, 3=hint
const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 };

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('should-have-info-x-contains-sensitive-data', [
  {
    name: 'valid: info.x-contains-sensitive-data present and boolean',
    document: `
openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  x-contains-sensitive-data: true
paths: {}
`,
    errors: [],
  },
  {
    name: 'invalid: info.x-contains-sensitive-data missing',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning, // or 1
        path: ['info'],
        message: "Missing or wrong 'info.x-contains-sensitive-data', should be 'boolean'.",
      },
    ],
  },
  {
    name: 'invalid: info.x-contains-sensitive-data wrong type (string)',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-contains-sensitive-data: "yes"
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        // Vacuum reports path as ["info", "0"] for schema validation errors
        path: ['info', '0'],
        message: "Missing or wrong 'info.x-contains-sensitive-data', should be 'boolean'.",
      },
    ],
  },
]);
