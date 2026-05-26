import { mkdtempSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import buildInvocation, { findSpecPath, loadSpec, detectRefFlags, hasFlag } from '../../utils/vacuum-common';

function makeTempDir(prefix = 'vacuum-test-') {
  return mkdtempSync(path.join(tmpdir(), prefix));
}

describe('vacuum-common utility', () => {
  it('findSpecPath returns null for flag-only args and finds files', () => {
    const tmp = makeTempDir();
    try {
      const noFile = findSpecPath(['-r', 'rules.yml'], tmp);
      expect(noFile).toBeNull();

      const spec = path.join(tmp, 'spec.yaml');
      writeFileSync(spec, 'openapi: 3.0.0', 'utf8');
      const found = findSpecPath([spec], tmp);
      expect(found).toBe(spec);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('loadSpec parses YAML and JSON files', () => {
    const tmp = makeTempDir();
    try {
      const yamlSpec = path.join(tmp, 's.yaml');
      writeFileSync(yamlSpec, 'info:\n  title: yaml-test', 'utf8');
      const parsedYaml = loadSpec(yamlSpec);
      expect(parsedYaml.info.title).toBe('yaml-test');

      const jsonSpec = path.join(tmp, 's.json');
      writeFileSync(jsonSpec, JSON.stringify({ info: { title: 'json-test' } }), 'utf8');
      const parsedJson = loadSpec(jsonSpec);
      expect(parsedJson.info.title).toBe('json-test');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('detectRefFlags finds remote and relative $ref values', () => {
    const tmp = makeTempDir();
    try {
      const spec = path.join(tmp, 'refs.yaml');
      const content = `components:\n  A:\n    $ref: "https://example.com/schemas.json"\n  B:\n    $ref: ../common.yaml\n`;
      writeFileSync(spec, content, 'utf8');

      const flags = detectRefFlags(spec);
      expect(flags.hasRemote).toBe(true);
      expect(flags.hasRelative).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('detectRefFlags handles JSON "$ref" patterns', () => {
    const tmp = makeTempDir();
    try {
      const spec = path.join(tmp, 'refs.json');
      const content = JSON.stringify({
        components: {
          A: { $ref: 'https://example.com/schemas.json' },
          B: { $ref: '../common.json' },
        },
      });
      writeFileSync(spec, content, 'utf8');

      const flags = detectRefFlags(spec);
      expect(flags.hasRemote).toBe(true);
      expect(flags.hasRelative).toBe(true);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  it('hasFlag returns presence of a flag', () => {
    expect(hasFlag(['-a', '--foo'], '-a')).toBe(true);
    expect(hasFlag(['-a', '--foo'], '--bar')).toBe(false);
  });

  it('buildInvocation selects pygeoapi ruleset, adds flags, and shapes args for npx', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      // Create ruleset files
      const defaultRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
      const pygeoapiRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.pygeoapi.yml');
      writeFileSync(defaultRuleset, 'rules: []', 'utf8');
      writeFileSync(pygeoapiRuleset, 'rules: []', 'utf8');

      // spec declares pygeoapi and has remote + relative refs
      const specPath = path.join(projectRoot, 'spec.yaml');
      const specContent = 'info:\n  x-api-type: pygeoapi\npaths:\n  /: {}\n$ref: "https://example.com/x"\n';
      writeFileSync(specPath, specContent, 'utf8');

      const invocation = buildInvocation(['vacuum', 'spectral-report', specPath, 'report.json'], projectRoot);

      expect(invocation.rulesetPath).toBe(pygeoapiRuleset);
      expect(invocation.args).toContain('-r');
      expect(invocation.args).toContain('--functions');
      expect(invocation.args).toContain('--resolve-all-refs');
      // When no local binary exists we should use npx and include 'vacuum' at the front
      expect(invocation.command).toBe('npx');
      expect(invocation.args[0]).toBe('vacuum');
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('buildInvocation uses local binary when present and strips leading vacuum arg', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      // create local node_modules .bin vacuum
      const binDir = path.join(projectRoot, 'node_modules', '.bin');
      mkdirSync(binDir, { recursive: true });
      const localBin = path.join(binDir, 'vacuum');
      writeFileSync(localBin, '', 'utf8');

      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(['vacuum', 'spectral-report', specPath, 'report.json'], projectRoot);

      expect(invocation.command).toBe(localBin);
      // leading 'vacuum' should be removed when calling the binary directly
      expect(invocation.args[0]).not.toBe('vacuum');
      expect(invocation.args[0]).toBe('spectral-report');
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('buildInvocation adds --remote and --base when spec has remote and relative refs', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      const defaultRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
      writeFileSync(defaultRuleset, 'rules: []', 'utf8');

      const nested = path.join(projectRoot, 'specs');
      mkdirSync(nested, { recursive: true });
      const specPath = path.join(nested, 'spec.yaml');
      const content = `openapi: 3.0.0\n$ref: "https://example.com/schemas.json"\ncomponents:\n  shared:\n    $ref: ../common.yaml\n`;
      writeFileSync(specPath, content, 'utf8');

      const invocation = buildInvocation(['vacuum', 'spectral-report', specPath, 'report.json'], projectRoot);

      expect(invocation.args).toContain('--remote');
      const baseIndex = invocation.args.indexOf('--base');
      expect(baseIndex).toBeGreaterThanOrEqual(0);
      expect(invocation.args[baseIndex + 1]).toBe(path.dirname(path.resolve(specPath)));
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });

  it('buildInvocation prepends vacuum when caller omitted it and using npx', () => {
    const projectRoot = makeTempDir('proj-');
    try {
      const specPath = path.join(projectRoot, 'spec.yaml');
      writeFileSync(specPath, 'openapi: 3.0.0', 'utf8');

      const invocation = buildInvocation(['spectral-report', specPath, 'report.json'], projectRoot);

      expect(invocation.command).toBe('npx');
      expect(invocation.args[0]).toBe('vacuum');
      expect(invocation.args[1]).toBe('spectral-report');
    } finally {
      rmSync(projectRoot, { recursive: true, force: true });
    }
  });
});
