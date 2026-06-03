import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

type ReportEntry = {
  code?: string;
  severity?: number;
};

function runSpectralReport(specPath: string, rulesetPath: string, reportPath: string) {
  const result = spawnSync('npx', ['vacuum', 'spectral-report', specPath, reportPath, '-r', rulesetPath], {
    encoding: 'utf8',
    timeout: 30_000,
    maxBuffer: 10_000_000,
  });

  if (result.error) {
    throw new Error(`Vacuum failed: ${result.error.message}`);
  }

  if (result.signal) {
    throw new Error(`Vacuum terminated with signal: ${result.signal}`);
  }

  const report = JSON.parse(readFileSync(reportPath, 'utf8')) as ReportEntry[];
  return { report, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

function countByCode(entries: ReportEntry[]) {
  return entries.reduce<Record<string, number>>((acc, entry) => {
    const code = entry.code ?? '__missing_code__';
    acc[code] = (acc[code] ?? 0) + 1;
    return acc;
  }, {});
}

describe('Vacuum extends parity', () => {
  it('keeps all removed-extends baseline validations active via vacuum:oas', () => {
    const workDir = mkdtempSync(path.join(tmpdir(), 'vacuum-extends-parity-'));

    try {
      const specPath = path.join(workDir, 'synthetic-bad.yml');
      const oldRulesetPath = path.join(workDir, 'old.yml');
      const newRulesetPath = path.join(workDir, 'new.yml');
      const oldReportPath = path.join(workDir, 'old-report.json');
      const newReportPath = path.join(workDir, 'new-report.json');

      writeFileSync(
        specPath,
        `openapi: 3.0.3
info:
  title: t
  version: 1.0.0
paths:
  /pets:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                properties:
                  id:
                    type: integer
components:
  schemas:
    Demo:
      properties:
        val:
          type: string
`,
        'utf8',
      );

      writeFileSync(
        oldRulesetPath,
        `extends:
  - [spectral:oas, recommended]
  - '@stoplight/spectral-documentation'
`,
        'utf8',
      );

      writeFileSync(
        newRulesetPath,
        `extends:
  - vacuum:oas
`,
        'utf8',
      );

      const oldRun = runSpectralReport(specPath, oldRulesetPath, oldReportPath);
      const newRun = runSpectralReport(specPath, newRulesetPath, newReportPath);

      const oldCounts = countByCode(oldRun.report);
      const newCounts = countByCode(newRun.report);

      // Baseline inheritance should remain active and equivalent.
      expect(Object.keys(oldCounts).length).toBeGreaterThan(0);
      expect(newCounts).toEqual(oldCounts);

      // Ensure documentation and OAS baseline checks are still being exercised.
      expect(newCounts['component-description']).toBeGreaterThan(0);
      expect(newCounts['oas3-missing-example']).toBeGreaterThan(0);

      // Both modes should resolve to the same inherited baseline size.
      expect(oldRun.stdout).toContain('against 55 rules');
      expect(newRun.stdout).toContain('against 55 rules');
    } finally {
      rmSync(workDir, { recursive: true, force: true });
    }
  });
});
