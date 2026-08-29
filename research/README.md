# RevLog motorcycle research quarantine

> **NON-PRODUCTION RESEARCH DATA**

This directory is a staging area for incomplete motorcycle catalogue research and technical-data candidates. Nothing here is a Technical Profile, an OEM truth claim, or an automatic input to the browser application.

The production boundary is deliberate:

- `index.html`, the Motorcycle Catalog, Technical Profile Registry, Browser Profile Store, UI and Supabase do not load this directory;
- research statuses are not Technical Profile verification statuses;
- `ready-for-profile-review` means only that a human may start a production-profile review;
- missing information remains `null`; model names are never used as heuristic profile discovery;
- promotion is manual: source review → conflict resolution → applicability review → schema conversion → validator → human review → registry addition.

The seed catalogue is partial. It is intended to exercise structure and provenance across manufacturers, not to claim global coverage.

For scalability, manufacturer expansions live under `data/sources/`, `data/catalog/`, and `data/candidates/`. `data/research-dataset.js` is the only logical aggregate consumed by validation and reporting. Merge order is fixed and tested. `scripts/generate-research-reports.js` derives metrics from that aggregate; manually maintained totals are not schema inputs.
