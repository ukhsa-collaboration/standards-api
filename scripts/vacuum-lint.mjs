#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: ukhsa-vacuum-lint <vacuum args...>');
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const distHelperPath = path.resolve(packageRoot, 'dist', 'utils', 'vacuum-common.js');
let buildInvocation;
if (fs.existsSync(distHelperPath)) {
  const mod = await import(pathToFileURL(distHelperPath).href);
  buildInvocation = mod.buildInvocation ?? mod.default;
} else {
  console.error(`Compiled helper not found at ${distHelperPath}.`);
  console.error('Reinstall @ukhsa-collaboration/openapi-linting-rules or run npm run build in this repository.');
  process.exit(1);
}

const { command, args: commandArgs } = buildInvocation(args, process.cwd());

const result = spawnSync(command, commandArgs, { stdio: 'inherit' });
process.exit(result.status ?? 1);
