import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import buildInvocation from '../../utils/vacuum-common';

const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');
const FUNCTIONS_DIR = path.resolve(process.cwd(), 'dist-vacuum', 'functions');

export interface VacuumResult {
  code: string;
  message: string;
  path: string[];
  severity: number;
  range?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
}

/**
 * Runs Vacuum against an inline document and returns the results.
 */
export function runVacuumLint(document: string, rulesetPath: string = RULESET_PATH): VacuumResult[] {
  const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-test-'));
  const specPath = path.join(workDir, 'spec.yaml');
  const reportPath = path.join(workDir, 'report.json');

  try {
    writeFileSync(specPath, document, 'utf8');

    const invocation = buildInvocation([
      'vacuum',
      'spectral-report',
      specPath,
      reportPath,
      '-r',
      rulesetPath,
      '--functions',
      FUNCTIONS_DIR,
      '--resolve-all-refs',
    ], process.cwd());

    const result = spawnSync(invocation.command, invocation.args, { encoding: 'utf8', timeout: 30000, maxBuffer: 10_000_000 });

    if (result.error) {
      throw new Error(`Vacuum failed: ${result.error.message}`);
    }

    if (!existsSync(reportPath)) {
      return [];
    }

    return JSON.parse(readFileSync(reportPath, 'utf8'));
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

export type RuleName = string;

export interface TestScenario {
  name: string;
  document: string;
  errors: Array<Partial<Pick<VacuumResult, 'message' | 'path' | 'severity' | 'code'>>>;
}

/**
 * Jest test helper to validate one or more rules against multiple scenarios using Vacuum.
 */
export default function testRule(rules: RuleName | RuleName[], tests: TestScenario[]): void {
  const rulesToInclude: RuleName[] = Array.isArray(rules) ? rules : [rules];

  describe(`Rule ${rulesToInclude.join(', ')}`, () => {
    for (const t of tests) {
      it(t.name, () => {
        const results = runVacuumLint(t.document);
        const got = results.filter(({ code }) => rulesToInclude.includes(code));
        const expected = t.errors.map((e) => expect.objectContaining(e) as unknown);

        expect(got).toEqual(expected);
      });
    }
  });
}

/**
 * Asserts that the ruleset file exists at the expected location.
 */
export function expectRulesetFileExists(): void {
  if (!existsSync(RULESET_PATH)) {
    throw new Error(`Ruleset file not found at ${RULESET_PATH}`);
  }
}
