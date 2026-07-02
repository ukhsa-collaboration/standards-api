import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');
const FUNCTIONS_DIR = path.resolve(process.cwd(), 'dist', 'functions');
const SPEC_PATH = path.resolve(
  process.cwd(),
  'src',
  '__tests__',
  '__fixtures__',
  'openapi-pygeoapi-big.yml',
);

function runVacuumSpectralReport(specPath: string) {
  const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-'));
  const reportPath = path.join(workDir, 'report.json');
  const vacuumBin = path.resolve(process.cwd(), 'node_modules', '.bin', 'vacuum');

  const started = Date.now();
  const result = spawnSync(
    vacuumBin,
    [
      'spectral-report',
      specPath,
      reportPath,
      '-r',
      RULESET_PATH,
      '--functions',
      FUNCTIONS_DIR,
    ],
    { encoding: 'utf8', timeout: 60_000, maxBuffer: 10_000_000 },
  );

  const elapsedMs = Date.now() - started;
  const reportExists = existsSync(reportPath);
  const parsed = reportExists ? JSON.parse(readFileSync(reportPath, 'utf8')) : [];

  rmSync(workDir, { recursive: true, force: true });

  return { result, parsed, elapsedMs };
}

describe('Vacuum large-spec compatibility', () => {
  it('processes the pygeoapi large spec with Vacuum without hanging', () => {
    const { result, parsed, elapsedMs } = runVacuumSpectralReport(SPEC_PATH);

    // Command should complete (may exit non-zero due to lint failures, that is fine) and within the timeout.
    expect(result.error).toBeUndefined();
    expect(result.signal).toBeNull();
    expect(elapsedMs).toBeLessThan(60_000);

    // The strict variant must NOT fire on a pygeoapi-marked spec; the paired
    // -pygeoapi sibling must fire at `warn` severity instead.
    const strictHits = parsed.filter((r: any) => r.code === 'must-use-https-protocol-only');
    expect(strictHits.length).toBe(0);

    const pygeoapiHits = parsed.filter((r: any) => r.code === 'must-use-https-protocol-only-pygeoapi');
    expect(pygeoapiHits.length).toBeGreaterThan(0);
    expect(pygeoapiHits.every((r: any) => r.severity === 1)).toBe(true);
  }, 70_000);
});
