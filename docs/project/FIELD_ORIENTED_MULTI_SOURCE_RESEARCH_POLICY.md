# Field-Oriented Multi-Source Research Policy

Status: design-only, non-production. No source was fetched, no PDF was read,
and no FZ1 candidate or production record was changed by this policy wave.

## Strategic change

The research unit is a missing or high-value Service Core field (or tightly
related field group), not a document. A document remains one possible source
medium. The future flow is:

`identity → applicability context → field gap → field policy → discovery →
authentication → acquisition → medium-specific extraction → raw candidate →
existing review/evidence/promotion gates`.

This preserves the existing Factory separation: acquisition is not extraction,
raw extraction is not evidence, and evidence is not production. The fixed Rider
Service Core matrix remains 95 fields in 14 categories; the canonical Service
Core taxonomy remains manufacturer-neutral and is not changed here.

## Source classes and authority

| Class | Permitted role | Authority boundary |
| --- | --- | --- |
| Tier A — OEM/official | Primary authority, discovery, acquisition | Manufacturer-controlled model/specification/support pages, owner/service manuals, schedules, bulletins, fiche and official regional portals; exact applicability and provenance still required. |
| Tier B — authorized/OEM-adjacent | Primary or corroborating source where explicitly authorized | Importer, authorized dealer, licensed service system or OEM-authorized parts delivery; authority is limited to the material and domain actually identified. |
| Tier C — domain specialist | Field-limited technical authority | Tire, plug, battery, brake, chain/sprocket or lubricant manufacturer may speak authoritatively only inside its legitimate domain and for exact fitment/applicability. |
| Tier D — trusted secondary | Discovery, corroboration, or raw candidate only where a field policy permits | Independent databases and specialist publications never inherit OEM authority; provenance and corroboration remain mandatory. |
| Discovery-only | Lead generation only | Forums, social posts, unsourced blogs, scraped aggregators, unknown mirrors and search indexes cannot create authoritative evidence. |

Authority depends on source class, domain, field, applicability, provenance
quality, conflict state and corroboration. Two weak matching sources are not
equivalent to one exact applicable OEM source. A second location of the same
publication verifies identity only and is not an independent technical claim.

## Field authority matrix

| Field group | Preferred sources | Default minimum / corroboration |
| --- | --- | --- |
| Basic vehicle and fitment data (tire size/model, battery, plug, chain/sprocket, brake fitment) | A; relevant C; B | One exact A source is sufficient. C may satisfy only its domain with exact fitment; D needs OEM corroboration or two independent matching sources. |
| Routine owner-level service data (oil/coolant, pressures, chain slack, brake fluid, fuses, bulbs) | A owner/support/spec content; relevant C | One exact applicable A source is sufficient. C is limited to its domain; D requires explicit policy permission plus corroboration. Conditions and units stay raw. |
| Maintenance intervals | A owner/service/schedule | A is strongly preferred and normally sufficient. D normally needs OEM corroboration; unresolved applicability takes the deep path. |
| Safety-critical values (axle, brake-caliper, steering and critical suspension torque) | A workshop/service/bulletin or authorized RMI | Tier A/deep path is mandatory by default; generic secondary agreement cannot replace it. |
| Internal engine/workshop data (valves, internal torque, limits, timing) | A workshop/service/manual/bulletin | Tier A/deep path only unless a durable policy explicitly authorizes an equivalent source. |
| Diagnostics / ECU / EFI | A diagnostic/service documentation; authorized system | OEM or explicitly authorized technical system; no generic secondary fast path. |
| OEM part identities | A fiche/catalogue; B authorized parts system | Exact OEM/authorized identity; specialist fitment can supplement but cannot silently become an OEM part number. |

## Fast path, deep path and conflict handling

The fast path is allowed only when exact model applicability is clear, the
source class is allowed for the field, provenance is complete, no conflict is
present, the field is not deep-only, and the result can remain bounded and raw.
OEM web pages, official support/specification tables, official fiche and
domain-specialist fitment tables are first-class fast-path candidates.

The deep path is mandatory for safety-critical, workshop-only or diagnostic
fields; unresolved year/market/variant applicability; conflicting sources;
weak sources; and any case where conditions cannot be represented losslessly.
The existing parent-bound PDF bridge and manual extraction remain the deep-path
document capability, not the mandatory default for every field.

One exact applicable Tier A source may establish a routine or fitment field
when provenance is complete and no conflict exists. Tier C may establish only a
legitimate specialist-domain field. Tier D requires permitted OEM
corroboration or two genuinely independent matching sources. High-risk and
workshop fields remain Tier A/deep path regardless of source count.

Any disagreement produces `CONFLICT / REVIEW REQUIRED`. Values, sources,
classes, applicability and provenance are retained. The Factory must not
average, choose the first/common value, overwrite, or resolve conflict during
discovery or extraction; existing review and evidence-processing contracts own
the next transition.

## Applicability and discovery

Every candidate carries explicit manufacturer, model, generation, year,
market/region, ABS, transmission, equipment, emissions, body style, variant,
load and climate dimensions when relevant. Unknown remains unknown. FZ1-N does
not imply FZ1-S, one market does not imply global applicability, and conditional
rows are not flattened.

Discovery and authority are separate concepts. A search result or secondary
index may point to an OEM page, but final provenance should end at the
authoritative page or publication whenever possible. Discovery-only sources can
create leads, never authoritative evidence.

## Non-PDF sources

Static HTML, structured JSON/API responses, OEM tables and parts fiche are
acquired artifacts on the same trust model as PDF: source prospect/publication,
canonical and final URL, media type, byte length, content digest, and allowed
runtime acquisition metadata. A derived representation, if needed, must retain
its parent artifact and transformation identity under the existing contract.
No live fetch, HTML extractor or provider adapter is introduced here.

PDF is one source medium among several. Its exact-byte parent binding,
page/region provenance and deep-path readiness remain unchanged.

## Declarative field-policy contract

The smallest future configuration should be data, not executable policy:

```text
fieldPolicy:
  fieldId / fieldGroup
  sourceClasses: allowed, preferred, forbidden
  specialistDomain (optional)
  minimumAuthority / tierAMandatory
  corroboration: mode, independentSourceMinimum, exactOemAccepted
  requiredApplicability
  fastPathAllowed / deepPathRequired
  searchBudget: discoveryAttempts, authenticatedSources, sourceClasses, rawCandidates
```

The Factory evaluates this closed vocabulary and reuses current target,
prospect, acquisition, extraction, provenance, conflict and promotion
contracts. Configuration has no callbacks, `eval`, arbitrary code, or hidden
manufacturer branch. Source-medium adapters remain generic boundaries for
HTML/JSON/PDF structure and do not alter field authority.

Field prioritization starts with missing Core cells and combines rider
usefulness, safety, source availability, likely fast-path yield, coverage gain,
dependencies and unresolved conflicts. Each field/group gets bounded discovery
attempts, authenticated-source count, source-class count and candidate budget.
Stop when an exact authoritative value is obtained, deep escalation is
required, applicability or provenance is incomplete, conflict appears, or the
budget is exhausted. No indefinite search loop is permitted.

## FZ1 benchmark, batch implications and migration

The existing 14 FZ1 `2D1X` raw candidates were used only as a static benchmark;
the pilot was inspected statically and neither it nor the PDF was executed or
read for source content in this wave. Tire/fitment,
battery, plug, chain, lubricant and routine owner fields could potentially be
fast-path candidates where an exact permitted source exists; exact owner
instructions and conditional tables may still require the manual deep path.
Workshop, diagnostic and internal-service fields remain deep-only. This does
not claim any alternative source contains a value.

Static inspection shows the current pilot still has significant model/source
code: six region branches, Japanese phrase literals, hand-written field
candidate construction, source-specific locations/conditions, and a local
transformer invocation. Artifact binding, readiness, provenance validation,
candidate IDs, budgets and output isolation are reusable; target, source,
regions, fields, applicability and budget are configuration. The pilot's
extraction body is therefore not yet a generic parser.

The smallest implementation path is a closed declarative rule schema plus a
bounded deterministic local extraction engine (exact/anchored/structural
matches, explicit captures and condition templates). Zero matches produce no
candidate; multiple incompatible matches block or conflict; only one bounded
match can produce a raw candidate. Porting FZ1 rules is a later bounded wave
using synthetic fixtures first, leaving the committed pilot/report untouched.

Existing Orchestrator batch, target/source work items, attempts, events,
reducer, checkpoints and replay provide most mechanics for future 20–100 target
batches. A later field work item must bind target, field, source/artifact and
budget; failures remain per-target/per-field and ordering/IDs remain
deterministic. No candidate may cross model or applicability boundaries.

## Explicit non-goals and risks

This wave does not fetch or authenticate a source, execute extraction, build an
HTML adapter, build a batch runner, alter FZ1 candidates, promote evidence,
change production/catalogue/Supabase state, or replace the Factory. The main
risk is overgeneralization: a universal scraper would be less safe than small
closed source-family rules. Genuine exceptions may remain explicit, but must be
isolated and justified rather than copied into every motorcycle path.

The policy materially lowers future cost for ordinary exact-applicable fields
by avoiding mandatory manual acquisition and by making field gaps the planning
unit. Scaling is not complete until the declarative engine is implemented and
proven without model-specific Factory branches.
