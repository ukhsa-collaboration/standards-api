'use strict';

const assertObjectSchema = (schema) => {
  const results = [];

  if (schema.type !== 'object') {
    results.push({ message: "Schema type is not `object`" });
  }

  if (schema.additionalProperties) {
    results.push({ message: "Schema is a map" });
  }

  return results;
};

const check = (schema) => {
  const combinedSchemas = [...(schema?.anyOf ?? []), ...(schema?.oneOf ?? []), ...(schema?.allOf ?? [])];

  if (combinedSchemas.length > 0) {
    return combinedSchemas.map(check).flat();
  } else {
    return assertObjectSchema(schema);
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
