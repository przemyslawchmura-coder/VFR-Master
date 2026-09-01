# Yamaha MT-09 publication-code and EU-market reconciliation

Date: 2026-09-01

Scope: Yamaha-controlled publication metadata and applicability only. No service values, tables, evidence rows or researched-no-evidence states were inspected or created.

## Outcome

- Publication-code relationship: **RELATIONSHIP-UNRESOLVED**.
- Primary readiness: **ACCESS-BLOCKED**.
- Anti-loop result: **MT09-AUTHENTICATION-PATH-EXHAUSTED**.
- Independent audit: **ACCEPT-WITH-RISKS**.

The final bounded check found no Yamaha-controlled record for `B7N-28197-E0` and no official record containing both B7N and `LIT-11616-34-61`. Yamaha-controlled evidence therefore does not prove that the identifiers are the same publication, aliases, related regional editions or distinct documents. The relationship remains unresolved rather than inferred from similar titles.

## Publication identities

| Code | Official identity | Title/class | Official metadata and access | Market/year |
| --- | --- | --- | --- | --- |
| `B7N-28197-E0` | NOT-AUTHENTICATED | Mirror-corroborated `MTN890 / MTN890D Service Manual`; service manual | No Yamaha-controlled metadata or delivery path found; metadata and content remain `MIRROR-ONLY` | UNKNOWN |
| `LIT-11616-34-61` | AUTHENTICATED | `MT-09 / MT-09 SP Service Manual`; service manual | YamahaPubs MY2021 listing is `ACCESSIBLE-OFFICIAL-HTML`; printed/view-only purchase and Yamaha Dealer System routes make full content `ACCESS-BLOCKED-AUTH` | USA/North America; MY2021 MT-09 and 2021 MT-09 SP proven |

Official LIT metadata: `https://www.yamahapubs.com/home/search?category_id=3&family_name=MT-09&year=2021`.

Yamaha Motor Corporation U.S.A. Technical Exchange M2022-002: `https://static.nhtsa.gov/odi/tsbs/2022/MC-10208792-0001.pdf`. Only its publisher, publication number, model/year and delivery-system metadata were used.

## Model and applicability reconciliation

Yamaha Europe metadata proves `MTN890` means standard MT-09 and `MTN890D` means MT-09 SP. This resolves the model-code meanings but does not authenticate `B7N-28197-E0` or connect it to LIT.

- MY2021: PROVEN for LIT in the Yamaha USA context; UNKNOWN for B7N EU.
- EU market: UNKNOWN for the service-manual prospect.
- North America: PROVEN for LIT.
- Standard/SP scope: `STANDARD-AND-SP-AMBIGUOUS`. Both are named by LIT metadata, but metadata does not prove safety-critical sections can be separated.
- ABS readiness: UNKNOWN.
- Equipment readiness: UNKNOWN.
- Transmission readiness: PARTIAL.
- Expected marginal practical gap class: MEDIUM, unchanged; no numeric yield was estimated.

## Readiness and anti-loop audit

ADR-012 fails on document identity, target-valid official path, exact B7N target/year/market inclusion, content feasibility and safety scope. Accessible official metadata was kept separate from blocked full content. Mirror evidence did not establish authority, and owner-manual yield did not influence readiness.

The same exact-code Yamaha-controlled paths have now been checked in two bounded tasks without establishing B7N identity or EU applicability. No additional repository-known Yamaha metadata route is identified. Repeating an equivalent MT-09 task would be an authentication loop, so the path is classified `MT09-AUTHENTICATION-PATH-EXHAUSTED` unless genuinely new Yamaha-controlled metadata becomes available.

## Exact next task

Authenticate only the existing Yamaha Ténéré 700 service-manual prospect `BW3-F8197-E0` for `yamaha.tenere-700.gen1` MY2019 EU standard: resolve official Yamaha identity, delivery/access, exact year/market and standard-versus-named-equipment scope without inspecting service values or creating Service Core evidence.
