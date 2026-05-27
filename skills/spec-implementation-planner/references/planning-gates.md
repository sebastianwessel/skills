# Planning Gates

## Output

- `plans/implementation-plan.md`
- `plans/_registry.yaml`, `_status.yaml`, `_dependencies.yaml`, `_scope.yaml`
- `plans/wave_NN_slug/plan.md`
- `plans/wave_NN_slug/tickets/TICKET-NNN-name.md`

Each wave ends in a working end-to-end increment for its scope. Use a
foundation/interface ticket first when parallel agents need a shared boundary,
then split backend, frontend, adapter, docs, and tests against that contract.

## Ticket

Frontmatter: `id`, `title`, `wave`, `status`, `parallel_group`,
`depends_on`, `blocked_by`, `spec_refs`, `write_scope`, `read_scope`,
`contract_readiness`, `ticket_readiness`.

Body: `Goal`, `Context Digest`, `Implementation Approach`, `Decision Ledger`,
`Contract Traceability`, `Tasks`, `Acceptance`, `Acceptance Test Matrix`,
`Verification`, `Non-goals`, `Handoff`.

Tickets are short human/AI instructions. They define boundaries, expectations,
acceptance, and verification; they do not paste specs, over-explain rationale,
or pre-write implementation.

## Checks

- specs approved; otherwise return gaps to `spec-architect`
- no Wave 0/spec-closure implementation wave
- ticket readiness: ready contracts, no missing contracts, no open decisions
- every spec/capability/flow/NFR maps to ticket or explicit deferral
- dependencies acyclic; same-wave write scopes disjoint
- each wave has `Implementation Order`; `_dependencies.yaml` mirrors every
  ticket's `depends_on` and `blocked_by`, and dependency tickets list matching
  `unblocks`
- no ticket asks agents to read all specs, ask users, or decide behavior
- no placeholder, fake, mock, stub, or no-op implementation unless explicitly a
  test fixture/fake provider from specs
- `_status.yaml` supports pause/resume with planned, in_progress, partial,
  blocked, done, skipped, and resume notes or current proof
- `implementation-plan.md` has `Self-Audit`: weakest assumptions, evidence for
  readiness, fake-work risk, parallel-boundary risk, and blockers or `none`
- public surfaces include inventory, execution semantics, tests, docs, examples,
  helpers, defaults/overrides, and hermetic fixtures
- raw refs only behind public builders/helpers
- default verification is hermetic; external systems use opt-in commands

Run `node references/check_plan.mjs <repo-root> [plans-root] [specs-root]` and
`node references/check_wave_readiness.mjs <repo-root> <wave-id>`.
