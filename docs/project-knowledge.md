# Project knowledge

Use one versioned set of Markdown pages to explain what the project does, how
it works, who owns its rules, and where decisions are still needed. Start at
`specs/index.md`. The same pages work in GitHub, in an editor, and as a
documentation site. Agents use the owning pages and exact contract references
when planning or implementing work.

![Project entry point links to the business, structure, and process views. Owning pages link to decisions and gaps.](assets/project-knowledge.svg)

[Full-size diagram](assets/project-knowledge.svg) · [Editable Draw.io source](assets/project-knowledge.drawio)

## Organize around ownership

| View | What belongs here |
| --- | --- |
| Business vision and domains | Goals, scope, success measures, actors, vocabulary and governing business rules. Each rule has one owner. |
| Solution design | System boundary, external dependencies, major design constraints and a map of how components fit together. |
| Components | Responsibilities, interfaces, dependencies, data ownership and operational boundaries for a service, module, package or integration. |
| Processes and flows | End-to-end outcomes, triggers, guards, variants, ordered handoffs, failure and recovery behavior, and linked acceptance criteria. |

The entry point links to vision, solution design, the capability inventory,
end-to-end coverage, decisions, and gaps. Link to the individual domain,
component, and flow pages from there or from one clearly labeled section
index. From a flow, a reader should reach its governing business rule and
interface contract directly.

Group related variants on the same flow page when readers can compare them
without losing the shared sequence. Give each material variant a stable ID.
Split a view when boundaries, ownership, outcomes, or recovery diverge.

## Keep changes small

Start with the page that owns the changed fact. Inspect the dependent flows,
contracts, trace, and diagrams, and edit those whose meaning or coverage
changes. A terminology correction inside a page leaves its indexes and
neighboring pages intact. A change in an externally visible outcome
can require updates to affected definitions and verification in the same PR.

Use stable titles and IDs in indexes. Keep status and rationale on the page
that owns them. Build search indexes and derived navigation outside the
canonical tree. The current manifest covers the full tree, so even an
editorial edit there requires a new content-bound approval. That cost buys
a simple rule about which revision was reviewed. Scoped approval would need a
separate change that preserves cross-flow impact checks.

## Record decisions and questions

Place a decision record (ADR) beside its primary owner. Give it a stable ID,
scope, context, options, decision, consequences, and approval evidence. Make
it directly discoverable in the decisions overview and from the primary owning
page. Link from the ADR to every affected definition. Use the subject
`business`, `technical`, or `mixed`. The decision authority registry says
who can approve each decision. Apply the accepted outcome in the owning rule
so readers can find current behavior without reading decision history.

Record unanswered questions, contradictions, and missing edge or recovery
paths in the gaps overview. Give each gap an owner, affected scope, evidence,
and a next action. A documented open gap keeps work visible and blocks
readiness. A deferred gap needs an approved scope exclusion and a revisit trigger.
A resolved gap links to the definition or verification that closes it.

Walk the failure paths as well as success. For a retriable operation, for
example, document retry preconditions, limits, duplicate protection,
observable status, escalation, and the final state after exhaustion. Define
what automated recovery may safely do and when it must stop. Verify each
material branch against an acceptance criterion. Record scoped applicability
for paths that cannot occur.

Meeting notices, agendas, and notes are optional. Keep them in an
access-controlled area when needed. A concise notice can include purpose,
time zone, attendees, prereads, and decisions requested. Notes can capture
outcomes, actions, and unresolved items. Transfer durable outcomes into the
owning rules, ADRs, or gaps with appropriate evidence.

## Draw and publish

Pick a visual for one question. A context map shows the system boundary and
neighbors. A structural view shows ownership. A flow or state view shows
handoffs, branches, and recovery. Keep the editable Draw.io source, exported
image, and owning prose synchronized. Inspect the export at normal and
narrow widths for legible labels, clear direction, contrast, unclipped text,
and crossings. Put the important paths in nearby Markdown and provide a
full-size link when the image needs zoom.

This repository includes a MkDocs configuration for its own human guides.
From the repository root, use MkDocs 1.6.1 to build or preview them. CI runs the
strict build on Linux.

```bash
mkdocs build --strict
mkdocs serve
```

In a consuming project, use `docs_dir: specs` for a full internal preview.
For public or limited audiences, build from an explicit selection of reviewed
pages and assets. Inspect the final HTML, static assets, and search index.
MkDocs copies files in its source directory even when they are absent from the
sidebar. Keep restricted meetings, evidence, internal contracts, and diagrams
outside the publication input. [MkDocs configuration](https://www.mkdocs.org/user-guide/configuration/#exclude_docs)

## Adopt and verify

1. Use `specs/index.md` with `x-project-knowledge-version: 1` as the entry
   point. Use the current report and manifest formats when updating an existing
   spec set.
2. Use [Spec Architect](skills/spec-architect.md) to add owners, direct links,
   decisions, gaps, and valuable visuals. The profile uses OKF v0.3 Markdown
   and frontmatter conventions with project-specific fields under
   `x-project-*`. Approval still comes from your decision and readiness
   records. [OKF v0.3 specification](https://github.com/open-knowledge-format/open-knowledge-format/blob/527e81aff55992be21507e97004286789126f88c/SPEC.md)
3. Use [Spec Readiness Review](skills/spec-readiness-review.md) to test links,
   compare the governing sources, trace one success and each material failure
   branch, and inspect the rendered diagrams. Try finding a business rule, a
   contract, a recovery outcome, and an ADR from the project entry point.

This is the frontmatter for a draft decision near its component. In the body,
link the affected definition and write the context, options, and consequences.
At acceptance, record the immutable approval and add the matching authority
entry. Add the decision to the central overview when you create it.

```yaml
---
type: ADR
title: Ownership of eligibility rules
description: Records where eligibility rules are defined and maintained.
x-project-id: ADR-014
x-project-owner: policy-team
x-project-domain: mixed
x-project-state: proposed
x-project-scope: [components/eligibility/eligibility.md]
---
```
