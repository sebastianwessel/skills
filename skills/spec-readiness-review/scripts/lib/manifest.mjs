import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const digest = (value) => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;
const excluded = new Set(["spec-manifest.yaml", ".readiness-report.yaml"]);

export function sourceFiles(root) {
  function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return walk(file);
      if (!entry.isFile()) throw new Error(`Spec bundles require regular files: ${file}`);
      return path.relative(root, file).split(path.sep).join("/");
    });
  }
  return walk(root).filter((file) => !excluded.has(file)).sort();
}

export function snapshot(root, files) {
  const artifacts = files.map((file) => ({ path: file, sha256: digest(fs.readFileSync(path.join(root, file))) }));
  const content_digest = digest(artifacts.map((entry) => `${entry.path}\0${entry.sha256}\n`).join(""));
  return { artifacts, content_digest };
}
