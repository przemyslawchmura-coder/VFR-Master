# PDF extraction trust boundary — 2026-09-08

- Starting HEAD: `c23979f`; `main`, clean, ahead of `origin/main` by 11.
- Scope: one architecture-only Technical Research Factory wave; no FZ1
  extraction execution and no motorcycle technical data.
- Added a generic stage-specific `RAW-EXTRACTION-READY` gate. It preserves
  unresolved applicability explicitly and leaves strict evidence/promotion/
  production readiness false.
- Added a parent-bound derived-content bridge using existing Factory artifact
  identity, JSON and extraction contracts. Derived UTF-8 content is bound to
  parent artifact ID/hash/media type/length, transformer identity/version and
  approved page-region; changed or detached inputs fail closed.
- Synthetic local bridge tests pass. FZ1 is used only as a compatibility
  fixture: its six-region plan is raw-extraction-ready, but the PDF was not
  read and zero candidates were created. `2D1-28197-E0` remains untouched.
- Exact next: one bounded FZ1 `2D1X` extraction pilot through the new gate and
  bridge, raw candidates only.
