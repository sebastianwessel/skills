# Auth And Permissions Checklist

- Login path, signup, logout, session refresh/expiration, password reset,
  recovery, invites, SSO/OIDC/SAML/OAuth callbacks, MFA, and auth error states.
- Identity providers, tenant/domain mapping, account linking, duplicate identity,
  disabled users, revoked/expired credentials, and safe redirect behavior.
- Roles, permissions, policies, ownership, tenant/workspace/project isolation,
  admin overrides, impersonation, and permission cache invalidation.
- Enforcement points across API, service, data, frontend, background jobs, and
  integration boundaries.
- Negative paths for cross-tenant access, known-ID lookup, writes/deletes,
  revoked roles, expired sessions, and missing permissions.
- Audit events, denial messages, telemetry, and redaction for auth events.
