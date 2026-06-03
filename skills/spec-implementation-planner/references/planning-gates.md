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

- specs approved; otherwise return gaps to `spec-architect`
- approved specs declare `language: en` and passed semantic judge review when
  English smoke checks are used
- no Wave 0/spec-closure implementation wave
- every wave declares `Slice Strategy`: vertical slice, or horizontal exception
  with rationale, unblocks, next vertical slice, and test evidence
- every non-exception wave has a reachable, testable end-to-end outcome; avoid
  many horizontal parts with no finished user/client path
- ready contracts, no missing contracts, no open decisions
- contract-backed tickets identify generation commands, generated outputs,
  generated tests, owning source artifacts, deterministic generators/tools, and
  regeneration/drift checks
- tickets declare `Test-First Order`: spec/contract/acceptance/unhappy-path
  tests first, business logic after those tests exist
- business-logic tickets depend on required contract/test foundation tickets
  when split across agents
- every requirement/spec/capability/flow/NFR maps to ticket or explicit deferral
  with source requirement IDs preserved
- happy/unhappy, recovery, security/privacy, logging, performance, integrity,
  production/release, and supply-chain requirements map to acceptance and
  verification
- user/client flows map access, screens, states, accessibility/responsiveness,
  design/component reuse, and custom UI rationale or N/A evidence
- dependencies acyclic; same-wave write scopes disjoint
- wave `Implementation Order`; `_dependencies.yaml` mirrors dependencies and
  each dependency lists matching `unblocks`
- no ticket asks agents to read all specs, ask users, decide behavior, invent
  frontend look and feel, hand-write generated contract shapes, or use vague
  phrasing
- no placeholder/fake/mock/stub/no-op work unless specs explicitly require a
  test fixture/fake provider
- `_status.yaml` supports planned, in_progress, partial, blocked, done, skipped,
  resume notes, current proof, `superseded_by`, and affected specs
- changed specs update indexes, wave impact notes, and follow-up tickets;
  completed tickets stay historical
- `implementation-plan.md` has `Self-Audit`: assumptions, evidence,
  requirement/path coverage, NFR/operations/supply-chain ownership, fake-work
  risk, parallel risk, blockers or none
- public surfaces include inventory, execution semantics, tests, docs, examples,
  helpers, safe defaults, hermetic fixtures, and advanced raw refs only
- frontend/client surfaces include reachable access, screen/component ownership,
  loading/empty/error/success/permission states, accessibility/responsiveness,
  and design/style/component reuse or N/A evidence
- default verification is hermetic; external systems are opt-in
- completed waves include unit and end-to-end tests; final completion requires
  all spec requirements implemented, no gaps, no unresolved work, no unapproved
  fake/mock/stub/placeholder paths, and full E2E spec alignment
- coverage defaults to 80% code coverage unless approved specs or project
  standards define a different threshold; lower coverage needs explicit spec
  approval
- deterministic generators/tools are preferred when approved contract sources
  support them; manual code/types/tests/docs must cite why generation is
  unavailable, unsafe, or out of scope
- release, rollback, runbook, dependency, SBOM/provenance, vulnerability/license
  work is assigned or marked N/A from specs

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.
