# Contracts And Generation Checklist

- Machine-readable source contracts for APIs, events, schemas, commands,
  configs, storage shapes, SDKs, CLIs, and public surfaces.
- Generators for types, classes, interfaces, clients, validators, stubs,
  fixtures, docs, and generated tests whenever available.
- Generator commands, outputs, package locations, compile/type checks, drift
  checks, manual-code boundaries, and generated-file ownership.
- Nullability, optionality, enum values, precision, time, IDs, pagination, error
  taxonomy, versioning, and compatibility semantics.
- Strict closed-boundary typing; weak/open JSON leaves only when explicit.
- Compatibility, migration, and stale boundary behavior for clean rebuilds.
- A representation catalog for in-scope domain, boundary, persistence, command,
  query, and projection shapes: stable IDs, canonical source, owner, stability,
  allowed consumers, and source-contract refs.
- Explicit mapping records for every intentionally distinct representation,
  including direction, allowed field differences, loss/redaction policy, and
  verification. A syntactically similar shape is reused unless a distinct
  semantic boundary is recorded and approved.
