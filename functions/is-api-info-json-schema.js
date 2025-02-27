'use strict';

/*
Minimal required ApiInfo json schema:

type: object
properties:
  name:
    type: string
    description: The name of the API.
    example: Test Results API
  version:
    type: string
    pattern: '^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$'
    description: The version of the API.
    example: 1.0.0
  releaseDate:
    type: string
    format: date
    description: The release date of this API version.
    example: 2025-02-26
  documentation:
    type: string
    format: uri
    description: A URL to the API documentation.
    example: https://developer.ukhsa.gov.uk/namespace/product/v1/docs
  releaseNotes:
    type: string
    format: uri
    description: A URL to the API release notes.
    example: https://developer.ukhsa.gov.uk/namespace/product/v1/releaseNotes
*/

const assertApiInfoSchema = (schema) => {

  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "ApiInfo json must have type 'object'" });
  }

  const name = (schema.properties || {}).name || {};
  if (name.type !== 'string') {
    results.push({ message: "ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'" });
  }

  const version = (schema.properties || {}).version || {};
  const pattern = "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$"

  if (version.type !== 'string' || version.pattern !== pattern) {
    results.push({ message: "ApiInfo json must have property 'version' with type 'string' and pattern for semver." });
  }

  const releaseDate = (schema.properties || {}).releaseDate || {};
  if (releaseDate.type !== 'string' || releaseDate.format !== 'date') {
    results.push({ message: "ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'" });
  }

  const documentation = (schema.properties || {}).documentation || {};
  if (documentation.type !== 'string' || documentation.format !== 'uri') {
    results.push({ message: "ApiInfo json must have property 'documentation' with type 'string' and format 'uri'" });
  }

  const releaseNotes = (schema.properties || {}).releaseNotes || {};
  if (releaseNotes.type !== 'string' || releaseNotes.format !== 'uri') {
    results.push({ message: "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri" });
  }

  return results;
};

const check = (schema) => {
  const combinedSchemas = [...(schema?.anyOf ?? []), ...(schema?.oneOf ?? []), ...(schema?.allOf ?? [])];

  if (combinedSchemas.length > 0) {
    return combinedSchemas.map(check).flat();
  } else {
    return assertApiInfoSchema(schema);
  }
};

export default (targetValue) => {
  if(targetValue === null || typeof targetValue !== "object") {
    return [];
  }

  try {
    return check(targetValue);
  } catch (ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};
