import { DiagnosticSeverity } from '@stoplight/types';
import testRule from '../__helpers__/helper.mjs';

testRule(['may-have-info-x-api-type'], [
  {
    name: 'missing x-api-type reports info and assumes standard',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Information,
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
      },
    ],
  },
  {
    name: 'invalid x-api-type value reports info with guidance',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: experimental-non-pygeoapi
paths: {}
`,
    errors: [
      {
        severity: DiagnosticSeverity.Information,
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
      },
    ],
  },
  {
    name: 'valid x-api-type standard passes',
    document: `
openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
  x-api-type: standard
paths: {}
`,
    errors: [],
  },
  {
    name: 'valid x-api-type pygeoapi passes',
    document: `
openapi: 3.0.0
info:
  title: Geospatial
  version: 1.0.0
  x-api-type: pygeoapi
paths: {}
`,
    errors: [],
  },
]);
