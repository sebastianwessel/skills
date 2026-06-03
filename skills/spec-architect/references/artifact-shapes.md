# Artifact Shapes

## Spec Tree

- `specs/.readiness-report.yaml`, `_registry.yaml`, `_provenance.yaml`
- `00-vision.md`, `00-stack.md`, `00-conventions.md`,
  `00-architecture-overview.md`, `glossary.md`
- `01-domains/`, `02-capabilities/`, `03-contracts/`, `03-flows/`
- `03-contracts/`: best-fit standard or ecosystem-native contract/IDL/schema
  sources when interfaces exist. Examples are non-exhaustive: OpenAPI,
  GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC, CloudEvents, Avro, Thrift,
  Smithy, OpenRPC/RAML, YANG, WSDL, schema registries, or comparable artifacts.
- `04-backend/` or equivalent technical specs
- `04-frontend/` or equivalent UX/design specs when user-facing UI exists
- `04-nfr/`: security/privacy, data integrity/recovery,
  performance/resilience, observability/logging, test strategy
- `04-operations/` for production readiness when software is deployable
- `04-delivery/` for release/supply-chain when artifacts are distributed
- `plans/migrations/*.md` for material changes to implemented behavior

## Readiness Report

Approved specs require:

- `status: approved`, `human_approval.status: approved`, `open_decisions: []`
- `language: en`
- these gate statuses `passed`: `no_drift_gate`, `ambiguity_gate`,
  `spec_structure_gate`, `visualization_gate`, `semantic_alignment_gate`,
  `requirements_quality_gate`, `standards_first_gate`,
  `machine_readable_contract_gate`, `async_semantics_gate`,
  `interface_gate`, `e2e_gate`,
  `unhappy_path_gate`, `security_privacy_gate`,
  `observability_gate`, `performance_resilience_gate`,
  `data_integrity_recovery_gate`, `production_readiness_gate`,
  `supply_chain_gate`, `wave_readiness`, `migration_gate`,
  `contradiction_check`, `semantic_judge_gate`, `self_audit_gate`,
  `gate_simulation`
- deterministic status, traceability, inferred defaults, risks, wave evidence,
  production/release/supply-chain, migrations, semantic judge evidence,
  self-audit
- machine-readable contracts: source contract/IDL/schema artifacts,
  deterministic generators/tools, regeneration commands, generated
  outputs/tests, drift checks, or N/A evidence
- judge evidence: reviewer/model, time, scope, verdicts, paths, ambiguity,
  gaps, uncertainty, verdict
- HITL: decision, context, recommendation, alternatives, pros/cons, impact, refs
- maintenance: source refs, dependents, pruned refs, affected tickets, migrations

## Inference Policy

Infer only toolchain/standard defaults: framework-native, ports-and-adapters,
OpenTelemetry, structured JSON logs, RFC 9457, suitable standard
contract/IDL/schema artifacts, standard validation/tests, SPDX/CycloneDX, SLSA,
local-first adapters. Block for custom protocols/formats, scope,
compliance/privacy, security boundaries, data classification, public semantics,
production/release, supply-chain policy, irreversible architecture, trust
boundaries, contradictions.

## Standard Failures

Validation/auth failures have no side effects. Timeouts retry then escalate.
Unknown errors are terminal unless retryable. Outages back off. Cancellation
cleans up. Non-idempotent uncertainty needs intervention. Define ack timing,
state, rollback, checkpoint, telemetry, log level, redaction.
