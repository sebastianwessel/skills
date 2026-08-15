# Artifact Shapes

## Contents

- Spec Tree
- Readiness Report
- Content-Bound Approval
- Canonical Control Artifacts
- Inference Policy
- Standard Failures

## Spec Tree

- `specs/.readiness-report.yaml`, `spec-manifest.yaml`, `_registry.yaml`,
  `_provenance.yaml`
- `00-applicability.yaml`, `00-decision-authority.yaml`,
  `00-policy-profile.yaml`, `00-reuse-inventory.yaml`, `00-module-boundaries.yaml`,
  `00-traceability.yaml`
- `00-vision.md`, `00-stack.md`, `00-conventions.md`,
  `00-architecture-overview.md`, `00-file-structure.md`, `glossary.md`
- `01-domains/`, `02-capabilities/`, `03-contracts/`, `03-flows/`
- `02-capabilities/capability-inventory.md`
- `03-flows/e2e-coverage.md`
- `03-contracts/`: OpenAPI, GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC,
  CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG, WSDL, schema registry,
  or comparable source contracts
- `03-contracts/generation-map.*` or equivalent when mapping metadata is needed
- `03-contracts/representation-catalog.yaml` when data shapes are in scope
- `04-backend/`, `04-frontend/`, `04-nfr/`, `04-operations/`, `04-delivery/`
  or equivalents
- `04-delivery/migration-requirements.md` or equivalent for material behavior
  changes. Specs own the target behavior, compatibility stance, data migration,
  rollback, and acceptance requirements; planning later decomposes that source
  into `plans/migrations/` work.

## Readiness Report

Approved specs require `status: approved`, `human_approval.status: approved`,
`open_decisions: []`, `language: en`, and passed gate statuses:

`no_drift_gate`, `ambiguity_gate`, `spec_structure_gate`, `visualization_gate`,
`semantic_alignment_gate`, `requirements_quality_gate`,
`end_to_end_definition_gate`, `file_structure_gate`,
`current_dependency_research_gate`, `concise_spec_gate`,
`client_consumer_coverage_gate`, `frontend_ux_integration_gate`,
`standards_first_gate`, `machine_readable_contract_gate`,
`async_semantics_gate`, `clean_rebuild_boundary_gate`, `generation_map_gate`,
`strong_boundary_type_gate`, `representation_reuse_gate`, `interface_gate`, `e2e_gate`,
`unhappy_path_gate`, `security_privacy_gate`, `observability_gate`,
`performance_resilience_gate`, `data_integrity_recovery_gate`,
`production_readiness_gate`, `supply_chain_gate`, `wave_readiness`,
`migration_gate`, `checklist_walk_gate`, `contradiction_check`, `spec_judge_loop`,
`semantic_judge_gate`, `self_audit_gate`, `gate_simulation`.

Also record deterministic status, traceability, inferred defaults, risks, wave
evidence, production/release/supply-chain, migrations, spec judge evidence,
semantic judge evidence, self-audit, machine-readable contract/generator/drift
evidence, current dependency/doc research evidence, capability inventory and
end-to-end definition evidence, file/folder structure evidence, clean-rebuild
evidence, HITL decisions, checklist walk topics/gaps, and maintenance impact.

## Content-Bound Approval

An approved report must name a digest that binds approval to the exact source
specification set. `spec-manifest.yaml` lists every authoritative source
artifact except the manifest and the approval/provenance records
(`.readiness-report.yaml`, `_provenance.yaml`); each entry has the file digest and
the manifest has the digest of sorted `path + NUL + artifact-digest + newline`
records. Any source edit therefore produces a different digest and invalidates
approval. `_provenance.yaml.spec_manifest.content_digest` repeats that digest.
Generate it with
`node <spec-readiness-review-skill-root>/scripts/generate_spec_manifest.mjs <spec-root> <source-revision>`;
the helper preserves the declared source revision when the second argument is
omitted, rebuilds the manifest, and updates the provenance binding. Generation
does not approve the changed content.

```yaml
spec_manifest_version: 1
content_digest: sha256:<64 lowercase hex characters>
artifacts:
  - path: 03-contracts/openapi.yaml
    sha256: sha256:<64 lowercase hex characters>
provenance:
  source_revision: <immutable source revision>
  generated_at: 2026-08-15T12:00:00Z
  generator: spec-manifest/v1
```

The readiness report retains `human_approval` for lifecycle compatibility, but
approval is valid only with this evidence (the approval reference may point to
a reviewed PR, ticket, or signed approval system record):

```yaml
approval_evidence:
  status: approved
  approver_id: <human or accountable approval role>
  approved_at: 2026-08-15T12:05:00Z
  approval_ref: PR-123#approval-456
  manifest_digest: sha256:<same digest as spec-manifest.yaml>
  scope_refs: [CAP-IDENTITY-001]
semantic_judge_evidence:
  status: passed
  judge: <judge name and version>
  reviewed_at: 2026-08-15T12:04:00Z
  evidence_ref: reports/spec-judge-identity.yaml
```

## Canonical Control Artifacts

These concise files prevent broad N/A claims, unmanaged reuse, and implicit
agent authority. They are required for approval; facts should be linked from
capabilities and tickets instead of copied.

```yaml
# 00-applicability.yaml
applicability_version: 1
concerns:
  - concern_id: representation_reuse
    status: applicable # applicable | not_applicable
    scope_refs: [CAP-IDENTITY-001]
    rationale: <required only for not_applicable>
```

```yaml
# 00-decision-authority.yaml
decision_authority_version: 1
default_allowed_classes: [D0, D1]
decisions:
  - decision_id: DEC-IDENTITY-001
    class: D2 # D0 mechanical; D1 private/reversible; D2 approved semantic; D3 human-only
    authority: architecture-owner
    scope_refs: [CAP-IDENTITY-001]
    source_refs: [ADR-012]
```

`00-reuse-inventory.yaml` has `reuse_inventory_version: 1`,
`discovery_revision`, and assets with stable IDs, kind, path, public export,
owner, stability, consumers, and extension policy. An empty inventory requires
`no_assets_rationale`. `00-module-boundaries.yaml` has
`module_boundary_version: 1` and `modules`; each module declares a stable ID,
owner, public entrypoint, owned concepts, and allowed and forbidden dependency
IDs. An empty module list requires `no_modules_rationale`. These records
describe ownership and dependency direction, not a generic shared package.

```yaml
# 00-reuse-inventory.yaml
reuse_inventory_version: 1
discovery_revision: <repository revision inspected>
assets:
  - asset_id: identity.user-schema
    kind: schema
    path: packages/contracts/user.schema.json
    public_export: "@project/contracts/User"
    owner: identity-domain
    stability: versioned
    consumers: [identity-api, admin-ui]
    extension_policy: modify-source-and-regenerate
```

```yaml
# 00-module-boundaries.yaml
module_boundary_version: 1
modules:
  - module_id: identity-contracts
    owner: identity-domain
    public_entrypoint: packages/contracts/src/index.ts
    owned_concepts: [identity.user]
    allowed_dependencies: [platform-validation]
    forbidden_dependencies: [identity-api]
```

`00-policy-profile.yaml` is the explicit source for any default an agent may
apply. It has `policy_profile_version: 1`, `allowed_default_refs`, and a named
profile/source for each reference. Defaults are limited to D0/D1 mechanics
explicitly allowed by that profile. Framework conventions, architecture style,
observability, release/operations, security, data, external dependencies, and
public behavior are never inferred merely because they are common.

`00-traceability.yaml` is the compact source of truth for coverage. It links
requirements to capabilities, success/failure paths, contracts, acceptance, and
verification. Markdown explains rationale; it does not duplicate this graph.

```yaml
traceability_version: 1
requirements:
  - requirement_id: REQ-IDENTITY-001
    capability_ids: [CAP-IDENTITY-USER]
    path_ids: [PATH-IDENTITY-USER-SUCCESS, PATH-IDENTITY-USER-INVALID]
    acceptance_ids: [ACCEPT-IDENTITY-USER]
capabilities:
  - capability_id: CAP-IDENTITY-USER
    requirement_ids: [REQ-IDENTITY-001]
    path_ids: [PATH-IDENTITY-USER-SUCCESS, PATH-IDENTITY-USER-INVALID]
paths:
  - path_id: PATH-IDENTITY-USER-SUCCESS
    capability_ids: [CAP-IDENTITY-USER]
    requirement_ids: [REQ-IDENTITY-001]
    kind: success
    contract_refs: [CONTRACT-USER-001]
    acceptance_ids: [ACCEPT-IDENTITY-USER]
acceptance:
  - acceptance_id: ACCEPT-IDENTITY-USER
    requirement_ids: [REQ-IDENTITY-001]
    path_ids: [PATH-IDENTITY-USER-SUCCESS]
    verification_refs: [tests/contracts/user.test.ts]
```

Every ID and edge is exact and resolvable. In-scope failure paths cannot be
silently omitted because an unrelated file mentions tests or verification.

## Inference Policy

Infer nothing from generic convention. A D0/D1 default is permitted only when
`00-policy-profile.yaml` explicitly grants it and links the policy source; the
ticket must cite that policy reference. Block for architecture style, runtime,
observability, release/operations, security, data classification, external
dependencies, public semantics, trust boundaries, compatibility, or any D2/D3
decision, even if a framework has a common convention.

## Standard Failures

Validation/auth failures have no side effects. Timeouts retry then escalate.
Unknown errors are terminal unless retryable. Outages back off. Cancellation
cleans up. Non-idempotent uncertainty needs intervention. Define ack timing,
state, rollback, checkpoint, telemetry, log level, and redaction.
