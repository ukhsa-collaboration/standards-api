declare module '@redocly/openapi-core/lib/rules/common/assertions/asserts' {
  export type AssertResult = { message?: string; location?: any };
  export function buildAssertCustomFunction(fn: (...args: any[]) => AssertResult[]): any;
}

declare module '@redocly/openapi-core/lib/config/types' {
  export type CustomFunction = (value: any, options: any, baseLocation: any) => any[];
  export type Plugin = {
    id: string;
    assertions?: Record<string, any>;
    rules?: { oas3?: Record<string, any> };
  };
}

declare module '@redocly/openapi-core/lib/ref-utils' {
  export type Location = {
    child: (key: string | number | (string | number)[]) => Location;
  };
}

declare module '@redocly/openapi-core/lib/visitors' {
  export type Oas3Rule = (options?: any) => Record<string, any>;
}
