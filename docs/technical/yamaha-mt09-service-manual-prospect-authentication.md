# Yamaha MT-09 service-manual prospect authentication

Date: 2026-09-01

Scope: metadata and applicability only; no motorcycle service values inspected or extracted.

## Outcome

Final readiness classification: **ACCESS-BLOCKED**. Independent audit: **ACCEPT-WITH-RISKS**.

The bounded check authenticated `LIT-11616-34-61` as a Yamaha US service manual for the MY2021 MT-09. It did not authenticate `B7N-28197-E0` through a Yamaha-controlled EU path, prove the B7N/LIT codes equivalent, or establish that North-American applicability safely transfers to the MY2021 EU standard target. The official complete-content routes require purchase or authenticated Yamaha Dealer System access. The prospect therefore does not pass ADR-012 and no extraction is authorized.

## Reproduced context

- Target: `yamaha.mt-09.gen3`, MT-09 III / MTN890, MY2021, EU, manual, standard; SP excluded.
- Prior official owner manual `B7N-28199-E0`: 0/44 → 29/44, +29 verified, +27 practical and +2 generic.
- Starting service-manual prospect: `SOURCE-IDENTITY-PARTIAL`, `MIRROR-ONLY`.
- Current coverage remains 29/44. No evidence or researched-no-evidence rows were created.

## Identity and access findings

| Item | Finding |
| --- | --- |
| `B7N-28197-E0` | `MTN890 / MTN890D Service Manual` identity remains supported only by mirror/title metadata. No official Yamaha EU delivery path was authenticated. |
| `LIT-11616-34-61` | Yamaha Manual Store lists it as the 2021 MT-09 printed and view-only eBook service manual. Yamaha Motor Corporation U.S.A. Technical Exchange M2022-002 identifies it for 2021-and-newer MT-09 and 2021 MT-09 SP. |
| Code relationship | **UNRESOLVED**. Title similarity is not Yamaha-controlled proof that B7N and LIT are aliases or contain common EU/USA material. |
| Official path | US listing: `https://www.yamahapubs.com/home/search?category_id=3&family_name=MT-09&year=2021`. The Yamaha bulletin identifies the corrected live manual in the authenticated Yamaha Dealer System Knowledge Center. |
| Accessibility | `ACCESS-BLOCKED-AUTH`: printed purchase and authenticated/view-only electronic routes exist, but complete anonymous content access is unavailable. The B7N route remains `MIRROR-ONLY`. |

The public bulletin was inspected only for publisher, title, publication number, year/model scope and delivery-system metadata. Its technical correction content was not used or transcribed into research evidence.

## Applicability findings

- Model: official LIT metadata explicitly includes standard MT-09 and MT-09 SP. Mirror-only B7N metadata names MTN890/MTN890D; its official relationship to the target remains partial.
- Model year: MY2021 is proven for the US LIT publication, not for an official EU B7N delivery.
- Market: North-American applicability is supported; EU applicability is UNKNOWN.
- Standard/SP: both are named, but metadata alone does not prove safety-critical sections are separable.
- ABS/equipment: UNKNOWN for later safety-critical extraction.
- Transmission: the catalogue target is manual, but publication metadata does not independently state transmission applicability.

Failed gate fields: underlying combined document identity, target-valid official path, exact model mapping, MY2021 EU applicability, market, feasible content access and sufficient safety scope. Yield scoring cannot override these failures.

## Marginal-yield and duplication assessment

The service manual is a fresh complementary document class but likely overlaps the owner manual. Expected marginal practical gap remains **MEDIUM** because only 15 Service Core slots remain and no service values were inspected. The prior +27 practical owner-manual result does not predict service-manual yield.

## Independent audit

Falsification established that the official evidence proves the US LIT identity, not the requested EU B7N identity. A mirror was not promoted to official accessibility, standard/SP inclusion was not mistaken for value separability, and unknown ABS/equipment scope remained fail-closed. No technical content, evidence rows, researched-no-evidence states or coverage changed. Production, runtime/browser, catalogue, Supabase and VFR800 production remained untouched.

Risks remain: the B7N/LIT relationship and EU path may ultimately be unprovable from public Yamaha metadata, and full content remains access-gated. These risks justify `ACCEPT-WITH-RISKS` for this authentication task and block acquisition.

## Exact next task

Perform one bounded Yamaha publication-code and EU-market applicability reconciliation for `B7N-28197-E0` versus `LIT-11616-34-61` using Yamaha-controlled publication metadata only: establish or reject code equivalence, the official EU delivery path and MY2021 EU standard/SP scope; inspect no service values and create no Service Core evidence.
