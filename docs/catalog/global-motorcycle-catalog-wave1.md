# Global Motorcycle Catalog — Coverage Wave 1

## Scope

Wave 1 expands the production catalogue while retaining its practical European-market and MY1990–2025 boundary. It adds catalogue identities only. It does not create Technical Profiles, promote research candidates, or change technical facts.

The catalogue is broader, not globally complete. A record represents a service-relevant model/generation identity rather than a paint scheme or sales edition.

## Method and source strategy

Generation boundaries were established from manufacturer histories, European model announcements, owner/service literature, model-code material, and archived line-ups. Official sources were preferred; established historical databases were used only to reconcile older European ranges where manufacturer archives are incomplete.

Representative primary sources used for the expansion include:

- Honda Global [CB history](https://global.honda/en/CB/history/), [CBR history](https://global.honda/en/CBR/history/), [Gold Wing history](https://global.honda/en/GOLDWING/history/), [2018 European line-up](https://global.honda/en/newsroom/news/2018/2181106eng.html), and [2024 European line-up](https://global.honda/en/newsroom/news/2023/c231107aeng.html).
- Yamaha Motor Europe model factsheets, owner manuals, and European launch material in the Yamaha media and document archives.
- Global Suzuki [GSX-R history](https://www.globalsuzuki.com/motorcycle/smgs/products/gsx-r_40th_anniversary/), [GSX-S1000 history](https://www.globalsuzuki.com/suzuki_family/motorcycle/the_all-new_gsx-s1000_is_a_striking.html), and European launch line-ups.
- Kawasaki Europe model archives, official model-year price lists, parts/model codes, and the [Versys 1100 history summary](https://storage.kawasaki.eu/repository/be/nl-BE/Rijtesten/Motoren___Toerisme_Rijtest_Kawasaki_Versys_1100.pdf).
- [BMW Group PressClub](https://www.press.bmwgroup.com/global) launch archives, including the F 900 R/XR and S/K-series model updates.
- Ducati Media House, including the [2022 DesertX launch](https://mediahouse.ducati.com/the-wildest-travel-dreams-come-true-with-the-ducati-desertx-a-motorcycle-born-to-enhance-the-adventure-thrill-without-setting-any-limits-369708/?lang=eng).
- Triumph official model/launch archive; KTM official press archive and Spare Parts Finder; Aprilia official brochures and technical sheets, including the Tuareg 660 publication.
- Harley-Davidson Service Information Portal and European model material for Revolution Max; Indian Motorcycle European model launches; Moto Guzzi official model archive.
- Royal Enfield [brand history](https://www.royalenfield.com/uk/en/our-world/since-1901/), [UK range](https://www.royalenfield.com/uk/en/motorcycles/), and [European 650 Twins launch](https://www.royalenfield.com/content/dam/royal-enfield/germany/our-world/news-and-media/press-release/product-launches/PressRelease-RoyalEnfieldIntroducestheInterceptorINT650andContinentalGT650.pdf).

## Manufacturers and families added

Four manufacturers were added: Harley-Davidson, Indian, Moto Guzzi, and Royal Enfield. Their initial coverage concentrates on established European families with defensible model-year boundaries rather than attempting complete back catalogues.

The nine existing manufacturers gained major missing families, including Honda 500/650 twins and fours, Hornet, Gold Wing, Pan European, VFR1200, Rebel, X-ADV and NT1100; Yamaha R6/R7/R3, MT-03/10, XSR, FJR, TDM and Super Ténéré; Suzuki GSX-R600, GSX-S, V-Strom 800, Bandit, GSR, SV1000 and Katana; Kawasaki small Ninja/Z families, ZX-4R, Ninja 650, Z650/Z1000, H2, Versys 1000/1100, Vulcan S and 1400GTR; plus selected BMW, Ducati, Triumph, KTM, and Aprilia gaps.

## Variant methodology

Separate variants are used for chassis/model-code changes, major engine or emissions revisions, service-relevant facelifts, materially distinct parallel versions, and documented returns after production gaps. Cosmetic editions are not split.

Existing `variant.id`, `variant.key`, `storedModel`, and year ranges were retained unchanged. New records are appended after the original catalogue block to make that compatibility boundary visible.

Parallel variants are legitimate when service identity differs—for example Ninja H2 and Z H2, faired/naked siblings, or distinct model codes. Discontinuities remain explicit: the Hayabusa has no MY2019–2020 entry, and no range is stretched across that gap.

## European-market boundary

Wave 1 includes motorcycles sold through European ranges. US-only bagger derivatives, JDM-only small-capacity variants, market-specific names without a European sales trail, off-road competition-only machines, and scooters outside the current catalogue intent were not added.

## Statistics

| Metric | Before | After | Growth | Growth % |
| --- | ---: | ---: | ---: | ---: |
| Manufacturers | 9 | 13 | +4 | 44.44% |
| Model families | 52 | 129 | +77 | 148.08% |
| Variants/generations | 266 | 521 | +255 | 95.86% |
| Variant × model-year combinations | 1,066 | 2,209 | +1,143 | 107.22% |

Counts are generated by `node scripts/motorcycle-catalog-report.js`. Variant-years are exactly `sum(yearTo - yearFrom + 1)`; parallel variants count independently.

## Known gaps and deliberately excluded candidates

- Harley-Davidson’s many overlapping trim codes need a dedicated VIN/model-code wave; Wave 1 keeps only broad service platforms.
- Indian touring/bagger derivatives and Moto Guzzi California/Norge/Griso variants need stronger Europe-by-year boundary work.
- Husqvarna, MV Agusta, Benelli, and CFMOTO were not added merely to raise manufacturer count; they should receive focused archive research in the next wave.
- Honda CRF250L/300L/Rally and Kawasaki KLX/KLR were held back because European continuity and homologation boundaries need a dedicated dual-sport pass.
- Suzuki DR650/DR-Z400 and Yamaha WR250R have material market gaps and were not represented as continuous European ranges.
- Several historical Ducati, Triumph, KTM, and Aprilia subvariants remain candidates where SP/R/Factory equipment changes need parts-catalog confirmation.

No existing catalogue correction was made in this wave.

## Next recommended wave

Prioritize Husqvarna, MV Agusta, Benelli, and CFMOTO; then deepen Harley-Davidson, Indian, and Moto Guzzi using Europe-specific model-code and homologation evidence. A separate dual-sport/enduro pass should resolve CRF, KLX/KLR, DR/DR-Z, and WR production gaps. Finally, audit DCT, Adventure, Factory, SP, and touring derivatives where service parts justify parallel catalogue identities.
