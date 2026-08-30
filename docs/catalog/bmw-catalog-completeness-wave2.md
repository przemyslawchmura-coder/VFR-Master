# BMW Motorrad European Catalogue Completeness — Wave 2

## Scope and method

This is a conservative Europe-oriented catalogue of BMW Motorrad production motorcycles for MY1990–2025, not a claim of worldwide completeness. It covers documented road motorcycles and road-legal adventure/dual-purpose machines. Concepts, race-only machines, authority derivatives, cosmetic packages, and identities supported only in markets outside Europe are excluded.

The 50 existing BMW variants were frozen before editing as complete semantic records. Their sorted key hash is `5f69cf06231f878fb4ce86f5a6634a76026b6ecdaa3a2256e27e04675d3d641b`; their semantic hash is `12187e0648c2b329e994ceec40a5af5cf7f3d8b12db702f8ad7b00ee6b7875f5`. Family, local ID, key, display name, storedModel, and year range remain unchanged for every baseline record.

## Research sources

Primary evidence came from BMW Group Classic's historic Motorrad model overview, BMW Motorrad and BMW Group PressClub model launches, technical press kits, owner/service documentation, parts catalogues, European brochures, and homologation/model-code records. Period road tests and reputable historical references were used to corroborate older boundaries. BMW's official GS history confirms the single/twin F-series succession; official launch material distinguishes the later F 750/F 850 and 895 cc F 800/F 900 platforms, R 1300 GS Adventure, R nineT derivatives, K architectures, M models, and CE urban vehicles.

## Coverage and additions

Wave 2 adds 85 variants and 19 families:

- Boxer road/touring: `r-roadster`, `r-sport-touring`, `r850-special`, and `r-cruiser`.
- Boxer adventure: `gs-adventure-boxer`, separate from the preserved standard `gs-boxer` family.
- K architectures: `k-legacy`, `k1100`, `k1200-brick`, `k1200-transverse`, and `k1300`; distinct K 1600 configurations extend `k1600`.
- F/G: `f650-classic`, `f650-special`, `g650`, and `f-touring`; documented twins and Adventure configurations extend `f-gs`.
- Performance: `hp-road` and `m1000`.
- Urban mobility: `c-scooter`, `c400`, and `electric-urban`.
- Heritage configurations extend `r-ninet` and `r18`.

## Identity decisions

- R 1200 GS K25, liquid-cooled K50, R 1250 GS, and R 1300 GS remain separate technical generations. GS Adventure uses a parallel family with its own chassis/configuration identities rather than an equipment alias.
- Original F 650/F 650 ST, single-cylinder F 650 GS/Dakar/CS, twin-cylinder F 650 GS, F 700 GS, F 750 GS, F 800 generations, F 850 GS, and F 900 GS are explicit identities. Badges do not determine platform lineage.
- The 2024 F 800 GS is stored as `F 800 GS 2024` to prevent collision with the earlier 798 cc generations. Adventure variants retain distinct stored identities.
- Longitudinal K 75/K 100/K 1 and K 1100, longitudinal K 1200, transverse K 1200/K 1300, and six-cylinder K 1600 are not collapsed by prefix.
- R nineT Pure, Scrambler, Racer, and Urban G/S are materially distinct factory configurations; the `/5`, anniversary, and Option 719 treatments are editions rather than new service identities.
- C 600/C 650 and C 400 scooters remain separate from C evolution, CE 04, and CE 02 electric identities.

## Naming and exclusions

Canonical names use BMW's spaced European formatting (`R 1200 GS`, `F 800 GS`, `CE 04`). Compact spellings and informal `GSA` shorthand are aliases, not variants. GT, GTL, B, Grand America, Adventure, and materially different R 18 body configurations are retained where the factory configuration changes the motorcycle identity.

Paint and equipment editions—including Triple Black, Trophy, Rallye appearance packages, Motorsport paint, Option 719, anniversary editions, and routine option bundles—are excluded. Factory race motorcycles, concepts, prototypes, police/authority derivatives, HP4 Race, and non-road competition machines are outside scope. The C1 roofed two-wheeler and scarce market-specific derivatives remain unresolved for this motorcycle-owner catalogue rather than being forced into the data.

## Counts and validation

| Scope | Families | Variants | Variant-years |
| --- | ---: | ---: | ---: |
| BMW before | 10 | 50 | 217 |
| BMW after | 29 | 135 | 653 |
| Global after | 288 | 955 | 4,668 |

The final sorted BMW key hash is `6ba4e7d993a3734f9a83626b07e1416a831e4b8c951c66e32651390d67039e37`. All 135 keys and family/local IDs are unique; storedModel/year collisions and invalid ranges are zero. Honda, Yamaha, Suzuki, and Kawasaki identities are unchanged. Yamaha remains 60/177/905, Suzuki 54/146/881, and Kawasaki 47/132/647. VFR800 MY2002 catalogue and Technical Profile mappings remain unchanged.
