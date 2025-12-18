import {
  buildAssertCustomFunction,
  type AssertResult,
} from '@redocly/openapi-core/lib/rules/common/assertions/asserts';
import type { CustomFunction, Plugin } from '@redocly/openapi-core/lib/config/types';
import type { Location } from '@redocly/openapi-core/lib/ref-utils';

type ProblemDetailMode = 'critical' | 'explicit-security';

const asResults = (issues: { message: string; location?: Location }[], baseLocation: Location) =>
  issues.map((issue) => ({
    message: issue.message,
    location: issue.location ?? baseLocation,
  }));

const safeChild = (location: any, key: string | number | (string | number)[]) => {
  if (location && typeof location.child === 'function') {
    return location.child(key);
  }
  return location;
};

const objectSchemaAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  if (typeof (value as any).$ref === 'string') {
    return [];
  }

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) =>
      objectSchemaAssertion(schema, _options, baseLocation)
    );
  }

  if (value.type !== 'object') {
    issues.push({ message: 'Schema type is not `object`' });
  }

  if (value.additionalProperties) {
    issues.push({ message: 'Schema is a map' });
  }

  return asResults(issues, baseLocation);
};

const problemJsonAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) =>
      problemJsonAssertion(schema, _options, baseLocation)
    );
  }

  if (value.type !== 'object') {
    issues.push({ message: "Problem json must have type 'object'" });
  }

  const type = (value.properties ?? {}).type ?? {};
  if (type.type !== 'string' || type.format !== 'uri-reference') {
    issues.push({
      message:
        "Problem json must have property 'type' with type 'string' and format 'uri-reference'",
    });
  }

  const title = (value.properties ?? {}).title ?? {};
  if (title.type !== 'string') {
    issues.push({ message: "Problem json must have property 'title' with type 'string'" });
  }

  const status = (value.properties ?? {}).status ?? {};
  if (status.type !== 'integer' || status.format !== 'int32') {
    issues.push({
      message:
        "Problem json must have property 'status' with type 'integer' and format 'in32'",
    });
  }

  const detail = (value.properties ?? {}).detail ?? {};
  if (detail.type !== 'string') {
    issues.push({ message: "Problem json must have property 'detail' with type 'string'" });
  }

  const instance = (value.properties ?? {}).instance ?? {};
  if (instance.type !== 'string') {
    issues.push({ message: "Problem json must have property 'instance' with type 'string'" });
  }

  return asResults(issues, baseLocation);
};

const apiInfoSchemaAssertion: CustomFunction = (value, _options, baseLocation) => {
  if (!value || typeof value !== 'object') return [];

  const issues: { message: string }[] = [];
  const combined = [...(value.anyOf ?? []), ...(value.oneOf ?? []), ...(value.allOf ?? [])];

  if (combined.length > 0) {
    return combined.flatMap((schema: unknown) =>
      apiInfoSchemaAssertion(schema, _options, baseLocation)
    );
  }

  if (value.type !== 'object') {
    issues.push({ message: "ApiInfo json must have type 'object'" });
  }

  const name = (value.properties ?? {}).name ?? {};
  if (name.type !== 'string') {
    issues.push({
      message:
        "ApiInfo json must have property 'name' with type 'string' and format 'uri-reference'",
    });
  }

  const version = (value.properties ?? {}).version ?? {};
  const pattern =
    '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$';
  if (version.type !== 'string' || version.pattern !== pattern) {
    issues.push({
      message:
        "ApiInfo json must have property 'version' with type 'string' and pattern for semver.",
    });
  }

  const status = (value.properties ?? {}).status ?? {};
  const requiredStatus = ['ALPHA', 'BETA', 'LIVE', 'DEPRECATED'];
  if (
    status.type !== 'string' ||
    !status['x-extensible-enum'] ||
    !requiredStatus.every((item) => status['x-extensible-enum'].includes(item))
  ) {
    issues.push({
      message:
        'ApiInfo json must have property \'status\' with x-extensible-enum values: ALPHA, BETA, DEPRECATED, LIVE.',
    });
  }

  const releaseDate = (value.properties ?? {}).releaseDate ?? {};
  if (releaseDate.type !== 'string' || releaseDate.format !== 'date') {
    issues.push({
      message: "ApiInfo json must have property 'releaseDate' with type 'string' and format 'date'",
    });
  }

  const documentation = (value.properties ?? {}).documentation ?? {};
  if (documentation.type !== 'string' || documentation.format !== 'uri') {
    issues.push({
      message:
        "ApiInfo json must have property 'documentation' with type 'string' and format 'uri'",
    });
  }

  const releaseNotes = (value.properties ?? {}).releaseNotes ?? {};
  if (releaseNotes.type !== 'string' || releaseNotes.format !== 'uri') {
    issues.push({
      message:
        "ApiInfo json must have property 'releaseNotes' with type 'string' and format 'uri'",
    });
  }

  return asResults(issues, baseLocation);
};

const countResourceTypesAssertion: CustomFunction = (value, options, baseLocation) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];

  const { max } = (options as { max?: number }) ?? {};
  if (typeof max !== 'number') return [];

  const paths = Object.keys(value);
  if (paths.length <= max) return [];

  const resourceTypes = new Set(
    paths.map((path) => path.split('/')[path.startsWith('/') ? 1 : 0]).filter(Boolean)
  );

  if (resourceTypes.size <= max) return [];

  return [
    {
      message: `More than ${max} resource types found`,
      location: baseLocation,
    },
  ];
};

const forbidEnumAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined) return [];
  return [
    {
      message: 'Should use x-extensible-enum instead of enum',
      location: baseLocation,
    },
  ];
};

const infoApiTypeAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined) {
    return [
      {
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
        location: baseLocation,
      },
    ];
  }

  if (value !== 'standard' && value !== 'pygeoapi') {
    return [
      {
        message: "Missing or wrong 'info.x-api-type'. Assuming 'standard'. Valid values: standard, pygeoapi.",
        location: baseLocation,
      },
    ];
  }

  return [];
};

const infoContainsSensitiveDataAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (value === undefined || typeof value !== 'boolean') {
    return [
      {
        message: "Missing or wrong 'info.x-contains-sensitive-data', should be 'boolean'.",
        location: baseLocation,
      },
    ];
  }

  return [];
};

const locationHeaderAssertion: CustomFunction = (value, _opts, baseLocation) => {
  if (!value || typeof value !== 'object') return [];
  const headers = value as Record<string, unknown>;
  const locationHeader = headers.Location;
  if (!locationHeader || typeof locationHeader !== 'object') {
    return [{ message: '201 responses SHOULD define a Location header', location: baseLocation }];
  }

  const inner = locationHeader as Record<string, any>;
  if (typeof inner.$ref === 'string') {
    return [];
  }
  const schema = inner.schema ?? {};
  const issues: AssertResult[] = [];

  if (inner.description === undefined) {
    issues.push({
      message: 'Location header should include a description',
      location: safeChild(baseLocation, 'Location'),
    });
  }

  if (schema.type !== 'string' || schema.format !== 'uri') {
    issues.push({
      message: 'Location header schema should be a string with uri format',
      location: safeChild(safeChild(baseLocation, 'Location'), 'schema'),
    });
  }

  if (schema.example === undefined) {
    issues.push({
      message: 'Location header schema should include an example',
      location: safeChild(safeChild(baseLocation, 'Location'), 'schema'),
    });
  }

  return issues;
};

const problemResponseRule = (mode: ProblemDetailMode): any => {
  const state: { globalSecurity?: unknown[] } = {};

  const resolveResponse = (response: any, ctx: any) => {
    if (response && typeof response.$ref === 'string' && typeof ctx.resolve === 'function') {
      const resolved = ctx.resolve(response);
      if (resolved?.node) return resolved.node;
    }
    return response;
  };

  return {
    Root(root: any) {
      if (Array.isArray((root as any).security)) {
        state.globalSecurity = (root as any).security;
      }
    },
    Operation(operation: any, ctx: any) {
      const responses = operation.responses ?? {};
      const globalSecurityActive =
        Array.isArray(state.globalSecurity) && state.globalSecurity.length > 0;
      const opSecurity = operation.security;

      const requiredAlways = ['400', '404', '500'];
      const requiredIfSecured = ['401', '403'];
      const required: string[] = [];

      if (mode === 'critical') {
        required.push(...requiredAlways);
      }

      if (mode === 'explicit-security') {
        const explicitDisable = Array.isArray(opSecurity) && opSecurity.length === 0;
        const explicitActive = Array.isArray(opSecurity) && opSecurity.length > 0;
        if (explicitActive || (!explicitDisable && globalSecurityActive)) {
          required.push(...requiredIfSecured);
        }
      }

      if (required.length === 0) return;

      const problems: AssertResult[] = [];
      for (const code of required) {
        const response = resolveResponse(responses[code], ctx);
        if (!response) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing response).`,
            location: ctx.location.child(['responses']),
          });
          continue;
        }

        const content =
          response?.content?.['application/problem+json'] ||
          response?.content?.['application/problem+xml'];

        if (!content) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing application/problem+json or application/problem+xml).`,
            location: ctx.location.child(['responses', code]),
          });
          continue;
        }

        if (!content.examples || Object.keys(content.examples).length === 0) {
          problems.push({
            message: `Each operation MUST define Problem Details for: ${required.join(', ')}. Issues: ${code} (missing example).`,
            location: ctx.location.child(['responses', code, 'content']),
          });
        }
      }

      problems.forEach((problem) =>
        ctx.report({
          ...problem,
        })
      );
    },
  };
};

const noGetRequestBodyRule = () => ({
  Operation(operation: any, ctx: any) {
    if (ctx.key === 'get' && operation.requestBody !== undefined) {
      ctx.report({
        message: 'A GET request MUST NOT accept a request body.',
        location: ctx.location.child(['requestBody']),
      });
    }
  },
});

const plugin: Plugin = {
  id: 'ukhsa',
  assertions: {
    objectSchema: buildAssertCustomFunction(objectSchemaAssertion),
    problemJsonSchema: buildAssertCustomFunction(problemJsonAssertion),
    apiInfoSchema: buildAssertCustomFunction(apiInfoSchemaAssertion),
    countResourceTypes: buildAssertCustomFunction(countResourceTypesAssertion),
    forbidEnum: buildAssertCustomFunction(forbidEnumAssertion),
    infoApiType: buildAssertCustomFunction(infoApiTypeAssertion),
    infoContainsSensitiveData: buildAssertCustomFunction(
      infoContainsSensitiveDataAssertion
    ),
    locationHeader: buildAssertCustomFunction(locationHeaderAssertion),
  },
  rules: {
    oas3: {
      'required-problem-responses-critical': () => problemResponseRule('critical'),
      'required-problem-responses-security': () => problemResponseRule('explicit-security'),
      'no-get-request-body': noGetRequestBodyRule,
    },
  },
};

export = () => plugin;
