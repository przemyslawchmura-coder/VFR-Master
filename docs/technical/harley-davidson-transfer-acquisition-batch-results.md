# Harley-Davidson transfer acquisition batch results

Date: 2026-09-01

Phase: 5

Classification: **REJECT**

Transfer interpretation: **failed transfer**

## Outcome

The single-target execution stopped at the authentication gate. The exact repository-registered official URL identifies publication `94001064`, but Harley-Davidson's official indexed content reauthenticates it as the **2023 Harley-Davidson Owner's Manual — Sportster RH Models**, not the selected MY2022 publication. The official content endpoint returned HTTP 403 during direct acquisition.

Official Harley-Davidson parts-catalogue indexing maps owner manual `94001064` to RH1250S, and the registered filename establishes English (United States). Those facts do not cure the model-year mismatch. MY2022 applicability cannot be inferred from MY2023, even for the same model.

No content extraction occurred, no evidence rows were created and coverage remained 0/44. The fixed +8 verified and +6 practical gates failed. No second document, substitute MY2022 manual or Tier C/D rescue source was used. The three pre-existing MY2022 staging candidates tied to the misidentified publication were marked rejected; they never counted as verified Service Core evidence.

## Fixed scope and source

| Item | Result |
|---|---|
| Target | `harley-davidson.revolution-max.sportster-s` |
| Model | Sportster S / RH1250S |
| Selected scope | MY2022, USA, manual, standard equipment |
| Starting coverage | 0/44 |
| Only permitted publication | `94001064` |
| Official host | `serviceinfo.harley-davidson.com` |
| Authenticated title | 2023 Harley-Davidson Owner's Manual — Sportster RH Models |
| Authenticated publication scope | MY2023, English/United States |
| RH1250S proof | Official Harley-Davidson parts-catalogue index maps `94001064` to RH1250S |
| MY2022 proof | Failed: authenticated publication is MY2023 |
| ABS/transmission/equipment proof | Unresolved because the document content endpoint was inaccessible |
| Page count / pages inspected | Unavailable / none |
| Tier | A, official OEM owner manual |
| Authentication state | `OFFICIAL-PUBLICATION-REAUTHENTICATED-YEAR-MISMATCH` |

The exact attempted location was the repository-registered official document URL. The underlying document is counted once and one hosting location is recorded.

## Metrics

| Metric | Result |
|---|---:|
| Targets | 1 |
| Documents inspected at authentication level | 1 |
| Unique primary documents | 1 |
| Hosting locations | 1 |
| Yielding documents | 0 |
| Tier distribution | A=1, B=0, C=0, D=0 |
| Evidence rows | 0 |
| Verified slots | 0/44 → 0/44 |
| Verified gain | 0 |
| Practical gain | 0 |
| Generic gain | 0 |
| Practical gain/document | 0 |
| Researched-no-evidence fields | 0 |
| Conflicts | 0 |
| Unresolved safety-critical conflicts | 0 |
| Applicability blockers | 3 |
| Primary-document budget | 1/1 |
| Tier C/D practical contribution | 0 |

No researched-no-evidence field is claimed: the relevant sections were not accessible and therefore were not inspected. No remaining field is classified not-applicable. All 44 Service Core slots remain uncovered.

## Stop and falsification results

Triggered stop conditions:

- MY2022 applicability is unresolved and contradicted by the authenticated MY2023 identity.
- The official document content endpoint is inaccessible (HTTP 403).
- ABS, transmission and standard-equipment scope cannot be resolved from authenticated content.
- The one permitted primary document has been consumed at the authentication stage.

Triggered falsification conditions:

- MY2022 applicability cannot be proven.
- The document is inaccessible for content extraction.
- Practical gain is 0, below the fixed threshold of 6.

The official source and RH1250S mapping are real; the repository prospect was nevertheless not viable for the selected edition. This contradicts any success interpretation based merely on official-host status or the model mapping.

## Honda/Yamaha comparison

Honda's yielding documents produced 24 practical slots each; Yamaha's produced 27. Harley produced 0 against an expected 6–18. The result is a failed transfer, not weak practical yield: source selection failed before content-yield measurement because the registered publication was the wrong model year and inaccessible.

## Independent audit

The audit attempted to falsify the result and found:

- `94001064` and the official Harley-Davidson host are genuine.
- Official indexed document content identifies MY2023, so it cannot support MY2022.
- Official parts indexing links `94001064` to RH1250S, but does not establish MY2022 owner-manual applicability.
- USA/English metadata is supported; ABS, manual-transmission and standard-equipment scope are not content-authenticated.
- Multi-model, Revolution Max and later-year values did not leak into RH1250S MY2022.
- No US/SAE value or normalization was recorded, so no false precision was introduced.
- No maintenance action, tire-pressure/load or belt/chain semantic was invented.
- Zero evidence rows means coverage cannot be inflated by duplicates.
- Researched-no-evidence stayed empty because no relevant content section was inspected.
- Tier C/D practical contribution is zero and the one-document budget was respected.
- Conflicts are zero, including unresolved safety-critical conflicts.
- Production, runtime/browser, catalogue, Supabase and VFR800 remained unchanged.

Audit classification: **REJECT**. The execution correctly failed closed, but the acquisition hypothesis did not satisfy source applicability or practical-yield gates.

## Exact next task

Perform a bounded source-prospect authentication-quality reassessment: audit every immediate-batch registered Tier A/B prospect for exact publication, model-year, market, model/equipment inclusion and content accessibility before selecting another manufacturer acquisition; acquire no motorcycle evidence during that reassessment.
