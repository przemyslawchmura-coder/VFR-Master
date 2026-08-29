# Research conflicts

> **NON-PRODUCTION RESEARCH DATA**

No technical candidate conflict group is currently recorded. This means no contradictory pair was preserved during this research pass; it does **not** mean the underlying motorcycles are conflict-free.

Potential conflicts requiring further source work:

- model-year versus registration-year boundaries across European, US, Japanese and Australian markets;
- values grouped by marketing pages that may differ between manual, DCT, ABS or equipment versions;
- current Yamaha Ténéré factsheets expose different oil-capacity values between model-year/market documents and must not be merged across generations;
- Honda brochure kerb weights and dimensions sometimes contain explicit DCT alternatives; normalized values are deliberately left `null` where one scalar would lose that distinction;
- MT-07 seed identities from the earlier dataset and the expanded generation proposals require a dedicated identity reconciliation before any promotion.

The validator requires at least two records in every `conflicting` group and never selects a winner.
