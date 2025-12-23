import type { Location } from '@redocly/openapi-core';

export type AssertResult = { message: string; location?: Location };
export type CustomFunction = (value: any, options: any, ctx: any) => AssertResult[];
