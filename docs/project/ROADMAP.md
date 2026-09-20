# Master roadmap

Current bounded production state: the CBR500R Technical Profile container now
contains the one authorized verified `lubrication.engine-oil.specification`
entry and is registered exactly once under
`honda.cbr500r.pc70.2024`. The registry insertion used ADR-044 with
`CREATED → REUSED` idempotence; document, citation, profile contents, VFR,
Ducati and Rider Service Core data were preserved. The browser/runtime loads
the CBR500R document and profile through the existing VFR/Ducati registration
mechanism. Canonical `CA` region and typed entry applicability metadata pass
the existing validator/loader; no validator exception was added. No further
wave is being executed here.

The first trusted web-to-raw three-Honda package was executed within budget
after the custody fixes. It retained zero candidates because fiche authority
and exact official-route applicability were not proven; future work must first
establish an authenticated, exactly applicable source route. CBR500R source-
route authentication now establishes one permitted Honda owner-manual route
for oil specification and conditional loaded pressures; parts and chain routes
remain partial. The bounded manual execution produced one raw oil candidate
and stopped loaded pressure without an explicit condition. The three-Honda
package and authenticated CBR500R continuation are complete; the generic
schema-conversion, promotion-review, applicability, production-authorization
and four-requirement materialization gates are complete for this bounded
lineage. The new generic production-materialization authorization boundary
keeps the fully ready CBR500R requirement set pending until an explicit human
decision. The generic production-document materializer foundation is now
implemented and synthetic-tested. The exact CBR500R Honda owner-manual
document was then materialized as the first production artifact. A generic
production-citation materializer foundation is now implemented and synthetic-
tested, preserving typed citation/document/location/provenance references and
CREATE/REUSE/conflict semantics; no real CBR500R citation was materialized in
that foundation wave. The exact CBR500R production citation was then created
through the generic executor with a deterministic repeat returning REUSED;
Technical Profile and registry boundaries remain separate. The generic
Technical Profile entry materializer foundation is now implemented and
synthetic-tested with existing-profile-container, CREATE/REUSE and
conflict-safe semantics; no real CBR500R entry was materialized in that
foundation wave. The next bounded step is only the CBR500R Technical Profile
entry materialization through that executor. Repository inspection then found
no CBR500R production profile container and no generic container lifecycle, so
the current bounded foundation adds only a synthetic-tested,
non-registry-cascading container boundary; no CBR500R profile or entry was
created. The next bounded step is the exact CBR500R profile-container
prerequisite, followed later by entry materialization.
Only one major phase is active at a time. Partial research is normal and
must not block unrelated catalogue work.

## Phase 1 — Foundation and identity (COMPLETE)

Objective: establish catalogue identity, year boundaries, resolver, clarification and safe persistence contracts. Entry: empty/legacy identity ambiguity. Tasks: catalogue normalization, stable keys, migration safety, ABS tri-state. Exit: deterministic catalogue and regression suite. Status: COMPLETE.

## Phase 2 — Technical Profile runtime (COMPLETE)

Objective: serve validated production technical data safely. Entry: stable catalogue keys. Tasks: registry, loader, resolver, search, UI, browser store and VFR reference profile. Exit: production profile/runtime tests pass. Status: COMPLETE for the implemented VFR reference path; broad profile coverage remains future work.

## Phase 3 — Manufacturer catalogue expansion (COMPLETE)

Objective: broaden production catalogue identities. Entry: identity foundation. Tasks: Honda, Yamaha, Suzuki, Kawasaki, BMW, Ducati and Triumph waves. Exit: deterministic counts and immutability regressions. Status: COMPLETE for audited scopes; not a worldwide-completeness claim.

## Phase 3A — Global catalogue gap / coverage audit (FOUNDATION COMPLETE; DISCOVERY PILOT COMPLETE)

Objective: establish an evidence-backed inventory of missing catalogue content before further expansion. Entry: current catalogue inventory and identity rules. The 2026-09-19 audit confirmed structural counts and existing gap/report machinery. The read-only deterministic Catalogue → applicability-aware Coverage Inventory → Research Queue projection is implemented, the generic `SourceDiscoveryProspect/v1` boundary preserves unresolved source identity/applicability, and the exact ten-target source-discovery and blocker-resolution pilots are complete. One BMW candidate now has an `EXECUTION-READY` projection; no source was acquired. Status: blocker-resolution pilot complete; the next bounded step is separately authorizing acquisition for the BMW projection. No global completeness percentage is claimed.

## Phase 4 — Research evidence foundations (COMPLETE)

Objective: separate research from production and establish provenance/status semantics. Entry: production runtime stable. Tasks: canonical 183-field schema, Service Core, acquisition states, Honda/VFR audits. Exit: evidence cannot auto-promote and missing data remains explicit. Status: COMPLETE.

## Phase 5 — Scalable batch research (COMPLETE FOR AUDITED SCOPE)

Objective: increase verified practical Service Core coverage through a resumable, deterministic research factory. Entry: working generic validators, Service Core, deduplication, conflict/coverage/yield reporting and Honda/Yamaha fixtures. Completed checkpoints: Honda produced +50 verified/+48 practical slots; Yamaha +58/+54; Harley stopped at a wrong-year/access gate; all bounded factory foundations, Ducati/BMW waves and blocked/exhausted prospect reassessment are complete for the audited scope. Ducati and BMW remain isolated pre-promotion research state, with no research evidence or Service Core change; Phase 6 now owns the separately controlled production promotion path. Status: COMPLETE FOR AUDITED SCOPE.
Identity-mapping infrastructure is now available for bounded FZ1 research; the FZ1 planning wave authenticated one narrowly scoped owner-manual route and retained the service-manual code as a partial-authentication lead. The bounded `2D1X` acquisition wave acquired one official PDF and preserved its hash/provenance. The bounded extraction plan fixes six structural regions, explicit applicability/provenance gates and a 24-candidate ceiling. The generic extraction playbook and PDF trust boundary then drove one real raw-only pilot, yielding 14 deterministic candidates without review/evidence/promotion. A static scaling audit found significant source/model-specific parsing remains, so the field-oriented multi-source policy now defines the smallest path toward declarative field rules while keeping PDF as a deep-path medium. The field-policy/source-authority contract foundation is executable and synthetic-only; the existing-fleet reassessment selected a bounded three-Honda fast-path package, with no research executed in that planning wave. A generic bounded HTTP(S) acquisition adapter now provides the parent artifact foundation for explicitly supplied HTML/structured-web sources, `application/pdf` is supported for the same explicit acquisition boundary, and the async execution path requires explicit network availability. The BMW C 600 Sport MY2012 official PDF acquisition and parent-bound raw extraction are complete: 24 candidates were produced without review/evidence/promotion, while unsupported cooling, periodic-service and chain-size fields remain blocked. The next bounded research step is human review of only these BMW candidates.

## Phase 6 — Controlled production promotion (COMPLETE)

Objective: promote only reviewed, conflict-free, applicability-scoped candidates. Entry: batch evidence with source proof and review decisions. Completed: one deliberate Ducati production profile addition, registry/loader/resolver/runtime regressions, and an immutable deterministic rollback target with governance closeout. Future bounded profile expansions are optional follow-on work, not Phase 6 exit requirements. Exit: one deliberate production profile addition with regressions and a deterministic rollback target. Status: COMPLETE.

## Phase 7 — Cloud/deployment hardening (ACTIVE)

Throughput v2 Waves A-F are complete for the audited scope. Wave F found one
legitimate compound/conditional pressure human boundary and five fixture-only
negative/boundary cases; no safe deterministic candidate was established.
Next planning, if authorized, is upstream-input hygiene and duplicate handling
before any rule extension.

Throughput v2 Wave G now hardens input hygiene and composes autonomous
record-local batch continuation. Hostile and legitimate metrics remain
separate; no production boundary is crossed. The remaining pressure semantic
boundary is preserved.

Wave H validated the same architecture over 32 legitimate BMW/Ducati/Honda
records: 6 GREEN, 1 YELLOW and 25 RED capability gaps, with complete
record-local accounting and no production mutation. The next decision is a
bounded capability extension only for repeated, explicitly supported field
classes.

Wave I completed that bounded decision and implemented only the repeated,
lossless `electrical.battery-capacity` explicit-Ah scalar capability. The
exact 32-record rerun is 8 GREEN, 1 YELLOW and 23 RED; the pressure human
boundary and all other unsupported classes remain unchanged. NEXT is a fresh
evidence-backed analysis of another repeated capability class, if separately
authorized; no further capability is selected by default.

Wave J re-verified those 23 remaining RED capability gaps and analyzed six
repeated plus seven singleton semantic classes. None supports a second
generic deterministic capability without a new lossless contract or semantic
interpretation, so Wave J is decision-only and the exact routing remains
8 GREEN, 1 YELLOW and 23 RED. The pressure boundary remains human-owned.
NEXT is a separately authorized class-specific contract proposal only where
new evidence establishes safety.

Wave K completed the bounded prioritization analysis for the exact 23
remaining unsupported records. Six repeated and seven singleton classes were
reviewed with provenance, applicability, conditions and raw semantics
preserved. No class supports a narrow lossless contract proposal under the
existing contracts without semantic invention, so Wave K selects NONE and
adds no rule or routing change. The exact routing remains 8 GREEN, 1 YELLOW
and 23 RED; the pressure boundary, Wave I battery capability, Wave G hostile
3/2/4 and historical reports remain unchanged. NEXT requires new evidence or
an existing formal lossless contract prerequisite; no contract-design wave is
authorized by Wave K.

Research on Demand Wave 2 is COMPLETE for the repository-only durable
boundary. Wave 1 identity is reused unchanged; durable demand/status and
append-safe reusable knowledge have unique canonical demand/content keys,
lineage preservation, local atomic-equivalent claim/reuse proof, fail-closed
unknown context and no browser/client write policy. No live database mutation,
app integration, external provider, acquisition or production promotion was
performed. NEXT is Research on Demand — Wave 3: bridge active motorcycle
canonical context to reusable lookup and missing-field demand plus the
existing Factory using deterministic/local fixtures.

Research on Demand Wave 3 is COMPLETE for the repository-only bridge. The
active motorcycle now maps through existing catalogue/context semantics to a
canonical demand context; reusable knowledge is checked first; missing Core
fields alone claim one durable demand; and new work traverses the existing
Factory lifecycle with a synthetic local adapter. Projection recomputation
exposes accepted-pre-evidence reusable values while blocked, awaiting-review,
incompatible and unknown-context states remain explicit. No external
acquisition, live persistence, browser write, production mutation or routing
change occurred. Wave 4 is COMPLETE as a decision-only architecture audit.
Repository evidence selects dependency order A → B → C: trusted live
persistence/execution boundary, then real provider authorization, then
application/UI integration. NEXT is one bounded trusted live-persistence
boundary wave owning atomic canonical claim/deduplication, Factory handoff,
lifecycle/checkpoints and provenance/lineage persistence. No provider, UI or
live migration is authorized by this audit; do not execute NEXT automatically.

Research on Demand Wave 5 is COMPLETE for the trusted boundary foundation.
The repository-native server service `server/research-on-demand-boundary.js`
uses repository-controlled Supabase RPC contracts for storage-enforced demand
claim uniqueness, authoritative status lookup/transitions and append-safe
knowledge writes. Browser-supplied identity, status, provenance and lifecycle
metadata are rejected; only newly created claims are eligible for the existing
Factory handoff. Deterministic local tests prove concurrent-equivalent reuse,
durable in-progress joining, explicit failure/review states, synthetic
provenance/lineage preservation and conflict safety. No function was deployed,
live migration applied, provider called, UI changed or production data
mutated. NEXT is Research on Demand — Wave 6: separately authorize trusted
boundary deployment and non-production live-persistence/RPC verification; do
not execute it automatically.

Research on Demand Wave 6 is COMPLETE for controlled non-production live
persistence verification. Against Supabase project `vfr-master`
(`espwnhiwflsklkphxitb`), the repository Wave 2 and Wave 5 migrations were
applied in order and no unrelated migrations were applied. Live research
tables retain fail-closed RLS with no anon/authenticated policies; trusted
RPC execution is service-role-only. Concurrent synthetic claims proved one
durable `CREATED` demand plus one `REUSED` result, fresh reread proved
durability, status transition and reusable-knowledge read-back preserved
canonical identity/digest/raw/applicability/conditions/provenance/lineage,
and identical/conflicting content proved `REUSED`/`CONFLICT` semantics. Exact
synthetic rows were removed and post-cleanup counts are zero. No provider,
UI, production or user data changed. Wave 7 is now COMPLETE for the durable
execution substrate; do not interpret it as an automatic worker deployment.

Research on Demand Wave 7 is COMPLETE as a trusted asynchronous Factory
execution foundation. `research_execution_jobs` is storage-enforced at one
row per canonical demand, with service-role-only RPCs for atomic claim,
unexpired lease ownership, expiry/reclaim, durable checkpoint and bounded
finish/retry classification. `server/research-on-demand-execution.js` is a
thin trusted adapter to the existing Factory and Wave 5 knowledge boundary;
local and live synthetic proofs preserve Factory checkpoint identity,
provenance and lineage. The migration was applied only to the configured
non-production project `vfr-master` (`espwnhiwflsklkphxitb`), exact synthetic
rows were cleaned, and no provider, UI, production or user data changed.
The repository still has no deployed or scheduled worker invocation, so the
exact NEXT is one bounded trusted worker invocation/deployment wave. Provider
and UI integration remain deferred until that gap is closed.

Objective: verify auth, persistence, RLS, deployment and operational error handling. Entry: selected test backend and deployment environment. Completed: repository-controlled ownership/RLS baseline applied and verified live; repository-side password recovery flow implemented with fail-closed callback handling; general production user journey was operator-smoke-tested; post-repair production password-recovery smoke test passed with legitimate callback, new-password login, old-password rejection and marker-only fail-closed behavior; deployment/recovery hardening now requires an explicit production callback URL, binds recovery UI to a Supabase recovery event/session identity, and documents the operator boundary; permanent owner-first Rider Service Core and Source Trust Model governance recorded; repository clean-baseline migration foundation added, normalized to valid ordered identifiers, and replayed twice successfully in local PostgreSQL 17. The Dashboard allow-list remains an external configuration boundary, and browser-console inspection was not part of the smoke test. The original recovery startup race was repaired in `a5e1639`; final live password-recovery verification is CLOSED with operator verdict `ACCEPT`. Leaked-password protection is externally blocked because project `vfr-master` is on the Free plan and Supabase makes the setting available only on Pro plan and above. The three-Honda fast-path package, authenticated CBR500R continuation, Review Queue construction, Human Review, Evidence Processing and read-only promotion-readiness evaluation are complete. BMW C 600 Sport MY2012 now has 24 generic pending packets, 24 explicit `APPROVED-FOR-CONVERSION` human promotion-review decisions and 24 generic `CONVERSION-READY` lossless raw-text schema-conversion projections; numeric/unit conversion, compound decomposition and production materialization remain separate future stages. Technical Research Factory Maximum Automation / Throughput v2 design and Waves A-E are complete for the audited scope. Wave E measured a bounded 9-record BMW automatic pipeline at 3 GREEN, 2 YELLOW and 4 RED, with 3 existing authorization reuses and zero new authorization; this is a fixture measurement, not a historical improvement claim. Separately authorized migration-history reconciliation and future lawful source-link presentation and Garage/Service maintenance-due integration remain deferred. Exit: evidence-backed release readiness. Status: ACTIVE.
