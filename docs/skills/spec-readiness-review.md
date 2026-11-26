# Spec Readiness Review

Use this skill when you need to know whether the team may plan against a
defined slice of behavior. Bring the project map, acceptance scenarios,
governing sources and any prior findings. Other parts of the spec can still
contain open questions.

## Installation

```bash
npx skills add sebastianwessel/skills
```

## Try it

> Review the cancellation flow before we plan it. Follow the rule and each
> acceptance scenario, including the repeat request. Tell me what the approval covers
> and what still blocks it.

The reviewer follows each material path to its final state. It checks the
applicable security, privacy, recovery, data integrity, performance and release
requirements against the sources. For example, if a non-owner can call the
cancellation endpoint, the reviewer checks what that person may learn and how
the team will verify it.

## Read the result

A finding names the affected rule, impact and decision needed. When the slice
is complete, the independent reviewer and authorized human review the same
digest. The record is `reviews/readiness/<slice-id>.yaml`. The packaged
checker, `scripts/check_specs.mjs <spec-root> --approved <slice-id>`, verifies
that the selected scenarios and governing inputs still match it. The reviewer
checks the evidence and all dependencies. A refinement outside those inputs
leaves this approval current.

[Resolve a spec finding](spec-architect.md) · [Plan from approved specs](spec-implementation-planner.md)

[Agent instructions](https://github.com/sebastianwessel/skills/blob/main/skills/spec-readiness-review/SKILL.md)
