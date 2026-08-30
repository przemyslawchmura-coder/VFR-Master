# Honda Service Data Wave 1 (research quarantine)

This is non-production research for Honda catalogue identities already present in RevLog. No value is promoted to the Technical Profile registry or runtime. The current canonical research checklist contains 183 fields; this wave defines a 44-field Service Core subset covering fluids, ignition, valve train, final drive, brakes, tires, electrical, maintenance and routine torques.

## Scope and applicability

Eight representative identities are targeted: VFR800 VTEC, CBR500R PC70, CBR600RR RH10, CBR1000RR-R SC82, CRF1100L Africa Twin, CB500F PC63, NC750X RH09 and XL750 Transalp. Exact key and model-year ranges are recorded in the machine-readable dataset. Region, ABS and transmission remain explicit tri-state applicability fields; unknown values remain `null`.

## Evidence policy

Evidence uses official Honda publications: the 2024 CBR500R/NX500 owner manual and Honda UK 2021 Super Sport and Adventure brochures. Each evidence record retains source ID, section, page, raw wording, normalized value and unit. No marketplace, forum or search-snippet value is used. Service-manual and OEM-parts values remain unfilled where authenticated content was not available.

## Status and missing data

The generated report distinguishes `evidence-found`, `researched-no-evidence`, `not-researched` and `conflicting`. The completion pass corrects the first report's defect of treating every missing value as researched-no-evidence. Explicit no-evidence rows now carry source categories, source IDs, date and result; all other slots remain not-researched. The pre-expansion audit has 28 Service Core evidence slots (the 29th original record was canonical but outside Service Core), while the post-expansion matrix includes 38 Service Core evidence slots and 304 not-researched slots. CBR500R is Service-Core-Partial; the other seven targets remain Research-More.

The existing CBR500R deep-profile baseline remains 53 evidence-found, 100 researched-no-evidence and 30 not-researched fields out of 183. This wave preserves that dataset and adds a separate service-data layer rather than duplicating or replacing it.

## Runtime boundary and next work

## Source Acquisition Pass — CBR500R + VFR800

The acquisition audit is limited to `honda.cbr500r.pc70` (MY2024–2025) and `honda.vfr800.rc46.vtec.gen1` (MY2002–2005). It records each service-manual, common-service-manual, owner-manual and OEM-parts route attempted, including access result, authority, applicability and disposition, in `research/data/honda-service-acquisition-wave1.js`. The CBR500R Honda CDN owner manual was acquired and yielded the existing evidence expansion. A Honda-authorized VFR800 RC46 genuine-parts fiche was acquired as metadata-only OEM evidence; no part number was promoted without an explicit applicable table. Honda workshop/service manuals were sought through dealer/service-information and document-index routes but were login-gated or unverifiable, so no workshop value was inferred. CBR500R remains Service-Core-Partial at 26/44; VFR800 remains Research-More at 13/44. This is a documented acquisition blocker, not a claim that manuals do not exist.

### Manual recovery pass (61MCW01 / 61MCW05)

The recovery search located a public ManualsLib rendering with a 638-page table of contents and technical-page text (lubrication, maintenance, oil/filter, coolant, chain, brakes and wheels). The rendering exposes content, but its cover, copyright/publication page and internal Honda publication number are not available for inspection. It therefore remains `partial-content` with `identity-uncertain`; content visibility is not treated as authenticated publication identity or Service Core evidence. Authoritative Helm metadata identifies `61MCW01` as the 2002–2003 VFR800/A manual and `61MCW05` as the 2002–2007 manual, but metadata alone cannot authenticate the mirrored copy. No Service Core rows were restored; VFR remains 13/44 (`RESEARCH-MORE`) pending an internally authenticated manual copy.

The content-level fingerprint is stored in `research/data/vfr800-manual-fingerprint.js`. It records all 24 blocked fields, their ManualsLib viewer/printed-page TOC locations, the two pages whose technical text was inspectable, and the absence of internal publication metadata. These are discovery fingerprints only; no field is promoted from `SOURCE-IDENTITY-UNCERTAIN`.

## VFR800 production-to-research reconciliation

The proof audit found that the mirrored manual listing does not establish publication identity `61MCW07` for MY2002 (official catalogue listings identify 61MCW01/61MCW05 for early years). Those manual-derived rows are therefore marked source-identity-uncertain and are not counted as evidence. Thirteen fields remain independently verified directly from the Honda Finland RC46 2002–2005 service-data card (page 1), with explicit RC46/year applicability. VFR800 is consequently `RESEARCH-MORE` pending authenticated manual recovery; production values and the registry remain read-only.

`research/data/honda-service-wave1.js` and `scripts/honda-service-data-report.js` are DOM-independent and are not imported by production runtime. Promotion requires a later source review, applicability/conflict review, schema conversion and human approval. The next useful step is authenticated workshop-manual and OEM-parts acquisition for CBR500R, followed by generation-specific VFR800 and Africa Twin service evidence.
