# Generic extraction playbook — 2026-09-08

- Starting HEAD: `43acd26`; `main`, clean, ahead of `origin/main` by 10.
- Scope: one architecture/playbook wave using VFR and FZ1 only as compatibility
  fixtures; no FZ1 extraction and no other motorcycle research.
- Added the generic `extraction-playbook` Factory layer and exported it through
  the existing Factory index. It validates source artifact/hash binding,
  bounded regions, field targets, provenance, applicability, budgets and the
  raw-candidate-only transition.
- The generic layer contains no VFR/FZ1 model names or technical values.
- FZ1 compatibility preserves the exact `2D1X` artifact/hash, six regions,
  24-candidate limit, FZ1-S/year/market/ABS/etc. boundaries and exclusion of
  `2D1-28197-E0`. VFR compatibility preserves the 99-entry production profile
  boundary without modifying it.
- No extraction, raw candidates, review entries, evidence, Service Core or
  production changes occurred.
- Exact next: one bounded pilot proving the generic playbook can drive the
  existing FZ1 `2D1X` extraction execution with raw candidates only.
