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
const defaultRuleset = path.resolve(projectRoot, '.spectral.yaml');
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

const localVacuumBin = path.resolve(projectRoot, 'node_modules', '.bin', 'vacuum');
const useLocal = fs.existsSync(localVacuumBin);
const command = useLocal ? localVacuumBin : 'npx';
const commandArgs = useLocal ? finalArgs : ['vacuum', ...finalArgs];

const result = spawnSync(command, commandArgs, { stdio: 'inherit' });
process.exit(result.status ?? 1);
