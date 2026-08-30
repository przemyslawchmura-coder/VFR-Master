# BMW Motorrad Family Structure Audit

## Compatibility rule

Stable variant identity outranks structural tidiness. All ten existing BMW families and all 50 variants retain their exact family assignment, local ID, key, name, storedModel, and year range. Wave 2 adds natural lineages without requiring persisted-record migration.

## Existing families reviewed

| Family | Decision |
| --- | --- |
| `gs-boxer` | Preserve standard boxer GS generations; add Adventure configurations separately. |
| `f-gs` | Preserve badge/platform transitions and add missing twins and Adventure identities. |
| `s1000rr` / `s1000r-xr` | Preserve generation splits; M and road-production HP models remain separate performance families. |
| `r-ninet` | Preserve base generations and add materially distinct factory body/configuration variants. |
| `rt-boxer` | Preserve the continuous RT touring lineage and existing chassis-aware records. |
| `g310` | Preserve R and GS configurations together on their shared small platform. |
| `f-roadster-xr` | Preserve established parallel roadster/XR structure. |
| `k1600` | Preserve GT generations; add GTL, B, and Grand America configurations. |
| `r18` | Preserve base R 18 and add materially different Classic, B, and Transcontinental configurations. |

## New family architecture

- Boxer roadsters, sport/RS models, RT, standard GS, GS Adventure, smaller R 850 derivatives, and the R 1200 C cruiser are separated by durable use/platform lineages rather than one giant `r` family.
- K families express architecture: early longitudinal K, K 1100, longitudinal K 1200, transverse K 1200, K 1300, and six-cylinder K 1600.
- F/G families distinguish Rotax-era F 650, single-cylinder GS/Dakar/CS, G 650, parallel-twin GS, sport touring, and roadster/XR identities. Reused displacement badges never merge motorcycles.
- HP road-production machines, M 1000 models, combustion scooters, C 400 scooters, and electric urban vehicles form distinct technical families.

## Normalization and result

No pre-existing family is renamed, merged, split, or reassigned. Nineteen families and 85 variants are added, taking BMW from 10/50/217 to 29/135/653. GS and GS Adventure, same-name K 1200 architectures, and old/new F 800 GS records use distinct stored identities, so there are no storedModel/year collisions. Cosmetic and market aliases do not create families.
