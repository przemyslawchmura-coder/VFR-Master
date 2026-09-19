# Engineering worklog

Historical entries reconstructed from git; newest first.

## 2026-09-07 — Research-to-runtime identity mapping contract foundation

Added the generic non-production mapping contract that separates research
grouping identity, one-or-more runtime catalogue identities and explicit
applicability constraints. Added the generic `bodyStyles` applicability
dimension with backward-compatible UNKNOWN defaults and fail-closed resolution,
plus deterministic ordering/IDs and JSON replay. FZ1 fixtures map
`yamaha.fz1.gen1` only to `yamaha.fz-fazer.fzs1000`, and `yamaha.fz1.gen2` to
distinct N/S runtime identities without universalizing unresolved applicability.
No source research, technical values, legacy-data promotion, FZ6 change,
catalogue change, production profile or Rider Service Core projection occurred.
NEXT: bounded FZ1 source-authentication/research planning.

## 2026-09-07 — Verified Supabase local clean replay

Recorded two successful clean local replays of the normalized three-migration
chain on PostgreSQL 17 from fresh local state. All migrations applied in order;
`supabase migration list --local` showed all three versions and
`supabase db lint --local` returned `No schema errors found`. Read-only local
inspection matched the supplied production runtime schema for columns,
defaults/nullability, primary keys, unique and foreign-key constraints, RLS and
all eight ownership policies, including semantic ownership checks. No
`supabase/seed.sql` exists or was required. Production migration history was
not changed and remains unreconciled; no production migration command was
executed. NEXT: prepare a read-only production history-reconciliation plan.

## 2026-09-07 — Supabase migration identifier normalization

Normalized the repository migration chain to unique 14-digit Supabase timestamp
identifiers without changing SQL: `20260828000000_create_runtime_tables.sql`,
`20260829000000_add_technical_clarification.sql` and
`20260903170109_ownership_rls_live_parity_hardening.sql`. The first two
identifiers extend the repository’s established chronology as ordering values
only and do not claim historical production execution. The ownership migration
uses the exact authoritative live version/name after semantic equivalence was
verified. Focused deterministic tests cover format, uniqueness, ordering and
preserved ownership between layers. No live history, database, runtime or
production data changed. NEXT: validate clean replay before considering any
history-only production reconciliation.

## 2026-09-07 — Supabase clean-baseline foundation

Added the earliest ordered repository migration for the verified `motorcycles`
and `service_records` table foundations, preserving the later ownership/RLS and
technical-clarification migrations as separate incremental layers. Added
deterministic focused tests for migration order, column ownership, the runtime
schema contract and preservation of existing hardening semantics. Updated the
reproducibility audit to distinguish repository foundation, supplied live facts
and external configuration. Clean-project replay remains unproven because no
disposable Supabase/Postgres environment was used; no live database, runtime or
production data changed. NEXT: validate migration replay in a clean disposable
environment.

## 2026-09-07 — Leaked-password protection plan blocker

Recorded the verified live Supabase finding for project `vfr-master`: Auth >
Attack Protection > Prevent use of leaked passwords is disabled, and Supabase
states that the setting is available only on Pro plan and above. The protection
is therefore externally blocked by the current Free plan, not an unresolved
repository defect. No application runtime, password policy, Supabase
configuration or deployment/recovery behavior changed. NEXT: deployment/recovery
hardening as the next separately bounded task.

## 2026-09-04 — Correct Rider Core applicability projection

Corrected field-level Rider Service Core projection so unresolved ABS and
regional alternatives become explicit `blocked-applicability` cells instead
of being merged behind a resolved candidate. VFR PGM-FI remains visible with
its own provenance while standard/ABS fuse rows are selected only for known
context; regional headlight and JP-only Dual CBS remain fail-closed. Valve
standard/VTEC values are labelled separately and the universal standard spark
plug remains unaffected by the cold-climate alternative. VFR Core recalculates
to 32 verified / 60 missing / 3 blocked / 0 not-applicable across the frozen
95 fields; Ducati remains semantically unchanged with 45 canonical entries.
Canonical profiles, registry identity and the 95-field matrix were unchanged.
Targeted Node/browser tests, syntax checks and diff checks passed. No context
fields, research data, evidence or production values were added or changed.

## 2026-09-03 — Recover verified VFR Rider Core mappings

Recovered existing verified Honda VFR800 MY2002 canonical fuse and rear
stop/tail-light records into the frozen 95-field presentation matrix through
deterministic aliases and lossless field-specific aggregation. Main fuse
ratings/locations and PGM-FI circuit data remain associated; market-specific
headlight data remains `Brak danych` without a proven region. No new research,
matrix expansion, canonical value/profile change or Ducati change occurred.
Phase 7 remains ACTIVE.

## 2026-09-03 — Triumph Street Triple 765 III prospect registration and readiness

Selected representative MY2023 EU `triumph.street-triple.765-3` standard/base road scope. Authenticated Triumph's official Tier A `3850186_2-EN` owner handbook (issue 2, June 2023) through the controlled handbook library/API, but the handbook combines Street Triple S 660, R, R LRH and RS and its global EN record does not safely resolve EU market or base/R/RS equipment applicability. Canonical readiness remains `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`; no technical values, extraction, evidence, coverage, production or runtime changes occurred. NEXT: resolve only the remaining applicability metadata.

## 2026-09-03 — BMW F 900 R I evidence processing projection

Fed exactly the 13 existing BMW Human Review Decisions and their Review Queue entries through the canonical Evidence Processing contract. Produced 13 records: 11 `ACCEPTED-FOR-PROCESSING` and 2 `CANNOT-ADVANCE` records for the processor-detected same-field solo tire-pressure raw-value disagreement. Raw values, units, applicability, provenance and upstream decisions remained unchanged; no conflict was resolved, no evidence rows were created, Service Core stayed 0/44, and production was unchanged. NEXT: hold these pre-promotion records and conflicts.

## 2026-09-03 — BMW F 900 R I human review of queued raw candidates

Ran exactly the 13 existing BMW Review Queue entries through the canonical Human Review Decisions contract. All 13 received explicit `ACCEPT` decisions based on direct source support and preserved raw values, units, applicability, and page/section provenance; no normalization or conflict resolution occurred. Evidence rows and Service Core coverage remained 0/44, and production was unchanged. NEXT: separate Evidence Processing only.

## 2026-09-03 — BMW F 900 R I rider-manual acquisition and raw extraction

Reused the authenticated BMW Tier A `F_0K11_RM_0520_76.pdf` prospect and confirmed the exact MY2020 EU F 900 R 0K11 source before inspection. Through the existing Factory execution, extraction and Review Queue contracts, produced and queued 13 immutable raw candidates from directly attributable owner-level and technical-data excerpts. Preserved raw values, units, PDF page/section provenance, extraction method and explicit base-road/manual/ABS applicability; excluded A2 0K31 and F 900 XR. No ambiguous/conflicting candidates, evidence, Service Core coverage or production changes. NEXT: bounded human review only.

## 2026-09-03 — BMW F 900 R I prospect registration and readiness

Selected representative MY2020 EU `bmw.f-roadster-xr.f900r-1` standard road scope with manual transmission and ABS. Authenticated the official BMW Motorrad Tier A rider manual `F_0K11_RM_0520_76.pdf` for base F 900 R model code 0K11; the manual's separately identified F 900 R A2 0K31 variant, F 900 XR and unrelated BMW models remain out of scope. Canonical readiness is `EXECUTION-READY`. No technical values, candidates, queue entries, decisions, processing records, evidence, coverage, production, runtime, catalogue or cloud state changed. NEXT: bounded acquisition only under this exact scope.

## 2026-09-03 — Kawasaki Ninja 650 II prospect registration and readiness

Selected representative MY2020 EU `kawasaki.ninja-650.gen2` standard road scope with manual transmission and ABS. Kawasaki Europe’s official owner-manual route and 2020 EU model context were checked; the owner-manual portal redirected in a loop and did not expose an exact EU MY2020 Tier A/B document identity. Canonical readiness is `ACCESS-BLOCKED` with source year/market binding and feasible full-content access unresolved. No technical values, candidates, queue entries, decisions, processing records, evidence, coverage, production, runtime, catalogue or cloud state changed. NEXT: revisit only with genuinely new Kawasaki-controlled exact-source metadata.

## 2026-09-03 — Ducati Monster 937 MY2021 EU owner-manual acquisition

Reused `unknown.ducati.monster937` and confirmed the Ducati-controlled `OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf` before extraction. Kept only common base Monster 937 scope for MY2021 EU manual transmission with ABS; Monster SP was excluded and no second primary or Tier C/D source was used. Extracted 27 immutable, unnormalized raw Service Core candidates with printed-page/section provenance. All remain queued because no human review decision was created: accepted 0, rejected 0, needs-review decisions 0, queued 27, evidence rows 0. Service Core stayed 0/44 before and after; practical/generic gain 0; conflicts and ambiguous fields 0; production unchanged. Next: bounded human review only.

## 2026-09-03 — Ducati Monster 937 Tier A/B prospect registration and readiness

Objective: register one exact Tier A/B Ducati prospect for `ducati.monster.937` without technical extraction. Authenticated `unknown.ducati.monster937` as the official `Monster 937 Owner's Manual` route for representative MY2021 EU base Monster 937; Monster SP 937 is excluded, and Ducati metadata resolves Cornering ABS and manual six-speed transmission applicability. Canonical readiness passes at metadata level. No manual content or technical values were inspected; no evidence, researched-no-evidence, Service Core coverage, production, runtime, catalogue or cloud state changed. Validation: targeted registration/readiness tests, project-state checks, changed-file syntax checks and `git diff --check`; no Phase 6 work. Next: execute one bounded Ducati owner-manual acquisition under this exact scope.

## 2026-09-03 — Suzuki SV650 III Tier A/B prospect selection and readiness

Selected the existing `unknown.suzuki.sv650` prospect for representative EU `SV650A L9` MY2019 and authenticated Suzuki’s official European `SV650/A/XA (L7-M4)` service-manual family as Tier A metadata. The official portal path is known and content remains inaccessible. Exact year/document binding, EU scope, standard-versus-X equipment, ABS separability and manual-transmission applicability remain incomplete; readiness is fail-closed and not execution-ready. No service values, extraction, evidence, researched-no-evidence, coverage, production, runtime, catalogue or cloud changes occurred. Validation: targeted tests and project-state checks pass; full suite, syntax and diff checks follow. Next: resolve Suzuki applicability only if new authenticated material/access becomes available.

## 2026-09-03 — Ténéré BW3-F8197-E0 public applicability path exhaustion (current)

Recorded `TENERE-APPLICABILITY-AUTHENTICATION-PATH-EXHAUSTED` on the existing prospect after the bounded public metadata path yielded no authoritative resolution. Preserved `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`, `authenticityVerified: true`, `contentAccessible: false`, canonical readiness blocked, and unresolved MY2019, EU, standard/named-equipment, ABS and manual-transmission dimensions. Further repetition is not justified without genuinely new Yamaha-controlled material or authenticated RMI/manual access. No external research, technical inspection, acquisition, downstream records, evidence, researched-no-evidence, coverage, production, runtime, catalogue or cloud changes occurred. Next: do not repeat public applicability authentication; continue Phase 5 through another bounded research-factory task.

## 2026-09-03 — Ténéré BW3-F8197-E0 source authentication (current)

Objective: authenticate only the registered Yamaha Ténéré service prospect for MY2019 EU standard without inspecting service values or creating evidence. Authenticated the prospect’s own 2020 Ténéré 700 / XTZ690 / XTZ690-U service-publication metadata and recorded Yamaha-controlled RMI subscription and dealer-delivery routes. Exact MY2019 EU standard scope, ABS, manual transmission and named-equipment boundaries remain unresolved; final classification is `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`, canonical readiness is blocked, and content remains inaccessible. No technical values, candidates, queue records, decisions, processing records, evidence, researched-no-evidence, coverage, production, runtime, catalogue or cloud state changed. Validation: targeted authentication and related Factory tests 62/62, syntax checks, `git diff --check`, deterministic reports and project-state consistency. Next: resolve only the remaining applicability metadata.

## 2026-09-03 — Technical Research Factory Ténéré Interrupted/Resumed Batch Pilot Design (current)

Objective: design, without executing, the bounded Ténéré pilot over completed research-only Factory layers. Fixed target `yamaha.tenere-700.gen1` MY2019 EU standard and prospect `BW3-F8197-E0`; preserved real readiness as `REGISTERED-NOT-REAUTHENTICATED`; defined one target/work/attempt budget, pause after acquisition, checkpoint validation, resume equivalence and duplicate prevention; and added a synthetic/local traversal through acquisition, extraction, Review Queue, Human Review Decisions and Evidence Processing. No authentication, external access, technical inspection, evidence, coverage, readiness, production or retry changes occurred. Validation: targeted Ténéré pilot tests 8/8, project-state tests 6/6, full suite 587/587, syntax checks, diff check and deterministic memory/report checks. Audit: `ACCEPT-WITH-RISKS`; real execution remains gated. Next: authenticate only the existing BW3-F8197-E0 prospect without inspecting service values.

## 2026-09-03 — Technical Research Factory Evidence-Processing Contract Foundation (current)

Objective: create the smallest explicit pre-promotion boundary over immutable Human Review Decisions. Added schema 1 processing states, deterministic IDs/order, queue-bound provenance validation, raw candidate preservation, typed ineligibility, unresolved accepted-candidate disagreement handling, immutable outputs and deterministic reporting. No evidence, normalization, conflict resolution, researched-no-evidence, promotion, retries, Orchestrator events or production behavior were added. Validation: targeted Evidence Processing tests 12/12, Human Review Decisions 22/22, Review Queue 23/23, Extraction Agent 23/23, full suite 579/579, syntax checks, diff check and deterministic memory/report checks. Audit: `ACCEPT-WITH-RISKS`; persistence and later evidence promotion remain NOT STARTED. Next: bounded interrupted/resumed Ténéré Batch Pilot design.

## 2026-09-02 — Technical Research Factory Human Review Decisions Foundation (current)

Objective: add explicit immutable human outcomes over valid Review Queue entries while stopping before evidence processing. Added Decision schema 1 with closed `ACCEPT`/`REJECT`/`NEEDS-MORE-REVIEW` vocabulary; opaque caller-supplied reviewer identity; optional raw identity-neutral comments; canonical queue/candidate/extraction/acquisition provenance; semantic IDs/order; exact-duplicate idempotency; and fail-closed conflicting decisions. Multiple accepted competing candidates coexist without normalization or resolution. No evidence, researched-no-evidence, conflict resolution, persistence, routing, Orchestrator events, retries or production behavior were added. Validation: targeted decisions tests 22/22, Review Queue 23/23, Extraction Agent 23/23, related Factory 132/132, full suite 567/567 with zero failures/skips/todos, changed JavaScript syntax checks, clean diff check, and byte-identical decisions/project-state report regeneration. Audit: `ACCEPT-WITH-RISKS`; reviewer authentication, supersession and evidence processing remain NOT STARTED. Next: separate bounded evidence-processing design.

## 2026-09-02 — Technical Research Factory Review Queue Foundation (current)

Objective: create the deterministic pre-decision boundary from raw Extraction Agent output to future human review. Added Review Queue schema 1 entries and ineligibility contracts; one immutable `QUEUED` entry per raw candidate; complete canonical provenance and raw-data preservation; semantic IDs and ordering; exact-duplicate collapse with collision rejection; and fail-closed handling for zero candidates, unsupported media, incomplete provenance, integrity mismatch and extractor failures. No human decisions, evidence conversion, normalization, conflict resolution, researched-no-evidence, persistence, Orchestrator events, acquisition changes or production behavior were added. Validation: targeted Review Queue tests 23/23, related Factory tests 110/110, full suite 545/545 with zero failures/skips/todos, changed JavaScript syntax checks, clean diff check, and byte-identical Review Queue/project-state report regeneration. Audit: `ACCEPT-WITH-RISKS`; queue values remain in-memory, and Human Review Decisions remain NOT STARTED. Next: separate bounded Human Review Decisions design.

## 2026-09-02 — Technical Research Factory Extraction Agent / Local Extractor Adapter Foundation (current)

Objective: create the first safe boundary from an acquired artifact to machine-produced raw technical candidates. Added versioned content-envelope, extractor-declaration, raw-candidate, observation and result contracts; deterministic local/synthetic adapters; content digest/length/media binding; canonical ownership resolution; immutable raw value/unit/location/applicability preservation; deterministic candidate IDs/order; and checkpoint-replay equality. Extraction neither changes acquisition state nor produces evidence/review decisions. Validation: targeted Extraction Agent tests 23/23, related Factory tests 87/87, full suite 522/522 with zero failures/skips/todos, changed JavaScript syntax checks, clean diff check, and byte-identical Extraction Agent/project-state report regeneration. Audit: `ACCEPT-WITH-RISKS`; only synthetic UTF-8 content is supported, persistence/normalization/review are deferred, and Review Queue remains NOT STARTED. Next: separate bounded Review Queue Foundation.

## 2026-09-02 — Project-state audit determinism repair

Objective: remove self-referential and moving-ref Git metadata from the generated Execution Agent project-state snapshot. The snapshot convention now derives the completed wave's containing commit from its implementation file, uses that commit's first parent as `baseCommit`, and records only the stable commit distance between them, so later memory-only commits and push/fetch operations do not alter regeneration. The canonical test verifies both the Git relationship and byte-for-byte report regeneration. No application, production, Research Factory, Extraction Agent or Review Queue behavior changed. The Execution Agent remains the latest completed Research Factory wave.

## 2026-09-01 — Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation (`45f83a4`)

Objective: execute already-planned canonical source work through a bounded, non-production adapter boundary. Completed in commit `45f83a46a77e43f33612432e9ae7007980f57256`: execution schema 1 contracts for acquisition requests, outcomes, artifacts, observations and results; deterministic synthetic adapters for all ten closed outcomes; untrusted-output validation; and canonical Orchestrator attempt-event mapping with checkpoint-safe replay. Batch identity derives through canonical `TargetWork.batchId` because `SourceWorkItem` has no parallel batch ID, and `PERMANENT-FAILURE` immediately exhausts the work item. Validation: targeted tests 18/18, full suite 498/498 with zero failures/skips/todos, `node --check` 9/9, `git diff --check` clean, and deterministic execution-report regeneration byte-for-byte identical. No push, external research, evidence, production change, Extraction Agent work or Review Queue work occurred. Audit: `ACCEPT-WITH-RISKS`; production adapters and extraction/review remain separate future work. Next: bounded Extraction / Review Queue Foundation.

## 2026-09-01 — Technical Research Factory Execution Planner

Objective: translate canonical gaps and prospects into bounded work without executing research. Added planner schema 1 PlanningPolicy, SourceCapability, PlanningDecision and ExecutionPlan contracts; semantic policy IDs; explicit source-to-Service-Core field capability; deterministic safety/practical/class/tier/coverage/cost ranking; typed planned/deferred/rejected/blocked/not-needed reasons; duplicate elimination; and finite per-target/per-batch work/attempt packing. Output is existing Orchestrator ResearchBatch/TargetWork/SourceWorkItem data and replays directly. Existing Honda/Yamaha/VFR remain deferred, Harley rejected and Ténéré blocked; only a synthetic local ready fixture plans. Audit: `ACCEPT-WITH-RISKS` because capability provenance and typed execution-result ingestion remain future layers. Next: bounded Execution Agent / Source Acquisition Adapter Foundation.

## 2026-09-01 — Technical Research Factory Orchestrator Foundation (current)

Objective: add bounded, resumable state machinery without research execution. Added orchestration schema 1 contracts for ResearchBatch, TargetWork, SourceWorkItem, ResearchAttempt, ResearchEvent, ResearchSnapshot and Checkpoint; SHA-256 semantic identities with no clock/random dependency; immutable JSON-only append events; a pure deterministic reducer; explicit batch/work/attempt state machines; bounded retries and exhaustion; and digest/version-verified checkpoint resume. Existing Honda/Yamaha exhausted, Harley rejected-mismatch and Ténéré blocked fixtures traverse Foundation #1 readiness without mutation or promotion. Audit: `ACCEPT-WITH-RISKS` because durable event storage, planning and typed external-result ingestion remain deferred. Next: bounded Execution Planner from canonical GapPlans and SourceProspects only.

## 2026-09-01 — Technical Research Factory Foundation #1 (current)

Objective: implement the first bounded factory layer without research or production changes. Added versioned manufacturer-neutral ResearchTarget, SourceProspect, ApplicabilityScope and GapPlan contracts/validators; canonical dimension-level fail-closed applicability and ADR-012 readiness gates; deterministic serialization; and non-mutating adapters for current target, prospect and acquired-source shapes. Real Honda, Yamaha, Harley mismatch and Ténéré blocked fixtures now exercise the API. GapPlan reuses the canonical 44-field Service Core and preserves missing/no-evidence/conflict semantics. Audit: `ACCEPT-WITH-RISKS` because historical gates remain behind compatibility adapters and no orchestrator/live migration exists. Ténéré `BW3-F8197-E0` remains unauthenticated and a factory-pilot candidate. Next: bounded Orchestrator Foundation with append-only events, reducer/snapshots, budgets and resume tests.

## 2026-09-01 — Technical Research Factory architecture and gap audit (current)

Objective: determine exactly what remains before RevLog can run safe, repeatable catalogue-scale technical-research batches without handcrafted per-model workflows. Reconstructed the implemented pipeline and classified its capabilities; designed machine-readable manufacturer-neutral target, prospect, applicability, gap, work-item, evidence and review contracts; separated discovery/authentication/acquisition/extraction; specified canonical fail-closed gates, bounded budgets, exhaustion, event/checkpoint state, scheduling and five implementation waves. Audit: `ACCEPT-WITH-RISKS`; the current system has reusable primitives but lacks integrated orchestration and resumability. Ténéré `BW3-F8197-E0` remains unmodified as a future factory-pilot candidate. No external motorcycle research, technical evidence, coverage, production, runtime/browser, catalogue, cloud-backend or VFR800 data changed. Next: bounded Factory Foundation contracts and canonical gates.

## 2026-09-01 — Yamaha MT-09 publication-code and EU-market reconciliation (current)

Objective: resolve or fail closed on `B7N-28197-E0` versus `LIT-11616-34-61` for MY2021 EU standard MT-09 using Yamaha-controlled metadata only. Result: `RELATIONSHIP-UNRESOLVED`, `ACCESS-BLOCKED`, and `MT09-AUTHENTICATION-PATH-EXHAUSTED`. LIT remains authenticated for North-American MY2021 MT-09/MT-09 SP; Yamaha Europe proves `MTN890` = standard and `MTN890D` = SP; no official B7N record, EU path or code relationship was found. Audit: `ACCEPT-WITH-RISKS`. No technical values, evidence, researched-no-evidence states, coverage, production, runtime/browser, catalogue, Supabase or VFR800 data changed. Next: authenticate only registered Ténéré service prospect `BW3-F8197-E0`.

## 2026-09-01 — Yamaha MT-09 service-manual prospect authentication (current)

Objective: determine whether `B7N-28197-E0` / `LIT-11616-34-61` is execution-ready for MY2021 EU standard MT-09 extraction without inspecting technical values. Completed: reproduced owner-manual 0/44→29/44 (+29 verified/+27 practical/+2 generic); authenticated the Yamaha US LIT identity and purchase/authenticated delivery route; preserved B7N as mirror-only because no Yamaha-controlled EU path or B7N/LIT alias proof was found. MY2021 EU, standard/SP separability and ABS/equipment scope remain unresolved. Final prospect classification: `ACCESS-BLOCKED`; readiness failed. Independent audit: `ACCEPT-WITH-RISKS`. No evidence, researched-no-evidence state, Service Core coverage, production, runtime/browser, catalogue, Supabase or VFR800 data changed. Next: bounded Yamaha-controlled B7N/LIT publication-code and EU-market reconciliation only.

## 2026-09-01 — Source-prospect authentication-quality reassessment (current)

Objective: separate registered Tier A/B URLs from execution-ready prospects before another acquisition. Completed: reproduced the Harley 0/44→0/44 REJECT; defined a deterministic all-fields readiness gate; inventoried 17 records across eight manufacturers; kept UNKNOWN, partial, blocked, exhausted and mismatch sources unranked. No prospect is execution-ready and no third-manufacturer source is ready. Harley `94001064` is current MY2023 metadata and REJECTED-MISMATCH for MY2022; the historical design is explicitly superseded. The closest prospect is Yamaha MT-09 service manual `B7N-28197-E0` / `LIT-11616-34-61`, but it lacks a stored official delivery path and resolved EU/US-code, standard/SP and safety scope. Audit: ACCEPT-WITH-RISKS. No technical evidence, Service Core coverage, production, runtime/browser, catalogue, Supabase or VFR800 data changed. Next: one-prospect MT-09 source registration/authentication only.

## 2026-09-01 — Harley-Davidson transfer acquisition execution (current)

Objective: test the single registered official owner-manual prospect `94001064` for MY2022 USA Sportster S/RH1250S under a one-document gate. Result: authentication stopped extraction. Harley-Davidson official indexed content identifies `94001064` as the MY2023 Sportster RH Models owner manual; official parts indexing maps it to RH1250S, but that does not establish MY2022 applicability, and the official content endpoint returned HTTP 403. No substitute source was used. Coverage stayed 0/44; verified/practical/generic gains were 0/0/0, no researched-no-evidence rows were claimed, conflicts and Tier C/D contribution were zero, and budget was 1/1. Fixed +8/+6 gates failed; transfer interpretation failed; independent audit REJECT. Production, runtime/browser, catalogue, Supabase and VFR800 were unchanged. Next: bounded source-prospect authentication-quality reassessment before another acquisition.

## 2026-08-31 — Post-Yamaha transfer-batch design (current)

Objective: select the next bounded acquisition batch using measured Honda/Yamaha yield and repository-known source prospects only. Completed: reproduced Honda +50 verified/+48 practical from two yielding documents and Yamaha +58/+54 from two; evaluated ten serious candidates across eight manufacturers with a risk-adjusted marginal-practical-yield model; kept five UNKNOWN prospects unranked. Selected one new-manufacturer target, `harley-davidson.revolution-max.sportster-s` MY2022 USA, against registered official owner manual `94001064`. The execution budget is one primary document with +8 verified/+6 practical gates and mandatory publication/model/ABS/equipment authentication. A Honda/Yamaha control was rejected because four successful owner manuals already establish the process baseline. Independent audit: ACCEPT-WITH-RISKS due unreauthenticated exact model inclusion, absent stored pages and wide 6–18 expected practical range. No external evidence, research rows, coverage, production, runtime, catalogue, Supabase or VFR800 data changed. Next: execute the bounded one-target Harley transfer batch.

## 2026-08-31 — Yamaha transfer acquisition execution (current)

Objective: test whether the Honda service-rich owner-manual strategy transfers to the fixed Yamaha MT-09 MY2021 EU standard and Ténéré 700 MY2019 EU standard targets. Completed: authenticated official Yamaha Europe publications `B7N-28199-E0` and `BW3-F8199-E0`; one unique Tier A document per target produced 58 evidence rows and 58 new Service Core slots, including 54 practical and four generic tire-size slots. Each target moved 0/44→29/44 with +27 practical. ABS `true`, manual transmission, standard equipment, unloaded chain measurement, cold solo/two-person pressures and Ténéré road/off-road distinctions remain explicit. No conflict, duplicate, Tier C/D contribution or budget overrun occurred; only 2/4 primary documents were used. Independent audit: ACCEPT-WITH-RISKS because the preselected rich manuals cover one year each and prove transfer only to Yamaha, not broad manufacturer scaling. Production, runtime, catalogue, Supabase and VFR800 were unchanged. Next: design a bounded post-Yamaha transfer batch without acquiring evidence.

## 2026-08-31 — Post-pilot scaling reassessment (current)

Objective: use the executed pilot to design, but not run, the next Phase 5 acquisition batch. Completed: independently reproduced 51/220→101/220, +50 verified/+48 practical/+2 generic, five Tier A documents, two yielding, 52 rows and zero conflicts; analyzed all five target outcomes; introduced a transparent practical-yield heuristic where unknown Tier A/B prospects remain unranked; evaluated ten candidates across seven manufacturers. Selected a two-target single-manufacturer Yamaha transfer batch: MT-09 III MY2021 EU standard and Ténéré 700 I MY2019 EU standard, both 0/44, with expected 36–48 combined practical slots, +24 verified/+22 practical acceptance gates and a maximum of two primary documents per target. Audit: ACCEPT-WITH-RISKS because only Yamaha transfer is tested, research-key/catalogue-key reconciliation is required, and each source edition covers one year rather than its full catalogue generation. No evidence, catalogue, production, runtime or VFR800 data changed. Next: execute the bounded Yamaha batch.

## 2026-08-31 — High-value source-acquisition pilot execution (current)

Objective: execute the bounded five-Honda-target owner/service-source pilot without production promotion. Completed: inspected five unique Tier A documents at six hosting locations; deduplicated the CBR600RR PDF/HTML locations; produced 52 evidence rows and 50 new target slots, of which 48 are practical-service and two are generic idle-speed fields; coverage moved 51/220→101/220. NC750X moved 3→28 and CBR600RR 4→29; CBR500R remained 26, VFR800 13 and Africa Twin 5. Manual/DCT oil values are explicitly scoped. No conflict or source-budget overrun occurred. Independent audit: ACCEPT-WITH-RISKS because NC750X MY2024, CBR600RR MY2025, VFR manual identity and Africa Twin EU/UK standard applicability remain unresolved. Production and the VFR production profile were unchanged. Next: bounded Phase 5 scaling reassessment.

## 2026-08-30 — Catalogue completeness checkpoint (current)

Objective: correct project memory so catalogue infrastructure maturity is not confused with global content completeness. Verified current inventory (13 manufacturers, 318 families, 1,095 variants, 5,317 variant-years) and history: Triumph Wave 2 is the latest completed catalogue expansion before research/tooling work. Added the future Global Catalogue Gap / Coverage Audit to roadmap and backlog while preserving NEXT 1 high-value service-data pilot. No catalogue content changed.

## 2026-08-30 — High-value source-acquisition pilot design (current)

Objective: design, but not execute, the bounded NEXT 1 pilot after the low practical yield of Honda Batch Wave 2. Completed: five existing Honda targets selected, Tier A/B-first source order, practical/generic field classification, minimum 10 practical and 15 total verified-slot thresholds, stop conditions and execution/audit contract. No documents or evidence were acquired. Next: execute the pilot in a separate bounded task.

## 2026-08-30 — Audit Standard and remanent correction audit (current)

Objective: independently falsify the project-memory remanent and evaluate Honda Batch Wave 2. Completed: verified 8-target Honda Service population versus 12-target batch population; confirmed 51/352 applies only to the 8-target Service Data Wave; independently recomputed 528 slots, 51→57, six rows, six documents, seven hosting locations and zero conflicts. All six gains were engine configuration/displacement; practical-service gain was zero. The previous `100% verification yield` is retained only as row yield and is now supplemented by slot/practical metrics. The 8→6 document expectation is justified by mirror/document identity; the earlier 62→49 queue expectation is justified for the two-target fixture (the 12-target queue is 471). Page numbering is 1-based, so `!candidate.page` correctly rejects page 0. Result: ACCEPT-WITH-RISKS; scaling is premature. Next: design a bounded high-value source-acquisition pilot.

## 2026-08-30 — Honda batch Wave 2 (`ea03911`)

Objective: exercise scalable research across many Honda targets. Completed: 12-target batch, official-source reuse, six new verified Service Core slots, deterministic report/review queue. Checks: 378-test suite passed. Unresolved: most targets remain partial or research-more. Next: bounded multi-manufacturer pilot.

## 2026-08-30 — Generic batch pipeline (`fe2df11`)

Objective: replace bespoke model-by-model research mechanics. Completed: generic proof/acquisition policy, document registry/deduplication, extraction validation, applicability, normalization, comparison, conflicts, target generation, gaps, priority, queue and report. Checks: 374 tests passed. Next: run a real batch.

## 2026-08-30 — VFR gap matrix (`a69191f`, `7f8d406`)

Objective: fingerprint blocked VFR manual content and make all 44 Service Core gaps explicit. Completed: 24 uncertain manual rows and seven unresearched fields represented without promotion. Checks: VFR tests and full suite passed. Next: stop single-bike hunting and scale.

## 2026-08-30 — VFR source/provenance audits (`a60cf26`, `edac48a`, `a9fa8e1`)

Objective: reconcile production citations and manual acquisition semantics. Completed: production remained read-only; uncertain publication identity and metadata-only states were preserved. Next: independent multi-source recovery or generic tooling.

## 2026-08-30 — VFR reconciliation and Honda acquisition (`f5acf81`, `2fc3a98`)

Objective: connect production discovery citations to research without circular verification. Completed: VFR evidence reduced to independently valid rows; CBR500R acquisition and source attempts recorded. Next: evidence expansion.

## 2026-08-30 — Honda research foundation (`1db7d6d`, `60692a7`)

Objective: establish Honda Service Data Wave 1 and correct status semantics. Completed: canonical Service Core, target matrix, provenance, missing-data distinction and deterministic reports. Next: acquire stronger service/OEM evidence.

## Prior published catalogue/release work (`49a17a7`, `97f0811`, `582cbd0`, `6e41ec7`, `80e669f`)

Objective: publish RevLog 0.2/0.3 and expand audited Ducati/Triumph/Honda-era catalogue coverage. Result: current catalogue foundation and release history. Unresolved: catalogue scope is not worldwide-complete.
## 2026-09-03 — Triumph Street Triple 765 III applicability metadata resolution

Objective: resolve only EU, equipment, catalogue-key, ABS and transmission applicability for the authenticated MY2023 Triumph handbook. Bounded Triumph-controlled metadata confirmed ABS/manual dimensions but left EU binding, base/R/R LRH/RS separation and safe catalogue-key mapping unresolved because `3850186_2-EN` combines those equipment identities and is recorded as global EN. Canonical readiness remains `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL` and fail-closed. No technical values, candidates, evidence, coverage, production, runtime or catalogue state changed. Next: obtain genuinely new controlled applicability metadata only; do not acquire or inspect handbook content while unresolved.
## 2026-09-03 — Post-BMW/Triumph Phase 5 research reassessment

Objective: reassess only repository-known prospects after the completed BMW and Triumph waves. Reviewed 18 records using existing metadata: 2 held pre-promotion, 4 access-blocked, 2 applicability-blocked, 6 exhausted, 2 mismatched and 2 explicitly deferred. No viable candidate remained and no next target was selected. No external research, technical inspection, acquisition, downstream processing, evidence, coverage, production or catalogue change occurred. Next: keep Phase 5 paused until a genuinely new eligible prospect is recorded.
## 2026-09-03 — Controlled production promotion contract and safety gate foundation

Objective: create the smallest generic Phase 6 boundary before any production promotion. Added immutable `PromotionPacket/v1`, deterministic semantic IDs and a fail-closed readiness gate requiring accepted processing, no conflict, exact target/applicability, complete source/provenance, sufficient raw context and explicit Human Review ACCEPT. Rejected/non-accepted states, unresolved conflicts and insufficient scope remain blocked. Synthetic tests only; no Ducati/BMW state, evidence rows, Service Core coverage, Technical Profile, registry, runtime or catalogue state changed. Next: bounded promotion projection design only after explicit authorization and held-record review.
## 2026-09-03 — Held Ducati/BMW read-only promotion projection

Objective: project the existing held Ducati/BMW Evidence Processing records through the Phase 6 readiness gate without promotion. All 27 Ducati records were independently `PROMOTION-READY`; BMW produced 11 `PROMOTION-READY` and 2 `BLOCKED` records, with both unresolved tire-pressure conflicts retained and grouped by processing/conflict reasons. Every upstream record was represented exactly once, with raw values, units, provenance and applicability unchanged. No evidence, coverage, production, registry, runtime or catalogue state changed. Next: keep the projection and held records unchanged until a separately authorized promotion-conversion task.
## 2026-09-03 — Promotion review packet foundation and held-record projection

Objective: add the immutable manufacturer-neutral `PromotionReviewPacket/v1` foundation before any schema conversion. Only `PROMOTION-READY` records can become `PENDING-PROMOTION-REVIEW`; no APPROVED, REJECTED or NEEDS-PROMOTION-REVIEW decisions are created. Read-only held-record projection derives 27 Ducati and 11 BMW eligible packets and excludes both BMW conflicts. Research Human Review ACCEPT was not treated as promotion approval; upstream and production state remained unchanged. Next: keep packets pending until a separately authorized human promotion-review decision.
## 2026-09-03 — First explicit Ducati promotion-review decision batch

Objective: review exactly seven existing Ducati `PENDING-PROMOTION-REVIEW` packets. Each received one explicit `APPROVED-FOR-CONVERSION` decision with rationale based on existing exact field identity, raw value, provenance and applicability; 20 Ducati packets remain pending. Research Human Review ACCEPT was not reused as promotion approval. No BMW records were reviewed, conflicts were resolved, schema conversion, evidence, coverage, production, registry, runtime or catalogue state changed. Next: keep decisions pre-conversion and separately authorize any future schema-conversion task.
## 2026-09-03 — Ducati seven-field schema-conversion projection

Objective: audit exactly seven approved Ducati promotion-review decisions against the existing Technical Profile schema without creating production data. Four mappings are lossless projections: spark plug, viscosity, API/JASO specification and brake fluid. Cooling capacity is blocked because “cooling circuit” is not proven equivalent to the narrower engine/radiator field; both battery fields are blocked because the existing schema lacks a lossless standalone pair without merging. No profile, registry, evidence, coverage or upstream state changed. Next: keep projection read-only; separately authorize any future citation/materialization and conversion work.
## 2026-09-03 — Ducati schema-conversion projection resolution and closeout

Objective: resolve only the prior battery and cooling conversion blockers using current repository schema/runtime evidence. Accepted a distinct `electrical.battery.capacity` stable semantic entry with `specification` / `{ type: "quantity", amount: 6.5, unit: "Ah" }`; retained `electrical.battery.specification` as `consumable-part` with exact text. Cooling remains blocked by `COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR`. Final projection is 6 ready / 1 blocked; no production profile, citation, registry, evidence, coverage or upstream state changed. Next: keep projection read-only and separately authorize any future materialization/conversion task.
## 2026-09-03 — Ducati production-promotion authorization gate foundation

Added the generic immutable fail-closed authorization contract and read-only Ducati projection. Exactly six `CONVERSION-READY` schema projections are `AUTHORIZATION-READY`; cooling remains excluded at conversion. The gate preserves the full identity/provenance/applicability chain and records future production document, citation, profile and registry materialization as separate requirements. No production or upstream research state changed. Next: separately authorize a bounded materialization task only after human confirmation.
## 2026-09-03 — Ducati production document/citation materialization foundation

Added one production-compatible authenticated Ducati MY2021 EU owner-manual definition and six deterministic citations for the authorization-ready fields. The definitions are not attached to a Technical Profile and create no entries, registry insertion, evidence or coverage. Cooling, pending Ducati fields and BMW remain excluded. Next: keep source definitions separate until a future bounded profile materialization task is explicitly authorized.
## 2026-09-03 — Ducati Monster 937 six-entry production profile materialization

Created the single valid `revlog-technical-profile/v1` Ducati Monster 937 MY2021 EU review-status profile with exactly six verified citation-backed entries, importing the existing Ducati source graph. The profile remains deliberately absent from `technical-profile-registry`; runtime discovery, evidence, coverage and BMW state are unchanged. Phase 6 is now active but incomplete. Next: separately authorize registry insertion and production discovery validation.
## 2026-09-03 — Ducati Monster 937 production registry insertion

Registered exactly one existing Ducati Monster 937 MY2021 profile descriptor for catalogue key `ducati.monster.937`, preserving the VFR descriptor and registry uniqueness. Normal registry discovery, loader validation and resolver paths now succeed for the six verified entries. Cooling, pending Ducati fields, BMW, source citations/documents, evidence and Service Core coverage remain unchanged. Phase 6 remains active after the first bounded production registry promotion.
## 2026-09-03 — Phase 6 completion audit and Phase 7 transition

Audited the explicit Phase 6 exit criteria: one deliberate production profile addition, production discovery/resolver/runtime regressions, and a deterministic rollback target. All three are satisfied by existing repository evidence; pending Ducati/BMW work and cooling are optional future expansions and do not block closeout. Phase 6 is now COMPLETE and Phase 7 is ACTIVE as a project-state transition only. No cloud, authentication, persistence, RLS, deployment, production, research, evidence or coverage state changed. NEXT: bounded Live-Safe Cloud / Deployment Readiness Audit.
## 2026-09-03 — Phase 7 live-safe cloud/deployment readiness audit

Repository-only audit found authentication and Supabase persistence paths implemented with a publishable client key, session persistence and `user_id` payloads, but live schema/RLS policies, auth recovery configuration, deployment reproducibility and operational recovery remain unverified. `motorcycles` and `service_records` reads/updates/deletes rely on live RLS for ownership enforcement; no repository policy baseline proves that boundary. No SQL, live inspection, auth, cloud, deployment, production or research state changed. Overall readiness: `NOT-READY`; NEXT is a read-only live Supabase schema/RLS/auth inspection before defining a migration/policy test implementation.
## 2026-09-03 — Phase 7 Supabase schema/RLS reproducibility baseline

Added the repository-only ownership/RLS migration baseline for `motorcycles` and `service_records`: authenticated owner policies, service-record composite ownership foreign key, required ownership columns without random UUID defaults, and complete SELECT/INSERT/UPDATE/DELETE coverage. Focused tests verify policy text and existing application payload compatibility. No live SQL, RLS, auth, leaked-password setting, deployment, production or research state changed. NEXT: separately authorized live-safe parity/backup review and migration apply plan.
## 2026-09-03 — Phase 7 ownership/RLS migration live-parity correction

Corrected the unapplied migration to harden the existing live tables rather than recreate or reconcile unrelated schema. It now explicitly removes the recorded `users_can_*` policies on both tables before creating canonical ownership policies, while retaining only owner-default removal, ownership constraints and RLS changes. Focused tests verify no table creation, unrelated column alteration or data-loss operation is present. No live SQL or application state changed. NEXT: separately authorized immediate live preflight and transactional apply decision.
## 2026-09-03 — Technical Profile localization runtime regression correction

The actual browser/runtime Ducati render path was verified through the production dependency order and now has a deterministic renderer cache-bust; final Ducati HTML renders Polish category/entry labels while canonical profile data remains unchanged. The prior localized helper was present, but the renderer asset URL was unversioned and could remain cached in static hosting. Operator-supplied production recovery verification is now reflected as verified rather than pending; no live setting changed. Phase 7 remains ACTIVE.
## 2026-09-03 — Phase 7 password reset/recovery flow

Implemented the bounded repository-side Supabase Auth v2 recovery flow: neutral reset request messaging, runtime-derived redirect, recovery callback/session guard, dedicated new-password state, local validation and fail-safe update handling. Existing login/registration remains intact and the recovery update preserves the current account identity. No live Supabase/auth setting, RLS, data, deployment, production or research state changed. Dashboard redirect allow-list verification/configuration remains pending; leaked-password protection remains separate.
Operator-supplied production verification recorded: recovery redirect, recovery email, recovery callback, password update and preservation of the existing account/cloud data all work end-to-end. The Dashboard redirect allow-list remains an external configuration dependency; no live setting was changed.
## 2026-09-03 — Technical Profile Polish presentation layer

Added one centralized render-time presentation mapping for Polish Technical Profile categories, common field labels, statuses and source titles/sections, and wired it into the browser UI. Honda VFR800 and Ducati Monster 937 resolution, canonical identifiers, stored values, units, profile semantics and entry counts remain unchanged; search indexing/ranking inputs remain unchanged. No technical coverage or data expansion occurred. Phase 7 remains ACTIVE; future technical-data expansion is separate.
## 2026-09-03 — Ducati Monster 937 VFR-aligned coverage expansion

Audited all repository Ducati acquisition, review, processing, conversion, authorization and production evidence. No additional technical field passed the existing promotion rules: six verified entries remain unchanged, cooling remains blocked by `COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR`, and the other 20 candidates remain pre-promotion. Added the remaining empty VFR-aligned taxonomy categories without placeholder values; coverage is present only in lubrication, ignition, brakes and electrical. No inference, VFR change or new technical coverage occurred. Phase 7 remains ACTIVE.
## 2026-09-03 — Phase 6 production promotion rollback/governance closeout

Defined and validated the generic immutable rollback/governance contract for the exact Ducati registry promotion. The deterministic record proves the prior VFR-only set, current VFR+Ducati set, six promoted entries, one document, six citations and retained production/research history; rollback would remove only Ducati registry exposure and was not executed. Ducati remains registered and discoverable; BMW, VFR, evidence and Service Core coverage are unchanged. Phase 6 remains ACTIVE with rollback/governance closed and future bounded expansions remaining.
## 2026-09-03 — Ducati Monster 937 production registry insertion

Registered exactly one existing Ducati Monster 937 MY2021 profile descriptor for catalogue key `ducati.monster.937`, preserving the VFR descriptor and registry uniqueness. Normal registry discovery, loader validation and resolver paths now succeed for the six verified entries. Cooling, pending Ducati fields, BMW, source citations/documents, evidence and Service Core coverage remain unchanged. Phase 6 remains active after the first bounded production registry promotion.
## 2026-09-03 — Rider Service Core and Source Trust Model

Defined the permanent owner-first Rider Service Core taxonomy and the
manufacturer-neutral Source Trust Model in `docs/project/RIDER_SERVICE_CORE.md`.
Recorded official-primary authority, same-publication document-identity
verification versus independent technical cross-checks, zero inference,
coverage reporting and the future lawful “Instrukcja źródłowa” contract. Added
only the genuinely future source-link and Garage/Service maintenance-due items
to the backlog. Existing VFR/Ducati data, application code, cloud state and
Phase 7 state were unchanged; Phase 7 remains ACTIVE.
## 2026-09-03 — Ducati Monster 937 Rider Service Core acquisition

Re-inspected the authenticated official Ducati `OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf`
for the owner-first Core checklist. Preserved the existing 27 candidates and
added 44 deterministic direct-page raw candidates covering engine,
dimensions/mass, transmission/final drive, brakes, wheels/tires,
electrical/fuses/LED lighting and maintenance. All new candidates remain
queued, unnormalized and scoped to EU MY2021 common base Monster 937 with
ABS/manual applicability. Ducati's official owner-manual library verified
document identity; no independent technical cross-check was found in the
bounded Ducati-controlled search. Cooling capacity remains blocked because
complete circuit scope is not proven. No evidence, production, VFR, cloud or
coverage state changed; Phase 7 remains ACTIVE.
## 2026-09-03 — Ducati Monster 937 Rider Service Core human review

Reviewed exactly the 44 newly queued candidates from the bounded Core
acquisition. Existing review vocabulary produced 39 `ACCEPT`, 0 `REJECT` and
5 `NEEDS-MORE-REVIEW` decisions; the five fail-closed clarifications cover
payload/GVWR semantics, missing main-fuse rating, DRL applicability, LED
replaceability and mixed initial-service text. Cooling capacity remained the
prior `COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR` blocker and was
not part of this batch. Raw values/provenance and prior acquisition state were
preserved; no evidence, production, VFR or coverage change occurred. Phase 7
remains ACTIVE.

## 2026-09-03 — Ducati Rider Service Core evidence processing

Processed exactly the 39 Ducati Rider Service Core candidates with canonical
`ACCEPT` decisions. Three fields passed the existing Evidence Processing
boundary and produced `ACCEPTED-FOR-PROCESSING` records; 36 received explicit
`CANNOT-ADVANCE` outcomes for the discovered factory field-contract gap. The
five `NEEDS-MORE-REVIEW` candidates, cooling capacity, prior Ducati candidates
and all other motorcycles were excluded. Raw values, provenance and
applicability were preserved; no normalization, evidence, production, VFR or
coverage change occurred. Phase 7 remains ACTIVE.
## 2026-09-03 — Rider Service Core / Evidence Processing contract alignment

Confirmed the root cause of the prior 36 contract blocks: the shared factory
used a legacy 44-field allowlist that did not include the broader owner-first
Core identities. Added a manufacturer-neutral 14-domain machine matrix and
aligned the shared extraction contract to its union with the legacy fields,
retaining legacy meaning and fail-closed processing. Structured/repeating
metadata preserves maintenance actions/interval context, fuse rating/function/
location associations and explicit lighting LED semantics. Reprocessed exactly
the same 39 Ducati `ACCEPT` inputs: 39 `ACCEPTED-FOR-PROCESSING`, 0 contract
blocks, 0 validation failures, 0 conflicts. The five deferred candidates and
cooling blocker remain excluded; no Human Review, evidence, production, VFR or
coverage state changed. Phase 7 remains ACTIVE.

## 2026-09-03 — Ducati production runtime/presentation hardening

Fixed the real browser Technical Profile render path for Ducati Monster 937
MY2021. The centralized generic presentation layer now labels all 45 loaded
entries in Polish and presents structured Rider Service Core maintenance, fuse,
lighting and wheel data without flattening or changing canonical values,
provenance or applicability. Browser/runtime regression coverage confirms the
registry, loader, resolver, Ducati and VFR paths remain stable; blocked and
deferred research records remain absent from production. Phase 7 remains ACTIVE.

## 2026-09-03 — Rider Service Core visibility gate

Added the generic canonical-identity visibility policy for the default
Technical Profile UI. Ducati’s 45-entry profile now presents only verified,
practical Rider Service Core data by default, while extended engineering and
workshop reference entries remain intact in canonical production data. The
same policy hides unverified/reference VFR data without changing its profile,
values, provenance, resolver behavior or registry state. Default search uses
the same boundary; no technical data was deleted. Phase 7 remains ACTIVE.

## 2026-09-03 — Ducati Rider Service Core conditional production promotion

Reassessed exactly the existing 39 Ducati Monster 937 MY2021
`ACCEPTED-FOR-PROCESSING` records against the generic lossless production
representation. All 39 were individually `PROMOTION-READY`, with zero
duplicates, conflicts or blockers. Materialized exactly those 39 records as
new citation-backed entries in the existing Ducati profile, preserving the
original six entries unchanged. The profile now contains 45 entries and
passes validator, registry, loader, resolver and runtime regressions. The five
`NEEDS-MORE-REVIEW` candidates and `cooling.capacity` remain excluded; no BMW,
VFR, Human Review, Evidence Processing meaning or Service Core research
coverage changed. Phase 7 remains ACTIVE.
## 2026-09-03 — Ducati Rider Service Core promotion readiness

Audited exactly the 39 aligned `ACCEPTED-FOR-PROCESSING` Ducati records through
the existing promotion-readiness gate and production-materialization boundary.
All 39 receive one deterministic outcome; the canonical gate passes identity,
provenance, applicability and conflict checks, but final readiness is
`0 PROMOTION-READY / 39 production-representation-blocked` because no lossless
production mappings have been established. Maintenance raw action/interval and
lighting LED meaning remain preserved; fuse materialization is additionally
blocked because the current processing payload does not retain the source
rating/function/location association. Five `NEEDS-MORE-REVIEW` candidates and
cooling remain excluded. No decisions, evidence, production, VFR or coverage
state changed. Phase 7 remains ACTIVE.
## 2026-09-03 — Generic Rider Service Core production representation

Added the manufacturer-neutral `revlog-rider-service-core-record/v1`
production-compatible representation contract. It supports scalar, structured
and repeating records while preserving raw values/units, applicability and
shared provenance; typed structures cover maintenance operations, fuse
associations, lighting semantics, practical torques, consumable references and
tire-pressure variants. The shared processing boundary now carries the already
recorded source context needed to preserve fuse rating/function/location
associations. Read-only Ducati regression confirms all 39 processed inputs are
losslessly representable; the five deferred candidates and cooling remain
excluded. No promotion, production profile, Human Review, evidence, VFR or
coverage state changed. Phase 7 remains ACTIVE.

## 2026-09-03 — Fixed Rider Service Core matrix

Corrected the prior dynamic visibility interpretation with one closed shared
Rider Service Core presentation matrix sourced from the existing canonical
previous dynamic 14-domain research contract. Ducati Monster 937 MY2021 and Honda
VFR800 VTEC MY2002 now render identical field IDs and order; verified values are
shown and missing cells render `Brak danych`. Extended canonical records remain
stored and excluded from default Core rows. No technical values, profile
semantics, provenance, registry state or research decisions changed. Phase 7
remains ACTIVE.
## 2026-09-06 — RevLog Core runtime hardening

Completed one bounded production/runtime hardening wave. Technical clarification
now projects the existing model-code, transmission and emissions dimensions into
the generic applicability resolver, with fail-closed unknown context and Polish
clarification controls. Service due evaluation keeps date and mileage as
independent dimensions, validation rejects invalid domain values before direct
persistence, current mileage updates are cloud-confirmed and monotonic, failed
clarification writes do not alter local context, and active motorcycle selection
survives reload with deterministic stale-ID fallback. Added focused runtime,
database, resolver and service regressions; VFR/Ducati profiles and the frozen
Core matrix remain unchanged. Phase 7 remains ACTIVE.

## 2026-09-06 — Rider Core production projection audit

Audited the complete frozen 95-field Rider Service Core projection for the
Honda VFR800 RC46 VTEC MY2002 and Ducati Monster 937 MY2021. Restored generic
presentation aliases for existing verified charging, tire-pressure, rear-rim,
disc-service-limit and OEM-chain records, and added deterministic extraction
for Ducati composite rim and disc values. VFR engine power remains correctly
missing because no verified canonical power record exists; fuse, regional
lighting, ABS and valve/spark applicability behavior remains fail-closed. No
canonical values, provenance, profile identities or matrix fields changed.
Phase 7 remains ACTIVE.

## 2026-09-06 — RevLog 0.4.0 release metadata

Published canonical RevLog 0.4.0 metadata dated 2026-09-06 for the completed
runtime hardening and Rider Core projection waves. Release notes cover safer
Technical Profile context handling, independent service due dimensions,
current-mileage and active-motorcycle persistence, and presentation of existing
verified VFR/Ducati data without claiming new technical research. Phase 7
remains ACTIVE.

## 2026-09-06 — CI validation and Supabase reproducibility audit foundation

Added a minimal secret-free GitHub Actions validation workflow for pull
requests and pushes to `main`, using Node.js 22, repository-wide JavaScript
syntax checks, the full test suite and the project-state audit CLI. Audited the
production Supabase runtime contract and documented that the existing two
migrations are incremental: the empty-project base schema and some dashboard
configuration remain unproven. No live Supabase mutation, deployment or
application behavior change occurred. Phase 7 remains ACTIVE.

## 2026-09-06 — Deferred Research Factory throughput concept

Recorded a backlog-only future concept for an OEM-direct fast path: explicit
source/applicability verification, exception-driven review, document reuse and
measured pilot evaluation without weakening zero-inference or provenance. The
concept remains deferred until the current Technical Research Factory scope is
formally closed; no research, production or schema implementation occurred.

## 2026-09-08 — Deployment / Recovery Hardening

Completed one bounded Phase 7 hardening wave. Production password-reset
requests now require an explicit operator-provided HTTPS callback URL; only
localhost development can derive its current path. Recovery UI activation is
bound to Supabase `PASSWORD_RECOVERY` plus the session user ID, so arbitrary
URL markers, ordinary sessions, malformed callbacks and identity mismatches
fail closed. Password updates remain locally validated, prevent duplicate
submissions, clear recovery state only after success and remain recoverable on
failure. Added deterministic offline tests and the deployment/recovery
runbook. No live Supabase or deployment change occurred, and the current Free
plan leaked-password protection limitation remains an external blocker.

## 2026-09-08 — Yamaha FZ1 Source Authentication / Research Planning

Completed exactly one bounded non-production Technical Research Factory wave.
Selected the repository-supported `yamaha.fz1.gen2` grouping for 2006–2015,
bound it to the existing deterministic mapping, and preserved separate FZ1-N
and FZ1-S runtime identities. Authenticated the official Yamaha 2010 FZ1-N
owner-manual index route `2D1X` only within its narrow year/body-style/index
scope. Recorded `2D1-28197-E0` as a partial-authentication service-manual lead
through the Yamaha RMI route without treating it as fully proven. Market, ABS,
equipment, emissions and broader year applicability remain unknown. No source
was acquired, no technical value/evidence/review record was created, and no
production or Rider Service Core data changed.

## 2026-09-08 — Yamaha FZ1 2D1X Owner Manual Source Acquisition

Completed exactly one bounded non-production acquisition wave for the official
Yamaha route `https://www2.yamaha-motor.co.jp/Manual/pdf/mc/20102D1X.pdf`.
The response was `200 application/pdf`, 5,098,486 bytes, with deterministic
SHA-256 identity `bbaa777d8d0184f231573fdf6116d73b7770930d4bdf19b1f0d7386d6b7e2a93`.
The acquisition record preserves official Yamaha provenance and the existing
2010 FZ1-N / 2D1X applicability boundary; it does not store or inspect manual
content. `2D1-28197-E0` remained an untouched partial-authentication lead. No
extraction, raw candidate, review, evidence, Service Core or production record
was created. The next bounded task is extraction planning before any value is
read.

## 2026-09-08 — Yamaha FZ1 2D1X Extraction Planning

Completed exactly one planning-only wave for the acquired official `2D1X`
owner manual. Structural inspection was limited to PDF metadata, the 68-page
document structure and bookmarks/TOC; no page text or technical value was
recorded. The deterministic plan binds to the acquired artifact and exact
SHA-256, permits six bounded owner-service/specification regions, requires
precise page/section/table/applicability provenance, preserves conditional
rows, excludes FZ1-S, non-2010 years and `2D1-28197-E0`, and caps future raw
output at 24 candidates. Extraction was not executed: zero values,
candidates, review entries, evidence, Service Core or production changes.

## 2026-09-08 — Technical Research Factory Generic Extraction Playbook

Completed exactly one architecture-only wave. Added a manufacturer-neutral,
non-production extraction playbook that reuses the existing Extraction Agent
contracts for artifact/hash binding, bounded regions and field targets, precise
page/section/table provenance, fail-closed applicability, conditional-row
preservation, semantic duplicate handling, model-specific budgets, stop
conditions and raw-candidate-only transition. Existing VFR fingerprint and FZ1
`2D1X` planning records describe the same generic process without entering the
generic layer or supplying technical values. No extraction was executed and no
raw candidate, review, evidence, Service Core or production record was created.

## 2026-09-08 — PDF Extraction Trust Boundary / Raw-Extraction Readiness

Completed exactly one bounded architecture-only wave after the FZ1 pilot was
blocked by two generic incompatibilities. Added a stage-specific raw-extraction
readiness gate that does not alter strict downstream applicability/evidence or
promotion readiness; unresolved dimensions are allowed only when explicitly
carried by the bounded plan. Added a deterministic derived-content bridge in
which UTF-8 extraction input is parent-bound to the exact acquired binary
artifact, digest, media type, byte length, transformer identity/version and
approved page-region, with existing Factory artifact identity and provenance
contracts retained. A synthetic local adapter proves the Extraction Agent
entry point without reading the FZ1 PDF. Zero FZ1 technical values, raw
candidates, review decisions, evidence, Service Core or production changes
occurred; `2D1-28197-E0` remained untouched. The next bounded wave is the
FZ1 `2D1X` pilot through these new boundaries.

## 2026-09-08 — Yamaha FZ1 2D1X Generic Playbook Raw Extraction Pilot

Completed exactly one bounded raw-extraction pilot using the exact acquired
official Yamaha `2D1X` PDF artifact. Parent SHA-256, byte length and media type
were verified before transformation. A deterministic local pypdf transformer
read only the six approved plan regions and passed each region through the
ADR-030 parent-bound derived-content bridge into the generic Extraction Agent.
Fourteen raw candidates were created across owner-level lubrication, cooling,
tires, brakes, chain, lighting and basic specification fields; the 24-candidate
ceiling was not approached by speculation. Candidate provenance retains the
derived-content ID, artifact identity, PDF page, section, locator, table or
subsection, applicability and units context. Market, ABS, transmission,
equipment and emissions remain unresolved; FZ1-S and non-2010 scope were
excluded. No review decisions, evidence, verified Service Core, production,
catalogue, Supabase or deployment state changed, and `2D1-28197-E0` remained
untouched. The next bounded task is to evaluate genericity for scaling, not to
promote or broaden this data.

## 2026-09-08 — Declarative Field Policy / Source Authority Contract Foundation

Added the smallest executable ADR-031 contract as a manufacturer-neutral
Factory module. Closed source classes and specialist domains, group defaults
with canonical Service Core field overrides, authority minimums, corroboration
modes, applicability/provenance requirements, fast/deep path decisions and
bounded search budgets are validated immutably and evaluated deterministically.
Discovery-only sources, insufficient authority, unresolved required
applicability, incomplete provenance, conflicts and invalid policy combinations
fail closed. Synthetic tests cover the contract; no live research, FZ1 pilot,
PDF, candidates, review decisions, evidence, Service Core or production data
changed. The next bounded wave is an existing-fleet field-oriented coverage
reassessment using this policy.

## 2026-09-08 — Existing-Fleet Field-Oriented Coverage Reassessment

Performed one static reassessment across ten existing research/profile targets.
Catalogue-only variants were excluded without inventing a count. Repository
known gaps were classified by the field policy into bounded OEM web/support/
fiche, specialist, corroboration, deep-path, applicability-blocked and
conflict-review routes. Existing authenticated sources and held raw/review
state were marked for reuse; no external availability was claimed. The ranked
first package is Honda NC750X RH09-1, Honda CBR600RR RH10 and Honda CBR500R
PC70, limited to fitment/routine bundles and 24 raw candidates maximum. No
research, acquisition, extraction, candidate, evidence, Service Core,
production, catalogue or Supabase state changed.
## 2026-09-08 — Generic HTML / Structured Web Acquisition Adapter Foundation

Implemented one bounded, manufacturer-neutral HTTP(S) acquisition adapter for
explicitly supplied public URLs. It reuses the canonical acquisition artifact
and outcome contracts, preserves requested/final URL, status, media type,
length, exact body bytes, SHA-256 and deterministic artifact identity, and
fails closed on unsafe URLs, unsupported media, size, timeout, redirect and
HTTP failure limits. Automatic retries remain at zero. Offline ephemeral HTTP
fixtures cover success, custody, determinism, redirects, failures, limits and
local-resource rejection. No live motorcycle research, extraction, raw
candidates, review decisions, evidence, Service Core or production changes
occurred. Next: rerun the previously rejected three-Honda fast-path package
through this generic adapter, without adding semantic HTML extraction here.

## 2026-09-08 — Generic Parent-Bound HTML Text Derivation Foundation

Added the smallest generic HTML/XHTML transformation layer above acquired
artifacts. `html.normalized-text` v1 consumes only retained parent artifact
bytes, re-verifies SHA-256 and byte length, safely excludes scripts, styles
and comments, normalizes UTF-8 text deterministically, enforces a finite
output bound and emits a whole-document derivative through the existing
parent-bound contract. The PDF region path remains compatible. Focused
derivation and Extraction Agent tests pass 26/26. No live source, motorcycle
research, semantic field extraction, raw candidates, review decisions,
evidence, Service Core or production data changed. Next: rerun the bounded
three-Honda fast-path package through HTTP acquisition and HTML derivation.

## 2026-09-08 — Declarative Derived-Text Raw-Extraction Foundation

Added a manufacturer-, model-, website- and field-value-neutral declarative
text executor with closed `TEXT_PATTERN` and bounded `LABEL_VALUE` rules.
Rules and matches are JSON-safe and deterministic; derived digests are
recomputed, exact matched/captured text and bounded line/character locators
are preserved, ambiguity fails closed, and caller-supplied applicability and
authority are not upgraded. A thin adapter reuses the existing Extraction
Agent/raw-candidate contracts. Focused declarative, HTML and Extraction Agent
tests pass 36/36. No live research, motorcycle candidates, review decisions,
evidence, Service Core, production, catalogue or Supabase changes occurred.
Next: rerun the bounded three-Honda fast-path package through the complete
generic web acquisition, HTML derivation and declarative extraction path.
## 2026-09-08 — AcquisitionArtifact opaque payload secret-scan boundary

Added a narrow path-aware secret-scan boundary for the exact acquired
`metadata.contentBase64` payload. Opaque public response bytes are excluded
from secret-shaped textual heuristics, while control/provenance metadata,
URLs, arbitrary sibling payload fields and request metadata remain scanned.
Base64 syntax, byte length, SHA-256 custody and deterministic artifact identity
remain enforced. No live motorcycle research, extraction, candidates, review,
evidence, Service Core or production data changed.

## 2026-09-08 — DerivedContent opaque text secret-scan boundary

Extended the same narrow opaque-content principle to canonical derived source
text and the derived text extraction envelope. Only the exact derived payload
paths are exempt from secret-shaped textual heuristics; control, provenance,
URL, locator and transformer metadata remain scanned. Derived digest, byte
length, deterministic identity and parent binding remain fail-closed. No live
motorcycle research or technical/production data changed.

## 2026-09-08 — Existing-Fleet Fast-Path Package 1 trusted web-to-raw rerun

Executed the exact bounded three-target package for Honda NC750X RH09-1,
Honda CBR600RR RH10 and Honda CBR500R PC70. Four explicit public HTML
acquisitions used the generic bounded HTTP adapter and HTML derivation path;
the fiche provider remained without independently proven authority and the
official CBR500R route did not establish exact field applicability. All six
planned slots therefore stopped fail-closed and zero raw candidates were
retained. No review decisions, evidence, Service Core, production, catalogue
or Supabase state changed. The deterministic package report and reproduction
test are retained. Next: establish one independently authenticated,
exactly-applicable permitted source route before a bounded rerun; do not
weaken ADR-031 or add source-specific parsing.

## 2026-09-08 — CBR500R PC70 permitted source-route authentication

Authenticated source routes only for the four planned CBR500R PC70 fields
using eight bounded public discovery/authentication attempts. The official
Honda 2024 owner-manual route is permitted Tier A for oil specification and
loaded-pressure follow-up, with loaded-condition proof still required. The
Honda parts route is applicability-partial, the RK manufacturer route lacks
exact CBR500R/year fitment, and bike-parts-honda.com remains discovery-only
because authorization was not proven. No technical values, candidates,
review decisions, evidence, Service Core, production, catalogue or Supabase
state changed. Next: execute one bounded CBR500R source wave only through the
authenticated Honda owner-manual route, preserving the loaded-condition gate.

## 2026-09-08 — CBR500R PC70 owner-manual execution

Executed the already authenticated Honda 2024 PDF route for exactly
`lubrication.oil-specification` and `tires_wheels.loaded-pressures`. Existing
generic custody, `pypdf` derivation and Extraction Agent contracts produced one
raw oil-specification candidate with deterministic provenance. Loaded pressure
stopped with `NO_EXPLICIT_LOADED_CONDITION`; standard pressure and passenger
capacity were not conflated, and existing verified coverage was not duplicated.
No new discovery, other source, review decision, evidence, promotion,
Service Core, production, catalogue, Supabase or infrastructure change
occurred. Next: bounded human review of the single oil candidate only.

## 2026-09-08 — CBR500R source-route authentication final gate recovery

Revalidated the already completed source-route wave without new research,
discovery attempts or live URL access. The independent compliance audit is
`ACCEPT`; unresolved loaded-condition, Honda-parts applicability and RK
fitment/access items remain explicit research risks rather than audit defects.
The recovery full suite passed after approved local-fixture access was used;
all other required gates passed. The existing commit was amended in place; no
production, catalogue, Supabase or infrastructure state changed.

## 2026-09-14 — Supabase browser dependency pinning

Pinned the production browser-loaded `@supabase/supabase-js` dependency from
the floating major URL to exact version `2.116.0`, which was the version
resolved by the existing jsDelivr URL at implementation time. Added a narrow
HTML contract test that rejects floating/range forms and accepts only the
intended exact version. Existing Supabase auth, recovery and database API
usage remains unchanged; no Supabase state, secrets, production technical
data or release metadata changed. Validation: targeted dependency/auth tests,
full suite, repository JavaScript syntax checks, `git diff --check` and
project-state audit passed. Next: bounded Production Readiness P1 end-to-end
release smoke-test planning/execution wave.

## 2026-09-14 — GitHub Pages production recovery configuration

Configured the operator-confirmed production URL
`https://przemyslawchmura-coder.github.io/VFR-Master/` in the explicit,
host/path-gated `js/deployment-config.js`, loaded before the Supabase client.
The production callback remains HTTPS and exact-path bound; localhost keeps
its local-only fallback, while other hosts and unsafe/malformed configured
URLs fail closed. Added regression coverage for the production path, current-
origin non-substitution, localhost fallback and deployment script order. No
Supabase dashboard/database state, secrets, authentication lifecycle or
production technical data changed. Next: operator-assisted production
end-to-end smoke test against the confirmed GitHub Pages URL.

## 2026-09-14 — Production Readiness P1 live smoke-test closure

Operator-confirmed successful live verification was completed against
`https://przemyslawchmura-coder.github.io/VFR-Master/`. The operator verified
application load, authentication/login, Garage loading, motorcycle creation,
reload persistence, active-state restoration, mileage persistence, service
creation/editing/deletion, logout, subsequent cloud-backed login restore and
password-recovery return to the `/VFR-Master/` production path. This is
operator-assisted live evidence, not Codex browser automation; it is distinct
from the automated repository tests and audits. Production Readiness P1 live
E2E verification verdict: `ACCEPT`; no production defect was discovered, and
no existing user data was intentionally modified by this closure task. The
live E2E verification boundary is CLOSED. Next: follow the current roadmap's
smallest remaining bounded task, authorized production migration-history
reconciliation planning only.

## 2026-09-14 — Password-recovery startup race repair

Reproduced the operator-observed startup race in which `initializeAuth()`
could read an authenticated recovery session before the asynchronous
`PASSWORD_RECOVERY` listener persisted pending state, opening the ordinary
application instead of the reset form. Added a minimal auth-readiness promise
resolved by the Supabase lifecycle boundary; recovery-marked authenticated
startup now waits for `PASSWORD_RECOVERY`, while ordinary `INITIAL_SESSION`
startup proceeds normally and malformed/expired recovery remains fail-closed.
Added deterministic async regression coverage for the race, lifecycle
authority, ordinary sessions, mismatch/errors, reload persistence and the
successful update transition. No redirect, dependency, database/Supabase
state, RLS, secrets, technical data or unrelated behavior changed. Validation:
targeted auth tests 15/15, full suite 836/836 with three intentional skips,
repository syntax checks, `git diff --check` and project-state audit passed.
Next: deploy the repair, then repeat only the production password-recovery
smoke test before closing Production Readiness P1.

## 2026-09-14 — Recovery-readiness edge-case verification

The suspected startup deadlock was reproduced deterministically: a
`type=recovery` marker without callback material, followed by an ordinary
authenticated `INITIAL_SESSION` and no `PASSWORD_RECOVERY`, left the prior
auth-readiness promise unresolved. The bounded repair now waits for recovery
lifecycle evidence only when callback material is present; a marker alone
remains non-authorizing and ordinary startup terminates normally. Added a
regression test for this ordering while preserving `PASSWORD_RECOVERY`
authority, identity matching and fail-closed callback handling. Current
Production Readiness P1 remains OPEN pending operator-assisted live
verification after auth-email delivery is available again. No Supabase,
database, production data, redirect, dependency, technical data or secrets
changed. Validation: targeted auth/recovery tests, full suite, syntax checks,
`git diff --check` and project-state audit passed.

## 2026-09-19 — Post-repair production password-recovery verification

An operator-assisted live smoke test passed against
`https://przemyslawchmura-coder.github.io/VFR-Master/` after commit
`6d72a97ca8bcc761d73b9654aefc0aaf9b91a2f5`. The reset request displayed the
neutral confirmation, the real Supabase recovery email arrived, and the
legitimate callback returned to the intended GitHub Pages production path.
The recovery UI became available through the authenticated recovery flow, the
new password update succeeded, recovery returned to ordinary authentication,
the new password logged in successfully, and the old password was rejected.
A manually opened marker-only `?type=recovery` URL remained fail-closed and
showed ordinary login. No browser-console inspection was performed, and this
does not claim unrelated Supabase Dashboard configuration was verified. No
application code, tests, technical data, production data, Supabase state or
Research Factory state changed. Production Readiness P1 recovery verification
is CLOSED with operator verdict `ACCEPT`.
NEXT: execute the approved bounded existing-fleet fast-path research package
for Honda NC750X RH09-1, Honda CBR600RR RH10 and Honda CBR500R PC70 under its
existing applicability, source-authority and 24-raw-candidate limits.

## 2026-09-19 — Recovered current Factory next action

Read-only reconciliation found that the active three-Honda NEXT pointer was
stale. The package had already completed at `6ac98d0` with four bounded
acquisitions and zero retained candidates; the authenticated CBR500R
continuation completed at `e33fb31` and retained one raw
`lubrication.oil-specification` candidate. The candidate is bound to the
authenticated Honda 2024 owner manual and exact 2024 PC70 USA/Canada manual
applicability, with loaded-pressure extraction stopped at the explicit
loaded-condition gate. No Human Review Decision, Evidence Processing record
or promotion exists, and the candidate is not present in the persisted Review
Queue report. Recovered canonical NEXT: construct exactly one Review Queue
entry for that candidate, then defer any Human Review Decision to a separate
bounded wave.

## 2026-09-19 — Queued CBR500R oil candidate for review

Constructed exactly one deterministic Review Queue entry from the existing
raw candidate `extraction-candidate.87fcea8600978eff75d9f8d6` using the
generic queue contract. Entry `review-queue-entry.7b8d56af51c808e15dd558ac`
is `QUEUED`; raw value, target/source provenance and 2024 PC70 USA/Canada
manual applicability were preserved, including unresolved ABS. Duplicate
construction collapsed to one entry. No Human Review Decision, Evidence
Processing, promotion or production change occurred. Validation passed.
NEXT: bounded Human Review of exactly this one CBR500R oil-specification queue
entry.

## 2026-09-19 — Human Review of the queued CBR500R oil candidate

Reviewed exactly one queued candidate `extraction-candidate.87fcea8600978eff75d9f8d6`
from `review-queue-entry.7b8d56af51c808e15dd558ac` against the preserved Tier A
Honda 2024 owner manual `31MLRB000` and its exact 2024 PC70 USA/Canada manual
scope. Created deterministic decision
`review-decision.3d8c7cebfd3c3c4f34b1f163` with outcome `ACCEPT`; this remains
pre-evidence only. Raw value, provenance and applicability were preserved,
including unresolved ABS. No Evidence Processing, promotion, production or
Rider Service Core change occurred. Validation passed, including targeted
Human Review/queue tests, syntax, project-state audit and diff check.
NEXT: bounded Evidence Processing for exactly this one accepted decision.

## 2026-09-19 — Evidence Processing of the accepted CBR500R oil decision

Processed exactly one accepted Human Review Decision
`review-decision.3d8c7cebfd3c3c4f34b1f163` through the generic Evidence
Processing contract. The resulting deterministic record is
`evidence-processing.87cd135fb44ebc569aebacb9` with state
`ACCEPTED-FOR-PROCESSING`; candidate, queue, decision, source provenance and
raw compound oil value remain linked and unchanged. No normalization, conflict
resolution, evidence-row creation, promotion or production change occurred;
ABS remains unresolved. Validation passed, including targeted Factory tests,
syntax, project-state audit and diff check.
NEXT: bounded read-only promotion-readiness evaluation for exactly this one
processing record; do not promote automatically.

## 2026-09-19 — CBR500R oil promotion-readiness evaluation

Evaluated exactly one Evidence Processing record
`evidence-processing.87cd135fb44ebc569aebacb9` through the generic
`PromotionPacket/v1` and read-only promotion-readiness gate. The deterministic
packet `promotion-candidate.0c12373f56277561b2b692a2` is `BLOCKED` only for
`absSufficient`: the source applicability remains ABS `null`, represented as
contract-level `UNKNOWN`. Model year, USA/Canada market, equipment,
transmission, source identity, provenance, raw context and Human Review ACCEPT
all pass; no normalization or conflict resolution was performed. No promotion,
production or Rider Service Core change occurred.
NEXT: resolve the existing ABS applicability blocker for exactly this packet in
a separate bounded applicability-verification wave; do not weaken the gate or
promote automatically.

## 2026-09-19 — CBR500R oil ABS applicability verification

Resolved only the ABS applicability blocker for
`promotion-candidate.0c12373f56277561b2b692a2` using the existing authenticated
Tier A Honda 31MLRB000 owner manual. Its 2024 CB500F / CBR500R / NX500 scope,
explicit ABS-equipped model statement, and common USA/Canada Service Data oil
entry establish ABS-known=true for the exact CBR500R PC70 target; no broader
non-ABS variant was inferred. The deterministic derived artifact
`applicability-verification.08059a67abc9eb226cb3fc82` preserves the complete
candidate → queue → decision → processing → promotion-readiness lineage. No
upstream artifact, raw value, other applicability dimension, normalization,
conflict, production data or promotion changed. Readiness re-evaluated to
`PROMOTION-READY` with no remaining reasons.
NEXT: create the existing generic pending Promotion Review Packet for exactly
this ready packet; do not approve or promote it.

## 2026-09-19 — CBR500R pending promotion-review packet

Created exactly one generic `PromotionReviewPacket/v1` for the
`PROMOTION-READY` CBR500R oil packet. The deterministic packet is
`promotion-review-packet.04a970ff8421a1871a92120b` with state
`PENDING-PROMOTION-REVIEW`; it preserves the candidate, queue, Human Review,
Evidence Processing and ABS applicability-verification lineage, raw compound
oil value, Tier A provenance and bounded 2024 USA/Canada/manual/standard/ABS
scope. No approval decision, normalization, evidence creation, promotion,
production or Rider Service Core change occurred.
NEXT: create exactly one explicit human Promotion Review Decision for this
pending packet; do not approve implicitly or promote it.

## 2026-09-19 — CBR500R human promotion-review decision

Created exactly one explicit generic Promotion Review Decision for
`promotion-review-packet.04a970ff8421a1871a92120b`. Decision
`promotion-review-decision.5e99ea7b38d63897de9037e8` is
`APPROVED-FOR-CONVERSION`, with reviewer
`human-promotion-review.cbr500r.pc70.oil-specification` and a rationale limited
to the separate schema-conversion boundary. The packet remains non-production;
complete lineage, bounded applicability including ABS-known=true, Tier A
provenance and the unchanged raw oil value were preserved. No conversion,
production evidence, profile change or promotion occurred.
NEXT: create the existing generic schema-conversion projection for exactly this
approved decision; do not materialize or promote production data.

## 2026-09-19 — CBR500R oil schema-conversion projection

Created exactly one generic `SchemaConversionProjection/v1` for approved
decision `promotion-review-decision.5e99ea7b38d63897de9037e8`. Projection
`schema-conversion.0408c67195304a42913cbbb4` is `CONVERSION-READY` and maps
the unchanged compound raw oil string losslessly as text to the existing
`lubrication.engine-oil.specification` schema entry. Raw input and Tier A
provenance remain traceable, bounded applicability including ABS-known=true is
preserved, and no normalization, materialization, promotion, production or
Rider Service Core change occurred.
NEXT: create the existing generic schema-conversion authorization projection
for exactly this result; do not materialize or promote production data.

## 2026-09-19 — CBR500R oil schema-conversion authorization projection

Created exactly one generic read-only production-promotion authorization for
`schema-conversion.0408c67195304a42913cbbb4`. Result
`production-authorization.42dfc09d17938fb18e6dc92d` is
`AUTHORIZATION-READY` with no blockers; it preserves the unchanged compound
raw oil value, Tier A provenance, complete lineage and bounded MY2024
USA/Canada/manual/standard/ABS-known applicability. The generic contract
records document, citation, Technical Profile and registry materialization as
separate future requirements; no production artifact, upstream research state
or Rider Service Core state changed.
NEXT: separately authorize the bounded production document, citation,
Technical Profile entry and registry materialization requirements; do not
materialize or promote production data.

## 2026-09-19 — Generic materialization requirements authorization foundation

The prior CBR500R wave correctly failed closed because the repository had no
shared contract after `ProductionPromotionAuthorization/v1`. Added the
generic `MaterializationRequirementsAuthorization/v1` gate and Factory
exports. It recognizes the four existing requirement types, records generic
required input references, derives per-requirement `READY`, `PENDING` or
`BLOCKED` states and an aggregate readiness state, preserves upstream
lineage/provenance/applicability, canonicalizes deterministic output and
never permits or performs production mutation. Unknown, missing, duplicate,
malformed and blocked upstream inputs fail closed. No CBR500R persisted
requirement artifact, Ducati semantic change or production state changed.
NEXT: evaluate exactly `production-authorization.42dfc09d17938fb18e6dc92d`
through this generic boundary; do not materialize or promote production data.

## 2026-09-19 — CBR500R materialization requirements evaluation

Evaluated exactly `production-authorization.42dfc09d17938fb18e6dc92d` through
the generic `MaterializationRequirementsAuthorization/v1` gate. Persisted
result `materialization-authorization.75f4749897a97f42f0cfe4a9` is
`REQUIREMENTS-PENDING`: all four declared requirements are recognized, but no
CBR500R-specific production document, citation, profile-entry or registry
input reference exists in repository state. Required inputs and missing-input
reasons remain explicit; no input was fabricated. Lineage, Tier A provenance,
raw compound oil value, bounded applicability and ABS-known=true remain
unchanged. Human authorization remains required, materialization is false,
and no production or Rider Service Core state changed.
NEXT: resolve only the earliest missing `PRODUCTION-DOCUMENT-MATERIALIZATION`
inputs; do not materialize or promote production data.

## 2026-09-19 — Generic document and source-provenance reference foundation

Added generic non-production `DocumentDefinitionReference/v1` and
`SourceProvenanceReference/v1` contracts. They validate authenticated source
identity, document identity, HTTPS official paths, candidate/source-location
lineage, deterministic IDs and explicit non-production status; compatible
document/provenance pairs are required. The materialization requirements gate
now rejects arbitrary strings for document inputs and accepts only validated
typed refs; citation, Technical Profile and registry requirements retain their
existing pending behavior. No CBR500R reference artifact was created, no
materialization or promotion occurred, and no production/Ducati/Rider Service
Core state changed.
NEXT: reevaluate exactly `materialization-authorization.75f4749897a97f42f0cfe4a9` for only the document requirement using refs derived from its existing Honda lineage; do not materialize or promote production data.

## 2026-09-19 — CBR500R document requirement reevaluation

Constructed contract-valid non-production `DocumentDefinitionReference/v1`
`document-definition-ref.14e426a4de8c87bea90b0236` and
`SourceProvenanceReference/v1` `source-provenance-ref.2d572d0d8cc403d5c386ed8e`
from the existing authenticated Honda Tier A lineage. Re-evaluated only
`PRODUCTION-DOCUMENT-MATERIALIZATION`: it is `READY` with no missing inputs;
the aggregate remains `REQUIREMENTS-PENDING` because citation, Technical
Profile and registry requirements remain pending. No normalization, production
artifact, promotion or production change occurred. NEXT: resolve the earliest
remaining citation-materialization inputs; do not materialize or promote.

## 2026-09-19 — CBR500R citation requirement reevaluation

Added the minimal generic non-production `CitationDefinitionReference/v1` and
`SourceLocationReference/v1` contracts and integrated them into the existing
fail-closed materialization gate. Reused the existing
`DocumentDefinitionReference/v1` and `SourceProvenanceReference/v1`; the exact
Honda locator `lines:55-64;chars:731-1026` and `page: null` were preserved.
The CBR500R document and citation requirements are `READY`; Technical Profile
and registry requirements remain `PENDING`, aggregate state remains
`REQUIREMENTS-PENDING`, and no production artifact or promotion occurred.
NEXT: resolve the earliest remaining Technical Profile materialization inputs.

## 2026-09-19 — CBR500R Technical Profile identity foundation

Added generic non-production `TechnicalProfileDefinitionReference/v1` and
constructed `technical-profile-definition-ref.591043e27bf2c2519dbf4529` from
the repository-proven CBR500R target/catalog identity and bounded ABS
verification. The reference is deterministic, immutable and explicitly
`NOT-REGISTERED`; it carries no production profile ID or profile contents.
The CBR500R production profile and registry entry remain absent, and no
production data changed. NEXT: construct the bounded profile-entry definition
reference and reevaluate only the Technical Profile materialization
requirement.

## 2026-09-19 — CBR500R Technical Profile entry requirement reevaluation

Constructed exactly one deterministic non-production
`TECHNICAL-PROFILE-ENTRY-DEFINITION-REF` for the existing CBR500R
authorization, reusing `technical-profile-definition-ref.591043e27bf2c2519dbf4529`
and `citation-definition-ref.2a37207884a04eae3ec5f684`. The entry binds the
repository-proven target/catalog identity, `lubrication.engine-oil.specification`,
the unchanged compound text value, bounded applicability and the existing
authorization lineage. The document and citation requirements remain READY;
the Technical Profile entry requirement is READY; registry insertion remains
PENDING; aggregate materialization remains disabled. No production profile,
registry membership, materialization, promotion or Rider Service Core change
occurred. NEXT: resolve only the bounded `REGISTRY-INSERTION` inputs.

## 2026-09-19 — CBR500R registry requirement reevaluation

Added generic non-production `ApplicabilityReference/v1` and
`CatalogueIdentityReference/v1` contracts and supplied exactly those refs,
plus the existing `technical-profile-definition-ref.591043e27bf2c2519dbf4529`,
to the CBR500R `REGISTRY-INSERTION` requirement. The bounded applicability is
derived from `applicability-verification.08059a67abc9eb226cb3fc82`; target and
catalog identity remain `target.honda.cbr500r.pc70.2024.usa-canada` and
`honda.cbr500r.pc70`. All four requirements are now `READY`, but
`materializationAllowed` remains false and `productionCreated` remains false.
No CBR500R profile, registry membership, production artifact, promotion or
Rider Service Core change occurred. NEXT: design the bounded controlled
production-materialization authorization boundary; do not execute it.

## 2026-09-19 — Generic production materialization authorization boundary

Added the generic non-production `ProductionMaterializationAuthorization/v1`
boundary. It binds exactly one validated `MaterializationRequirementsAuthorization`
with all four requirements READY to an explicit typed human decision;
technical readiness alone remains pending and unauthorized. Missing, stale,
rejected or malformed decisions fail closed, while an explicit approval only
authorizes a future materializer and always leaves `productionCreated` false.
The CBR500R fully-ready requirement set is represented by one deterministic
pending projection; no human approval, document, citation, Technical Profile,
registry insertion, production mutation or promotion occurred. NEXT: perform
bounded human materialization authorization for this exact CBR500R requirement
set, then stop before materialization.

## 2026-09-19 — CBR500R human production-materialization authorization

Recorded exactly one explicit generic
`APPROVE-FOR-MATERIALIZATION` decision for the fully ready CBR500R PC70
MY2024 USA/Canada oil-specification lineage. Reviewer
`reviewer.revlog.operator` and the bounded rationale are preserved in the
deterministic authorization; the result is
`AUTHORIZED-FOR-MATERIALIZATION` with `materializationAllowed: true` and
`productionCreated: false`. No production document, citation, Technical
Profile, entry, registry membership, catalogue state or production technical
data changed. NEXT: design and execute the first bounded controlled
production materializer for this exact authorized lineage only.

## 2026-09-19 — Generic production document materializer foundation

Added the generic deterministic production-document materializer bound to
`ProductionMaterializationAuthorization/v1`. It validates the explicit
authorization, exact document requirement, typed document/provenance refs,
source identity, target lineage and production document definition before
writing through an explicit store interface. Identical existing documents are
reused; conflicting duplicates fail closed; result IDs are deterministic and
the executor never cascades to citation, Technical Profile or registry
requirements. All execution tests use synthetic documents only. No CBR500R or
other real production document changed. NEXT: rerun only the CBR500R document
materialization through this generic executor.

## 2026-09-19 — CBR500R production document materialization

Executed exactly one real `PRODUCTION-DOCUMENT-MATERIALIZATION` for the
authorized CBR500R PC70 MY2024 USA/Canada lineage. The authenticated Honda
Tier A owner manual `31MLRB00 / 00X31-MLR-B000` was created as production
document `doc.97c1a14816208eaedcccd588`; the generic executor's repeated run
returned REUSED with no duplicate. No citation, Technical Profile entry or
registry insertion occurred, and no raw value, applicability, Rider Service
Core or unrelated production data changed. NEXT: materialize only the
production citation for this same lineage.

## 2026-09-19 — Generic production citation materializer foundation

The real CBR500R citation wave stopped fail-closed because the repository had
no generic controlled citation executor. Added the motorcycle-agnostic
`ProductionCitationMaterialization/v1` contract and explicit store-bound
executor with typed citation/document/location/provenance validation,
deterministic IDs, CREATE/REUSE idempotence and conflicting-duplicate
rejection. Synthetic fixtures cover authorized and negative paths only; no
CBR500R or other production citation changed. NEXT: rerun only the bounded
CBR500R production-citation materialization through this executor.

## 2026-09-19 — CBR500R production citation materialization

Executed exactly one `PRODUCTION-CITATION-MATERIALIZATION` for the authorized
Honda CBR500R PC70 MY2024 USA/Canada lineage. Created production citation
`cite.44cd7d15b9c97a991b87056f` bound to document
`doc.97c1a14816208eaedcccd588`, preserving the authenticated Tier A source,
typed provenance and exact locator `lines:55-64;chars:731-1026` with
`page: null`. The repeated execution returned REUSED with no duplicate. No
Technical Profile entry, registry membership, normalization, raw-value or
unrelated production change occurred. NEXT: materialize only the CBR500R
Technical Profile entry.

## 2026-09-19 — Generic Technical Profile entry materializer foundation

The CBR500R Technical Profile entry wave stopped fail-closed because no
generic controlled entry executor existed. Added the motorcycle-agnostic
`ProductionTechnicalProfileEntryMaterialization/v1` contract and explicit
profile-store executor. It validates the exact authorization and requirement,
typed intended-profile/entry/citation references, existing production profile
container, document/citation bindings and authorized value/applicability;
CREATE/REUSE, deterministic results, conflicts and missing containers fail
closed. Synthetic tests only; no CBR500R entry, registry membership or other
production profile changed. NEXT: rerun only the bounded CBR500R Technical
Profile entry materialization through this executor.

## 2026-09-19 — Generic Technical Profile container materializer foundation

The real CBR500R entry wave found no compatible production Technical Profile
container and no generic lifecycle owning its creation. Added the generic
`ProductionTechnicalProfileContainerMaterialization/v1` boundary with typed
intended-profile validation, explicit profile-store creation, deterministic
CREATE/REUSE results, conflict safety and an invariant that registry
membership remains `NOT-REGISTERED`. Synthetic tests only; no CBR500R profile,
entry, registry membership, document or citation changed. NEXT: resolve the
exact CBR500R profile-container prerequisite, then rerun the entry boundary.

## 2026-09-19 — CBR500R Technical Profile container materialization

Executed the authorized CBR500R container boundary through the generic
ADR-043 executor. Created exactly one empty production container with the
repository-derived identity `honda.cbr500r.pc70.2024` at
`data/technical/honda/cbr500r/pc70/profile-2024.js`; the repeat path returned
`REUSED` with the same deterministic result. No oil entry, registry membership,
document/citation mutation or unrelated profile change occurred. The inherited
Honda source document retains its historical `Canada` region token despite the
profile validator flagging it; this wave did not normalize or rewrite it.
NEXT: materialize only `lubrication.engine-oil.specification` through the
separate Technical Profile entry boundary.

## 2026-09-19 — CBR500R oil Technical Profile entry materialization

Materialized exactly one authorized production entry,
`lubrication.engine-oil.specification`, in
`honda.cbr500r.pc70.2024`. ADR-042 returned `CREATED` on the bounded empty
container and `REUSED` on the exact repeat; the deterministic result was
`production-technical-profile-entry-materialization.0b6d9ea6dd5e5b23aa150a26`.
The entry preserves the authorized Honda Tier A value, document
`doc.97c1a14816208eaedcccd588`, citation `cite.44cd7d15b9c97a991b87056f`,
target applicability and verified ABS semantics. The profile remains
`NOT-REGISTERED`; registry insertion, document/citation changes and unrelated
production changes did not occur. NEXT: REGISTRY-INSERTION only.

## 2026-09-19 — Generic registry-insertion materializer foundation

The bounded CBR500R registry wave inspected the existing typed registry-input
references and production registry API and confirmed that no generic controlled
`REGISTRY-INSERTION` executor existed. Real CBR500R registration was therefore
stopped fail-closed. A motorcycle-agnostic registry-insertion result contract
and executor were added with typed applicability/catalogue/profile validation,
explicit existing-profile and registry stores, deterministic `CREATED`/`REUSED`
semantics, conflict rejection and no cascade into profile contents. Synthetic
tests cover authorization, identity, membership, conflict, idempotence and
immutability; no CBR500R registry membership or production data changed.
NEXT: rerun only CBR500R `REGISTRY-INSERTION` through the new generic executor.

## 2026-09-19 — CBR500R registry insertion

Executed exactly `REGISTRY-INSERTION` for `honda.cbr500r.pc70.2024` through
the ADR-044 generic executor. The production registry gained one descriptor
with catalog key `honda.cbr500r.pc70`, MY2024 and module path
`data/technical/honda/cbr500r/pc70/profile-2024.js`; the exact repeat returned
`REUSED` with the same deterministic result ID and no duplicate. The existing
oil entry, Honda document/citation, VFR, Ducati and Rider Service Core remained
unchanged. The known Canada validator issue was not repaired. No Supabase,
deployment or unrelated production change occurred. No further wave was
executed.

## 2026-09-19 — CBR500R runtime and validator compatibility repair

The CBR500R browser/runtime module was added to the existing application and
integrity-harness load order used by VFR and Ducati: authenticated Honda
documents load before the self-registering profile module. The exact
validator errors were repaired in CBR production metadata only: source
regions use canonical `USA`/`CA`, and the oil entry uses boolean `abs: true`
and an equipment string array. No validator rule or CBR-specific exception
was added. A minimal generic entry-materializer compatibility check preserves
fail-closed semantic applicability validation between readiness states and
canonical production fields; the CBR production input is derived from the
corrected typed profile entry. Deterministic CBR reports were regenerated.
Targeted tests passed 77/77; the full suite passed 916/923 with 3 skipped in
the sandbox and the one permitted host rerun passed 920/923 with 0 failures.
No VFR, Ducati, Rider Service Core, Supabase, deployment or unrelated data
changed. NEXT remains only the already-defined CBR500R `REGISTRY-INSERTION`
follow-up; it was not executed.

## 2026-09-19 — Mass-scale readiness audit

Completed a read-only repository audit against HEAD `46376913e3351edaf5c2719f2a71549ee3e52a6e`. Confirmed the executable catalogue inventory at 13 manufacturers, 318 families, 1,095 variants and 5,317 variant-years (MY1990–2025), three valid runtime-discoverable production profiles, and the frozen Rider Service Core at 95 fields / 14 domains. Existing bounded Factory stages, checkpoints, source prospects, pilot reports, typed materialization executors and their boundaries were inventoried. The audit found no complete Catalogue → applicability-aware Coverage Inventory → Research Queue bridge, no automatic untouched-motorcycle source discovery, and no multi-motorcycle production coordinator. No production, runtime, catalogue or research data changed. Durable report: `docs/project/MASS_SCALE_READINESS_AUDIT.md`. NEXT is a read-only deterministic coverage/queue projection only; no motorcycle was selected or started.
## 2026-09-19 — Catalogue coverage and queue projection foundation

Added the generic read-only `revlog-catalogue-coverage-queue/v1` projection and
its deterministic report over all 5,317 catalogue variant-years. The projection
reuses stable catalogue keys, the 95-field/14-domain Rider Service Core,
existing research evidence/gap outcomes and source-prospect classifications.
Market, ABS, transmission and equipment remain explicit UNKNOWN dimensions;
ambiguous duplicate source identity is unresolved rather than upgraded to
ready. Current output contains 3 production-profile targets, 5,314 without a
profile, 10 blocked sources, 21 exhausted sources, 5,286 unresolved sources
and zero planning candidates. No source was acquired, no research was run and
no production/runtime/registry state changed. NEXT: bounded read-only
approximately-10-motorcycle planning pilot; it was not executed.

## 2026-09-19 — Source discovery / prospect registration foundation

Added the generic non-production `SourceDiscoveryProspect/v1` boundary and
synthetic deterministic report. A queue target can now remain explicitly
UNRESOLVED, move through DISCOVERED and AUTHENTICATED-BUT-APPLICABILITY-PARTIAL
states, and adapt to the existing `SourceProspect/v1` only at
EXECUTION-READY. Duplicate candidates are reused and conflicting route or
identity/publication candidates fail closed. No real motorcycle source was
discovered, acquired or registered; no research, evidence, review, promotion,
production, catalogue or runtime state changed. ADR-045 records the boundary.
NEXT is a bounded real source-discovery pilot on a very small set; it was not
executed.
