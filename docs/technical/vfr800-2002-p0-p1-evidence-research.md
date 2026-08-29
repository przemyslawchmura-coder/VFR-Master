# Honda VFR800 VTEC 2002 — P0/P1 evidence research

Research date: 2026-08-29
Scope: the five P0/P1 items in `vfr800-2002-verification-audit.md` for production profile `data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js`.

## Executive summary

Two of the five evidence gaps are closed. American Honda bulletin `VFR800/A #4` directly identifies the 2002–2003 **standard type**, labels fuse-box positions A–F, and ties each 10 A or 20 A fuse to a named circuit. Because the bulletin's campaign/VIN scope is USA-only, `fuses.circuit.standard` is now explicitly limited to `region=USA` and `abs=false`. Honda's 2002 workshop material directly identifies hydraulic clutch operation and its clutch-fluid inspection procedure; `adjustments.clutch.system` is now verified with wording narrowed to those claims.

`fuses.pgm-fi` remains unresolved: the wiring diagram shows a separate 20 A feed through the engine-stop/fuel-cut-relay path, but does not explicitly label that fuse “PGM-FI” or “FI.” `brakes.system.linked-cbs` is partially verified: Honda directly calls the 2002 Japanese VFR system “Dual CBS,” and Honda's technical history describes a 2002 VFR800 Dual-Combined ABS, but the evidence does not prove the current unqualified claim for every production market and both ABS states. `lighting.headlight` remains partially verified because exact USA fitment is corroborated, while a complete Honda destination-code-to-market table was not found; the existing EU/UK/AU grouping therefore was not broadened or promoted.

No researched source disproved a numeric production value conclusively. The Australian `CM,U` fiche includes a 60/55 W option, which conflicts with treating all AU motorcycles as 55 W, but the accessible fiche also lists both H7 55 W and 60/55 W alternatives without a complete serial/destination applicability table. This is a documented unresolved mapping conflict, not a basis for silently selecting a replacement value.

## Evidence grading and production policy

- **A — direct OEM proof:** exact Honda document/page or Honda publication directly states the claim and applicable context.
- **B — strong OEM indirect proof:** OEM material strongly supports the claim but omits an essential label or applicability dimension.
- **C — authoritative secondary corroboration:** useful cross-check, never sufficient alone for production verification.
- **D — insufficient:** the required value-to-label or applicability relationship is absent.

The repository policy requires an accepted citation for the exact value. Only grade A was used to promote an entry to `verified`. Grade B/C evidence remains research context unless an already accepted production citation independently proves the claim.

## Source table

| Proposed/reused source ID | Title / type / publisher | MY/model scope | Market scope | Page/section | URL | Accessed | Claims supported |
|---|---|---|---|---|---|---|---|
| `doc.honda.vfr800-2002-2003.wiring-recall` / `cite.honda.vfr800-2002.tb.wiring-standard` | *2002–2003 VFR800/VFR800A Modified Wiring Diagram*; OEM technical bulletin; American Honda Motor Co., Inc.; publication `VFR800/A #4`, Nov. 2007 | 2002–2003 VFR800 standard and VFR800A ABS diagrams | USA campaign/VIN population | PDF p. 12, “2002–2003 VFR800 STANDARD TYPE” | https://static.nhtsa.gov/odi/rcl/2007/RCRIT-07V359-6830.pdf | 2026-08-29 | Standard/non-ABS identity; positions A–F; exact 10/20 A circuit assignments |
| `doc.honda.vfr800-2002.service-manual` / `cite.honda.vfr800-2002.sm.clutch-system` | *Honda VFR800/VFR800A 2002 Service Manual*; OEM workshop manual; Honda Motor Co., Ltd. | VFR800 and VFR800A, MY2002 | manual coverage recorded as all destinations | pp. 1-5, 3-29–3-30; general specification and clutch-system/fluid inspection | https://www.manualslib.com/manual/3139216/Honda-Interceptor-2002.html | 2026-08-29 | Hydraulic clutch operation; fluid-level/leak/hose inspection; no periodic clutch adjustment |
| research only: `honda-global-2002-vfr-release-jp` | *大型ロードスポーツバイク「VFR」をフルモデルチェンジして新発売*; OEM press release; Honda Motor Co., Ltd. | Japanese BC-RC46 VFR launched 2002-01-22 | Japan | “高剛性フレームと最新のDual CBS”; notes define Dual CBS | https://global.honda/jp/news/2002/2020121-vfr.html | 2026-08-29 | Exact “Dual CBS” name, operation of both wheels from either control, MY2002 Japanese model |
| research only: `honda-global-advanced-brakes-vfr800` | *Tech Views Vol. 2 — Advanced Brake Systems*; OEM technical history; Honda Motor Co., Ltd. | VFR800 introduced system in 2002 | market not stated | “Dual-Combined ABS Road-Testing” | https://global.honda/en/tech/innovation/technology/motorcycle/tech-views/vol02_cbs/GoldWing.html | 2026-08-29 | 2002 VFR800 Dual-Combined ABS; both brakes engage from lever or pedal |
| existing owner-manual metadata; research mirror only | *2002 VFR800 Owner's Manual*; OEM owner guide; Honda Motor Co., Ltd.; publication `31MCW600` | 2002 Interceptor 800 | USA | Clutch maintenance; mirror transcript does not expose a trustworthy printed page label | https://ownersmanuals2.com/honda/vfr800-2002-owners-manual-61006 | 2026-08-29 | Corroborates hydraulic actuation, no adjustment, fluid/leak inspection |
| research only: `honda-usa-2002-vfr800a-headlight-fiche` | *2002 VFR800A AC Interceptor — Headlight*; Honda OEM fiche reproduced by OEM distributor | VFR800A AC, MY2002 | USA/AC | headlight diagram, refs. 6–7 | https://www.partzilla.com/catalog/honda/motorcycle/2002/vfr800a-ac-interceptor/headlight | 2026-08-29 | Lists two 60/55 W bulbs for USA VFR800A; also exposes 55 W alternative, so destination/serial applicability remains necessary |
| research only: `honda-au-2002-vfr800-headlight-fiche` | *VFR800 (VFR) 2002 — Headlight (CM,U)*; Honda OEM fiche reproduced by Australian OEM distributor | VFR800, MY2002, destination codes CM/U | Australia-hosted catalogue | headlight diagram, refs. 7–8 | https://www.boltonmotorcycles.com/partFinder/fiche/honda/2002/vfr800-vfr/headlight-cm-u | 2026-08-29 | Lists both 55 W H7 and 60/55 W alternatives, quantity two; proves current broad AU mapping needs a complete applicability table |

The Honda press/technical-history pages and distributor fiches remain research-only because they do not close the full applicability claimed by the associated production entries. No duplicate production registry documents were added.

## P0 — `fuses.circuit.standard`

- **Current claim before research:** selectable 10 A and 20 A circuit fuses, described generically as circuits on the fuse-box cover, resolving for every `abs=false` motorcycle; source was the USA owner's-manual fuse citation.
- **Previous defect:** the owner's-manual excerpt established locations/available ratings but not the circuit assignments or non-ABS discriminator.
- **Evidence needed:** a legible MY2002 standard-type legend or wiring page tying each rating to a circuit and standard/non-ABS configuration.
- **Best evidence:** American Honda bulletin `VFR800/A #4`, PDF p. 12, headed “2002–2003 VFR800 STANDARD TYPE.” Its fuse box identifies A clock 10 A; B turn signals/front and rear brake lamps/horn 10 A; C starter/bank-angle sensor 10 A; D fan motor 20 A; E indicators/meter/position/tail/illumination 10 A; F headlight 20 A.
- **Applicability proven:** MY2002–2003, VFR800 standard type, USA campaign population. The paired p. 13 diagram separately identifies `VFR800A ABS TYPE`, making the standard discriminator explicit. No global-market applicability is proven.
- **Grade:** **A** for value, circuit relationship, standard/non-ABS context, year, and USA applicability.
- **Decision:** **VERIFIED**, narrowed to USA.
- **Production change:** circuit text now records the A–F assignments; `applicability` changed from `{ abs: false }` to `{ regions: ["USA"], abs: false }`; the standard wiring citation was attached alongside the owner-manual location citation.
- **Remaining research:** corresponding 2002 standard fuse legends for EU, UK, AU, Canada and other destinations before exposing the same list there.

## P0 — `fuses.pgm-fi`

- **Current claim:** 20 A, “PGM-FI injection and engine control,” located in the fuse box under the right inner panel; pending; cited only to the owner's-manual fuse excerpt.
- **Previous defect:** that excerpt contains 20 A ratings but does not tie one to PGM-FI.
- **Evidence needed:** an OEM legend or diagram explicitly labeling a 20 A fuse as PGM-FI/FI for MY2002 and its destination/configuration.
- **Evidence found:** both American Honda standard and ABS diagrams show a separate 20 A fuse in the engine-stop/fuel-cut-relay/engine-management supply path. Neither diagram labels that fuse “PGM-FI” or “FI”; it is outside the lettered fuse-box legend. The owner's-manual evidence still does not supply the missing label.
- **Applicability proven:** only the existence and electrical path of a 20 A feed on USA 2002–2003 standard and ABS diagrams—not the exact production circuit name/location claim.
- **Grade:** **D** against the task's required explicit 20 A ↔ PGM-FI relationship (the diagram is grade B corroboration for an engine-management feed, but cannot close this claim).
- **Decision:** **REMAINS UNRESOLVED**.
- **Production change:** none; remains pending and no broader source was attached.
- **Remaining research:** legible Honda fuse-box cover legend, owner's-manual specification table, or service-manual power-distribution page explicitly naming the 20 A PGM-FI/FI fuse and its physical location.

## P1 — `brakes.system.linked-cbs`

- **Current claim:** “Połączony hydrauliczny układ hamulcowy Honda Dual CBS,” with no applicability qualifier and no source.
- **Previous defect:** exact Honda naming, MY2002 applicability and ABS/non-ABS/market coverage were unproven.
- **Evidence found:** Honda's 21 January 2002 Japanese launch release calls the BC-RC46 system “Dual CBS,” expands the name as Dual Combined Brake System, and describes front and rear brakes operating in an appropriate distribution from either control. Honda's global technical history separately says the VFR800 debuted a new-generation Dual-Combined ABS in 2002. The service manual covers both VFR800 and VFR800A hydraulic brake systems but was not used to infer a global marketing name.
- **Applicability proven:** exact name and operation for the 2002 Japanese VFR; ABS-integrated form on a 2002 VFR800 in Honda's technical history. A complete USA/EU/UK/AU/Canada matrix and explicit proof that identical “Dual CBS” wording applies to every ABS and non-ABS destination were not found.
- **Grade:** **A** for the Japanese 2002 Dual CBS claim and Honda's 2002 ABS-integrated claim; **D** for the current entry's unqualified global applicability.
- **Decision:** **PARTIALLY VERIFIED**.
- **Production change:** none. Narrowing the single entry to Japan would hide a known system from other markets without completing their evidence, while marking the current global entry verified would overclaim.
- **Remaining research:** MY2002 owner/service overview pages or destination-specific sales/service publications for USA, Canada, EU, UK and AU, explicitly covering standard and ABS variants.

## P1 — `adjustments.clutch.system`

- **Current claim before research:** hydraulic clutch, no cable-free-play adjustment, inspect fluid level and leakage; unsourced and pending.
- **Previous defect:** “hydraulic” had been expanded into a cable-adjustment maintenance statement without a mapped OEM procedure.
- **Best evidence:** the MY2002 Honda service manual's general specification identifies hydraulic clutch operation; its maintenance procedure covers clutch-fluid level, leakage, hoses and fittings and specifies no periodic adjustment. The exact 2002 USA owner-guide text independently says the hydraulic clutch has no adjustments to perform.
- **Applicability proven:** VFR800 and VFR800A, MY2002; hydraulic actuation and inspection claims. The evidence does not justify claims about slave-cylinder overhaul intervals or lever adjustment.
- **Grade:** **A**.
- **Decision:** **VERIFIED**.
- **Production change:** wording changed from “hydraulic clutch—no cable free-play adjustment” to the narrower OEM-supported “hydraulically actuated—system requires no adjustment; inspect fluid level and leakage”; status changed to verified; precise service-manual citation added.
- **Remaining research:** none for this production statement.

## P1 — `lighting.headlight`

- **Current claim:** quantity two; EU/UK/AU branch 12 V 55 W; USA branch 12 V 60/55 W; both variants cite service-manual p. 1-14 and use a production note equating the higher-output destination notation with USA.
- **Previous defect:** the stored wattages were cited, but the conversion from Honda destination codes to broad application regions was not independently complete.
- **Evidence found:** the MY2002 service manual is the correct OEM model/year document, but the accessible text extraction does not preserve the full destination-code qualifiers needed to reconstruct all mappings. The USA VFR800A AC OEM fiche lists quantity two 60/55 W bulbs. Australian Honda-fiche reproductions for destination heading `CM,U` list both 55 W H7 and 60/55 W bulb alternatives, also quantity two, without the missing complete serial/destination columns.
- **Applicability proven:** MY2002 USA VFR800A AC has a two-bulb 60/55 W fitment option. Quantity two is corroborated for the inspected USA and CM/U fiches. The complete EU/UK/AU/Canada mapping, whether EU/UK/AU can share a branch, and whether USA is the sole 60/55 W destination are not proven.
- **Grade:** **B** for USA value/quantity through an authoritative Honda OEM fiche reproduction; **D** for the complete broad-region mapping. Existing service-manual wattages remain direct OEM values, but their destination conversion remains unresolved.
- **Conflict:** the `CM,U` fiche's 60/55 W alternative is inconsistent with treating every AU motorcycle as 55 W. Because the same accessible fiche also exposes both bulb families without complete applicability columns, it does not conclusively select a replacement for a particular AU VIN.
- **Decision:** **PARTIALLY VERIFIED**; not promoted beyond its current pending base status.
- **Production change:** none. Unknown/unsupported region continues to withhold a regional wattage as ambiguous; no research-only fiche was added to the production registry.
- **Remaining research:** complete MY2002 Honda parts-catalogue destination/serial applicability table and Honda's destination-code legend, including Canada and all `VFR800/VFR800A` model codes.

## Production impact and resolver/search review

Only two production entries changed:

1. `fuses.circuit.standard`: exact USA A–F circuit legend added and applicability narrowed to USA + explicit non-ABS.
2. `adjustments.clutch.system`: wording narrowed, source attached, status promoted to verified.

No resolver, clarification or search semantics changed. For the standard fuse entry, `region=USA, abs=false` resolves; `abs=null` remains ambiguous; `abs=true` is not applicable; non-USA is not applicable. Focused tests also prove unresolved/unsupported contexts do not expose its raw or formatted value in search. `fuses.pgm-fi`, CBS and headlight resolution behavior is unchanged.

## Final decisions

| Priority | Entry | Grade | Decision | Production effect |
|---|---|---|---|---|
| P0 | `fuses.circuit.standard` | A | VERIFIED | exact circuit legend; narrowed to USA/non-ABS; source added |
| P0 | `fuses.pgm-fi` | D | REMAINS UNRESOLVED | none |
| P1 | `brakes.system.linked-cbs` | A in documented Honda contexts; D for global matrix | PARTIALLY VERIFIED | none |
| P1 | `adjustments.clutch.system` | A | VERIFIED | narrower wording; verified; source added |
| P1 | `lighting.headlight` | B for USA fiche corroboration; D for destination map | PARTIALLY VERIFIED | none |

## Validation

- Targeted registry/loader, browser runtime, validator, resolver, clarification/context, VFR integration, UI and search tests: **188/188 passed**.
- Full `node --test tests/*.test.js`: **263/263 passed**.
- `node --check` accepted both modified production JavaScript files.
- `git diff --check`: passed.
- Manual diff review found no resolver, clarification, search or unrelated UI changes.
