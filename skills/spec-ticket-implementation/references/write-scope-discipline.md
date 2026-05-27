# Write Scope Discipline

## What Is Write Scope

`write_scope` defines the exact directories where code changes are allowed. It is the single most important constraint in ticket implementation.

## Rules

### 1. Absolute Boundary
Every modified or created file must have a path that falls within at least one `write_scope` entry. This is absolute — no exceptions.

```
write_scope: [packages/adapters/adapter-state-memory/]

ALLOWED:
  ✅ packages/adapters/adapter-state-memory/src/index.ts
  ✅ packages/adapters/adapter-state-memory/src/store.ts
  ✅ packages/adapters/adapter-state-memory/tests/store_test.ts
  ✅ packages/adapters/adapter-state-memory/package.json

FORBIDDEN:
  ❌ packages/core/src/index.ts          (outside scope)
  ❌ packages/shared/src/contracts.ts     (outside scope)
  ❌ packages/adapters/adapter-postgres/  (different package)
  ❌ package.json                         (root config)
```

### 2. Read-Only for Everything Else
Files outside scope may be READ for context and patterns. They MUST NOT be modified for any reason whatsoever.

### 3. If Scope Is Insufficient
If implementation genuinely requires modifying a file outside scope:
- STOP immediately
- Document: "Requires <file> outside write_scope <scope>."
- Mark ticket as `blocked`
- This is a spec gap. Do not expand scope yourself.

### 4. New Package Creation
When creating a new package:
- Create only within the specified scope directory
- Follow the project's naming convention
- Include minimum required files (configuration, source, tests)
- Do not modify existing package configs

### 5. Configuration and Root Files
Root-level configuration is almost never in a feature ticket's scope. If needed: stop and report as a gap.

### 6. Shared Contract Files
Shared contracts are almost never in feature ticket scopes. If implementation "needs" a new schema: document as gap. Schema changes need their own foundation ticket.

## Verification

After implementation, confirm scope:
- Every created or modified file path must start with a write_scope entry
- If any single file violates this: revert changes, document blocker

## Anti-Patterns

| Anti-Pattern | Why Bad |
|--------------|---------|
| "Fixed a bug in another module" | Outside scope. Separate ticket needed. |
| "Improved error messages globally" | Outside scope. Design discussion needed. |
| "Added a utility to the shared module" | Creates coupling. Separate review needed. |
| "Updated the contract to match my code" | Contract changes = spec change. Block. |
| "Refactored for consistency" | Outside scope. Separate refactor ticket. |
| Expanding scope "because it was needed" | Scope expansion = spec gap. Report. |