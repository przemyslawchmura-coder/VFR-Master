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
