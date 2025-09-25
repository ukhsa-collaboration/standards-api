import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from './__helpers__/helper';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

testRule('override-severity', ['should-have-info-x-contains-sensitive-data'], [
  {
    name: 'invalid: info.x-contains-sensitive-data missing',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: pygeoapi
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
  x-api-type: pygeoapi
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        path: ['info', 'x-contains-sensitive-data'],
        message: "Missing or wrong 'info.x-contains-sensitive-data', should be 'boolean'.",
      },
    ],
  },
]);
