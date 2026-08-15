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
- [ ] Ticket lifecycle is `ready` or `in_progress`, executable/AFK, and not
      blocked/HITL. `implemented`, `review_pending`, and `accepted` tickets are
      not reopened without a planner remediation ticket.
- [ ] Ticket `spec_manifest_digest` exactly matches approved
      `spec-manifest.yaml.content_digest` and
      `.readiness-report.yaml.approval_evidence.manifest_digest`; otherwise
      stop for replanning, not implementation.
- [ ] Ticket `plan_manifest_digest` exactly matches
      `plans/plan-manifest.yaml.content_digest`, whose source-spec digest also
      matches the approved spec manifest. Do not proceed on a stale ticket.
- [ ] Dependencies are `accepted` in `_status.yaml` or equivalent unless an
      approved phase gate names the exact earlier proof.
- [ ] `autonomy` permits only D0 and optional D1 work; D1 convention refs and
      any approved D2/D3 decision refs are read. Any new D2/D3 choice is a
      blocker, never an implementation decision.
- [ ] `verification_commands` are copied exactly and have safe metadata:
      network/secrets forbidden, direct shell only, and read-only or
      workspace-only writes. External checks stay opt-in and caller controlled.
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
- [ ] Clean rebuild versus incremental strategy, generation map, source-contract
      inventory, generated package ownership, handwritten remainder, and
      compatibility/migration stance are identified or explicitly N/A.
- [ ] Closed contract boundaries have strong source-derived/generated types.
      Weak types are approved only for explicitly open JSON leaves.
- [ ] `representation_reuse` frontmatter is read. For data-shape work, its
      catalog ref exists, `shape_id`/mapping refs are registered, and any new
      representation is explicitly approved with canonical owner/source.
- [ ] Required generated artifacts and task prerequisite paths exist, or the
      approved generation command can be run before production edits.
- [ ] Mock/fake/stub/placeholder permissions are checked.
- [ ] The review-owned implementation-evidence manifest location and required
      fields are identified. The implementation agent will record only actual
      changed paths/symbols, asset/module refs, command outcomes/effects, and
      consumer impact for independent review.

## Project Evidence

- [ ] Read only `read_scope` and `spec_refs`.
- [ ] Contracts, ports, flows, error taxonomy, persistence, policies, and
      consumer expectations are read.
- [ ] Existing deterministic codegen tools, generated-file headers,
      regeneration commands, generated test patterns, and drift/contract-check
      commands are read.
- [ ] Generation-map checks are read when present, including placeholder rules
      for schema properties and derived components.
- [ ] Generated-file paths are identified; direct edits need spec/ticket
      approval plus evidence generation is unavailable, unsafe, or out of scope.
- [ ] Existing catalogued shapes, generated outputs, shared models, and mapping
      implementations named by the ticket are read before adding a model, DTO,
      schema, event, record, projection, or mapper.
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
release/operations, supply chain, generated artifact ownership, generation-map
evidence, strong boundary type policy, or verification evidence is missing for
in-scope work. Stop before production edits if a required catalog shape/mapping
is missing or an unapproved representation would be created. Stop if the ticket cannot be implemented
end to end in scope; route to `spec-implementation-planner` instead of
presenting a local smoke path as completion.
