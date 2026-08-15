import fs from "node:fs";
import path from "node:path";

export const DEFAULT_IGNORED_DIRECTORIES = new Set([".git", "node_modules", "__pycache__"]);

/** Return files below root while consistently excluding generated/tool directories. */
export function walkFiles(root, { ignoredDirectories = DEFAULT_IGNORED_DIRECTORIES } = {}) {
  const visit = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return [];
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? visit(file) : [file];
  });
  return visit(root);
}
