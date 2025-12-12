'use strict';

import { createRulesetFunction } from '@stoplight/spectral-core';
import type {
  RulesetFunctionContext,
  IFunctionResult,
  Rule,
} from '@stoplight/spectral-core';
import { DiagnosticSeverity } from '@stoplight/types';
import { printPath, PrintStyle } from '@stoplight/spectral-runtime';
import { EOL } from "node:os";
/**
 * this is a utility function obtained from spectral-core
 * https://github.com/stoplightio/spectral/blob/develop/packages/core/src/runner/utils/getLintTargets.ts
 */
import { getLintTargets } from '../utils/getLintTargets.js';


/**
 * Configuration options provided by the ruleset when invoking the override.
 */
type Options = {
  rulesToAdjust: Record<string, 'error' | 'warn' | 'info' | 'hint' | 'off'>;
  value: string;
  target: string;
};

/**
 * Generates a separator (newline or punctuation + newline) to append before the downgrade message.
 * Ensures proper formatting of the rule message.
 *
 * @param message - The original rule message.
 * @returns A string separator to append before the downgrade message.
 */
function generateMessageSeparator(message: string) {
  const lastChar = message.charAt(message.length - 1);
  const needsTerminalPunctuation = message.length > 0 && !/[.!?]/.test(lastChar);

  return message.length > 0 ? (needsTerminalPunctuation ? `.${EOL}` : EOL) : '';
}

/**
 * Overrides certain rule severities when a configurable marker in the target document matches.
 * Intended to be used to downgrade severities for specific API types (e.g., pygeoapi).
 *
 * @param targetValue - The portion of the document provided by the rule's `given` selector.
 * @param options - Configuration options for the function.
 * @param context - The ruleset function context.
 * @returns An array of function results (always empty in this case).
 */
export const runRule = (
  targetValue: unknown,
  options: Options,
  context: RulesetFunctionContext
): IFunctionResult[] => {
  const targetField = options.target;
  if (targetField.trim().length === 0) {
    throw new Error('overrideSeverity requires a non-empty target selector');
  }
  const targets = getLintTargets(targetValue, targetField)
  const matchingTarget = targets.find(({ value }) => value === options.value);

  if (matchingTarget && typeof matchingTarget.value === 'string') {
    const apiType = matchingTarget.value;
    const targetLabel = printPath(matchingTarget.path, PrintStyle.Dot);

    // Modify rule severity for openapi definitions
    const { owner: { rules } } = context.rule as Rule;
    for (const [ruleId, severity] of Object.entries(options.rulesToAdjust)) {
      const r = rules[ruleId];
      if (!r) continue;
      const previousLabel = DiagnosticSeverity[r.severity].toLowerCase();

      if (previousLabel !== severity) {
        r.severity = severity;
        const downgradeMessage = `Severity has been downgraded from \`${previousLabel}\` due to \`${targetLabel}\` of \`${apiType}\``;
        if (typeof r.message === 'string') {
          if (!r.message.includes(downgradeMessage)) {
            const trimmedMessage = r.message.trimEnd();
            r.message = `${trimmedMessage}${generateMessageSeparator(trimmedMessage)}${downgradeMessage}`;
          }
        } else {
          r.message = downgradeMessage;
        }
      }
    }
  }

  return [];
};

const exported = createRulesetFunction<unknown, Options>({
  input: null,
  errorOnInvalidInput: true,
  options: {
    type: 'object',
    description: 'Overrides certain rule severities based on a configurable marker in the document.',
    additionalProperties: false,
    properties: {
      value: {
        type: 'string',
        description: 'The expected value to compare against (e.g., pygeoapi).',
      },
      target: {
        type: 'string',
        description: 'JsonPath expression or field path used to locate the target value (defaults to info.x-api-type).',
      },
      rulesToAdjust: {
        type: 'object',
        description: 'A mapping of rule IDs to their new severity levels.',
        additionalProperties: {
          type: 'string',
          enum: ['error', 'warn', 'info', 'hint', 'off'],
        },
      },
    },
    required: ['value', 'target', 'rulesToAdjust'],
  },
}, runRule);

export default exported;
