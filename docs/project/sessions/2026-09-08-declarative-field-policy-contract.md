# Declarative field policy / source authority contract — 2026-09-08

- Starting HEAD: `4f24761`; `main`, clean, ahead of `origin/main` by 14.
- Added the manufacturer-neutral immutable field-policy contract and pure
  source-authority evaluator. It supports group defaults, canonical field
  overrides, closed source classes/domains, corroboration, applicability,
  provenance and bounded search budgets.
- Focused contract tests passed 7/7; related Factory tests passed 49/49.
  The full suite passed 800/801 before the deterministic project-state report
  was regenerated; the project-state audit then passed 6/6. No research,
  FZ1 execution, candidates, evidence, Service Core or production data changed.
- Exact next: one bounded existing-fleet field-oriented coverage reassessment;
  do not execute it in this wave.
