# Decision And Reuse Controls

Before target architecture is approved, create concise linked control records:

- `00-policy-profile.yaml`: human-approved policy profiles and the D0/D1
  defaults they authorize. No telemetry, coverage, error-format, architecture,
  supply-chain, or release default exists without a selected profile.
- `00-decision-authority.yaml`: D0 mechanical; D1 private/reversible under a
  cited convention; D2 public/architectural/data/security/compatibility with an
  approved decision; D3 business/compliance/irreversible/human-only.
- `00-applicability.yaml`: every applicable or N/A concern has exact capability
  scope; N/A has a reason and evidence.
- `00-reuse-inventory.yaml`: discovery revision plus stable asset ID, path,
  public export, owner, consumers, stability, and extension policy.
- `00-module-boundaries.yaml`: module owner, public entrypoint, owned concepts,
  allowed/forbidden dependencies, consumers, and architecture check.

New shared assets need an approved create/replace decision. Reuse is correct
only when semantics, authorization, lifecycle, owner, and change cadence match;
otherwise define a boundary representation/mapping or module contract. Do not
create global “shared” packages as a substitute for an explicit ownership model.

An author blocks and routes to readiness when a future implementation ticket
would need to decide, infer, reconcile, or invent a semantic fact. The sole
permitted autonomous choice is a policy-authorized, private, reversible,
mechanical implementation detail.
