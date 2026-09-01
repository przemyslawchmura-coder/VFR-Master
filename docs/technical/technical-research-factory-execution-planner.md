# Technical Research Factory Execution Planner

Date: 2026-09-01

Outcome: **ACCEPT-WITH-RISKS**. Planner schema version 1 deterministically converts canonical ResearchTargets, GapPlans, SourceProspects, Foundation readiness results, explicit SourceCapabilities and a PlanningPolicy into existing Orchestrator ResearchBatch, TargetWork and SourceWorkItem records. It is non-production and executes nothing.

## Contracts and inputs

PlanningPolicy declares batch purpose, finite per-source/per-target/per-batch work and attempt limits, ordered allowed source classes/tiers and explicit practical Service Core fields. Its semantic SHA-256 ID covers every policy field and becomes the Orchestrator batch policy ID. ExecutionPlan contains the validated policy, summary, decision record for every deduplicated target/prospect/operation candidate and canonical planned batches. SourceCapability is either `KNOWN` with explicit Service Core field IDs or `UNKNOWN` with none; the planner never infers universal usefulness.

Inputs are canonical ResearchTargets, one canonical GapPlan per target, SourceProspects, caller-supplied Foundation readiness results, SourceCapabilities and finite candidate attempt bounds. Readiness is recomputed and must match exactly. Planning has no clock, random, network, filesystem or mutable global dependency.

## Gap and capability semantics

A source is considered useful only when its declared fields intersect `GapPlan.remainingFields`. Each addressed field is preserved as `MISSING`, `CONFLICT` or `RESEARCHED-NO-EVIDENCE`; no state is reinterpreted and no evidence is fabricated. Service Core remains the existing 44 fields. Unknown capability is deferred; known capability with no unresolved intersection is `NOT-NEEDED`.

## Priority and decisions

Eligible candidates sort by: safety-critical field count, policy-declared practical field count, configured source-class order, configured Tier order, total addressed fields, lower attempt cost, then target/prospect/operation semantic key. Classes or tiers absent from policy are deferred. The deterministic states and primary reason codes are:

- `PLANNED` / `PLANNED_GAP_MATCH`
- `DEFERRED` / `FOUNDATION_EXHAUSTED`, `CAPABILITY_UNKNOWN`, `SOURCE_CLASS_NOT_ALLOWED`, `SOURCE_TIER_NOT_ALLOWED`, `TARGET_WORK_LIMIT`
- `REJECTED` / `FOUNDATION_REJECTED_MISMATCH`, `TARGET_NOT_IN_PLAN`
- `BLOCKED` / `FOUNDATION_READINESS_BLOCKED`
- `NOT-NEEDED` / `NO_UNRESOLVED_GAP`

Foundation readiness is authoritative. UNKNOWN/PARTIAL applicability, blocked/broken/mirror access and unresolved identity cannot plan. Exhausted sources defer; mismatches reject. ABS false/unknown, manual/DCT, EU/US, year and standard/SP remain distinct Foundation scope dimensions.

## Bounds, batching and compatibility

Semantic duplicates collapse only when their canonical target/prospect/capability/readiness/attempt inputs agree; conflicting duplicates fail. Different target, prospect, operation or applicability identity remains distinct. Candidates are capped per target, then packed deterministically by target and priority into batches respecting maximum targets, work items and total attempts. Batch purpose receives a stable one-based part suffix. Policy ID and attempt maximum flow into existing Orchestrator batch identity.

Planner output contains actual Orchestrator validators' records, not drafts. Tests append them directly as `batch-created`, `target-added`, `source-work-created` and `batch-resumed` events; the existing reducer reconstructs READY source work without conversion.

## Existing fixtures and isolation

Existing local fixtures remain unplanned: Honda CBR500R, Yamaha MT-09 and VFR800 are deferred as exhausted/low-yield; Harley is rejected mismatch; Ténéré `BW3-F8197-E0` remains blocked and unauthenticated. A synthetic local ready source proves planned-output compatibility. No source was contacted and no evidence, researched-no-evidence, coverage, production profile/registry, runtime/browser, catalogue, Supabase, release or historical dataset changed.

## Audit and risks

Falsification covered readiness spoofing, capability invention, class/tier ordering, input order, duplicates, policy identity, batching/attempt bounds, scope collapse, JSON safety, mutation, Orchestrator compatibility and production leakage. Result: **ACCEPT-WITH-RISKS**. Capability declarations are trusted local planning inputs whose provenance still needs typed acquisition-result validation; expected coverage is declared rather than measured future yield; and no real current prospect is execution-ready, so the PLANNED path necessarily uses a synthetic local fixture.

## Exact NEXT

Implement the bounded **Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation**: define the typed interface for attempting already-planned SourceWorkItems and recording immutable attempt outcomes/events under existing readiness, attempt-budget and checkpoint limits. Use synthetic/local fixtures only; do not begin uncontrolled multi-target research or change production.
