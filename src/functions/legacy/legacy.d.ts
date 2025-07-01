declare module 'src/functions/legacy/is-api-info-json-schema.js' {
  export default function validateApiInfo(schema: any): { message: string }[];
}

declare module 'src/functions/legacy/is-problem-json-schema.js' {
  export default function validateProblemSchema(schema: any): { message: string }[];
}

declare module 'src/functions/legacy/is-object-schema.js' {
  export default function validateObjectSchema(schema: any): { message: string }[];
}

declare module 'src/functions/legacy/count-resource-types.js' {
  export default function countResourceTypes(schema: any): Record<string, number>;
}
