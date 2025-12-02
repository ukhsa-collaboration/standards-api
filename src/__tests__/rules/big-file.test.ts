import { DiagnosticSeverity } from '@stoplight/types';
import testRule from '../__helpers__/helper.mjs';
// import * as SpectralCore from '@stoplight/spectral-core';
// const { Spectral, Document } = SpectralCore;
import fs from 'node:fs';
import path from 'node:path';

const RULESET_PATH = path.resolve(process.cwd(), 'openapi-pygeoapi-big.yml');
const doc = fs.readFileSync(RULESET_PATH, 'utf8')

testRule(['may-have-info-x-api-type'], [
  {
    name: 'missing x-api-type reports info and assumes standard',
    document: doc,
    errors: [
      {
        severity: DiagnosticSeverity.Error,
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
      },
    ],
  }
]);
