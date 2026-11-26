import fs from "node:fs";
import path from "node:path";
import { markdownAnchors, proseWithoutExamples } from "./markdown.mjs";
import { parseYaml } from "./simple-yaml.mjs";

const present = (value) => typeof value === "string" && value.trim().length > 0;

function page(root, file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!frontmatter && /^---\r?\n/.test(text)) throw new Error(`${file}: unclosed frontmatter`);
  const recordType = file.split("/").slice(0, -1).findLast((segment) => ["decisions", "gaps"].includes(segment));
  const isRecord = recordType && path.posix.basename(file) !== "index.md";
  const meta = isRecord && frontmatter ? parseYaml(frontmatter[1], file) : {};
  const body = frontmatter ? text.slice(frontmatter[0].length) : text;
  const anchors = markdownAnchors(body);
  const prose = proseWithoutExamples(body).replace(/(`+)[^`\n]+?\1/g, "");
  const links = [];
  for (const [, image, label, target] of prose.matchAll(/(!?)\[([^\]\n]*)\]\(<?([^()<>\s]+)>?(?:\s+["'][^"']*["'])?\)/g)) {
    if (!/^[a-z][a-z0-9+.-]*:/i.test(target)) links.push({ image: Boolean(image), label, target });
  }
  return { anchors, links, meta, recordType: isRecord ? recordType : undefined };
}

export function checkKnowledge(root, files, finalCandidate) {
  const available = new Set(files);
  const pages = new Map();
  for (const file of files.filter((name) => name.endsWith(".md"))) pages.set(file, page(root, file));
  if (!pages.has("index.md")) throw new Error("Missing project entry point: index.md");
  const adjacent = new Map();
  const drawn = new Set();
  for (const [file, { links, meta, recordType }] of pages) {
    const neighbors = [];
    const images = [];
    const localTargets = new Set();
    for (const { image, label, target } of links) {
      const [raw, fragment] = target.split("#");
      const href = decodeURIComponent(raw);
      const ref = href ? path.posix.normalize(path.posix.join(path.posix.dirname(file), href)) : file;
      if (href.startsWith("/") || href.includes("\\") || !available.has(ref)) throw new Error(`${file}: missing or outside link ${target}`);
      if (fragment && pages.has(ref) && pages.get(ref).anchors.get(decodeURIComponent(fragment)) !== 1) {
        throw new Error(`${file}: link must target a unique Markdown anchor: ${target}`);
      }
      if (image && !label.trim()) throw new Error(`${file}: image requires a text alternative: ${target}`);
      if (image) images.push(ref);
      else {
        localTargets.add(ref);
        if (pages.has(ref)) neighbors.push(ref);
      }
    }
    for (const image of images) {
      const source = image.replace(/\.(svg|png)$/i, ".drawio");
      if (source !== image && (image.startsWith("visuals/") || available.has(source))) {
        if (!available.has(source)) throw new Error(`${file}: missing editable diagram source ${source}`);
        if (!localTargets.has(source)) throw new Error(`${file}: link the editable source ${source}`);
        drawn.add(source);
      }
    }
    adjacent.set(file, neighbors);
    if (!recordType) continue;
    const states = recordType === "decisions" ? ["accepted", "proposed", "superseded", "rejected"] : ["open", "resolved", "deferred"];
    if (!present(meta?.owner) || !states.includes(meta?.status)) throw new Error(`${file}: record requires owner and status (${states.join(", ")})`);
    if (["accepted", "resolved", "deferred"].includes(meta.status) && !present(meta.evidence)) throw new Error(`${file}: ${meta.status} requires evidence`);
    if (meta.status === "deferred" && !present(meta.revisit)) throw new Error(`${file}: deferred gap requires a revisit trigger`);
    if (finalCandidate && ["open", "proposed"].includes(meta.status)) throw new Error(`${file}: ${meta.status} blocks readiness`);
  }
  for (const file of files) {
    if (file.endsWith(".drawio") && !drawn.has(file)) throw new Error(`${file}: embed a matching SVG or PNG export and link its source`);
  }
  const reachable = new Set(["index.md"]);
  for (const file of reachable) for (const link of adjacent.get(file)) reachable.add(link);
  for (const [file, record] of pages) {
    if (!reachable.has(file)) throw new Error(`${file}: unreachable from index.md`);
    if (record.meta?.status !== "superseded") continue;
    const visited = new Set([file]);
    let next = record.meta.replacement;
    while (!visited.has(next) && pages.get(next)?.recordType === "decisions") {
      if (pages.get(next).meta.status === "accepted") break;
      visited.add(next);
      if (pages.get(next).meta.status !== "superseded") break;
      next = pages.get(next).meta.replacement;
    }
    if (pages.get(next)?.recordType !== "decisions" || pages.get(next).meta.status !== "accepted") {
      throw new Error(`${file}: replacement must lead to an accepted decision`);
    }
  }
  return pages;
}

export function checkAcceptance(value, pages) {
  if (!Array.isArray(value?.scenarios) || !value.scenarios.length) throw new Error("acceptance.yaml requires a nonempty scenarios list");
  const ids = new Set();
  for (const row of value.scenarios) {
    if (!present(row?.id) || !/^[a-z][a-z0-9_.-]*$/i.test(row.id) || ids.has(row.id)) throw new Error(`acceptance.yaml: invalid or duplicate scenario ID ${row?.id}`);
    ids.add(row.id);
    if (!Array.isArray(row.verify) || !row.verify.length || !row.verify.every(present)) throw new Error(`${row.id}: verify requires at least one nonempty verification reference or instruction`);
    const [file, anchor, ...extra] = present(row.source) ? row.source.split("#") : [];
    if (extra.length || !anchor || pages.get(file)?.anchors.get(anchor) !== 1) throw new Error(`${row.id}: source must target a unique Markdown anchor: ${row.source}`);
  }
  return ids;
}
