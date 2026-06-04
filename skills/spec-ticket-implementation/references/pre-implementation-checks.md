# Pre-Implementation Checks

Run before writing code.

## Contents

- Baseline
- Ticket Evidence
- Project Evidence
- Stop Rules

## Baseline

- [ ] Working directory is the project root.
- [ ] Dependencies are installed as the project expects.
- [ ] Worktree is clean or unrelated changes are identified.
- [ ] `specs/.readiness-report.yaml` exists and is approved.
- [ ] Verification commands are found and copied exactly.
- [ ] Baseline verification is run and recorded.

If baseline failures are outside `write_scope`, record and continue. If they are
inside scope, the ticket must fix them.

## Ticket Evidence

- [ ] Frontmatter parsed: `id`, `wave`, `depends_on`, `blocked_by`,
      `write_scope`, `read_scope`, `spec_refs`.
- [ ] Ticket is executable/AFK, not blocked/HITL.
- [ ] Dependencies are `done` or `merged` in `_status.yaml` or equivalent.
- [ ] Acceptance rows map to requirement IDs, public-interface tests, commands,
      and status: implemented, tested, verified by command/browser, N/A with
      spec evidence, blocked, or partial.
- [ ] Test-first order is mapped from spec/contract/acceptance/unhappy paths.
- [ ] Happy, unhappy, async/error/logging, security/privacy, data integrity,
      performance, recovery, release, operations, and supply-chain expectations
      are identified or explicitly N/A.
- [ ] Frontend/client scope identifies access, screens, flows, states,
      accessibility/responsiveness, design sources, component/style reuse,
      custom UI rationale, or N/A evidence.
- [ ] Approved interfaces, contracts, schemas, generated outputs, generation
      commands, deterministic tools, generated/contract tests, and drift checks
      are identified or explicitly N/A.
- [ ] Required generated artifacts and task prerequisite paths exist, or the
      approved generation command can be run before production edits.
- [ ] Mock/fake/stub/placeholder permissions are checked.

## Project Evidence

- [ ] Read only `read_scope` and `spec_refs`.
- [ ] Contracts, ports, flows, error taxonomy, persistence, policies, and
      consumer expectations are read.
- [ ] Existing deterministic codegen tools, generated-file headers,
      regeneration commands, generated test patterns, and drift/contract-check
      commands are read.
- [ ] Generated-file paths are identified; direct edits need spec/ticket
      approval plus evidence generation is unavailable, unsafe, or out of scope.
- [ ] Unit, contract, generated, integration, E2E, and failing-test conventions
      are read before business logic changes.
- [ ] Nullability, optionality, async/cancel/retry/serialization,
      cross-language/protocol semantics, redaction, log levels, state
      transitions, rollback/recovery, and data-loss prevention are checked.
- [ ] Deployment/config, rollout/rollback, runbook, dependency/SBOM/provenance,
      vulnerability/license, public API inventory, docs/examples, and manifest
      semantics are checked when in scope.

## Stop Rules

Stop if a required contract, field, flow, policy, error, persistence rule,
logging/audit behavior, performance budget, recovery path, or failure path is
missing. Also stop if frontend/client UX/reuse, test-first order,
release/operations, supply chain, generated artifact ownership, or verification
evidence is missing for in-scope work. Stop before production edits if the
ticket cannot be implemented end to end in scope; route to
`spec-implementation-planner` instead of presenting a local smoke path as
completion.
