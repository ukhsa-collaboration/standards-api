import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import buildInvocation from '../../utils/vacuum-common';

const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');
const FUNCTIONS_DIR = path.resolve(process.cwd(), 'dist-vacuum', 'functions');
const SPEC_PATH = path.resolve(process.cwd(), 'example', 'example.1.0.0.oas.yml');

function runVacuumReport() {
  const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-baseline-'));
  const reportPath = path.join(workDir, 'report.json');

  try {
    const invocation = buildInvocation([
      'vacuum',
      'spectral-report',
      SPEC_PATH,
      reportPath,
      '-r',
      RULESET_PATH,
      '--functions',
      FUNCTIONS_DIR,
      '--resolve-all-refs',
    ], process.cwd());

    const result = spawnSync(invocation.command, invocation.args, {
      encoding: 'utf8',
      timeout: 30_000,
      maxBuffer: 10_000_000,
    });

    if (result.error) {
      throw new Error(`Vacuum failed: ${result.error.message}`);
    }

    const parsed = JSON.parse(readFileSync(reportPath, 'utf8')) as Array<{ code?: string }>;
    return { result, parsed };
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

describe('Vacuum baseline inheritance', () => {
  it('keeps baseline OAS/documentation validations active without Spectral package extends', () => {
    const { result, parsed } = runVacuumReport();

    expect(result.error).toBeUndefined();
    expect(result.signal).toBeNull();

    const codes = new Set(parsed.map((r) => r.code).filter(Boolean));

    expect(codes.has('oas3-missing-example')).toBe(true);
    expect(codes.has('component-description')).toBe(true);
    expect(codes.has('description-duplication')).toBe(true);
  });
});
