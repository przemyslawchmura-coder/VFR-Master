# Existing-Fleet Field-Oriented Research Plan

Status: static reassessment only. No external source was queried, acquired or
read; no candidate, evidence, Service Core or production record changed.

## Scope and baseline

Ten existing targets with meaningful research/profile state were inspected:
VFR800, CBR500R, NC750X, Africa Twin, CBR600RR, MT-09, Ténéré 700, Ducati
Monster 937, BMW F 900 R and FZ1. Catalogue-only variants were excluded; the
repository does not expose a reliable one-to-one count for that exclusion.

| Priority | Target | Baseline recorded | Research posture |
| --- | --- | --- | --- |
| 1 | Honda NC750X RH09-1 | 28/44 Service Core; 3 listed gaps | Small exact-fitment package; reuse existing source graph |
| 2 | Honda CBR600RR RH10 | 29/44 Service Core; 4 listed gaps | Small exact-fitment package; reuse existing source graph |
| 3 | Honda CBR500R PC70 | 26/44 Service Core; 18 total remaining, 11 high-value listed | Mixed fast/deep; existing owner manual is exhausted for new practical slots |
| 4 | Yamaha MT-09 III | 29/44 Service Core; 10 high-value gaps listed | OEM fiche/specialist opportunities, later years excluded |
| 5 | Yamaha Ténéré 700 I | 29/44 Service Core; 10 high-value gaps listed | OEM fiche/specialist opportunities, named equipment excluded |
| 6 | Honda VFR800 RC46 VTEC | 32/95 Rider Core, 60 missing, 3 blocked | Do not reopen verified cells; source identity/applicability first |
| 7 | Ducati Monster 937 | 21/95 Rider Core, 74 missing | Reuse 27 raw/20 pending records; cooling scope blocked |
| 8 | BMW F 900 R I | 0/44 Service Core, 13 raw, 2 conflict records | Resolve existing review/evidence state before discovery |
| 9 | Honda Africa Twin CRF1100L | 5/44 Service Core; 9 blocked listed gaps | Resolve USA-versus-EU and equipment applicability first |
| 10 | Yamaha FZ1 Gen II | No exact Rider Core projection; 14 raw candidates | Keep 2D1X scope and unresolved dimensions; no duplicate research |

Counts are repository baselines or bounded planning classifications, not new
research results. The authoritative machine-readable detail is in
`research/reports/existing-fleet-field-research-reassessment.json`.

## Field strategy

The policy is field-dependent. Fitment, OEM part identity, routine owner data
and legitimate specialist-domain fields can use a bounded fast path when exact
applicability and provenance are already clear. Maintenance intervals,
safety-critical torque, valves, internal service limits and diagnostics remain
deep path. Tier D is corroboration-only unless a field policy explicitly says
otherwise; discovery-only sources never become authority.

Useful source-coherent bundles are:

- `FAST_FITMENT_PARTS`: oil-filter, OEM pad and chain-size fitment.
- `FAST_ROUTINE_AND_FITMENT`: oil specification, oil filter, loaded pressures
  and chain-size fitment.
- `DEEP_OWNER_SERVICE`: intervals and owner-level conditional guidance.
- `DEEP_WORKSHOP_SAFETY`: valve clearances and safety-critical torque.

Blocked is distinct from missing. Africa Twin needs exact market/equipment
applicability before field research. VFR needs source identity/applicability
resolution for uncertain areas. BMW needs existing conflict/review processing.
Ducati cooling remains blocked by circuit-scope applicability. FZ1 remains raw-
only with market, ABS, transmission, equipment and emissions unresolved.

## Recommended first package

The next execution package is deliberately small:

| Target | Fast bundles | Permitted classes | Budget |
| --- | --- | --- | --- |
| NC750X RH09-1 | OEM fiche fitment | Tier A/B; Tier C only in domain | 4 discoveries, 2 authenticated sources, 3 classes, 8 raw candidates |
| CBR600RR RH10 | OEM fiche fitment | Tier A/B; Tier C only in domain | 4 discoveries, 2 authenticated sources, 3 classes, 8 raw candidates |
| CBR500R PC70 | OEM web/support, fiche and chain fitment | Tier A/B/C; Tier D corroboration-only | 4 discoveries, 2 authenticated sources, 3 classes, 8 raw candidates |

The package ceiling is 24 raw candidates and a planning ceiling of 10 practical
field slots. It must stop on unresolved applicability, insufficient authority,
conflict, incomplete provenance, duplicate existing coverage or budget
exhaustion. No online source is claimed to be available before a later,
separately authorized research wave.

## Scaling assessment

The current Factory can now prioritize existing gaps without treating manuals
as the default source for every field. Existing targets, GapPlans, source
prospects, planning policy, deterministic IDs, budgets, orchestration and
downstream review/evidence gates are reusable. Whole-fleet automation still
needs a provider registry, field-policy coverage, HTML/structured-web
acquisition/extraction, source-family rules and explicit identity resolution.

This plan intentionally does not build those layers, execute research, or
modify the FZ1 pilot, existing candidates, VFR/Ducati production data, the
catalogue or Supabase.
