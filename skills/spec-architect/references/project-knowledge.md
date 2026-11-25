# Project Knowledge Profile

## Contents

- Adoption and layout
- Keep changes local
- Minimum concept content
- Decision records
- Gaps, edge cases and recovery
- Optional meetings

## Adoption and layout

Use the layout below for all spec sets. Keep a primary owner for each rule
and reserve file or ID changes for cases where the scope actually changes.

```text
specs/
  index.md                         Project entry point
  00-vision.md                     Business outcomes, scope, users, measures
  00-architecture-overview.md      Solution context, boundaries, major choices
  01-domains/<domain>/             Policies, vocabulary and business ownership
  02-capabilities/                 Existing capability inventory and definitions
  components/<component>/          Service, module, package or integration
  03-flows/<flow>/                 End-to-end business or technical process
  03-contracts/                    Existing machine-readable boundaries
  decisions/index.md               Direct links to every ADR
  gaps/index.md                    Direct links to every gap and its disposition
  visuals/                         Editable sources and reviewed exports
project-notes/meetings/            Optional internal evidence outside specs
```

Keep the existing control files, traceability, coverage matrix, and readiness
contract. Use a single page for a small scope. Use a topic directory when it
helps colocate decisions or gap records. Any directory index is navigation.
Name the owning concept explicitly, for example `components/identity/identity.md`.
Label observations about existing behavior with the inspected revision.
Make the approved target and any transition states explicit.

Put `x-project-knowledge-version: 1` in the YAML frontmatter of
`specs/index.md`. Use `okf_version: "0.3"` for the OKF-compatible conventions.
Link directly to vision, architecture, capability inventory, E2E coverage,
`decisions/index.md`, and `gaps/index.md`. Give people and agents a direct
route to each domain, component, and flow from the root or one section index
linked there. Use familiar names and stable IDs in link labels. Add orientation
text where a label alone would be unclear. Keep detailed descriptions on the
owner. Add the start path and rules for normative sources to project agent guidance. Keep an empty decisions or gaps index explicit.

Use inline Markdown links with explicit relative filenames for first-party
knowledge references. Keep their targets inside `specs/`. Cite external
evidence with durable URLs. The profile checker validates file targets.
Use a strict site build to validate heading anchors. Link directly to
the rules, boundaries, contracts, decisions, and gaps needed to act on the
owning page. Avoid forwarding chains and links that only restate proximity.
Keep shared definitions at their owner and cite precise IDs or headings. Check
retrieval by starting at the entry point with a business question, an interface
question, a failure scenario, and a decision ID.

## Keep changes local

Group concepts by stable business area, boundary, or process. Keep closely
coupled details together on the owning page. Split concepts when ownership,
change cadence, or the need for independent retrieval warrants it. Use a
stable heading or ID for a local scenario before making it a separate page.

Start a change with the canonical owner and the IDs it changes. Inspect
referencing pages, traceability, ADRs, gaps, and visuals for actual impact.
Edit the owner and only the dependents whose claims, links, or coverage change.
An editorial correction should leave stable inbound links and indexes usable.
An outcome, contract, or recovery change also updates the evidence and views
that depend on that behavior. Explain affected scope in the PR.

Keep indexes limited to stable labels, paths, and orientation text. Store
state, ownership, and detailed descriptions on the concept itself. Derive
status dashboards, search indexes, backlink graphs, or expanded views at
build time outside the approved tree. In review, distinguish semantic edits
from generated manifest updates. The current digest still requires fresh
readiness approval for any canonical byte change.

## Minimum concept content

Give each domain, component, flow, ADR, and gap simple YAML frontmatter.
Use a short `type` (`Business Domain`, `Component`, `Flow`, `ADR`, or `Gap`),
`title`, one-sentence `description`, a stable uppercase `x-project-id`,
and a named `x-project-owner`. Keep IDs across moves and renames. Use
`index.md` for navigation and reserve `log.md` for history. Use approved
source evidence for facts. If using OKF lifecycle or verification metadata,
use their OKF meanings and keep project disposition in `x-project-state`.
Preserve frontmatter keys you do not own.
Use simple scalars, lists and maps that the dependency-free readiness parser
supports. For OKF export, add `type` metadata to overview or inventory pages
you want the consumer to ingest.
The profile applies selected OKF v0.3 conventions. For an exchange that
requires formal OKF conformance, verify the exported bundle independently.

| Page | Owns | Links directly to |
| --- | --- | --- |
| Vision and domain | Outcomes, measures, actors, terms, business rules, constraints and exclusions | Capabilities, policies' primary evidence, applicable ADRs and gaps |
| Solution design | System context, boundaries, integrations, shared constraints, architectural dependencies and deployment model | Domains, components, critical flows and shared constraints |
| Component | Scope, owner, public entrypoints/contracts, data ownership, allowed dependencies, failure boundary, operations | Module boundary and contract authority, consuming flows, decisions and gaps |
| Flow | Trigger, actors, guards, ordered steps and state transitions, side effects, failure and recovery outcomes, acceptance | Business rules, participating boundaries/contracts, traceability, decisions and gaps |

Maintain the capability and E2E inventories. Flow grouping may follow
domain, trigger family, or shared behavior. Keep individually identifiable
variants with explicit guards and outcomes. Split flows when policy, ordering,
ownership, final state, or recovery differs enough to hide a meaningful branch.
A cross-component flow owns orchestration, while each component owns its own
contract and invariants.

## Decision records

Place the ADR beside its primary affected topic (a `decisions/` subfolder works
well). Use `specs/decisions/` for project-wide decisions. Record each decision
once. Link to it from the decisions index and its primary owning page. Use
`x-project-scope` as a list of exact `specs/`-relative Markdown paths, putting
the primary owner first. Link from the ADR to each affected definition.
Other pages link to the ADR when they depend on that decision directly.
Use its ID and stable title in the index.

- Set `x-project-domain` to `business`, `technical`, or `mixed`. This
  classifies subject matter. Keep D0–D3 and the decision authority in
  `00-decision-authority.yaml`. For a mixed decision, obtain approval for
  both responsibilities from authorized owners.
- Set `x-project-state` to `proposed`, `accepted`, `rejected`, or
  `superseded`. Record the context and drivers, options, chosen decision or
  rejection rationale, consequences, and affected requirements or contracts.
- For an accepted ADR, set `x-project-evidence` to a durable, immutable
  approval reference. Record approver, date, exact scope, and approval in the
  evidence. Use the same ID as the authority entry whose `source_refs`
  contains the exact ADR path relative to `specs/`.
- Apply the accepted decision to the owning business, flow, or technical rule
  and its traceability in the same change. The ADR carries the rationale and
  decision history. An active conflict with the governing rule blocks
  readiness. To replace a decision, mark the old ADR superseded, set
  `x-project-replacement` to the new ADR path relative to `specs/`, link
  the records both ways, and update the affected source and authority entry.
  Follow the replacement chain to the active accepted record. Use accepted
  ADRs as current authority sources and keep superseded and rejected records
  as history.
- Keep exploratory proposals outside the approval set when they have no impact
  on approved scope. A proposed ADR in the approval set blocks readiness.
  Cite approved records using direct links. Treat meeting notes and OKF
  verification metadata as provenance. Keep approval authority in the
  existing readiness and decision records.

## Gaps, edge cases and recovery

Keep a single overview at `gaps/index.md`. Record each identified open
question, ambiguity, contradiction, or missing edge/error path as a `Gap`.
Give its evidence, impact, accountable owner, next action, and exact affected
scope. Use the same scope and primary backlink convention as ADRs. Link from
the overview by ID and stable title. Remove inline uncertainty markers by
linking to the gap and explaining what scope it blocks.

Set `x-project-state` to `open`, `resolved`, or `deferred`. Keep a
resolution with a direct link to the revised definition, acceptance evidence,
or applicable approved decision. Set `x-project-evidence` for resolved or
deferred gaps. Deferral requires authorized evidence for the exact excluded
scope and a revisit trigger. Verify that accepted scope has no dependency on
the deferral. Every open gap in the approval tree blocks readiness.

Review each flow from trigger through terminal user and operational states.
Walk invalid input, permission denial, timeouts, dependency outages,
duplicate/replayed input, concurrent or out-of-order events, partial work,
cancellation, and retry exhaustion where applicable. Capture expected
responses, state/data effects, idempotency and retry limits, observability,
compensation, automated recovery and verification, escalation/manual recovery,
and the final state. Give safety boundaries and a stop/escalation condition for
self-healing. Link acceptance for each relevant branch and record scoped N/A
in the existing applicability registry. A documented gap keeps an unknown
visible until an authorized source resolves it.

## Optional meetings

When useful, keep notices, agendas, and notes in the project's restricted
workspace outside the approval and publication roots. A notice can give the
purpose, date/time/time zone, participants by role, agenda, linked prereads,
and decisions requested. Notes can add outcomes, actions and owners,
unresolved questions, and candidate decision links. Capture only necessary
evidence. Move durable outcomes into scoped ADRs, gaps, and the owning rule
after confirming authority. Use a sanitized reference or permissioned
immutable URL for private evidence. Meeting records are optional and supply no
approval by themselves.
