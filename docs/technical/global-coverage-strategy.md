# Global Technical Profile Coverage Strategy

## Objective

The long-term goal is reliable Technical Profile coverage for every motorcycle context that the catalogue can identify. Coverage means evidence-backed facts with correct year, market, ABS, and equipment applicability—not a nominal file for every model-year.

The scalable unit is a catalogue context backed by composable evidence scope. Shared generation or year-range facts are used only when the source explicitly covers that scope. Narrow overrides represent documented differences. This avoids both giant duplicated profiles and unsupported assumptions that a value remained unchanged.

## Rollout

### Stage 1 — catalogue completeness

Stabilize manufacturer, family, generation, year-range, market, ABS, and equipment identities. Find ambiguous or duplicate catalogue variants before attaching research. Catalogue identity is the join key for coverage reports and queues; it must not be inferred from a technical value.

Deliverables are auditable catalogue contexts, capability flags such as chain/shaft drive and cooling type, and a deterministic list of generations without production coverage.

### Stage 2 — core Technical Profile coverage

Prioritize identity and high-value operating/safety facts: engine basics, fluids, fuel, battery/charging essentials, brakes, tyres/pressures, final drive, dimensions/mass, and core maintenance intervals. Record researched-no-evidence explicitly so failed searches are not repeatedly mistaken for untouched gaps.

Use grade A evidence for automatic review eligibility. B/C evidence can guide research and conflict analysis but does not become verified production data.

### Stage 3 — service and workshop coverage

Expand diagnostic values, service limits, adjustment baselines, suspension service data, bearing/seal information, detailed maintenance actions, and safety-critical torques. Preserve conditions and measurement methods rather than flattening context-dependent values.

### Stage 4 — OEM service-parts coverage

Add original OEM numbers, explicitly documented supersessions, and current service replacements. Keep model-year, destination, and equipment scope attached to each fact. Distributor catalogues may be leads, but source policy—not matching seller listings—controls verification.

### Stage 5 — market and variant refinement

Close market, ABS, and equipment ambiguity using destination-specific OEM evidence. Split only the facts that differ; retain shared layers only where evidence covers every inherited context. This stage also resolves conflicts found during earlier broad-source research.

### Stage 6 — maintenance and quality control

Continuously re-run coverage, conflict, duplicate, source-integrity, and production-regression checks as catalogue and profiles evolve. Revisit source supersessions and narrow applicability when new OEM documentation disproves a broader claim.

## Operational cycle

For each repository state:

1. Generate catalogue contexts and capability flags.
2. Analyze production and research coverage against the reusable standard.
3. Generate the deterministic priority queue.
4. Select a bounded manufacturer, family, generation, or target-count batch.
5. Research and record candidates without changing production.
6. Resolve applicability and conflicts; validate evidence and proposed entries.
7. Generate a non-production promotion proposal.
8. Perform human review and explicitly author production changes.
9. Run focused and full regression tests, then record closure history.

The same inputs produce the same queue and batches. Popularity is not used unless the repository later gains a real, documented popularity dataset.

## Composition strategy

Prefer the broadest layer actually supported by evidence:

- generation layer when OEM evidence covers the generation;
- year-range layer when evidence names a bounded range;
- model-year layer for year-specific proof or differences;
- market, ABS, or equipment layer for variant-specific proof.

Do not promote repeated equal values into a shared layer unless evidence scope supports that merge. A narrower fact uses explicit replacement. An explicit removal represents documented absence/not-applicability. Overlapping incompatible definitions stop composition for review.

This composition remains a research/build step in v1. Production consumers continue to receive the existing validated Technical Profile shape.

## Measuring progress

Track, per context and globally:

- desired facts excluding not-applicable fields;
- verified and otherwise covered production facts;
- candidates awaiting review;
- missing and researched-no-evidence fields;
- conflicts and unresolved applicability;
- generations with no production profile;
- grade-A candidates ready for profile review.

Report core and desirable coverage separately when planning work. A single percentage is useful only with its denominator and not-applicable exclusions visible. Never count candidate, unresolved, conflicting, or no-evidence states as verified.

## Scaling controls

Keep batches small enough for source and applicability review. Reuse source records and evidence-scoped layers, not copied facts. Validate all candidate and layer identifiers. Keep research imports outside browser production code. Use synthetic records in tests rather than populating fake catalogue or profile data.

The VFR800 MY2002 profile remains the regression baseline while other families are introduced. A second non-VFR fixture and multi-manufacturer synthetic tests guard against VFR-specific assumptions. New real motorcycles should enter through the same candidate, coverage, queue, review, and explicit-promotion boundaries.

## Definition of trustworthy coverage

A motorcycle context is not complete merely because every field has a value. Trustworthy coverage requires resolvable evidence, valid representation, explicit applicability, no unresolved overlap, and stable production behavior. Unknown remains unknown; not applicable is represented separately; disagreement remains a conflict until reviewed.
