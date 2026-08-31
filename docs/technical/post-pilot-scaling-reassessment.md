# Phase 5 post-pilot scaling reassessment

Date: 2026-08-31<br>
Classification: **ACCEPT-WITH-RISKS**<br>
Boundary: **DESIGN ONLY — NON-PRODUCTION RESEARCH**

## Decision

The next acquisition batch should be a **two-target, single non-Honda-manufacturer Yamaha batch**:

1. `yamaha.mt-09.gen3` — MT-09 III, MY2021, EU, manual transmission, standard model only (exclude SP).
2. `yamaha.tenere-700.gen1` — Ténéré 700 I, MY2019, EU, manual transmission, standard model only (exclude Rally, World Raid, Explore and Extreme).

This is not a claim that Yamaha is generally superior or that the catalogue generations are fully covered. These two editions are the only non-Honda candidates in the bounded repository-known pool with both registered official owner manuals and existing page-referenced material showing service-rich chapters. Selecting them tests whether the Honda owner-manual yield transfers to Yamaha without spending an acquisition slot on a source prospect that is currently `UNKNOWN`.

No evidence was acquired, validated or promoted in this reassessment. Starting Service Core coverage is 0/44 for each selected production catalogue key because the older Yamaha candidates are not verified evidence in the generic Service Core pipeline.

## Reproduced pilot result

The executable pilot result was recomputed from `research/data/high-value-source-acquisition-pilot-results.js`, not copied as an acceptance assumption:

- Classification: `ACCEPT-WITH-RISKS`; five targets.
- Service Core: 51/220 → 101/220; +50 verified slots, +48 practical and +2 generic.
- Five inspected and five unique Tier A documents; two yielded evidence; six hosting locations contained one duplicate location.
- 52 evidence rows, zero conflicts, no source-budget overrun.
- Production and the VFR800 production profile remained unchanged.

## Pilot lessons and yield analysis

### Observed facts

- NC750X gained 25 slots because one authenticated MY2021–2023 EU owner manual had explicit NC750XA/NC750XD identities, maintenance and service-data chapters, and separable manual/DCT oil quantities. Twenty-four gains were practical and one was idle speed.
- CBR600RR gained 25 slots because one authenticated MY2024 EU/UK road owner manual had a service-data section, ED/II ED maintenance schedule and explicit road-use scope. Twenty-four gains were practical and one was idle speed.
- CBR500R gained zero because its authenticated MY2024 owner manual had already supplied the 26-slot baseline; bounded reinspection found no new practical slot. The failure predictor was research duplication, not poor authority or content.
- VFR800 gained zero because the authenticated service card was already exhausted. The remaining rich workshop content retained uncertain manual identity, so authority/proof—not gap size—blocked it. VFR800/VFR800A applicability remains relevant for any later attempt.
- Africa Twin gained zero because the available official document was USA-specific and combined standard, DCT and Adventure Sports identities while the target was EU/UK standard. Market, transmission and equipment applicability—not raw source authority—blocked use.
- No target failed because of an unresolved conflict. ABS ambiguity did not create a pilot conflict, but remained a required safety gate. Source duplication was detected only for alternate CBR600RR hosting and did not inflate document yield.

### Hypotheses, not facts

- A page-rich official owner manual with specifications, periodic maintenance, consumables, tire/load conditions and routine adjustment chapters is likely to yield 18–24 practical Service Core slots when the target currently has little verified evidence.
- The strategy is likely transferable from Honda to Yamaha because the repository already contains Yamaha owner-manual candidates with the same service-rich chapter pattern. This remains unproven until executed.
- Honda's Motopub availability may be unusually convenient. The pilot does not establish equivalent access, identity conventions or content richness for Suzuki, Kawasaki, BMW, Ducati or Triumph.
- Two Yamaha models test manufacturer transfer and two use classes, but cannot establish multi-manufacturer scalability.

The pilot must **not** be generalized to later model years, related models sharing engines, SP/Rally/Adventure variants, other markets, or owner manuals whose content has not been inspected. A low baseline alone is not a yield predictor.

## Source-yield heuristic

The transparent rubric rewards current and practical gaps, a repository-known Tier A/B prospect, document richness, clear model/year and market identity, and useful reuse. It penalizes ABS, transmission, equipment and safety-applicability risk plus duplicate/exhausted research history. The component maxima and penalties are machine-readable in `research/data/post-pilot-scaling-reassessment.js`.

The score is only a queue heuristic. If either Tier A/B prospect or document richness is `UNKNOWN`, the total is `null` and the candidate is ineligible for this batch. This prevents unknown availability from silently becoming optimistic or pessimistic. It also prevents a large raw gap from outranking a known rich manual. Practical-gap weight is twice the generic gap weight, so brochure dimensions or fame cannot dominate selection.

## Bounded candidate pool

| Candidate | Manufacturer | Coverage | Tier A/B prospect | Score | Result |
|---|---|---:|---|---:|---|
| Ténéré 700 I | Yamaha | 0/44 | known official MY2019 EU owner manual | 41 | selected |
| MT-09 III | Yamaha | 0/44 | known official MY2021 EU owner manual | 40 | selected |
| CBR500R PC70 | Honda | 26/44 | known but exhausted | 10 | rejected: duplicate research, expected 0–4 practical |
| CBR1000RR-R Fireblade SC82 I | Honda | 4/44 | `UNKNOWN` (only Tier C history recorded) | — | deferred: SP/equipment and source prospect unresolved |
| Africa Twin CRF1100L I | Honda | 5/44 | `UNKNOWN` for exact EU/UK standard target | — | deferred: market/DCT/Adventure Sports risk |
| SV650 III | Suzuki | 0/44 | `UNKNOWN` | — | deferred: no known Tier A/B prospect; broad year scope |
| Ninja 650 II | Kawasaki | 0/44 | `UNKNOWN` | — | deferred: no known Tier A/B prospect |
| F 900 R I | BMW | 0/44 | `UNKNOWN` | — | deferred: no known Tier A/B prospect; equipment risk |
| Monster 937 | Ducati | 0/44 | `UNKNOWN` | — | deferred: no known Tier A/B prospect |
| Street Triple 765 III | Triumph | 0/44 | `UNKNOWN` | — | deferred: no known Tier A/B prospect; R/RS risk |

The pool contains ten targets across seven manufacturers. “Unknown” means the repository has no authenticated practical Tier A/B prospect for the exact target; it is not a statement that such a source does not exist externally.

## Batch size and manufacturer strategy

Two targets are sufficient for this next bounded execution because both test Honda-to-Yamaha transfer while differing materially in road/adventure use and pressure/chain conditions. A single target would be anecdotal. Adding a third target would require admitting an `UNKNOWN` Tier A/B prospect or a known exhausted/mis-scoped Honda source, weakening diagnosis rather than improving diversity. The design therefore chooses strategy **B: single non-Honda manufacturer**. Multi-manufacturer acquisition remains unearned, not prohibited forever.

## Target contracts

### Yamaha MT-09 III

- Scope: `yamaha.mt-09.gen3`, MY2021 only, EU, manual, standard equipment; exclude SP.
- Starting coverage: 0/44.
- Priority: oil specification/capacities; coolant; spark plug/gap; valve interval; maintenance schedule; chain slack/service; brake fluid/interval; cold solo/loaded pressures; battery/fuses; clearly identified oil/filter/spark-plug/rear-axle torques.
- Expected practical gain: 18–24 slots.
- Primary-document budget: maximum two.
- Main risks: the catalogue generation continues through MY2023; standard/SP and ABS scope must remain explicit.

### Yamaha Ténéré 700 I

- Scope: `yamaha.tenere-700.gen1`, MY2019 only, EU, manual, standard equipment; exclude Rally, World Raid, Explore and Extreme.
- Starting coverage: 0/44.
- Priority: the same routine-service fields, with road/off-road and solo/loaded tire conditions kept separate.
- Expected practical gain: 18–24 slots.
- Primary-document budget: maximum two.
- Main risks: the catalogue generation continues through MY2024; later equipment versions and road/off-road pressure conditions must not be collapsed.

Expected combined practical gain is 36–48 slots. This range is discounted from the pilot's 24 practical slots per yielding manual by retaining lower bounds and refusing to count existing candidates before proof/applicability validation.

## Source sequence and stop conditions

For each target:

1. Reauthenticate the already registered official Yamaha owner manual and its exact edition/model/year/market identity.
2. Inspect its maintenance, periodic service, specification, fluids, tires, chain, brake, electrical and torque sections.
3. Use an official service-data or maintenance publication only if the first document yields at least ten practical slots and a specific high-value gap justifies the second document.
4. Use official OEM parts material only for useful Service Core/consumable identity, not fiche completeness.
5. Tier C/D may support discovery or identity, but contributes zero rows toward practical success.

Stop a target if source identity, selected year/market, standard-equipment, ABS or safety-critical scope cannot be resolved; the first primary document yields fewer than ten practical slots; a second location is duplicate; the next source adds no practical evidence; or two primary documents are exhausted. Unknown remains unknown, manual remains distinct from automated transmissions, ABS stays tri-state, and no shared-platform inference is allowed.

## Acceptance thresholds

- At least 24 new verified target slots overall.
- At least 22 new practical-service slots overall.
- At least ten practical slots for each target counted as yielding.
- Maximum two primary documents per target and four overall.
- Zero Tier C/D practical evidence rows counted toward success.
- Zero unresolved safety-critical conflicts.
- Applicability-blocked rows remain unverified; a target may finish `RESEARCHED-NO-EVIDENCE`, but its disposition and stop reason must be reported.

These are not the pilot's +15/+10 gates. The two sources are already known to contain practical chapters, so the next gate requires roughly one discounted pilot-yield document overall while retaining per-target diagnostic handling.

## Independent falsification audit

The design is **ACCEPT-WITH-RISKS**.

- Realistic researchability: supported by two registered official Yamaha manuals and existing page references; external continued access is not assumed.
- Practical selection: supported; service fields dominate both existing candidate sets and the scoring rubric.
- Tier bias and deduplication: explicit; Tier C/D cannot satisfy practical success and document identity remains independent of URL.
- Size: two is the smallest batch that tests repeatability across two use classes; it does not prove multi-manufacturer scaling.
- Applicability: edition scopes are one year each; later years, SP and named Ténéré equipment are excluded.
- Existing research: used to estimate richness but not counted as verified Service Core evidence.
- Vanity risk: mitigated by practical weighting and thresholds; generic gains cannot substitute for 22 practical slots.
- Safety: unresolved ABS/equipment/condition scope prevents verification; conflicts must remain explicit.
- Production boundary: no runtime, registry, production profile or VFR800 change is permitted.

The selection hypothesis is falsified if fewer than 22 practical slots are verified overall, neither target reaches ten practical slots, either registered manual cannot be authenticated for the selected edition/scope, or any unresolved safety-critical conflict remains. The expected gain remains a heuristic and is the principal risk.

## Exact next execution task

Execute the bounded two-target Yamaha owner-manual acquisition batch for MY2021 EU MT-09 III standard and MY2019 EU Ténéré 700 I standard, under the recorded applicability, two-document-per-target budget, practical-yield thresholds, independent audit and non-production gates.
