/// <reference types="node" />

import * as fs from 'node:fs';
import path from 'node:path';

export interface Invocation {
  command: string;
  args: string[];
  rulesetPath: string;
  functionsDir: string;
  projectRoot: string;
}

function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag);
}

export function buildInvocation(argv: string[] | undefined, projectRoot = process.cwd()): Invocation {
  const args = Array.isArray(argv) ? argv.slice() : [];
  const commandLikeArgs = args.filter((arg) => !arg.startsWith('-'));
  const subcommand = commandLikeArgs[0] === 'vacuum' ? commandLikeArgs[1] : commandLikeArgs[0];
  const shouldAugmentLintArgs = subcommand === 'lint' || subcommand === 'spectral-report';

  const rulesetPath = path.resolve(projectRoot, 'ukhsa.oas.rules.yml');
  const functionsDir = path.resolve(projectRoot, 'dist', 'functions');

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
  }

  const projectVacuumRoot = path.resolve(projectRoot, 'vacuum', 'vacuum');
  const projectVacuumBin = path.resolve(projectRoot, 'vacuum', 'bin', 'vacuum');
  const useProjectRoot = fs.existsSync(projectVacuumRoot);
  const useProjectBin = fs.existsSync(projectVacuumBin);

  const command = useProjectRoot
    ? projectVacuumRoot
    : useProjectBin
    ? projectVacuumBin
    : 'npx';

  let argsForCommand: string[];
  if (useProjectRoot || useProjectBin) {
    // Invoking the vacuum binary directly; drop any redundant leading 'vacuum' arg.
    argsForCommand = finalArgs.length > 0 && finalArgs[0] === 'vacuum' ? finalArgs.slice(1) : finalArgs;
  } else {
    // Invoking via npx; ensure the first arg is the package shortcut 'vacuum'.
    argsForCommand = finalArgs.length > 0 && finalArgs[0] === 'vacuum' ? finalArgs : ['vacuum', ...finalArgs];
  }

  return {
    command,
    args: argsForCommand,
    rulesetPath,
    functionsDir,
    projectRoot,
  };
}

export default buildInvocation;
