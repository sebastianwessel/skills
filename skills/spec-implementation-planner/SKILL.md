---
name: spec-implementation-planner
description: Turns approved specs into waves, dependency indexes, AFK tickets, and status tracking. Use when specs need parallel-agent planning, ticket readiness, blockers/unblocks, or plan gap checks.
---

# Spec Implementation Planner

Turn approved specs into vertical-slice waves and implementation-ready AFK
tickets agents can execute in isolation without guessing.

## Hard Gate

Read `specs/.readiness-report.yaml`. Stop unless:

- `status: approved`
- `human_approval.status: approved`
- `approval_evidence.manifest_digest` equals `spec-manifest.yaml.content_digest`
- readiness/gate simulation passed or can be rerun successfully
- `checklist_walk_gate.status: passed` with zero blocking findings
- `end_to_end_definition_gate.status: passed`
- `current_dependency_research_gate.status: passed`
- `representation_reuse_gate.status: passed` when data shapes are in scope
- `language: en` and `semantic_judge_gate.status: passed` when deterministic
  English smoke checks are used

If blocked, write a spec gap/readiness note. Do not create executable tickets.

Plan only from approved specs, ticket rules, contracts, and verification.
Otherwise create a spec/plan gap.

## Workflow

1. Verify all ticket fields and action-plan steps are fillable from approved
   specs.
2. Create `plans/implementation-plan.md`, `plan-manifest.yaml`, and structurally
   reconciled `_registry`, `_status`, `_dependencies`, and `_scope`. Use only the strict
   YAML subset in `references/planning-gates.md`; never rely on prose or a
   global `N/A` to satisfy a ticket gate.
3. Prefer vertical slices. Each wave ends with a working, testable end-to-end
   increment. If too large for one agent, split isolated tickets that converge
   into the same wave result.
4. Use horizontal waves only for approved foundation/interface work or
   reliability refactors; document rationale, unblocks, tests, and next vertical
   slice.
5. When specs select a contract-first clean rebuild, plan the generated
   foundation next to the old boundary and block handwritten service work until
   mapping metadata, generators, generated tests, compile checks, and drift
   checks pass.
6. Plan contract/codegen foundations before parallel backend/client/adapter
   work; keep parallel writes isolated and sidecar agents read-only unless their
   write scopes are disjoint.
7. Plan test-driven order: derive unit, contract, integration, and E2E tests
   from specs/contracts/acceptance/unhappy paths before business logic tickets
   implement the behavior those tests prove.
8. Map the approved `00-traceability.yaml` requirement, capability, path, and
   acceptance IDs into tickets and local testable acceptance rows; collectively
   cover every non-N/A source ID. Map capability inventory rows and end-to-end
   definition chains into tickets:
   actor/consumer, entrypoint/reachability, contracts, data lifecycle, states,
   side effects, permissions, recovery, observability, acceptance,
   verification, NFRs, operations, supply chain, frontend/client UX,
   design/component reuse, tests, and coverage.
9. Split tickets until each active ticket has one bounded deliverable, exact
   write scope, exact prerequisite artifacts, and a numbered action plan with
   files/commands/proof for every step. Use phase-gated exceptions only when
   the approved work is atomic and each phase blocks on explicit evidence.
10. Require ticket sections for spec-drift controls, generator-first artifacts,
   representation catalog/reuse, TDD including unhappy paths, strict typing,
   modular domain structure, reuse/no-duplication, and review against ticket
   plus specs. Domain structure and dependency choices must follow the approved
   readiness evidence.
11. Track the lifecycle `planned -> ready -> in_progress -> implemented ->
   review_pending -> accepted`; use `partial`, `blocked`, and `skipped` only as
   explicit side states. Maintain exact `depends_on`, `blocked_by`, and
   `unblocks` in the ticket and every plan index.
12. Self-audit vertical-slice completeness, generation-map coverage, strong
    boundary types, path/NFR/frontend/release ownership, parallel risk,
    fake-work risk, and blockers.
13. Run `references/planning-gates.md`, then
   `node <spec-implementation-planner-skill-root>/references/generate_plan_manifest.mjs <repo-root> [plans-root] [specs-root]`, then
   `node <spec-implementation-planner-skill-root>/references/check_plan.mjs <repo-root> [plans-root] [specs-root]`.

## Ticket Contract And Handoff

`references/planning-gates.md` owns the exact structural ticket contract,
autonomy, command, traceability, generated-contract, reuse, action-step,
acceptance, lifecycle, and anti-pattern rules. Tickets pin both content digests
and may authorize only D0/D1 work. Missing semantic evidence is a spec gap;
never emit a ticket that asks an implementer to decide, infer, or invent.

After `accepted`, keep work historical. New gates create remediation/migration
tickets; use `blocked`, `partial`, `skipped`, `superseded_by`, and resume notes
explicitly. Ready tickets go to implementation; waves go to independent review.
