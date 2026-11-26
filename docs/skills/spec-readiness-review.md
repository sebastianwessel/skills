# Spec Readiness Review

Use this skill when you need to know whether the team may plan against a
particular revision of the specs. Bring the project map, acceptance scenarios,
governing sources and any prior findings.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Review the cancellation flow before we plan it. Follow the rule and each
> acceptance scenario, including the repeat request. Tell me which revision
> needs my approval and what still blocks it.

The reviewer follows each material path to its final state. It checks the
applicable security, privacy, recovery, data integrity, performance and release
requirements against the sources. For example, if a non-owner can call the
cancellation endpoint, the reviewer checks what that person may learn and how
the team will verify it.

## Read the result

A finding names the affected source, impact and owner. Ask Spec Architect to
correct a missing rule. For a complete spec, the reviewer records the semantic
review and asks the authorized human to approve the same whole-spec digest.
The readiness report lives in `specs/.readiness-report.yaml`. The packaged
checker, `scripts/check_specs.mjs <spec-root> --approved`, verifies that the
recorded approvals cover the current bytes. Any subsequent edit to a governing
source requires fresh review and approval.

[Resolve a spec finding](spec-architect.md) · [Plan from approved specs](spec-implementation-planner.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-readiness-review/SKILL.md)
