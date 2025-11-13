#!/usr/bin/env node
/**
 * Extract lowest-level (leaf) Business Capabilities from a diagrams.net XML
 * file, optionally emit them into a TypeScript module, and/or update a
 * Markdown file's "Valid Capabilities" section.
 *
 * Example CLI usage:
 *   npx ts-node src/capabilities.ts path/to/capabilities.xml \
 *     --ts-out src/functions/ukhsaBusinessCapabilities.ts \
 *     --md docs/must-have-info-leading-capability.md
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

type StrMap = Record<string, unknown>;

type CapabilityInfo = {
  label: string;
  parent: string | null;
};

type ExtractOptions = {
  /** Whether to sort the labels alphabetically (default: true). */
  sort?: boolean;
};

/**
 * Parse a diagrams.net XML file and return the list of lowest-level
 * (leaf) Business Capabilities.
 *
 * **Definition of a "leaf" capability:**
 * - Represented by an `<object>` element with attributes
 *   `type="factSheet"` and `factSheetType="BusinessCapability"`.
 * - Not the parent of any other BusinessCapability object (i.e.,
 *   no other BusinessCapability’s `<mxCell>` references this object's id
 *   via its `"parent"` attribute).
 *
 * @param xmlPath - Absolute or relative path to the diagrams.net XML file.
 * @param opts - Options controlling extraction behavior.
 * @returns Array of unique capability labels. Empty labels are ignored.
 *          Duplicates (case-sensitive) are removed.
 * @throws {Error} If the file cannot be read or the XML cannot be parsed.
 *
 * @remarks
 * Robust to typical diagrams.net exports where Business Capabilities may be
 * represented as containers and/or labels. Parent/child linkage is inferred
 * from the nested `<mxCell parent="...">` attribute.
 */
export function extractLeafCapabilities(
  xmlPath: string,
  opts: ExtractOptions = { sort: true }
): string[] {
  let xml: string;
  try {
    xml = fs.readFileSync(xmlPath, "utf8");
  } catch (e) {
    throw new Error(`Error reading XML file: ${String(e)}`);
  }

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    isArray: (name) => name === "object", // force <object> into array form
  });

  let root: StrMap;
  try {
    root = parser.parse(xml) as StrMap;
  } catch (e) {
    throw new Error(`Error parsing XML: ${String(e)}`);
  }

  const objects: StrMap[] = [];
  const stack: unknown[] = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object") continue;
    const obj = node as StrMap;

    if (Array.isArray((obj as any).object)) {
      objects.push(...((obj as any).object as StrMap[]));
    }

    for (const v of Object.values(obj)) {
      if (v && typeof v === "object") stack.push(v);
    }
  }

  const bcById = new Map<string, CapabilityInfo>();
  const parentIds = new Set<string>();

  for (const obj of objects) {
    const type = (obj as any)["@_type"];
    const factSheetType = (obj as any)["@_factSheetType"];
    if (type !== "factSheet" || factSheetType !== "BusinessCapability") continue;

    const id = (obj as any)["@_id"] as string | undefined;
    if (!id) continue;

    const rawLabel = ((obj as any)["@_label"] as string | undefined) ?? "";
    const label = rawLabel.trim();

    const mxCell = (obj as any).mxCell as StrMap | undefined;
    const parent = mxCell && typeof mxCell === "object"
      ? ((mxCell as any)["@_parent"] as string | undefined)
      : undefined;

    bcById.set(id, { label, parent: parent ?? null });
  }

  for (const info of bcById.values()) {
    if (info.parent && bcById.has(info.parent)) {
      parentIds.add(info.parent);
    }
  }

  const leafIds = [...bcById.keys()].filter((bid) => !parentIds.has(bid));

  const seen = new Set<string>();
  const labels: string[] = [];
  for (const bid of leafIds) {
    const info = bcById.get(bid)!;
    const label = info.label ?? "";
    if (label && !seen.has(label)) {
      labels.push(label);
      seen.add(label);
    }
  }

  if (opts.sort !== false) {
    labels.sort((a, b) =>
      a.localeCompare(b, undefined, {
        sensitivity: "accent",
        caseFirst: "lower",
      })
    );
  }

  return labels;
}

/**
 * Write a TypeScript file declaring and exporting a `CAPABILITIES` array.
 *
 * Emits:
 * ```ts
 * const CAPABILITIES = [
 *   "Clinical Analysis",
 *   "Scientific Analysis",
 *   // ...
 * ];
 *
 * export default CAPABILITIES;
 * ```
 *
 * @param capabilities - Array of capability labels.
 * @param outPath - Destination file path for the TypeScript module.
 *
 * @throws {Error} If the file cannot be written or renamed.
 *
 * @remarks
 * - Ensures the parent directory exists.
 * - Writes to a temporary file first, then atomically replaces the target.
 * - Uses JSON string encoding for each element to safely handle quotes
 *   and escape sequences.
 */
export function writeTsFile(capabilities: string[], outPath: string): void {
  const outDir = path.dirname(outPath);
  if (outDir) fs.mkdirSync(outDir, { recursive: true });

  const lines = capabilities.map((cap) => `  ${JSON.stringify(cap)}`).join(",\n");
  const headerComment = [
    "/**",
    " * Enumerates the UKHSA Business Capabilities accepted by validation rules.",
    " *",
    " * @remarks",
    " * Generated via the `capabilities.ts` script to keep the controlled list in sync",
    " * with source taxonomy data.",
    " */",
  ].join("\n");
  const tsContent =
    `${headerComment}\nconst CAPABILITIES = [\n${lines}\n];\n\nexport default CAPABILITIES;\n`;

  const tmp = path.join(
    outDir || ".",
    `${path.basename(outPath)}.${process.pid}.${Date.now()}.tmp`
  );
  fs.writeFileSync(tmp, tsContent, { encoding: "utf8" });
  fs.renameSync(tmp, outPath);
}

/**
 * Render capabilities as a Markdown bullet list, one label per line.
 *
 * @param capabilities - Capability labels to render.
 * @returns Markdown bullet list comprised of the provided capabilities.
 */
function renderMarkdownList(capabilities: string[]): string {
  return capabilities.map((c) => `- ${c}`).join("\n");
}

/**
 * Update a Markdown file's "Valid Capabilities" section.
 *
 *   If markers exist, replace content between:
 *   <!--capabilities:start--> ... <!--capabilities:end-->
 *
 *   If no markers, locate the
 *   "## Valid Capabilities" section, then replace the bullet list between
 *   the line "Examples may include (but are not limited to):" and the next
 *   Markdown H2 heading (i.e., a line starting with "## ").
 *
 * @param mdPath - Path to the Markdown file to update (in-place).
 * @param capabilities - Capability labels to inject.
 * @returns A short status string describing what was updated.
 * @throws {Error} If the file cannot be read or written, or section cannot be found.
 */
export function updateMarkdownCapabilities(
  mdPath: string,
  capabilities: string[]
): string {
  let md: string;
  try {
    md = fs.readFileSync(mdPath, "utf8");
  } catch (e) {
    throw new Error(`Error reading Markdown: ${String(e)}`);
  }

  const listBlock = renderMarkdownList(capabilities);

  // 1. Explicit markers
  const startMarker = "<!--capabilities:start-->";
  const endMarker = "<!--capabilities:end-->";
  const markerRe = new RegExp(
    `${escapeRegExp(startMarker)}[\\s\\S]*?${escapeRegExp(endMarker)}`,
    "m"
  );

  if (markerRe.test(md)) {
    const replacement = [
      startMarker,
      "<!-- This section is autogenerated. Do not edit directly. -->",
      listBlock,
      endMarker,
    ].join("\n");
    md = md.replace(markerRe, replacement);
    fs.writeFileSync(mdPath, md, "utf8");
    return "Updated Markdown between capability markers.";
  }

  // 2. Find the "Valid Capabilities" section and replace bullets
  const validCapHeadingRe = /^##\s+Valid\s+Capabilities\s*$/m;
  const headingMatch = md.match(validCapHeadingRe);
  if (!headingMatch) {
    throw new Error(`Could not find "## Valid Capabilities" heading in ${mdPath}`);
  }

  // Index after the heading line
  const headingIdx = headingMatch.index!;
  const afterHeadingIdx = headingIdx + headingMatch[0].length;

  // From after heading, find the "Examples may include..." line (optional)
  const tail = md.slice(afterHeadingIdx);
  const examplesLineRe = /^(?:\r?\n)+.*Examples may include.*\r?\n/m;
  const examplesMatch = tail.match(examplesLineRe);

  let blockStartInTail: number;
  let keepExamplesLine = false;
  if (examplesMatch) {
    // Start replacing after this line
    blockStartInTail = examplesMatch.index! + examplesMatch[0].length;
    keepExamplesLine = true;
  } else {
    // No examples line; start after the heading's newline(s)
    const newlineAfterHeadingRe = /^(?:\r?\n)+/;
    const newlineMatch = tail.match(newlineAfterHeadingRe);
    blockStartInTail = newlineMatch ? (newlineMatch.index! + newlineMatch[0].length) : 0;
  }

  const tailAfterStart = tail.slice(blockStartInTail);

  // Find the next H2 heading that marks end of this section
  const nextH2Re = /^\s*##\s+/m;
  const nextH2Match = tailAfterStart.match(nextH2Re);
  const blockEndInTail =
    nextH2Match ? blockStartInTail + nextH2Match.index! : tail.length;

  const before = md.slice(0, afterHeadingIdx);
  const middleBeforeStart = tail.slice(0, blockStartInTail);
  const after = tail.slice(blockEndInTail);

  const preface = keepExamplesLine
    ? middleBeforeStart // keep the "Examples..." line as-is
    : middleBeforeStart;

  // Ensure we have a leading newline before list, and a blank line after.
  const injected =
    preface.replace(/\s*$/, "\n") + listBlock + "\n\n";

  const newMd = before + injected + after;

  fs.writeFileSync(mdPath, newMd, "utf8");
  return 'Updated Markdown "Valid Capabilities" bullet list.';
}

/**
 * Escape a string for safe inclusion in a regular expression.
 *
 * @param s - String to escape.
 * @returns The escaped representation of the input string.
 */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Parse command-line arguments.
 *
 * Supported options:
 * - `--ts-out <file>`: Write a TypeScript module with the capabilities.
 * - `--md <file>`: Update the Markdown file in-place with the capabilities.
 * - `--sort` / `--no-sort`: Enable or disable sorting of capability labels.
 *
 * @param argv - Raw argument array (excluding `node`/script name).
 * @returns Parsed configuration: `{ xmlPath, tsOut, md, sort }`.
 * @throws {Error} On unknown options or missing arguments.
 */
function parseArgs(argv: string[]) {
  const args = {
    xmlPath: "",
    tsOut: undefined as string | undefined,
    md: undefined as string | undefined,
    sort: true,
  };
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--ts-out") {
      const v = argv[++i];
      if (!v) throw new Error("--ts-out requires a value");
      args.tsOut = v;
    } else if (a === "--md") {
      const v = argv[++i];
      if (!v) throw new Error("--md requires a value");
      args.md = v;
    } else if (a === "--sort") {
      args.sort = true;
    } else if (a === "--no-sort") {
      args.sort = false;
    } else if (a.startsWith("--")) {
      throw new Error(`Unknown option: ${a}`);
    } else {
      rest.push(a);
    }
  }
  if (rest.length < 1) {
    throw new Error(
      "Missing XML path.\nUsage: capabilities.ts <xml_path> [--ts-out <path>] [--md <path>] [--sort|--no-sort]"
    );
  }
  args.xmlPath = rest[0];
  return args;
}

/**
 * CLI entry point.
 *
 * Behavior:
 * - Extracts leaf capabilities from the provided XML.
 * - Prints them to stdout (one per line).
 * - If `--ts-out` is provided, writes the TypeScript module and reports to stderr.
 * - If `--md` is provided, updates the Markdown list in-place and reports to stderr.
 *
 * Exit codes:
 * - `0` on success.
 * - Non-zero on error.
 */
function main() {
  const argv = process.argv.slice(2);
  try {
    const { xmlPath, tsOut, md, sort } = parseArgs(argv);
    const caps = extractLeafCapabilities(xmlPath, { sort });

    // stdout: one per line (like the Python version)
    for (const c of caps) process.stdout.write(`${c}\n`);

    if (tsOut) {
      writeTsFile(caps, tsOut);
      process.stderr.write(`\n✅ Wrote ${caps.length} capabilities to ${tsOut}\n`);
    }

    if (md) {
      const status = updateMarkdownCapabilities(md, caps);
      process.stderr.write(`\n✅ ${status} (${md})\n`);
    }
  } catch (e) {
    process.stderr.write(String(e) + "\n");
    process.exit(1);
  }
}

if (import.meta.url === `file://${fileURLToPath(import.meta.url)}`) {
  main();
}
