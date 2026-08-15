# Representation Catalog

## Contents

- Purpose
- Required Artifact
- Reuse Decision
- Ticket And Review Evidence
- N/A Evidence

Use this reference when specs create or change domain data, API/event payloads,
commands, queries, persistence records, or client projections.

## Purpose

The catalog prevents semantic duplicates while allowing deliberate boundary
representations. It is not a global DTO package. One semantic concept has one
canonical source; each representation outside that source has a documented,
verified mapping.

## Required Artifact

Create `03-contracts/representation-catalog.yaml` with this minimum shape:

```yaml
catalog_version: 1
applicability:
  status: applicable
  scope_refs: [CAP-IDENTITY-001]
shapes:
  - shape_id: identity.user
    representation_class: domain
    canonical_source: 03-contracts/schemas/user.schema.json#User
    owner: identity-domain
    stability: versioned
    open_policy: closed
    allowed_consumers: [identity-service, user-api]
    source_contract_refs: [CONTRACT-USER-001]
    mapping_refs: [MAP-USER-API-READ]
  - shape_id: identity.user-api-read
    representation_class: boundary
    canonical_source: 03-contracts/openapi.yaml#UserRead
    owner: identity-api
    stability: versioned
    open_policy: closed
    allowed_consumers: [user-api]
    source_contract_refs: [CONTRACT-USER-READ-001]
    mapping_refs: [MAP-USER-API-READ]
mappings:
  - mapping_id: MAP-USER-API-READ
    from_shape: identity.user
    to_shape: identity.user-api-read
    direction: domain_to_boundary
    allowed_differences: [omit_internal_status]
    redaction_or_loss_policy: internal_status is never exposed
    field_operations: [internal_status:omit]
    verification: [tests/contracts/user-api-read.contract.test.ts]
```

Use stable, domain-qualified `shape_id` values. `representation_class` is one
of `domain`, `boundary`, `persistence`, `command`, `query`, or `projection`.
Use a closed policy unless the source contract deliberately defines an open leaf.
`stability` is `experimental`, `internal`, `versioned`, `stable`, or
`deprecated`; `open_policy` is `closed` or `open_json_leaf`.

The checker parses this YAML, validates exact identifiers, validates every
source-contract ID against `_registry.yaml`, checks canonical-source paths,
and requires every mapping to be listed by both endpoint shapes. A shape may
have an empty `mapping_refs` list when it is the only allowed representation;
the catalog must not invent a mapping merely to satisfy a checker.

## Reuse Decision

1. Find an existing catalog entry before defining a shape.
2. Reuse it when fields, semantics, lifecycle, authorization, and consumers
   match.
3. Define a distinct representation only for a real boundary, storage, command,
   query, or projection concern. Link it to the canonical shape through a
   mapping; never use a second name merely for local convenience.
4. Record the exact differences, including omissions, defaults, redaction,
   precision, nullability, IDs, and time semantics. `field_operations` is a
   non-empty list of deterministic field operations such as
   `internal_status:omit`, `created_at:rename:createdAt`, or
   `timestamp:convert:rfc3339`; link custom conversion semantics to a contract
   or decision rather than describing them vaguely.
5. Map each direction explicitly. A reverse map is separate because it may lose
   data or require authorization.

## Ticket And Review Evidence

Tickets name the catalog file, `shape_id` entries, mapping IDs, generated or
shared artifacts to reuse, and any approved new-shape decision. Implementers
stop before creating an exported model, DTO, schema, event, entity, or mapper
that lacks this evidence. Reviewers compare every new representation and
transformation in the diff to those refs.

## N/A Evidence

`not_applicable` is valid only when the scoped capability has no domain data,
interface payload, durable record, command/query, event, or client projection.
Record it in the catalog—not a nearby prose paragraph—with an exact scope:

```yaml
applicability:
  status: not_applicable
  scope_refs: [CAP-HEALTH-001]
  rationale: Health endpoint returns only a fixed status and introduces no domain shape.
shapes: []
mappings: []
```
