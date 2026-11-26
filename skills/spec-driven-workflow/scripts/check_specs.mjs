#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { checkKnowledge } from "./lib/check-project-knowledge.mjs";
import { checkScenario, readSlice, scenarioRows } from "./lib/slice.mjs";

function filesUnder(root, prefix = "") {
  return fs.readdirSync(path.join(root, prefix), { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) return [];
    const file = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) return filesUnder(root, file);
    if (entry.isFile()) return [file];
    throw new Error(`Expected a regular spec file: ${file}`);
  });
}

try {
  const [directory, mode, id, ...extra] = process.argv.slice(2);
  if (!directory || directory.startsWith("--") || (mode && (!["--digest", "--approved"].includes(mode) || !id)) || extra.length) {
    throw new Error("Usage: check_specs.mjs <spec-root> [--digest|--approved <slice-id>]");
  }
  const root = path.resolve(directory);
  if (!fs.lstatSync(root).isDirectory()) throw new Error("Expected a regular specs directory");
  if (mode) {
    const { digest, sources } = readSlice(root, id, { approved: mode === "--approved" });
    console.log(`${id}: ${mode === "--approved" ? "approved" : "ready for scoped review"}\nslice_digest: ${digest}`);
    for (const ref of [...sources.keys()].sort()) console.log(`  ${ref}`);
  } else {
    const files = filesUnder(root);
    const pages = checkKnowledge(root, files);
    const rows = scenarioRows(root);
    for (const row of rows.values()) {
      checkScenario(row);
      const [file, anchor] = row.source.split("#");
      if (pages.get(file)?.anchors.get(anchor) !== 1) {
        throw new Error(`${row.id}: source must target a unique Markdown anchor: ${row.source}`);
      }
    }
    for (const file of files.filter((name) => name.endsWith(".json"))) {
      try { JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); }
      catch (error) { throw new Error(`${file}: invalid JSON: ${error.message}`); }
    }
    console.log(`Spec structure checks passed (${rows.size} scenarios)`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
