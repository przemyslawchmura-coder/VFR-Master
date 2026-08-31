# Post-Yamaha transfer-batch design

Date: 2026-08-31

Phase: 5

Classification: **ACCEPT-WITH-RISKS**

## Decision

The next acquisition batch is one new-manufacturer target: `harley-davidson.revolution-max.sportster-s`, Sportster S/RH1250S, MY2022 USA, manual, standard equipment. It may inspect only the repository-registered official Harley-Davidson owner manual identified by publication `94001064`, with a one-primary-document budget. No Honda/Yamaha control is included.

The source is **KNOWN-REGISTERED-NOT-REAUTHENTICATED**. Execution must first authenticate the internal publication identity and explicit MY2022 USA Sportster S/RH1250S inclusion. This design acquired no document and no evidence.

## Measured baseline

| Batch | Targets | Tier A documents | Yielding | Verified gain | Practical gain | Generic gain | Practical/yielding document |
|---|---:|---:|---:|---:|---:|---:|---:|
| Honda pilot | 5 | 5 | 2 | 50 | 48 | 2 | 24 |
| Yamaha transfer | 2 | 2 | 2 | 58 | 54 | 4 | 27 |

Honda moved 51/220 to 101/220 and Yamaha moved 0/88 to 58/88, both with zero conflicts. Observed: four rich, edition-scoped owner manuals yielded 24–27 practical slots each. Hypothesis: a similarly scoped official owner manual can transfer that method to a third manufacturer. Unknown: whether Harley publication `94001064` is comparably rich or explicitly includes RH1250S.

The Yamaha result strengthens the manual-richness hypothesis but does not establish a cross-manufacturer norm. Honda's three no-yield inspections remain contrary evidence.

## Marginal-yield model

Eligible candidates require a concrete repository-known Tier A/B document prospect. `UNKNOWN` prospects receive no numeric score and cannot be selected.

For eligible candidates, the transparent score is:

`midpoint expected marginal practical gain / expected primary documents - source/applicability/safety penalties - duplicate-research penalty`

The range estimates are hypotheses, not probabilities. Total remaining coverage is context only; it is never substituted for the fields plausibly obtainable from the next document. This prevents an unsupported 0/44 target from outranking a partially covered target with a known useful next source.

## Candidate pool and repository-known prospects

| Status | Manufacturer / target | Coverage | Source certainty | Exact prospect | Expected marginal practical/document | Score | Reason |
|---|---|---:|---|---|---:|---:|---|
| SELECT | Harley-Davidson Sportster S MY2022 USA | 0/44 | KNOWN-REGISTERED-NOT-REAUTHENTICATED | Official-host owner manual `94001064` | 6–18 | 8 | Only concrete new-manufacturer Tier A prospect; fail-closed authentication test |
| DEFER | Yamaha MT-09 III MY2021 EU | 29/44 | KNOWN-AUTHENTICATED | Service manual `B7N-28197-E0` / `LIT-11616-34-61` | 4–8 | 2 | Lower marginal workshop yield; not a new-manufacturer test |
| DEFER | Yamaha Ténéré 700 I MY2019 EU | 29/44 | KNOWN-REGISTERED-NOT-REAUTHENTICATED | Service manual `BW3-F8197-E0` | 3–8 | 0.5 | Inaccessible content and weaker identity |
| DEFER | Honda CBR500R PC70 MY2024 | 26/44 | PARTIAL | 2024 CB500F/CBR500R/NX500 service-manual family | 2–6 | -3 | No publication code; dealer/Helm blocked; prior owner source exhausted |
| REJECT | Honda VFR800 RC46 VTEC MY2002 | 13/44 | PARTIAL | Unidentified VFR800/VFR800A manual mirror | 4–12 | 0 | No official host; identity and ABS scope unresolved |
| DEFER | Suzuki SV650 III | 0/44 | UNKNOWN | none | UNKNOWN | — | Official specification material only |
| DEFER | Kawasaki Ninja 650 II | 0/44 | UNKNOWN | none | UNKNOWN | — | Official history/specification material only |
| DEFER | BMW F 900 R I | 0/44 | UNKNOWN | none | UNKNOWN | — | No exact stored manual identity |
| DEFER | Ducati Monster 937 | 0/44 | UNKNOWN | none | UNKNOWN | — | Generic official manual library, no exact stored document |
| DEFER | Triumph Street Triple 765 III | 0/44 | UNKNOWN | none | UNKNOWN | — | Official specification material only |

The machine-readable companion records year/market confidence, ABS, transmission, equipment and safety risk, expected reuse, research history and duplicate penalties for every candidate.

## Strategy and batch size

- **Selected: one new manufacturer only.** It directly tests transfer to a third manufacturer with the sole concrete repository-known prospect.
- **Rejected: mixed batch with a control.** Four successful Honda/Yamaha owner manuals already control the method. Another consumes budget; the available Yamaha service-manual prospect tests a different source class.
- **Deferred: Honda/Yamaha only.** Their workshop sources may fill useful marginal gaps, but do not answer broader transferability and have lower expected marginal yield.

One target is preferable to two because there is only one eligible new-manufacturer prospect. Zero targets cannot test it; adding a second target would either admit UNKNOWN evidence or spend a document on a question already measured. Three or four targets would magnify both defects.

## Execution scope and budget

Target scope: MY2022 USA Sportster S/RH1250S, manual, standard model. ABS remains `null` until the source resolves it. Other models in the eight-domestic-model document and special equipment are excluded unless explicitly scoped.

Preferred source: Tier A official owner manual `94001064` on `serviceinfo.harley-davidson.com`. Authenticate publication code, edition/market and included-model index before extraction. Prioritize oil, coolant, plugs, maintenance, final drive, brake fluid, pressures/load distinctions, battery/fuses and documented critical torques.

Budget is one primary document total and per target. There is no second-document allowance in this batch. Stop early when useful practical gain is exhausted.

## Acceptance and stop rules

Execution succeeds only with at least +8 verified slots, including +6 practical slots and +6 practical for the sole yielding target; no Tier C/D practical contribution; zero unresolved safety-critical conflicts; and no production changes.

Stop if the official URL/internal identity cannot authenticate; RH1250S is not explicit; MY2022 USA scope is unresolved; ABS/equipment ambiguity blocks safety-critical values; the document yields fewer than six practical slots; remaining gaps require inference; or the one-document budget is exhausted.

This deliberately discounts the Honda/Yamaha 24–27-slot yield because only three unpaged Harley candidate facts are stored. It still demands useful practical service value rather than row volume.

## Falsification and independent audit

The transfer hypothesis is weakened if the document cannot authenticate, omits/ambiguously scopes RH1250S, yields fewer than six practical slots, depends on Tier C/D evidence, leaves a safety-critical conflict, or produces many rows but fewer than six practical slots. A document without an explicit included-model index or with only generic ownership/legal content would make this a poor use of the next research hour.

Audit challenges found:

- Selection rests on a repository-known official-host prospect, while all UNKNOWN prospects remain unranked.
- Marginal expected yield—not raw missing coverage—drives selection.
- Special-equipment, ABS and multi-model-manual risks are severe and fail closed.
- Owner-manual success may be over-weighted; workshop manuals can have higher safety value despite fewer fields. Those Yamaha prospects remain deferred, not dismissed.
- One target is auditable but tests only Harley-Davidson; its expected 6–18 range is intentionally wide.
- Document reuse cannot inflate yield: one underlying document is counted once.
- The design is entirely non-production and changes no evidence or coverage.

Classification: **ACCEPT-WITH-RISKS**. The design is bounded and falsifiable, but exact model inclusion and document richness remain unverified.

## Exact next task

Execute the one-target MY2022 USA Harley-Davidson Sportster S/RH1250S owner-manual transfer batch: authenticate registered publication `94001064` and exact model applicability first, then extract only directly supported practical Service Core evidence under a one-primary-document, +8 verified/+6 practical, zero-conflict and non-production gate.
