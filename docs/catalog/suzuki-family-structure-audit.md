# Suzuki Family Structure Audit

## Compatibility rule

The add-motorcycle form presents family names directly to users, while `variant.key` is the durable catalogue/profile identity and `storedModel` is the legacy saved-model identity. The audit therefore prefers recognizable product lineages and forbids key or stored-model changes merely to improve grouping.

All 63 pre-Wave-2 Suzuki variants retain their original family ID, local ID, global key, display name, stored model, and year range. This deliberately avoids turning a structural cleanup into a compatibility migration.

## Existing families reviewed

| Family | Review | Decision |
| --- | --- | --- |
| `sv650` | Contains SV650 generations and SFV650 Gladius. Gladius is a separate marketing identity, but moving the existing stable variant would change the protected semantic baseline. | **KEEP**; add SV650X here as a direct SV650 configuration. |
| `v-strom-1000-1050` | Successive large V-Strom displacement generations share a continuous product lineage. | **KEEP**; add XT/DE configurations without altering base identities. |
| `gsx-8` | GSX-8S and GSX-8R are distinct bodies on one explicitly shared platform. | **KEEP**, consistent with existing architecture. |
| `bandit` | Multiple displacements share durable Bandit/GSF branding. | **KEEP**; variants expose displacement and generation. |
| `gsr` | GSR600 and GSR750 are replacement generations under the same European name. | **KEEP**. |
| `katana` | Historical GSX1100S and modern 1000 models share deliberate Suzuki Katana lineage. | **KEEP**. |
| `gsx-r600`, `gsx-r750`, `gsx-r1000` | Displacement-specific supersport families with generation variants. | **KEEP**; add GSX-R1100 as its own matching family. |
| `v-strom-650`, `v-strom-800` | Displacement/platform-specific V-Strom families with meaningful base/XT/DE/road configurations. | **KEEP**. |

## New-family decisions

| Decision | Reason |
| --- | --- |
| Separate `gsx600f`, `gsx750f`, `gsx650f`, and `gsx1100f` | Avoids a generic GSX-F research bucket and makes displacement/model choice explicit. |
| Shared `rf` and `tl1000` families | RF600/RF900 and TL1000S/R are established named series; variants clearly identify materially distinct motorcycles. |
| Shared `gsx125` family | GSX-S125 and GSX-R125 share Suzuki's documented engine/frame platform; the S/R variants remain explicit. |
| `inazuma` family | European Inazuma naming links the 750/1200 standards and later GW250, while each displacement is an explicit stored identity. |
| Separate `dr125`, `dr350`, `dr650`, `dr-big`, and `dr-z400` | Prevents an arbitrary all-DR bucket from obscuring distinct model lineages and platforms. |
| `intruder-vs`, `intruder-vl`, and `intruder-m` | Groups the established European chassis/name series without duplicating North American Boulevard aliases. |
| `marauder` separate from Intruder | Marauder is a recognizable European product name spanning GZ/VZ models, not merely an Intruder trim. |
| Separate Burgman families by displacement/platform | 125/200 share the compact platform lineage; 250, 400, and 650 have materially different chassis and powertrains. |
| One `address` family | Regional displacement returns are clearly labeled variants under the durable Address name. |

## Result

Suzuki increases from 16 to 54 families solely through 38 new, natural user-facing families. No existing family is renamed, split, merged, or reassigned. All 63 original semantic records remain unchanged; 83 new variants bring the catalogue to 146 Suzuki variants and 881 variant-years.

No family ID, local variant ID, global key, or storedModel/year identity is duplicated. No variant was lost during normalization. Honda, Yamaha, VFR800, Technical Profile behavior, and unrelated production systems remain unchanged.
