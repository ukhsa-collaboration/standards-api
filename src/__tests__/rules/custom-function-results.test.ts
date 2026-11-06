import testRule, { DiagnosticSeverity } from '../__helpers__/vacuum-helper.js';

// Custom functions return Spectral-style path arrays. Vacuum decodes each result's path as a
// JSONPath string, so these tests run the built wrappers through Vacuum to check that a
// function's own message reaches the report.

testRule('must-use-valid-problem-json-schema', [
  {
    name: 'invalid: reports the function message',
    document: `
openapi: 3.1.0
info:
  title: Example
  version: 1.0.0
paths:
  /v1/things:
    get:
      responses:
        '400':
          description: Bad request
          content:
            application/problem+json:
              schema:
                type: object
                properties:
                  type:
                    type: string
                    format: uri-reference
                  title:
                    type: integer
                  status:
                    type: integer
                    format: int32
                  detail:
                    type: string
                  instance:
                    type: string
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: "Problem json must have property 'title' with type 'string'",
      },
    ],
  },
]);

testRule('must-always-return-json-objects-as-top-level-data-structures', [
  {
    name: 'invalid: reports the function message',
    document: `
openapi: 3.1.0
info:
  title: Example
  version: 1.0.0
paths:
  /v1/things:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
`,
    errors: [
      {
        severity: DiagnosticSeverity.Warning,
        message: 'Schema type is not `object`',
      },
    ],
  },
]);
