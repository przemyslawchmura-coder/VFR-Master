# Ducati Motorcycle Catalogue Completeness — Wave 2

## Baseline and method

Wave 2 is a deep gap audit of the conservative European MY1990–2025 production-road scope established in Wave 1. It does not claim worldwide Ducati completeness. Before editing, Wave 1 was frozen at 18 families, 96 variants, and 404 variant-years. The family, key, complete-record, and storedModel/year hashes are respectively `c1efe8b4332b7273bf3280977647fadde37b46918055487ee17b4ff3b4383d54`, `bc550bfb2661ccc4827ea07ffebf7f29331c424bee1663c02894cd2c4a538b5b`, `0629eee163b6a4f4e6b904d023e521a6654fcd14e846331e23ae6d13f34eb5fc`, and `7d1ecfbac52d7f6bf304536e55bbaaf8ddec2a4c54550a336112c78f6dfae538`. All remain unchanged.

Research prioritized Ducati's [Heritage road/racing archive](https://www.ducati.com/ww/en/heritage/bikes), official model pages and brochures, owner manuals, genuine-parts catalogues, certifications, homologation literature, and Ducati Media House production announcements. Period manufacturer literature and reputable publications corroborated older boundaries. Marketplace listings were excluded.

## Confirmed gaps and additions

Wave 2 adds 24 variants and three families:

- `superbike-r`: customer-production 996 R, 998 R, 999 R, 1098 R, 1198 R, Panigale R, and two Panigale V4 R technical generations. Their homologation engines and chassis specifications make them semantic motorcycles rather than trim packages.
- `superleggera`: 1199, 1299, and V4. Ducati describes three separate limited customer-production engineering projects; the V4 used a carbon frame and swingarm and a 500-unit production run.
- `multistrada-special`: 1200 Enduro, 1260 Enduro, V4 Pikes Peak, V4 Rally, and V4 RS. Long-travel/endurance chassis, 17-inch sport chassis, or the RS Desmosedici Stradale engine distinguishes these from equipment-only S/Grand Tour packages.
- Existing families gain 600 SS, 900 Superlight, Monster 1000, Monster 1200 R, Monster SP 937, ST3S, Scrambler Sixty2, and Sport 1000 S.

The final catalogue has 21 Ducati families, 120 variants, and 475 variant-years.

## Explicit audit decisions

### 955 and homologation

No `955` was added. Period use combines factory racing capacity evolution, conversions, and homologation history without sufficiently clear evidence of a stable customer road-production identity matching this catalogue. Ducati's archive separates the racing 916 F94/F96 story from the road 916. Conversely, the R motorcycles above have documented production identities and substantially different homologation engines/chassis.

Desmosedici RR remains correctly represented as a limited 1,500-unit road production motorcycle for MY2008–2009. MotoGP Desmosedici GP machines remain excluded.

### R, SP, S, and Superleggera

The mechanically distinct R line and three Superleggera projects are included. Panigale V4 SP/SP2 and Streetfighter V4 SP/SP2 remain equipment-led derivatives of their base platforms and are not separate service identities. Monster SP is included because Ducati documents a distinct suspension, brake, exhaust, battery, steering-damper, geometry, and electronic configuration. Monster 1200 R has its own higher-output engine/chassis production identity.

Routine `S` variants—Multistrada S, Panigale S, Streetfighter S, XDiavel S, and SuperSport S—remain normalized to their base technical generation. Their suspension/equipment changes do not justify multiplying every service identity under the established catalogue policy.

### Families and generations

- Superbike transitions from 851/888 through 916/996/998, 749/999, 848/1098/1198, Panigale twins, and V4 remain separate and unchanged. V4 R is split at MY2023 for its revised homologation generation.
- Existing Panigale V2 2020–2024 and MY2025 identities already capture the relevant generation break. No duplicate displacement-driven `955` identity is added.
- Original Multistrada, 1200, 1260, 950/V2, and V4 remain stable. Enduro/Rally and V4 RS/Pikes Peak additions are mechanically distinct; S, S Sport, and Grand Tour are not.
- Monster 1000 closes the air-cooled gap. S2R/S4/S4R/S4RS and 1100 EVO remain correctly separated. Monster 1200 R and modern SP are added; Dark and anniversary treatments remain excluded.
- ST2/ST3/ST4 remain unchanged; ST3S is retained as the factory sport-touring chassis configuration. Hypermotard/Hyperstrada and Diavel/XDiavel coverage required no new Wave 2 records.
- Sixty2 adds a distinct 399 cc Scrambler identity. Classic, Urban Enduro, Mach 2.0, Street Classic, and similar first-generation treatments remain styling/equipment configurations. Existing Icon, Full Throttle, and Nightshift splits already preserve the second-generation 800 platform.
- Sport 1000 S is a distinct faired production configuration. GT1000 Touring is an equipment package; Paul Smart 1000 LE and MH900e remain stable.

## Years, aliases, and markets

All Wave 1 ranges remain unchanged after review. Wave 2 years use conservative European model-year applicability from official manuals, parts/model listings, production releases, and homologation records. No emissions-only California or registration-timing variant was added.

Formatting variants such as `900SS`, `900 SS`, `SS900`, `i.e.`/`IE`, `V4S`/`V4 S`, `SP2`/`SP 2`, and `Ducati Scrambler`/`Scrambler Ducati` remain aliases, not variants. No new alias duplicates were introduced.

## Confirmed non-additions and remaining gaps

Not added: 955, base-model S trims, Panigale/Streetfighter SP and SP2, XDiavel S, GT1000 Touring, Scrambler Classic/Urban Enduro/Mach 2.0/Street Classic, cosmetic editions, race-only Corse machines, Supermono, concepts, prototypes, and pre-1990-only motorcycles. Regional derivatives with unclear mechanical identity, rare homologation sub-editions, exact market-specific transition months, and the carburetted/injected Monster 900 service boundary remain documented research candidates rather than speculative entries.

Wave 2 coverage is complete for the specific audited gap checklist and MY1990–2025 policy, not globally complete across all markets, editions, or Ducati history.

## Validation

The final key hash is `50e7fa3172b4b0fb715fe07b9e7ab61e7891e48529ded4c556f1b5ff5a192ba5`. All 120 Ducati keys, semantic identities, and storedModel/year identities are unique. Global totals are 13 manufacturers, 300 families, 1,029 variants, and 4,942 variant-years. Honda, Yamaha, Suzuki, Kawasaki, BMW, VFR800, Technical Profiles, and application version `0.1.0` remain unchanged.
