# Motorcycle research catalogue coverage

> **NON-PRODUCTION RESEARCH DATA — partial seed catalogue, not a complete motorcycle database.**

Snapshot: 2026-08-29. Counts are reproducible with `node scripts/generate-research-reports.js`.

- Manufacturers: 11
- Model families: 93
- Generation/variant records: 167
- Proposed catalog keys: 167
- Honda: 44 families / 85 records / 27 records with a model code / 1986–2024 known boundaries
- Yamaha: 36 families / 68 records / 12 records with a model code / 1984–2025 known boundaries

The remaining 14 records preserve the prior seed for nine other manufacturers. Honda and Yamaha year ranges are research proposals tied to official histories, releases, line-up publications or factsheets. They require regional and model-year review before production use. `region: null` means not researched, not global applicability.

Stable-key proposal remains lowercase dot-separated `manufacturer.family.platform-or-code.generation`; display names and year remain separate. Missing official platform codes use reviewed generation tokens rather than invented chassis codes.
