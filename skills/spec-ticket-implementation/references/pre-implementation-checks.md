# Pre-Implementation Checks

Run before writing code.

## Environment And Baseline

- [ ] Working directory is the project root.
- [ ] Dependencies are installed as the project expects.
- [ ] Worktree is clean or unrelated changes are identified.
- [ ] `specs/.readiness-report.yaml` exists and is approved.
- [ ] Project verification commands are found in implementation docs, specs,
      package scripts, Makefile, or build config.
- [ ] Baseline verification is run and recorded.

If baseline failures are outside `write_scope`, record and continue. If they are
inside scope, the ticket must fix them.

## Ticket Parsing

- [ ] Frontmatter parsed: `id`, `wave`, `depends_on`, `blocked_by`,
      `write_scope`, `read_scope`, `spec_refs`.
- [ ] Ticket is executable/AFK, not blocked/HITL.
- [ ] Dependencies are `done` or `merged` in `_status.yaml` or equivalent.
- [ ] Acceptance criteria are mapped to public-interface tests.
- [ ] Source requirement IDs and verification methods are mapped to acceptance.
- [ ] Happy path, unhappy path, async/error/logging expectations are identified.
- [ ] Security/privacy, data classification, redaction, performance,
      data-integrity, rollback, recovery, and manual-intervention expectations
      are identified.
- [ ] Production readiness, release/rollback, configuration/secrets,
      dependency, SBOM/provenance, vulnerability, and license expectations are
      identified or explicitly not applicable.
- [ ] Approved interfaces/contracts and consumer expectations are identified.
- [ ] Machine-readable contract sources are identified: OpenAPI, GraphQL
      SDL/schema, AsyncAPI, JSON Schema, gRPC/protobuf, CloudEvents, Avro, or
      approved equivalent.
- [ ] `generated_contracts` lists source artifacts, generation commands,
      deterministic generators/tools, generated output paths,
      generated/contract tests, drift checks, or N/A evidence.
- [ ] Mock/fake/stub/placeholder permissions are checked.
- [ ] Verification commands are copied exactly.

Stop if dependencies are active or an acceptance criterion needs behavior missing
from scoped specs.

## Project Patterns

- [ ] Naming, file structure, code style, and test style are understood.
- [ ] Error handling and logging/observability conventions are understood.
- [ ] Log levels, redaction rules, audit/metric/trace conventions, and safe
      error-message conventions are understood.
- [ ] Public API docs, type-safety, constants, and unit-name conventions are
      understood.

## Scoped Spec Reading

Read only `read_scope` and `spec_refs`.

- [ ] Contracts, schemas, ports, flows, and error taxonomy are read.
- [ ] Existing deterministic codegen tools, generated-file headers,
      regeneration commands, generated test patterns, and drift/contract-check
      commands are read.
- [ ] Nullability, optionality, async behavior, cancellation, retries,
      serialization, and cross-language/protocol type semantics are checked.
- [ ] Data classification, trust boundaries, auth/policy, retention, redaction,
      log levels, performance budgets, state transitions, rollback/recovery, and
      data-loss prevention rules are checked.
- [ ] Deployment, config/secrets, rollout/rollback, runbook, dependency policy,
      SBOM/provenance, vulnerability, license, artifact, and release rules are
      checked when in scope.
- [ ] Public API inventory and execution semantics are read for changed public
      surfaces.
- [ ] Manifest version, digest, canonicalization, snapshot, replay,
      compatibility, and validation-error rules are read when manifests apply.
- [ ] Docs/example paths and public builder/helper paths are checked when public
      surfaces change.

Stop if a required contract, field, flow, policy, error, persistence rule,
logging/audit behavior, performance budget, recovery path, or failure path is
missing. Also stop if requirement traceability, release/operations, or
supply-chain expectations are missing for in-scope work. Stop if the ticket
requires hand-writing shapes that approved deterministic tooling can generate,
or if generation commands/outputs are undefined. Do not infer it.
