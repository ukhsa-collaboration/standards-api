/// <reference types="node" />

import * as fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

export interface Invocation {
  command: string;
  args: string[];
  specPath: string | null;
  rulesetPath: string;
  functionsDir: string;
  projectRoot: string;
}

export function findSpecPath(argv: string[], cwd = process.cwd()): string | null {
  for (const arg of argv) {
    if (arg.startsWith('-')) continue;
    const resolved = path.resolve(cwd, arg);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      return resolved;
    }
  }
  return null;
}

export function loadSpec(specPath: string): any {
  const raw = fs.readFileSync(specPath, 'utf8');
  if (specPath.endsWith('.json')) {
    return JSON.parse(raw);
  }
  return yaml.load(raw);
}

export function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag);
}

export function detectRefFlags(specPath: string): { hasRemote: boolean; hasRelative: boolean } {
  const raw = fs.readFileSync(specPath, 'utf8');
  const refs: string[] = [];
  const jsonRefRegex = /"\$ref"\s*:\s*"([^"]+)"/g;
  const yamlRefRegex = /\$ref\s*:\s*['"]?([^'"\s]+)['"]?/g;
  let match: RegExpExecArray | null;

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

export function buildInvocation(argv: string[] | undefined, projectRoot = process.cwd()): Invocation {
  const args = Array.isArray(argv) ? argv.slice() : [];
  const commandLikeArgs = args.filter((arg) => !arg.startsWith('-'));
  const subcommand = commandLikeArgs[0] === 'vacuum' ? commandLikeArgs[1] : commandLikeArgs[0];
  const shouldAugmentLintArgs = subcommand === 'lint' || subcommand === 'spectral-report';

  const defaultRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
  const pygeoapiRuleset = path.resolve(projectRoot, 'ukhsa.oas.rules.pygeoapi.yml');
  const functionsDir = path.resolve(projectRoot, 'dist-vacuum', 'functions');

  const specPath = findSpecPath(args, projectRoot);

  let rulesetPath = defaultRuleset;

  if (specPath) {
    try {
      const spec = loadSpec(specPath);
      const apiType = (spec as any)?.info?.['x-api-type'];
      if (apiType === 'pygeoapi') {
        rulesetPath = pygeoapiRuleset;
      }
    } catch (err) {
      // ignore - fall back to default ruleset
    }
  }

  const finalArgs = args.slice();

  if (shouldAugmentLintArgs) {
    if (!hasFlag(finalArgs, '-r') && !hasFlag(finalArgs, '--ruleset')) {
      finalArgs.push('-r', rulesetPath);
    }
    if (!hasFlag(finalArgs, '--functions')) {
      finalArgs.push('--functions', functionsDir);
    }
    if (!hasFlag(finalArgs, '--nested-refs-doc-context')) {
      finalArgs.push('--nested-refs-doc-context');
    }
    if (!hasFlag(finalArgs, '--resolve-all-refs')) {
      finalArgs.push('--resolve-all-refs');
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
  }

  const projectVacuumRoot = path.resolve(projectRoot, 'vacuum', 'vacuum');
  const projectVacuumBin = path.resolve(projectRoot, 'vacuum', 'bin', 'vacuum');
  const localVacuumBin = path.resolve(projectRoot, 'node_modules', '.bin', 'vacuum');
  const useProjectRoot = fs.existsSync(projectVacuumRoot);
  const useProjectBin = fs.existsSync(projectVacuumBin);
  const useLocal = fs.existsSync(localVacuumBin);

  const command = useProjectRoot
    ? projectVacuumRoot
    : useProjectBin
    ? projectVacuumBin
    : useLocal
    ? localVacuumBin
    : 'npx';

  let argsForCommand: string[];
  if (useProjectRoot || useProjectBin || useLocal) {
    // We're invoking the vacuum binary directly; ensure we don't pass a
    // redundant leading 'vacuum' argument.
    argsForCommand = finalArgs.length > 0 && finalArgs[0] === 'vacuum' ? finalArgs.slice(1) : finalArgs;
  } else {
    // We're invoking via a launcher like `npx`, so ensure the first arg is
    // the package shortcut 'vacuum'. If the caller already included it,
    // preserve it.
    if (finalArgs.length > 0 && finalArgs[0] === 'vacuum') {
      argsForCommand = finalArgs;
    } else {
      argsForCommand = ['vacuum', ...finalArgs];
    }
  }

  return {
    command,
    args: argsForCommand,
    specPath,
    rulesetPath,
    functionsDir,
    projectRoot,
  };
}

export default buildInvocation;
