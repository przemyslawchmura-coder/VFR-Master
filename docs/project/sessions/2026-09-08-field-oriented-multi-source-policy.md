# Field-oriented multi-source research policy — 2026-09-08

- Starting HEAD: `663ce41`; `main`, clean, ahead of `origin/main` by 13.
- Performed static analysis only. The FZ1 pilot was inspected as source code;
  the PDF reader, extractor, acquisition path and external sources were not
  executed or inspected.
- Added a manufacturer-neutral field-oriented source authority policy. It
  makes field gaps the planning unit, defines field-dependent source tiers,
  fast/deep paths, corroboration, conflict, applicability, bounded search and
  non-PDF artifact handling.
- The existing FZ1 pilot remains a static benchmark: its trust boundaries are
  reusable, but its phrase matching and hand-built candidates remain
  model/source-specific. No candidates, evidence, Service Core or production
  data changed.
- Exact next: implement the smallest declarative field-policy/source-authority
  contract with synthetic-only validation; do not execute live research.
