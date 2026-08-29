# Honda VFR800 VTEC 2002 — production Technical Profile verification audit

Audit date: 2026-08-29
Original audit scope: `data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js` and repository-local evidence only. Evidence-closure updates: 2026-08-29; see `vfr800-2002-p0-p1-evidence-research.md`, `vfr800-2002-verification-wave2.md`, and `vfr800-2002-verification-wave3.md`.

## Executive summary

The original 79 entries were completely inspected. Wave 2 brought production to 88 entries. Wave 3 adds eleven directly sourced workshop entries and closes the charging-voltage placeholder, bringing production to 99 entries: 94 verified/source-covered entries, one partially supported regional headlight entry, and four explicit research placeholders. No concrete entry is wholly unsourced, no source ID is broken, and one registered citation remains unused. No conflicting production numeric values remain.

The original P0 defects are closed. `fuses.circuit.standard` remains limited to the directly proven USA MY2002 non-ABS context. Wave 2 closes `fuses.pgm-fi`: the OEM specification table explicitly assigns 20 A and the rear-fender illustration locates its separate case. `brakes.system.linked-cbs` is verified only for Japan and remains a P1 matrix gap outside Japan. Headlight destination completeness also remains P1. Wave 3 closes regulated charging voltage, stator resistance/insulation, chain designation/link count, rim dimensions, pad-wear rules and fork-fluid service data without changing applicability or resolver semantics.

The only application behavior changed alongside this audit is the generic ordering of unique selectable motorcycle years. The sole production model-year list is the garage/add-motorcycle selector. Its shared source emitted an ascending range by construction and had no normalization guard. It now returns unique valid years newest-first, deterministically, and rejects malformed range metadata safely.

## Exact counts

| Measure | Count |
|---|---:|
| Production technical entries | 99 |
| Concrete-value entries | 95 |
| Literal-null entry values | 0 |
| Placeholder/missing-value entries | 4 |
| Applicability-dependent entries | 4 |
| Variant entries | 1 |
| Entries requiring region | 3 |
| Entries requiring ABS | 2 |
| Entries requiring equipment | 0 |
| Fully source-covered entries | 94 |
| Partially sourced/applicability-not-proven entries | 1 |
| Unsourced concrete entries | 0 |
| Broken source references | 0 |
| Historical conflicts found through wave 3 | 2 |
| Honda OEM-number entries | 1 |
| Supplier part-number entries | 2 |
| Torque entries | 14 |
| Maintenance entries | 10 |
| P0 backlog items | 0 |
| P1 backlog items | 2 |
| P2 backlog items | 4 |
| P3 backlog items | 1 |
| Production model-year lists inspected | 1 |
| Incorrectly ordered model-year lists found | 1 |
| Production files affected by year-order fix | 1 |

Counting rules: a concrete entry has a usable asserted value or resolved variant; the four remaining strings saying “wymaga potwierdzenia” are missing research, not concrete facts. `lighting.headlight` counts as concrete and variant-based because its three branches contain sourced values, while its base text is deliberately non-assertive. “Fully source-covered” assesses mapped evidence, not merely source-ID presence or the profile's `verified` label. The two wave-2 conflicts are historical findings now corrected/contained: the PGM-FI fuse location and the Japanese four-bulb quantity override; wave 3 found no new conflict and current conflicting production values remain zero.

## Production inventory and source coverage

Source abbreviations: `GS` service-manual general specs; `LS` lubrication specs; `OS` oil service; `CS` cooling specs; `FS` fuel/PGM-FI specs; `SP` spark-plug procedure; `VP` valve procedure; `FT` frame torques; `CH` chassis specs; `BT` brake torques; `BD` brake discs; `ET` engine torques; `EO` electrical output; `LI` lights table; `MS` service-manual schedule; `DC` drive-chain procedure; `BF` brake-fluid procedure; `CL` clutch-system procedure; `SD` Honda Finland service-data card; `MC` Honda Finland maintenance card; `OMF` owner-manual fuse excerpt; `WStd` standard wiring bulletin; `WABS` ABS wiring bulletin.

Classification abbreviations: `VSC` VERIFIED-SOURCE-COVERED; `SP` SOURCE-PARTIAL; `SM` SOURCE-MISSING; `ANP` APPLICABILITY-NOT-PROVEN; `NBD` NULL-BY-DESIGN; `NHR` NEEDS-HUMAN-REVIEW. There are no SOURCE-REGISTRY-BROKEN entries.

Every row below records ID, category/type, complete production value shape (including units), applicability/conditions, source mapping and audit classification. Profile-wide applicability for every row is catalog key `honda.vfr800.rc46.vtec.gen1`, model year 2002.

| Entry ID | Category / type | Value / unit | Entry applicability or condition | Sources | Class |
|---|---|---|---|---|---|
| `general.engine.displacement` | general / specification | quantity 782 cm³; V4 90° DOHC VTEC | — | GS | VSC |
| `general.engine.bore` | general / specification | quantity 72 mm | — | GS | VSC |
| `general.engine.stroke` | general / specification | quantity 48 mm | — | GS | VSC |
| `general.engine.compression-ratio` | general / specification | ratio 11.6:1 | — | GS | VSC |
| `general.transmission.gearbox` | general / specification | text: constant mesh, 6-speed | — | GS | VSC |
| `general.chassis.overall-length` through `general.suspension.rear-travel` | general / specification | nine MY2002 dimensions/geometry/travel facts; see wave-2 report | profile-wide | GS and JP publication where mapped | VSC |
| `general.chassis.wheelbase` | general / specification | quantity 1460 mm | — | GS, JP | VSC |
| `general.fuel-tank.capacity` | general / specification | quantity 22 L | — | GS, JP | VSC |
| `lubrication.engine-oil.specification` | lubrication / fluid | API SF/SG+, JASO MA, four-stroke, no molybdenum; Honda GN4/HP4 equivalent | — | LS | VSC |
| `lubrication.engine-oil.viscosity` | lubrication / fluid | SAE 10W-40 | — | LS | VSC |
| `lubrication.engine-oil.capacity-drain` | lubrication / fluid | quantity 2.9 L | serviceState=after-draining | LS | VSC |
| `lubrication.engine-oil.capacity-with-filter` | lubrication / fluid | quantity 3.1 L | serviceState=after-draining-and-filter-change | LS, SD | VSC |
| `lubrication.engine-oil.capacity-overhaul` | lubrication / fluid | quantity 3.8 L | serviceState=after-disassembly | LS | VSC |
| `consumables.oil-filter.oem` | consumables / consumable-part | Honda `15410-MCJ-505` | MY2002; ABS/market unrestricted by profile | SD | VSC |
| `cooling.coolant.specification` | cooling / fluid | ethylene-glycol corrosion-inhibited coolant, 50% distilled-water mix | — | CS | VSC |
| `cooling.coolant.capacity-engine-radiator` | cooling / fluid | quantity 2.92 L | — | CS | VSC |
| `cooling.coolant.capacity-reserve` | cooling / fluid | quantity 0.9 L | — | CS | VSC |
| `cooling.thermostat.opening-temperature` | cooling / specification | range 80–84 °C | — | CS | VSC |
| `cooling.thermostat.fully-open-temperature` | cooling / specification | quantity 95 °C | — | CS | VSC |
| `cooling.radiator-cap.relief-pressure` | cooling / specification | range 108–137 kPa | — | CS | VSC |
| `ignition.spark-plug.standard` | ignition / spark-plug | NGK IMR9B-9H / DENSO VNH27Z, iridium | — | SP, SD | VSC |
| `ignition.spark-plug.cold-climate` | ignition / spark-plug | NGK IMR8B-9H / DENSO VNH24Z | ambient below 5 °C | SD | VSC |
| `ignition.spark-plug.gap` | ignition / adjustment | range 0.8–0.9 mm; replace at 1.0 mm gauge, do not adjust iridium plug | — | SD, SP | VSC |
| `torque.engine.spark-plug` | torques / torque | quantity 12 N·m | — | SP | VSC |
| `valves.clearance.intake-standard` | valves / adjustment | 0.20 ±0.03 mm | cold below 35 °C; standard valve | SD, VP | VSC |
| `valves.clearance.exhaust-standard` | valves / adjustment | 0.35 ±0.03 mm | cold below 35 °C; standard valve | SD, VP | VSC |
| `valves.clearance.intake-vtec` | valves / adjustment | 0.20 ±0.08 mm | cold below 35 °C; VTEC valve | SD, VP | VSC |
| `valves.clearance.exhaust-vtec` | valves / adjustment | 0.35 ±0.08 mm | cold below 35 °C; VTEC valve | SD, VP | VSC |
| `wheels.tire.front.size` | wheels / specification | 120/70 ZR17M/C (58W) | front | CH | VSC |
| `wheels.tire.rear.size` | wheels / specification | 180/55 ZR17M/C (73W) | rear | CH | VSC |
| `wheels.tire.front.pressure-cold` | wheels / specification | quantity 250 kPa | cold tire | SD | VSC |
| `wheels.tire.rear.pressure-cold` | wheels / specification | quantity 290 kPa | cold tire | SD | VSC |
| `torque.chassis.front-axle-bolt` | torques / torque | quantity 59 N·m | front wheel | FT | VSC |
| `torque.chassis.front-axle-pinch` | torques / torque | quantity 22 N·m | right fork lower | FT | VSC |
| `torque.chassis.rear-wheel-bolts` | torques / torque | quantity 108 N·m; four bolts | rear wheel | FT | VSC |
| `final-drive.ratio` | final-drive / specification | ratio 43:16 | — | GS | VSC |
| `final-drive.sprocket.front-teeth` | final-drive / specification | quantity 16 tooth | — | GS | VSC |
| `final-drive.sprocket.rear-teeth` | final-drive / specification | quantity 43 tooth | — | GS | VSC |
| `final-drive.chain.slack` | final-drive / adjustment | range 25–35 mm | center stand; neutral | DC | VSC |
| `torque.final-drive.sprocket-front` | torques / torque | quantity 51 N·m | countershaft | ET | VSC |
| `torque.final-drive.sprocket-rear-nuts` | torques / torque | quantity 64 N·m; six nuts | driven flange | FT | VSC |
| `torque.final-drive.bearing-holder-pinch` | torques / torque | quantity 74 N·m | chain-adjuster eccentric | FT | VSC |
| `brakes.fluid.specification` | brakes / fluid | DOT 4 | — | BF | VSC |
| `brakes.disc.front.service-limit` | brakes / specification | minimum 3.5 mm | minimum-thickness measurement | BD | VSC |
| `brakes.disc.rear.service-limit` | brakes / specification | minimum 5 mm | minimum-thickness measurement | BD | VSC |
| `brakes.system.linked-cbs` | brakes / specification | Honda Dual CBS statement | `regions=[JP]` | JP launch publication | VSC for JP; non-JP matrix open |
| `torque.brakes.front-caliper` | torques / torque | quantity 31 N·m | front caliper bracket | BT | VSC |
| `torque.brakes.rear-caliper` | torques / torque | quantity 31 N·m | rear caliper mounting | BT | VSC |
| `torque.brakes.front-disc-bolts` | torques / torque | quantity 20 N·m | front discs | FT | VSC |
| `torque.brakes.rear-disc-nuts` | torques / torque | quantity 34 N·m | rear disc | FT | VSC |
| `electrical.battery.specification` | electrical / consumable-part | 12 V, 10 Ah | — | EO, WStd | VSC |
| `electrical.generator.output` | electrical / specification | quantity 0.497 kW | engine speed 5000 rpm | EO | VSC |
| `electrical.charging.regulated-voltage` | electrical / diagnostic-measurement | research placeholder | battery terminals, engine running | none | NBD |
| `fuses.main-a` | fuses / fuse | quantity 30 A | — | WStd | VSC |
| `fuses.main-b` | fuses / fuse | quantity 30 A | — | WStd | VSC |
| `fuses.pgm-fi` | fuses / fuse | quantity 20 A | separate case beside battery/rear fender | PGM-FI fuse citation | VSC |
| `fuses.circuit.standard` | fuses / fuse | multi 10 A / 20 A; positions A–F mapped to clock, signals/brake lamps/horn, starter/bank-angle sensor, fan, meter/position/tail/illumination and headlight | `regions=[USA]`, `abs=false` | OMF, WStd | VSC |
| `fuses.circuit.abs` | fuses / fuse | multi 10 A / 20 A / 30 A | `abs=true` | OMF, WABS | VSC |
| `lighting.headlight` | lighting / light-source | variants: EU/UK/AU 12 V 55 W; USA 12 V 60/55 W; JP H4R 45 W ×2 low + H7 55 W ×2 high | region; unknown is ambiguous | LI / JP publication per variant | source-covered branches; destination completeness partial |
| `lighting.brake-tail` | lighting / light-source | 12 V 21/5 W; power multi 21 W / 5 W | stop/tail | LI | VSC |
| `lighting.position-front` | lighting / light-source | research placeholder | destination-dependent application noted | none | NBD |
| `lighting.turn-signal-front` | lighting / light-source | research placeholder | market not represented | none | NBD |
| `lighting.turn-signal-rear` | lighting / light-source | research placeholder | market not represented | none | NBD |
| `lighting.license-plate` | lighting / light-source | research placeholder | market not represented | none | NBD |
| `adjustments.throttle.free-play` | adjustments / adjustment | range 2–6 mm | — | FS | VSC |
| `adjustments.idle-speed` | adjustments / adjustment | 1200 ±100 rpm | normal operating temperature | FS, SD | VSC |
| `adjustments.clutch.system` | adjustments / adjustment | hydraulically actuated clutch; no system adjustment; inspect fluid level/leakage | — | CL | VSC |
| `torque.engine.oil-drain-bolt` | torques / torque | quantity 30 N·m | oil pan | OS | VSC |
| `torque.engine.oil-filter` | torques / torque | quantity 26 N·m | oil filter | OS | VSC |
| `torque.engine.cylinder-head-cover` | torques / torque | quantity 10 N·m | front/rear covers | ET | VSC |
| `maintenance.engine-oil.replace` | maintenance / task | replace | 12000 km / 12 months; whichever first | MC | VSC |
| `maintenance.oil-filter.replace` | maintenance / task | replace with OEM schedule | 12000 km / 12 months; whichever first | MC | VSC |
| `maintenance.spark-plugs.inspect-replace` | maintenance / task | inspect / replace | inspect 24000 km; replace 48000 km | MC | VSC |
| `maintenance.valve-clearance.inspect` | maintenance / task | inspect and adjust if needed | 24000 km; cold below 35 °C | MC, VP | VSC |
| `maintenance.drive-chain.inspect-lubricate` | maintenance / task | inspect and lubricate | 1000 km; more often wet/dry | MS, MC | VSC |
| `maintenance.coolant.replace` | maintenance / task | replace | 24 months | MC | VSC |
| `maintenance.brake-fluid.replace` | maintenance / task | replace | 24 months | MS | VSC |
| `maintenance.air-cleaner.replace` | maintenance / task | replace; more often in dust | 18000 km | MC | VSC |
| `maintenance.brake-system.inspect` | maintenance / task | inspect hoses, leaks, operation, pad wear | 6000 km / 6 months; whichever first | MS | VSC |
| `maintenance.tires.inspect` | maintenance / task | inspect condition, wear, pressure | before riding and periodic maintenance; no numeric interval | MS | VSC |

## Source coverage and registry audit

- All 94 verified entries and every headlight variant citation resolve to one of 32 registered citations; all citations resolve to one of 6 documents. Broken references: zero.
- The OEM service manual, OEM service-data card and relevant OEM procedures are appropriate primary evidence for the 94 fully covered entries. The US owner guide, wiring bulletin and Japan publication have narrower regional scope represented explicitly.
- `fuses.pgm-fi` is VERIFIED-SOURCE-COVERED: the service-manual specification table assigns 20 A to PGM-FI and p. 2-20 identifies the separate case location.
- `fuses.circuit.standard` is VERIFIED-SOURCE-COVERED for USA: inspected `WStd` p. 12 explicitly labels the 2002–2003 VFR800 standard type and maps positions A–F to their 10/20 A circuits. It does not prove other markets, so the production entry was narrowed rather than generalized.
- `lighting.headlight` has no base citation by design, but all three mutually exclusive regional variants are individually sourced. Regions outside EU/UK/AU/USA/JP resolve the deliberately non-specific base text, so destination completeness remains partial.
- No concrete statement is wholly unsourced after wave 2. `general.chassis.wheelbase` is directly covered by MY2002 service-manual evidence; `brakes.system.linked-cbs` is cited and restricted to Japan.
- Unused citation: `cite.honda.vfr800-2002.om.identity`. The parts-catalogue document is also unused by a citation/value in revision 1; its registry note says no public catalogue content was used.
- Production runtime imports only the production document registry. No `research/` module is imported by the profile, loader, resolver or search path.

## Applicability and ABS tri-state audit

The profile discriminator is the exact catalog key plus year 2002. Entry-level applicability uses explicit `abs` booleans for the two circuit-fuse entries and `regions=[JP]` for CBS. The headlight uses `variants[].when.regions`. No production VFR entry uses equipment. Ordinary `conditions` such as service state, temperature or measurement state are descriptive technical conditions and are not applicability resolver dimensions.

| Entry | Decision | Unknown context | False / non-ABS | True / ABS | Branch audit |
|---|---|---|---|---|---|
| `fuses.circuit.standard` | `applicability.regions=[USA]`, `applicability.abs=false` | ambiguous-context when USA ABS is unknown; value withheld | resolves only for USA | not-applicable | no overlap; reachable; USA applicability directly supported; other regions excluded |
| `fuses.circuit.abs` | `applicability.abs=true` | ambiguous-context; value withheld | not-applicable | resolves | no overlap; reachable; ABS bulletin supports context |
| `brakes.system.linked-cbs` | `applicability.regions=[JP]` | ambiguous-context; value withheld | n/a | n/a | resolves only for JP; no ABS inference |
| `lighting.headlight` | variant `when.regions` | ambiguous-context; regional wattages withheld | n/a | n/a | EU/UK/AU, USA and JP sets do not overlap; all reachable; unsupported region falls back to non-specific base |

Resolver normalization uses `typeof abs === "boolean" ? abs : null`; therefore `false` is preserved and never treated as missing. Mechanical resolver/search/UI tests confirm: `abs=null` withholds both ABS-specific fuse values as ambiguous; `false` resolves only standard and excludes ABS; `true` resolves only ABS and excludes standard. Unknown region likewise prevents either headlight wattage from entering resolved UI/search output. No inapplicable value leak, overlapping branch, unreachable branch or equal-specificity conflict was found.

The original correctness/evidence defect is closed without resolver changes: USA `abs=false` resolves, USA `abs=null` is ambiguous, USA `abs=true` is not applicable, and non-USA contexts do not resolve the USA legend.

## Null, missing and completeness audit

There are no literal `null` entry values and no absent `value` property. Four entries intentionally carry explicit research placeholders and remain pending: front position lamp, front indicator, rear indicator and licence-plate lamp. These lack reliable complete market mapping; none means “not applicable.” Fuel capacity is closed at 22 L and regulated charging voltage is closed by direct MY2002 OEM evidence.

Three optional-schema situations are not missing technical facts: alternate units are absent from all torque values because the schema does not require them; maintenance time and distance counterparts are absent where the cited schedule records only one axis; applicability/equipment fields are absent where the fact is unconditional.

The profile is incomplete for broader workshop coverage. Remaining missing categories include air filter/OEM brake pads, numeric pad/chain limits beyond Honda's wear-groove rule, suspension setup and torques, steering service data, mass/load variants, regulator pin/diode values, bearings/seals and numerous OEM parts. Those are absent facts, not production entries, and were not guessed or included in the 99-entry count.

Grouped research backlog: safety/service limits (numeric pad and chain wear limits, tire limits, suspension/engine limits); chassis/torques (rear axle representation where applicable, suspension and steering fasteners); consumables/OEM fitment (air filter, pads, chain/sprockets, washer, seals/bearings); electrical/lighting (regulator pin/diode values and market-specific bulbs); completeness (remaining dimensions/mass and suspension setup).

## Conflict and duplication audit

No conflicting production values were found. Same-value pairs are distinct components, not duplicates: front/rear calipers are each 31 N·m; main fuse A/B are each 30 A; intake clearances share 0.20 mm nominal but have different tolerances/valve types; exhaust clearances share 0.35 mm nominal with the same distinction. Final ratio 43:16 intentionally repeats the separately listed sprocket tooth counts. Oil/filter maintenance entries intentionally share a 12000 km/12 month cadence.

No unit inconsistency, precision conflict, obsolete replacement beside a current value, conflicting OEM number, torque conflict, maintenance conflict, tire-pressure conflict or brake-specification conflict was found in production. Repository research-only data was not treated as production evidence.

## High-risk technical findings

- Engine/lubrication: oil specification, viscosity, three capacity states, oil-filter number and drain/filter torques have appropriate mapped OEM evidence. No drain washer/part evidence is present.
- Cooling: specification, two capacity components, thermostat and cap pressure are covered; replacement is time-only at 24 months. No broader cooling service/consumable data exists.
- Brakes: DOT 4, disc service limits and four brake torques are covered. CBS description is unsourced; pad limits, pad OEM numbers and master-cylinder data are absent. The profile does not claim ABS-specific mechanical brake data.
- Tires/wheels: both sizes, cold pressures and the stored wheel torques are covered. No passenger/load branches are recorded, so the repository does not prove whether pressures are load-invariant. Rim sizes and broader wheel service limits are absent.
- Drive: ratio, sprocket counts, slack and three related torques are covered. Chain specification, wear/replacement limit and OEM chain/sprocket fitment are absent.
- Engine service: four valve-clearance branches, plugs/gap/torque and selected intervals are covered. No general engine service limits are present.
- Electrical: battery/generator output are covered. Charging voltage is a placeholder. The USA standard-fuse legend is now directly covered; PGM-FI assignment remains partial. Unknown ABS/region behavior is safe.

## OEM parts audit

| Entry | Part | Number | Source | MY / ABS / market finding |
|---|---|---|---|---|
| `consumables.oil-filter.oem` | Honda oil filter | `15410-MCJ-505` | SD | Card covers RC46 2002–2005; profile narrows to 2002. No ABS/market split recorded. No supersession evidence exists in repository; do not infer current supersession. |

Supplier specification entries, not Honda OEM-number entries: `ignition.spark-plug.standard` (NGK IMR9B-9H / DENSO VNH27Z, SP+SD) and `ignition.spark-plug.cold-climate` (NGK IMR8B-9H / DENSO VNH24Z, SD, below 5 °C). No missing source, conflicting number or branch overlap was found for these. The registered parts catalogue is not used as evidence, so supersession, broader market fitment, and ABS fitment cannot be claimed.

## Torque audit

All 14 production torques are source-covered; none is partial, unsourced or conflicting. No alternate unit is stored.

| Entry / component | N·m | Source | Applicability / duplicate check |
|---|---:|---|---|
| `torque.engine.spark-plug` / spark plug | 12 | SP | MY2002; unique component |
| `torque.chassis.front-axle-bolt` / front axle bolt | 59 | FT | MY2002; unique |
| `torque.chassis.front-axle-pinch` / axle pinch bolts | 22 | FT | MY2002; unique |
| `torque.chassis.rear-wheel-bolts` / four rear-wheel bolts | 108 | FT | MY2002; unique |
| `torque.final-drive.sprocket-front` / front sprocket bolt | 51 | ET | MY2002; unique |
| `torque.final-drive.sprocket-rear-nuts` / six rear sprocket nuts | 64 | FT | MY2002; unique |
| `torque.final-drive.bearing-holder-pinch` / bearing-holder pinch bolt | 74 | FT | MY2002; unique |
| `torque.brakes.front-caliper` / front caliper bracket | 31 | BT | MY2002; same number as rear, different component |
| `torque.brakes.rear-caliper` / rear caliper mounting | 31 | BT | MY2002; same number as front, different component |
| `torque.brakes.front-disc-bolts` / front disc bolts | 20 | FT | MY2002; unique |
| `torque.brakes.rear-disc-nuts` / rear disc nuts | 34 | FT | MY2002; unique |
| `torque.engine.oil-drain-bolt` / oil drain bolt | 30 | OS | MY2002; 30 A fuse values are different units/facts |
| `torque.engine.oil-filter` / oil filter | 26 | OS | MY2002; unique |
| `torque.engine.cylinder-head-cover` / head cover bolts | 10 | ET | MY2002; 10 A fuse values are different units/facts |

Groups: source-covered 14; partially supported 0; unsourced 0; conflicting 0.

## Maintenance schedule audit

All ten tasks have an OEM schedule/procedure citation. No conflicting interval was found. Missing time or distance equivalents below are reported as absent, not inferred.

| Entry | Action | Mileage | Time | Applicability / source finding |
|---|---|---:|---:|---|
| `maintenance.engine-oil.replace` | replace | 12000 km | 12 mo | whichever first; MC |
| `maintenance.oil-filter.replace` | replace | 12000 km | 12 mo | whichever first; wording “with OEM schedule”; MC |
| `maintenance.spark-plugs.inspect-replace` | inspect / replace | 24000 / 48000 km | absent | actions remain distinct; MC |
| `maintenance.valve-clearance.inspect` | inspect, adjust if needed | 24000 km | absent | cold below 35 °C; MC+VP |
| `maintenance.drive-chain.inspect-lubricate` | inspect / lubricate | 1000 km | absent | more often after rain/when dry; MS+MC |
| `maintenance.coolant.replace` | replace | absent | 24 mo | MC |
| `maintenance.brake-fluid.replace` | replace | absent | 24 mo | MS |
| `maintenance.air-cleaner.replace` | replace | 18000 km | absent | more often in dust; MC |
| `maintenance.brake-system.inspect` | inspect | 6000 km | 6 mo | whichever first; MS |
| `maintenance.tires.inspect` | inspect | no numeric interval | no numeric interval | before riding and periodic service; MS |

The schedule is profile-wide MY2002. No explicit regional branches are stored even where MC is an EU/Finland document and MS covers VFR800/VFR800A; market equivalence beyond mapped scope requires human review before broader claims. Severe-use wording exists only for chain wet/dry use and dusty air-filter service. No general severe-use schedule is present.

## Prioritized verification backlog

| Priority | Entry ID | Category | Problem / missing evidence | Source needed | Until verified |
|---|---|---|---|---|---|
| P1 | `brakes.system.linked-cbs` (non-JP) | brakes | Japan is proven; other market/ABS designations are not a complete matrix | MY2002 OEM market brochures or model-code brake overview | withheld outside JP |
| P1 | `lighting.headlight` | lighting | mapped branches covered, but destination-to-region completeness needs confirmation | complete MY2002 OEM destination-code table | ambiguous when region unknown/unsupported |
| P2 | `lighting.position-front` | lighting | market-dependent placeholder | complete OEM light table by destination | null-equivalent placeholder |
| P2 | `lighting.turn-signal-front` | lighting | market-dependent placeholder | complete OEM light table by destination | null-equivalent placeholder |
| P2 | `lighting.turn-signal-rear` | lighting | market-dependent placeholder | complete OEM light table by destination | null-equivalent placeholder |
| P2 | `lighting.license-plate` | lighting | market-dependent placeholder | complete OEM light table by destination | null-equivalent placeholder |
| P3 | `cite.honda.vfr800-2002.om.identity` | source metadata | registered citation is unused | either attach only to an appropriate identity assertion or document intentional registry-only status | no technical value change |

### P0/P1 closure history

| Closed priority | Entry | Closure evidence | Result |
|---|---|---|---|
| P0 | `fuses.circuit.standard` | American Honda bulletin `VFR800/A #4`, p. 12, standard-type A–F fuse legend | Closed for USA MY2002 non-ABS; production applicability narrowed to the proven market |
| P1 | `adjustments.clutch.system` | Honda MY2002 Service Manual pp. 1-5 and 3-29–3-30 | Closed; wording narrowed to hydraulic actuation, no required adjustment, and fluid/leak inspection |
| P0 | `fuses.pgm-fi` | Honda MY2002 Service Manual pp. 1-14 and 2-20 | Closed at 20 A; circuit wording narrowed and separate fuse-case location corrected |
| P2 | `general.chassis.wheelbase` / `general.fuel-tank.capacity` | Honda MY2002 Service Manual p. 1-4 plus Honda Japan MY2002 technical publication | Closed at 1460 mm and 22 L |
| P1 (partial) | `brakes.system.linked-cbs` | Honda Japan MY2002 chassis publication | Closed for `regions=[JP]`; non-JP market/ABS matrix remains P1 |
| P2 | `electrical.charging.regulated-voltage` | Honda MY2002 Service Manual pp. 17-6–17-7 | Closed with the exact battery-voltage inequality, 15.5 V ceiling and 5,000 rpm/high-beam conditions; stator diagnostics added alongside it |

The remaining P1 CBS item now has direct Honda evidence for the 2002 Japanese Dual CBS name and an OEM account of the 2002 Dual-Combined ABS, but stays open until the global market/ABS matrix is proven. Headlight remains open because the inspected fiches do not provide a complete destination/serial mapping; see the evidence-research report for the documented AU mapping concern.

## Validation results

Wave-3 targeted validation covers source registry, validator, resolver, VFR integration, search, applicability, browser loading/runtime, clarification/context bridge and profile quality. It also verifies the charging conditions, stator tests, chain/link count, rims, brake-pad wear rule, fork data, profile non-mutation and absence of unresolved values from search. Result: 174/174 passed.

Full `node --test tests/*.test.js`: 265/265 passed. `node --check` accepted the two modified production JavaScript files. `git diff --check` passed. Manual diff inspection confirmed that wave-3 production changes are limited to profile data and Honda citation mapping; resolver, clarification, search, catalogue, UI, Supabase and cloud code have no diff.

Mechanical invariants established before final validation:

- validator accepts the production profile;
- all category, related-entry, citation and document references resolve;
- registry/loader selects `honda.vfr800.rc46-vtec-gen1.2002` only for the matching key and MY2002;
- resolver and search load the profile without mutation;
- research-only data is isolated from production runtime;
- unresolved region/ABS entries expose metadata needed for clarification but no resolved technical value;
- the year-order regression serializes all 79 VFR entries before/after catalog sorting and proves no Technical Profile fact changes.
