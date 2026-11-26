# Project knowledge

Start with `specs/index.md`. Link from it to the pages where people define
business rules, describe system boundaries and explain flows. An engineer
debugging a repeat request and a product owner checking policy should be able to
find the same rule. Follow those links before opening tickets or review history.

![The project map links to business rules, solution design and processes. The owning page leads to decisions and gaps.](assets/project-knowledge.svg)

[Full-size diagram](assets/project-knowledge.svg) · [Editable Draw.io source](assets/project-knowledge.drawio)

## Cancelling a reservation

An approved support policy allows a member to cancel their own confirmed
reservation. Link to `reservations.md` from `specs/index.md`. On the linked
page, write the policy and the outcomes it governs.

```markdown
## Cancel a reservation

A member can cancel a confirmed reservation they own. After the first
request its state is cancelled. Repeating the cancellation leaves it
cancelled. Source: approved support policy, “Member cancellations.”
```

Give those outcomes stable scenario IDs in `specs/acceptance.yaml`.

```yaml
scenarios:
  - id: AC-CANCEL
    source: reservations.md#cancel-a-reservation
    verify:
      - "Observe the member's confirmed reservation change to cancelled."
  - id: AC-CANCEL-REPEAT
    source: reservations.md#cancel-a-reservation
    verify:
      - "Repeat the cancellation and verify that the reservation stays cancelled."
```

Suppose the policy leaves the response to another member's request unspecified.
Record the privacy question in a linked `gaps/` record, name the decision owner,
and keep affected work blocked. The owner can settle the
response and what may be disclosed. The author then updates the rule and
adds the corresponding acceptance scenario. Readiness review checks these
outcomes against the source and asks for approval of that revision.

An implementation ticket cites the approved scenarios. During review, someone
independent of the implementer follows the cancellation through the real entry
point, checks the resulting state and examines the verification for each
outcome. A passing test for the first request alone leaves the repeat
scenario unverified.

## Organize around ownership

| Reader's question | Owning page |
| --- | --- |
| What business outcome, terms and policy apply? | Vision or domain |
| Which boundaries and constraints shape the system? | Solution design |
| Who owns this interface, data or operational boundary? | Component |
| What starts the process, what can fail and how does it end? | Flow |

Use a single topic page when it answers the question. Split it when the
ownership, recovery behavior or outcome diverges. Group comparable variants
under stable headings. Link directly to the governing rule and interface.
When wording changes, edit its owner and inspect the links, scenarios and
diagrams whose meaning could change. Review and human approval cover the
whole spec revision, including editorial changes.

## Decisions, gaps and meetings

Use an architectural decision record (ADR) when people need to understand
why a choice was made. Put it beside its owner, record its scope, options,
consequences and approval evidence, and apply the chosen behavior to the
governing page. Link to an overview when several records need a common entry
point. For an open gap, give the affected scope, decision owner and next
action. When it closes, link the resolved rule and how it will be verified.

Record applicable failure paths through their final outcomes. For a retriable
operation, cover duplicate protection, retry limits, escalation and the last
observable state. Where automated recovery may stop, say who takes over.

Meeting notices, agendas and notes are optional. Keep them in the appropriate
access-controlled workspace. Record purpose, date and time zone, decisions
sought and next actions as appropriate. Transfer decisions into the owning
rule after confirming authority. If your project exchanges knowledge via OKF,
use its metadata conventions on the relevant Markdown pages. [OKF specification](https://github.com/open-knowledge-format/open-knowledge-format/blob/527e81aff55992be21507e97004286789126f88c/SPEC.md)

## Draw and publish

Choose the diagram for the reader's question. A context view shows neighboring
systems. A state or sequence view can make retries, ordering and recovery
clearer. Keep the editable Draw.io source and exported SVG or PNG beside the
owning explanation or in its linked assets. Check the export at normal and
narrow widths for legible labels, clear direction, contrast and unclipped text.
Describe the important paths in nearby Markdown and provide a full-size link.

This repository's human guides can be previewed locally with MkDocs 1.6.1.
From the repository root, build or start the preview:

```bash
mkdocs build --strict
mkdocs serve
```

For a full internal preview in your own project, point `docs_dir` at `specs`.
For a public or limited audience, stage only reviewed pages and assets and
build from that directory. MkDocs copies files outside the sidebar too. Check
the built HTML, search index and static files for private meeting notes,
approval evidence, restricted contracts and embedded diagram data. [MkDocs configuration](https://www.mkdocs.org/user-guide/configuration/#exclude_docs)
