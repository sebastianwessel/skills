# Planning Gates

## Output

- `plans/implementation-plan.md`
- `plans/_registry.yaml`, `_status.yaml`, `_dependencies.yaml`, `_scope.yaml`
- `plans/wave_NN_slug/plan.md`
- `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`

Prefer vertical slices. Each wave should end in a working, testable end-to-end
increment across the layers required for that scope. A vertical slice may be too
large for one agent; split it into isolated tickets that converge into the same
wave result instead of leaving disconnected implementation parts.

Horizontal waves are exceptions. Use them only for foundation/interface work
needed to safely split parallel agents, or refactors that improve reliability.
Every horizontal exception must state why it is necessary, what it unblocks, the
next vertical slice, and how the completed work will be tested before it is
consumed by later tickets.

## Ticket Shape

Frontmatter: `id`, `title`, `wave`, `status`, `parallel_group`, `depends_on`,
`blocked_by`, `spec_refs`, `write_scope`, `read_scope`, `contract_readiness`,
`generated_contracts`, `ticket_readiness`.

Body: `Goal`, `Context Digest`, `Implementation Approach`, `Decision Ledger`,
`Requirements Traceability`, `Contract Traceability`, `Slice Strategy`,
`Tasks`, `Acceptance`, `Acceptance Test Matrix`, `Operational Path Coverage`,
`Verification`, `Non-goals`, `Handoff`.

Tickets are crisp human/AI instructions: boundaries, expectations, acceptance,
verification, no pasted specs, no implementation prose.

## Checks

- specs approved; otherwise return gaps to `spec-architect`
- approved specs declare `language: en` and passed semantic judge review when
  English smoke checks are used
- no Wave 0/spec-closure implementation wave
- every wave declares `Slice Strategy`: vertical slice, or horizontal foundation/
  refactor exception with rationale, unblocked tickets, next vertical slice, and
  test evidence
- every non-exception wave declares a working end-to-end outcome that is
  reachable and testable at wave completion
- avoid plans that complete many horizontal/backend/frontend parts while no
  user-facing or client-consumed path is finished end to end
- ready contracts, no missing contracts, no open decisions
- contract-backed tickets identify generation commands, generated outputs,
  generated tests, owning source artifacts, deterministic generators/tools, and
  regeneration/drift checks
- every requirement/spec/capability/flow/NFR maps to ticket or explicit deferral
  with source requirement IDs preserved
- happy, unhappy, recovery, security/privacy, observability/logging,
  performance/resilience, data-integrity, production/release, and supply-chain
  requirements map to ticket acceptance and verification
- user-facing or client-consumed flows map to tickets for access path,
  screens/surfaces, user flows, UI states, accessibility/responsiveness, design
  sources, framework/component-library use, reusable components/modules, and
  custom UI/style rationale or explicit N/A evidence
- dependencies acyclic; same-wave write scopes disjoint
- wave `Implementation Order`; `_dependencies.yaml` mirrors dependencies and
  each dependency lists matching `unblocks`
- no ticket asks agents to read all specs, ask users, decide behavior, choose
  logging/retry/performance/rollback/security, invent frontend look and feel,
  create custom UI/components/styles without spec approval, hand-write generated
  contract shapes, or use vague phrasing
- no placeholder/fake/mock/stub/no-op work unless specs explicitly require a
  test fixture/fake provider
- `_status.yaml` supports planned, in_progress, partial, blocked, done, skipped,
  resume notes, and current proof
- changed specs update indexes, wave impact notes, follow-up tickets; completed
  tickets stay historical
- obsolete planned tickets are `skipped`; partial work is `blocked` or `partial`
  with `superseded_by`, affected specs, resume notes
- `implementation-plan.md` has `Self-Audit`: assumptions, evidence,
  requirement/path coverage, NFR/operations/supply-chain ownership, fake-work
  risk, parallel risk, blockers or none
- public surfaces include inventory, execution semantics, tests, docs, examples,
  helpers, safe defaults, and hermetic fixtures; raw refs stay advanced only
- frontend/client surfaces include reachable navigation/access, screen or
  component ownership, loading/empty/error/success/permission states,
  accessibility/responsiveness, design-source reuse, and shared style/component
  reuse; non-UI waves cite N/A evidence from specs
- default verification is hermetic; external systems are opt-in
- completed waves include unit tests and end-to-end tests for the wave scope;
  final plan completion requires all spec requirements implemented, no gaps, no
  unresolved implementation work, no unapproved fake/mock/stub/placeholder
  production paths, and full end-to-end alignment with approved specs
- coverage defaults to 80% code coverage unless approved specs or project
  standards define a different threshold; lower coverage needs explicit spec
  approval
- deterministic generators/tools are preferred when approved contract sources
  support them; manual code/types/tests/docs must cite why generation is
  unavailable, unsafe, or out of scope
- release, rollback, runbook, dependency, SBOM/provenance, vulnerability/license
  work is assigned or marked N/A from specs

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.
