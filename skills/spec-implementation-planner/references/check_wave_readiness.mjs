#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");
const wave = process.argv[3];
const plans = path.join(root, process.argv[4] || "plans");
const out = [];
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "";
const clean = (s = "") => s.replace(/^["']|["']$/g, "").trim();
const fm = (t) => t.startsWith("---\n") ? t.split("---\n")[1] || "" : "";
const scalar = (t, k) => clean((t.split("\n").find((l) => l.startsWith(`${k}:`)) || "").split(":").slice(1).join(":"));
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
}) : [];
const bad = /\b(decide|choose|determine|TBD|TODO|as appropriate|if needed|where possible|placeholder|fake implementation|mock implementation|stub implementation|no-op)\b/i;

if (!wave) out.push("missing wave id argument");
const plan = wave ? read(path.join(plans, wave, "plan.md")) : "";
if (wave && !plan) out.push(`${wave}: missing plan.md`);
if (plan && !/End-to-End Outcome/i.test(plan)) out.push(`${wave}/plan.md: missing End-to-End Outcome`);
if (plan && !/Implementation Order/i.test(plan)) out.push(`${wave}/plan.md: missing Implementation Order`);
if (plan && !/Parallelization|Parallel Work|Isolation/i.test(plan)) out.push(`${wave}/plan.md: missing parallelization/isolation notes`);
if (plan && !/Resume|Pause|Status/i.test(plan)) out.push(`${wave}/plan.md: missing pause/resume status notes`);

for (const file of walk(path.join(plans, wave || "")).filter((p) => p.endsWith(".md") && p.includes(`${path.sep}tickets${path.sep}`))) {
  const text = read(file);
  const front = fm(text);
  const rel = path.relative(root, file);
  const status = scalar(front, "status");
  if (status === "blocked") out.push(`${rel}: ticket is blocked`);
  if (!["planned", "ready", "in_progress", "partial", "done", "skipped"].includes(status)) out.push(`${rel}: invalid or unstartable status ${status}`);
  if (!/contract_readiness:[\s\S]*?status:\s*ready/i.test(front)) out.push(`${rel}: contract_readiness.status must be ready`);
  if (!/ticket_readiness:[\s\S]*?status:\s*implementation_ready/i.test(front)) out.push(`${rel}: ticket_readiness.status must be implementation_ready`);
  if (bad.test(text)) out.push(`${rel}: contains drift-prone or placeholder language`);
}

if (out.length) {
  console.log("wave readiness failed");
  out.forEach((p) => console.log(`- ${p}`));
  process.exit(1);
}
console.log(`wave readiness ok: ${wave}`);
