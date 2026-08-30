# Honda Service Data Wave 1 (research quarantine)

This is non-production research for Honda catalogue identities already present in RevLog. No value is promoted to the Technical Profile registry or runtime. The current canonical research checklist contains 183 fields; this wave defines a 44-field Service Core subset covering fluids, ignition, valve train, final drive, brakes, tires, electrical, maintenance and routine torques.

## Scope and applicability

Eight representative identities are targeted: VFR800 VTEC, CBR500R PC70, CBR600RR RH10, CBR1000RR-R SC82, CRF1100L Africa Twin, CB500F PC63, NC750X RH09 and XL750 Transalp. Exact key and model-year ranges are recorded in the machine-readable dataset. Region, ABS and transmission remain explicit tri-state applicability fields; unknown values remain `null`.

## Evidence policy

Evidence uses official Honda publications: the 2024 CBR500R/NX500 owner manual and Honda UK 2021 Super Sport and Adventure brochures. Each evidence record retains source ID, section, page, raw wording, normalized value and unit. No marketplace, forum or search-snippet value is used. Service-manual and OEM-parts values remain unfilled where authenticated content was not available.

## Status and missing data

The generated report distinguishes `evidence-found`, `researched-no-evidence`, `not-researched` and `conflicting`. Wave 1 currently has 29 evidence-backed Service Core slots out of 352 (8% aggregate); all eight targets remain `RESEARCH-MORE`. This is intentionally conservative: no safety-critical conflict is resolved silently, and no missing value is represented as zero, false or a guess.

The existing CBR500R deep-profile baseline remains 53 evidence-found, 100 researched-no-evidence and 30 not-researched fields out of 183. This wave preserves that dataset and adds a separate service-data layer rather than duplicating or replacing it.

## Runtime boundary and next work

`research/data/honda-service-wave1.js` and `scripts/honda-service-data-report.js` are DOM-independent and are not imported by production runtime. Promotion requires a later source review, applicability/conflict review, schema conversion and human approval. The next useful step is authenticated workshop-manual and OEM-parts acquisition for CBR500R, followed by generation-specific VFR800 and Africa Twin service evidence.
