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
  status:
    type: string
    description: The status of the API version.
    x-extensible-enum:
      - ALPHA
      - BETA
      - LIVE
      - DEPRECATED
    example: LIVE
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

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * Asserts that the given schema is a valid ApiInfo JSON schema.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} schema
 */
export const assertApiInfoSchema = (schema) => {

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

  const status = (schema.properties || {}).status || {};
  const requiredStatus = ["ALPHA", "BETA", "LIVE", "DEPRECATED"];
  if (status.type !== 'string' || !status["x-extensible-enum"] || !requiredStatus.every((value) => status["x-extensible-enum"].includes(value))) {
    results.push({ message: "ApiInfo json must have property 'status' with x-extensible-enum values: ALPHA, BETA, LIVE, DEPRECATED." });
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
    results.push({ message: "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'" });
  }

  return results;
};

/** @type {(schema: any, _options: any, _context: any, resolveRef: (schema: any) => any) => any} */
const check = (schema, _options, _context, resolveRef) => {
  const resolvedSchema = resolveRef(schema);
  const combinedSchemas = [
    ...(resolvedSchema?.anyOf ?? []),
    ...(resolvedSchema?.oneOf ?? []),
    ...(resolvedSchema?.allOf ?? []),
  ].map(resolveRef);

  if (combinedSchemas.length > 0) {
    const aggregated = [];
    for (const subSchema of combinedSchemas) {
      const res = check(subSchema, _options, _context, resolveRef);
      if (Array.isArray(res)) {
        aggregated.push(...res);
      }
    }
    return aggregated;
  }

  return assertApiInfoSchema(resolvedSchema, _options, _context);
};

/**
 * Validates if the target value is a valid ApiInfo JSON schema.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} targetValue - The value to validate.
 * @param {null} _options - Additional options (not used).
 * @param {Core.RulesetFunctionContext} _context - The context.
 */
export const runRule = (targetValue, _options, _context) => {
  const schema = targetValue?.schema ?? targetValue;

  if (schema === null || typeof schema !== "object") {
    return [];
  }

  try {
    let document = _context?.document?.data;
    const specInfo = _context ? /** @type {any} */ (_context).specInfo : undefined;

    /** @type {any} */
    const bytes = specInfo && specInfo.bytes;
    const hasBytes =
      Array.isArray(bytes) ||
      (typeof ArrayBuffer !== "undefined" && bytes instanceof ArrayBuffer) ||
      ArrayBuffer.isView?.(bytes);

    if (!document && hasBytes) {
      try {
        const SafeBuffer =
          typeof Buffer !== "undefined" ? Buffer : /** @type {any} */ (require("buffer").Buffer);
        let buffer;
        if (Array.isArray(bytes)) {
          buffer = SafeBuffer.from(bytes);
        } else if (bytes instanceof ArrayBuffer) {
          buffer = SafeBuffer.from(new Uint8Array(bytes));
        } else if (ArrayBuffer.isView?.(bytes)) {
          buffer = SafeBuffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        } else {
          buffer = SafeBuffer.from([]);
        }
        const text = buffer.toString("utf8");
        // @ts-expect-error - js-yaml typings are not available in this build context.
        const yaml = require("js-yaml");
        document = yaml.load(text);
      } catch {
        document = undefined;
      }
    }

    if (!document && typeof schema?.$ref === "string" && schema.$ref.includes("/ApiInfo")) {
      return [];
    }

    /** @param {string} ref */
    const resolveLocalRef = (ref) => {
      if (typeof ref !== "string" || !ref.startsWith("#/")) return null;
      const pathSegments = ref
        .slice(2)
        .split("/")
        .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));

      /** @type {any} */
      let node = document;
      for (const segment of pathSegments) {
        if (node && typeof node === "object" && segment in node) {
          node = node[segment];
        } else {
          return null;
        }
      }
      return node;
    };

    /** @param {any} schemaNode */
    const resolveRef = (schemaNode) => {
      if (schemaNode && typeof schemaNode === "object" && typeof schemaNode.$ref === "string") {
        const resolved = resolveLocalRef(schemaNode.$ref);
        if (resolved) {
          return resolved;
        }
      }
      return schemaNode;
    };

    return check(schema, _options, _context, resolveRef);
  } catch (/** @type {any} */ex) {
    return [
      {
        message: ex?.message ?? ex,
      },
    ];
  }
};

export default runRule;
