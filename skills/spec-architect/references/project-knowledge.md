# Organizing project knowledge

## Start with one page

Use `specs/index.md` as the front door. For a small feature, it can own the business goal, behavior and scenarios. Add a page when a subject has its own reader, owner or change cadence. Link it from the index or a section index. Keep a rule at one location. Other pages can link to its heading. Name the project entry point in the target repository’s agent guidance when onboarding the workflow.

| Subject | Questions the owner answers |
| --- | --- |
| Business or domain | Who needs the outcome? What rule, limit, measure or exclusion applies? Which source and owner authorize it? |
| Solution and components | Where is the system boundary? Which component owns the contract, data and operational responsibility? What can other modules depend on? |
| Flow and acceptance | How does each actor reach the behavior? What preconditions, state transitions, side effects, responses, failure handling and final states can they observe? |
| Contracts and representations | Which schema or public export owns the shape? Which consumers reuse it? Where two shapes genuinely differ, define conversion, null/defaults, allowed loss/redaction, and proof. Record project-native generation, type checks and drift commands when applicable. |

Use stable, clear headings and relative inline Markdown links with explicit filenames. Create new indexes only when they improve discovery. Keep protected meeting records outside the canonical and publication trees. An agenda can include purpose, requested decisions, roles and pre-reads. Notes can capture actions and owners. Promote confirmed outcomes to their governing sources and cite permissioned evidence.

## Record acceptance once

Place the normative scenario on its owning page. For example, an export flow can have a heading `## Access denied` and this rule: “When a reader requests another team’s export, return 403, leave the job queue unchanged, and log the denial without recording the export payload.” Cite the approved access policy on that page.

Give each observable scenario a stable ID and a proof in `specs/acceptance.yaml`. The source is a spec-root-relative Markdown filename and an exact heading fragment. Prefer simple, unique headings such as `## Access denied` (`#access-denied`). An explicit HTML anchor such as `<a id="access-denied"></a>` also works. Keep the ID when the page moves. List a project-native command, test reference, or precise inspection that will distinguish a pass from a failure. Verification may describe planned tests.

```yaml
scenarios:
  - id: EXPORT-DENIED
    source: flows/export.md#access-denied
    verify:
      - "Exercise the cross-team export request and inspect the response, queue and redacted audit event."
```

Include success, material error and recovery outcomes. Scenarios can share a source heading when distinct branches and their final outcomes are clear there. Tickets and review evidence cite the scenario IDs. The source owns the behavior and the row owns its verification.

## Record decisions and open questions

Keep routine choices on the owning page. For a material choice, put an ADR beside the subject in a `decisions/` directory or in `specs/decisions/` for project-wide choices. Give the file a stable name. Its frontmatter records `owner` and `status` (`proposed`, `accepted`, `rejected`, or `superseded`). An accepted decision adds `evidence` pointing to the attributable, dated approval of its exact scope. For a superseded decision use `replacement` with the spec-root-relative path to its successor. Its body explains the options, decision, consequences and affected rule. Link the rule to the ADR. Obtain both business and technical authority where ownership crosses teams.

Record a blocking question, contradiction or unknown failure path in a similarly scoped `gaps/` record with `owner` and `status: open`. Describe its impact, evidence, affected rule and next action. Resolving it updates the rule and adds `status: resolved` and `evidence`. Deferral requires `status: deferred`, evidence of an authorized exclusion, and a `revisit` trigger. Verify approved scenarios can operate independently. A proposed decision or open gap in the approval bundle blocks approval. Keep future exploration outside the bundle.

Keep controls near the behavior they govern. Cite existing repository policies for private, reversible implementation choices. Escalate changes to public behavior, contractual rights, trust boundaries, irreversible data effects or business policy to their responsible authority.
