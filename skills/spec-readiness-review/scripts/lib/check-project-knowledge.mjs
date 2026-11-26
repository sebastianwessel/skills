import fs from "node:fs";
import path from "node:path";
import { markdownAnchors, markdownLinks } from "./markdown.mjs";
import { decisionMetadata, recordKind } from "./slice.mjs";

function page(root, file) {
  const text = fs.readFileSync(path.join(root, file), "utf8");
  const recordType = recordKind(file);
  return {
    anchors: markdownAnchors(text),
    links: markdownLinks(text),
    meta: recordType === "decisions" ? decisionMetadata(text, file) : undefined,
    recordType,
  };
}

export function checkKnowledge(root, files) {
  const available = new Set(files);
  const pages = new Map();
  for (const file of files.filter((name) => name.endsWith(".md"))) pages.set(file, page(root, file));
  if (!pages.has("index.md")) throw new Error("Missing project entry point: index.md");
  const adjacent = new Map();
  const drawn = new Set();
  for (const [file, { links }] of pages) {
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
