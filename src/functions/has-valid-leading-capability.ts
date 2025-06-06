'use strict';

/*
Leading Capability Requirement (UKHSA Standard):

info:
  x-leading-capability:
    type: string
    description: MUST match one of the UKHSA Business Capabilities

This Spectral custom function validates that `info.x-leading-capability`
exists and matches one of the predefined capabilities in the controlled list.
*/

import type {
  IFunction,
  IFunctionResult,
  RulesetFunctionContext,
} from '@stoplight/spectral-core';

import CAPABILITIES from './ukhsa-business-capabilities';

/**
 * Spectral custom function to validate `info.x-leading-capability` field.
 */
const validateLeadingCapability = function (
  targetVal: string | null | undefined,
  opts: Record<string, never>,
  context: RulesetFunctionContext
): IFunctionResult[] {
  if (typeof targetVal !== 'string') {
    return [
      {
        message: '`x-leading-capability` must be a string.',
        path: context.path,
      },
    ];
  }

  if (!CAPABILITIES.includes(targetVal)) {
    return [
      {
        message:
          "Missing or wrong 'info.x-leading-capability', should be a valid UKHSA Business Capability.",
        path: context.path,
      },
    ];
  }

  return [];
};

export default validateLeadingCapability as IFunction;
