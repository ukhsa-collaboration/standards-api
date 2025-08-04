import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

/**
 * Represents a single result from Spectral's linting output.
 */
interface SpectralResult {
  code: string;
  message: string;
  path: (string | number)[];
  severity: number;
}

/**
 * Stores the result of running tests against a single rule.
 */
interface TestCaseResult {
  rule: string;
  validPass: boolean;
  invalidPass: boolean;
}

const BASE_DIR = 'src/__tests__';
const TESTDATA_ROOT = path.join(BASE_DIR, 'testdata');
const RULESETS_DIR = path.join(BASE_DIR, 'rulesets');
const showCoverage = process.argv.includes('--coverage');

/**
 * Runs Spectral lint on a given OpenAPI file using the provided ruleset.
 *
 * Handles edge cases where Spectral emits extra characters around JSON
 * and ensures clean JSON is parsed from the output or error stream.
 *
 * @param filePath - Path to the OpenAPI file to lint.
 * @param rulesetPath - Path to the Spectral ruleset to apply.
 * @returns An array of `SpectralResult` representing violations.
 */
function lint(filePath: string, rulesetPath: string): SpectralResult[] {
  const args = ['spectral', 'lint', '-f', 'json', '--quiet', '-r', rulesetPath, filePath];
  try {
    const output = execFileSync('npx', args, { encoding: 'utf8' }).trim();
    const jsonStart = output.indexOf('[');
    const jsonEnd = output.lastIndexOf(']') + 1;
    const jsonClean = output.slice(jsonStart, jsonEnd);
    return JSON.parse(jsonClean);
  } catch (e: any) {
    if (e.stdout) {
      try {
        const raw = e.stdout.trim();
        const jsonStart = raw.indexOf('[');
        const jsonEnd = raw.lastIndexOf(']') + 1;
        const jsonClean = raw.slice(jsonStart, jsonEnd);
        return JSON.parse(jsonClean);
      } catch {
        console.error(`❌ Failed to parse JSON from: ${filePath}\n${e.stdout}`);
      }
    } else {
      console.error(`❌ Failed to lint ${filePath}:\n${e.message}`);
    }
    return [];
  }
}

/**
 * Checks if a given rule code appears in the Spectral lint results.
 *
 * @param results - Array of `SpectralResult` objects from linting.
 * @param code - The rule code to search for.
 * @returns `true` if the rule violation is present; otherwise `false`.
 */
function hasViolation(results: SpectralResult[], code: string): boolean {
  return results.some(r => r.code === code);
}

const testResults: TestCaseResult[] = [];
const start = performance.now();

for (const testDir of fs.readdirSync(TESTDATA_ROOT)) {
  const testPath = path.join(TESTDATA_ROOT, testDir);
  const rulesetPath = path.join(RULESETS_DIR, `${testDir}.yaml`);
  const expectedRule = testDir;

  const validPath = path.join(testPath, 'valid.yaml');
  const invalidPath = path.join(testPath, 'invalid.yaml');

  const validResults = lint(validPath, rulesetPath);
  const invalidResults = lint(invalidPath, rulesetPath);

  const validPass = !hasViolation(validResults, expectedRule);
  const invalidPass = hasViolation(invalidResults, expectedRule);

  testResults.push({ rule: expectedRule, validPass, invalidPass });

  console.log(
    `${validPass ? '✅' : '❌'} [${expectedRule}] Valid file ${validPass ? 'passed' : 'reported unexpected violation'}`
  );
  console.log(
    `${invalidPass ? '✅' : '❌'} [${expectedRule}] Invalid file ${invalidPass ? 'failed as expected' : 'did NOT report expected violation'}`
  );
}

const totalSuites = testResults.length;
const totalTests = totalSuites * 2;
const passedTests = testResults.reduce(
  (sum, r) => sum + Number(r.validPass) + Number(r.invalidPass), 0
);
const failedTests = totalTests - passedTests;
const failedSuites = testResults.filter(r => !r.validPass || !r.invalidPass).length;
const duration = ((performance.now() - start) / 1000).toFixed(2);

if (showCoverage) {
  const ruleNames = testResults.map(r => r.rule);
  const maxNameLength = Math.max(...ruleNames.map(n => n.length), 4);
  const nameCol = Math.max(6, maxNameLength);

  const header = `${'File'.padEnd(nameCol)} | % Pass | % Fail |`;
  const sep = '-'.repeat(header.length);

  console.log('\n' + sep);
  console.log(header);
  console.log(sep);

  for (const r of testResults) {
    const passCount = Number(r.validPass) + Number(r.invalidPass);
    const failCount = 2 - passCount;
    const passPct = `${Math.round((passCount / 2) * 100)}%`.padStart(7);
    const failPct = `${Math.round((failCount / 2) * 100)}%`.padStart(7);
    console.log(`${r.rule.padEnd(nameCol)} |${passPct} |${failPct} |`);
  }

  console.log(sep);
}

// Test summary
console.log('\nTest Summary');
console.log('------------');
console.log(`Test Suites: ${failedSuites > 0 ? `${failedSuites} failed, ` : ''}${totalSuites} total`);
console.log(`Tests:       ${failedTests > 0 ? `${failedTests} failed, ` : ''}${passedTests} passed, ${totalTests} total`);
console.log(`Time:        ${duration}s`);

if (!showCoverage) {
  console.log("Run with `--coverage` for detailed report");
}

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✅ All Spectral rule tests passed');
}
