# Planning Gates

## Contents

- Output
- Ticket Shape
- Contract-First Clean Rebuild Plans
- Parallel Agent Boundaries
- Checks

## Output

- `plans/implementation-plan.md`
- `plans/_registry.yaml`, `_status.yaml`, `_dependencies.yaml`, `_scope.yaml`
- `plans/wave_NN_slug/plan.md`
- `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`

Prefer vertical slices: each wave ends in a working, testable end-to-end
increment. If a slice is too large for one agent, split isolated tickets that
converge into the same wave result.

Horizontal waves are exceptions for foundation/interface work or reliability
refactors. State rationale, unblocks, next vertical slice, and test evidence.

For contract-first clean rebuilds, the generated foundation may be an approved
horizontal foundation wave when it produces a compilable, drift-checked boundary
that unblocks the next vertical slice.

## Ticket Shape

Frontmatter: `id`, `title`, `wave`, `status`, `parallel_group`, `depends_on`,
`blocked_by`, `spec_refs`, `write_scope`, `read_scope`, `contract_readiness`,
`generated_contracts`, `ticket_readiness`.

Body: `Goal`, `Context Digest`, `Implementation Approach`, `Decision Ledger`,
`Requirements Traceability`, `Contract Traceability`, `Slice Strategy`,
`Test-First Order`, `Tasks`, `Acceptance`, `Acceptance Test Matrix`,
`Operational Path Coverage`, `Verification`, `Non-goals`, `Handoff`.

Tickets are crisp human/AI instructions: boundaries, expectations, acceptance,
verification, no pasted specs, no implementation prose.

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
- No Wave 0/spec-closure implementation wave.
- Every wave declares `Slice Strategy`: vertical slice with reachable E2E
  outcome, or horizontal exception with rationale, unblocks, next vertical slice,
  and tests.
- Over-broad tickets spanning many domains/layers must be split or include
  explicit phase gates with blocking preflight checks and dependencies.
- Contracts are ready. Contract-backed tickets name source artifacts, generation
  commands, deterministic tools, generated outputs/tests, regeneration, and
  drift checks.
- Clean-rebuild plans state patch/refactor versus clean boundary strategy,
  source-contract inventory, generation-map ownership, generated package
  sequence, handwritten remainder, compatibility/migration stance, and frontend
  contract timing.
- Tickets declare generated artifact prerequisites and owner before
  handler/client edits.
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
- Every requirement, flow, NFR, public surface, and user/client path maps to a
  ticket or explicit deferral with source IDs preserved.
- Acceptance covers happy/unhappy, security/privacy, recovery, logging,
  performance, integrity, release/operations, supply chain, UX states,
  accessibility, responsiveness, design/component reuse, and custom UI rationale
  or N/A evidence.
- Dependencies are acyclic; same-wave write scopes are disjoint; `_dependencies`
  mirrors `depends_on` and `unblocks`.
- No ticket asks agents to read all specs, ask users, decide behavior, invent
  frontend look and feel, hand-write generated shapes, or use vague phrasing.
- No placeholder/fake/mock/stub/no-op work unless specs explicitly require a test
  fixture/fake provider.
- `_status.yaml` supports planned, in_progress, partial, blocked, done, skipped,
  resume notes, current proof, `superseded_by`, and affected specs. Changed
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
- Coverage defaults to 80% unless approved specs/project standards say
  otherwise; lower coverage needs explicit spec approval.
- Prefer deterministic generators/tools from approved contract sources; manual
  code/types/tests/docs must cite why generation is unavailable, unsafe, or out
  of scope.
- Release, rollback, runbook, dependency, SBOM/provenance,
  vulnerability/license work is assigned or marked N/A from specs.

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.
