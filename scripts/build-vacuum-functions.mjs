import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'dist-vacuum', 'cjs', 'functions');
const outDir = path.join(projectRoot, 'dist-vacuum', 'functions');

const header = '// Vacuum-compatible wrapper generated from compiled spectral functions\n';

async function buildVacuumFunctions() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const entries = (await readdir(srcDir)).filter((file) => file.endsWith('.js'));
  if (entries.length === 0) {
    throw new Error(`No compiled functions found in ${srcDir}. Run the TypeScript build first.`);
  }

  for (const file of entries) {
    const name = path.basename(file, '.js');

    if (name === 'overrideSeverity') {
      const overrideWrapper = `${header}(function () {
  function getSchema() {
    return {
      name: '${name}',
      description:
        'Allows pygeoapi severity overrides to load under Vacuum; cross-rule severity adjustments are handled in the Spectral build.',
    };
  }

  function tokenize(selector) {
    if (!selector || selector === '$') return [];
    var pathValue = selector.startsWith('$.') ? selector.slice(2) : selector;
    var tokens = [];
    var regex = /\\[['"]([^'"]+)['"]\\]|[^.[\\]]+/g;
    var match;
    while ((match = regex.exec(pathValue)) !== null) {
      tokens.push(match[1] || match[0]);
    }
    return tokens;
  }

  function getValue(target, selector) {
    if (!selector || selector === '$') return target;
    var parts = tokenize(selector);
    var current = target;
    for (var i = 0; i < parts.length; i += 1) {
      if (current == null) return undefined;
      current = current[parts[i]];
    }
    return current;
  }

  function runRule(input) {
    var opts =
      (typeof context === 'object' && context && context.ruleAction && context.ruleAction.functionOptions) || {};
    var actual = getValue(input, opts.target || '$');

    if (opts.value !== undefined && actual !== opts.value) {
      return [];
    }

    return [];
  }

  globalThis.getSchema = getSchema;
  globalThis.runRule = runRule;
  globalThis['${name}'] = runRule;
})();\n`;

      await writeFile(path.join(outDir, file), overrideWrapper, 'utf8');
      continue;
    }

    const code = await readFile(path.join(srcDir, file), 'utf8');
    const indented = code
      .split('\n')
      .map((line) => `  ${line}`)
      .join('\n');

    const wrapped = `${header}(function () {
  var exports = {};
  var module = { exports: exports };
${indented}
  var fn = module.exports.runRule || module.exports.default || exports.runRule || exports.default;
  var schemaFn = module.exports.getSchema || exports.getSchema;

  globalThis.getSchema =
    typeof schemaFn === 'function'
      ? schemaFn
      : function () {
          return { name: '${name}', description: '' };
        };

  globalThis.runRule = function (input) {
    var opts =
      (typeof context === 'object' && context && context.ruleAction && context.ruleAction.functionOptions) || {};
    var ctx = typeof context === 'undefined' ? {} : context;
    return typeof fn === 'function' ? fn(input, opts, ctx) : [];
  };

  globalThis['${name}'] = globalThis.runRule;
})();\n`;

    await writeFile(path.join(outDir, file), wrapped, 'utf8');
  }

  // Clean up the intermediate CJS output to avoid publishing extra artifacts.
  await rm(path.join(projectRoot, 'dist-vacuum', 'cjs'), { recursive: true, force: true });
}

buildVacuumFunctions().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
