# Yamaha Family Structure Audit

## Runtime behavior

The add-motorcycle form exposes `family.name` directly as the model selector. After a family is selected, `variant.name` is shown in the variant selector, followed by a newest-to-oldest year selector. Family grouping is therefore user-facing, not an internal research detail. `variant.key` is the stable persisted/profile-facing identifier; `storedModel` becomes the saved motorcycle model text.

This audit changes only family placement and family labels. All 177 Yamaha variant keys, names, stored models, and year ranges remain present. No motorcycle fact or generation boundary changed.

## Required review

| Current family | Contained motorcycles | Natural lineage? | UX impact | Decision / resulting families | Keys | Compatibility |
| --- | --- | --- | --- | --- | --- | --- |
| `unusual-road` — GTS / BT / Niken | GTS1000, BT1100 Bulldog, Niken/GT | No; three unrelated platforms | One arbitrary category appeared as a model | **SPLIT:** `gts1000`, `bt1100-bulldog`, `niken` | Unchanged | Family selection changes only; persisted keys resolve normally |
| `road-two-stroke` — TZR / TDR / DT | TZR125, TDR125/250, DT125R/RE/X | No; sport, crossover, and trail nameplates | Users had to choose an implementation category first | **SPLIT:** `tzr`, `tdr`, `dt125` | Unchanged | Same as above |
| `mt-legacy` — MT Legacy / MT-125 | MT-01, MT-03 660, MT-125 | No; reused MT branding across distinct models | Unnatural mixed-era model choice | **SPLIT:** `mt-01`, `mt-03-660`, `mt-125` | Unchanged | Same as above |
| `yzf-legacy-sport` — YZF Historical Sport | Thunderace, Thundercat, OW02 R7 | No | Recognizable nameplates were hidden under an era bucket | **SPLIT:** `thunderace`, `thundercat`; OW02 moved to existing `yzf-r7` | Unchanged | Same as above |
| `trx-szr` — TRX850 / SZR660 | TRX850, SZR660 | No; unrelated twin and single | Combined model label had no user-facing lineage | **SPLIT:** `trx850`, `szr660` | Unchanged | Same as above |
| `large-cruiser` | Wild Star, Warrior, XV1900 Midnight Star | No; distinct European nameplates | Generic bucket obscured the saved model choice | **SPLIT:** `wild-star`, `warrior`, `midnight-star-1900` | Unchanged | Same as above |
| `sr-srx` — SR / SRX | SR125/400/500, SRX600 | Partly; SRX is a distinct sport-single lineage | SRX was hidden under SR | **SPLIT:** `sr`, `srx` | Unchanged | Same as above |
| `tenere-legacy` — Ténéré / XTZ | XTZ660, XT660Z, XTZ750 Super Ténéré | Partly | Super Ténéré appeared under two family concepts | **SPLIT/NORMALIZE:** `tenere`; XTZ750 moved to existing `super-tenere` | Unchanged | Same as above |
| `commuter` — YBR / YS | YBR125, YS125 | Related market role, but separate nameplates | Category name was visible instead of the model | **SPLIT:** `ybr125`, `ys125` | Unchanged | Same as above |

## Additional suspicious families

| Current family | Review | Decision |
| --- | --- | --- |
| `fz-fazer` | Mixed FZ750, FZS600, FZS1000, and FZ8/Fazer8; no single continuous lineage | **SPLIT** into `fz750`, `fazer-600`, `fazer-1000`, and closely related `fz8-fazer8` |
| `xj-diversion` | Mixed 600 and 900 platforms sharing Diversion branding | **SPLIT** into `xj600-diversion` and `xj900-diversion` |
| `yzf-r3-mt03` | Faired R3 and naked MT-03 are distinct user-facing models | **KEEP for now:** this is a pre-Wave-2 stable family containing six of the protected original identities; changing it would exceed this cleanup's compatibility rule |
| `virago`, `drag-star`, `xt`, `fzr`, `vmax` | Multiple displacements or replacement platforms under durable, recognizable Yamaha lineages | **KEEP:** family labels are natural and variants clearly identify the platform |
| `tracer`, `tracer-7`, `tenere-700`, `super-tenere` | Closely related nameplate generations and explicit technical derivatives | **KEEP:** useful lineage grouping with clear variants |

## Result

Sixteen net family splits increase Yamaha families from 44 to 60 and global families from 185 to 201. Yamaha remains at 177 variants and 905 variant-years; global totals remain 719 variants and 3,238 variant-years. No duplicate family ID, local variant ID, global key, or storedModel/year identity was introduced.

No Honda identity, VFR Technical Profile mapping, runtime catalogue behavior, or production technical module changed.
