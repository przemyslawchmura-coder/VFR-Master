# Kawasaki European Catalogue Completeness — Wave 2

## Scope and method

This is a conservative Europe-oriented reconstruction of Kawasaki production motorcycles for MY1990–2025, not a claim of worldwide completeness. It includes road motorcycles and documented European road-legal dual-sport/supermoto models. Competition-only machines, cosmetic editions, concepts, grey imports, and identities established only for Japan or North America remain outside scope.

The 64 existing Kawasaki variants were first frozen as a sorted semantic baseline. Candidate additions were reviewed by decade and domain. A split requires a distinct chassis/model code, generation, displacement, platform, powertrain, or materially different production configuration. Official Kawasaki history and European range material were preferred; manuals, parts catalogues, homologation data, period brochures, and strong historical references corroborated older boundaries.

## Sources and coverage strategy

Primary sources included Kawasaki Heavy Industries' [motorcycle history](https://global.kawasaki.com/en/leisure/motorcycle/index.html), [Kawasaki Motors chronology](https://global.kawasaki.com/en/corp/profile/division/motorcycle_engine/history.html), European Kawasaki model/range pages, official owner and service manuals, parts catalogues, and EICMA/INTERMOT announcements. Official material confirms the GPz900R as the first Ninja, European Z1000SX naming for Ninja 1000, the W/Z heritage, ZX-14R, Versys 1000, electric Ninja e-1/Z e-1, and current hybrid models.

Older ZX, ZZR, GPZ, ZRX, Zephyr, KLE, KLR, VN/Vulcan, Eliminator, and GTR boundaries were cross-checked with European brochures, homologation/model-code records, application catalogues, and period road tests. Announcement years were not automatically treated as model years.

## Baseline and additions

Before Wave 2 Kawasaki had 17 families, 64 variants, and 244 variant-years. Baseline key hash: `ddf2f0a53f84189853271cd74187851234c50274a224f3b840ad4a4e72e7c2e7`. Baseline semantic hash: `8c28ecce82b1a7dd57823197cf43f18ac8bf7e267b9da827340e5bcb4bc27303`. Every baseline family assignment, ID, key, name, storedModel, and year range remains unchanged.

Wave 2 adds 68 variants in 30 new families:

- Sport: `zxr400`, `zxr750-zx7r`, `ninja-zx-9r`, `ninja-zx-12r`, `zzr600`, `zzr1100`, `zzr1200`, `zzr1400`, `gpz500s`, `gpz900r`, `gpz1100`, and `ninja-1000sx`.
- Lightweight/current: `ninja-z125`, `electric`, and `hybrid`.
- Standards/classics: `er-5`, `zrx`, `zephyr`, `z900rs`, and `w`; Z750S is added to the existing `z750` family.
- Adventure/dual-purpose: `kle500`, `klr650`, `klx-road`, and `versys-x300`.
- Touring/cruiser: `gtr1000`, `vulcan-750-800`, `vulcan-900`, `vulcan-1500-1600`, `vulcan-1700`, and `eliminator`.

## Naming and alias decisions

- European ZZR1400 is canonical; North American Ninja ZX-14/ZX-14R is documented as an alias, not duplicated.
- European 1000GTR/1400GTR is canonical; Concours names do not create variants.
- Z1000SX is retained for European MY2011–2019; Ninja 1000SX is used from the documented European rename.
- ER-6f remains distinct from the later European Ninja 650 identity; existing stable records are untouched.
- VN and Vulcan are combined in stored names rather than duplicated by regional marketing.
- ZXR750 and later Ninja ZX-7R share one continuous supersport lineage with explicit variants.
- Ninja H2, H2 SX, and Z H2 remain in the existing `h2` family as distinct configurations.
- KLX125 and D-Tracker 125 share a road-legal platform family but retain distinct stored identities.

## Excluded or unresolved

- KX, KX-F, competition KLX-R, Ninja H2R, and track-only homologation configurations are excluded from the road-owner catalogue.
- ZX-25R, later ZXR400 production, Estrella, ZRX1200 DAEG, Ninja 400R/ER-4n, and other JDM/Asia-focused identities lack sufficient uniform European range evidence.
- North-America-only Concours, Vulcan Vaquero/Nomad and recent KLR650 continuation are not imported as duplicate European identities.
- ZL1000 and earlier GPX/GPZ ranges ended before MY1990 or lack a defensible MY1990 European overlap.
- Editions defined only by paint, anniversary graphics, luggage, or minor equipment packages are not split.

## Counts and validation

| Scope | Metric | Before | After | Growth |
| --- | --- | ---: | ---: | ---: |
| Kawasaki | Families | 17 | 47 | +30 |
| Kawasaki | Variants | 64 | 132 | +68 |
| Kawasaki | Variant-years | 244 | 647 | +403 |
| Global | Manufacturers | 13 | 13 | 0 |
| Global | Families | 239 | 269 | +30 |
| Global | Variants | 802 | 870 | +68 |
| Global | Variant-years | 3,829 | 4,232 | +403 |

All Kawasaki family IDs, local variant IDs, and global keys are unique. Year ranges are ordered integers within MY1990–2025. StoredModel/year collisions are zero. The final sorted 132-key hash is `998eb66401c49f345f0dfc9105c155f6f64f084bcd09705355c0f15726695ad9`.

Honda, Yamaha, and Suzuki semantic identities remain byte-identical. Yamaha remains 60/177/905 and Suzuki 54/146/881. VFR800 MY2002 catalogue and Technical Profile mappings are unchanged. No Technical Profile, resolver, search, clarification, browser store, cloud, service-history, UI, or production research module changed.
