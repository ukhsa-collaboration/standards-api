import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/vacuum-lint.mjs <vacuum args...>');
  process.exit(1);
}

const projectRoot = process.cwd();
const defaultRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
const pygeoapiRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.pygeoapi.yml');
const functionsDir = path.resolve(projectRoot, 'dist-vacuum', 'functions');

function findSpecPath(argv) {
  for (const arg of argv) {
    if (arg.startsWith('-')) continue;
    if (fs.existsSync(arg) && fs.statSync(arg).isFile()) {
      return arg;
    }
  }
  return null;
}

function loadSpec(specPath) {
  const raw = fs.readFileSync(specPath, 'utf8');
  if (specPath.endsWith('.json')) {
    return JSON.parse(raw);
  }
  return yaml.load(raw);
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

function detectRefFlags(specPath) {
  const raw = fs.readFileSync(specPath, 'utf8');
  const refs = [];
  const jsonRefRegex = /"\$ref"\s*:\s*"([^"]+)"/g;
  const yamlRefRegex = /\$ref\s*:\s*['"]?([^'"\s]+)['"]?/g;
  let match;

  while ((match = jsonRefRegex.exec(raw))) {
    refs.push(match[1]);
  }
  while ((match = yamlRefRegex.exec(raw))) {
    refs.push(match[1]);
  }

  const hasRemote = refs.some((ref) => /^(https?:|file:)/.test(ref));
  const hasRelative = refs.some((ref) => /^\.\.?\//.test(ref));

  return { hasRemote, hasRelative };
}

const specPath = findSpecPath(args);
let rulesetPath = defaultRuleset;

if (specPath) {
  try {
    const spec = loadSpec(specPath);
    const apiType = spec?.info?.['x-api-type'];
    if (apiType === 'pygeoapi') {
      rulesetPath = pygeoapiRuleset;
    }
  } catch (err) {
    console.error(`Failed to read spec at ${specPath}:`, err.message);
  }
}

const finalArgs = [...args];
if (!hasFlag(finalArgs, '-r') && !hasFlag(finalArgs, '--ruleset')) {
  finalArgs.push('-r', rulesetPath);
}
if (!hasFlag(finalArgs, '--functions') && !hasFlag(finalArgs, '-f')) {
  finalArgs.push('--functions', functionsDir);
}
if (!hasFlag(finalArgs, '--resolve-nested-refs')) {
  finalArgs.push('--resolve-nested-refs');
}
if (!hasFlag(finalArgs, '--jsonpath-lazy')) {
  finalArgs.push('--jsonpath-lazy');
}
if (specPath) {
  const { hasRemote, hasRelative } = detectRefFlags(specPath);
  if (hasRemote && !hasFlag(finalArgs, '--remote')) {
    finalArgs.push('--remote');
  }
  if (hasRelative && !hasFlag(finalArgs, '--base') && !hasFlag(finalArgs, '-b')) {
    finalArgs.push('--base', path.dirname(path.resolve(specPath)));
  }
}

const projectVacuumRoot = path.resolve(projectRoot, 'vacuum', 'vacuum');
const projectVacuumBin = path.resolve(projectRoot, 'vacuum', 'bin', 'vacuum');
const customVacuumBin = '/Users/andrii/PycharmProjects/vacuum/vacuum';
const localVacuumBin = path.resolve(projectRoot, 'node_modules', '.bin', 'vacuum');
const useProjectRoot = fs.existsSync(projectVacuumRoot);
const useProjectBin = fs.existsSync(projectVacuumBin);
const useCustom = fs.existsSync(customVacuumBin);
const useLocal = fs.existsSync(localVacuumBin);
const command = useProjectRoot ? projectVacuumRoot : useProjectBin ? projectVacuumBin : useCustom ? customVacuumBin : useLocal ? localVacuumBin : 'npx';
const commandArgs = useProjectRoot || useProjectBin || useCustom || useLocal ? finalArgs : [projectVacuumBin, ...finalArgs];

const result = spawnSync(command, commandArgs, { stdio: 'inherit' });
process.exit(result.status ?? 1);
