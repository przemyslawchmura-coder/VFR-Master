# Technical Research Factory architecture and gap audit

Date: 2026-09-01

Outcome: **ACCEPT-WITH-RISKS**. This is architecture only. No source was authenticated or acquired, no service content was inspected, and no evidence, coverage or production state changed.

## Executive finding

RevLog has a reusable research kernel, not yet a research factory. The kernel deterministically provides the canonical 183-field schema and 44-field Service Core, catalogue traversal, proof filtering, source-document deduplication, basic applicability validation, limited unit normalization, conflict preservation, coverage/gap calculation, queues, reports and a hard production boundary.

What is missing is the orchestration/state layer that makes those capabilities operate on many exact targets without bespoke scripts and prompts: canonical target/prospect/applicability contracts, a reusable readiness gate, GapPlans containing history/risk/source relevance, bounded work items and attempts, generic yield/completion/anti-loop reducers, typed review decisions, and resumable checkpoints. Current batch result modules manually assemble documents, evidence, budgets, blockers, metrics and NEXT decisions.

The smallest credible path is not a rewrite. It is a versioned Factory Foundation placed in front of the working generic helpers, with compatibility adapters for current data shapes.

## Actual current pipeline inventory

| Stage | Existing implementation | Classification | Actual condition |
| --- | --- | --- | --- |
| Catalogue target generation | `batch-research-pipeline.generateTargets` | PARTIALLY-GENERIC | Deterministic variants/ranges; exact year, market, transmission, ABS and equipment scopes remain handcrafted. |
| Service Core gaps | `calculateGaps`, coverage auditor | GENERIC-READY | Deterministic 44-field status; no combined history/risk/source-relevance GapPlan. |
| Source discovery | Prompts and per-task reports | MISSING | No interface, bounded work record or ranked prospect output. |
| Source registration | `research/data/sources/*`, acquisition status and prospect inventory | PARTIALLY-GENERIC | Several incompatible source/prospect shapes and no canonical validator/attempt history. |
| Authentication | ADR-012 and `evaluateReadinessGate` | GENERIC-BUT-MANUAL-ORCHESTRATION | Gate is deterministic after manually authored booleans; it is embedded in a reassessment dataset. |
| Applicability | batch `validateApplicability`; technical pipeline scopes | PARTIALLY-GENERIC | Fail-closed pieces exist, but representations differ and coverage of dimensions is inconsistent. |
| Acquisition | Per-batch source objects and dispositions | DESIGN-ONLY | Disposition vocabulary exists; attempt/budget transitions are handwritten. |
| Extraction | two candidate validators | PARTIALLY-GENERIC | Validation is reusable; construction and evidence acceptance remain handcrafted across two schemas. |
| Normalization | `normalizeValue` and production quantity validation | PARTIALLY-GENERIC | Safe but narrow numeric conversion only. |
| Conflicts | `detectConflicts`, `composeLayers` | GENERIC-READY | No automatic winner; richer typed applicability/revision outcomes are missing. |
| Coverage/yield | batch reports and execution-specific metrics | PARTIALLY-GENERIC | Coverage is generic; practical/generic/document-yield metrics are rewritten per batch. |
| Review queue | `buildReviewQueue`, `generateResearchQueue` | PARTIALLY-GENERIC | Stable ordering exists; typed reasons, lifecycle and resolution records do not. |
| Checkpoint/resume | Git history only | MISSING | No batch/work/attempt/event reducer or resumable snapshot. |
| Human review | Audit Standard and prompt decisions | DESIGN-ONLY | Governance exists; machine-readable review decisions do not. |
| Production promotion | draft generator, production validators/registry | GENERIC-BUT-MANUAL-ORCHESTRATION | Correctly separate and manual; factory must never register production automatically. |

### Genericity summary

- **GENERIC-READY:** canonical schemas, Service Core, proof filtering, document identity/deduplication, basic gaps, conflict preservation, deterministic hashes, production-isolation tests.
- **GENERIC-BUT-MANUAL-ORCHESTRATION:** readiness inputs, candidate validation, source tiers, yield-threshold interpretation and manual production draft boundary.
- **PARTIALLY-GENERIC:** target generation, registries, applicability, normalization, yield reports, queues and completion vocabulary.
- **MANUFACTURER-SPECIFIC:** Yamaha B7N/LIT/path knowledge, Honda Motopub/Helm/common-manual knowledge and Harley SIP routing. These are discovery metadata, not core safety semantics.
- **MODEL-SPECIFIC:** Honda pilot, Yamaha batch, Harley execution, MT-09 authentication/reconciliation and VFR proof/fingerprint datasets.
- **DESIGN-ONLY:** discovery interface, acquisition work items, budget state transitions, review decisions, completion reducer and adapters.
- **MISSING:** canonical contracts/validators, event identities, checkpoint reducer, generic scheduler/yield/anti-loop engines.

## Manual-orchestration audit

| Decision | Future classification | Reason |
| --- | --- | --- |
| Exact target scope | CAN-BE-POLICY-DRIVEN | Catalogue supplies identity; bounded context must be explicit policy. |
| Source discovery/query construction | CAN-BE-HEURISTIC-WITH-HUMAN-REVIEW | Agents/adapters may propose exact sources, never infer authority/applicability. |
| Document deduplication | CAN-BE-DETERMINISTIC | Publication identity/hash is already reusable. |
| Readiness/applicability gates | CAN-BE-DETERMINISTIC | Recorded UNKNOWN/PARTIAL fields must fail closed. |
| Source ranking and retry | CAN-BE-POLICY-DRIVEN | Authority, marginal relevance, history, access and risk are recorded inputs. |
| Extraction | CAN-BE-HEURISTIC-WITH-HUMAN-REVIEW | Candidate proposals may be automated; safety facts require independent validation. |
| Registered normalization | CAN-BE-DETERMINISTIC | Unknown syntax remains raw and queued. |
| Conflict resolution | MUST-REMAIN-HUMAN | Detection is deterministic; authoritative disagreements require judgment/new evidence. |
| Safety-critical acceptance | MUST-REMAIN-HUMAN | Automation blocks/queues and cannot waive scope uncertainty. |
| Budget and anti-loop stops | CAN-BE-POLICY-DRIVEN / CAN-BE-DETERMINISTIC | Configured limits and attempt fingerprints produce reproducible transitions. |
| Similar-model inheritance | UNSAFE-TO-AUTOMATE | Platform similarity is not applicability evidence. |
| Production promotion | MUST-REMAIN-HUMAN | Separate explicit task and production validation remain mandatory. |

## Core contracts

### ResearchTarget

Stable identity: `targetId`, canonical `catalogVariantKey`, and `scopeId`. The target references catalogue truth and stores only bounded scope: generation where needed, exact year/range, market, transmission, ABS and equipment/submodel. It also references a source-priority policy, Service Core baseline, research history, risk flags, known sources/prospects and exhaustion state. Manufacturer/family/catalogue range are derived, avoiding duplicated catalogue truth.

### SourceProspect

Stable identity: `prospectId`, `targetId` and a document-identity hint. Required generic fields cover manufacturer, class, publisher/authority, one or more regional publication identifiers and their relationship, official locations, separate metadata/content accessibility, applicability across every target dimension, tier, authentication/exhaustion, attempts, expected marginal gap class, readiness, blockers and next action. Manufacturer-only metadata belongs in opaque `adapterData`; it cannot bypass core gates.

### ApplicabilityScope

Canonical dimensions are catalogue key, generation, year/range, market, transmission, ABS and equipment. Decisions are `APPLICABLE`, `NOT-APPLICABLE`, `AMBIGUOUS` or `MISMATCH`. UNKNOWN blocks; null never means universal; ABS false remains different from unknown; manual/DCT and named equipment remain explicit.

### GapPlan

Generated fields include starting coverage, remaining and safety-critical fields, researched-no-evidence and conflicting fields, relevant source classes, attempted/exhausted source classes and expected marginal opportunity. This replaces prompt-authored “look for” lists without changing Service Core.

### Work and review contracts

`SourceWorkItem` binds one batch/target/prospect/stage to budgets, inputs, attempts and review items. `EvidenceCandidate` preserves original and normalized values/units, exact document/page/context, applicability, extraction method, verification and conflict state. `ReviewItem` has stable identity, typed reason, severity, subject references, lifecycle and human resolution.

## Discovery, priority and readiness

Discovery input is a ResearchTarget, GapPlan, known prospects/history, source policy and remaining budget. Its output is ranked prospect proposals with discovery provenance and UNKNOWN fields intact. Deterministic logic excludes exhausted duplicates, applies field/source relevance and bounds work. External agents inspect bounded official indexes and propose metadata; no crawler, browser automation, OCR or LLM extractor is part of the MVP.

Default source-class order is official service/common-service manual, owner manual, service-data publication, OEM parts catalogue, technical bulletin, official model documentation, high-quality independent source, then mirror. This is not a fixed winner: a rich accessible owner manual may outrank a blocked service manual. Ranking uses Tier A/B authority, marginal practical relevance, applicability, access, prior richness, reuse, duplication/exhaustion and safety risk. Tier C/D cannot satisfy practical success.

ADR-012 is conceptually generic but not yet a reusable component. The canonical gate must require authority, underlying identity, publication-identifier relationship, class, official path, model, year, market, transmission, ABS/equipment sufficiency, feasible access, non-exhaustion and independent Tier A/B evidence. Current slightly different target-specific gates should feed one implementation through compatibility adapters.

## Gap, budget, extraction, normalization and conflicts

The GapPlan is generated before discovery and after each accepted result. Budgets are configurable because prior 1–3-document target limits are insufficient evidence for permanent universal numbers. The engine must support maximum documents, prospects authenticated, failed access attempts, duplicates, low/zero-yield sources, authentication loops and total target attempts. A second source requires a recorded remaining-gap rationale; structural blockers and duplicate/no-gain paths stop early.

The extraction contract accepts only candidate output. It never emits verified production data. Original values, units, conditions and provenance are immutable. Current safe normalization covers ml/L, psi/bar/kPa and N·m identity. Missing parsers include maintenance action/intervals, clearance conditions, part numbers, torque component identity and pressure/load semantics. Unknown forms stay raw and enter `NORMALIZATION-UNCERTAINTY`; unit inference, false precision, averaging and condition collapse are forbidden.

Current conflict detection correctly keeps disagreements. The canonical states should be `NO-CONFLICT`, `NORMALIZED-MATCH`, `APPLICABILITY-SPLIT`, `SOURCE-DISAGREEMENT` and `UNRESOLVED-CONFLICT`. Source count, numerical commonness or averaging never resolves a conflict.

## Exhaustion, completion and scheduling

Generic stop reasons are `SOURCE-EXHAUSTED`, `AUTHENTICATION-PATH-EXHAUSTED`, `ACCESS-STRUCTURALLY-BLOCKED`, `DUPLICATE-SOURCE`, `LOW-MARGINAL-YIELD`, `NO-READY-PROSPECT` and `TARGET-BUDGET-EXHAUSTED`. A reducer consumes attempt history, blocker fingerprints, document identity, yield and budget to produce the next or terminal state. MT-09 proved the semantics; it is not yet an engine.

Wave completion states are `SERVICE-CORE-READY`, `SERVICE-CORE-PARTIAL`, `RESEARCH-MORE`, `BLOCKED`, `EXHAUSTED` and `REVIEW-REQUIRED`. Coverage readiness, source readiness, wave completion and production readiness are independent. Completion below 44/44 is valid.

The scheduler gates before ranking, ranks expected marginal practical opportunity per bounded document, uses stable target-ID ties, and never defaults to fame/popularity. The existing priority score is inadequate because it rewards current verified/source counts without consuming readiness, marginal field relevance or attempt history.

## Review, checkpointing and determinism

Review reasons include publication/source mismatch, year/market/ABS/transmission/equipment ambiguity, safety conflict, source disagreement, normalization uncertainty and promotion candidacy. Only judgment-bearing items require humans; deterministic failures become blockers/stops automatically.

Stable identities are required for batch, target, prospect, work item, attempt, document, candidate, review item and event. An append-only event stream plus deterministic reducer/versioned snapshot enables restart, skipping terminal attempts, document/evidence deduplication and report reproduction. Existing document/evidence IDs are useful but insufficient for work resumption.

Local logic owns transitions, gates, gaps, budgets, ranking inputs, conflicts, stops and reports. External discovery/authentication/extraction can be nondeterministic, but findings enter as immutable, validated records; replaying those records must produce identical state.

## Manufacturer adapters

Decision: **generic core plus optional manufacturer adapters**. Adapters may supply official path templates, publication-code parsing hints, navigation hints and metadata proposals. They may never declare evidence verified, infer applicability, bypass access/readiness, modify Service Core or promote production. Fully generic discovery ignores real Honda/Yamaha/Harley infrastructure differences; manufacturer-specific gates would duplicate safety policy.

## Scale challenge

- **10 targets — representable but manual:** local gaps/queues scale; prospect construction, authentication and result scripts remain linear human work.
- **25 targets — not operationally ready:** discovery throughput, typed review, attempts/budgets, resume and manufacturer paths become dominant. Data volume itself is small.
- **100 targets — blocked by orchestration:** external request/rate controls, resumability, cross-target document reuse, review volume, report churn and adapter coverage fail before local coverage logic. No 100-target readiness claim is made.

## Factory-readiness scorecard

| Area | State | Evidence |
| --- | --- | --- |
| Target generation | PARTIAL | Generic catalogue traversal; exact scope contract absent. |
| Source discovery | MISSING | Prompt-only. |
| Source registry/authentication | PARTIAL | Fragmented shapes; embedded gate. |
| Applicability | PARTIAL | Fail-closed pieces, incompatible representations. |
| Service Core gap planning | PARTIAL | Coverage ready; history/risk/relevance missing. |
| Acquisition budgets | DESIGN-ONLY | Handcrafted task limits. |
| Extraction/normalization | PARTIAL | Candidate validation and narrow safe conversions. |
| Conflicts | PARTIAL | Detection ready; typed outcomes/resolutions missing. |
| Coverage | READY | Deterministic 44-field accounting. |
| Yield | PARTIAL | Per-execution metrics, no canonical calculator. |
| Exhaustion/anti-loop | DESIGN-ONLY | Recorded examples, no reducer. |
| Batch scheduling/review | PARTIAL | Stable basic queues, incomplete inputs/reasons. |
| Checkpoint/resume | MISSING | No event/state model. |
| Production isolation | READY | Runtime/import and VFR regressions. |
| Reporting/testing | PARTIAL | Strong deterministic tests; custom script per execution and no factory transitions. |

## Minimum Viable Factory

The MVP comprises versioned core contracts/validators/gates; Batch/WorkItem/Attempt/Event state and reducer; catalogue target loader and GapPlan; bounded scheduler/budgets; external finding ingestion; existing document/evidence deduplication/conflicts; typed review queue; checkpoint/report regeneration; and the unchanged manual production boundary. External agents still perform bounded web/document work. The orchestrator must handle multiple targets without target-specific scripts.

## Implementation waves

1. **FACTORY FOUNDATION:** contracts, validators and canonical readiness/applicability gate. Synthetic/current-shape adapters only; no live migration or orchestration.
2. **FACTORY ORCHESTRATOR:** batch/work/attempt/event reducer, budgets, completion and checkpoints. No external calls.
3. **FACTORY WORK ITEMS:** GapPlan/scheduler, external finding ingestion and typed review queue. No autonomous tooling.
4. **FACTORY BATCH PILOT:** small interrupted/resumed non-production batch using known prospects.
5. **FACTORY SCALE-UP:** 10 then 25 targets; add only evidence-backed adapters. Consider 100 only after measured bottlenecks.

## Ténéré 700 role

`yamaha.tenere-700.gen1` / `BW3-F8197-E0` remains `REGISTERED-NOT-REAUTHENTICATED` and becomes **FACTORY-PILOT-CANDIDATE**. Its unresolved year, market, access and named-equipment scope are useful real-world gate inputs after Foundation, Orchestrator and Work Items exist. It was not authenticated in this task.

## Independent audit

The design is genuinely generic at the core and confines manufacturer knowledge to optional discovery adapters. It separates discovery, authentication, acquisition and extraction; preserves tri-state and explicit context; generates gaps; bounds work; stops loops; keeps provenance/conflicts; supports resumability; and leaves production manual.

Risks justify **ACCEPT-WITH-RISKS**: two candidate/applicability schemas require adapters, discovery remains external, normalization is narrow, 100-target review/checkpoint pressure is unresolved, and the contracts could become an unused parallel framework if Foundation does not adapt current shapes. The design is falsified if 25 targets still require per-target result scripts after Work Items, adapters bypass gates, checkpoints cannot replay, current evidence must be rewritten, or production imports factory code.

## Exact NEXT implementation task

Implement the bounded **Technical Research Factory Foundation**: add versioned, manufacturer-neutral `ResearchTarget`, `SourceProspect`, `ApplicabilityScope` and `GapPlan` contracts with validators, then extract one canonical fail-closed readiness/applicability gate behind compatibility adapters for synthetic/current-shaped fixtures. Perform no external research, live data migration, acquisition, extraction or production change.

This is the highest-leverage dependency: schedulers, budgets, work items, checkpoints and review queues all require stable identities/scopes and one gate. Building orchestration first would hard-code the fragmented current shapes.
