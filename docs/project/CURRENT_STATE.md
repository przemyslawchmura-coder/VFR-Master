# Current project state

> **THIS DOCUMENT DESCRIBES CURRENT PROJECT STATE. HISTORICAL CLAIMS DO NOT OVERRIDE IT.**

Snapshot date: 2026-09-20
Snapshot basis: Technical Research Factory Throughput v2 Wave A deterministic baseline at the current bounded-wave commit.

- Phase 6 promotion foundation: generic `PromotionPacket/v1` and fail-closed `PROMOTION-READY`/`BLOCKED` gate are implemented and exported from `research/factory/index.js`. The foundation preserves raw values/units/provenance, rejects unresolved/non-accepted processing states and insufficient scope, and performs no production conversion, evidence write, registry insertion or automatic promotion.
- Held promotion projection: the real 27 Ducati and 13 BMW pre-promotion records were read-only projected through `PromotionPacket/v1`; Ducati produced 27 `PROMOTION-READY`, BMW 11 `PROMOTION-READY` and 2 `BLOCKED` conflict records. Upstream research objects and all production state remained unchanged.
- Promotion review packet foundation: generic immutable `PromotionReviewPacket/v1` creation now presents only `PROMOTION-READY` records as `PENDING-PROMOTION-REVIEW`; held-record projection derives 27 Ducati and 11 BMW eligible packets, excludes both BMW conflicts, and creates zero approval decisions. Research Human Review ACCEPT remains distinct from promotion approval.
- Ducati promotion review batch: exactly seven existing Ducati packets received one explicit `APPROVED-FOR-CONVERSION` decision for the requested low-ambiguity fields; 20 Ducati packets remain `PENDING-PROMOTION-REVIEW`. No BMW decision, schema conversion, evidence, coverage or production change occurred.
- Ducati schema-conversion projection closeout: repository validation supports a distinct `electrical.battery.capacity` quantity entry (`6.5 Ah`) alongside `electrical.battery.specification` as `consumable-part`; 6 projections are `CONVERSION-READY` and cooling remains the sole `CONVERSION-BLOCKED` mapping because circuit scope is not proven equivalent to engine/radiator scope.
- Ducati production-promotion authorization foundation: exactly the six `CONVERSION-READY` projections are read-only `AUTHORIZATION-READY`; cooling is excluded, and future document/citation/profile/registry materialization remains explicit and separate. No production artifacts or upstream research changes were made.
- Ducati production materialization/promotion: one authenticated MY2021 EU owner-manual definition, six exact source citations and the registered `ducati.monster937.2021` review-status profile with six verified entries now exist; normal registry/loader discovery succeeds, while evidence and Service Core coverage remain unchanged.
- Ducati registry insertion validation: the exact catalogue key `ducati.monster.937` is registered only for MY2021 via `data/technical/ducati/monster937/profile-2021.js`; normal loader and resolver paths resolve all six entries, with cooling, pending fields and BMW excluded.
- Phase 6 rollback/governance closeout: the exact Ducati promotion has an immutable fail-closed rollback record. Rollback is eligible only to remove Ducati registry exposure and restore the prior VFR-only set; the profile, source graph and research/promotion history are retained, and no rollback was executed.
- Phase 6 completion audit: the stated exit criteria all pass — one deliberate Ducati profile addition, production discovery/resolver/runtime regressions, and a deterministic rollback target. Phase 6 is COMPLETE; pending Ducati/BMW work and cooling remain future bounded expansions.
- Phase 7 transition: Cloud/deployment hardening is ACTIVE. The live ownership/RLS migration was applied and post-migration verification passed; general production smoke coverage exists, and post-repair password-recovery verification is now closed after the operator-assisted production smoke test.
- Phase 7 live-safe cloud/deployment audit: repository evidence shows client-side auth and cloud persistence paths, while deployment reproducibility and remaining external operational boundaries stay explicit. Live ownership/RLS parity and the production user journey are operator-verified; no auth setting was changed by this closure.
- Phase 7 Supabase reproducibility baseline: migration `20260903170109_ownership_rls_live_parity_hardening.sql` defines the live-parity hardening for the existing `motorcycles`/`service_records` tables. It preserves unrelated schema, removes random `user_id` defaults, adds the composite ownership constraint and replaces the recorded `users_can_*` policies with canonical authenticated RLS policies. It is applied and verified.
- Phase 7 Supabase migration identifier normalization: repository migrations now use unique 14-digit ordering identifiers — `20260828000000_create_runtime_tables.sql`, `20260829000000_add_technical_clarification.sql` and `20260903170109_ownership_rls_live_parity_hardening.sql`. The first two identifiers extend repository chronology only and do not claim historical production execution; the ownership identifier is the exact authoritative live version. SQL semantics are unchanged, focused ordering/contract tests pass, clean replay remains unproven, and production history has not been reconciled.
- Phase 7 Supabase local clean replay: the normalized three-migration chain was replayed twice from fresh local state on PostgreSQL 17. All migrations applied in order, local migration list and lint passed, and read-only schema inspection matched supplied production runtime facts for columns, defaults/nullability, constraints, RLS and eight ownership policies. No seed file exists or was required. Production migration history remains unreconciled and no production migration command is authorized.
- Phase 7 leaked-password protection: live verification for Supabase project `vfr-master` confirms Auth > Attack Protection > Prevent use of leaked passwords is disabled; Supabase reports the setting is available only on Pro plan and above. Protection is externally blocked by the current Free plan, not an unresolved repository defect; no application runtime, password policy or Supabase configuration was changed.
- Phase 7 password recovery: repository-side recovery request, callback/session guard and new-password flow are implemented using Supabase Auth v2. The original startup race was discovered and repaired in `a5e1639`; an operator-assisted production smoke test after the repair passed: reset request, email delivery, legitimate callback to the GitHub Pages path, reset UI authorization, password update, new-password login, old-password rejection and marker-only fail-closed behavior all succeeded. The browser console was not independently inspected, and the Dashboard allow-list remains an external configuration boundary.
- Phase 7 deployment/recovery hardening: production reset requests now require an explicit operator-provided HTTPS callback URL, while localhost-only development may derive its current path. Recovery UI requires a Supabase `PASSWORD_RECOVERY` event with a bound session user ID; URL markers, ordinary sessions, malformed callbacks and identity mismatches fail closed. Password updates remain locally validated, single-flight and recoverable on failure. The deployment contract is documented without guessing the production host; no deployment or live Supabase change occurred.
- Historical operator smoke-test record: the earlier general production journey remains retained in `WORKLOG.md` as historical evidence. The later post-repair operator-assisted recovery verification supersedes its previously open recovery conclusion.
- Production Readiness P1 live E2E verification: CLOSED / `ACCEPT` after the post-repair operator-assisted production password-recovery smoke test. This closes only the tested recovery boundary; it does not prove unrelated Supabase Dashboard configuration.
- Technical Profile presentation localization: a centralized render-time Polish mapping now covers production categories, common field labels, statuses and authenticated source titles/sections. Canonical identifiers, values, resolver output and profile semantics remain unchanged; Ducati remains at exactly 45 promoted verified entries.
- Ducati MY2021 VFR-aligned coverage expansion: the profile now carries all 15 VFR taxonomy categories, with data in lubrication, ignition, brakes and electrical. It still has exactly six verified entries; no additional field was safely promotable, cooling remains blocked by circuit-scope applicability, and 20 candidates remain pre-promotion. Phase 7 remains ACTIVE.
- Rider Service Core and Source Trust Model: the permanent owner-first Core taxonomy, official-primary trust rule, same-publication identity-verification distinction, independent technical cross-check rule, zero-inference rule and future “Instrukcja źródłowa” contract are documented. This is a priority/coverage layer; existing VFR/Ducati technical data and profile semantics remain unchanged. Future source-link presentation and Garage/Service maintenance-due integration are deferred while Phase 7 remains ACTIVE.
- Ducati Monster 937 MY2021 Rider Service Core acquisition: the exact official `OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf` was re-inspected for Core-relevant pages. The inventory contains the prior 27 candidates plus 44 newly queued direct-page candidates (71 total), all scoped to EU MY2021 common base Monster 937 with ABS/manual applicability. The official Ducati owner-manual library verified document identity; no independent technical cross-check was found in the bounded Ducati-controlled search. Cooling specification/interval remain supported, while cooling capacity remains blocked by `COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR`. Production remains exactly six Ducati entries, evidence/coverage remain unchanged, and no promotion occurred.
- Ducati Monster 937 Rider Service Core human review: exactly the 44 newly queued candidates received one deterministic canonical-vocabulary decision. 39 are `ACCEPT` for future processing, 5 are `NEEDS-MORE-REVIEW` for incomplete payload/GVWR, main-fuse rating, DRL applicability, LED replaceability and mixed initial-service semantics, and 0 are rejected. The prior cooling-capacity blocker remains unchanged and outside this batch; no evidence, production, VFR or Service Core coverage state changed.
- Ducati Rider Service Core evidence processing: the shared factory is now aligned to the manufacturer-neutral 14-domain Rider Service Core matrix. The same 39 existing `ACCEPT` decisions are consumed exactly once and all 39 produce `ACCEPTED-FOR-PROCESSING` records; the five deferred review candidates and cooling capacity remain excluded. Raw values, structured maintenance/fuse/lighting associations, provenance and applicability are preserved; no evidence, production, VFR or coverage state changed.
- Ducati Rider Service Core promotion readiness: all 39 aligned `ACCEPTED-FOR-PROCESSING` records receive exactly one read-only outcome. The canonical gate passes identity, source, provenance, applicability and conflict checks, but final readiness is `0 PROMOTION-READY / 39 production-representation-blocked` because no lossless production mappings are established. The fuse record additionally lacks preserved structured rating/function/location metadata and remains fail-closed. The five deferred candidates and cooling remain excluded; Ducati production remains exactly six entries.
- Generic Rider Service Core production representation: an additive manufacturer-neutral `revlog-rider-service-core-record/v1` contract now supports scalar, structured and repeating records with shared applicability/provenance. Maintenance actions, fuse rating/function/location associations, lighting LED semantics and other repeated owner-service records can be carried losslessly without promotion. The existing 39 Ducati processed inputs are representable in a read-only projection; no Ducati/VFR production data changed and the prior readiness result remains historical until separately rerun.
- Fixed Rider Service Core presentation matrix: the default Technical Profile UI now renders the single shared `js/technical/technical-profile-core-matrix.js` contract — 14 domains, 95 stable field IDs and deterministic order — for both Ducati Monster 937 MY2021 and Honda VFR800 VTEC MY2002. Verified values are preserved; missing cells render exactly `Brak danych`; extra canonical records remain stored but do not add Core rows. Canonical profile values, provenance, resolver behavior and registry remain unchanged. Phase 7 remains ACTIVE.
- VFR Rider Core applicability cleanup: the frozen 95-field projection now marks unresolved ABS fuse alternatives, regional headlight variants and JP-only Dual CBS as `blocked-applicability` while preserving safe universal/selected values and source provenance. Standard/VTEC valve clearances remain separately labelled; the universal standard spark plug remains available and its cold-climate alternative is not projected. VFR Core is 32 verified / 60 missing / 3 blocked / 0 not-applicable. VFR remains at 99 canonical entries, Ducati at 45; canonical profiles, registry identity and matrix IDs/order remain unchanged. No new context fields, research, evidence or promotion occurred. Phase 7 remains ACTIVE.

- Post-BMW/Triumph Phase 5 reassessment: repository-known supply is `EXHAUSTED-OR-BLOCKED`; 18 prospect records were reassessed, with 2 held pre-promotion, 4 access-blocked, 2 applicability-blocked, 6 exhausted, 2 mismatched and 2 explicitly deferred. No viable next prospect-registration target was selected.
Verified baseline before this memory reconciliation wave: `HEAD` and `origin/main` were both `6d72a97ca8bcc761d73b9654aefc0aaf9b91a2f5`; relation was ahead 0, behind 0. The reconciliation commit created by this wave is intentionally local and will make `main` ahead of `origin/main` until separately pushed.

## Architecture and runtime

RevLog is an offline-first browser application loaded from `index.html`. It contains authentication/cloud adapters, garage and service-history persistence, a catalogue-driven motorcycle selector, clarification flow, a resolver-backed Technical Profile runtime, technical search, and an About/release surface. Supabase is an optional runtime backend; live configuration is not verified by this repository snapshot.

Research is quarantined under `research/` and is not imported by the production browser entry point. `js/research/` is tooling/test support, not production profile data.

## Current facts

- Catalogue inventory: 13 manufacturers, 318 families, 1,095 variants, 5,317 variant-years, MY1990–2025. Catalogue infrastructure/identity is mature for the tested scope; global catalogue content coverage remains incomplete and has no defensible percentage denominator.
- Production Technical Profiles: 2 registered real profile modules, VFR800 MY2002 (99 entries) and Ducati Monster 937 MY2021 (45 verified entries).
- Research schema: 183 canonical fields; Service Core: 44 fields.
- Honda Service Data Wave 1 population: 8 targets and 51/352 aggregate Service Core slots (the denominator is specifically 8 × 44).
- VFR800: 13/44, 24 source-identity-uncertain rows, `RESEARCH-MORE`.
- CBR500R: 26/44, `SERVICE-CORE-PARTIAL`.
- Mass-scale readiness audit: the catalogue is structurally deterministic at 13 manufacturers, 318 families, 1,095 variants and 5,317 variant-years, but a complete Catalogue → applicability-aware coverage inventory → Research Queue bridge is not implemented. Individual bounded Factory stages and ADR-040–044 materializers exist; automatic source discovery and multi-motorcycle production orchestration do not. The next safe scale step is a read-only coverage/queue projection, not another motorcycle or production wave.
- Mass-scale coverage/queue foundation: `research/factory/catalogue-coverage-queue-contracts.js` now projects all 5,317 catalogue variant-years into read-only production/Core coverage, existing research-gap and source-prospect states. It preserves UNKNOWN market/ABS/transmission/equipment dimensions and fails closed on ambiguous identities. Current projection: 3 production-profile targets, 5,314 absent, 10 source-blocked, 21 exhausted and 5,286 unresolved; no source-ready queue candidate exists. No research or production state changed.
- CBR500R production state: the authorized document, citation, profile
  container and oil entry exist; the profile is registered exactly once
  through ADR-044 with deterministic `CREATED`/`REUSED` semantics. The
  CBR500R browser/runtime module is loaded through the existing VFR/Ducati
  self-registration path. Its production metadata uses canonical region
  `CA`, canonical entry applicability types (`abs: true` and an equipment
  array), and passes the existing validator/loader without exceptions. The
  profile contents, document, citation, VFR, Ducati and Rider Service Core
  data remain unchanged semantically.
- Honda Batch Wave 2 population: 12 selected catalogue targets, 528 target-field slots, 6 underlying documents, 6 new verified slots; all gains were generic engine specification fields and practical-service-field gain was 0.
- High-value source-acquisition pilot: `ACCEPT-WITH-RISKS`; five targets, 51/220 → 101/220 verified target slots, +50 total, +48 practical and +2 generic slots; 5 Tier A documents, 2 yielding, 6 hosting locations, 1 duplicate location, 52 evidence rows, 0 conflicts. Coverage is edition-scoped: NC750X MY2021–2023 and CBR600RR MY2024 yielded evidence; CBR500R, VFR800 and Africa Twin yielded none.
- Post-pilot scaling reassessment: `ACCEPT-WITH-RISKS`; ten repository-known candidates across seven manufacturers were evaluated. The next batch is two Yamaha targets with registered service-rich Tier A owner manuals: `yamaha.mt-09.gen3` MY2021 EU standard and `yamaha.tenere-700.gen1` MY2019 EU standard. Each starts at 0/44 verified Service Core; expected combined practical gain is 36–48, with success gated at +24 verified/+22 practical, zero unresolved safety-critical conflicts and at most two primary documents per target. No evidence was acquired.
- Yamaha transfer acquisition: `ACCEPT-WITH-RISKS`; two authenticated Tier A Yamaha owner manuals yielded 58 rows and 58 new Service Core slots, including 54 practical and four generic tire-size slots. MT-09 MY2021 EU standard and Ténéré 700 MY2019 EU standard each moved 0/44→29/44 from one unique document. There were zero conflicts, zero Tier C/D contribution, no duplicates and no budget overrun. Later generation years and excluded SP/named-equipment variants remain uncovered.
- Post-Yamaha transfer-batch design: `ACCEPT-WITH-RISKS`; ten serious candidates across eight manufacturers were evaluated using risk-adjusted expected marginal practical gain per primary document. Five UNKNOWN prospects remained unranked. The sole selected target is `harley-davidson.revolution-max.sportster-s`, MY2022 USA, against registered official owner manual `94001064`, with one document, +8 verified/+6 practical gates and fail-closed model/ABS/equipment applicability. No evidence or coverage changed.
- Harley-Davidson transfer acquisition: `REJECT`; official publication `94001064` reauthenticated as the MY2023 Sportster RH Models owner manual and official parts indexing links it to RH1250S, but it cannot support the selected MY2022 scope and its official content endpoint returned HTTP 403. Authentication stopped extraction. Coverage remained 0/44 with zero verified, practical and generic gain; no researched-no-evidence rows were claimed, conflicts and Tier C/D contribution were zero, and the one-document budget was respected.
- Source-prospect authentication-quality reassessment: `ACCEPT-WITH-RISKS`; 18 records across eight manufacturers were classified through a deterministic readiness gate. One metadata-level prospect is execution-ready: Ducati Monster 937 MY2021 EU base owner manual. Six previously inspected sources are exhausted/low-marginal-yield; unresolved and rejected prospects remain fail-closed. No technical evidence or coverage changed.
- MT-09 service-manual prospect authentication: `ACCEPT-WITH-RISKS`; final readiness is `ACCESS-BLOCKED`. Yamaha US metadata authenticates `LIT-11616-34-61` for the MY2021 MT-09 and names the corrected dealer-system manual, but the complete content route requires purchase/authentication. No Yamaha-controlled EU path for `B7N-28197-E0` was authenticated, B7N/LIT equivalence is unresolved, and MY2021 EU plus standard/SP/ABS/equipment safety scope remain blocked. No technical values, evidence rows, researched-no-evidence states or coverage changed.
- MT-09 publication-code/EU reconciliation: `ACCEPT-WITH-RISKS`; relationship is `RELATIONSHIP-UNRESOLVED`, readiness remains `ACCESS-BLOCKED`, and the anti-loop result is `MT09-AUTHENTICATION-PATH-EXHAUSTED`. Yamaha Europe proves `MTN890` = standard MT-09 and `MTN890D` = MT-09 SP, but no Yamaha-controlled B7N record, B7N/LIT relationship or EU service-manual applicability was found. No technical evidence or coverage changed.
- Ducati Monster 937 prospect registration: `ACCEPT-WITH-RISKS`; `unknown.ducati.monster937` is authenticated as a Tier A `Monster 937 Owner's Manual` through Ducati's official owner-manual selector for MY2021 EU base Monster 937, with Monster SP 937 excluded. Official metadata resolves ABS and manual six-speed transmission applicability; readiness passes. No manual content or technical values were inspected, and no evidence, coverage or production state changed.
- Ducati Monster 937 MY2021 EU owner-manual acquisition: `ACCEPT-WITH-RISKS`; the exact Ducati-controlled `OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf` was confirmed before inspection. Extraction produced 27 unnormalized raw candidates for common base Monster 937 fields, all queued without human decisions; evidence rows and Service Core coverage remain 0/44, with zero practical/generic gain, conflicts or ambiguous fields. No second primary document, Tier C/D source or production change was used.
- Ducati Monster 937 MY2021 EU human review: `ACCEPT-WITH-RISKS`; all 27 queued candidates received explicit `ACCEPT` decisions through the Review Queue/Human Review Decisions contracts. Raw values and page/section provenance remain unchanged; unresolved/ambiguous count is 0, evidence rows remain 0, Service Core remains 0/44, and no normalization, conflict resolution, researched-no-evidence or production change occurred.
- Ducati Monster 937 MY2021 EU evidence processing: `ACCEPT-WITH-RISKS`; the canonical Evidence Processing contract produced 27 records: 27 `ACCEPTED-FOR-PROCESSING`, 0 `CANNOT-ADVANCE`, 0 rejected, 0 needs-review and 0 ineligible. No conflicts were detected; raw values/provenance remained unchanged, evidence rows remained 0, Service Core remained 0/44, and production was unchanged.
- Kawasaki Ninja 650 II prospect registration: `ACCESS-BLOCKED`; selected representative target is MY2020 EU standard road model with manual transmission and ABS. Kawasaki Europe links to the official K-TISC owner-manual route, but the route currently redirects in a loop and no exact EU MY2020 document identity was authenticated. Source year/market applicability remains unresolved; no technical values, candidates, downstream records, evidence, coverage or production state changed.
- BMW F 900 R I prospect registration: `ACCEPT-WITH-RISKS`; selected representative target is MY2020 EU standard road model with manual transmission and ABS. The official BMW Motorrad Tier A rider manual `F_0K11_RM_0520_76.pdf` authenticates base F 900 R model code 0K11; F 900 R A2 0K31, F 900 XR and unrelated BMW models are excluded. Canonical readiness is `EXECUTION-READY`; no technical values, candidates, downstream records, evidence, coverage or production state changed.
- BMW F 900 R I MY2020 EU owner-manual acquisition: `ACCEPT-WITH-RISKS`; the exact authenticated BMW Motorrad `F_0K11_RM_0520_76.pdf` was acquired and inspected through the Factory execution/extraction path. It produced and queued 13 immutable raw candidates with exact raw values/units, PDF page/section provenance and explicit 0K11/base-road applicability; A2 and XR were excluded. No evidence rows or Service Core coverage were created; no conflicts or ambiguous candidates were detected and production was unchanged.
- BMW F 900 R I MY2020 EU human review: `ACCEPT-WITH-RISKS`; exactly the 13 existing BMW Review Queue entries received explicit `ACCEPT` decisions through the canonical Human Review Decisions contract. Raw values, units, applicability and provenance remained unchanged; unresolved/ambiguous count is 0, evidence rows remain 0, Service Core remains 0/44, and no normalization, conflict resolution or production change occurred.
- BMW F 900 R I MY2020 EU evidence processing: `ACCEPT-WITH-RISKS`; the canonical processor created 13 records from the existing 13 decisions: 11 `ACCEPTED-FOR-PROCESSING` and 2 `CANNOT-ADVANCE` for the same-field solo tire-pressure raw-value disagreement. No conflicts were resolved; raw values/provenance and Human Review Decisions remained unchanged, evidence rows remain 0, Service Core remains 0/44, and production was unchanged.
- Triumph Street Triple 765 III metadata resolution: `ACCEPT-WITH-RISKS`; bounded Triumph-controlled metadata confirms the authenticated Tier A `3850186_2-EN` handbook (issue 2, June 2023), ABS and manual-transmission dimensions, but does not resolve explicit EU applicability, the combined S 660/R/R LRH/RS equipment boundary, or a safe mapping of `triumph.street-triple.765-3` to one equipment identity. Canonical readiness remains `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`; no technical values or downstream research were performed.
- Ténéré BW3-F8197-E0 public applicability-authentication path: `TENERE-APPLICABILITY-AUTHENTICATION-PATH-EXHAUSTED`; no repetition is justified without genuinely new Yamaha-controlled material or authenticated RMI/manual access. The prospect remains `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`, with authenticity verified, content inaccessible, canonical readiness blocked, and exact MY2019, EU, standard-versus-named-equipment, ABS and manual-transmission applicability unresolved. The source remains a `FACTORY-PILOT-CANDIDATE`, but is not execution-ready. No service values, candidates, queue records, decisions, processing records, evidence, researched-no-evidence, coverage, production, runtime, catalogue or cloud state changed.
- Suzuki SV650 III prospect authentication: `ACCEPT-WITH-RISKS`; existing `unknown.suzuki.sv650` is now an authenticated Tier A `SV650/A/XA (L7-M4)` service-manual prospect through Suzuki’s European Service Portal, targeting EU `SV650A L9` MY2019. Content remains inaccessible and readiness is blocked because exact year/document binding, standard-versus-X, ABS separability and manual-transmission applicability are incomplete. No service values, evidence, coverage or production state changed.
- Technical Research Factory architecture: `ACCEPT-WITH-RISKS`. Existing generic validation, Service Core, document identity/deduplication, limited normalization, conflict/coverage/yield and reporting capabilities are reusable, but target/prospect contracts, a canonical readiness/applicability gate, deterministic orchestration, budgets, stable attempt/event identity, checkpoint/resume and typed review state are not yet integrated. The durable design defines a generic core with optional discovery adapters, a five-wave incremental implementation, and keeps research-to-production promotion manual. Ténéré `BW3-F8197-E0` remains a blocked factory-pilot candidate after metadata authentication; no technical evidence or coverage changed.
- Technical Research Factory Foundation #1: `ACCEPT-WITH-RISKS`. Contract version 1 implements manufacturer-neutral `ResearchTarget`, `SourceProspect`, `ApplicabilityScope` and `GapPlan` validation, deterministic JSON serialization, one dimension-preserving fail-closed applicability evaluator, one ADR-012 readiness gate, and shape adapters for existing targets/prospects/acquired sources. Real Honda, Yamaha, Harley mismatch and Ténéré blocked records exercise the API. Historical gates remain behind adapters pending bounded migration; orchestration is not implemented. No research evidence or coverage changed.
- Technical Research Factory Orchestrator Foundation: `ACCEPT-WITH-RISKS`. Orchestration schema 1 adds deterministic semantic IDs, immutable append-only events, a pure replay reducer, bounded attempts, terminal transition enforcement and version/digest-verified checkpoints. Existing Honda/Yamaha exhausted, Harley mismatch and Ténéré blocked records replay without mutation; Foundation readiness remains authoritative. Durable event storage and planning/external-result ingestion remain deferred. No research evidence or production state changed.
- Technical Research Factory Execution Planner: `ACCEPT-WITH-RISKS`. Planner schema 1 deterministically maps canonical targets, GapPlans, prospects, readiness, explicit capabilities and finite policy into existing Orchestrator batch/work contracts. Decisions preserve missing/conflict/researched-no-evidence and classify planned/deferred/rejected/blocked/not-needed with typed reasons. Existing Honda/Yamaha/VFR are deferred, Harley rejected and Ténéré blocked; the planned path uses a synthetic local fixture because no current prospect is execution-ready. Capability provenance and typed execution-result ingestion remain deferred. No external research, evidence or production state changed.
- Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation: `ACCEPT-WITH-RISKS`. Execution schema 1 defines validated acquisition requests/outcomes/artifacts/observations, synthetic local adapters for all closed outcomes, bounded retry classification, untrusted-output validation, and canonical Orchestrator event mapping with checkpoint-safe idempotency. `ACQUIRED` remains pre-evidence and `NO-EVIDENCE` remains distinct from researched-no-evidence. Real Honda/Yamaha/VFR/Harley/Ténéré work remains gated; only a synthetic local ready work item executes. No external research, evidence or production state changed.
- Technical Research Factory Extraction Agent / Local Extractor Adapter Foundation: `ACCEPT-WITH-RISKS`. Extraction schema 1 binds one canonical successful `ACQUIRED` result and synthetic UTF-8 content envelope to acquisition metadata before invoking one deterministic local adapter. Raw candidates preserve unnormalized values, units, locations, explicit applicability/context and canonical target/work/attempt/prospect/artifact provenance. Candidate IDs and ordering are semantic and deterministic. Extraction emits no Orchestrator events, consumes no acquisition attempts, changes no acquisition state, creates no evidence, and starts no Review Queue.
- Technical Research Factory Review Queue Foundation: `ACCEPT-WITH-RISKS`. Review Queue schema 1 creates one immutable `QUEUED` entry per candidate from validated `CANDIDATES-PRODUCED` extraction results, preserving the complete raw candidate and canonical provenance. Exact duplicates collapse only when byte-equivalent; identity collisions fail closed. All other extraction dispositions remain typed ineligibility records, not evidence absence or human decisions. No transitions, decisions, persistence, Orchestrator events, retries, normalization, evidence or production state were added.
- Technical Research Factory Human Review Decisions Foundation: `ACCEPT-WITH-RISKS`. Decision schema 1 accepts valid queue entries plus explicit opaque reviewer IDs and optional raw comments, producing immutable `ACCEPT`, `REJECT` or `NEEDS-MORE-REVIEW` records with canonical provenance and semantic IDs/order. Exact duplicates are idempotent; conflicting decisions or metadata for one queue entry fail closed. Decisions create no evidence, researched-no-evidence, normalization, conflict resolution, routing, persistence, retries, Orchestrator events or production state.
- Technical Research Factory Evidence-Processing Contract Foundation: `ACCEPT-WITH-RISKS`. Evidence-processing schema 1 projects immutable Human Review Decisions plus validated queue entries into explicit pre-promotion states: accepted-for-processing, rejected-candidate, needs-more-review, ineligible and cannot-advance. Raw candidate values and canonical provenance are preserved; directly observable accepted disagreements remain independently represented and unresolved. No evidence, normalization, researched-no-evidence, promotion, lifecycle, retry or production changes were added.
- Research-to-runtime identity mapping contract foundation: `ACCEPT-WITH-RISKS`. Generic research grouping → runtime identity mapping is deterministic, serializable and fail-closed, with explicit applicability constraints including the backward-compatible `bodyStyles` dimension. FZ1-only fixtures keep `yamaha.fz-fazer.fzs1000`, `yamaha.fz1.gen2.n` and `yamaha.fz1.gen2.s` structurally distinct; unresolved N/S applicability does not widen to both. No FZ1 source research, technical values, legacy-data promotion, FZ6 change, catalogue change, production profile or Rider Service Core projection occurred.
- Yamaha FZ1 source authentication/planning: one non-production target `yamaha.fz1.gen2` (2006–2015) is bound to the existing mapping and preserves separate N/S runtime identities. The official Yamaha 2010 FZ1-N owner-manual index route (`2D1X`) is authenticated but only for 2010/naked/JP-index scope; `2D1-28197-E0` remains a partial-authentication service-manual lead through the Yamaha RMI route. Market, ABS, equipment, emissions and full-range year applicability remain unresolved; no source was acquired, no technical values/evidence/review records were created, and production data is unchanged.
- Yamaha FZ1 2D1X owner-manual acquisition: the exact official Yamaha route returned one plausible PDF (`200 application/pdf`, 5,098,486 bytes; deterministic SHA-256 `bbaa777d8d0184f231573fdf6116d73b7770930d4bdf19b1f0d7386d6b7e2a93`). The non-production acquisition record preserves official-direct provenance and keeps applicability at 2010 FZ1-N / naked / JP-index scope; market, ABS, transmission, equipment, emissions and broader years remain unknown. `2D1-28197-E0` was not acquired or inspected. No bytes are committed, no content was inspected, and no extraction, candidate, review, evidence, Service Core or production state changed. Authentication, acquisition, extraction, evidence and production remain separate stages.
- Yamaha FZ1 2D1X extraction planning: the PDF’s metadata, 68-page structure and bookmarks/TOC were inspected without reading page text or recording technical values. A deterministic non-production plan binds only to the acquired `2D1X` artifact and exact SHA-256, allows six bounded owner-service/specification regions, requires page/printed-page/section/table/applicability provenance, preserves conditional rows, excludes FZ1-S, non-2010 years and `2D1-28197-E0`, and caps future extraction at 24 raw candidates. Execution remains false; no technical values, candidates, review, evidence, Service Core or production state changed.
- Generic extraction playbook: manufacturer-neutral non-production rules now reuse the existing Extraction Agent contracts for artifact/hash binding, bounded document regions, field targets, precise provenance, fail-closed applicability, conditional-row preservation, semantic duplicate handling, budgets, stop conditions and raw-candidate-only transition. VFR fingerprint patterns and the FZ1 `2D1X` plan are compatibility fixtures only; no motorcycle values, extraction, evidence, Service Core or production state changed.
- PDF extraction trust boundary: a generic stage-specific raw-extraction readiness gate now permits precisely bounded raw inspection while preserving unresolved applicability and keeping strict evidence/promotion readiness unchanged. A deterministic derived-content bridge binds UTF-8 extraction input to the exact acquired binary artifact, parent digest/media type/length, transformer identity/version and approved page-region.
- Yamaha FZ1 2D1X raw extraction pilot: the exact acquired official PDF was read only through the six approved regions and produced 14 deterministic, provenance-bound raw candidates. Output remains scoped to 2010 FZ1-N/FZ1-NA naked generation II with market, ABS, transmission, equipment and emissions unresolved. No FZ1-S or non-2010 data entered; `2D1-28197-E0` remained untouched. No review decisions, evidence, verified Service Core or production data changed.
- Technical Research Factory Ténéré Interrupted/Resumed Batch Pilot Design: `ACCEPT-WITH-RISKS`. Design schema 1 fixes the canonical Yamaha Ténéré 700 MY2019 EU standard target and BW3-F8197-E0 prospect, retains the real prospect as `REGISTERED-NOT-REAUTHENTICATED`, defines one-target/one-work/one-attempt limits, and proves pause/checkpoint/validated-resume equivalence through a synthetic local path across acquisition, extraction, Review Queue, Human Review Decisions and Evidence Processing. No real authentication, acquisition, technical inspection, evidence, coverage, readiness, production or retry changes occurred.
- Latest completed implementation-wave validation recorded by the historical generated stocktake: Ducati registry/loader/resolver/isolation targeted tests passed 58/58; rollback/governance targeted tests passed 9/9; full suite passed 681/681; deterministic reports and project-state audit passed; changed JavaScript passed `node --check`; `git diff --check` passed. A later repository audit independently recorded 837 passed / 0 failed / 3 skipped; that full suite was not rerun in this memory-only wave.
- CBR500R Technical Profile materialization: the authorized Honda PC70 MY2024 USA/Canada target now has exactly one verified `lubrication.engine-oil.specification` entry in `honda.cbr500r.pc70.2024`. ADR-042 proved `CREATED` then `REUSED` with the exact Honda document/citation binding, raw value and bounded applicability. The canonical production document map uses `USA`/`CA`; the profile entry uses boolean ABS and array-valued equipment required by the existing validator. A minimal generic entry-materializer compatibility check accepts canonical production applicability while preserving fail-closed lineage matching. The profile remains `NOT-REGISTERED`; document, citation, VFR, Ducati and registry state were unchanged semantically. Runtime, loader and registry integrity pass. NEXT remains only REGISTRY-INSERTION.
- Mass-scale source-discovery foundation: `SourceDiscoveryProspect/v1` now bridges a catalogue queue target into a non-production, deterministic prospect-registration lifecycle. It preserves UNKNOWN/PARTIAL market, ABS, transmission and equipment dimensions, distinguishes route discovery, authentication, applicability and acquisition readiness, reuses duplicate candidates, rejects conflicting identity/publication candidates, and adapts only a complete `EXECUTION-READY` candidate to the existing `SourceProspect/v1` contract. The synthetic demonstration created no source, acquisition, evidence, review, promotion, production or catalogue state. NEXT is a bounded real source-discovery pilot on a very small target set; the approximately-10-motorcycle pilot remains deferred.
- Real source-discovery pilot: the deterministic two-target sample selected one non-production Suzuki SV650 III MY2019 target with an existing official-host prospect and one unresolved Aprilia Caponord 1200 MY2013 target with no registered prospect. The Suzuki lead remains BLOCKED with authenticated-but-incomplete applicability and access/route blockers; Aprilia remains UNRESOLVED. No source was acquired, no new SourceProspect was created, and no evidence, review, promotion, production, catalogue or runtime state changed. The approximately-10-motorcycle planning pilot remains deferred.
- Mass-scale planning pilot: a deterministic ten-target planning artifact now reuses the catalogue/coverage/queue and SourceDiscoveryProspect layers. It covers ten manufacturers, one BLOCKED target, one EXHAUSTED target and eight UNRESOLVED targets without production profiles; no selected source is execution-ready, so the artifact is planning-only and safe to execute only after a separately authorized discovery/research wave. No acquisition, extraction, evidence, review, promotion or production state changed.
- Mass-scale source-discovery pilot: the exact ten-target plan was evaluated through official-route discovery only. Six official routes were found, four publications were authenticated at metadata level, three candidates remain `APPLICABILITY-PARTIAL`, one `BLOCKED`, one `EXHAUSTED` and two `UNRESOLVED`; zero reached `EXECUTION-READY`. No SourceProspect was created, no source was acquired, and no research, evidence, review, promotion, production, catalogue or runtime state changed. Applicability unknowns remain explicit.
- Mass-scale blocker-resolution pilot: authoritative official metadata moved BMW C 600 Sport MY2012 from `APPLICABILITY-PARTIAL` to one deterministic `EXECUTION-READY` projection; KTM 390 Duke MY2013 resolved only EU and ABS and remains `APPLICABILITY-PARTIAL`. The other eight target states and unknown dimensions remain fail-closed. The BMW prospect was projected but not registered, no source content was acquired, and no extraction, evidence, review, promotion or production state changed. NEXT is a separately authorized BMW acquisition only.
- BMW C 600 Sport MY2012 source acquisition: the exact `EXECUTION-READY` BMW prospect was consumed through the existing Research Factory. The generic bounded HTTP adapter accepts `application/pdf` and the async execution boundary requires explicit network availability; the official BMW Motorrad PDF returned HTTP 200 with no redirect and deterministic artifact digest `555ef51345d6725c5c35ea150f3795aecdbdf56324b4b2c414c9d1569c8e5a36`. The exact repeat reused the same artifact identity. Bytes are not committed, and no extraction, evidence, review, promotion or production/catalogue/runtime state changed. NEXT is a separate bounded raw extraction wave for this artifact.
- BMW C 600 Sport MY2012 raw extraction: the exact PDF artifact was reacquired and parent-bound by ID, SHA-256 and byte length, then inspected through four deterministic PDF regions. The Extraction Agent produced 24 raw practical candidates covering lubrication, brakes, tires, fuel, CVT, battery, fuses, spark-plug gap, lighting and wheel torques. Source pages, raw wording/units and conditional applicability are preserved; cooling, periodic-service and chain-size fields remain blocked. No review, evidence, coverage, promotion or production/catalogue/registry/runtime state changed. NEXT is bounded human review of these candidates only.
- Published application version: 0.3.0.

- Ducati Monster 937 MY2021 Rider Service Core promotion: exactly the same 39
  ACCEPTED-FOR-PROCESSING records passed individual reassessment against the
  generic representation with zero duplicates or blockers. Exactly 39 new
  citation-backed production entries were added to the existing profile,
  increasing it from 6 to 45 entries. The profile, registry, loader, resolver
  and runtime validate; the five NEEDS-MORE-REVIEW records and cooling.capacity
  remain excluded. VFR, BMW, Human Review decisions, Evidence Processing
  meaning and Service Core research coverage are unchanged. Phase 7 remains
  ACTIVE.

- Ducati Monster 937 MY2021 runtime/presentation hardening: the real browser
  path loads and resolves all 45 registered entries deterministically. Generic
  Rider Service Core labels and structured maintenance, fuse, lighting and
  wheel presentation are localized at render time in Polish; canonical IDs,
  values, provenance, applicability, Ducati profile semantics and VFR remain
  unchanged. Phase 7 remains ACTIVE.

## Independent work streams

- **Stream A — Catalogue expansion:** identify and add missing manufacturers, families, generations, variants, model years, aliases and market/applicability identities.
- **Stream B — Technical data/profile coverage:** acquire source-backed service data, resolve applicability/conflicts, and promote only through controlled review.

A catalogue identity does not imply a Technical Profile. Mature profile tooling does not imply complete catalogue content.

## WIP and blockers

- P1: keep Triumph `unknown.triumph.streettriple765` fail-closed until Triumph-controlled metadata resolves EU market and base/R/RS applicability for an exact MY2023 Street Triple 765 handbook. Hold the 13 BMW Evidence Processing records, including 2 conflicts; hold the 27 Ducati pre-promotion processing records; keep Kawasaki and Suzuki blocked and Ténéré public authentication exhausted.
- P1: add production Technical Profiles only through deliberate promotion review; 1,093 catalogue variants remain without production profiles.
- P2: improve source/document acquisition for blocked manuals and OEM parts.
- P2: audit cloud/RLS behavior against a live Supabase project before claiming deployment readiness.

## Next actions

**NEXT** — No further wave is executed by this task. The CBR500R document,
citation, Technical Profile entry and registry insertion boundaries are
complete for this lineage; future work requires a separately authorized wave.
Supabase production migration-history reconciliation remains separately
unresolved and unauthorized, and leaked-password protection remains
externally blocked until the project is upgraded to Pro or above.

The generated `research/reports/project-state-audit.json` remains intentionally scoped to the completed Triumph implementation wave. Its 2026-09-03 snapshot date, historical base commit and 681/681 validation record are deterministic historical evidence, not claims that this memory wave reran that suite.

Deferred independent streams remain future bounded Ducati/BMW profile expansion, cooling-scope resolution and the global catalogue gap audit; none is an active NEXT task.

The three-Honda fast-path package is complete at `6ac98d0` with zero retained
raw candidates. The authenticated CBR500R continuation is complete at
`e33fb31` and retains one pre-review raw oil-specification candidate with
Honda Tier A provenance, exact 2024 PC70 USA/Canada manual applicability and
no Human Review Decision, Evidence Processing record or promotion. The
candidate is now represented by exactly one persisted Review Queue entry
`review-queue-entry.7b8d56af51c808e15dd558ac`; its state is `QUEUED`, ABS
remains unresolved, and no decision or downstream processing exists.

The future **GLOBAL CATALOGUE GAP / COVERAGE AUDIT** is a separate bounded checkpoint: inventory what exists, identify missing manufacturers/families/generations/years and regional/ABS/transmission gaps, then prioritize additions. It is not executed yet.

Operator-reported live fact (not independently verified by Codex): Supabase Auth Site URL was corrected from the GitHub Pages root to the deployed VFR-Master project path, and a fresh signup/email-confirmation flow was manually tested successfully.
- RevLog Core Hardening Wave completed locally on top of `cc961cf`: existing
  clarification fields `modelCode`, `transmissionVariant` and
  `emissionsVariant` now reach generic Technical Profile applicability
  resolution; service due state preserves independent date/mileage semantics;
  direct ServiceModule validation is finite/non-negative and optional-safe;
  mileage updates are confirmed before local mutation and cannot decrease the
  stored odometer; failed cloud clarification writes leave local context
  unchanged; active motorcycle selection persists with stale/malformed storage
  fallback. No canonical production values, profile identities or Rider Core
  matrix fields changed. Phase 7 remains ACTIVE.
- Rider Core production projection audit completed for VFR800 RC46 VTEC MY2002
  and Ducati Monster 937 MY2021. Existing verified canonical entries now map
  through generic presentation aliases for six VFR Core cells and four Ducati
  Core cells; VFR remains 38 verified / 54 missing / 3 blocked and Ducati 21
  verified / 74 missing. VFR and Ducati canonical counts remain 99 and 45, and
  the frozen matrix remains 95 fields across 14 categories. Phase 7 remains
  ACTIVE.
- RevLog release metadata is now 0.4.0 dated 2026-09-06. The release records
  the completed runtime hardening and Rider Core production projection work;
  it adds no technical data and does not change application behavior. Phase 7
  remains ACTIVE.
- Production browser dependency hardening: `index.html` now pins the existing
  jsDelivr Supabase JS client to exact version `2.116.0`, the version resolved
  by the prior floating `@2` URL at this wave. Current authentication,
  recovery, database and RLS behavior are unchanged; no release bump is
  required because no user-visible runtime behavior changed. Phase 7 remains
  ACTIVE.
- Production recovery configuration: the authoritative GitHub Pages URL is
  now explicitly configured by `js/deployment-config.js` as
  `https://przemyslawchmura-coder.github.io/VFR-Master/`, loaded before the
  Supabase client. The exact path is host/path-gated; localhost-only fallback
  and fail-closed unsafe-origin handling remain unchanged. Supabase Auth
  redirect allow-list configuration remains an external operator boundary.
- Password-recovery startup race repair: `js/supabase.js` now exposes an
  explicit auth-readiness promise, and `initializeAuth()` waits for the
  lifecycle boundary before choosing ordinary-session or recovery rendering.
  Recovery-marked authenticated startup remains blocked until a valid
  `PASSWORD_RECOVERY` event persists the matching pending identity; ordinary
  sessions, malformed/expired callbacks and mismatches remain fail-closed.
  The operator-observed production defect is covered by deterministic async
  regression tests; production redirect, localhost fallback and Supabase
  state remain unchanged. Phase 7 remains ACTIVE.
- CI validation and Supabase reproducibility audit foundation completed. The
  repository now has a secret-free pull-request/main validation workflow using
  Node.js 22, while `docs/project/SUPABASE_REPRODUCIBILITY_AUDIT.md` records
  that the two existing migrations are incremental and do not yet reconstruct
  an empty project. No live Supabase mutation or application behavior change
  occurred. Phase 7 remains ACTIVE.
- Field-oriented multi-source research policy: static design analysis moved
  future planning from document-first to field/field-group-first while
  preserving source authority, applicability, provenance, conflict and
  raw/review/evidence/production boundaries. OEM web/support/fiche and
  domain-specialist sources may use a bounded fast path; safety, workshop,
  diagnostic and unresolved cases remain deep path. The existing FZ1 pilot is
  only a benchmark: no PDF, pilot or extractor was executed, and no
  candidates, evidence, Service Core or production data changed.
- Existing-fleet field-oriented coverage reassessment: static analysis of ten
  existing research/profile targets produced a deterministic ranked plan using
  ADR-031. The proposed first package is NC750X RH09-1, CBR600RR RH10 and
  CBR500R PC70 with bounded OEM web/support/fiche and domain-specialist
  fitment opportunities; no external availability was claimed. Verified fields
  remain untouched, blocked applicability/conflicts remain separate, and no
  research, acquisition, candidates, evidence, Service Core, production,
  catalogue or Supabase state changed.
- Declarative field-policy/source-authority contract foundation: added a small
  manufacturer-neutral immutable policy schema and pure evaluator with closed
  source classes, specialist domains, corroboration modes, applicability and
  bounded search budgets. Group defaults and canonical Service Core field
  overrides are deterministic; discovery-only sources, invalid combinations,
  missing required applicability/provenance and insufficient authority fail
  closed. No research, FZ1 execution, candidates, evidence, Service Core or
  production data changed.
- Generic bounded web acquisition adapter: added a manufacturer-neutral,
  target-neutral HTTP(S) adapter for explicitly supplied public URLs. It
  preserves requested/final URL, response metadata, exact body bytes, digest,
  length and deterministic artifact identity with bounded redirects, timeout,
  size and zero automatic retries. No live motorcycle research, extraction,
  candidates, evidence, review, Service Core or production data changed.
- The next bounded research step is to rerun Existing-Fleet Fast-Path
  Research Package 1 for NC750X RH09-1, CBR600RR RH10 and CBR500R PC70 using
  this adapter; semantic HTML extraction remains a separate future boundary.
- Generic parent-bound HTML derivation is now available through
  `html.normalized-text` v1. It accepts only retained `text/html` or
  `application/xhtml+xml` artifact bytes, rechecks parent digest/length,
  removes non-semantic markup content, normalizes deterministic UTF-8 text and
  emits a bounded whole-document derivative through the existing bridge. No
  motorcycle research, candidates, evidence, review or production state
  changed. The next bounded wave may rerun the three-Honda fast-path package
  through HTTP acquisition and HTML derivation.
- Generic declarative derived-text extraction is now available through schema
  version 1. It supports only bounded JSON-safe `TEXT_PATTERN` and
  `LABEL_VALUE` rules, recomputes derived-content digests, preserves exact
  captured text and line/character locators, rejects ambiguity and emits raw
  candidates only through the existing Extraction Agent adapter boundary.
  Applicability and source authority are caller-supplied and never inferred.
  No live motorcycle research or motorcycle technical data changed. The next
  bounded wave may rerun the three-Honda fast-path package through HTTP,
  parent-bound HTML derivation and declarative extraction.
- AcquisitionArtifact now treats only the exact `metadata.contentBase64`
  field as opaque acquired response bytes for secret-shaped scanning. Control
  and provenance metadata, URLs, arbitrary nested payload fields and request
  metadata remain scanned; Base64, byte-length, SHA-256 and deterministic
  identity checks remain fail-closed. No live motorcycle research or research
  output changed. The next bounded research step remains the three-Honda
  package through the complete trusted web-to-raw path.
- The opaque-content boundary now also covers only canonical derived source
  text (`metadata.content` / derived `content`) and the extraction envelope's
  `content`. Control/provenance metadata, URLs, locators and transformer
  identity remain secret-scanned; derived digest, byte length, parent binding
  and deterministic identity remain enforced. No live motorcycle research or
  research output changed. The next bounded step remains the three-Honda
  fast-path package through the complete trusted web-to-raw path.
- Existing-Fleet Fast-Path Package 1 was rerun for exactly NC750X RH09-1,
  CBR600RR RH10 and CBR500R PC70 with four bounded explicit HTML acquisitions.
  The fiche provider remained unauthenticated and the official CBR500R route
  did not prove exact field applicability, so all six slots stopped fail-closed
  and zero raw candidates were retained. No review, evidence, Service Core,
  production, catalogue or Supabase state changed. The next bounded step is
  to establish one independently authenticated, exactly applicable source
  route before rerunning a field package.
- CBR500R PC70 source-route authentication is complete for four scoped fields.
  Eight bounded attempts established one permitted Tier A Honda 2024 owner
  manual route for oil specification and loaded-pressure follow-up. The Honda
  parts route remains applicability-partial, RK fitment remains applicability-
  partial, and bike-parts-honda.com remains discovery-only. No technical
  values, candidates, evidence, review, Service Core, production, catalogue
  or Supabase state changed. NEXT is one bounded CBR500R execution through the
  authenticated Honda manual route only.
- CBR500R PC70 owner-manual execution completed for exactly two fields through
  the existing Honda Tier A PDF path. One raw oil-specification candidate was
  produced with custody/provenance; loaded pressures stopped because the PDF
  has no explicit loaded/passenger pressure condition and existing coverage
  was not duplicated. No review, evidence, promotion, Service Core,
  production, catalogue, Supabase or infrastructure state changed. NEXT is
  bounded human review of the single oil-specification candidate only.
- CI PDF tooling now pins `pypdf==6.16.2` in repository requirements and
  installs it through the existing validation workflow before tests. This
  repairs clean-run reproducibility for the BMW raw-extraction path without
  changing its 24-candidate output or any research/production state.
- BMW C 600 Sport MY2012 human review now accounts for exactly the 24 existing
  raw candidates. All received explicit pre-evidence ACCEPT decisions; nine
  conditional rows retain their single-rider, loaded or optional-LED scope.
  No evidence, conflict resolution, promotion, production, catalogue,
  registry or cloud state changed. NEXT is separate Evidence Processing for
  only these 24 decisions.
- End-of-day checkpoint: BMW C 600 Sport MY2012 Evidence Processing consumed
  exactly those 24 ACCEPT decisions. All 24 are `ACCEPTED-FOR-PROCESSING`, with
  zero blocked/conflicting/rejected/ineligible records and zero evidence rows
  created. Nine conditional records retain their exact condition; raw values,
  units, artifact `artifact.7429b5139a7bd3155b3b0a7c`, digest
  `555ef51345d6725c5c35ea150f3795aecdbdf56324b4b2c414c9d1569c8e5a36`, source
  and BMW C 600 Sport MY2012 USA/CVT/ABS=true applicability are preserved.
  No production, catalogue, registry, cloud or Service Core state changed.
  NEXT is bounded promotion-readiness evaluation only for these 24 processing
  records, not promotion or materialization.
- BMW C 600 Sport MY2012 promotion-readiness evaluation consumed exactly those
  24 Evidence Processing records through the existing `PromotionPacket/v1`
  fail-closed gate. All 24 are `PROMOTION-READY`; none are blocked. The
  projection preserves raw values, nine conditional contexts, provenance,
  source identity and explicit BMW C 600 Sport MY2012 USA/CVT/ABS=true
  applicability. It created no evidence, approval, conversion, production,
  catalogue, registry, Service Core or cloud state. NEXT is the existing
  pending Promotion Review Packet stage for these 24 packets only; no approval
  or promotion is authorized by this result.
- BMW C 600 Sport MY2012 promotion review now creates exactly 24 deterministic
  generic `PromotionReviewPacket/v1` packets from the unchanged 24
  `PROMOTION-READY` inputs. All packets remain `PENDING-PROMOTION-REVIEW`;
  approval, rejection, conversion and production materialization remain
  unexecuted. Raw values, nine conditional contexts, provenance, source
  identity and applicability remain preserved; no evidence, production,
  catalogue, registry, Service Core or cloud state changed. NEXT is a separate
  explicit human promotion-review decision only.
- BMW C 600 Sport MY2012 Human Promotion Review Decisions now consume exactly
  those 24 pending packets once and create exactly 24 generic
  `APPROVED-FOR-CONVERSION` decisions. All nine conditional contexts remain
  explicit; raw values, provenance, source identity and applicability are
  unchanged. These decisions authorize only a separately bounded future
  schema-conversion review; no conversion, evidence row, production,
  catalogue, registry, Service Core or cloud state was created. NEXT is that
  separate schema-conversion projection for exactly these 24 decisions; it is
  not executed by this wave.
- BMW C 600 Sport MY2012 Schema Conversion Projection consumed exactly the 24
  unchanged `APPROVED-FOR-CONVERSION` decisions through the generic
  `SchemaConversionProjection/v1` contract. All 24 are deterministic
  `CONVERSION-READY` lossless raw-text projections; numeric/unit conversion
  and compound decomposition were not performed. Raw values, source identity,
  provenance, applicability, complete lineage and all nine conditional
  contexts remain preserved. No evidence rows, production, catalogue,
  registry, Rider Service Core or cloud state changed. NEXT is a separately
  authorized bounded evidence-materialization review for exactly these 24
  projections; it is not executed.
- Technical Research Factory Maximum Automation / Throughput v2 is now a
  design-only repository-audited plan. It proposes one orchestration layer
  around the existing contracts, reducer/checkpoint history, content-addressed
  source/extraction reuse, explicit GREEN/YELLOW/RED routing, grouped
  exception review, applicability-safe fan-out, incremental gap planning,
  bounded concurrency and deterministic batch summaries. Existing production,
  evidence, Rider Service Core, catalogue, registry, cloud and UI boundaries
  remain unchanged. The next implementation wave is A: throughput baseline and
  `BatchSummary/v2` fixture projection; no runtime automation is implemented.
- Technical Research Factory Throughput v2 Wave A now provides the generic
  `BatchSummary/v2` contract and a deterministic read-only baseline over five
  existing fixture cases: BMW C 600 Sport, Ducati Monster 937, CBR500R,
  Honda Wave 2 and Yamaha transfer acquisition. The fixtures retain their
  lifecycle-generation differences instead of being merged into misleading
  totals. Aggregate AUTO-ADVANCE, HUMAN-TOUCH, SOURCE-REUSE and
  RESEARCH-DUPLICATION percentages are explicitly `NOT-MEASURED` because the
  historical artifacts lack comparable denominators; fixture-level known
  counts and zero values remain distinct from unknown values. BMW remains
  24/24 promotion-ready, 24 packets, 24 approved decisions, 24 conversion-
  ready projections and 9 conditional contexts, with no materialization.
  NEXT is Wave B: safe-stage runner over existing contracts.
- Technical Research Factory Throughput v2 Wave B now provides a generic
  deterministic safe-stage runner over the existing PromotionReviewPacket,
  PromotionReviewDecision and SchemaConversionProjection contracts. The proof
  path advances valid packet validation and schema conversion, stops without
  authorization at `PROMOTION-REVIEW-REQUIRED`, and continues only when an
  existing valid promotion decision is supplied. Stage envelopes and
  BatchSummary/v2 runner metrics are deterministic; no human decision is
  created, no evidence or production state is written, and Wave A historical
  unknown metrics remain unchanged. NEXT is Wave C: deterministic
  GREEN/YELLOW/RED routing and grouped exception projection; it is not
  executed.
- Technical Research Factory Throughput v2 Wave C now provides deterministic
  GREEN/YELLOW/RED routing over SafeStageRunner/v1 results and a grouped,
  read-only exception projection. The mixed fixture classifies 8 inputs as
  1 GREEN, 1 YELLOW and 6 RED; 7 exception records remain visible in 6 stable
  groups, including both duplicate failures. GREEN requires an ADVANCED
  runner result, YELLOW preserves the explicit promotion-review boundary, and
  structural failures remain RED with exact reason codes. No rule was activated,
  no authorization was created, historical Wave A unknown metrics remain
  unchanged, and no evidence, production, Service Core, catalogue, registry,
  cloud or UI state changed. NEXT is Wave D: versioned deterministic rule
  library; it is not executed.
- Technical Research Factory Throughput v2 Wave D now provides a generic
  versioned `DeterministicRule/v1` and `RuleEvaluationResult/v1` foundation
  with three narrow proof rules: explicit torque pairs, explicit capacity
  pairs and single explicit pressure pairs. The fixture evaluated 8 records:
  3 APPLIED, 1 NOT-APPLICABLE, 1 NEEDS-HUMAN-REVIEW for compound conditional
  pressure, and 3 REJECTED structural inputs. Raw values, source identity,
  provenance, applicability and condition remain preserved; rule evaluation
  creates no authorization, evidence or production state. Version 0.9.0 and
  1.0.0 identities remain independent, and Wave A/B/C semantics are unchanged.
  NEXT is Wave E: integrate the versioned rule library into a bounded
  multi-record automatic pipeline; it is not executed.
- Technical Research Factory Throughput v2 Wave E now composes the existing
  deterministic rule library, SafeStageRunner/v1, RoutingResult/v1 and grouped
  exception projection over 9 real BMW C 600 Sport MY2012 records. The bounded
  read-only pipeline produced 3 GREEN, 2 YELLOW and 4 RED results; 3 existing
  promotion decisions were consumed, no new authorization was created, and 6
  exception records were retained in 5 groups. Direct measurements are
  AUTO-ADVANCE 3/9, HUMAN-TOUCH 2/9, EXCEPTION 6/9 and AUTOMATIC-SAFE 3/9.
  Rule results were 3 APPLIED, 1 NOT-APPLICABLE, 1 NEEDS-HUMAN-REVIEW and 4
  REJECTED. No evidence, production, Service Core, catalogue, registry, cloud
  or UI state changed; historical Wave A unknown metrics remain unchanged.
  NEXT is a separately authorized continuation derived from the measured Wave
  E result; no later throughput wave is executed here.
- Technical Research Factory Throughput v2 Wave F analyzed exactly the six
  stored Wave E exception records without changing rules, routing or pipeline
  behavior. One exception is a legitimate compound/conditional pressure human
  boundary; five are fixture-only applicability, missing-value, unsupported-
  unit or duplicate negative cases. The inspected legitimate subset is 4
  records: 3 automatic-safe and 1 human-boundary record; no safe deterministic
  candidate is established, and the bounded counterfactual remains 3/4. No
  evidence, production, Service Core, catalogue, registry, cloud or UI state
  changed. NEXT is a separately authorized upstream-input hygiene and
  duplicate-handling design/audit wave before any rule extension is considered.
- Technical Research Factory Throughput v2 Wave G adds `InputHygiene/v1` and
  an autonomous read-only batch composition over existing rules, runner,
  routing, exception projection and BatchSummary contracts. The hostile Wave
  E regression remains 9 records at 3 GREEN, 2 YELLOW and 4 RED; the
  repository-backed legitimate BMW set contains 7 records at 6 GREEN, 1
  YELLOW and 0 RED. Both batches complete without operator interruption,
  preserve lineage, create 0 new authorizations and produce no external side
  effects. Exact duplicates are auditable and suppressed from duplicate work;
  conflicts, malformed input and the pressure boundary remain fail-closed.
  NEXT is a separately authorized larger existing-repository batch run.
- Technical Research Factory Throughput v2 Wave H validated the autonomous
  batch over 32 legitimate repository-backed records: 24 BMW C 600 Sport
  MY2012, 7 Ducati Monster 937 MY2021 and 1 Honda CBR500R MY2024. Results are
  6 GREEN, 1 YELLOW and 25 RED, with 26 exception records in 26 groups; the
  RED records are explicit unsupported-rule capability gaps or fail-closed
  conditions, not discarded data. Six existing authorizations were consumed,
  none were created, both dataset accounting and batch completion were
  deterministic, and no production/evidence/Service Core/cloud state changed.
  NEXT is a separately authorized bounded capability-extension decision for
  the repeated legitimate unsupported field classes.
- Technical Research Factory Throughput v2 Wave I inventoried all 25 legitimate
  Wave H unsupported-rule records exactly once across 14 evidence-backed
  semantic classes. Only the repeated `electrical.battery-capacity` class
  (BMW 11.2 Ah and Ducati 6.5 Ah) met the safety bar for one generic extension:
  `battery-capacity.explicit-ah-scalar` v1.0.0 strictly accepts one explicit
  Ah scalar, preserves raw wording/source/provenance/applicability, and creates
  no authorization. Re-running the exact 32-record dataset produced 8 GREEN,
  1 YELLOW and 23 RED; 2 records were affected, 8 existing authorizations
  were consumed and 0 were created. The compound/conditional pressure
  boundary and all other 23 capability gaps remain fail-closed. No evidence,
  production, Service Core, catalogue, registry, cloud or UI state changed.
  NEXT is a separately authorized analysis of another repeated capability
  class only after fresh safety evidence; it is not executed here.
- Technical Research Factory Throughput v2 Wave J re-verified the exact 23
  remaining unsupported RED records from the Wave I output, with no omissions
  and the pressure YELLOW excluded. Six repeated classes and seven singleton
  classes were analyzed; all require either semantic interpretation,
  alternative/compound preservation, a new contract, or more repeated
  evidence. No second deterministic capability met the safety bar, so this
  was a decision-only wave. The exact rerun remains 8 GREEN, 1 YELLOW and
  23 RED, with 8 existing authorizations consumed and 0 new authorizations.
  Wave I battery behavior, historical fixtures, pressure boundary and hostile
  regression remain unchanged; no evidence, production, Service Core,
  catalogue, registry, cloud or UI state changed. NEXT is a separately
  authorized class-specific contract proposal only if new evidence justifies
  it; no capability implementation is selected by default.
- Technical Research Factory Throughput v2 Wave K performed the bounded
  contract-prioritization analysis over the exact 23 remaining unsupported
  records. Six repeated classes and seven singleton classes were inspected
  with raw values, provenance, applicability and conditions preserved. No
  class had evidence sufficient to define a narrow lossless contract without
  inventing semantics, so the selection is `NONE`; no rule, routing,
  authorization, evidence, production, Service Core, catalogue, registry,
  cloud or UI state changed. The exact routing remains 8 GREEN, 1 YELLOW and
  23 RED, with Wave I battery semantics, the pressure boundary, hostile
  Wave G 3/2/4 and historical reports preserved. The prerequisite for any
  future contract-design wave is new repository evidence or an existing
  formal lossless contract; no such wave is authorized here.

- Research on Demand + Persistent Reuse architecture audit: the current
  motorcycle/catalogue/context flow and the full non-production Research
  Factory were traced. Existing identity, applicability, GapPlan,
  deterministic orchestration/checkpoints, acquisition, extraction, review,
  evidence-processing and explicit production-authorization boundaries remain
  reusable; no Factory layer is obsolete. The repository has no durable
  cross-request reusable-knowledge store, research-demand/status ledger or
  profileless partial-reuse projection. Existing TargetWork and SourceWorkItem
  IDs are batch-scoped execution identities, so they cannot by themselves
  deduplicate equivalent user demands. This is PROPOSED/AUDITED only: a future
  separately authorized wave may add a non-production persistence boundary
  keyed by canonical catalogue/context/field applicability, then connect it to
  the existing Factory through a thin adapter. No API was called, no source
  was acquired, and no production, Service Core, routing, catalogue, registry,
  Supabase or UI state changed. Wave K remains valid at 8 GREEN / 1 YELLOW /
  23 RED.

- Research on Demand Wave 1 is implemented as a pure, non-production local
  contract proof. `research/factory/reusable-knowledge-contracts.js` reuses
  the existing canonical JSON and applicability validators to derive stable
  demand/knowledge keys from `catalogVariantKey`, explicit applicability,
  canonical field/operation, conditions and required applicability dimensions.
  User, garage-row and batch identities are excluded. The local synthetic
  fixture and focused tests prove exact reusable lookup, incompatible and
  unknown-context fail-closed behavior, deterministic partial projection,
  provenance preservation, explicit reusable/in-progress/review/unsupported/
  blocked states and missing-demand classification. No persistence, app
  integration, external provider/acquisition, production materialization,
  catalogue, Service Core or routing state changed. Wave K remains 8 GREEN /
  1 YELLOW / 23 RED; Wave I battery semantics, pressure YELLOW ownership and
  Wave G hostile 3/2/4 remain unchanged.

- Research on Demand Wave 2 is implemented as a repository-only durable
  boundary. `research/factory/reusable-knowledge-persistence.js` reuses the
  Wave 1 demand/knowledge identities, rejects unknown required applicability
  before claim, provides deterministic local claim/status/lookup behavior and
  preserves provenance, applicability, conditions and lineage. The ordered
  migration `20260920102352_research_on_demand_wave2_durable_reuse.sql` adds
  separate durable demand and append-safe reusable-knowledge tables, a unique
  canonical demand key, conflict-preserving content uniqueness, foreign-key
  lineage and RLS with no browser/client policies. No live database was
  changed, no app integration/provider/acquisition/production promotion was
  performed, and Wave K remains 8 GREEN / 1 YELLOW / 23 RED. NEXT is Wave 3:
  bridge active motorcycle context to reusable lookup and missing-field demand
  through deterministic/local fixtures.

- Research on Demand Wave 3 is implemented as a thin non-production bridge in
  `research/factory/research-on-demand-bridge.js`. An active motorcycle is
  converted through the existing technical-context and catalogue semantics to
  one canonical applicability context; reusable lookup runs before demand
  creation; only missing Core fields claim Wave 2 durable demand identity; and
  equivalent users/garage rows deduplicate. New work is transformed through
  the existing ResearchTarget, GapPlan, ExecutionPlanner, TargetWork,
  SourceWorkItem, orchestrator/reducer and synthetic local acquisition
  contracts. The local accepted-pre-evidence result preserves raw value,
  provenance, applicability and Factory lineage, is stored through the Wave 2
  boundary and is visible on projection recomputation. Known fields remain
  visible beside missing, blocked, awaiting-review, incompatible and unknown-
  context fields. No API, external acquisition, live database, browser write,
  production profile/registry, catalogue, Service Core or routing state
  changed. Wave K remains 8 GREEN / 1 YELLOW / 23 RED and pressure remains
  YELLOW/human-owned.

- Research on Demand Wave 4 is a decision-only architecture audit. Repository
  evidence selects dependency order A → B → C: establish a trusted live
  persistence/execution boundary first, authorize a real provider second and
  connect the application/UI third. The Wave 2 migration is structurally
  ordered and fail-closed but intentionally has no anon/authenticated write
  policy; the current static/browser runtime has no trusted server or Edge
  Function writer for shared demand/status or reusable knowledge. The exact
  NEXT is one bounded trusted live-persistence boundary wave owning canonical
  validation, atomic claim/deduplication, Factory handoff, lifecycle,
  retries/checkpoints and provenance/lineage persistence. Provider credentials,
  external acquisition, UI writes and production profile changes remain
  deferred; this audit did not implement the NEXT or apply any live migration.
  Wave K remains 8 GREEN / 1 YELLOW / 23 RED and pressure remains
  YELLOW/human-owned.
