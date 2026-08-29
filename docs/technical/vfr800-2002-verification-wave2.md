# Honda VFR800 VTEC 2002 — verification wave 2

Access date for web material: 2026-08-29. Evidence grades: A direct OEM proof, B strong OEM indirect proof, C authoritative corroboration, D insufficient. No forum, marketplace, seller listing or AI summary was used as production evidence.

## Executive summary

Wave 2 evaluated 77 distinct candidate facts across brakes (15), final drive (14), wheels/tyres (14), electrical (10), OEM service parts (12), and dimensions/chassis (12). Fourteen production closures were justified: nine new chassis/dimension entries, one new Japan headlight branch, and upgrades of wheelbase, fuel capacity, PGM-FI fuse and Japan-market Dual CBS. Twenty-three already-covered facts were reconfirmed and 40 candidates remain unresolved. One existing value was corrected: `fuses.pgm-fi` had the right 20 A rating but the wrong location.

Production moved from 79/69/10 total/verified/pending entries to 88/82/6. No resolver, clarification, search, catalog, UI or cloud behavior changed.

## Sources researched

| Source | Type / scope | Evidence used | Grade |
|---|---|---|---|
| Honda VFR800/VFR800A 2002 Service Manual, publication 61MCW07, pp. 1-4, 1-9, 1-14, 1-17–1-18, 2-20, 3-19–3-21, 15-20 and relevant system chapters | OEM workshop manual; VFR800/VFR800A MY2002 | dimensions, suspension travel, fuel capacity, tyres, existing torques/limits, PGM-FI fuse rating and fuse-case location | A |
| Honda Japan, *V4 VTEC VFR 2002.01 Press Information* | official launch technical publication; BC-RC46, Japan, MY2002 | geometry/fuel corroboration, Dual CBS name, Japan quad-headlight specification | A |
| American Honda bulletin VFR800/A #4, November 2007 | OEM technical bulletin; USA 2002–2003 | standard/ABS wiring and fuse layout; checked again for FI and charging assignments | A where labels are explicit; D for a PGM-FI label not shown on its diagrams |
| Honda Finland RC46 2002–2005 service-data card | OEM service card; EU | existing tyre pressures, chain/service schedule and consumables | A for stated values |
| Honda publication metadata for parts catalogue 14MCW2E1 | OEM catalogue identity; USA 2002–2005 | confirms catalogue existence, but public metadata contains no fiche rows | D for individual part numbers |
| Partzilla 2002 VFR800/VFR800A fiches | distributor reproduction | candidate rear sprocket, bearings/seals and brake/air-filter fitment | C only; not admitted to production |
| Bolton Motorcycles destination fiches and Partzilla headlight fiche | distributor reproductions | headlight destination cross-check | C; exposed unresolved AU/CM/U ambiguity |

Stable production additions are `doc.honda.vfr800-2002.jp-press-information`, `cite.honda.vfr800-2002.sm.pgm-fi-fuse`, `cite.honda.vfr800-2002.jp.general-specs`, `cite.honda.vfr800-2002.jp.dual-cbs`, and `cite.honda.vfr800-2002.jp.headlight`.

## Verified facts added and upgraded

| Entry / branch | Result | Applicability | Evidence |
|---|---|---|---|
| `general.chassis.overall-length` | 2120 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.chassis.overall-width` | 735 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.chassis.overall-height` | 1195 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.chassis.wheelbase` | 1460 mm, pending → verified | MY2002 profile; independently corroborated for JP | 61MCW07 p. 1-4 and Honda Japan, A |
| `general.chassis.seat-height` | 805 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.chassis.ground-clearance` | 125 mm, new | MY2002 profile | 61MCW07 p. 1-4 and Honda Japan, A |
| `general.chassis.rake` | 25°30′, new | MY2002 profile | 61MCW07 p. 1-4 and Honda Japan, A |
| `general.chassis.trail` | 95 mm, new | MY2002 profile | 61MCW07 p. 1-4 and Honda Japan, A |
| `general.suspension.front-travel` | 120 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.suspension.rear-travel` | 120 mm, new | MY2002 profile | 61MCW07 p. 1-4, A |
| `general.fuel-tank.capacity` | placeholder → 22 L verified | MY2002 profile | 61MCW07 p. 1-4 and Honda Japan, A |
| `fuses.pgm-fi` | 20 A pending → verified; location corrected | VFR800/VFR800A MY2002 manual scope | 61MCW07 pp. 1-14 and 2-20, A |
| `brakes.system.linked-cbs` | pending global claim → verified Japan-only claim | `regions=[JP]`; ABS not generalized | Honda Japan chassis section, A |
| `lighting.headlight.jp` | new variant: H4R 45 W ×2 low and H7 55 W ×2 high | `regions=[JP]` | Honda Japan styling section, A |

The PGM-FI fuse correction changes `location` from the main box beneath the right inner panel to the separate fuse case beside the battery/rear fender. Its circuit wording was narrowed from “PGM-FI and engine control” to the exact OEM label “PGM-FI”.

## Brakes

Existing DOT 4 fluid, 3.5 mm front and 5.0 mm rear disc limits, 31 N·m caliper mounts, disc fastener torques and two-year fluid interval remain grade A under their mapped service-manual pages. The manual also confirms linked hydraulic procedures, but the public material inspected did not yield a concise market-by-market CBS designation table.

`brakes.system.linked-cbs` is now explicitly Japan-only. Matrix:

| Market | Model designation | ABS | CBS / Honda term | Decision |
|---|---|---:|---|---|
| Japan | BC-RC46 VFR | not established by cited launch page | Dual CBS | A; production enabled only for JP |
| USA | VFR800 | false | linked-brake hardware/procedures present in manual, exact public marketing name not proven | B; unresolved |
| USA | VFR800A | true | Honda global retrospective says 2002 VFR800 debuted Dual-Combined ABS | B; unresolved for exact USA designation |
| EU/UK/AU/CA | destination/model codes incomplete | unknown/varies | no complete OEM matrix found | D; withheld |

Front/rear pad OEM numbers, pad wear limit, standard disc thickness, master-cylinder production summaries, pad-hanger torque, bleed sequence abstraction and hose replacement interval remain unresolved. The available manual contains detailed procedures, but legible page evidence and schema-fit were insufficient in this wave; distributor fiche numbers were not promoted.

## Final drive / chain

Reconfirmed grade-A production facts: 16/43 teeth, 25–35 mm slack, 51 N·m front sprocket bolt, 64 N·m rear sprocket nuts and 74 N·m bearing-holder pinch bolt. The OEM drive-chain procedure remains the source for slack, wear inspection method and lubrication.

Chain size, OEM link count, numeric wear/replacement limit, original chain assembly number, front sprocket number and supersession relationships remain unresolved. Distributor fiche `41201-MCW-D00` for the 43T rear sprocket is recorded as a grade-C candidate only and was not added.

## Wheels / tyres

Reconfirmed grade-A facts: 120/70 ZR17M/C (58W), 180/55 ZR17M/C (73W), cold pressures 250/290 kPa, front axle 59 N·m, pinch bolts 22 N·m and rear wheel bolts 108 N·m. Honda’s service card gives a single front/rear pressure pair; it does not present separate solo/passenger values, so the profile was not expanded into inferred load branches.

Rim sizes, minimum tread depths, bearing service limits and OEM wheel bearing/seal numbers remain unresolved for production. The distributor fiche candidates (including `91061-ML0-731`, `91061-MT4-003`, `91062-MR7-003`, `91258-ML7-003/004`, `91284-MR7-003`) remain grade C and are report-only.

## Electrical / charging

`fuses.pgm-fi` is closed at grade A. Existing battery 12 V 10 Ah and generator 0.497 kW at 5000 rpm remain grade A. The inspected service-manual OCR showed battery state-of-charge data, but did not preserve the regulated-voltage range, charging test conditions or stator-resistance row reliably enough for production. `electrical.charging.regulated-voltage` therefore remains a placeholder. Regulator/rectifier component tests and charging-fuse labeling also remain unresolved.

## OEM service parts

The existing oil filter `15410-MCJ-505` remains the sole verified OEM part entry. Spark plugs remain verified specifications rather than Honda-numbered parts. Candidate fiche numbers for the air filter, pads, sprockets, chain, drain washer, fork seals, wheel seals/bearings and coolant consumables were not added because no public Honda catalogue rows or explicit OEM supersession chain were obtained. Retailer/distributor reproduction alone was deliberately treated as grade C.

## Headlight destination mapping

Japan is now proven independently and represented by `lighting.headlight.jp`. USA’s 60/55 W branch and the service-manual destination table remain mapped as before. EU/UK/AU remain grouped exactly as before because this wave did not obtain a defensible Honda destination-code expansion. The AU fiche still mixes CM/U applicability and both 55 W H7 and 60/55 W entries; Canada and other destinations are not proven. Consequently the parent `lighting.headlight` remains pending, unknown/unsupported regions remain ambiguous, and the quantity override prevents the Japanese four-bulb arrangement from inheriting the base quantity of two.

## Conflicts and remaining backlog

One corrected conflict was found: the former `fuses.pgm-fi.location` contradicted the service-manual rear-fender illustration. A second representational conflict was prevented: Japan uses two low-beam plus two high-beam bulbs, so it cannot inherit the two-bulb count used by dual-filament branches.

Remaining priorities:

- P0: 0.
- P1: 2 — `lighting.headlight` complete destination mapping; `brakes.system.linked-cbs` non-Japan market/ABS matrix.
- P2: 5 — `electrical.charging.regulated-voltage`, `lighting.position-front`, `lighting.turn-signal-front`, `lighting.turn-signal-rear`, `lighting.license-plate`. Missing non-entry research also includes pads, chain specification/wear, rim/fork data and OEM parts.
- P3: 1 — unused `cite.honda.vfr800-2002.om.identity` metadata citation.

## Validation

Focused tests assert all new dimensions, 22 L fuel capacity, PGM-FI 20 A/source/location, Japan-only CBS applicability, Japan headlight selection/quantity, unknown-context ambiguity and source-registry integrity. Final command totals and checks are recorded in the commit handoff after execution.
