# Artifact Shapes

## Spec Tree

- `specs/.readiness-report.yaml`, `_registry.yaml`, `_provenance.yaml`
- `00-vision.md`, `00-stack.md`, `00-conventions.md`,
  `00-architecture-overview.md`, `glossary.md`
- `01-domains/`, `02-capabilities/`, `03-contracts/`, `03-flows/`
- `04-backend/` or equivalent technical specs
- `04-frontend/` or equivalent UX/design specs when user-facing UI exists
- `04-nfr/`: security/privacy, data integrity/recovery,
  performance/resilience, observability/logging, test strategy
- `plans/migrations/*.md` for material changes to implemented behavior

## Readiness Report

Approved specs require:

- `status: approved`, `human_approval.status: approved`, `open_decisions: []`
- these gate statuses `passed`: `no_drift_gate`, `ambiguity_gate`,
  `spec_structure_gate`, `visualization_gate`, `semantic_alignment_gate`,
  `async_semantics_gate`, `interface_gate`, `e2e_gate`,
  `unhappy_path_gate`, `security_privacy_gate`,
  `observability_gate`, `performance_resilience_gate`,
  `data_integrity_recovery_gate`, `wave_readiness`, `migration_gate`,
  `contradiction_check`, `self_audit_gate`, `gate_simulation`
- deterministic command/status, inferred defaults, risks, wave evidence,
  migration links when applicable, and self-audit findings

## Inference Policy

Infer only safe language/toolchain conventions, local-first adapters, standard
validation/test libraries, ports-and-adapters, OpenTelemetry, and RFC 9457 HTTP
errors. Block for scope, compliance/privacy, security boundaries, data
classification, retention, public semantics, irreversible architecture, trust
boundaries, or contradictions.

## Standard Failures

Validation/auth failures have no side effects. Timeouts retry within bounded
budgets then escalate. Unknown errors are terminal unless explicitly retryable.
Dependency unavailability retries with backoff. Cancellation cleans up and marks
cancelled. Lease expiry requeues only if side effects are safe. Non-idempotent
uncertainty requires manual intervention. Always define ack timing, state
transition, rollback/compensation, recovery checkpoint, telemetry, log level,
redaction, and manual-intervention record.
