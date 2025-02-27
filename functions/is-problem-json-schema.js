'use strict';

/*
Minimal required problem json schema:

type: object
properties:
  type:
    type: string
    format: uri
  title:
    type: string
  status:
    type: integer
    format: int32
  detail:
    type: string
  instance:
    type: string
*/

const assertProblemSchema = (schema) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Problem json must have type 'object'" });
  }

  const type = (schema.properties || {}).type || {};
  if (type.type !== 'string' || type.format !== 'uri-reference') {
    results.push({ message: "Problem json must have property 'type' with type 'string' and format 'uri-reference'" });
  }

  const title = (schema.properties || {}).title || {};
  if (title.type !== 'string') {
    results.push({ message: "Problem json must have property 'title' with type 'string'" });
  }

  const status = (schema.properties || {}).status || {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    results.push({ message: "Problem json must have property 'status' with type 'integer' and format 'in32'" });
  }

  const detail = (schema.properties || {}).detail || {};
  if (detail.type !== 'string') {
    results.push({ message: "Problem json must have property 'detail' with type 'string'" });
  }

  const instance = (schema.properties || {}).instance || {};
  if (instance.type !== 'string') {
    results.push({ message: "Problem json must have property 'instance' with type 'string'" });
  }

  return results;
};

const check = (schema) => {
  const combinedSchemas = [...(schema?.anyOf ?? []), ...(schema?.oneOf ?? []), ...(schema?.allOf ?? [])];

  if (combinedSchemas.length > 0) {
    return combinedSchemas.map(check).flat();
  } else {
    return assertProblemSchema(schema);
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
