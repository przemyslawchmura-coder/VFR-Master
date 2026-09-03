# Project state audit

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE, NOT HISTORICAL CLAIMS.**

Snapshot: `research/reports/project-state-audit.json` (2026-09-03 post-Technical-Research-Factory-Ténéré source-authentication working tree; the containing commit is authoritative).

## Repository map

- `index.html`, `js/app.js`: application shell, navigation, authentication UI and orchestration.
- `js/database.js`, `js/service.js`, `js/supabase.js`: garage/service-history persistence, cloud adapter and auth calls.
- `data/motorcycle-catalog.js`: production catalogue and stable identities.
- `data/technical/`, `js/technical/`: production Technical Profile registry, profiles, resolver, applicability, search, browser store and UI.
- `research/schema/`, `research/data/`, `research/reports/`: quarantined evidence schema, candidates, acquisition records and reports.
- `research/lib/`, `scripts/`: research/batch and reporting tooling.
- `tests/`: catalogue, migration, resolver, UI, production profile and research regression suites.
- `docs/`: current and historical technical/catalogue/release documentation plus project memory.

## Runtime and boundaries

`index.html` loads bundled Supabase CDN, `js/app-release.js`, catalogue, technical/profile modules, database/service modules and `js/app.js`. Research files are not loaded by the production entry point. `js/research/` is consumed by tests/tooling only. Boundary tests pass.

## Feature inventory

Authentication and login/logout: FUNCTIONAL-PARTIAL (implemented, live backend not verified). Garage and active motorcycle: FUNCTIONAL-PARTIAL (database/cloud paths and tests exist). Service history/editing: FUNCTIONAL-PARTIAL. Catalogue selection, stable identity, resolver, clarification and ABS tri-state: COMPLETE for tested scope. Technical Profile runtime/search/UI: COMPLETE for the VFR reference profile, otherwise PARTIAL. Research/evidence and batch pipeline: FUNCTIONAL-PARTIAL, explicitly non-production. Mobile/iOS: FUNCTIONAL-PARTIAL based on responsive/static tests; device deployment is UNKNOWN.

## Data flows

Auth → Supabase session → database queries; garage → local/cloud persistence; selection → catalogue → resolver → clarification → active motorcycle; active motorcycle → registry → profile loader → resolved technical UI/search; research → evidence validation → review → optional promotion. Live backend/RLS and cloud deployment remain unverified; production promotion is implemented for the bounded registered Ducati profile.

The Technical Research Factory audit classifies the research path as reusable primitives under manual orchestration, not yet a resumable factory. The accepted-with-risks architecture defines stable target/prospect/applicability/gap contracts, one fail-closed gate, bounded work state, review/checkpoint identities and a generic core with optional discovery-only manufacturer adapters. Ténéré `BW3-F8197-E0` is metadata-authenticated as its own 2020 service publication with an official Yamaha access/delivery route, and its public applicability-authentication path is exhausted. Suzuki `SV650/A/XA (L7-M4)` is now an authenticated Tier A service-manual prospect through Suzuki’s official European Service Portal, but its exact EU SV650A L9 applicability remains blocked; no technical values or evidence were inspected.

Foundation #1 supplies canonical contracts/gates; Orchestration schema 1 supplies replayable bounded state; Planner schema 1 now supplies explicit gap capabilities, semantic finite policy, deterministic typed decisions and canonical batch/work output. Existing Honda/Yamaha/VFR defer, Harley rejects and Ténéré blocks without mutation; a synthetic local fixture proves the planned path. Durable event storage and typed execution-result ingestion remain deferred; historical data was not migrated.

## Catalogue and research

Catalogue boundary is MY1990–2025 with 13 manufacturers, 318 families, 1,095 variants and 5,317 variant-years. Research represents 167 targets and 283 candidates in the aggregate dataset, plus Honda Service Core, batch fixtures and the executed five-target pilot. VFR800 and CBR500R are regression fixtures; 1,093 catalogue variants have no production profile.

## Technical Profile inventory

Two production profiles exist: `honda.vfr800.rc46-vtec-gen1.2002` (MY2002, 99 entries, 94 verified, 5 pending, 30 unique source IDs) and bounded `ducati.monster937.2021` (MY2021, 6 verified entries). Synthetic/candidate profiles remain research/test-only.

## Security/configuration

Supabase URL and publishable client configuration are visible in `js/supabase.js`; no secret service-role credential was found in the audited files. Session persistence and token refresh are configured, but password recovery, auth event handling and recovery-path validation are absent from the repository. A repository-controlled ownership/RLS baseline now defines authenticated-user isolation, composite motorcycle ownership for service records and removal of random ownership defaults, but it has not been applied to live Supabase. The pre-existing schema migration remains additive for `technical_clarification`; full live schema parity and policy application are still unverified. Supabase is loaded from an unpinned external CDN URL (`@supabase/supabase-js@2`), and no deployment workflow/configuration or recovery runbook is present.

## Dead/duplicate/legacy observations

`js/research/` and historical reports are ACTIVE tooling/history, not dead runtime. Existing manufacturer datasets and reports should be REVIEW-BEFORE-CLEANUP. The generic pipeline is ACTIVE. No deletion was performed. Potential duplication remains between older research report conventions and newer batch reporting; consolidate only in a dedicated cleanup task.

## Release readiness

Local development: READY-WITH-RISKS. Authenticated beta: NOT-READY until live auth/RLS/error paths are verified. Public beta/production: NOT-READY due incomplete backend ownership proof, recovery/configuration gaps and incomplete deployment/recovery evidence. Phase 7 first bounded task is read-only live Supabase schema/RLS/auth inspection; no fix is authorized by this audit. Published version remains 0.3.0.

## Independent audit correction

The Honda Service Data Wave 1 population is eight targets, so its `51/352` metric is internally correct. Honda Batch Wave 2 is a separate 12-target population with `528` slots and `51→57` verified slots. Its six new rows are all generic engine specification fields; practical-service gain is zero. The phrase “100% verification yield” is row yield only and must not be read as batch coverage. The canonical document count of six is justified by mirror deduplication (seven hosting locations); the earlier review queue count of 49 applies to the two-target generic fixture, while the 12-target batch queue contains 471 unresolved items.

The subsequent five-target pilot validated the owner-manual strategy: 51/220→101/220 verified target slots, +48 practical and +2 generic slots, from five Tier A documents of which two yielded evidence. One duplicate CBR600RR hosting location was deduplicated; no conflicts or production changes occurred. Audit outcome is ACCEPT-WITH-RISKS because three targets yielded nothing and the gains cover NC750X MY2021–2023 and CBR600RR MY2024 rather than every year in the target ranges. Manufacturer scaling now requires a bounded reassessment rather than automatic expansion.

The completed reassessment evaluated ten repository-known candidates across seven manufacturers. Candidates with unknown exact-target Tier A/B prospects or unknown document richness remained unranked. It selected two narrowly edition-scoped Yamaha targets: MT-09 III MY2021 EU standard and Ténéré 700 I MY2019 EU standard, each starting at 0/44. The execution gate is +24 verified/+22 practical slots, at most two primary documents per target, no Tier C/D practical contribution and zero unresolved safety-critical conflicts. Design audit outcome is ACCEPT-WITH-RISKS: this tests transfer to one non-Honda manufacturer across two use classes, not broad multi-manufacturer scalability. No evidence or production data changed.

The executed Yamaha transfer batch authenticated official Yamaha Europe owner manuals `B7N-28199-E0` and `BW3-F8199-E0`. Each exact one-year target moved 0/44→29/44; combined gain was +58 verified, +54 practical and +4 generic tire-size slots from 58 rows and two unique Tier A documents. ABS, manual transmission, standard equipment, chain measurement and tire load/road/off-road conditions are explicit. Conflicts, duplicate locations, Tier C/D contribution and budget overruns were zero. Audit outcome is ACCEPT-WITH-RISKS because both rich manuals were preselected, only Yamaha transfer was tested, and later catalogue years remain uncovered. Production and VFR800 did not change.

The post-Yamaha design reproduced Honda's 24 and Yamaha's 27 practical slots per yielding document, then evaluated ten serious candidates across eight manufacturers using risk-adjusted expected marginal practical yield per primary document. The five candidates with UNKNOWN exact Tier A/B prospects remained unranked. It selected only MY2022 USA Sportster S/RH1250S against registered official Harley-Davidson owner manual `94001064`, with a one-document, +8 verified/+6 practical and exact-applicability gate. No control is included: four prior high-yield owner manuals already establish the process baseline. Audit outcome is ACCEPT-WITH-RISKS because exact model inclusion, pages and document richness have not been reauthenticated. No evidence, coverage or production data changed.

The Harley execution rejected that prospect after authentication. Official Harley-Davidson indexed content identifies publication `94001064` as the MY2023 Sportster RH Models owner manual, while official parts indexing maps it to RH1250S. It therefore cannot prove the selected MY2022 scope, and the official content endpoint returned HTTP 403. Extraction stopped with 0/44→0/44, zero evidence, practical and generic gain, no researched-no-evidence claims, no conflicts and no Tier C/D contribution. Audit outcome is REJECT: the execution correctly failed closed, but the third-manufacturer transfer hypothesis did not pass. Production and VFR800 did not change.

The source-readiness reassessment inventoried 17 prospects/placeholders across eight manufacturers under an all-fields gate that separates authenticity, applicability, accessibility and marginal yield. Zero prospects are execution-ready. The historical Harley selection is explicitly superseded and current `94001064` readiness is REJECTED-MISMATCH for MY2022. Six already-inspected sources are exhausted/low-marginal-yield; five manufacturers have UNKNOWN exact Tier A/B prospects. The nearest source is MT-09 service manual `B7N-28197-E0` / `LIT-11616-34-61`, but it remains source-identity-partial because no official delivery path is stored and market/SP/safety scope is incomplete. Audit outcome is ACCEPT-WITH-RISKS. No technical evidence or Service Core coverage changed.

The bounded MT-09 prospect authentication then established official Yamaha US identity and purchase/authenticated delivery for `LIT-11616-34-61`, including MY2021 MT-09 and MT-09 SP metadata. It did not establish an official Yamaha EU path for `B7N-28197-E0`, prove B7N/LIT equivalence, resolve MY2021 EU applicability, or prove standard/SP and ABS/equipment safety separability. Final readiness is ACCESS-BLOCKED and the audit outcome is ACCEPT-WITH-RISKS. No motorcycle technical values, evidence rows, researched-no-evidence states or coverage changed.

The final bounded reconciliation found no Yamaha-controlled B7N record or B7N/LIT mapping. Relationship is RELATIONSHIP-UNRESOLVED. Yamaha Europe metadata does prove MTN890 = standard MT-09 and MTN890D = MT-09 SP, but that does not authenticate the service-publication code or EU applicability. Readiness remains ACCESS-BLOCKED; anti-loop state is MT09-AUTHENTICATION-PATH-EXHAUSTED; audit is ACCEPT-WITH-RISKS. NEXT moves to registered Ténéré prospect BW3-F8197-E0. No technical evidence, coverage or production state changed.

## WIP and debt

P0: none identified. P1: resolve Suzuki SV650 prospect applicability only through new authenticated Suzuki metadata or portal access; do not repeat exhausted public Ténéré authentication. P2: cloud/RLS verification; blocked-source acquisition; broader profile coverage. P3: market/scooter/125 expansion.

Technical debt: HIGH — live backend/deployment claims, ownership policies and recovery paths are unverified. MEDIUM — parallel historical report formats and limited document-content hashing. LOW — presentation/report consolidation.

## Scorecard (0–5)

App shell 3, auth 2, cloud persistence 2, garage 3, service history 3, catalogue 4, identity/resolver 4, clarification 4, Technical Profiles 3, technical search 4, research evidence 3, source management 2, batch research 3, tests 4, documentation 3, release process 3.
