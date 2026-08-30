# Current project state

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE. HISTORICAL CLAIMS DO NOT OVERRIDE IT.**

Snapshot date: 2026-08-30
Snapshot commit: `ea039119bdab2c4c9a4842cbd48a9482e2240f2d`
origin/main: `49a17a75d481c9515a4f28a9d69c765fdf28c53b`
Local relation at snapshot: ahead 11, behind 0

## Architecture and runtime

RevLog is an offline-first browser application loaded from `index.html`. It contains authentication/cloud adapters, garage and service-history persistence, a catalogue-driven motorcycle selector, clarification flow, a resolver-backed Technical Profile runtime, technical search, and an About/release surface. Supabase is an optional runtime backend; live configuration is not verified by this repository snapshot.

Research is quarantined under `research/` and is not imported by the production browser entry point. `js/research/` is tooling/test support, not production profile data.

## Current facts

- Catalogue: 13 manufacturers, 318 families, 1,095 variants, 5,317 variant-years, MY1990–2025.
- Production Technical Profiles: 1 real profile, VFR800 MY2002, 99 entries (94 verified, 5 pending).
- Research schema: 183 canonical fields; Service Core: 44 fields.
- Honda Service Wave targets: 8; aggregate Service Core evidence: 51/352.
- VFR800: 13/44, 24 source-identity-uncertain rows, `RESEARCH-MORE`.
- CBR500R: 26/44, `SERVICE-CORE-PARTIAL`.
- Honda batch Wave 2: 12 targets, 6 underlying documents, 6 new verified slots.
- Latest full suite: 378 passed, 0 failed, 0 skipped, 0 todo.
- Published application version: 0.3.0.

## WIP and blockers

- P1: scale research evidence beyond the Honda fixture batch while preserving applicability and source proof.
- P1: add production Technical Profiles only through deliberate promotion review; 1,094 catalogue generations remain without production profiles.
- P2: improve source/document acquisition for blocked manuals and OEM parts.
- P2: audit cloud/RLS behavior against a live Supabase project before claiming deployment readiness.

## Next actions

**NEXT 1** — Define and run a bounded multi-manufacturer batch-pipeline pilot using existing official-source fixtures; measure reuse and conflicts.

**NEXT 2** — Perform a production-readiness audit of authentication, persistence, RLS and error paths against an explicitly selected test backend.

**NEXT 3** — Design a controlled Technical Profile promotion review for one non-VFR candidate without changing production data in the design phase.
