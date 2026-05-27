# Pre-Implementation Checks

Run BEFORE writing any code for a ticket.

## 1. Environment Verification

- [ ] Working directory is correct (project root)
- [ ] Dependencies installed and up to date
- [ ] Repository in clean state or has only unrelated changes
- [ ] `specs/.readiness-report.yaml` exists and records approved specs

## 2. Baseline Verification

Run the project's standard verification commands BEFORE any changes. Find these in:
- The project's IMPLEMENTATION.md
- The project's test strategy spec
- Package scripts, Makefile, or build configuration

All verification commands must pass.

### Handling Pre-Existing Failures

If failures exist outside this ticket's write scope:
- Document them. Proceed with implementation.
- Do not fix them.

If failures exist within this ticket's write scope:
- Document them. These will be fixed by the implementation.

## 3. Ticket Parsing

Read the ticket file completely:

- [ ] Frontmatter extracted: `id`, `wave`, `depends_on`, `blocked_by`, `write_scope`, `read_scope`, `spec_refs`
- [ ] Context Digest understood
- [ ] Implementation Approach noted
- [ ] Acceptance Criteria listed
- [ ] Verification Commands copied exactly
- [ ] Ticket is executable/AFK, not blocked/HITL
- [ ] No acceptance criterion requires behavior missing from `spec_refs`

## 4. Dependency Check

Check the project's status tracking file (`_status.yaml` or equivalent):
- [ ] All tickets in `depends_on` are `done` or `merged`
- [ ] No tickets in `blocked_by` are still active

If dependencies not satisfied: STOP. Return error. Do not implement.

## 5. Project Pattern Review

Read the project's implementation guide (`.agent/IMPLEMENTATION.md` or `specs/00-conventions.md`):
- [ ] Naming conventions understood
- [ ] File structure patterns understood
- [ ] Code style understood
- [ ] Testing patterns understood
- [ ] Error handling patterns understood
- [ ] Verification commands confirmed

## 6. Scoped Spec Reading

Read ONLY files in `read_scope` and `spec_refs`:
- [ ] Contract schemas read
- [ ] Port definitions read
- [ ] Flow specs read
- [ ] Error taxonomy checked
- [ ] Public API inventory entries read for any changed SDK/API/CLI/config/schema/protocol/plugin/tool/policy/extension point
- [ ] Execution semantics classification read for callable public surfaces
- [ ] Durable manifest version, digest, canonicalization, snapshot, replay, compatibility, and validation-error rules read when manifests are in scope
- [ ] Docs/example paths from the ticket or inventory checked for reachability
- [ ] Public builder/helper path and any raw-ref escape hatch understood

Do NOT read entire folders or unrelated files.

If a required contract, error, API field, flow, policy, persistence behavior, or failure path is missing from scoped specs: STOP and write a spec gap. Do not infer during implementation.

## 7. Ready

All above complete before any code is written.
