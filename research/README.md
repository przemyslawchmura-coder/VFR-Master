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

Deep profile candidates for `honda.cbr500r.gen4`, `yamaha.mt09.gen3`, and `yamaha.tenere700.gen1` are grouped in `data/candidates/deep-profiles.js`. They are owner-manual/specification evidence retained for human review; they are not production Technical Profiles.

For scalability, manufacturer expansions live under `data/sources/`, `data/catalog/`, and `data/candidates/`. `data/research-dataset.js` is the only logical aggregate consumed by validation and reporting. Merge order is fixed and tested. `scripts/generate-research-reports.js` derives metrics from that aggregate; manually maintained totals are not schema inputs.

## Canonical research coverage

`schema/research-coverage-standard.js` is the single field-level checklist for every future batch. It covers identity/applicability, engine, lubrication, cooling, fuel/intake, ignition, valve train, transmission/clutch, final drive, electrical, lighting, brakes, tires/wheels, suspension, steering/chassis, dimensions/mass, maintenance, OEM parts, torques and service limits (183 canonical fields).

The coverage auditor records five research states: `not-researched`, `researched-no-evidence`, `partial`, `evidence-found`, and `conflicting`. Atomic fields use the first, second, fourth and fifth states; `partial` is an aggregate category state when its fields have mixed coverage. No candidate is deliberately treated as evidence that the whole category was researched. `reports/deep-profile-field-gaps.md` is generated deterministically for the three deep profiles and exposes every field, including mandatory lighting functions.
