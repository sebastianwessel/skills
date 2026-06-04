# Planning Gates

## Contents

- Output
- Ticket Shape
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

## Checks

- Specs are approved; `language: en` and semantic judge passed when English
  smoke checks are used. Otherwise return gaps to `spec-architect`.
- No Wave 0/spec-closure implementation wave.
- Every wave declares `Slice Strategy`: vertical slice with reachable E2E
  outcome, or horizontal exception with rationale, unblocks, next vertical slice,
  and tests.
- Over-broad tickets spanning many domains/layers must be split or include
  explicit phase gates with blocking preflight checks and dependencies.
- Contracts are ready. Contract-backed tickets name source artifacts, generation
  commands, deterministic tools, generated outputs/tests, regeneration, and
  drift checks.
- Tickets declare generated artifact prerequisites and owner before
  handler/client edits.
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
