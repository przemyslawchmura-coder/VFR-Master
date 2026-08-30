# Bounded high-value source-acquisition pilot

This is a design contract, not an executed research pass. It exists because Honda Batch Wave 2 produced `+6/528` verified slots, all generic engine specifications, and zero practical-service fields.

## Selected targets

The five targets are existing catalogue/research identities with stable applicability and meaningful practical gaps: CBR500R PC70, VFR800 RC46 VTEC, NC750X RH09-1, CRF1100L Africa Twin, and CBR600RR RH10. Their exact scopes, current verified counts, gaps and risks are in `research/data/high-value-source-acquisition-pilot.js`.

## Practical-value classification

The pilot treats oil, coolant, filters, plugs, valve data, chain, brakes, tire pressures, battery/fuses, maintenance intervals and major torques as `PRACTICAL-SERVICE-HIGH`. Related service fields are medium priority. Engine configuration/displacement and similar descriptive specifications are `GENERIC-SPECIFICATION`; they remain valid evidence but cannot satisfy the practical-success threshold by themselves.

## Source tiers and order

Tier A: factory workshop/service manuals, official service-data publications, and official owner manuals with service chapters. Tier B: official schedules, OEM parts catalogues, bulletins and model handbooks. Tier C: official brochures/spec pages. Tier D: third-party mirrors and discovery pages. Search A → B → C → D, authenticate identity and inspect content before extraction. Tier C/D-only results cannot constitute pilot success.

## Execution contract

Run one bounded session over these five targets, grouping by source/document rather than bike. Maximum three primary documents per target and no repeated search for already verified fields. For each source record identity, access, authority, applicability and inspected sections; extract candidates first, then validate proof, units and model/year/market/ABS/transmission applicability. Keep production and research isolated.

## Success and stop rules

Success requires at least 15 new verified target slots, at least 10 of them practical-service fields, zero unresolved safety-critical conflicts, and the complete productivity metric set in the machine-readable definition. Stop a target when identity or applicability remains unresolved, only Tier C material is available, the bounded source budget yields zero practical gain, or a duplicate source adds no evidence. A generic-specification-only result is a failed pilot outcome even if evidence-row verification is 100%.

## Independent audit gate

Before acceptance, independently recompute target selection, source/document counts, proof statuses, applicability, conflicts and before/after slots from source records. Challenge whether each practical field is genuinely workshop-useful and whether any value was inherited across ABS, DCT/manual, market or year boundaries. Apply `docs/project/AUDIT_STANDARD.md`; passing the pilot’s own tests is not independent proof.
