# Deep profile research readiness

> **NON-PRODUCTION RESEARCH DATA. Completeness is informational and never promotes a profile automatically.**

| Proposed key | Candidates | Major coverage | Official | Page / section | Service / owner manual values | Conflicts | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---|
| honda.cbr500r.gen4 | 60 | 28% | 100% | 42 / 60 | 0 / 42 | 0 | research-more |
| yamaha.mt09.gen3 | 58 | 28% | 100% | 40 / 58 | 0 / 40 | 0 | research-more |
| yamaha.tenere700.gen1 | 60 | 28% | 100% | 42 / 60 | 0 / 42 | 0 | research-more |

## Remaining gaps

- **honda.cbr500r.gen4:** chassis, oem-parts.
  - Reasons: insufficient canonical field coverage (28% < 60%); too many not-researched fields (32); insufficient service-manual evidence; critical fields incomplete (5).
  - Critical blockers: identity.model-year, electrical.charging-voltage, maintenance.periodic-schedule, maintenance.mileage-interval, torques.oil-drain-bolt.
- **yamaha.mt09.gen3:** oem-parts.
  - Reasons: insufficient canonical field coverage (28% < 60%); too many not-researched fields (26); insufficient service-manual evidence; critical fields incomplete (5).
  - Critical blockers: identity.model-year, final_drive.chain-size, electrical.charging-voltage, maintenance.periodic-schedule, maintenance.mileage-interval.
- **yamaha.tenere700.gen1:** oem-parts.
  - Reasons: insufficient canonical field coverage (28% < 60%); too many not-researched fields (25); insufficient service-manual evidence; critical fields incomplete (5).
  - Critical blockers: identity.model-year, final_drive.chain-size, electrical.charging-voltage, maintenance.periodic-schedule, maintenance.mileage-interval.

Readiness policy: at least 60% of canonical fields evidenced, no more than 20 not-researched fields, at least one service-manual value, no conflicts, and all critical identity/safety/service fields evidenced. This is informational only and never promotes data.
