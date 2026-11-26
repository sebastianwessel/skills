# Slice records and commands

A living spec starts with `specs/index.md`. Add `specs/acceptance.yaml` when
the first behavior has verifiable outcomes. Define behavior on the cited page
and use stable IDs to name the proof.

```yaml
scenarios:
  - id: EXPORT-DENIED
    source: flows/export.md#access-denied
    verify: ["Assert HTTP 403, no queued job and a redacted audit event."]
```

Use spec-root-relative paths and unique ATX headings or explicit HTML anchors
such as `<a id="access-denied"></a>` directly above a heading. Use inline
Markdown links and simple YAML mappings, sequences and scalars.

## Bind one outcome

Create `reviews/readiness/export-access.yaml` beside the project spec tree.
Start with the scenario list and any explicit dependencies. Add the remaining
fields only after obtaining the review and approval.

```yaml
scenarios: [EXPORT-DENIED]
sources: ["architecture/identity.md#team-identity", contracts/export.schema.json]
digest: sha256:<current-slice-digest>
approved_by: product-lead
approval_ref: https://example.org/project/pull/27#issuecomment-42
reviewed_by: independent-reviewer
review_ref: reviews/export-access.md
```

The digest includes the selected acceptance rows and their source sections,
plus `sources` when present. From those Markdown sections the checker follows
relative links to exact headings, decisions, open question records and
non-Markdown artifacts, recursively. ADR backlinks describe affected areas
and leave those areas outside the scope. Add dependencies introduced by an
ADR explicitly. Ordinary whole-page Markdown links serve navigation. Put a governing whole page or an indirect contract in
`sources` if the behavior needs it. Whole-file refs bind the whole file.
Use the printed source list to catch missed indirect dependencies, such as
external policies or schema imports. For external authority, cite the stable
version in a bound section, verify it in review and record the evidence.

An open question record or an unaccepted ADR linked in scope blocks the
slice. A reviewer also checks inline questions, implied dependencies and
whether the selected scenarios form a coherent outcome. Decide what can be
delivered independently before approval.

```sh
node <readiness>/scripts/check_specs.mjs <spec-root>
node <readiness>/scripts/check_specs.mjs <spec-root> --digest export-access
node <readiness>/scripts/check_specs.mjs <spec-root> --approved export-access
```

The first command is a tree-wide structure check for authors and CI. Run
project-native validators for contract and schema semantics. The scoped
commands inspect the selected inputs. The review and human decision must
explicitly cover the printed digest. Reference a durable HTTPS review URL
or a repository-relative evidence file outside `specs/`. The checker verifies
local file existence. The reviewer verifies the actual evidence and
independence. Review a changed digest before renewing the record. Git carries
prior approval and review history. Use a stable anchor for each independently
changing outcome. The digest treats CRLF and LF alike for Markdown and ticket
text and common UTF-8 contract and diagram formats. Other assets bind their
bytes.
