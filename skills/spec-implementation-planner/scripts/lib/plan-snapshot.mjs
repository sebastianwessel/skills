import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const hash = (bytes) => `sha256:${crypto.createHash("sha256").update(bytes).digest("hex")}`;
const wavePattern = /^wave_(\d{2,})_[a-z0-9]+(?:[-_][a-z0-9]+)*$/;
export const ticketPattern = /^(TICKET-\d{3,})-[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;

export function readPlanSnapshot(root) {
  const plans = path.join(root, "plans");
  if (!fs.lstatSync(plans).isDirectory()) throw new Error("expected regular plans directory");
  const artifacts = [];
  const waveNumbers = new Set();
  function add(relative) {
    const file = path.join(plans, relative);
    if (!fs.lstatSync(file).isFile()) throw new Error(`expected regular plan file: ${relative}`);
    artifacts.push({ path: relative, sha256: hash(fs.readFileSync(file)) });
  }
  for (const entry of fs.readdirSync(plans, { withFileTypes: true })) {
    if (entry.name === "implementation-plan.md") add(entry.name);
    if (!entry.name.startsWith("wave_")) continue;
    const wave = wavePattern.exec(entry.name);
    if (!wave || !entry.isDirectory()) throw new Error(`invalid wave directory: ${entry.name}`);
    const number = Number(wave[1]);
    if (!number || waveNumbers.has(number)) throw new Error(`invalid or duplicate wave number: ${entry.name}`);
    waveNumbers.add(number);
    add(`${entry.name}/plan.md`);
    const directory = path.join(plans, entry.name, "tickets");
    if (!fs.lstatSync(directory).isDirectory()) throw new Error(`expected tickets directory: ${entry.name}`);
    const tickets = fs.readdirSync(directory);
    if (!tickets.length) throw new Error(`wave has no tickets: ${entry.name}`);
    for (const ticket of tickets) {
      if (!ticketPattern.test(ticket)) throw new Error(`invalid ticket filename: ${ticket}`);
      add(`${entry.name}/tickets/${ticket}`);
    }
  }
  if (!waveNumbers.size) throw new Error("no plans/wave_NN_slug/plan.md found");
  artifacts.sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  const contentDigest = hash(artifacts.map(({ path, sha256 }) => `${path}\0${sha256}\n`).join(""));
  return { artifacts, contentDigest };
}

export function serializeManifest(specDigest, { artifacts, contentDigest }) {
  return [
    "plan_manifest_version: 2",
    `content_digest: ${contentDigest}`,
    `source_spec_manifest_digest: ${specDigest}`,
    "artifacts:",
    ...artifacts.flatMap((artifact) => [`  - path: ${JSON.stringify(artifact.path)}`, `    sha256: ${artifact.sha256}`]),
    "",
  ].join("\n");
}
