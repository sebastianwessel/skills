# End-To-End Definition Checklist

- Inventory every capability: user-facing, admin/support, API/CLI/SDK,
  integration/webhook, worker/job, data lifecycle, operational, or N/A.
- For each capability, define actor/consumer, trigger, entrypoint, reachability
  path, preconditions, contracts, data touched, state transitions, side effects,
  permissions, errors, recovery, observability, owner, final state, acceptance,
  and verification.
- For frontend/client scope, define screen/surface, navigation/deep link,
  loading/empty/success/error/denied/stale/offline/recovery states, responsive
  access, and support/admin visibility or N/A.
- For data scope, define source, collection reason, classification, PII,
  retention, deletion/anonymization, export/access, masking/redaction,
  residency, lineage, sync/import/export, and no-data-loss behavior.
- For async/ops scope, define trigger, queue/job/event, retries, idempotency,
  timeout/cancellation, manual intervention, audit/log/metric/trace, runbook,
  rollback/compensation, and terminal state.
