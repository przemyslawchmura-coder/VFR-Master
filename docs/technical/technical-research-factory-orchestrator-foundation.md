# Technical Research Factory Orchestrator Foundation

Date: 2026-09-01

Outcome: **ACCEPT-WITH-RISKS**. Orchestration schema version 1 adds deterministic, single-process, non-production state machinery on top of Foundation #1. It performs no discovery, authentication, acquisition, extraction, evidence interpretation or production promotion.

## Contracts and identity

The public factory entry point exposes `ResearchBatch`, `TargetWork`, `SourceWorkItem`, `ResearchAttempt`, `ResearchEvent`, `ResearchSnapshot` and `Checkpoint` validators/construction. These records reference canonical Foundation #1 ResearchTarget and SourceProspect IDs and store the unchanged canonical readiness result; they do not duplicate applicability, evidence or GapPlan semantics.

Every stable ID is a type prefix plus the first 24 hexadecimal characters of SHA-256 over canonical JSON. Batch identity is purpose + policy + maximum attempts per work item + sorted unique ResearchTarget IDs. Target-work identity is batch + target. Source-work identity is target work + prospect + operation. Attempt identity is source work + one-based ordinal. Event identity is batch + contiguous sequence + type + canonical payload. Empty identity components are rejected. IDs use no clock, random source, network or array insertion order for set-like target identity.

## Append-only events and reducer

The immutable event vocabulary is: `batch-created`, `target-added`, `source-work-created`, `attempt-started`, `attempt-completed`, `attempt-failed`, `attempt-blocked`, `attempt-exhausted`, `work-deferred`, `checkpoint-created`, `batch-paused`, `batch-resumed`, and `batch-completed`.

`reduceEvents(events)` is pure. It validates contiguous sequence and recomputes every event ID, rejects mixed batches and duplicate semantic work, then returns a canonically keyed/frozen snapshot with sorted targets, work items, attempts and checkpoint IDs. Ordered event replay produces byte-equivalent canonical JSON and never mutates events or Foundation records.

Batch states are `PLANNED`, `ACTIVE`, `PAUSED`, `COMPLETED`, `BLOCKED`; work states are `PLANNED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `EXHAUSTED`, `DEFERRED`, `COMPLETED`, `REJECTED`; attempts are `IN_PROGRESS`, `COMPLETED`, `FAILED`, `BLOCKED`, or `EXHAUSTED`. Only PLANNED/PAUSED batches resume, only ACTIVE batches start attempts, only READY work starts one active attempt, and COMPLETED batches are terminal. Required unresolved target work prevents batch completion. There is deliberately no reset/reopen transition in this wave.

## Budgets and Foundation safety

Each batch declares a positive maximum attempts per work item; each source item declares an equal or lower positive bound. Starting an attempt consumes its deterministic ordinal. A failed attempt returns to READY only when budget remains; the final failure becomes EXHAUSTED. BLOCKED and EXHAUSTED never become READY through orchestration.

Source-work construction runs Foundation #1 `evaluateReadiness`. Only `passed: true` initializes READY. Mismatch initializes REJECTED, exhausted/low-yield initializes EXHAUSTED, and all other failed readiness states—including UNKNOWN/PARTIAL applicability, blocked/broken/mirror-only access and unresolved identity—initialize BLOCKED. The orchestrator cannot change ABS, transmission, market, year or equipment applicability.

## Checkpoint and resume

A Checkpoint records orchestration and Foundation versions, batch ID, event count, SHA-256 of the canonical event prefix, SHA-256 of its snapshot and the frozen snapshot itself. Resume requires the complete matching prefix, replays it, compares both snapshot digest and canonical bytes, then reduces the full history. Missing/tampered history, version mismatch, snapshot mismatch or batch mismatch fails closed. Because work IDs and event histories are validated, replay cannot duplicate targets, source work or completed attempts.

## Existing fixture integration

Existing local adapters feed four real states through the orchestration API without mutation: Honda CBR500R and Yamaha MT-09 owner sources remain EXHAUSTED; Harley `94001064` remains REJECTED due mismatch; Ténéré `BW3-F8197-E0` remains BLOCKED and `REGISTERED-NOT-REAUTHENTICATED`. No source was contacted. The legacy `scopeMatches` omitted-dimension divergence remains unchanged behind Foundation adapters.

## Audit, risks and deferred work

Independent falsification found no clock/random dependency, ID instability, budget bypass, blocked-readiness promotion, input mutation, replay drift, checkpoint compatibility bypass or production import. Tests tamper with events/checkpoints, duplicate work, start impossible attempts, exhaust retries, distinguish ABS false/unknown, manual/DCT, EU/US, year and standard/SP, and replay real fixtures.

Risks remain: the append-only log is an in-memory/caller-owned contract rather than durable storage; planner/scheduler policy and typed external-result ingestion do not exist; historical records remain behind adapters. These bounded omissions produce **ACCEPT-WITH-RISKS** rather than ACCEPT. Distributed workers, concurrency, external research, the Ténéré pilot, evidence ingestion and production promotion are deferred.

The code is quarantined under `research/factory/`. Production runtime, Technical Profiles, source registry, catalogue, Supabase, release metadata, VFR800 and Service Core coverage are unchanged.

## Exact NEXT

Implement the bounded **Technical Research Factory Execution Planner**: translate canonical GapPlans and SourceProspects into deterministic ResearchBatch, TargetWork and SourceWorkItem plans under explicit source-class, readiness and attempt budgets, using only synthetic and existing local fixtures and performing no external research, authentication, acquisition, extraction, production change or historical migration.
