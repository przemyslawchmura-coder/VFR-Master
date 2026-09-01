# Technical Research Factory Foundation #1

Date: 2026-09-01

Outcome: **ACCEPT-WITH-RISKS**. The manufacturer-neutral factory contracts, validators, applicability evaluator, readiness gate, GapPlan generator and bounded compatibility adapters are implemented under `research/factory/`. They are non-production, network-independent and exercised against existing Honda, Yamaha, Harley-Davidson and Ténéré records.

## Public foundation API

`research/factory/index.js` exports contract version `1`, enumerations, validators, deterministic serialization, applicability/readiness evaluation, GapPlan generation and three shape adapters. Unknown contract versions throw; canonical records are plain JSON-safe objects with stable array ordering. Constructors/validators clone input and do not mutate historical records.

### ApplicabilityScope

Every record explicitly contains model, generation, years, markets, transmissions, ABS and equipment. Set-like dimensions carry `KNOWN`, `UNKNOWN` or `PARTIAL` plus values. Years carry `EXACT`, `RANGE` or `UNKNOWN` with explicit bounds. A known empty set is invalid; absent/null values do not mean global.

ABS values are literal `true` or `false`; unknown is the explicit knowledge state with an empty value list. Transmission values retain `manual`, `dct`, `automatic`, `cvt` or `other`. Equipment retains exact values such as `standard` and `SP`. No JavaScript truthiness participates in evaluation.

The evaluator returns per-dimension `MATCH`, `MISMATCH`, `UNKNOWN` or `PARTIAL`, plus overall state, blockers and reasons. A source range must contain the complete target range for a match. A source set must contain every selected target value. Overall evaluation is fail-closed: mismatch wins, then unknown, then partial; only all-dimension matches produce `MATCH`.

### ResearchTarget

A target stores schema version, stable ID, canonical catalogue variant reference, manufacturer/family label, bounded ApplicabilityScope, source-priority policy reference, 44-field Service Core baseline, optional GapPlan reference, source/prospect/history references, risk flags and research state. It does not contain manufacturer-specific publication fields or duplicate the full catalogue record.

### SourceProspect

A prospect stores stable target/document references, generic class/authority/identity states, one or more publication identifiers, an explicit identifier-relationship state, official locations, Tier, authentication, separate metadata/full-content accessibility, ApplicabilityScope, exhaustion, attempt references, marginal-gap class, readiness, blockers and next action.

Multiple regional identifiers can remain `RELATIONSHIP-UNRESOLVED`; the MT-09 B7N/LIT pair is represented without Yamaha-specific core fields. Accessibility uses the established eight states independently for metadata and content.

### GapPlan

`generateGapPlan` reuses the existing canonical 44-field Service Core and `calculateGaps`. It derives verified starting coverage, remaining fields, safety-critical remaining fields, researched-no-evidence, conflicts, attempted source classes, source-class relevance and categorical marginal opportunity. Missing fields remain missing; only explicit legacy `RESEARCHED-NO-EVIDENCE` rows enter that state, and conflicts remain unresolved.

## Canonical readiness gate

The ADR-012 gate accepts a validated ResearchTarget and SourceProspect, runs canonical applicability, and evaluates authority, document identity, identifier relationship, document class, official path, model/generation, year, market, transmission, ABS/equipment, content access, exhaustion and Tier A/B independence.

Only an authenticated prospect with every check true and overall applicability `MATCH` becomes `EXECUTION-READY`. UNKNOWN and PARTIAL applicability block. Blocked or broken content becomes `ACCESS-BLOCKED`. `MIRROR-ONLY` and unresolved identity/code relationships become `SOURCE-IDENTITY-PARTIAL`. Applicability mismatch deterministically becomes `REJECTED-MISMATCH`. Expected yield cannot override the gate.

## Compatibility proof

Shape-based adapters cover legacy research targets, prospect-inventory records and acquired-source records without modifying them:

- Yamaha MT-09 B7N/LIT remains `ACCESS-BLOCKED` with unresolved code relationship and EU/safety scope.
- Harley `94001064` produces a year `MISMATCH` and `REJECTED-MISMATCH` for MY2022.
- Yamaha MT-09 owner-manual data preserves ABS true, manual, EU and standard scope; its completed source remains exhausted/low-marginal rather than being reacquired.
- Honda CBR500R official owner-manual data maps successfully while unknown ABS remains unknown.
- Ténéré `BW3-F8197-E0` remains `REGISTERED-NOT-REAUTHENTICATED` and `FACTORY-PILOT-CANDIDATE`.

This proves use against current repository shapes without migrating historical datasets.

## Duplication and limitations

The canonical gate and evaluator are now the factory API. Historical `evaluateReadinessGate`, batch `validateApplicability`, technical research `scopeMatches`, and target-specific gate objects remain unchanged behind compatibility adapters. Migrating all callers now would exceed Foundation #1 and risk changing historical report semantics.

No false/null truthiness defect was found in the existing batch ABS validator; it already compares explicit values. The audit did confirm that legacy `scopeMatches` can treat omitted scope dimensions more permissively than the canonical fail-closed evaluator. That historical semantic divergence remains behind adapters for bounded migration rather than being changed implicitly here. Legacy free-text scope sometimes requires explicit adapter options rather than inference. No orchestrator, work-item/event reducer, scheduler, checkpoint persistence, discovery, acquisition, extraction or review engine was implemented.

## Ténéré and production boundaries

The Ténéré service prospect was not accessed or authenticated. It remains the later Factory Batch Pilot candidate after orchestrator and work-item foundations exist. No evidence, researched-no-evidence state, coverage, Service Core field, production profile/registry, runtime/browser, catalogue, cloud backend, release or VFR800 production data changed.

## Exact NEXT

Implement the bounded **Technical Research Factory Orchestrator Foundation**: add stable Batch, TargetWork, SourceWorkItem, Attempt and Event identities; an append-only JSON-safe event model; deterministic reducer/snapshot transitions; configured budget and terminal-state enforcement; and checkpoint/resume tests using only synthetic and existing adapted fixtures, with no external research, acquisition, extraction, live-data migration or production change.
