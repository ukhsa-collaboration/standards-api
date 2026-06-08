import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/vacuum-lint.mjs <vacuum args...>');
  process.exit(1);
}

const distHelperPath = path.resolve(process.cwd(), 'dist', 'utils', 'vacuum-common.js');
let buildInvocation;
if (fs.existsSync(distHelperPath)) {
  const mod = await import(pathToFileURL(distHelperPath).href);
  buildInvocation = mod.buildInvocation ?? mod.default;
} else {
  console.error(`Compiled helper not found at ${distHelperPath}. Run 'npm run build' first.`);
  process.exit(1);
}

const { command, args: commandArgs } = buildInvocation(args, process.cwd());

const result = spawnSync(command, commandArgs, { stdio: 'inherit' });
process.exit(result.status ?? 1);
