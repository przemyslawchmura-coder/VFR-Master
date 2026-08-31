# Current project state

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE. HISTORICAL CLAIMS DO NOT OVERRIDE IT.**

Snapshot date: 2026-08-31
Snapshot basis: post-Yamaha-transfer working tree based on `865f464536ff3f03c926e2f7f7df307a529f2551`; the containing commit is the authoritative snapshot commit because a Git commit cannot embed its own hash.
origin/main: `97484bf004c466a6f26a5e42ae07b91214e95962`
Expected local relation after the single containing commit: ahead 2, behind 0

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
- Latest full suite before commit: 400 passed, 0 failed, 0 skipped, 0 todo.
- Published application version: 0.3.0.

## Independent work streams

- **Stream A — Catalogue expansion:** identify and add missing manufacturers, families, generations, variants, model years, aliases and market/applicability identities.
- **Stream B — Technical data/profile coverage:** acquire source-backed service data, resolve applicability/conflicts, and promote only through controlled review.

A catalogue identity does not imply a Technical Profile. Mature profile tooling does not imply complete catalogue content.

## WIP and blockers

- P1: design the next bounded transfer batch from measured Honda/Yamaha yield without admitting unknown Tier A/B prospects or acquiring evidence in the design task.
- P1: add production Technical Profiles only through deliberate promotion review; 1,094 catalogue variants remain without production profiles.
- P2: improve source/document acquisition for blocked manuals and OEM parts.
- P2: audit cloud/RLS behavior against a live Supabase project before claiming deployment readiness.

## Next actions

**NEXT 1** — Design, without acquiring evidence, a bounded post-Yamaha transfer batch using the measured Honda/Yamaha document yield, edition-scope risks and unknown-source eligibility rule; decide whether one additional manufacturer has enough repository-known Tier A/B source prospect to justify execution.

**NEXT 2** — Perform a production-readiness audit of authentication, persistence, RLS and error paths against an explicitly selected test backend.

**NEXT 3** — Design a controlled Technical Profile promotion review for one non-VFR candidate without changing production data in the design phase.

The future **GLOBAL CATALOGUE GAP / COVERAGE AUDIT** is a separate bounded checkpoint: inventory what exists, identify missing manufacturers/families/generations/years and regional/ABS/transmission gaps, then prioritize additions. It is not executed yet.

Operator-reported live fact (not independently verified by Codex): Supabase Auth Site URL was corrected from the GitHub Pages root to the deployed VFR-Master project path, and a fresh signup/email-confirmation flow was manually tested successfully.
