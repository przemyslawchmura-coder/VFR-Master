# Architectural decisions

## ADR-001 — Stable catalogue identity is the join key

Date: 2026-08-30 (recovered from history)
Decision: catalogue variant keys and explicit year ranges identify motorcycles; textual names are not heuristic identity.
Rationale: migration, resolver, profile and search tests enforce explicit identity.
Consequences: aliases and legacy records require deterministic mapping; unknown context remains unresolved.
Status: ACTIVE. Related commits: catalogue waves and migration work in `origin/main..HEAD`.

## ADR-002 — Missing data stays unknown

Decision: missing technical/research values remain null or explicit not-researched; they are never guessed, zero-filled, or copied from similar models.
Rationale: research validators and applicability tests enforce this.
Consequences: partial coverage is valid and review queues remain honest.
Status: ACTIVE. Related commits: `60692a7`, `a69191f`, `fe2df11`.

## ADR-003 — Production and research are isolated

Decision: `research/` datasets are non-production and require deliberate promotion.
Rationale: runtime-boundary tests prove production does not import research.
Consequences: research can remain incomplete without changing user behavior.
Status: ACTIVE. Related commits: `1db7d6d`, `fe2df11`.

## ADR-004 — Technical Profiles resolve through registry and context

Decision: profile discovery, loading, applicability, clarification and search are resolver/registry responsibilities.
Rationale: VFR runtime and browser tests exercise this path.
Consequences: profiles must declare catalogue/year/context applicability.
Status: ACTIVE.

## ADR-005 — ABS and other applicability dimensions are tri-state

Decision: true, false and null remain distinct; unknown is not common applicability.
Rationale: resolver and clarification tests explicitly preserve false and unknown.
Consequences: ambiguous context is surfaced instead of guessed.
Status: ACTIVE.

## ADR-006 — Evidence requires source proof, not metadata

Decision: only verified proof statuses count; metadata-only, partial-content, uncertain identity and fingerprint-only material do not.
Rationale: VFR audits and evidence tests enforce page/source/applicability provenance.
Consequences: source recovery may leave fields blocked.
Status: ACTIVE. Related commits: `a60cf26`, `edac48a`, `7f8d406`.

## ADR-007 — Service Core is one shared subset

Decision: all research targets use the canonical 44-field Service Core.
Rationale: Honda reporting and batch tests enforce one deterministic list.
Consequences: partial coverage is comparable across manufacturers.
Status: ACTIVE. Related commits: `1db7d6d`, `a69191f`.

## ADR-008 — Batch research reuses documents and preserves applicability

Decision: source identity is independent of hosting URL; one document may support multiple explicitly covered targets, while extraction candidates remain separate from evidence.
Rationale: generic pipeline tests prove mirror deduplication, reuse, normalization, conflicts and review queues.
Consequences: batch work prioritizes high-leverage sources without inflating corroboration.
Status: ACTIVE. Related commit: `fe2df11`.

## ADR-010 — Practical-service yield gates research scaling

Date: 2026-08-30
Decision: the next research pilot is bounded to five existing targets and must produce at least 10 practical Service Core fields and 15 verified target slots; generic specification rows alone cannot qualify.
Rationale: Honda Batch Wave 2 achieved six verified rows across 528 slots with zero practical-service gain.
Consequences: owner/service sources take priority, and multi-manufacturer scaling waits for measured practical yield.
Status: ACTIVE. Related audit and design task.

## ADR-009 — Independent Audit Gate precedes roadmap advancement

Date: 2026-08-30
Decision: meaningful work must be independently audited for falsification before memory is updated or the roadmap advances.
Rationale: the Honda batch audit showed that passing tests and a 100% row-yield metric can coexist with zero practical-service gain.
Consequences: expectation changes require semantic justification; batch reports distinguish row yield from target-slot and practical-field gain.
Status: ACTIVE. Related commit: `45f43ae` and this audit.

## ADR-011 — Known practical source yield gates acquisition selection

Date: 2026-08-31
Decision: acquisition batches rank practical Service Core yield per authenticated Tier A/B document, not raw gap or evidence-row volume. A candidate whose exact-target Tier A/B prospect or document richness is repository-unknown remains unranked and cannot enter a bounded acquisition batch merely for manufacturer diversity.
Rationale: the five-target pilot produced 48 practical slots from two rich owner manuals while three equally deliberate low-coverage targets yielded zero because of exhausted research or unresolved identity/applicability.
Consequences: scoring must expose unknowns, penalize duplicate history and applicability risk, and narrowly scope document editions. Manufacturer transfer is tested incrementally; Tier C/D discovery cannot satisfy practical success.
Status: ACTIVE. Related design: post-pilot scaling reassessment.

## ADR-012 — Execution readiness precedes source-yield ranking

Date: 2026-09-01
Decision: a registered Tier A/B prospect enters acquisition ranking only after exact source identity, official delivery path, model/year/market scope, feasible accessibility and safety-relevant applicability pass a deterministic readiness gate. UNKNOWN, partial, blocked, exhausted and mismatch states cannot be overridden by expected yield.
Rationale: official Harley-Davidson publication `94001064` was genuine and RH1250S-related but reauthenticated as MY2023 rather than the selected MY2022 and returned HTTP 403, producing zero evidence.
Consequences: source authentication metadata tasks may precede acquisition; authenticity, applicability, accessibility and marginal yield remain separate; scoring operates only on execution-ready prospects.
Status: ACTIVE. Related reassessment: source-prospect authentication quality.

## ADR-013 — Technical research uses a deterministic generic core with optional discovery adapters

Date: 2026-09-01
Decision: catalogue research targets, source prospects, applicability, gaps, budgets, state transitions, readiness gates, conflicts, checkpoints and review items belong to one manufacturer-neutral, versioned research-factory core. Manufacturer adapters may supply publication-code parsing, endpoint templates and discovery hints, but may not declare applicability, readiness or evidence. External research agents return typed findings; deterministic repository logic applies gates and transitions. Research-to-production promotion remains an explicit human task.
Rationale: existing validators, Service Core, document deduplication, coverage/yield and reports are reusable, while recent Harley and Yamaha work shows that handcrafted prospect shapes and prompt-level orchestration permit mismatches and repeated authentication loops.
Consequences: Foundation must adapt current data shapes without rewriting evidence; later orchestration can resume from stable IDs and event records; adapters are introduced only from measured manufacturer needs; Ténéré becomes a factory-pilot candidate rather than another handcrafted task.
Status: ACTIVE. Related design: Technical Research Factory architecture.

## ADR-014 — Research orchestration is an append-only deterministic state machine

Date: 2026-09-01
Decision: non-production research batches use semantic SHA-256 identities, immutable JSON events, pure replay-derived snapshots, one active attempt per source item, explicit finite attempt budgets and version/digest-verified checkpoints. Foundation #1 readiness is authoritative; orchestration cannot promote a blocked, partial, unknown, exhausted or mismatched source.
Rationale: stable replay and fail-closed resume are prerequisites for interrupted batches, while clock/UUID identity, mutable snapshots or implicit retries would permit duplicate work and budget bypass.
Consequences: event persistence remains caller-owned in this foundation; planners must emit canonical target/prospect references; reset/reopen, concurrency, distributed workers and external-result ingestion require later bounded decisions.
Status: ACTIVE. Related design: Technical Research Factory Orchestrator Foundation.
