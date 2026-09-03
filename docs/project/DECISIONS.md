# Architectural decisions

## ADR-023 — Rider Service Core and Source Trust Model

Date: 2026-09-03
Decision: RevLog is owner-first: Rider Service Core is the permanent priority
and coverage layer over the broader Technical Profile taxonomy. An exact-
applicable official manufacturer publication is authoritative within scope.
A separately hosted copy of the same publication can verify document identity,
but cannot count as an independent technical claim; a genuinely separate
authoritative publication is an optional technical cross-check where available.
The zero-inference rule remains mandatory.
Consequences: coverage reports distinguish Core support, missing data,
applicability/conflict blockers and secondary fields. A future “Instrukcja
źródłowa” presentation may expose a lawful publication link without copying
manuals or exposing internal source IDs as the user experience. Existing
technical data and profiles remain unchanged.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

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

## ADR-015 — Execution planning requires explicit gap capability and canonical readiness

Date: 2026-09-01
Decision: a source can enter a research execution plan only when Foundation readiness passes and an explicit versioned SourceCapability intersects unresolved canonical GapPlan fields. Planner priority and all finite work/attempt bounds live in a semantically hashed PlanningPolicy; output uses existing Orchestrator contracts.
Rationale: source existence or presumed document richness is not proof of usefulness, and a planner that infers capabilities or owns a parallel work schema could promote blocked sources, chase vanity source counts or drift from replay semantics.
Consequences: unknown capability defers, no gap intersection is not-needed, exhausted sources defer, mismatch rejects, other failed readiness blocks, and declared capability provenance must be checked by a later typed execution-result layer.
Status: ACTIVE. Related design: Technical Research Factory Execution Planner.

## ADR-016 — Acquisition is pre-evidence and adapter output is untrusted

Date: 2026-09-01
Decision: the execution boundary accepts one bounded SourceWorkItem attempt through an explicitly declared adapter, validates typed outcomes/artifact metadata, and emits only existing Orchestrator events. `ACQUIRED` is not verified evidence and `NO-EVIDENCE` is not automatically researched-no-evidence; credentials and network are never persisted or used by synthetic adapters.
Rationale: acquisition, extraction and review have different trust levels. Keeping the boundary typed and immutable prevents adapter output from forging state, bypassing readiness/budgets, leaking secrets or changing production coverage.
Consequences: future adapters require separate security/provenance review; extraction/review queues remain a later bounded wave. Synthetic/local fixtures are the only executable adapters in this foundation.
Status: ACTIVE. Related design: Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation.

## ADR-017 — Raw extraction is content-bound and remains pre-review

Date: 2026-09-02
Decision: extraction accepts only a canonical successful `ACQUIRED` result plus a matching local content envelope, verifies artifact identity/media/byte length/SHA-256 before adapter invocation, and produces immutable raw candidates with canonical Factory provenance. Raw values, units, locations and explicitly supplied applicability/context are preserved without normalization or inference. Extraction emits no acquisition events and creates neither evidence nor review decisions.
Rationale: acquisition metadata is not document content, and extractor output is untrusted. A content-integrity and provenance boundary prevents parsing the wrong bytes, forged ownership, hidden retry/state changes, premature normalization and accidental production coupling.
Consequences: only deterministic local/synthetic UTF-8 adapters exist in this foundation; PDF/OCR/browser/network parsing, durable extraction persistence, evidence conversion and Review Queue lifecycle require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Extraction Agent / Local Extractor Adapter Foundation.

## ADR-018 — Review Queue is immutable eligibility, not a decision workflow

Date: 2026-09-02
Decision: Review Queue schema 1 creates one immutable `QUEUED` entry per validated raw extraction candidate and records non-reviewable extraction dispositions as typed ineligibility. Entries embed the unchanged candidate and bind it to canonical extraction and acquisition provenance. Queue construction has no mutable transitions, reviewer actions, evidence conversion or persistence.
Rationale: eligibility for future human review is a different trust boundary from extraction and from a human decision. Keeping queue presence pre-decision prevents extraction failures or zero candidates from becoming rejections, evidence absence or accepted facts.
Consequences: exact byte-equivalent duplicates may collapse by semantic entry identity, while identity collisions fail closed and different provenance remains distinct. Human Review Decisions, reviewer identity, normalization, conflict handling, evidence promotion, persistence and lifecycle integration require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Review Queue Foundation.

## ADR-019 — Human review decisions are immutable pre-evidence records

Date: 2026-09-02
Decision: Human Review Decision schema 1 records exactly one internally consistent decision payload per Review Queue entry in a bounded set using `ACCEPT`, `REJECT` or `NEEDS-MORE-REVIEW`. Records retain canonical queue/extraction/acquisition references, explicit opaque reviewer identity and an optional raw comment. They are immutable and create no evidence or workflow transition.
Rationale: a human outcome must be auditable without conflating reviewer intent with evidence verification or production acceptance. Deterministic identities and fail-closed duplicate conflicts prevent silent overwrite while preserving all upstream raw data.
Consequences: `ACCEPT` only permits future evidence processing, `REJECT` is candidate-local, and `NEEDS-MORE-REVIEW` triggers no automation. Authentication, supersession, evidence conversion, normalization, conflict resolution, researched-no-evidence, persistence and production promotion require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Human Review Decisions Foundation.

## ADR-020 — Evidence processing remains an explicit pre-promotion projection

Date: 2026-09-03
Decision: Evidence Processing schema 1 consumes immutable Human Review Decision records with their validated Review Queue entries and produces explicit `ACCEPTED-FOR-PROCESSING`, `REJECTED-CANDIDATE`, `NEEDS-MORE-REVIEW`, `INELIGIBLE` and `CANNOT-ADVANCE` records. It preserves raw candidates and canonical provenance; it does not create evidence or promote `ACCEPT`.
Rationale: an accepted human candidate still requires a separate, auditable processing boundary before normalization, conflict resolution or production evidence can be considered.
Consequences: rejected and deferred candidates remain non-advancing, missing queue context is typed ineligible, and directly observable accepted disagreements remain unresolved without winner selection. Evidence creation, researched-no-evidence conversion, normalization, promotion, persistence and lifecycle integration remain later layers.
Status: ACTIVE. Related design: Technical Research Factory Evidence-Processing Contract Foundation.

## ADR-021 — Ténéré pilot design preserves blocked readiness and synthetic traversal

Date: 2026-09-03
Decision: The future Ténéré batch pilot is designed for exactly `yamaha.tenere-700.gen1` MY2019 EU standard against prospect `BW3-F8197-E0`, with one source work item and one attempt. Interruption occurs after acquisition completion and before downstream processing; a validated checkpoint and replayed resume must equal uninterrupted state. A clearly separate synthetic/local prospect is the only executable fixture until the real prospect becomes execution-ready.
Rationale: checkpoint/resume behavior can be proven deterministically without weakening readiness or authenticating an external source.
Consequences: the real prospect remains `REGISTERED-NOT-REAUTHENTICATED` and `FACTORY-PILOT-CANDIDATE`; authentication, applicability proof, acquisition, extraction, review and processing remain future gated stages. No real evidence or production state can be produced by this design fixture.
Status: ACTIVE. Related design: Technical Research Factory Ténéré Interrupted/Resumed Batch Pilot Design.

## ADR-022 — Production promotion rollback is registry-exposure-only

Date: 2026-09-03
Decision: every bounded production registry promotion must retain an immutable record of the exact prior and resulting registry sets, promoted profile identity, entry/source graph and a deterministic rollback target. Rollback may remove only the exact promoted profile's registry exposure and restore the prior set; it must not delete production/source artifacts or alter research history, catalogue, evidence or coverage.
Rationale: registry exposure is the smallest reversible production boundary, while profile and provenance artifacts must remain auditable after rollback. A fail-closed record prevents ambiguous rollback scope and protects unrelated registered profiles.
Consequences: promotion governance is not complete without recorded prior/current sets, retained artifacts and regression validation. This Ducati record is readiness-only; no rollback is automatic or executed by the contract.
Status: ACTIVE. Related design: Phase 6 Production Promotion Rollback / Governance Closeout.
