import fs from 'node:fs';
import path from 'node:path';

import SpectralCore from '@stoplight/spectral-core';
import spectralRuntime from "@stoplight/spectral-runtime";
import { bundleAndLoadRuleset } from "@stoplight/spectral-ruleset-bundler/with-loader";
import { commonjs } from '@stoplight/spectral-ruleset-bundler/plugins/commonjs';
import { httpAndFileResolver } from '@stoplight/spectral-ref-resolver';
import SpectralParsers from '@stoplight/spectral-parsers';

import type { IRuleResult, Ruleset, RulesetDefinition } from '@stoplight/spectral-core';

const { fetch } = spectralRuntime;
const { Spectral, Document } = SpectralCore;
const { Yaml } = SpectralParsers;
const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');

/**
 * Loads the Spectral ruleset definition from a local YAML file.
 *
 * @throws {Error} If the ruleset file does not exist at the expected path.
 * @returns {RulesetDefinition} The parsed ruleset definition object.
 */
async function loadRulesetFromYaml(): Promise<Ruleset> {
  if (!fs.existsSync(RULESET_PATH)) {
    throw new Error(`Ruleset file not found at ${RULESET_PATH}`);
  }

  return await bundleAndLoadRuleset(RULESET_PATH, { fs, fetch }, [commonjs()]);

}
const baseRuleset = await loadRulesetFromYaml() as any;

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
 * Creates a Spectral instance configured to run only the specified rules.
 *
 * @param {RuleName[]} rules - Array of rule names to include in the Spectral instance.
 * @throws {Error} If any requested rule is not found in the loaded ruleset.
 * @returns {SpectralCore.Spectral} A Spectral instance with the filtered ruleset.
 */
export function createWithRules(rules: RuleName[]): SpectralCore.Spectral {
  const s = new Spectral({ resolver: httpAndFileResolver });
  const sourceRules: Record<string, any> = (baseRuleset?.rules ?? {}) as Record<string, any>;

  const filtered: Record<string, any> = Object.fromEntries(
    Object.entries(sourceRules)
      .filter(([name]) => rules.includes(name as RuleName))
  );
  baseRuleset.rules = filtered;

  s.setRuleset(baseRuleset as RulesetDefinition);

  return s;
}

/**
 * Jest test helper to validate a single Spectral rule against multiple scenarios.
 *
 * @param {RuleName} ruleName - The name of the rule to test.
 * @param {RuleName[]} [additionalRules=[]] - Optional array of additional rule names to include.
 * @param {Scenario} tests - Array of test scenarios, each with a document and expected errors.
 */
export default function testRule(ruleName: RuleName, additionalRules: RuleName[] = [], tests: Scenario): void {
  describe(`Rule ${String(ruleName)}`, () => {
    for (const t of tests) {
      it(t.name, async () => {
        const rulesToInclude = [ruleName, ...additionalRules];
        const spectral = createWithRules(rulesToInclude);

        const doc =
          t.document instanceof Document
            ? t.document
            : new Document(t.document, Yaml, 'inline.yaml');

        const results = await spectral.run(doc);
        const got = results.filter(({ code }) => rulesToInclude.includes(<string>code));
        const expected = t.errors.map((e) => expect.objectContaining(e) as unknown);

        expect(got).toEqual(expected);
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
