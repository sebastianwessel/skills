---
name: spec-implementation-planner
description: Turns approved specs into scoped, dependency-ordered tickets. Use when creating or repairing a delivery plan, assigning acceptance scenarios, sizing work, or deciding which ticket can start.
---

# Spec Implementation Planner

Start with the requested outcome in `specs/index.md`. Run the readiness
package's `scripts/check_specs.mjs <repo-root>/specs --approved` with Node.
A missing approval, conflicting requirement or undefined failure outcome goes
back to the source owner. Stop the affected planning work until the gate passes.

1. Read `specs/acceptance.yaml`, the governing definitions it cites and the
   project conventions that constrain this change. Group the scenarios into
   waves that each deliver a working, verifiable outcome. A small change can
   use one wave and one ticket. Explain any foundation wave by naming the
   first scenario it unblocks and the proof its consumers need.
2. Write a short `plans/wave_01_slug/plan.md` for each wave and one ticket per
   independently verifiable outcome. Use the [ticket and progress format](references/planning-gates.md).
   Declare a dependency once, on the ticket that needs its result. Split
   work when separate outcomes, shared writes or unresolved prerequisites
   prevent one agent from finishing the ticket. Size each ticket XS through XL.
3. Specify the governing sources, test-first steps, exact commands and expected
   proof in the ticket body. Name generated interfaces, existing modules and
   consumers where relevant. Schedule contract generation, compilation and
   drift checks before dependent handwritten work. Give scoped failure,
   security/privacy, data integrity, recovery, performance, accessibility,
   operations, release/rollback and supply-chain scenarios an owner.
4. After reviewing the definition changes and their impact, run both commands
   below, substituting the installed planner directory and target repository.
   A ticket with accepted prerequisites can move to `ready` after its handoff
   passes semantic review. Record that decision in its progress file. Run the
   checker again after changing progress. Only independent review accepts work.

```sh
node <planner>/scripts/generate_plan_manifest.mjs <repo-root>
node <planner>/scripts/check_plan.mjs <repo-root>
```

**Self-audit.** Trace each approved scenario from its source to a bounded
ticket and an observable result. Check the wave outcome, test-first order,
command effects, dependency graph, scope, impacted consumers and applicable
reliability controls. Record assumptions, skipped checks and unresolved gaps
in the wave plan. Route definition gaps to the spec owner and ordering or
coverage gaps back into the plan before handing off a ticket.
