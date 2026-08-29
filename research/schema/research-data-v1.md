# RevLog Research Data v1

> **NON-PRODUCTION RESEARCH DATA**

`revlog-research-data/v1` contains three arrays: `sources`, `catalog`, and `candidates`.

- A source has a stable `id`, provenance `type`, `title`, optional manufacturer/document metadata, URL and access date.
- A catalogue record has `researchRecordId`, manufacturer, family, commercial name, generation/code where known, year range, region/ABS applicability where known, a proposed stable key, source references and research status.
- A candidate has identity/applicability fields, `technicalField`, raw evidence, optional normalized candidate value/unit, source references, evidence note and conflict metadata.
- Sources retain exact document title, manufacturer, access date and optional publication/edition/region metadata; candidates point to those source IDs and add their own section/page evidence. Numeric scalars and numeric ranges in `normalizedCandidateValue` require a canonical `unit`.

Unknown values are `null`, never inferred. Proposed keys use lowercase dot-separated tokens: `manufacturer.family.platform-or-code.generation`. The year stays separate unless it is part of an official generation identity. Existing `honda.vfr800.rc46.vtec.gen1` remains compatible.

Research statuses: `discovered`, `source-located`, `candidate`, `corroborated`, `conflicting`, `rejected`, `ready-for-profile-review`. These are workflow states, not claims of production verification.

Source classes, ordered for review but never used for automatic conflict resolution: official service manual; official owner manual; official parts catalogue; official technical publication; aftermarket manufacturer; specialist database; workshop reference; community.

Conflicting candidates remain separate records with the same `conflictGroup`. The validator reports conflicts and duplicates; it never chooses or deletes a value.

Every catalogue record and candidate must reference at least one source. A candidate key must exist in the aggregated research catalogue. Numeric normalized values require a unit; text identifiers, ratios and descriptive values may intentionally have no unit. Years outside the plausible motorcycle range are rejected. Proposed catalogue keys are unique across the aggregate; research modules cannot silently collide during merge.
