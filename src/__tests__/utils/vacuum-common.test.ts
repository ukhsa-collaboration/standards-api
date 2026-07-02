import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import buildInvocation from '../../utils/vacuum-common';

function makeTempDir(prefix = 'vacuum-test-') {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

describe('vacuum-common buildInvocation', () => {
  it('injects ruleset, functions, ref-resolution and nested-refs flags by default', () => {
    const projectRoot = makeTempDir('proj-');
    const originalPath = process.env.PATH;
    try {
      process.env.PATH = '';
      const defaultRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
      writeFileSync(defaultRuleset, 'rules: []', 'utf8');

      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(
        ['vacuum', 'spectral-report', specPath, 'report.json'],
        projectRoot,
      );

      expect(invocation.rulesetPath).toBe(defaultRuleset);
      expect(invocation.args).toContain('-r');
      expect(invocation.args).toContain('--functions');
      expect(invocation.args).toContain('--resolve-all-refs');
      expect(invocation.args).toContain('--nested-refs-doc-context');
      expect(invocation.command).toBe('npx');
      expect(invocation.args[0]).toBe('vacuum');
    } finally {
      process.env.PATH = originalPath;
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('uses the project vacuum binary when present and strips a leading vacuum arg', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      const projectVacuumDir = path.join(projectRoot, 'vacuum', 'bin');
      mkdirSync(projectVacuumDir, { recursive: true });
      const projectBin = path.join(projectVacuumDir, 'vacuum');
      writeFileSync(projectBin, '', 'utf8');

      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(
        ['vacuum', 'spectral-report', specPath, 'report.json'],
        projectRoot,
      );

      expect(invocation.command).toBe(projectBin);
      expect(invocation.args[0]).toBe('spectral-report');
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('prepends vacuum when the caller omitted it and falls back to npx', () => {
    const projectRoot = makeTempDir('proj-');
    const originalPath = process.env.PATH;
    try {
      process.env.PATH = '';
      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(
        ['spectral-report', specPath, 'report.json'],
        projectRoot,
      );

      expect(invocation.command).toBe('npx');
      expect(invocation.args[0]).toBe('vacuum');
      expect(invocation.args[1]).toBe('spectral-report');
    } finally {
      process.env.PATH = originalPath;
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('does not inject lint flags for non-lint subcommands', () => {
    const projectRoot = makeTempDir('proj-');
    const originalPath = process.env.PATH;
    try {
      process.env.PATH = '';
      const invocation = buildInvocation(['vacuum', '--version'], projectRoot);

      expect(invocation.command).toBe('npx');
      expect(invocation.args).toEqual(['vacuum', '--version']);
    } finally {
      process.env.PATH = originalPath;
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('treats `-f` as a vacuum output-format flag (not --functions) and still injects --functions', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(
        ['vacuum', 'lint', specPath, '-f', 'github-actions'],
        projectRoot,
      );

      expect(invocation.args).toContain('--functions');
      expect(invocation.args).toContain('-f');
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('honors caller-provided -r / --ruleset / --functions instead of duplicating them', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      const customRuleset = path.join(projectRoot, 'custom.yml');
      const customFunctions = path.join(projectRoot, 'custom-fns');
      writeFileSync(customRuleset, 'rules: []', 'utf8');
      mkdirSync(customFunctions, { recursive: true });

      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(
        ['vacuum', 'lint', specPath, '-r', customRuleset, '--functions', customFunctions],
        projectRoot,
      );

      const rIndices = invocation.args.reduce<number[]>((acc, arg, i) => {
        if (arg === '-r') acc.push(i);
        return acc;
      }, []);
      const fnIndices = invocation.args.reduce<number[]>((acc, arg, i) => {
        if (arg === '--functions') acc.push(i);
        return acc;
      }, []);
      expect(rIndices.length).toBe(1);
      expect(fnIndices.length).toBe(1);
      expect(invocation.args[rIndices[0] + 1]).toBe(customRuleset);
      expect(invocation.args[fnIndices[0] + 1]).toBe(customFunctions);
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });
});
