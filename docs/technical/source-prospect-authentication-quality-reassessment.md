# Source-prospect authentication-quality reassessment

Date: 2026-09-01

Phase: 5

Classification: **ACCEPT-WITH-RISKS**

## Decision

No repository-known prospect is currently **EXECUTION-READY**. No acquisition target is selected. Two bounded follow-ups authenticated the US LIT and Yamaha model-code identities but left the MT-09 prospect `ACCESS-BLOCKED`; its metadata-only path is now exhausted.

The exact next task is authentication of the existing Ténéré 700 service-manual prospect `BW3-F8197-E0` for MY2019 EU standard, limited to source identity, delivery/access, year/market and equipment metadata. It must not inspect technical values or create Service Core evidence.

Third-manufacturer answer: **NO**. After correcting Harley, the repository contains no execution-ready Tier A/B prospect for a third manufacturer.

## Harley failure reproduced

The failed execution selected `harley-davidson.revolution-max.sportster-s`, RH1250S, MY2022 USA manual standard, against registered publication `94001064`. The prospect entered execution as `KNOWN-REGISTERED-NOT-REAUTHENTICATED`; official metadata reauthenticated it as the MY2023 Sportster RH Models owner manual, and the official endpoint returned HTTP 403. Coverage remained 0/44→0/44 with zero verified, practical and generic gain. Audit outcome was REJECT.

The old post-Yamaha design remains a historical decision record but is now explicitly `SUPERSEDED-BY-EXECUTION`; current MY2022 readiness is `REJECTED-MISMATCH`. The staging source is MY2023 and its three former MY2022 candidates remain rejected. No current source registry treats `94001064` as a valid MY2022 prospect.

## Readiness contract

A prospect is execution-ready only when every applicable gate is true:

1. official authority is known;
2. underlying document identity and class are known;
3. publication code is known where provided;
4. official host or delivery path is known;
5. exact model and generation are known;
6. selected year/range is known;
7. market is known;
8. accessibility is feasible and previously authenticated;
9. ABS/transmission/equipment scope is sufficient for intended safety-critical work;
10. the source is not exhausted for the intended gaps;
11. Tier A/B identity is independent of Tier C/D evidence.

`UNKNOWN`, partial, blocked, exhausted and mismatch states fail the gate. Scoring cannot override a failed gate. Page-level technical extraction is not required for readiness, and none was performed here.

## Primary readiness classifications

- `EXECUTION-READY`: every gate passes; eligible for ranking.
- `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL`: genuine and accessible, but model/year/market/safety scope is incomplete.
- `REGISTERED-NOT-REAUTHENTICATED`: concrete identity is stored but current authenticity/applicability has not been re-established.
- `ACCESS-BLOCKED`: source route is known but content access is infeasible.
- `SOURCE-IDENTITY-PARTIAL`: some identity proof exists, but official path or complete underlying identity is missing.
- `EXHAUSTED / LOW-MARGINAL-YIELD`: authenticated source was already inspected or has no credible fresh marginal yield.
- `UNKNOWN`: no concrete exact-target Tier A/B prospect exists.
- `REJECTED-MISMATCH`: authenticated source contradicts selected year, market or target scope.

Accessibility is recorded separately as `ACCESSIBLE-OFFICIAL`, `ACCESSIBLE-OFFICIAL-REDIRECT`, `ACCESSIBLE-OFFICIAL-HTML`, `ACCESS-BLOCKED-AUTH`, `ACCESS-BLOCKED-403`, `ACCESS-BROKEN`, `MIRROR-ONLY`, or `UNKNOWN`.

## Inventory

| Classification | Manufacturer / target | Document | Host/access | Applicability and prior yield | Marginal class / action |
|---|---|---|---|---|---|
| ACCESS-BLOCKED | Yamaha MT-09 III MY2021 EU standard | Service manual `B7N-28197-E0` / `LIT-11616-34-61` | Official US LIT purchase/auth route known; B7N remains MIRROR-ONLY | Relationship unresolved; EU scope and safety separability unknown; bounded authentication path exhausted; owner manual previously +27 practical | MEDIUM; do not repeat without genuinely new Yamaha metadata |
| REGISTERED-NOT-REAUTHENTICATED | Yamaha Ténéré 700 I MY2019 EU | Service manual `BW3-F8197-E0` | UNKNOWN | Listing says XTZ690/XTZ690-U and 2020 workshop publication; MY2019, market and named-edition scope unproven; owner manual +27 | MEDIUM; defer behind MT-09 |
| ACCESS-BLOCKED | Honda CBR500R PC70 MY2024 USA/Canada | 2024 CB500F/CBR500R/NX500 service-manual family, no code | Dealer/Helm, ACCESS-BLOCKED-AUTH | Family/year listing only; PC70, market and ABS tables unresolved; owner manual exhausted at 26/44 | MEDIUM; defer until access/identity changes |
| SOURCE-IDENTITY-PARTIAL | Honda VFR800/VFR800A MY2002 | Service-manual candidate, `61MCW07` claimed/production-recorded | MIRROR-ONLY | Model/year shown, but no official path and research/production identity histories differ; ABS/market reconciliation needed; prior research route no-yield | MEDIUM; dedicated reconciliation only |
| REJECTED-MISMATCH | Harley Sportster S RH1250S selected MY2022 USA | 2023 Sportster RH owner manual `94001064` | Official SIP, ACCESS-BLOCKED-403 | RH1250S/USA known, wrong year; ABS/transmission/equipment inaccessible; 0 gain | UNKNOWN; never reuse for MY2022 |
| REJECTED-MISMATCH | Honda Africa Twin EU/UK MY2020–2023 | USA MY2020 owner manual `31MKS800` | ACCESSIBLE-OFFICIAL | Wrong market, incomplete year range, standard/Adventure Sports and manual/DCT risks; prior zero | UNKNOWN; do not reuse for selected target |
| EXHAUSTED / LOW-MARGINAL-YIELD | Honda CBR500R | Owner manual `31MLRB00` | ACCESSIBLE-OFFICIAL | Already inspected; pilot added zero beyond 26/44 | LOW; do not reacquire |
| EXHAUSTED / LOW-MARGINAL-YIELD | Honda VFR800 | RC46 service-data card | ACCESSIBLE-OFFICIAL | All authenticated fields already in 13/44 baseline | LOW; do not reacquire |
| EXHAUSTED / LOW-MARGINAL-YIELD | Honda NC750X | Owner manual `34MKW600` | ACCESSIBLE-OFFICIAL | +25 slots; bounded owner-manual fields exhausted | LOW; different class required |
| EXHAUSTED / LOW-MARGINAL-YIELD | Honda CBR600RR | Owner manual `32MKZ700` | ACCESSIBLE-OFFICIAL | +25 slots; bounded owner-manual fields exhausted | LOW; different class required |
| EXHAUSTED / LOW-MARGINAL-YIELD | Yamaha MT-09 | Owner manual `B7N-28199-E0` | ACCESSIBLE-OFFICIAL | +27 practical; remaining gaps workshop/parts-dependent | LOW; do not reacquire |
| EXHAUSTED / LOW-MARGINAL-YIELD | Yamaha Ténéré 700 | Owner manual `BW3-F8199-E0` | ACCESSIBLE-OFFICIAL | +27 practical; remaining gaps workshop/parts-dependent | LOW; do not reacquire |
| UNKNOWN | Suzuki SV650 III | No exact Tier A/B prospect | UNKNOWN | Official specification material only | UNKNOWN; separate registration needed |
| UNKNOWN | Kawasaki Ninja 650 II | No exact Tier A/B prospect | UNKNOWN | Official history/specification material only | UNKNOWN; separate registration needed |
| UNKNOWN | BMW F 900 R I | No exact Tier A/B prospect | UNKNOWN | No exact manual identity stored | UNKNOWN; separate registration needed |
| UNKNOWN | Ducati Monster 937 | No exact Tier A/B prospect | UNKNOWN | Generic official library, no exact document | UNKNOWN; separate registration needed |
| UNKNOWN | Triumph Street Triple 765 III | No exact Tier A/B prospect | UNKNOWN | Official specification material only | UNKNOWN; separate registration needed |

There are no `EXECUTION-READY` or `AUTHENTICATED-BUT-APPLICABILITY-PARTIAL` records. Every inventory item has exactly one primary classification; secondary risks remain explicit.

## Ranking and NEXT

Only execution-ready prospects can be ranked by expected marginal practical Service Core gain per primary document, adjusted for remaining gap, document class, prior richness, duplicate/exhaustion risk, safety risk and access friction. Because zero prospects pass, the ranked list is empty.

The MT-09 service manual is the best next authentication task—not the best acquisition target. Its document identity is stronger than Ténéré's, its expected marginal gap is medium, and resolving one official delivery/applicability path is more bounded than repairing VFR's cross-history inconsistency or Honda's login-blocked manual family. Yamaha owner-manual success does not make the service manual ready; it only supplies measured context.

## Independent audit

Audit challenges found:

- The gate directly learns from Harley: an official URL without exact year and feasible content access cannot pass.
- Authenticity, applicability, accessibility and expected yield are separate fields.
- UNKNOWN, partial, blocked, exhausted and mismatch records are all unranked.
- Current Harley metadata is MY2023 and rejected for MY2022; only explicitly historical artifacts retain the original selection.
- Owner-manual no-yield/exhaustion is explicit and cannot masquerade as fresh opportunity.
- MT-09 is not overvalued: it remains blocked until official delivery, market and SP/safety scope authenticate.
- Different source classes are not rejected categorically; they fail only on concrete gate fields.
- Exact market/year/equipment and safety-critical UNKNOWN states fail closed.
- The inventory uses repository-known prospects only; no open-ended discovery occurred.
- No technical values were inspected, no evidence rows were created and coverage was unchanged.
- Production, runtime/browser, catalogue, Supabase and VFR800 production were untouched.

Classification: **ACCEPT-WITH-RISKS**. The contract prevents another Harley-style false positive, but the repository presently has no ready source and the VFR source-history inconsistency remains deferred.

## Exact next task

Authenticate only the existing Yamaha Ténéré 700 service-manual prospect `BW3-F8197-E0` for `yamaha.tenere-700.gen1` MY2019 EU standard: resolve official Yamaha identity, delivery/access, exact year/market and standard-versus-named-equipment scope without inspecting service values or creating Service Core evidence.
