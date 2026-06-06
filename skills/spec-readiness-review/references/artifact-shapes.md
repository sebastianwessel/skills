# Artifact Shapes

## Spec Tree

- `specs/.readiness-report.yaml`, `_registry.yaml`, `_provenance.yaml`
- `00-vision.md`, `00-stack.md`, `00-conventions.md`,
  `00-architecture-overview.md`, `00-file-structure.md`, `glossary.md`
- `01-domains/`, `02-capabilities/`, `03-contracts/`, `03-flows/`
- `02-capabilities/capability-inventory.md`
- `03-flows/e2e-coverage.md`
- `03-contracts/`: OpenAPI, GraphQL, AsyncAPI, JSON Schema, protobuf/gRPC,
  CloudEvents, Avro, Thrift, Smithy, OpenRPC/RAML, YANG, WSDL, schema registry,
  or comparable source contracts
- `03-contracts/generation-map.*` or equivalent when mapping metadata is needed
- `04-backend/`, `04-frontend/`, `04-nfr/`, `04-operations/`, `04-delivery/`
  or equivalents
- `plans/migrations/*.md` for material implemented-behavior changes

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
`strong_boundary_type_gate`, `interface_gate`, `e2e_gate`,
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

## Inference Policy

Infer only toolchain/standard defaults such as framework-native conventions,
ports-and-adapters, OpenTelemetry, structured JSON logs, RFC 9457, standard
contracts, standard tests, SPDX/CycloneDX, SLSA, and local-first adapters. Block
for custom protocols/formats, scope, compliance/privacy, security boundaries,
data classification, public semantics, production/release, supply-chain policy,
irreversible architecture, trust boundaries, or contradictions.

## Standard Failures

Validation/auth failures have no side effects. Timeouts retry then escalate.
Unknown errors are terminal unless retryable. Outages back off. Cancellation
cleans up. Non-idempotent uncertainty needs intervention. Define ack timing,
state, rollback, checkpoint, telemetry, log level, and redaction.
