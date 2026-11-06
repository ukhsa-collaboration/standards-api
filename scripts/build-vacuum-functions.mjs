import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'dist', 'cjs', 'functions');
const outDir = path.join(projectRoot, 'dist', 'functions');

const header = '// Vacuum-compatible wrapper generated from compiled functions\n';

async function buildVacuumFunctions() {
  await mkdir(outDir, { recursive: true });

  // Keep TypeScript declarations in dist/functions and only refresh runtime wrappers.
  const existingOutEntries = await readdir(outDir).catch(() => []);
  await Promise.all(
    existingOutEntries
      .filter((file) => file.endsWith('.js'))
      .map((file) => rm(path.join(outDir, file), { force: true })),
  );

  const entries = (await readdir(srcDir)).filter((file) => file.endsWith('.js'));
  if (entries.length === 0) {
    throw new Error(`No compiled functions found in ${srcDir}. Run the TypeScript build first.`);
  }

  for (const file of entries) {
    const name = path.basename(file, '.js');

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

  // Functions return Spectral-style path arrays, but Vacuum decodes a result's path as a
  // JSONPath string and rejects the whole result set otherwise. An empty path is dropped so
  // Vacuum falls back to the location the rule's \`given\` matched.
  var toJsonPath = function (segments) {
    return '$' + segments
      .map(function (segment) {
        if (typeof segment === 'number') {
          return '[' + segment + ']';
        }
        var key = String(segment);
        return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key)
          ? '.' + key
          : "['" + key.replace(/\\\\/g, '\\\\\\\\').replace(/'/g, "\\\\'") + "']";
      })
      .join('');
  };

  globalThis.runRule = function (input) {
    var opts =
      (typeof context === 'object' && context && context.ruleAction && context.ruleAction.functionOptions) || {};
    var ctx = typeof context === 'undefined' ? {} : context;
    var results = typeof fn === 'function' ? fn(input, opts, ctx) : [];
    return (results || []).map(function (result) {
      if (!result || !Array.isArray(result.path)) {
        return result;
      }
      var converted = Object.assign({}, result);
      if (result.path.length > 0) {
        converted.path = toJsonPath(result.path);
      } else {
        delete converted.path;
      }
      return converted;
    });
  };

  globalThis['${name}'] = globalThis.runRule;
})();\n`;

    await writeFile(path.join(outDir, file), wrapped, 'utf8');
  }

  // Clean up the intermediate CJS output to avoid publishing extra artifacts.
  await rm(path.join(projectRoot, 'dist', 'cjs'), { recursive: true, force: true });
}

buildVacuumFunctions().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
