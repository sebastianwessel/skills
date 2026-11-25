import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const excluded = new Set(["plan-manifest.yaml", "reviews", "implementation-evidence"]);
const hash = (content) => `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;

export function readPlanSnapshot(root) {
  function files(directory, prefix = "") {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      if (!prefix && excluded.has(entry.name)) return [];
      const relative = prefix + entry.name;
      return entry.isDirectory() ? files(path.join(root, relative), relative + "/") : [relative];
    });
  }

  const paths = fs.existsSync(root) ? files(root).sort() : [];
  const artifacts = paths.map((relative) => ({
    path: relative,
    sha256: hash(fs.readFileSync(path.join(root, relative), "utf8").replace(/\r\n?/g, "\n")),
  }));
  const contentDigest = hash(artifacts.map(({ path, sha256 }) => `${path}\0${sha256}\n`).join(""));
  return { artifacts, contentDigest };
}
