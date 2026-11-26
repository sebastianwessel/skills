---
name: agent-skill-architect
description: Creates and improves Agent Skills packages. Use when writing a skill, fixing trigger overlap, shortening instructions, testing scenario behavior, or checking a skill before distribution.
---

# Agent Skill Architect

Keep each skill focused on one outcome and make the critical path easy to
find. Use the published Agent Skills metadata and the target repository's
package conventions.

1. Identify the trigger, near-miss requests, intended output, owner, tools,
   and failure points. Compare existing skills before adding a new one.
2. Write realistic eval cases using [Eval design](references/eval-design.md).
   Include a normal request, a real blocker, and a request that belongs to
   another skill. Prefer inputs that exercise the actual work.
3. Put the workflow, exit criteria, and blocker routing in `SKILL.md`.
   Link directly to focused references. Keep fragile mechanical checks in
   small scripts and use semantic review for judgment. Apply
   [Quality gates](references/quality-gates.md).
4. Run `node <agent-skill-architect>/scripts/check_skill.mjs <skill-directory>`.
   Run the package's tests and scenario evals where the runner is available.
   Fix failures and rerun. Record which scenarios ran and what they proved.
5. Self-audit against the request, observed behavior, references, and skipped
   verification. Stop approval when a critical dependency, ambiguous trigger,
   unsafe behavior, or unverified required check remains.

Use static analysis to spot package problems. Claim improved task quality or
token use only when comparative runs measure it.
