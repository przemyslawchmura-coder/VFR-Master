# Current project state

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE. HISTORICAL CLAIMS DO NOT OVERRIDE IT.**

Snapshot date: 2026-09-01
Snapshot basis: post-Technical-Research-Factory-Execution-Planner working tree based on `67f547273972c441f4870cd425974f359eaf0427`; the containing commit is the authoritative snapshot commit because a Git commit cannot embed its own hash.
origin/main: `97484bf004c466a6f26a5e42ae07b91214e95962`
Expected local relation after the single containing commit: ahead 11, behind 0

## Architecture and runtime

RevLog is an offline-first browser application loaded from `index.html`. It contains authentication/cloud adapters, garage and service-history persistence, a catalogue-driven motorcycle selector, clarification flow, a resolver-backed Technical Profile runtime, technical search, and an About/release surface. Supabase is an optional runtime backend; live configuration is not verified by this repository snapshot.

Research is quarantined under `research/` and is not imported by the production browser entry point. `js/research/` is tooling/test support, not production profile data.

## Current facts

- Catalogue inventory: 13 manufacturers, 318 families, 1,095 variants, 5,317 variant-years, MY1990–2025. Catalogue infrastructure/identity is mature for the tested scope; global catalogue content coverage remains incomplete and has no defensible percentage denominator.
- Production Technical Profiles: 1 real profile, VFR800 MY2002, 99 entries (94 verified, 5 pending).
- Research schema: 183 canonical fields; Service Core: 44 fields.
- Honda Service Data Wave 1 population: 8 targets and 51/352 aggregate Service Core slots (the denominator is specifically 8 × 44).
- VFR800: 13/44, 24 source-identity-uncertain rows, `RESEARCH-MORE`.
- CBR500R: 26/44, `SERVICE-CORE-PARTIAL`.
- Honda Batch Wave 2 population: 12 selected catalogue targets, 528 target-field slots, 6 underlying documents, 6 new verified slots; all gains were generic engine specification fields and practical-service-field gain was 0.
- High-value source-acquisition pilot: `ACCEPT-WITH-RISKS`; five targets, 51/220 → 101/220 verified target slots, +50 total, +48 practical and +2 generic slots; 5 Tier A documents, 2 yielding, 6 hosting locations, 1 duplicate location, 52 evidence rows, 0 conflicts. Coverage is edition-scoped: NC750X MY2021–2023 and CBR600RR MY2024 yielded evidence; CBR500R, VFR800 and Africa Twin yielded none.
- Post-pilot scaling reassessment: `ACCEPT-WITH-RISKS`; ten repository-known candidates across seven manufacturers were evaluated. The next batch is two Yamaha targets with registered service-rich Tier A owner manuals: `yamaha.mt-09.gen3` MY2021 EU standard and `yamaha.tenere-700.gen1` MY2019 EU standard. Each starts at 0/44 verified Service Core; expected combined practical gain is 36–48, with success gated at +24 verified/+22 practical, zero unresolved safety-critical conflicts and at most two primary documents per target. No evidence was acquired.
- Yamaha transfer acquisition: `ACCEPT-WITH-RISKS`; two authenticated Tier A Yamaha owner manuals yielded 58 rows and 58 new Service Core slots, including 54 practical and four generic tire-size slots. MT-09 MY2021 EU standard and Ténéré 700 MY2019 EU standard each moved 0/44→29/44 from one unique document. There were zero conflicts, zero Tier C/D contribution, no duplicates and no budget overrun. Later generation years and excluded SP/named-equipment variants remain uncovered.
- Post-Yamaha transfer-batch design: `ACCEPT-WITH-RISKS`; ten serious candidates across eight manufacturers were evaluated using risk-adjusted expected marginal practical gain per primary document. Five UNKNOWN prospects remained unranked. The sole selected target is `harley-davidson.revolution-max.sportster-s`, MY2022 USA, against registered official owner manual `94001064`, with one document, +8 verified/+6 practical gates and fail-closed model/ABS/equipment applicability. No evidence or coverage changed.
- Harley-Davidson transfer acquisition: `REJECT`; official publication `94001064` reauthenticated as the MY2023 Sportster RH Models owner manual and official parts indexing links it to RH1250S, but it cannot support the selected MY2022 scope and its official content endpoint returned HTTP 403. Authentication stopped extraction. Coverage remained 0/44 with zero verified, practical and generic gain; no researched-no-evidence rows were claimed, conflicts and Tier C/D contribution were zero, and the one-document budget was respected.
- Source-prospect authentication-quality reassessment: `ACCEPT-WITH-RISKS`; 17 records across eight manufacturers were classified through a deterministic readiness gate. Zero prospects are execution-ready. Six previously inspected sources are exhausted/low-marginal-yield; five manufacturers have UNKNOWN exact Tier A/B prospects; Harley `94001064` and the USA Africa Twin manual are rejected mismatches. The closest prospect, MT-09 service manual `B7N-28197-E0` / `LIT-11616-34-61`, remains source-identity-partial because no official delivery path is stored and market/SP/safety scope is incomplete. No technical evidence or coverage changed.
- MT-09 service-manual prospect authentication: `ACCEPT-WITH-RISKS`; final readiness is `ACCESS-BLOCKED`. Yamaha US metadata authenticates `LIT-11616-34-61` for the MY2021 MT-09 and names the corrected dealer-system manual, but the complete content route requires purchase/authentication. No Yamaha-controlled EU path for `B7N-28197-E0` was authenticated, B7N/LIT equivalence is unresolved, and MY2021 EU plus standard/SP/ABS/equipment safety scope remain blocked. No technical values, evidence rows, researched-no-evidence states or coverage changed.
- MT-09 publication-code/EU reconciliation: `ACCEPT-WITH-RISKS`; relationship is `RELATIONSHIP-UNRESOLVED`, readiness remains `ACCESS-BLOCKED`, and the anti-loop result is `MT09-AUTHENTICATION-PATH-EXHAUSTED`. Yamaha Europe proves `MTN890` = standard MT-09 and `MTN890D` = MT-09 SP, but no Yamaha-controlled B7N record, B7N/LIT relationship or EU service-manual applicability was found. No technical evidence or coverage changed.
- Technical Research Factory architecture: `ACCEPT-WITH-RISKS`. Existing generic validation, Service Core, document identity/deduplication, limited normalization, conflict/coverage/yield and reporting capabilities are reusable, but target/prospect contracts, a canonical readiness/applicability gate, deterministic orchestration, budgets, stable attempt/event identity, checkpoint/resume and typed review state are not yet integrated. The durable design defines a generic core with optional discovery adapters, a five-wave incremental implementation, and keeps research-to-production promotion manual. Ténéré `BW3-F8197-E0` is preserved as `FACTORY-PILOT-CANDIDATE`; no authentication or evidence work occurred.
- Technical Research Factory Foundation #1: `ACCEPT-WITH-RISKS`. Contract version 1 implements manufacturer-neutral `ResearchTarget`, `SourceProspect`, `ApplicabilityScope` and `GapPlan` validation, deterministic JSON serialization, one dimension-preserving fail-closed applicability evaluator, one ADR-012 readiness gate, and shape adapters for existing targets/prospects/acquired sources. Real Honda, Yamaha, Harley mismatch and Ténéré blocked records exercise the API. Historical gates remain behind adapters pending bounded migration; orchestration is not implemented. No research evidence or coverage changed.
- Technical Research Factory Orchestrator Foundation: `ACCEPT-WITH-RISKS`. Orchestration schema 1 adds deterministic semantic IDs, immutable append-only events, a pure replay reducer, bounded attempts, terminal transition enforcement and version/digest-verified checkpoints. Existing Honda/Yamaha exhausted, Harley mismatch and Ténéré blocked records replay without mutation; Foundation readiness remains authoritative. Durable event storage and planning/external-result ingestion remain deferred. No research evidence or production state changed.
- Technical Research Factory Execution Planner: `ACCEPT-WITH-RISKS`. Planner schema 1 deterministically maps canonical targets, GapPlans, prospects, readiness, explicit capabilities and finite policy into existing Orchestrator batch/work contracts. Decisions preserve missing/conflict/researched-no-evidence and classify planned/deferred/rejected/blocked/not-needed with typed reasons. Existing Honda/Yamaha/VFR are deferred, Harley rejected and Ténéré blocked; the planned path uses a synthetic local fixture because no current prospect is execution-ready. Capability provenance and typed execution-result ingestion remain deferred. No external research, evidence or production state changed.
- Latest full suite before commit: 480 passed, 0 failed, 0 skipped, 0 todo.
- Published application version: 0.3.0.

## Independent work streams

- **Stream A — Catalogue expansion:** identify and add missing manufacturers, families, generations, variants, model years, aliases and market/applicability identities.
- **Stream B — Technical data/profile coverage:** acquire source-backed service data, resolve applicability/conflicts, and promote only through controlled review.

A catalogue identity does not imply a Technical Profile. Mature profile tooling does not imply complete catalogue content.

## WIP and blockers

- P1: implement the bounded Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation; Ténéré `BW3-F8197-E0` remains a later factory-pilot candidate.
- P1: add production Technical Profiles only through deliberate promotion review; 1,094 catalogue variants remain without production profiles.
- P2: improve source/document acquisition for blocked manuals and OEM parts.
- P2: audit cloud/RLS behavior against a live Supabase project before claiming deployment readiness.

## Next actions

**NEXT** — Implement the bounded Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation: define a typed interface for attempting already-planned SourceWorkItems and recording immutable attempt outcomes/events under existing readiness, attempt-budget and checkpoint limits, using synthetic/local fixtures only and performing no uncontrolled multi-target research or production change.

Deferred independent streams remain the live-backend production-readiness audit, controlled Technical Profile promotion design, and global catalogue gap audit; none is an active NEXT task.

The future **GLOBAL CATALOGUE GAP / COVERAGE AUDIT** is a separate bounded checkpoint: inventory what exists, identify missing manufacturers/families/generations/years and regional/ABS/transmission gaps, then prioritize additions. It is not executed yet.

Operator-reported live fact (not independently verified by Codex): Supabase Auth Site URL was corrected from the GitHub Pages root to the deployed VFR-Master project path, and a fresh signup/email-confirmation flow was manually tested successfully.
