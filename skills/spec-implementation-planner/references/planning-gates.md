# Planning Gates

## Contents

- Output
- Split And Phase Gates
- Ticket Shape
- Drift, Generation, Typing, And Reuse
- Contract-First Clean Rebuild Plans
- Parallel Agent Boundaries
- Checks

## Output

- `plans/implementation-plan.md`
- `plans/plan-manifest.yaml`, `_registry.yaml`, `_status.yaml`,
  `_dependencies.yaml`, `_scope.yaml`
- `plans/wave_NN_slug/plan.md`
- `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`

The four index files and ticket frontmatter use a restricted YAML subset:
two-space indentation, mappings, lists, scalars, and simple flow lists.
Do not use anchors, aliases, merge keys, duplicate keys, or multiline scalars.
The checker parses this subset and rejects ambiguous YAML rather than guessing.

Prefer vertical slices: each wave ends in a working, testable end-to-end
increment. If a slice is too large for one agent, split isolated tickets that
converge into the same wave result.

Horizontal waves are exceptions for foundation/interface work or reliability
refactors. State rationale, unblocks, next vertical slice, and test evidence.

For contract-first clean rebuilds, the generated foundation may be an approved
horizontal foundation wave when it produces a compilable, drift-checked boundary
that unblocks the next vertical slice.

## Split And Phase Gates

A ticket is implementation-ready only when one agent can finish one bounded
deliverable inside `write_scope` without inventing intermediate behavior,
artifacts, tests, or UX.

Split a ticket instead of emitting it when it:

- owns multiple independently shippable behaviors or public workflows
- combines contract/generator foundation, handwritten business logic,
  frontend/client surfaces, browser tests, and release/security work without
  frozen prerequisites
- spans unrelated bounded contexts, persistence models, providers, screens, or
  integration protocols
- needs a partial local slice to appear done
- would require an implementer to choose task order, target files, commands,
  interface shapes, test scope, or verification evidence

Use a phase-gated exception only when approved specs make the work atomic and
splitting would break an invariant such as a migration, generated package
transaction, or compatibility boundary. Exception tickets must set
`phase_gate_exception: true`, state the rationale in `Slice Strategy`, and put
blocking `Phase Gate:` checkpoints in `Action Plan`. Each gate names source
refs, prerequisite files/artifacts, exact commands, expected proof, and the next
phase that remains blocked until the proof exists.

## Ticket Shape

Frontmatter: `id`, `title`, `wave`, `lifecycle`, `spec_manifest_digest`,
`plan_manifest_digest`, `parallel_group`, `depends_on`,
`blocked_by`, `spec_refs`, `write_scope`, `read_scope`, `contract_readiness`,
`traceability`,
`generated_contracts`, `ticket_readiness`, `slice_type`,
`phase_gate_exception`, `representation_reuse`, `autonomy`,
`verification_commands`, `action_steps`, `acceptance`.

Body: `Goal`, `Context Digest`, `Implementation Approach`, `Decision Ledger`,
`Action Plan`, `Requirements Traceability`, `Contract Traceability`,
`Spec Drift Controls`, `Generator And Type Plan`, `Test-First Order`,
`Modularity And Reuse Plan`, `Representation Reuse Plan`, `Slice Strategy`, `Tasks`, `Acceptance`,
`Acceptance Test Matrix`, `Review And Verification Plan`,
`End-To-End Definition Coverage`, `Operational Path Coverage`, `Verification`,
`Non-goals`, `Handoff`.

Tickets are crisp human/AI instructions: boundaries, expectations, acceptance,
verification, no pasted specs, no vague implementation prose.

### Lifecycle

`lifecycle` is the sole ticket state. Its normal path is:

```text
planned -> ready -> in_progress -> implemented -> review_pending -> accepted
```

`partial`, `blocked`, and `skipped` are side states and require `resume_notes`
or a `superseded_by` reference in `_status.yaml`. An implementation agent may
move a ticket only from `ready`/`in_progress` to `implemented` after all local
evidence is recorded. A controller submits `implemented` work as
`review_pending`; only independent review can mark it `accepted`. Do not use
`done` as a lifecycle state.

`spec_manifest_digest` is required on every ticket and must exactly equal the
approved `spec-manifest.yaml.content_digest`. `plan_manifest_digest` must equal
`plan-manifest.yaml.content_digest`. The planner does not create or reuse
tickets when either digest changes; it regenerates affected tickets from the
newly approved specification set.

`plan-manifest.yaml` hashes the plan, indexes, wave plans, and ticket files. It
excludes itself plus review/evidence paths. The canonical ticket hash excludes
only the self-referential `plan_manifest_digest` pointer line; all other ticket
content remains bound. Generate it after plan artifacts are complete:

```bash
node references/generate_plan_manifest.mjs <repo-root> [plans-root] [specs-root]
node references/check_plan.mjs <repo-root> [plans-root] [specs-root]
```

### Plan Indexes

All four index files have the same complete ticket-ID set. Each row must match
the ticket frontmatter exactly:

```yaml
# _registry.yaml
tickets:
  TICKET-001:
    path: wave_01_identity/tickets/TICKET-001-user.md
    wave: 1
    lifecycle: ready

# _status.yaml
tickets:
  TICKET-001:
    lifecycle: ready
    current_proof: baseline-recorded
    resume_notes: none
    affected_spec_refs: [specs/01-scope.md#REQ-USER-01]

# _dependencies.yaml
tickets:
  TICKET-001:
    depends_on: []
    blocked_by: []
    unblocks: [TICKET-002]

# _scope.yaml
tickets:
  TICKET-001:
    write_scope: [packages/identity/src]
    read_scope: [packages/contracts/src/user.ts]
```

### Decision Authority And Commands

Executable tickets declare an autonomy budget. D0 is mechanical/generation
work. D1 is a private, reversible choice allowed only by cited project
conventions. D2 (public, architectural, data, security, compatibility) and D3
(business, compliance, irreversible, external) cannot be delegated as choices;
they require approved decision refs and are executed mechanically, or the agent
stops.

```yaml
autonomy:
  allowed_classes: [D0, D1]
  convention_refs: [specs/00-conventions.md#CONV-ERRORS]
  approved_decision_refs: [specs/02-architecture.md#DEC-USER-BOUNDARY]
  escalation: blocker
verification_commands:
  CMD-UNIT:
    command: npm run test:unit
    purpose: public-interface unit verification
    expected: pass
    network: forbidden
    writes: workspace_only
    secrets: forbidden
```

Command metadata is a preflight control, not permission to improvise commands.
Default commands must have no shell chaining, redirection, substitutions,
network, credentials, or writes outside the workspace. External or secret-bound
checks need their own approved ticket and caller-controlled environment.

### Structured Execution And Acceptance

Body sections explain the work; frontmatter carries the checkable handoff.
Every active ticket needs one `preflight`, `contract`, `test`, `implement`,
`verify`, and `handoff` action step. Every acceptance row links exact
requirement anchors, test refs, command IDs, expected outcome, lifecycle, and
one or more canonical `traceability_acceptance_ids`; each row must be owned by
an action step. `traceability` maps the ticket to IDs in the approved
`specs/00-traceability.yaml`. Across non-skipped tickets, every approved
requirement, capability, path, and acceptance ID must be covered.

```yaml
action_steps:
  - id: STEP-TEST
    kind: test
    files: [packages/identity/src/user.test.ts]
    command_refs: [CMD-UNIT]
    acceptance_refs: [ACC-USER-01]
    expected_proof: test fails before implementation and passes after
acceptance:
  - id: ACC-USER-01
    traceability_acceptance_ids: [ACCEPT-USER-01]
    requirement_refs: [specs/01-scope.md#REQ-USER-01]
    test_refs: [packages/identity/src/user.test.ts#creates_user]
    command_refs: [CMD-UNIT]
    expected_outcome: creates a valid user through the public interface
    lifecycle: planned
traceability:
  requirement_ids: [REQ-USER-01]
  capability_ids: [CAP-USER-01]
  path_ids: [PATH-USER-CREATE]
  acceptance_ids: [ACCEPT-USER-01]
```

For tickets that touch data shapes, frontmatter uses this structure:

```yaml
representation_reuse:
  status: ready
  catalog_ref: specs/03-contracts/representation-catalog.yaml
  shape_refs: [identity.user, identity.user-dashboard-projection]
  mapping_refs: [MAP-USER-DASHBOARD]
  new_shape_decision: none
```

Use `status: not_applicable` only with a `rationale` that the ticket has no
domain, boundary, durable-data, command/query, event, or projection shape.

`Action Plan` is the executable handoff. It must be numbered and must include:

- preflight reads limited to `read_scope`, readiness/dependency checks, and
  baseline commands
- contract/codegen or N/A steps before handwritten code, with source artifacts,
  generation commands, generated outputs, generated tests, compile/type checks,
  and drift checks
- test-first steps before business logic, including expected failing tests or
  already-existing proof traced to requirement IDs and unhappy/failure paths
- implementation steps with exact files/directories, symbols/modules when known,
  inputs/outputs, error/logging/security/recovery/UX constraints, and forbidden
  shortcuts
- docs/status/handoff updates when in scope
- final verification commands and required proof text for pass, partial, or
  blocked status

Do not use action steps such as "wire up", "handle errors", "follow patterns",
"make it work", "clean up", "integrate with existing code", or "finish the
feature". Replace them with exact target files, contracts, commands, expected
edits, and proof.

## Drift, Generation, Typing, And Reuse

`Spec Drift Controls` must list the exact spec refs, requirement IDs, contract
anchors, acceptance rows, and forbidden interpretations for the ticket. It must
state how implementation will be reviewed against both ticket and specs before
done. If a required behavior is not traceable to approved specs, the ticket is
blocked or returned to `spec-readiness-review`.

`End-To-End Definition Coverage` must list capability-inventory rows and
definition-chain refs covered by the ticket. It names actor/consumer,
entrypoint/reachability, contracts, data touched, state transitions, side
effects, permissions, errors, recovery, observability, owner, final state,
acceptance, and verification or N/A. Missing chain evidence blocks the ticket.

`Generator And Type Plan` must prefer deterministic generation from approved
spec definitions for types, classes, interfaces, clients, validators, schemas,
stubs, ports, fixtures, docs, and generated tests. It must name source
definitions, generator commands, generated outputs, drift checks, compile/type
checks, and manual-code boundaries. Manual type/interface/class work is allowed
only when generation is unavailable, unsafe, or out of scope, with evidence and
review proof. Closed boundaries use strict source-derived types whenever
possible; weak maps, `any`, `unknown`, unchecked casts, stringly typed
contracts, and duplicate handwritten mirrors require an approved open extension
point or explicit N/A evidence.

`Test-First Order` must name tests before implementation for every acceptance
row. It includes happy paths, unhappy/failure paths, validation failures,
authorization/permission denials, async/timeout/retry/cancel behavior, recovery,
logging/redaction, and regression coverage when in scope. Each row states the
expected failing proof before implementation or cites already-existing tests
that prove the behavior from spec refs.

`Modularity And Reuse Plan` must follow the general file/folder structure
defined in approved specs. It states the domain/topic placement for new or
changed code, including nested folders when the spec-defined project structure
warrants it. It must name existing modules/helpers/components/services to reuse,
shared abstractions to extend, duplicate code to avoid, and boundaries that must
not gain unrelated domain logic. New abstractions require a concrete reuse or
complexity-reduction reason from approved scope.

`Representation Reuse Plan` must name the approved
`representation-catalog.yaml` path, `shape_id` and mapping refs used by the
ticket, generated/shared artifacts to reuse, and prohibited new shapes or
mappers. A genuinely new representation is allowed only when approved specs
record its canonical source, owner, representation class, and mapping(s); the
ticket must link that decision and schedule its catalog/contract foundation
before dependent implementation. A representation does not become distinct
merely because it is used by a different layer.

`Review And Verification Plan` must require a final review against source specs,
the ticket action plan, acceptance matrix, generated artifacts/drift checks,
strict typing, modular placement, reuse/no-duplication, and changed-file scope.
Acceptance is impossible while review finds spec drift, invented behavior, missing
unhappy-path tests, weak avoidable typing, duplicate code, misplaced domain
logic, or unverifiable acceptance rows.

## Contract-First Clean Rebuild Plans

When approved specs select clean rebuild by boundary:

- Start with source-contract and generation-map tickets before handwritten
  implementation. The map owns GraphQL roots/args/outputs, AsyncAPI
  subjects/channels/payloads, entity JSON Schemas, error taxonomy, service
  manifests/handler signatures, database table/record metadata, frontend/client
  contract timing, generated package layout, derived components, and known gaps.
- Add generator tests and drift checks before generated artifacts are treated as
  ready. Contract checks must fail on stale generated files and invalid mapping
  placeholders.
- Generate typed artifacts, validators, ports, payloads, manifests, metadata,
  and helpers before service logic tickets. Compile generated packages before
  dependent tickets start.
- Business implementation tickets depend on generated contracts and must not
  preserve stale aliases, compatibility wrappers, fallback synthesis, or
  storage-era shapes unless a migration ticket explicitly owns them.
- Frontend/client contract work waits until backend/service contracts are stable
  or is planned as an explicit compatibility adapter with tests.
- Acceptance criteria include deterministic generation under check mode, compile
  of generated packages, no weak types at closed boundaries, no handwritten
  duplicate contract mirrors, and no handwritten code crossing old compatibility
  paths without approved migration scope.

## Parallel Agent Boundaries

Use parallel agents only for independent, bounded work:

- Keep the immediate critical generator or integration path local to the
  controller when edits would conflict.
- Delegate read-only discovery for edge cases, generator slices, mapping gaps,
  or acceptance criteria when implementation would overlap.
- Delegate implementation only when `write_scope` is disjoint and contracts are
  frozen.
- Ask sidecar agents for exact files, tests, mapping fields, blockers, and
  acceptance evidence. Do not ask for broad opinions or whole-backend refactors.
- Integrate and verify centrally. Sidecar output is advisory until the
  controller updates specs/plans/tickets and runs checks.

## Checks

- Specs are approved; `language: en` and semantic judge passed when English
  smoke checks are used. Otherwise return gaps to `spec-readiness-review`.
- Readiness includes `end_to_end_definition_gate.status: passed`; otherwise
  return gaps to `spec-readiness-review`.
- No Wave 0/spec-closure implementation wave.
- Every wave declares `Slice Strategy`: vertical slice with reachable E2E
  outcome, or horizontal exception with rationale, unblocks, next vertical slice,
  and tests.
- Over-broad tickets spanning many domains/layers must be split or include
  explicit phase gates with blocking preflight checks, prerequisite artifacts,
  exact commands, and proof before later phases start.
- Active tickets include `slice_type`, `phase_gate_exception`, and numbered
  `Action Plan` steps. Broad multi-layer tickets fail unless
  `phase_gate_exception: true` and `Action Plan` contains blocking `Phase Gate:`
  proof points.
- Active tickets include `Spec Drift Controls`, `Generator And Type Plan`,
  `Modularity And Reuse Plan`, and `Review And Verification Plan`.
- Tickets that touch dependencies, databases, frameworks, cloud services,
  third-party APIs, SDKs, drivers, or generated tools cite approved spec/readiness
  refs instead of choosing versions or researching docs during planning.
- Contracts are ready. Contract-backed tickets name source artifacts, generation
  commands, deterministic tools, generated outputs/tests, regeneration, and
  drift checks.
- Clean-rebuild plans state patch/refactor versus clean boundary strategy,
  source-contract inventory, generation-map ownership, generated package
  sequence, handwritten remainder, compatibility/migration stance, and frontend
  contract timing.
- Tickets declare generated artifact prerequisites and owner before
  handler/client edits.
- Tickets that touch data shapes declare `representation_reuse` with a ready
  catalog ref, registered `shape_id` and mapping refs, or `not_applicable` with
  scoped evidence. They do not introduce exported DTOs, entities, schemas,
  events, records, projections, or mappers without an approved catalog entry.
- Closed contract surfaces reject weak boundary types such as Go
  `map[string]any`, TypeScript `any`, TypeScript `unknown`,
  `Record<string, unknown>`, anonymous map-shaped wrappers, and handwritten
  duplicate contract interfaces unless the source contract defines an open JSON
  leaf.
- Parallel sidecar work is read-only or has disjoint `write_scope`; broad tasks
  like "refactor backend", "fix all drift", or "generate everything" are
  rejected.
- Tickets declare `Test-First Order`: spec/contract/acceptance/unhappy-path
  tests first, then business logic. Split business-logic tickets depend on
  required contract/test foundations.
- Tickets require strict typing whenever the language/toolchain supports it,
  type/compile checks, no duplicate handwritten contract mirrors, no avoidable
  weak casts, and no manual type/class/interface work when approved generators
  can produce it.
- Tickets require modular code placement by the approved spec-defined
  file/folder structure, nested structure when sufficient for cohesion, reuse of
  existing helpers/modules/components/services, and explicit no-duplication
  checks.
- Every requirement, flow, NFR, public surface, and user/client path maps to a
  ticket or explicit deferral with source IDs preserved.
- Every capability inventory row and end-to-end definition chain maps to a
  ticket, explicit N/A, or explicit deferral with source IDs preserved.
- Acceptance covers happy/unhappy, security/privacy, recovery, logging,
  performance, integrity, release/operations, supply chain, UX states,
  accessibility, responsiveness, design/component reuse, and custom UI rationale
  or N/A evidence.
- Dependencies are acyclic; same-wave write scopes are disjoint; `_dependencies`
  mirrors `depends_on` and `unblocks`.
- No ticket asks agents to read all specs, ask users, decide behavior, invent
  frontend look and feel, hand-write generated shapes, or use vague phrasing.
- No ticket leaves task order, target files, commands, expected failures,
  generated artifacts, or verification proof for the implementer to derive.
- No ticket allows spec drift, invented behavior, avoidable manual generated
  shapes, avoidable weak typing, duplicate logic, misplaced domain code, or
  `accepted` lifecycle without review against ticket and specs.
- No ticket allows unapproved dependency versions or third-party behavior; those
  gaps return to `spec-readiness-review`.
- No placeholder/fake/mock/stub/no-op work unless specs explicitly require a test
  fixture/fake provider.
- `_status.yaml` supports the lifecycle `planned`, `ready`, `in_progress`,
  `implemented`, `review_pending`, `accepted`, plus `partial`, `blocked`, and
  `skipped`, resume notes, current proof, `superseded_by`, and affected specs. Changed
  specs create impact notes/follow-up tickets; completed tickets stay historical.
- `implementation-plan.md` has `Self-Audit`: assumptions, evidence, coverage,
  NFR/ops/supply-chain ownership, fake-work risk, parallel risk, blockers or
  none.
- Public and frontend/client surfaces include inventory, execution semantics,
  tests, docs/examples, safe defaults, hermetic fixtures, reachable access,
  screen/component ownership, states, accessibility, responsiveness, and
  design/style/component reuse or N/A.
- Default verification is hermetic; external systems are opt-in.
- Completed waves include unit and E2E tests. Final completion means all specs
  implemented, no gaps, no unresolved work, no unapproved fakes/placeholders, and
  full E2E alignment.
- Acceptance rows map to tests, command/browser verification, N/A evidence, or
  blocked status; no silent partial completion.
- Coverage thresholds come only from an approved project policy profile or an
  explicit spec threshold. Tickets must cite that policy/threshold; neither the
  planner nor an implementation agent invents a default percentage.
- Prefer deterministic generators/tools from approved contract sources; manual
  code/types/tests/docs must cite why generation is unavailable, unsafe, or out
  of scope.
- Release, rollback, runbook, dependency, SBOM/provenance,
  vulnerability/license work is assigned or marked N/A from specs.

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.
