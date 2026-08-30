# Honda Service Data Wave 1 report (evidence-expansion pass)

> NON-PRODUCTION RESEARCH DATA. Generated from `research/data/honda-service-wave1.js`.

| Metric | Result |
|---|---:|
| Canonical fields | 183 |
| Service Core fields | 44 |
| Target variants | 8 |
| Researched variants | 5 |
| Service Core slots | 352 |
| Evidence-backed Service Core slots (post) | 38 |
| Service Core coverage (post) | 11% |
| Full canonical slots | 1,464 |
| Evidence-backed canonical slots (post) | 39 |
| Full canonical coverage | 2% |
| Researched-no-evidence slots (post) | 10 |
| Not-researched slots (post) | 304 |
| Conflicts / safety-critical conflicts | 0 / 0 |
| Tier 1 evidence | 39 |
| Service/workshop evidence | 0 |
| OEM-parts evidence | 0 |

CBR500R is `SERVICE-CORE-PARTIAL`; the other seven targets are `RESEARCH-MORE`. No target is ready for production promotion. The complete deterministic JSON report is produced with `node scripts/honda-service-data-report.js`.

The proof audit identified the mirrored manual's MY2002 publication identity as uncertain; those 24 rows are not counted as evidence. Thirteen fields are `VERIFIED-DIRECT` from the Honda Finland RC46 2002–2005 service-data card (page 1), leaving VFR800 at 13/44 (`RESEARCH-MORE`) until an authenticated manual copy is recovered.

The subsequent 61MCW01/61MCW05 recovery pass found a 638-page ManualsLib rendering with inspectable table-of-contents and technical-page text, but no inspectable internal cover, copyright/publication page or Honda publication number. It is recorded as `partial-content` with `identity-uncertain`, not as acquired/authenticated manual evidence. Authoritative Helm catalogue metadata confirms the candidate publication scopes (61MCW01: 2002–2003; 61MCW05: 2002–2007), but does not authenticate that mirrored copy. No Service Core counts changed and the 24 manual-derived rows remain blocked.

The content-level fingerprint is `research/data/vfr800-manual-fingerprint.js`. It covers all 24 blocked fields and records TOC page locations plus the limited technical text inspected; because publication identity and field-level applicability remain unproven, it does not alter evidence counts.

## VFR800 multi-source recovery

All 44 VFR800 Service Core slots are now represented in the deterministic gap matrix `research/data/vfr800-service-core-gap-matrix.js`. The baseline is 13 evidence-found, 24 blocked by the unidentified ManualsLib manual, and 7 not-researched. The recovery audit searched owner-manual, regional Honda, service-bulletin, authorized-parts and specification routes; no additional field-level source met the independent-proof policy. The 13 direct service-card slots remain evidence, while the other 31 remain not-researched for coverage purposes. VFR800 remains 13/44 (`RESEARCH-MORE`); no production values or catalogue identities changed.

## Source acquisition pass

The two-target acquisition log is `research/data/honda-service-acquisition-wave1.js`. It records eight documented attempts across CBR500R PC70 and VFR800 RC46 VTEC: the CBR500R owner manual was acquired; the VFR800 Honda-authorized genuine-parts fiche was acquired as metadata-only; workshop manuals and Common Service Manual routes were login-gated or unverifiable. No unauthenticated or aftermarket source was used as technical evidence. The acquisition gate is satisfied by the detailed blocker audit and acquired OEM-parts route, while workshop evidence remains zero.
