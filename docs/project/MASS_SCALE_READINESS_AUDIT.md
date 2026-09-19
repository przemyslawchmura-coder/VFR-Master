# RevLog mass-scale readiness audit

Audit date: 2026-09-19
Scope: repository inspection only; no production, runtime, research or catalogue mutation.

## 1. Executive summary

The repository has a substantial, deterministic research and controlled-production foundation, but it is not yet a mass-population pipeline. The catalogue is deterministic and internally consistent at the structural level, while applicability dimensions such as market, ABS, transmission and equipment are not represented as complete catalogue identity dimensions. The Research Factory can plan bounded batches, checkpoint and resume work, acquire explicitly supplied sources, extract raw candidates and carry them through explicit human/evidence/promotion gates. The four production materialization executors are generic and individually idempotent.

The missing scale boundary is orchestration: there is no generic, read-only Catalogue → coverage inventory → deterministic research queue that automatically selects source-ready work, and no generic multi-motorcycle coordinator that carries independently authorized work through all production boundaries with batch recovery and human-gate accounting. Automatic source discovery and applicability authentication for an untouched catalogue motorcycle are also not implemented. A controlled approximately-10-motorcycle pilot is therefore not ready for automatic production processing; it first needs a read-only coverage-to-queue bridge and explicit source-readiness selection.

## 2. Verified repository baseline

- Branch: `main`.
- HEAD: `46376913e3351edaf5c2719f2a71549ee3e52a6e`.
- `origin/main`: same commit; ahead/behind `0/0`.
- Working tree: clean.
- The local environment has no `gh` executable, so CI was not queried locally. The supplied repository fact is GitHub Actions Validate #38 = SUCCESS.
- `node scripts/project-state-audit.js` reproduces the tracked report byte-for-byte. Its embedded historical test stocktake still says `681` tests; this is report history, not the current host-suite result supplied for the final CBR wave (`920 passed, 0 failed, 3 skipped`).

## 3. Catalogue inventory and identity

The executable catalogue report (`scripts/motorcycle-catalog-report.js` over `data/motorcycle-catalog.js`) reports:

| Measure | Count |
|---|---:|
| Manufacturers | 13 |
| Families/models | 318 |
| Variants/generations | 1,095 |
| Variant-years | 5,317 |
| Model-year range | MY1990–2025 |

The catalogue structure is manufacturer → family/model → variant, with variant `id`, stable `key`, display name, legacy `storedModel`, `yearFrom` and `yearTo`. Duplicate structural variant keys were not found by the inventory check. `catalogVariantKey` is the stable bridge used by the production registry; it is not itself a complete applicability record.

Market/region, ABS, transmission and equipment are represented in research targets, source applicability and production entry metadata rather than as uniformly populated catalogue dimensions. Consequently the repository can resolve a catalogue variant/year, but cannot infer every production-applicable target identity from the catalogue alone. Aliases, regional identities, generation boundaries, year gaps and model-specific equipment/ABS variants require explicit source or applicability evidence. No global completeness percentage is defensible from the current repository denominator.

## 4. Global catalogue-gap machinery

Phase 3A is recorded as `NOT-STARTED` in `docs/project/ROADMAP.md`. Existing internal machinery can expose catalogue structure and selected research gaps:

- `scripts/motorcycle-catalog-report.js` and `research/reports/motorcycle-catalog-coverage.md` report structural catalogue inventory.
- `research/factory/gap-plan.js`, `research/schema/research-coverage-standard.js` and `js/research/research-coverage-auditor.js` model field-level research gaps for known targets.
- `research/data/source-prospect-authentication-quality-reassessment.js` classifies known prospects as authenticated, blocked, exhausted, mismatched or unresolved.
- Existing reports explicitly plan gaps involving manufacturers, families, generations, years, regional aliases, ABS/transmission, 125/A1, Chinese/Polish brands and discontinued/current model-year boundaries, but no generic external discovery process populates those gaps.

What is missing is an internally generated, deterministic gap register joining every catalogue identity to applicability-aware production coverage and then to source prospects. External discovery, alias verification and safety-scope authentication remain future work.

## 5. Production Technical Profile inventory

The actual production registry contains three descriptors and three corresponding profile modules:

| Profile | Path | Entries | Documents | Citations | Catalogue key/year | Loader/validator |
|---|---|---:|---:|---:|---|---|
| `honda.vfr800.rc46-vtec-gen1.2002` | `data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js` | 99 | 6 | 32 | `honda.vfr800.rc46.vtec.gen1` / 2002 | valid |
| `ducati.monster937.2021` | `data/technical/ducati/monster937/profile-2021.js` | 45 | 1 | 45 | `ducati.monster.937` / 2021 | valid |
| `honda.cbr500r.pc70.2024` | `data/technical/honda/cbr500r/pc70/profile-2024.js` | 1 | 1 | 1 | `honda.cbr500r.pc70` / 2024 | valid |

`data/technical/technical-profile-registry.js`, `js/technical/technical-profile-registry.js` and `js/technical-profile-loader.js` provide descriptor validation, lookup, loading and integrity checks. No additional unregistered production profile modules were found. The CBR profile payload retains `registryMembership: NOT-REGISTERED` as historical/container metadata while its runtime registry descriptor is present; this is a distinction between profile metadata and runtime registry exposure, not a fourth state to infer automatically.

The repository does not expose a single automatic completeness classifier for all catalogue targets. It can distinguish “profile found” through registry lookup, and research reports distinguish partial, blocked, exhausted and evidence states, but a unified catalogue-wide production classification is not implemented.

## 6. Rider Service Core and coverage

The frozen user-facing matrix is `js/technical/technical-profile-core-matrix.js`: 14 domains and 95 ordered field IDs. It is separate from the 183-field research schema in `research/schema/research-coverage-standard.js` and from historical 44-slot Honda Service Core reports in project memory.

Existing coverage machinery is primarily research-side:

- `js/research/research-coverage-auditor.js` audits candidates against the 183-field research standard and reports `not-researched`, `researched-no-evidence`, `partial`, `evidence-found` and `conflicting`.
- `research/schema/technical-coverage-standard-v1.js` defines an applicability-aware 80-ish field technical coverage standard for research planning.
- `scripts/ducati-monster937-coverage-expansion-report.js` and related reports are bounded historical/profile audits.
- Production UI coverage is deterministic for a loaded profile through the fixed 95/14 matrix, but there is no generic catalogue-wide report that computes production Core coverage and emits a prioritized research queue for every catalogue target.

Thus the repository can identify high-value missing fields for a known research target, but not yet for the whole catalogue without a new bridge.

## 7. Research Factory capability matrix

| Stage | Status | Evidence and boundary |
|---|---|---|
| Target identity | IMPLEMENTED / PARTIAL | `research/factory/adapters.js`, `identity-mapping.js`, `applicability.js`; typed targets are fail-closed, but catalogue applicability dimensions still need explicit evidence. |
| Orchestration | FOUNDATION-ONLY | `orchestrator.js`, `events.js`, `reducer.js`, `checkpoint.js`; deterministic event/checkpoint mechanics exist, not a mass production coordinator. |
| Execution planning | IMPLEMENTED for bounded batches | `execution-planner.js`, planner contracts and priority policy build bounded work items from supplied targets/prospects/gaps. |
| Source acquisition | PARTIAL / MANUAL | `source-acquisition-adapters.js` has synthetic and explicitly requested HTTP acquisition; official source discovery/authentication is supplied manually. |
| Source adapters | IMPLEMENTED for bounded adapter classes | HTTP, local/synthetic and derived-content adapters exist; they do not discover applicable publications. |
| Execution agent | IMPLEMENTED for bounded work | `execution-agent.js` validates attempts, retry classes, identity and event transitions. |
| Extraction | PARTIAL | `extraction-agent.js`, extraction contracts/playbooks and declarative rules exist; source/model-specific rule construction and applicability remain manual. |
| Extraction candidates | IMPLEMENTED | Raw candidate/review queue contracts preserve source location, applicability and immutable lineage. |
| Review Queue | IMPLEMENTED | `review-queue.js` deterministically constructs queues; deciding what enters the queue at catalogue scale remains external/manual. |
| Human review | IMPLEMENTED / MANUAL | `review-decisions.js` requires explicit reviewer decisions and does not create evidence or production state. |
| Evidence processing | IMPLEMENTED / MANUAL | `evidence-processing.js` projects accepted review records into pre-promotion states; no automatic acceptance. |
| Conflict handling | IMPLEMENTED / FAIL-CLOSED | Candidate/evidence/readiness contracts preserve disagreements and block unsafe advancement; no bulk conflict resolution. |
| Promotion readiness | IMPLEMENTED / MANUAL | `promotion-readiness.js` evaluates identity, source, applicability and conflict gates. |
| Promotion review | IMPLEMENTED / MANUAL | Promotion packets and decisions are explicit and separate from research review. |
| Schema conversion | IMPLEMENTED | `schema-conversion.js` creates read-only production projections with exact mappings. |
| Production authorization | IMPLEMENTED / MANUAL | `production-promotion-authorization.js` and materialization authorization require explicit lineage and human authorization. |
| Materialization requirements | IMPLEMENTED | Generic four-requirement gate validates typed references and preserves pending/ready semantics. |
| Document/citation/profile/registry materializers | IMPLEMENTED individually | ADR-040–044 executors provide typed validation, deterministic IDs, CREATE/REUSE and conflict safety. They are not a batch cascade. |
| Batch production orchestration | NOT IMPLEMENTED | No generic coordinator schedules many independently authorized motorcycles through human gates and partial production outcomes. |

## 8. Existing automation and batch capability

Reusable machinery includes `research/factory/orchestrator.js`, `execution-planner.js`, event reduction/checkpoints, `research/lib/batch-research-pipeline.js`, Honda/Yamaha/Harley batch artifacts and deterministic report scripts. The existing bounded examples include `research/data/honda-batch-wave2.js`, `high-value-source-acquisition-pilot.js`, `yamaha-transfer-acquisition-batch-results.js` and `technical-research-factory-tenere-batch-pilot.js`.

These are bounded plans, fixtures or source-acquisition batches, not a generic end-to-end bulk materializer. CBR500R required hand-authored target/source lineage, explicit reports, human approvals, typed references and one executor invocation per boundary. At 10/25/100 motorcycles, the bottlenecks are source authentication, applicability review, human decisions, per-target report construction and coordinating partial failures—not deterministic ID generation or individual CREATE/REUSE semantics.

## 9. Container, entry and registry scaling

ADR-042, ADR-043 and ADR-044 are generic at the operation level. They can safely create/reuse one compatible profile entry, one profile container or one registry descriptor and reject conflicts. They do not provide:

- automatic profile creation for an entire batch;
- a transaction spanning container, many entries and registry insertion;
- resumable batch-level recovery with per-target state aggregation;
- a queue of human authorizations for independent motorcycles;
- automatic rollback/compensation across already completed motorcycles.

The safe scale model is therefore one independently authorized target at a time under an eventual coordinator, not “all requirements ready → write everything”.

## 10. Source discovery capability

Source prospects and readiness are represented in `research/data/source-prospect-authentication-quality-reassessment.js`, `source-acquisition-status.js` and the source reports. Tier A/B classifications, official hosts, access blocks, exhaustion, prior attempts and applicability blockers are preserved. `research/factory/source-acquisition-adapters.js` can acquire an explicitly supplied public HTTP source and returns bounded outcomes; it is not a discovery engine.

For an untouched catalogue motorcycle RevLog cannot currently discover, authenticate and select an exactly applicable source automatically. The missing boundary is a source-discovery/prospect-registration stage that resolves authority, publication identity, official route, market/year/model/ABS/transmission/equipment scope and access budget before acquisition.

## 11. CBR500R E2E lessons

Reusable generic stages were target validation, bounded acquisition/extraction, queue/review/evidence separation, applicability verification, promotion readiness/review, schema conversion, production authorization, typed materialization references and idempotent materializers. CBR-specific glue consisted of hand-authored source-route and manual lineage records, exact Honda document/citation/profile data, concrete reevaluation reports, human authorization and the final runtime registration integration.

The repeated steps that will bottleneck a population are exact source identity and applicability proof, manual human gates, separate report artifacts for every boundary, profile-container existence, production-store integration, and test/runtime updates for each new registry descriptor. CBR500R also exposed that canonical production metadata must be adapted to existing validator representations without weakening validators.

## 12. Evidence-backed mass-scale gap map

| Capability | Current implementation | Exact blocker | Main files | Priority |
|---|---|---|---|---|
| Catalogue → applicability-aware coverage inventory | Structural catalogue plus target-level research auditors | No unified per-target production/Core inventory with explicit unknown dimensions | `data/motorcycle-catalog.js`, `js/research/research-coverage-auditor.js`, `js/technical/technical-profile-core-matrix.js` | 1 |
| Coverage inventory → deterministic research queue | `gap-plan.js` and planner accept supplied plans | No generic bridge selecting queue items from catalogue/profile/source readiness | `research/factory/gap-plan.js`, `execution-planner.js` | 1 |
| Source discovery/prospect registration | Prospect records and explicit adapters | No automatic official-route discovery/authentication/applicability resolver | `source-prospect-authentication-quality-reassessment.js`, `source-acquisition-adapters.js` | 1 |
| Declarative multi-source extraction | Generic agents/playbooks and bounded rules | Rule authoring remains source/model specific; no safe universal parser | `extraction-agent.js`, `extraction-playbook.js`, `declarative-text-extraction.js` | 2 |
| Human-review workload routing | Queue/decision contracts | No batch review UI/assignment/throughput accounting | `review-queue.js`, `review-decisions.js` | 2 |
| Batch production coordinator | Individual materializers | No coordinator for independent auth, partial failure, recovery and final state | ADR-040–044 materializers | 2 |
| Catalogue/runtime test scaling | Registry/loader tests and deterministic reports | Hard-coded profile counts/IDs and reports require deliberate updates per registry addition | `tests/*registry*`, `tests/project-state-audit.test.js`, runtime loaders | 3 |
| Coverage/effort metrics | Pilot reports contain useful bounded metrics | No normalized cross-target operational ledger for effort/failure/recovery | `high-value-source-acquisition-pilot.js`, `post-pilot-scaling-reassessment.js` | 3 |

## 13. Minimum safe path to an approximately-10-motorcycle pilot

1. Build a read-only, deterministic Catalogue → Technical Profile/Core coverage inventory. It must preserve unknown market/ABS/transmission/equipment rather than guessing.
2. Join that inventory to existing source-prospect records and classify candidates as source-ready, blocked, exhausted or unresolved.
3. Emit a deterministic research queue without acquisition, evidence or production side effects.
4. Measure the queue on a small, already source-authenticated selection; do not select new motorcycles in this audit.
5. Add bounded batch orchestration only after the queue and human-workload metrics are stable: checkpointed per-target state, explicit pause/resume, retry budgets, failure isolation and deterministic reports.
6. Continue to use existing human/evidence/promotion/materialization gates per motorcycle; do not build a cascade that bypasses them.

Pilot readiness today: **not ready for automatic end-to-end production processing**. The repository is ready for a read-only coverage/queue bridge and a controlled source-ready planning pilot. Existing pilot artifacts provide metrics such as documents inspected, yielding documents, evidence rows, verified/practical gain, conflicts and source-budget outcomes, but do not constitute a generic 10-bike production pipeline.

## 14. What should be reused, not rebuilt

- Stable catalogue keys, registry lookup and loader integrity.
- Typed Research Factory contracts, deterministic IDs, event reduction and checkpoints.
- Existing source-prospect readiness/exhaustion classifications and bounded HTTP acquisition adapter.
- Review Queue, human-review, evidence-processing, promotion and schema-conversion boundaries.
- ADR-040–044 authorization/materialization executors and their CREATE/REUSE/conflict semantics.
- Fixed 95-field/14-domain Rider Service Core presentation matrix.

Do not create another generic materialization layer, another profile registry, another field taxonomy, or a second production coverage matrix merely to support mass scale.

## 15. Recommended NEXT bounded wave

Implement a **read-only Catalogue → applicability-aware Technical Coverage Inventory → deterministic Research Queue projection**. It should consume existing catalogue, production registry, Core matrix, research coverage and source-prospect contracts; preserve unknown applicability; create no source, evidence, review, production or registry state; and produce a deterministic report suitable for measuring a future approximately-10-motorcycle planning pilot.

## 16. Audit boundary

No motorcycle was researched, no production data was changed, no runtime behavior was changed, no Supabase/deployment state was touched, and no push was performed. This document records current repository capability and gaps; it does not authorize the recommended NEXT.
