# Implementation Evidence Manifest

Each implemented ticket writes
`plans/implementation-evidence/<ticket-id>.json` before independent review.
This compact, machine-readable manifest is the bridge between approved specs,
the implementation diff, and consumer-impact review. It is evidence, not an
approval: implementers must never set `accepted`.

```json
{
  "version": 1,
  "ticket_id": "TICKET-IDENTITY-001",
  "status": "review_pending",
  "spec_manifest_digest": "sha256:<approved-spec-digest>",
  "plan_manifest_digest": "sha256:<approved-plan-digest>",
  "changed_artifacts": [
    {
      "path": "packages/contracts/src/user.ts",
      "kind": "public_type",
      "spec_refs": ["REQ-USER-001"],
      "asset_refs": ["ASSET-IDENTITY-USER"],
      "module_refs": ["MODULE-IDENTITY-CONTRACTS"],
      "public_symbols": ["User"]
    }
  ],
  "commands": [
    {
      "id": "verify-contracts",
      "command": "pnpm contracts:check",
      "effect": "local_write",
      "expected_result": "exit 0"
    }
  ],
  "consumer_impact": [
    {
      "asset_or_symbol": "ASSET-IDENTITY-USER#User",
      "consumers": ["MODULE-USER-API", "MODULE-DASHBOARD"],
      "disposition": "tested",
      "evidence": ["packages/contracts/src/user.test.ts"]
    }
  ],
  "architecture_checks": [
    { "command": "pnpm lint:boundaries", "status": "passed" }
  ]
}
```

`kind` is one of `public_type`, `schema`, `mapper`, `module`, `generated`,
`contract`, `configuration`, `internal`, or `migration`. A changed public
symbol, schema, mapper, generated artifact, or module must link to approved
spec and asset/module IDs. Every command declares `read_only`, `local_write`,
`network`, or `external_write`; network/external commands also require an
approved decision reference. Consumer dispositions are `tested`, `reviewed`,
`migration_owned`, or `not_applicable`; each needs evidence and a scoped reason
where applicable.

Project adapters may add language-specific export/import graph and generated
file provenance evidence. They cannot weaken these fields.
