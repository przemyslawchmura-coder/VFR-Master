# Technical Research Factory — Execution Agent / Source Acquisition Adapter Foundation

Status: `ACCEPT-WITH-RISKS`; schema version 1; NON-PRODUCTION.

This wave defines the single-process boundary from an existing canonical Planner `SourceWorkItem` to one bounded synthetic/local acquisition attempt. It does not perform network access, browser work, authentication, evidence extraction, GapPlan mutation, production promotion, or motorcycle research.

## Contracts and boundary

`AcquisitionRequest` references the canonical batch, target-work, source-work, attempt, prospect, operation, and adapter identities. `AcquisitionOutcome` is closed over `ACQUIRED`, `NO-EVIDENCE`, `ACCESS-BLOCKED`, `AUTH-REQUIRED`, `NOT-FOUND`, `SOURCE-MISMATCH`, `APPLICABILITY-UNKNOWN`, `APPLICABILITY-PARTIAL`, `TRANSIENT-FAILURE`, and `PERMANENT-FAILURE`, each with `RETRYABLE`, `NON-RETRYABLE`, or `BLOCKED` classification. `ExecutionResult` binds a validated outcome to canonical work identity.

Adapters declare ID/version, supported operations/source classes, authentication and network requirements, and return only validated outcomes. Synthetic adapters exercise every outcome without network, credentials, browser, or external files.

Artifacts contain deterministic metadata (artifact ID, prospect/attempt identity, media type, optional length/digest, origin, method, safe locator, metadata). Observations describe acquisition conditions, never technical values. `ACQUIRED` means an artifact is available for later review; `NO-EVIDENCE` is not automatically Foundation researched-no-evidence.

## Execution and safety

The agent validates canonical identity, batch state, readiness, adapter capability, authentication/network availability, attempt budget, and duplicate state before emitting `attempt-started`. It maps outcomes to existing Orchestrator `attempt-completed`, `attempt-failed`, `attempt-blocked`, or `attempt-exhausted` events. Retry is finite: transient failures may consume remaining attempts; blocked/non-retryable outcomes do not loop; exhaustion is terminal.

Checkpoint creation and resume use the existing digest-verified Orchestrator checkpoint contract. Replaying a completed attempt does not create another attempt, artifact, or event. Adapter output is untrusted: canonical IDs, state, budgets, readiness, secrets, non-JSON values, and unsupported fields are rejected.

All outputs are immutable and canonical JSON. No execution path mutates Planner, Foundation, GapPlan, evidence, Service Core, or production records. Existing Honda, Yamaha, Harley-Davidson, and Ténéré fixtures remain gated by their prior deferred/rejected/blocked readiness; only a synthetic local ready fixture exercises successful acquisition.

## Audit and deferred work

Independent result: `ACCEPT-WITH-RISKS`. Future work must separately review production adapter security, provenance of artifacts, extraction/review queues, and durable storage. The exact next bounded task is **Technical Research Factory — Extraction / Review Queue Foundation**: consume acquired artifacts/observations into typed candidate evidence for human review without automatic production or researched-no-evidence promotion.
