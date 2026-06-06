# Service Topology Checklist

- Define topology: monolith, modular monolith, microservices, serverless,
  event-driven, BFF/gateway, package/library, CLI, SDK, worker, or hybrid.
- Specify boundaries, ownership, deployables, package direction, internal/public
  APIs, network paths, reusable modules, generated packages, and forbidden
  cross-boundary access.
- Cover consistency, sagas/compensation, idempotency, ordering, data
  duplication, cache ownership, tenancy isolation, routing, rollout units, and
  local/test topology.
