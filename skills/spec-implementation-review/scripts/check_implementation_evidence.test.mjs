#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const checker = path.resolve(import.meta.dirname, "check_implementation_evidence.mjs");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "implementation-evidence-"));
const file = path.join(temp, "plans", "implementation-evidence", "TICKET-001.json");
const digest = `sha256:${"a".repeat(64)}`;
const manifest = (version) => `spec_manifest_version: ${version}\ncontent_digest: ${digest}\n`;
const base = () => ({
  version: 1,
  ticket_id: "TICKET-001",
  status: "review_pending",
  spec_manifest_digest: digest,
  plan_manifest_digest: digest,
  changed_artifacts: [{
    path: "packages/contracts/src/user.ts",
    kind: "public_type",
    spec_refs: ["REQ-USER-001"],
    asset_refs: ["ASSET-USER"],
    module_refs: ["MODULE-CONTRACTS"],
    public_symbols: ["User"],
  }],
  commands: [{ id: "verify", command: "npm test", effect: "local_write", expected_result: "exit 0" }],
  consumer_impact: [{ asset_or_symbol: "ASSET-USER#User", consumers: ["MODULE-API"], disposition: "tested", evidence: ["packages/contracts/src/user.test.ts"] }],
  architecture_checks: [{ command: "npm run lint:boundaries", status: "passed" }],
});
const run = (value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  try { return { ok: true, output: execFileSync(process.execPath, [checker, temp], { encoding: "utf8" }) }; }
  catch (error) { return { ok: false, output: `${error.stdout || ""}${error.stderr || ""}` }; }
};

try {
  fs.mkdirSync(path.join(temp, "specs"), { recursive: true });
  fs.mkdirSync(path.join(temp, "plans"), { recursive: true });
  fs.writeFileSync(path.join(temp, "specs", "spec-manifest.yaml"), manifest(1));
  fs.writeFileSync(path.join(temp, "plans", "plan-manifest.yaml"), manifest(1));
  assert.equal(run(base()).ok, true, "valid implementation evidence should pass");
  const unsafe = base();
  unsafe.commands[0].effect = "external_write";
  assert.match(run(unsafe).output, /external_write requires approval_ref/, "external command without approval must fail");
  const unregistered = base();
  unregistered.changed_artifacts[0].asset_refs = [];
  unregistered.changed_artifacts[0].module_refs = [];
  assert.match(run(unregistered).output, /must reference an approved asset or module/, "public artifact without reuse reference must fail");
  console.log("implementation evidence tests ok");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
