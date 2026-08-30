# Project state audit

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE, NOT HISTORICAL CLAIMS.**

Snapshot: `research/reports/project-state-audit.json` (2026-08-30, commit `ea039119`).

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

Catalogue boundary is MY1990–2025 with 13 manufacturers, 318 families, 1,095 variants and 5,317 variant-years. Research represents 167 targets and 283 candidates in the aggregate dataset, plus Honda Service Core and batch fixtures. VFR800 and CBR500R are regression fixtures; most catalogue generations have no production profile.

## Technical Profile inventory

One production profile exists: `honda.vfr800.rc46-vtec-gen1.2002`, MY2002, 99 entries, 94 verified, 5 pending, 30 unique source IDs. No other production profile is registered. Synthetic/candidate profiles remain research/test-only.

## Security/configuration

Supabase URL and anon client configuration are visible in `js/supabase.js`; no secret service-role credential was found in the audited files. RLS and live backend configuration are repository expectations, not verified live facts. External CDN loading exists for Supabase; research remains offline/bundled.

## Dead/duplicate/legacy observations

`js/research/` and historical reports are ACTIVE tooling/history, not dead runtime. Existing manufacturer datasets and reports should be REVIEW-BEFORE-CLEANUP. The generic pipeline is ACTIVE. No deletion was performed. Potential duplication remains between older research report conventions and newer batch reporting; consolidate only in a dedicated cleanup task.

## Release readiness

Local development: READY-WITH-RISKS. Authenticated beta: NOT-READY until live auth/RLS/error paths are verified. Public beta/production: NOT-READY due single-profile coverage, backend verification gap and incomplete operational deployment evidence. Published version remains 0.3.0.

## WIP and debt

P0: none identified. P1: scalable multi-manufacturer evidence batches; controlled profile promotion. P2: cloud/RLS verification; source acquisition; broader profile coverage. P3: market/scooter/125 expansion.

Technical debt: HIGH — only one production Technical Profile and live backend/deployment claims are unverified. MEDIUM — parallel historical report formats and limited document-content hashing. LOW — presentation/report consolidation.

## Scorecard (0–5)

App shell 3, auth 2, cloud persistence 2, garage 3, service history 3, catalogue 4, identity/resolver 4, clarification 4, Technical Profiles 3, technical search 4, research evidence 3, source management 2, batch research 3, tests 4, documentation 3, release process 3.
