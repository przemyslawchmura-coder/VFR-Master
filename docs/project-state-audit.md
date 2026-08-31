# Project state audit

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE, NOT HISTORICAL CLAIMS.**

Snapshot: `research/reports/project-state-audit.json` (2026-08-31 post-Yamaha-transfer-batch-design working tree based on `4da1d24`; the containing commit is authoritative).

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

Auth → Supabase session → database queries; garage → local/cloud persistence; selection → catalogue → resolver → clarification → active motorcycle; active motorcycle → registry → profile loader → resolved technical UI/search; research → evidence validation → review → optional promotion. Live backend/RLS and production promotion remain unverified/not implemented.

## Catalogue and research

Catalogue boundary is MY1990–2025 with 13 manufacturers, 318 families, 1,095 variants and 5,317 variant-years. Research represents 167 targets and 283 candidates in the aggregate dataset, plus Honda Service Core, batch fixtures and the executed five-target pilot. VFR800 and CBR500R are regression fixtures; 1,094 catalogue variants have no production profile.

## Technical Profile inventory

One production profile exists: `honda.vfr800.rc46-vtec-gen1.2002`, MY2002, 99 entries, 94 verified, 5 pending, 30 unique source IDs. No other production profile is registered. Synthetic/candidate profiles remain research/test-only.

## Security/configuration

Supabase URL and anon client configuration are visible in `js/supabase.js`; no secret service-role credential was found in the audited files. RLS and live backend configuration are repository expectations, not verified live facts. External CDN loading exists for Supabase; research remains offline/bundled.

## Dead/duplicate/legacy observations

`js/research/` and historical reports are ACTIVE tooling/history, not dead runtime. Existing manufacturer datasets and reports should be REVIEW-BEFORE-CLEANUP. The generic pipeline is ACTIVE. No deletion was performed. Potential duplication remains between older research report conventions and newer batch reporting; consolidate only in a dedicated cleanup task.

## Release readiness

Local development: READY-WITH-RISKS. Authenticated beta: NOT-READY until live auth/RLS/error paths are verified. Public beta/production: NOT-READY due single-profile coverage, backend verification gap and incomplete operational deployment evidence. Published version remains 0.3.0.

## Independent audit correction

The Honda Service Data Wave 1 population is eight targets, so its `51/352` metric is internally correct. Honda Batch Wave 2 is a separate 12-target population with `528` slots and `51→57` verified slots. Its six new rows are all generic engine specification fields; practical-service gain is zero. The phrase “100% verification yield” is row yield only and must not be read as batch coverage. The canonical document count of six is justified by mirror deduplication (seven hosting locations); the earlier review queue count of 49 applies to the two-target generic fixture, while the 12-target batch queue contains 471 unresolved items.

The subsequent five-target pilot validated the owner-manual strategy: 51/220→101/220 verified target slots, +48 practical and +2 generic slots, from five Tier A documents of which two yielded evidence. One duplicate CBR600RR hosting location was deduplicated; no conflicts or production changes occurred. Audit outcome is ACCEPT-WITH-RISKS because three targets yielded nothing and the gains cover NC750X MY2021–2023 and CBR600RR MY2024 rather than every year in the target ranges. Manufacturer scaling now requires a bounded reassessment rather than automatic expansion.

The completed reassessment evaluated ten repository-known candidates across seven manufacturers. Candidates with unknown exact-target Tier A/B prospects or unknown document richness remained unranked. It selected two narrowly edition-scoped Yamaha targets: MT-09 III MY2021 EU standard and Ténéré 700 I MY2019 EU standard, each starting at 0/44. The execution gate is +24 verified/+22 practical slots, at most two primary documents per target, no Tier C/D practical contribution and zero unresolved safety-critical conflicts. Design audit outcome is ACCEPT-WITH-RISKS: this tests transfer to one non-Honda manufacturer across two use classes, not broad multi-manufacturer scalability. No evidence or production data changed.

The executed Yamaha transfer batch authenticated official Yamaha Europe owner manuals `B7N-28199-E0` and `BW3-F8199-E0`. Each exact one-year target moved 0/44→29/44; combined gain was +58 verified, +54 practical and +4 generic tire-size slots from 58 rows and two unique Tier A documents. ABS, manual transmission, standard equipment, chain measurement and tire load/road/off-road conditions are explicit. Conflicts, duplicate locations, Tier C/D contribution and budget overruns were zero. Audit outcome is ACCEPT-WITH-RISKS because both rich manuals were preselected, only Yamaha transfer was tested, and later catalogue years remain uncovered. Production and VFR800 did not change.

The post-Yamaha design reproduced Honda's 24 and Yamaha's 27 practical slots per yielding document, then evaluated ten serious candidates across eight manufacturers using risk-adjusted expected marginal practical yield per primary document. The five candidates with UNKNOWN exact Tier A/B prospects remained unranked. It selected only MY2022 USA Sportster S/RH1250S against registered official Harley-Davidson owner manual `94001064`, with a one-document, +8 verified/+6 practical and exact-applicability gate. No control is included: four prior high-yield owner manuals already establish the process baseline. Audit outcome is ACCEPT-WITH-RISKS because exact model inclusion, pages and document richness have not been reauthenticated. No evidence, coverage or production data changed.

## WIP and debt

P0: none identified. P1: bounded one-document Harley-Davidson Sportster S transfer execution; controlled profile promotion. P2: cloud/RLS verification; blocked-source acquisition; broader profile coverage. P3: market/scooter/125 expansion.

Technical debt: HIGH — only one production Technical Profile and live backend/deployment claims are unverified. MEDIUM — parallel historical report formats and limited document-content hashing. LOW — presentation/report consolidation.

## Scorecard (0–5)

App shell 3, auth 2, cloud persistence 2, garage 3, service history 3, catalogue 4, identity/resolver 4, clarification 4, Technical Profiles 3, technical search 4, research evidence 3, source management 2, batch research 3, tests 4, documentation 3, release process 3.
