# Technical Profile Research Pipeline v1

## Purpose

Technical Profile v1 has a deliberately strict production contract, but its original authoring workflow was optimized for one manually researched motorcycle. This pipeline adds a reusable, deterministic research layer around that contract. It supports catalogue-wide coverage analysis, evidence-scoped composition, work queues, review gates, and non-production drafts without changing the production resolver, registry, browser store, search, or UI.

The Honda VFR800 VTEC MY2002 profile remains the golden fixture. Its file and production behavior are not migrated into the layer system in v1.

## Architecture and data flow

The implementation is intentionally outside the browser production path:

1. The motorcycle catalogue supplies stable identity and variant contexts.
2. Research candidates record proposed facts and their evidence independently of production status.
3. The coverage standard describes motorcycle-independent desired facts.
4. The coverage engine compares context, production facts, and research state.
5. The queue generator turns gaps into deterministic research batches.
6. Composition can resolve reviewed layers into the existing Technical Profile entry shape.
7. The promotion gate produces review decisions; it never writes production data.
8. The draft generator emits an explicitly non-production proposal.
9. A human may later author or update a production profile through the existing validator and registry process.

`js/research/technical-research-pipeline.js` is Node-only and is not imported by `index.html`, the Technical Profile Registry, or the Browser Profile Store. `scripts/technical-research-status.js` is a small CI-friendly observer over current repository data.

## Research candidate model

A candidate has a stable `id`, `manufacturer`, `family`, `generation`, `years`, `applicability`, `category`, `coverageField`, `proposedEntryId`, proposed value/entry, conditions, source IDs, source page/section, evidence grade, research status, notes, and conflict IDs. Applicability can preserve region, ABS (`true`, `false`, or unresolved `null`), and equipment scope.

Research statuses are distinct from production entry statuses:

- `verified-evidence-candidate`
- `researched-no-evidence`
- `conflicting-evidence`
- `applicability-unresolved`
- `needs-human-review`
- `ready-for-profile-review`

`researched-no-evidence` may omit a proposed production entry, but still identifies the intended coverage field. Candidate validation checks identity, year and applicability scope, source resolution, evidence grade, and—when supplied—the proposed entry through the existing Technical Profile validator.

## Evidence policy

The grades are:

- A — direct OEM proof
- B — strong OEM indirect proof
- C — authoritative corroboration
- D — insufficient

Only A is eligible by default for profile review. B, C, and D remain useful research records but cannot pass the promotion gate. Grade A requires a resolvable source. Research status never silently becomes a production verification status.

## Layer model

A layer declares:

- a stable layer ID;
- a target `scope` (year range, regions, ABS, and equipment);
- an independent `evidenceScope` covering the same dimensions;
- sorted operations against existing Technical Profile entry IDs.

Layers can represent generation-wide, year-range, model-year, market, ABS, or equipment facts without embedding any manufacturer-specific rule. Composition is pure, DOM-independent, network-independent, and order-stable.

The result uses the current Technical Profile entry shape and includes an ownership sidecar per entry: `owningLayerId`, original `evidenceScope`, and whether the entry was inherited. Provenance is therefore not copied or broadened when a target context is resolved.

### Inheritance rules

A layer applies only when both its target scope and evidence scope cover the requested context. A generation-wide target with evidence limited to MY2020–2022 cannot populate MY2023. A constrained market, ABS, equipment, or year scope requires that context to be known; `null` is ambiguity, not a wildcard.

An unchanged inherited entry retains its original entry sources and ownership metadata. Identical values in another year do not establish inheritance.

### Override and removal rules

Operations are explicit:

- `add` introduces an entry where none exists, or repeats the identical definition;
- `replace` deliberately replaces a broader definition;
- `remove` deliberately marks an inherited entry absent/not applicable in the narrower context.

Specificity is deterministic: year scope, then region, ABS, and equipment constraints. Layers are secondarily ordered by stable layer ID, never input order. A narrower differing `add` is not treated as an implicit replacement. It is a conflict. Two equal-specificity overlapping definitions for the same entry also conflict if their operations differ.

The composer returns `conflicting-layers` rather than guessing. Unknown required context returns `ambiguous-context` with the missing dimensions.

## Coverage standard and engine

`research/schema/technical-coverage-standard-v1.js` defines reusable desired coverage across identity, engine, fluids, fuel, electrical, brakes, final drive, wheels/tyres, suspension, dimensions/mass, maintenance, OEM service parts, and torques.

Each definition is `required`, `desirable`, or `conditional`. Conditional capability predicates prevent, for example, chain fields from penalizing a shaft-drive motorcycle or clutch fluid from penalizing a cable-clutch motorcycle.

For a catalogue context, production entries, candidates, capabilities, and a standard, the engine classifies every field as:

- `covered`
- `verified`
- `candidate`
- `missing`
- `researched-no-evidence`
- `conflicting`
- `applicability-unresolved`
- `not-applicable`
- `needs-human-review`

It reports desired total, verified, missing, conflicts, and a coverage percentage. Not-applicable fields are excluded from the denominator. Candidates and no-evidence results are never counted as verified.

## Research queue and batches

Queue records contain manufacturer, family, generation, year range, context, missing categories, priority, reason, and catalogue variant key. Priority is evidence-driven:

1. generation has no production profile;
2. core safety/service gaps;
3. unresolved applicability;
4. conflicting evidence;
5. OEM service-parts gaps;
6. desirable secondary gaps.

There is no popularity score. Ordering uses priority followed by stable identity and year keys. Batches can select a manufacturer or family and cap generations or targets. Identical inputs always produce identical output.

## Deduplication

Deduplication reports opportunities; it does not mutate records. A merge is safe only when entry ID, value, conditions, year scope, applicability scope, and source scope are identical. Equal values with different evidence scope are flagged for review and cannot establish a shared layer.

## Promotion gate and drafts

A candidate is ready only if:

- it validates;
- it is grade A;
- its source IDs resolve;
- its proposed Technical Profile entry validates;
- its research status is promotable;
- year, market, ABS, and equipment scopes are valid;
- it has no unresolved overlapping evidence conflict.

The result `ready-for-profile-review` is a research decision, not production promotion. `generateDraftProposal` emits `revlog-technical-draft-proposal/v1`, with `production: false` and `registered: false`, accepted proposals, rejected candidates, blockers, and original research ownership. It does not write files or update a registry.

## Human and production boundaries

Human review remains mandatory before production. Reviewers decide whether the evidence and representation are appropriate, then explicitly edit a production profile/source registry and add focused tests. The existing production validator, resolver, registry, browser store, search, clarification behavior, and UI remain authoritative.

No research module is imported into the production runtime. No candidate is discoverable by the Browser Profile Store. No draft is automatically registered. These boundaries are covered by isolation and regression tests.

## Golden and scale fixtures

The VFR800 MY2002 module is loaded as an immutable golden fixture. Tests compare its serialized data and file bytes before and after analysis, and compare resolver/search results. An existing synthetic non-VFR Technical Profile proves that the pipeline accepts the general production contract. Synthetic scale tests exercise several manufacturers, families, generations, year ranges, markets, ABS states, equipment scopes, conflicts, missing evidence, conditional fields, inheritance, and overrides without adding fake production profiles.

## Developer command

Run:

```sh
node scripts/technical-research-status.js
```

The deterministic JSON summary reports catalogue targets, production profiles, research targets/candidates, verified production coverage, missing production generations, conflicts, and candidates ready for review. It is a status surface, not an importer or promoter.
