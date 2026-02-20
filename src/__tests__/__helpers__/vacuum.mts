import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const RULESET_PATH = path.resolve(process.cwd(), 'ukhsa.oas.rules.yml');
const FUNCTIONS_DIR = path.resolve(process.cwd(), 'dist-vacuum', 'functions');
const LOCAL_VACUUM_BIN = path.resolve(process.cwd(), 'node_modules', '.bin', 'vacuum');

type VacuumResult = {
  code?: string;
  message?: string;
  severity?: number;
};

export function runVacuumReport(spec: string) {
  const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-test-'));
  const specPath = path.join(workDir, 'spec.yml');
  const reportPath = path.join(workDir, 'report.json');

  writeFileSync(specPath, spec, 'utf8');

  const useLocal = existsSync(LOCAL_VACUUM_BIN);
  const command = useLocal ? LOCAL_VACUUM_BIN : 'npx';
  const commandArgs = useLocal
    ? ['spectral-report', specPath, reportPath, '-r', RULESET_PATH, '--functions', FUNCTIONS_DIR]
    : ['vacuum', 'spectral-report', specPath, reportPath, '-r', RULESET_PATH, '--functions', FUNCTIONS_DIR];

  const result = spawnSync(command, commandArgs, {
    encoding: 'utf8',
    timeout: 30000,
    maxBuffer: 10_000_000,
  });

  const parsed: VacuumResult[] = existsSync(reportPath)
    ? JSON.parse(readFileSync(reportPath, 'utf8'))
    : [];

  rmSync(workDir, { recursive: true, force: true });

  return { result, parsed };
}
