import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import yaml from 'js-yaml';

import type { IRuleResult, Ruleset, RulesetDefinition } from '@stoplight/spectral-core';

// Stoplight runtime pkgs via CJS interop (stable under ESM Jest)
const require = createRequire(import.meta.url);
const { Spectral, Document } = require('@stoplight/spectral-core');
const { httpAndFileResolver } = require('@stoplight/spectral-ref-resolver');
const Parsers = require('@stoplight/spectral-parsers');
const { oas2, oas3 } = require('@stoplight/spectral-formats');
const spectralFns = require('@stoplight/spectral-functions');

const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');

/**
 * Loads the Spectral ruleset definition from a local YAML file.
 *
 * @throws {Error} If the ruleset file does not exist at the expected path.
 * @returns {RulesetDefinition} The parsed ruleset definition object.
 */
function loadRulesetFromYaml(): RulesetDefinition {
  if (!fs.existsSync(RULESET_PATH)) {
    throw new Error(`Ruleset file not found at ${RULESET_PATH}`);
  }
  const raw = fs.readFileSync(RULESET_PATH, 'utf8');
  return yaml.load(raw) as RulesetDefinition;
}
const baseRuleset = loadRulesetFromYaml() as any;

export type RuleName = keyof Ruleset['rules'];

type Scenario = ReadonlyArray<
  Readonly<{
    name: string;
    document: string | InstanceType<typeof Document>;
    errors: ReadonlyArray<
      Partial<Pick<IRuleResult, 'message' | 'path' | 'severity' | 'code' | 'range'>>
    >;
  }>
>;

/**
 * Recursively replaces string-based function references in a rule definition
 * with actual function implementations from `@stoplight/spectral-functions`.
 *
 * @param {any} ruleDef - The raw rule definition, possibly with function names as strings.
 * @throws {Error} If a referenced function name is not found in `spectralFns`.
 * @returns {any} The rule definition with materialized function references.
 */
function materializeFunctions(ruleDef: any): any {
  const clone = JSON.parse(JSON.stringify(ruleDef));

  const normalize = (step: any) => {
    if (step && typeof step.function === 'string') {
      const fnName = step.function;
      const impl = spectralFns[fnName];
      if (typeof impl !== 'function') {
        throw new Error(
          `Rule references unknown function "${fnName}". ` +
          `Add or map it in tests (from @stoplight/spectral-functions or your own).`
        );
      }
      step.function = impl;
    }
    return step;
  };

  if (clone.then) {
    if (Array.isArray(clone.then)) {
      clone.then = clone.then.map(normalize);
    } else if (typeof clone.then === 'object') {
      clone.then = normalize(clone.then);
    }
  }

  return clone;
}

/**
 * Creates a Spectral instance configured to run only the specified rules.
 *
 * @param {RuleName[]} rules - Array of rule names to include in the Spectral instance.
 * @throws {Error} If any requested rule is not found in the loaded ruleset.
 * @returns {InstanceType<typeof Spectral>} A Spectral instance with the filtered ruleset.
 */
export function createWithRules(rules: RuleName[]): InstanceType<typeof Spectral> {
  const s = new Spectral({ resolver: httpAndFileResolver });

  const sourceRules: Record<string, any> = (baseRuleset?.rules ?? {}) as Record<string, any>;
  const filtered: Record<string, any> = {};

  for (const name of rules as string[]) {
    const raw = sourceRules[name];
    if (!raw) throw new Error(`Rule "${name}" not found in ${RULESET_PATH}`);
    filtered[name] = materializeFunctions(raw);
  }

  s.setRuleset({ rules: filtered } as RulesetDefinition, { formats: { oas2, oas3 } });

  return s;
}

/**
 * Jest test helper to validate a single Spectral rule against multiple scenarios.
 *
 * @param {RuleName} ruleName - The name of the rule to test.
 * @param {Scenario} tests - Array of test scenarios, each with a document and expected errors.
 */
export default function testRule(ruleName: RuleName, tests: Scenario): void {
  describe(`Rule ${String(ruleName)}`, () => {
    for (const t of tests) {
      it(t.name, async () => {
        const spectral = createWithRules([ruleName]);

        const doc =
          t.document instanceof Document
            ? t.document
            : new Document(t.document, Parsers.Yaml, 'inline.yaml');

        const results = await spectral.run(doc);
        const got = results.filter(({ code }) => code === ruleName);

        expect(got).toEqual(
          t.errors.map((e) => expect.objectContaining(e) as unknown)
        );
      });
    }
  });
}

/**
 * Asserts that the ruleset file exists at the expected location.
 *
 * @throws {Error} If the ruleset file is missing.
 */
export function expectRulesetFileExists(): void {
  if (!fs.existsSync(RULESET_PATH)) {
    throw new Error(`Ruleset file not found at ${RULESET_PATH}`);
  }
}
