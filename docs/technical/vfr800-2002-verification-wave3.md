# Honda VFR800 VTEC 2002 — verification wave 3

Access date for web material: 2026-08-29. Evidence grades: A direct OEM proof, B strong OEM indirect proof, C authoritative corroboration, D insufficient. Seller listings and community values were not used as production evidence.

## Executive summary

Wave 3 evaluated 86 distinct candidate facts across OEM parts (19), charging (10), brakes (12), final drive (11), wheels/bearings (10), fork/suspension (11), CBS/headlight (8), and the remaining lighting placeholders (5). Twelve production closures were justified by the Honda MY2002 service manual: eleven new entries and the upgrade of `electrical.charging.regulated-voltage`. Production moves from 88/82/6 total/verified/pending entries to 99/94/5. Four new citations were added; no document, resolver, clarification, search, catalogue, UI, or cloud behavior changed.

No Honda catalogue fiche row suitable for grade-A production proof was obtained. Consequently no new OEM part number or supersession was promoted.

## OEM service parts

The original Honda oil-filter number `15410-MCJ-505` remains the only verified OEM-number entry (`consumables.oil-filter.oem`). NGK/DENSO plug designations remain supplier specifications, not Honda part numbers.

The following remain grade D for production because the accessible Honda catalogue metadata identifies publication `14MCW2E1` without exposing its fiche rows: air filter, front/rear pads, front/rear sprockets, chain assembly, drain washer, fork oil/dust seals, front/rear wheel bearings, wheel seals, and coolant-related service parts. Distributor fiche candidates remain grade C research leads only. No original-to-current supersession chain was documented by Honda, so none was added.

## Charging system

| Entry | Result | Conditions | Grade/source |
|---|---|---|---|
| `electrical.charging.regulated-voltage` | above measured battery voltage and below 15.5 V | warmed engine, high beam, 5,000 rpm, battery terminals | A, 61MCW07 p. 17-6 |
| `electrical.charging.stator-resistance` | 0.1–1.0 Ω | each pair of three yellow alternator terminals, 20 °C | A, 61MCW07 p. 17-7 |
| `electrical.charging.stator-insulation` | no continuity | each yellow alternator terminal to ground | A, 61MCW07 p. 17-7 |

Existing generator output remains 0.497 kW at 5,000 rpm and the battery remains 12 V, 10 Ah. The charging result is an acceptance inequality, not an invented normal range. Regulator/rectifier diode values, connector-pin readings, exact battery model, and further loaded-battery thresholds remain unresolved.

## Brakes and wear

New grade-A entries `brakes.pad.front.wear-limit` and `brakes.pad.rear.wear-limit` preserve Honda's concise rule: replace the pair when either pad reaches its wear-limit groove. Honda does not provide a numeric pad-thickness limit on the cited maintenance page, so no millimetre value was invented.

Existing 3.5 mm front and 5.0 mm rear disc service limits and existing caliper/disc torques remain unchanged. New-pad thickness, standard disc thickness, pad pin torque, master-cylinder bores, hose replacement interval, concise bleed order, and grade-A Honda pad numbers remain unresolved.

## Drive chain and sprockets

New `final-drive.chain.specification` records DID `DID50VA8`, and `final-drive.chain.link-count` records 110 links, both grade A. Existing 16T/43T, 25–35 mm slack, and 51/64/74 N·m final-drive torques remain grade A.

The detailed inspection/replacement method was researched, but no additional numeric wear entry was added where the accessible rendering was not sufficiently unambiguous. Honda chain/sprocket part numbers, documented supersessions, and any ABS-specific final-drive difference remain unresolved; no ABS difference was inferred.

## Wheels, rims, and bearings

New grade-A entries are `wheels.rim.front.size` = `17M/C × MT3.50` and `wheels.rim.rear.size` = `17M/C × MT5.50`. Existing front axle 59 N·m, pinch bolts 22 N·m, rear-wheel bolts 108 N·m, tyre sizes, and pressures are unchanged.

No grade-A catalogue rows were obtained for front/rear bearings or seals. Bearing preload and additional service limits remain unresolved; distributor-only numbers were not promoted.

## Fork and suspension

| Entry | Result | Conditions | Grade |
|---|---|---|---|
| `wheels.suspension.fork-oil.specification` | Honda Suspension Fluid SS-8 | each fork | A |
| `wheels.suspension.fork-oil.capacity` | 457 ± 2.5 cm³ per leg | after disassembly | A |
| `wheels.suspension.fork-oil.level` | 130 mm | from tube top, fork fully compressed, spring removed | A |

Fork spring free length, fork-tube service limit, seal part numbers, and front/rear preload/rebound baselines remain unresolved. Later-model click counts were not imported.

## CBS matrix

No new grade-A market expansion was found. Production remains deliberately narrow:

| Market | ABS | Honda terminology / evidence | Production result |
|---|---:|---|---|
| Japan | not established by cited launch page | Honda explicitly says Dual CBS for BC-RC46 MY2002 | `brakes.system.linked-cbs`, JP only, A |
| USA | false | linked hydraulic hardware present; complete market naming proof absent | B, withheld |
| USA | true | ABS model exists; exact combined-brake market wording not proven | B, withheld |
| Canada / UK / EU / Australia | unknown | no complete OEM mapping | D, withheld |

## Headlight and P2 lighting

Production remains: EU/UK/AU 12 V 55 W under the existing manual destination grouping, USA 12 V 60/55 W, and Japan two 45 W H4R low-beam plus two 55 W H7 high-beam bulbs. Canada and a complete destination-code matrix were not proven, so `lighting.headlight` remains pending and applicability was not broadened.

One of five P2 placeholders closed: `electrical.charging.regulated-voltage`. These remain pending: `lighting.position-front`, `lighting.turn-signal-front`, `lighting.turn-signal-rear`, and `lighting.license-plate`.

## Sources and evidence grades

Production additions use one existing document: Honda Motor Co., Ltd., *Honda VFR800/VFR800A 2002 Service Manual*, publication 61MCW07, all-market manual scope, MY2002. Four non-duplicate citations were added:

- `cite.honda.vfr800-2002.sm.chain-specification` — §1, drive-chain specifications, p. 1-5, A.
- `cite.honda.vfr800-2002.sm.brake-pad-wear` — §3, brake pad wear, p. 3-26, A.
- `cite.honda.vfr800-2002.sm.fork-fluid` — §14, fork fluid filling/level, pp. 14-24–14-25, A.
- `cite.honda.vfr800-2002.sm.charging-diagnostics` — §17, charging voltage/alternator coil, pp. 17-6–17-7, A.

Honda catalogue metadata, Honda Japan press information, the American Honda recall bulletin, and Honda Finland card were rechecked for scope. Distributor fiches were grade C leads; community and seller material was grade D and excluded from production decisions.

## Corrections, applicability, conflicts, and backlog

No existing concrete value was contradicted or corrected. The charging placeholder was replaced by the manual's exact acceptance rule. No applicability changed. No new production conflict was found; historical wave-2 conflicts remain recorded in the audit.

Remaining backlog: P0 0; P1 2 (`brakes.system.linked-cbs` non-Japan matrix and `lighting.headlight` complete mapping); P2 4 (four lighting placeholders); P3 1 (unused owner-manual identity metadata citation). Missing non-entry research includes grade-A OEM parts/supersessions, numeric chain wear limit, bearings/seals, pad thickness, suspension setup/service limits, and regulator pin/diode values.

## Tests

Focused tests cover charging conditions, stator resistance/ground isolation, DID chain/link count, rim dimensions, pad wear-indicator semantics, fork fluid/quantity/level, source integrity, unresolved-value safety, and 99/94/5 quality counts. Final command totals are recorded in the task handoff.
