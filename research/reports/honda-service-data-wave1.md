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

## Source acquisition pass

The two-target acquisition log is `research/data/honda-service-acquisition-wave1.js`. It records eight documented attempts across CBR500R PC70 and VFR800 RC46 VTEC: the CBR500R owner manual was acquired; the VFR800 Honda-authorized genuine-parts fiche was acquired as metadata-only; workshop manuals and Common Service Manual routes were login-gated or unverifiable. No unauthenticated or aftermarket source was used as technical evidence. The acquisition gate is satisfied by the detailed blocker audit and acquired OEM-parts route, while workshop evidence remains zero.
