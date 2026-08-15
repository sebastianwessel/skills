# Definition of Done

A ticket is `implemented` only when all relevant checks pass. It becomes
`accepted` only after independent review; implementation agents do not accept
their own work.

## Contents

- Code Quality
- Errors, Logging, And Security
- Data Integrity, Recovery, And Performance
- Frontend, UX, And Reuse
- Testing
- Scope And Spec Compliance
- Documentation And Completion

## Code Quality

- [ ] No new static analysis errors or lint warnings in scope.
- [ ] Naming, file/folder structure, and file sizes follow conventions.
- [ ] Types are precise; no unapproved `any`, unchecked casts, dynamic maps,
      stringly typed contracts, or broad exception types.
- [ ] Closed contract boundaries expose strong source-derived/generated types;
      weak maps, `any`, `unknown`, anonymous wrappers, and handwritten duplicate
      mirrors appear only for explicitly open JSON leaves or approved N/A
      evidence.
- [ ] Generated outputs/tests derive from approved sources through deterministic
      tooling where available; generated files were not hand-edited unless
      explicitly approved with evidence.
- [ ] Contract-heavy rebuild work has generation-map, generator-test,
      compile-check, drift-check, and generated-package evidence before
      handwritten service logic is marked implemented.
- [ ] Required generated artifacts exist and trace to approved generation
      commands, or the ticket was blocked before production edits.
- [ ] Every changed data representation and mapper has the ticket's approved
      catalog `shape_id` and mapping ref. No unregistered exported DTO, entity,
      schema, event, record, projection, or semantic duplicate was introduced.
- [ ] Semantic hardcoded values are centralized into inline-documented constants
      with units in duration/size/count/rate/limit names.
- [ ] No commented-out code or unresolved TODO/FIXME.

## Errors, Logging, And Security

- [ ] Errors use canonical types/codes; unexpected sync/async/stream/timeout/
      cancellation/retry/background failures are handled as required.
- [ ] Logs use approved levels/events/context, audit/metric/trace rules, safe
      error messages, and leak no secrets, credentials, PII, or sensitive data.
- [ ] Auth, authorization, tenancy/isolation, validation, output encoding,
      retention, and dependency safety match specs when in scope.

## Data Integrity, Recovery, And Performance

- [ ] State transitions are defined and cannot leave undefined or partial state.
- [ ] Rollback, compensation, idempotency, retry exhaustion, recovery
      checkpoints, manual intervention, and no-data-loss/no-leak behavior match
      specs.
- [ ] No duplicate side effect, stale lock/session/cache, or undefined state
      remains in scope.
- [ ] Latency, throughput, memory/CPU, pagination, batching, timeout, retry,
      backpressure, and overload behavior match budgets when relevant.

## Frontend, UX, And Reuse

- [ ] User-facing/client work preserves access paths, screens/flows, states,
      accessibility, responsiveness, keyboard/focus, and visual behavior.
- [ ] Project design sources, shared styles, framework/component libraries, and
      reusable modules are used before custom UI.
- [ ] No unapproved look-and-feel invention, duplicate styling, custom component,
      or custom interaction remains.

## Testing

- [ ] Acceptance criteria have passing public-interface tests; matrix rows are
      implemented/tested/verified/N/A with evidence. Blocked/missing rows mean
      partial, not implemented.
- [ ] Tests trace to spec refs/contracts and were written or generated before
      the business logic they prove, or a concrete exception is recorded.
- [ ] Happy, unhappy, failure, contract/codegen drift, integration, and E2E
      paths pass when applicable.
- [ ] Default tests are hermetic; opt-in integration tests require caller
      env/config and stay skipped by default.
- [ ] Tests avoid implementation coupling; test doubles are approved and only at
      external boundaries.

## Scope And Spec Compliance

- [ ] Only `write_scope` files changed.
- [ ] No full-slice ticket was reduced to a local partial slice without a
      planner-approved split or partial ticket.
- [ ] Source requirement IDs trace to code, tests, and evidence; acceptance is
      fully met and non-goals are respected.
- [ ] No unapproved behavior, interface/schema, persistence, policy, failure,
      async, error, logging, UX/client, security, performance, or recovery
      behavior was invented.
- [ ] Clean-rebuild tickets do not preserve stale aliases, compatibility
      wrappers, fallback synthesis, storage-era shapes, or handwritten mirrors
      unless approved migration scope explicitly owns them.
- [ ] Catalogued mappings permit the implemented field omissions, defaults,
      nullability, precision, ID/time semantics, and redaction/loss behavior.
- [ ] Auth/tenancy scope has negative tests for cross-tenant list/get-by-known-
      id/update/delete, owner-only commands, and missing/expired/revoked
      sessions when relevant.
- [ ] Composition files did not gain provider, persistence, security, session,
      tenant, workspace, invitation, or domain logic unless approved.
- [ ] No unapproved mock, fake, stub, placeholder, no-op, hidden flag, demo path,
      or partial local slice remains.
- [ ] Public API inventory/docs/examples/generated artifacts, manifest
      semantics, release/config/rollback/runbook, and supply-chain expectations
      are synced when in scope.

## Documentation And Completion

- [ ] Public APIs, exported constants, enum types/values, docs, examples, and
      complex logic are documented as required.
- [ ] Ticket status and changed-file tracking are updated.
- [ ] Ticket lifecycle is moved to `implemented`, not `accepted`; the
      review-owned implementation-evidence manifest records actual changed
      paths/symbols, reused asset/module refs, command outcomes/effects, and
      consumer impact for the review gate.
- [ ] Ticket commands, scoped project verification, build/compile, static
      analysis, lint, and tests pass.
- [ ] Review-judge loop found no unresolved ticket-scope defect.
- [ ] Assumptions, skipped checks, pre-existing failures, gaps, and residual
      risks are stated honestly.
