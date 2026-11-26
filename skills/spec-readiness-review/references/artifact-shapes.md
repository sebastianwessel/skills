# Records and commands

## What goes in the bundle

The smallest source set has `specs/index.md` and `specs/acceptance.yaml`. The index can own all behavior. Grow topic pages, contracts, scoped `decisions/` or `gaps/` records, and editable diagrams with exports as the project requires them. Link canonical Markdown pages through ordinary inline relative file links from the index or another reachable page. A relative link should resolve inside the bundle. Give diagrams useful alt text and link their editable sources. A diagram export under `visuals/` needs a same-stem `.drawio` file. Keep raw meetings, generated sites and review evidence outside the bundle.

```yaml
scenarios:
  - id: EXPORT-DENIED
    source: flows/export.md#access-denied
    verify: ["Assert HTTP 403, no queued job and a redacted audit event for a cross-team request."]
```

A scenario ID is unique and begins with a letter. The source fragment must resolve to a unique Markdown heading or explicit HTML anchor. Use short headings such as `## Access denied` or an explicit `<a id="access-denied"></a>` for a stable target across renderers. Contract semantics, scope and expected results belong to the linked source. The verifier inspects the meaning and adequacy of each proof.

## Draft, review and approval

Run these commands using the installed readiness skill root. The draft check validates the source graph and acceptance rows even before a report exists. An existing report must use one of `draft`, `blocked`, `needs_human_review`, or `approved`. An approved report gets the full checks in either mode.

```text
node <skill-root>/scripts/check_specs.mjs <spec-root>
node <skill-root>/scripts/generate_spec_manifest.mjs <spec-root> <source-revision>
node <skill-root>/scripts/check_specs.mjs <spec-root> --approved
```

The manifest records the inspected source revision, sorted paths and byte digests of every regular file. Its content digest binds the whole tree, excluding `spec-manifest.yaml` itself and `.readiness-report.yaml`. Use a revision identifying the inspected source, such as a commit ID. Regenerate after changes. A draft can proceed to independent review once the source checks pass.

Keep review evidence outside the hashed source set. Evidence references can be durable review URLs or repository-relative paths to evidence files. For local proof, use a path relative to the directory containing the spec root, for example `reviews/spec.md`. The checker verifies local file presence. The reviewer opens the evidence and confirms authorship, independence, authorized scope, and explicit assent to the exact digest. Record the digest in each proof for attribution. A whole-bundle decision covers every row in acceptance.yaml.

```yaml
status: approved
approval_evidence:
  scope: whole_bundle
  approver_id: product-owner
  approved_at: "2026-08-15T12:05:00Z"
  approval_ref: reviews/human-decision.md
  manifest_digest: sha256:<digest>
semantic_judge_evidence:
  status: passed
  judge: architecture-reviewer
  reviewed_at: "2026-08-15T12:04:00Z"
  evidence_ref: reviews/spec-review.md
  manifest_digest: sha256:<same-digest>
```

A passing command verifies structure and freshness. For semantic approval, the reviewer must also establish that the specifications cover the intended behavior and the evidence warrants approval. A subset approval requires a separately scoped candidate before planning.

The included reader handles ordinary indented YAML mappings and sequences, quoted or plain scalars and inline lists. Use spaces for indentation and quote strings containing punctuation that YAML treats specially. For platform-specific contracts such as OpenAPI, use the platform parser and validator.
