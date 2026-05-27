# Planning Gates

## Output

- `plans/implementation-plan.md`
- `plans/_registry.yaml`, `_status.yaml`, `_dependencies.yaml`, `_scope.yaml`
- `plans/wave_NN_slug/plan.md`
- `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`

Each wave ends in a working end-to-end increment. Use interface/foundation
tickets first when parallel agents need shared contracts.

## Ticket Shape

Frontmatter: `id`, `title`, `wave`, `status`, `parallel_group`, `depends_on`,
`blocked_by`, `spec_refs`, `write_scope`, `read_scope`, `contract_readiness`,
`ticket_readiness`.

Body: `Goal`, `Context Digest`, `Implementation Approach`, `Decision Ledger`,
`Requirements Traceability`, `Contract Traceability`, `Tasks`, `Acceptance`,
`Acceptance Test Matrix`, `Operational Path Coverage`, `Verification`,
`Non-goals`, `Handoff`.

Tickets are crisp human/AI instructions: boundaries, expectations, acceptance,
verification, no pasted specs, no implementation prose.

## Checks

- specs approved; otherwise return gaps to `spec-architect`
- approved specs declare `language: en` and passed semantic judge review when
  English smoke checks are used
- no Wave 0/spec-closure implementation wave
- ready contracts, no missing contracts, no open decisions
- every requirement/spec/capability/flow/NFR maps to ticket or explicit deferral
  with source requirement IDs preserved
- happy, unhappy, recovery, security/privacy, observability/logging,
  performance/resilience, data-integrity, production/release, and supply-chain
  requirements map to ticket acceptance and verification
- dependencies acyclic; same-wave write scopes disjoint
- wave `Implementation Order`; `_dependencies.yaml` mirrors dependencies and
  each dependency lists matching `unblocks`
- no ticket asks agents to read all specs, ask users, decide behavior, choose
  logging/retry/performance/rollback/security, or use vague phrasing
- no placeholder/fake/mock/stub/no-op work unless specs explicitly require a
  test fixture/fake provider
- `_status.yaml` supports planned, in_progress, partial, blocked, done, skipped,
  resume notes, and current proof
- `implementation-plan.md` has `Self-Audit`: assumptions, evidence,
  requirement/path coverage, NFR/operations/supply-chain ownership, fake-work
  risk, parallel risk, blockers or none
- public surfaces include inventory, execution semantics, tests, docs, examples,
  helpers, safe defaults, and hermetic fixtures; raw refs stay advanced only
- default verification is hermetic; external systems are opt-in
- release, rollback, runbook, dependency, SBOM/provenance, vulnerability/license
  work is assigned or marked N/A from specs

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.
