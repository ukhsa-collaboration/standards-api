'use strict';

import { createRulesetFunction } from "@stoplight/spectral-core";
//import { JsonPath } from '@stoplight/types';

/**
 * @import Core from "@stoplight/spectral-core"
 */

/**
 * @typedef {object} options
 * @property {object} rulesToAdjust - A mapping of rule IDs to their new severity levels.
 * @property {string} value - The expected value indicating a legacy API.
 */

/**
 * Overrides certain rule severities for rules based on custom jsonpath condition.
 * @type {Core.RulesetFunction<any, null>}
 * @param {any} targetValue - The value to validate.
 * @param {any} options - Additional options (not used).
 * @param {Core.RulesetFunctionContext} context - The context.
 */
const overrideSeverity = (targetValue, options = null, context) => {
  // Access the current ruleset
  //console.log(arguments);
  const { document, rule } = context;

  const { owner: { rules } } = /** @type {Core.Rule} */ (rule);
  const apiType = targetValue?.info?.['x-api-type'];
  console.log(`|${apiType}| === |${options.value}|`)
  console.log(options.rulesToAdjust)

  // Check for API type
  //const result = JSONPath({ path: options.condition.jsonPath, json: /** @type {string} */ (document.data) });
  //const apiType = targetValue.info?.["x-api-type"] || "standard";

  if (apiType === options.value) {
    // Modify rule severity for legacy APIs
    console.log("Applying legacy overrides");

    for (const [rule, severity] of Object.entries(options.rulesToAdjust)) {
      if (rules[rule]) {
        console.log("before:",rules[rule].definition.severity)
        rules[rule].severity = severity;
        console.log("after:",rules[rule].definition.severity)
        console.log(rules[rule].definition);
      }
      //rules["parameter-description"].severity = "info";
    }
  }

  return [];
}

export default createRulesetFunction({
  input: null,
  errorOnInvalidInput: true,
  options: {
    type: 'object',
    description: 'Overrides certain rule severities based on custom JSONPath condition.',
    additionalProperties: false,
    properties: {
      value: {
        type: 'string',
        description: 'The expected value to compare against.',
      },
      rulesToAdjust: {
        type: 'object',
        description: 'A mapping of rule IDs to their new severity levels.',
        additionalProperties: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'hint', 'off']
        }
      }
    },
    required: ['value', 'rulesToAdjust']
  }
}, overrideSeverity)
