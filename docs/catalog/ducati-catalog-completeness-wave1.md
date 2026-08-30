# Ducati Motorcycle Catalogue Completeness — Wave 1

## Scope and baseline

Wave 1 is a conservative production-road catalogue for MY1990–2025, matching RevLog's current selectable-year boundary. It is broad historical coverage, not a claim of worldwide completeness. The 46 existing Ducati variants were frozen before editing: their sorted key hash is `92e36d50ffe08ad5e4c6a6dbf184dddc94ea2fb41d760675a88769ba4c98368a`, and their full semantic-record hash is `ef58a751bdb02c208c98cf7fee763aa744da057d30b8e33123e0295cd6c0d57d`. All 46 remain unchanged.

## Method and sources

Primary research used Ducati's [Heritage road-model archive](https://www.ducati.com/ww/en/heritage/bikes), [historical chronicle](https://www.ducati.com/ww/en/heritage/ducati-chronicle), [owner-manual library](https://www.ducati.com/ww/en/service-maintenance/owner-manuals), [genuine-parts catalogue](https://www.ducati.com/gb/en/service-maintenance/ducati-genuine-part-catalogue), model brochures, and Ducati Media House launch material. Ducati's official [Multistrada history](https://www.ducati.com/ww/en/news/multistrada-twenty-years-of-emotions-and-innovation) explicitly identifies four generations beginning with the 2003 1000 DS. Homologation/type-approval evidence, contemporary road tests, and reputable reference publications were used to corroborate European model-year boundaries where archive summaries were not granular enough.

The archive's separate Road and Racing classifications informed the production boundary. Registration or marketplace dates were not used as production evidence.

## Coverage and generation decisions

Wave 1 adds 50 variants and nine families, producing 18 families, 96 variants, and 404 variant-years.

- `superbike-classic` separates production 851, 888, 748, 916, 996, and 998 identities. The existing 749/999 and 848/1098/1198 family remains intact; Panigale remains a later Superquadro/V4 lineage.
- `supersport` distinguishes carburetted 750/900 SS, injected SS, 800/1000 DS, and the modern 939/950 SuperSport platform. Spelling such as `900SS`, `900 SS`, `i.e.`, and `IE` is normalization, not identity.
- `sport-touring`, `paso`, `sportclassic`, and `limited-road` cover ST2/ST3/ST4, the MY1990-overlapping Paso generation, materially distinct SportClassic configurations, MH900e, and the customer road-production Desmosedici RR.
- Monster additions distinguish air-cooled M750/800, S2R, liquid-cooled S4/S4R/S4RS, and the already preserved later generations. Engine/chassis identity—not `S`, `R`, or displacement alone—drives separation.
- Multistrada 620/950/V2 extend the preserved original, 1200, 1260, and V4 generations. Marketing suffixes do not duplicate the underlying platform.
- Hyperstrada is separate from Hypermotard because its factory touring configuration is materially different; Hypermotard 796 and the single-cylinder 698 Mono remain separate technical identities.
- XDiavel is separate from Diavel. Diavel 1200/1260/V4 and XDiavel 1262/V4 are not collapsed by the shared cruiser positioning.
- Modern Scrambler Icon generations, Full Throttle generations, Café Racer, Nightshift, Desert Sled, and the 1100 platform are represented where factory configurations are materially distinct. Historical Scrambler is researched but cannot enter the MY1990–2025 schema.
- Original 848/1098 Streetfighter, modern V2, and modern V4 remain separate architectures.

## Naming, editions, and exclusions

Canonical stored names use readable spacing and Ducati's familiar capitalization. Harmless punctuation and regional formatting (`V4 S` versus `V4S`, `SS` spacing, `IE` versus `i.e.`) do not create duplicates.

S/R/SP suffixes were not added automatically. Paint, Dark/Stripe treatments, Corse or Tricolore liveries, Senna/Anniversary editions, branded Lamborghini/Bentley editions, and equipment packages are excluded unless the underlying production motorcycle is materially distinct. Paul Smart 1000 LE, MH900e, and Desmosedici RR are retained because they are distinct customer-production configurations, not merely paint packages.

Factory Corse racers, Supermono, MotoGP/WSBK machines, concepts, prototypes, and announced-only motorcycles are excluded. The 955 competition/homologation story is left unresolved rather than forced into a road identity. Early singles, bevel twins, Pantah, Darmah, Indiana, 750 Sport/SS, and historical Scrambler were researched as lineage context but fall before the catalogue's 1990 lower boundary (apart from the documented Paso overlap).

## Known limitations and follow-up

Wave 1 prioritizes European production identities and defensible continuous ranges. Scarce regional derivatives, exact transition months, authority-only models, and mechanically ambiguous limited editions remain candidates for later evidence-led work. A future wave may revisit pre-1990 support only if the global catalogue schema is deliberately expanded; it must not be simulated with false MY1990 entries.

## Validation

The final Ducati key hash is `bc550bfb2661ccc4827ea07ffebf7f29331c424bee1663c02894cd2c4a538b5b`. All 96 keys, family/local IDs, semantic identities, and storedModel/year pairs are unique; all year ranges are valid. Honda, Yamaha, Suzuki, Kawasaki, BMW, VFR800 MY2002, and its Technical Profile mapping remain unchanged. Global totals are 13 manufacturers, 297 families, 1,005 variants, and 4,871 variant-years.
