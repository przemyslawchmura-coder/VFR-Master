# High-value source-acquisition pilot — executed result

Date: 2026-08-31  
Classification: **ACCEPT-WITH-RISKS**  
Boundary: **NON-PRODUCTION RESEARCH**

## Outcome

The bounded five-target pilot met both formal yield thresholds without an unresolved safety-critical conflict: 51/220 → 101/220 verified target slots, +50 total, +48 practical-service and +2 generic-specification slots. The result is not a broad applicability claim: the acquired NC750X manual covers MY2021–2023, the CBR600RR manual covers MY2024, and three targets yielded no new evidence.

## Metrics

- Documents inspected / unique documents: 5 / 5
- Hosting locations / duplicate locations: 6 / 1
- Yielding documents: 2
- Evidence rows / verified slot gain: 52 / 50
- Evidence rows per yielding document: 26
- Source tiers: A=5, B=0, C=0, D=0
- Conflicts: 0; unresolved applicability/researched-no-evidence cases: 3
- Source budget exceeded: no

## Target results

| Target | Before | After | Gain | Practical | Generic | Inspected | Yielding | Tier | Blocker |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| `honda.cbr500r.pc70` | 26 | 26 | +0 | +0 | +0 | 1 | 0 | A | existing authenticated owner manual exhausted without a net-new practical slot |
| `honda.vfr800.rc46.vtec.gen1` | 13 | 13 | +0 | +0 | +0 | 1 | 0 | A | authenticated service card exhausted; workshop-manual identity remains uncertain |
| `honda.nc750x.rh09-1` | 3 | 28 | +25 | +24 | +1 | 1 | 1 | A | none |
| `honda.africa-twin.crf1100l-1` | 5 | 5 | +0 | +0 | +0 | 1 | 0 | A | official USA manual rejected for EU/UK and standard/Adventure Sports applicability |
| `honda.cbr600rr.rh10` | 4 | 29 | +25 | +24 | +1 | 1 | 1 | A | none |

Important remaining practical gaps are retained machine-readably in `research/reports/high-value-source-acquisition-pilot.json`.

## Source and stop record

- **31MLRB00 / 00X31-MLR-B000** (A, official-owner-manual): honda.cbr500r.pc70; acquired-content; inspected pages 95, 175, 176, 177; stop: duplicate source adds no new evidence. Existing 26 verified slots were reused; already verified fields were not re-extracted.
- **VFR800F 2002-2005 huoltokortti** (A, official-service-data-publication): honda.vfr800.rc46.vtec.gen1; acquired-content; inspected pages 1; stop: duplicate source adds no new evidence. All authenticated fields from this card were already represented in the 13-slot baseline; uncertain workshop-manual rows remained unverified.
- **34MKW600 / 00X34-MKW-6000** (A, official-owner-manual): honda.nc750x.rh09-1; acquired-content; inspected pages 9, 104, 105, 106, 113, 114, 115, 116, 136, 173, 174, 175; stop: primary source yielded the bounded practical fields; no further document required. Shared values cover manual and DCT; oil capacities are separately scoped to NC750XA manual and NC750XD DCT.
- **31MKS800** (A, official-owner-manual): honda.africa-twin.crf1100l-1; wrong-applicability; inspected pages 1, 367, 368, 369; stop: applicability remains unresolved. The pilot target is EU/UK and standard-model data must not be inherited from Adventure Sports or a USA publication.
- **32MKZ700** (A, official-owner-manual): honda.cbr600rr.rh10; acquired-content; inspected pages 11, 110, 111, 112, 119, 120, 121, 122, 141, 181, 182, 183; stop: primary source yielded the bounded practical fields; no further document required. ED/II ED road-owner data only; GS schedule rows and race/track material were excluded.

One CBR600RR document identity has two Honda Motopub locations (PDF and HTML); it counts once. Existing CBR500R and VFR documents were reused without re-counting baseline evidence.

## Independent audit

The audit independently recomputed the five target keys, 51-slot baseline, document identity/location counts, before/after slots, practical/generic classification, transmission-scoped NC750X oil rows, conflicts and budgets from repository data.

Falsification checks found:

1. Practical value is real: 48/50 gained slots are service fields, not brochure specifications.
2. Every inspected document is Tier A; no Tier C/D row is accepted.
3. The duplicate CBR600RR PDF/HTML locations collapse to one document identity.
4. Existing CBR500R/VFR fields were not emitted as new rows.
5. NC750X manual/DCT oil quantities remain separate; the pipeline now represents `manual` and `dct` explicitly.
6. CBR600RR evidence is ED/II ED road-owner data; GS schedule and race/track data are excluded.
7. Africa Twin USA/Adventure Sports applicability was rejected, not generalized to the EU/UK standard target.
8. Tire pressures, brake fluid, chain slack and intervals retain page, condition and applicability proof.
9. Generic gain is exactly two idle-speed slots and is excluded from the 48-slot practical count.
10. Each target used one primary document, below the three-document cap.
11. Production registry/profile/runtime files are unchanged.
12. Metrics are reproduced by `node scripts/high-value-source-acquisition-pilot-report.js` and focused tests.

Skeptical classification: expected — Tier A owner manuals yield concentrated service data and exhausted sources yield nothing; supported surprise — two documents produce +50 scoped slots and expose the transmission-enum defect; unresolved — NC750X MY2024, CBR600RR MY2025, VFR manual identity, and Africa Twin EU/UK standard applicability; failure — none against the formal bounded pilot thresholds.

Outcome: **ACCEPT-WITH-RISKS**. The pilot goal is achieved, but the unresolved year/applicability boundaries prevent treating 101/220 as uniform coverage across every year/submodel in each target scope.
