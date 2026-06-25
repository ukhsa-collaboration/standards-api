import { DiagnosticSeverity } from '@stoplight/types';
import testRule, { expectRulesetFileExists } from '../__helpers__/helper.mjs';

describe('ruleset file', () => {
  it('exists', () => expectRulesetFileExists());
});

const validSchema = `
type: object
properties:
  name:
    type: string
    description: The name of the API.
  version:
    type: string
    pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
    description: The version of the API.
  status:
    type: string
    x-extensible-enum:
      - ALPHA
      - BETA
      - LIVE
      - DEPRECATED
    description: The status of the API version.
  releaseDate:
    type: string
    format: date
    description: The release date.
  documentation:
    type: string
    format: uri
    description: Documentation URL.
  releaseNotes:
    type: string
    format: uri
    description: Release notes URL.
`;

testRule('must-use-valid-version-info-schema', [
  {
    name: 'valid: root path provides ApiInfo schema with all required fields',
    document: `
openapi: 3.0.0
info:
  title: Version Info API
  version: 1.0.0
paths:
  /:
    get:
      responses:
        '200':
          description: ApiInfo response
          content:
            application/json:
              schema:
${validSchema.split('\n').map((line) => (line ? `                ${line}` : '                ')).join('\n')}
`,
    errors: [],
  },
  {
    name: 'invalid: releaseNotes format is not uri',
    document: `
openapi: 3.0.0
info:
  title: Version Info API
  version: 1.0.0
paths:
  /:
    get:
      responses:
        '200':
          description: ApiInfo response
          content:
            application/json:
              schema:
                type: object
                properties:
                  name:
                    type: string
                  version:
                    type: string
                    pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$'
                  status:
                    type: string
                    x-extensible-enum:
                      - ALPHA
                      - BETA
                      - LIVE
                      - DEPRECATED
                  releaseDate:
                    type: string
                    format: date
                  documentation:
                    type: string
                    format: uri
                  releaseNotes:
                    type: string
                    format: url
`,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'",
      },
    ],
  },
]);
