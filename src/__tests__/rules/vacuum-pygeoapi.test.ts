import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const RULESET_PATH = path.resolve(process.cwd(), '.spectral.yaml');
const FUNCTIONS_DIR = path.resolve(process.cwd(), 'dist-vacuum', 'functions');
const SPEC_PATH = path.resolve(process.cwd(), 'openapi-pygeoapi-big.yml');

function runVacuumSpectralReport(specPath: string) {
  const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-'));
  const reportPath = path.join(workDir, 'report.json');

  const started = Date.now();
  const result = spawnSync(
    'npx',
    [
      'vacuum',
      'spectral-report',
      specPath,
      reportPath,
      '-r',
      RULESET_PATH,
      '--functions',
      FUNCTIONS_DIR,
    ],
    { encoding: 'utf8', timeout: 30000, maxBuffer: 10_000_000 },
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
    expect(elapsedMs).toBeLessThan(30_000);

    // We should have a report with results; pick a rule that fails on the fixture (HTTP server).
    const hits = parsed.filter((r: any) => r.code === 'must-use-https-protocol-only');
    expect(hits.length).toBeGreaterThan(0);
  });
});
