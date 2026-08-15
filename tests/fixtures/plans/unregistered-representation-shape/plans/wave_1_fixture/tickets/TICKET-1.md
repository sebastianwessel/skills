---
id: TICKET-1
wave: 1
status: ready
parallel_group: ""
depends_on: []
blocked_by: []
slice_type: vertical_slice
phase_gate_exception: false
spec_refs:
  - specs/00-vision.md
write_scope:
  - src/identity
read_scope:
  - specs/00-vision.md
representation_reuse:
  status: ready
  catalog_ref: specs/03-contracts/representation-catalog.yaml
  shape_refs:
    - identity.unknown
  mapping_refs: []
  new_shape_decision: existing
---

# Deliberately malformed ticket
