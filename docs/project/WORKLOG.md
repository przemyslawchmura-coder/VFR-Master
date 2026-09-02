# Engineering worklog

Historical entries reconstructed from git; newest first.

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
