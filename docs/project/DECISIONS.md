# Architectural decisions

## ADR-023 — Rider Service Core and Source Trust Model

Date: 2026-09-03
Decision: RevLog is owner-first: Rider Service Core is the permanent priority
and coverage layer over the broader Technical Profile taxonomy. An exact-
applicable official manufacturer publication is authoritative within scope.
A separately hosted copy of the same publication can verify document identity,
but cannot count as an independent technical claim; a genuinely separate
authoritative publication is an optional technical cross-check where available.
The zero-inference rule remains mandatory.
Consequences: coverage reports distinguish Core support, missing data,
applicability/conflict blockers and secondary fields. A future “Instrukcja
źródłowa” presentation may expose a lawful publication link without copying
manuals or exposing internal source IDs as the user experience. Existing
technical data and profiles remain unchanged.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

## ADR-027 — Rider Service Core is a fixed presentation matrix

Date: 2026-09-03
Decision: The default Rider Service Core UI renders one closed,
manufacturer-neutral presentation matrix from
`js/technical/technical-profile-core-matrix.js`.
Every supported motorcycle has the same 14 domains, 95 field IDs and stable
ordering. Verified applicable data fills a cell; missing data is rendered as
`Brak danych`, while explicit non-applicability requires evidence. Additional
canonical Technical Profile entries remain stored but cannot create Core rows.
Consequences: coverage has one shared denominator and research fills missing
cells without profile-specific visibility rules or inference. Existing canonical
profiles and values remain unchanged.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

## ADR-026 — Default Technical Profile visibility is Rider Service Core first

Date: 2026-09-03
Decision: Evidence-supported data remains canonical even when it is not
appropriate for the default user-facing Technical Profile UI. The default
view exposes practical Rider Service Core data and hides extended
engineering/workshop/diagnostic reference data using stable canonical entry
identity or semantic metadata. Polish labels and rendered prose are never
used as the classifier.
Consequences: production profiles remain lossless and unchanged, while the
default UI stays useful for ownership and service planning. Search uses the
same visibility boundary; a future optional extended view would be separate.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

## ADR-024 — Rider Service Core matrix aligns shared factory contracts

Date: 2026-09-03
Decision: The Technical Research Factory Evidence Processing field contract
derives from one manufacturer-neutral 14-domain Rider Service Core matrix
while retaining the legacy supported field set. Matrix metadata identifies
structured/repeating representations and association keys for maintenance,
fuses, lighting and other naturally repeating owner-service facts; it does not
normalize values or imply review, evidence or production readiness.
Consequences: legitimate Core candidates can be processed consistently across
manufacturers without Ducati-specific shortcuts, while legacy research meaning
and production boundaries remain unchanged. Missing, conflicting or
inapplicable values still fail closed at their existing stages.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

## ADR-025 — Rider Service Core production representation is additive and structured

Date: 2026-09-03
Decision: Production-compatible Rider Service Core data uses one generic
`revlog-rider-service-core-record/v1` envelope. Scalar facts retain the
existing raw value/unit shape; maintenance, fuses, lighting, practical
torques, consumable references and tire-pressure variants use structured or
repeating records with shared applicability and provenance. The representation
layer never promotes records or changes Technical Profiles.
Consequences: naturally repeating owner-service facts remain machine-readable
and traceable without manufacturer-specific schemas or lossy prose flattening.
Unknowns remain unknown, and a representable record still requires the normal
review, evidence, readiness and promotion gates before production use.
Status: ACTIVE. Related design: `docs/project/RIDER_SERVICE_CORE.md`.

## ADR-001 — Stable catalogue identity is the join key

Date: 2026-08-30 (recovered from history)
Decision: catalogue variant keys and explicit year ranges identify motorcycles; textual names are not heuristic identity.
Rationale: migration, resolver, profile and search tests enforce explicit identity.
Consequences: aliases and legacy records require deterministic mapping; unknown context remains unresolved.
Status: ACTIVE. Related commits: catalogue waves and migration work in `origin/main..HEAD`.

## ADR-002 — Missing data stays unknown

Decision: missing technical/research values remain null or explicit not-researched; they are never guessed, zero-filled, or copied from similar models.
Rationale: research validators and applicability tests enforce this.
Consequences: partial coverage is valid and review queues remain honest.
Status: ACTIVE. Related commits: `60692a7`, `a69191f`, `fe2df11`.

## ADR-003 — Production and research are isolated

Decision: `research/` datasets are non-production and require deliberate promotion.
Rationale: runtime-boundary tests prove production does not import research.
Consequences: research can remain incomplete without changing user behavior.
Status: ACTIVE. Related commits: `1db7d6d`, `fe2df11`.

## ADR-004 — Technical Profiles resolve through registry and context

Decision: profile discovery, loading, applicability, clarification and search are resolver/registry responsibilities.
Rationale: VFR runtime and browser tests exercise this path.
Consequences: profiles must declare catalogue/year/context applicability.
Status: ACTIVE.

## ADR-005 — ABS and other applicability dimensions are tri-state

Decision: true, false and null remain distinct; unknown is not common applicability.
Rationale: resolver and clarification tests explicitly preserve false and unknown.
Consequences: ambiguous context is surfaced instead of guessed.
Status: ACTIVE.

## ADR-006 — Evidence requires source proof, not metadata

Decision: only verified proof statuses count; metadata-only, partial-content, uncertain identity and fingerprint-only material do not.
Rationale: VFR audits and evidence tests enforce page/source/applicability provenance.
Consequences: source recovery may leave fields blocked.
Status: ACTIVE. Related commits: `a60cf26`, `edac48a`, `7f8d406`.

## ADR-007 — Service Core is one shared subset

Decision: all research targets use the canonical 44-field Service Core.
Rationale: Honda reporting and batch tests enforce one deterministic list.
Consequences: partial coverage is comparable across manufacturers.
Status: ACTIVE. Related commits: `1db7d6d`, `a69191f`.

## ADR-008 — Batch research reuses documents and preserves applicability

Decision: source identity is independent of hosting URL; one document may support multiple explicitly covered targets, while extraction candidates remain separate from evidence.
Rationale: generic pipeline tests prove mirror deduplication, reuse, normalization, conflicts and review queues.
Consequences: batch work prioritizes high-leverage sources without inflating corroboration.
Status: ACTIVE. Related commit: `fe2df11`.

## ADR-010 — Practical-service yield gates research scaling

Date: 2026-08-30
Decision: the next research pilot is bounded to five existing targets and must produce at least 10 practical Service Core fields and 15 verified target slots; generic specification rows alone cannot qualify.
Rationale: Honda Batch Wave 2 achieved six verified rows across 528 slots with zero practical-service gain.
Consequences: owner/service sources take priority, and multi-manufacturer scaling waits for measured practical yield.
Status: ACTIVE. Related audit and design task.

## ADR-009 — Independent Audit Gate precedes roadmap advancement

Date: 2026-08-30
Decision: meaningful work must be independently audited for falsification before memory is updated or the roadmap advances.
Rationale: the Honda batch audit showed that passing tests and a 100% row-yield metric can coexist with zero practical-service gain.
Consequences: expectation changes require semantic justification; batch reports distinguish row yield from target-slot and practical-field gain.
Status: ACTIVE. Related commit: `45f43ae` and this audit.

## ADR-011 — Known practical source yield gates acquisition selection

Date: 2026-08-31
Decision: acquisition batches rank practical Service Core yield per authenticated Tier A/B document, not raw gap or evidence-row volume. A candidate whose exact-target Tier A/B prospect or document richness is repository-unknown remains unranked and cannot enter a bounded acquisition batch merely for manufacturer diversity.
Rationale: the five-target pilot produced 48 practical slots from two rich owner manuals while three equally deliberate low-coverage targets yielded zero because of exhausted research or unresolved identity/applicability.
Consequences: scoring must expose unknowns, penalize duplicate history and applicability risk, and narrowly scope document editions. Manufacturer transfer is tested incrementally; Tier C/D discovery cannot satisfy practical success.
Status: ACTIVE. Related design: post-pilot scaling reassessment.

## ADR-012 — Execution readiness precedes source-yield ranking

Date: 2026-09-01
Decision: a registered Tier A/B prospect enters acquisition ranking only after exact source identity, official delivery path, model/year/market scope, feasible accessibility and safety-relevant applicability pass a deterministic readiness gate. UNKNOWN, partial, blocked, exhausted and mismatch states cannot be overridden by expected yield.
Rationale: official Harley-Davidson publication `94001064` was genuine and RH1250S-related but reauthenticated as MY2023 rather than the selected MY2022 and returned HTTP 403, producing zero evidence.
Consequences: source authentication metadata tasks may precede acquisition; authenticity, applicability, accessibility and marginal yield remain separate; scoring operates only on execution-ready prospects.
Status: ACTIVE. Related reassessment: source-prospect authentication quality.

## ADR-013 — Technical research uses a deterministic generic core with optional discovery adapters

Date: 2026-09-01
Decision: catalogue research targets, source prospects, applicability, gaps, budgets, state transitions, readiness gates, conflicts, checkpoints and review items belong to one manufacturer-neutral, versioned research-factory core. Manufacturer adapters may supply publication-code parsing, endpoint templates and discovery hints, but may not declare applicability, readiness or evidence. External research agents return typed findings; deterministic repository logic applies gates and transitions. Research-to-production promotion remains an explicit human task.
Rationale: existing validators, Service Core, document deduplication, coverage/yield and reports are reusable, while recent Harley and Yamaha work shows that handcrafted prospect shapes and prompt-level orchestration permit mismatches and repeated authentication loops.
Consequences: Foundation must adapt current data shapes without rewriting evidence; later orchestration can resume from stable IDs and event records; adapters are introduced only from measured manufacturer needs; Ténéré becomes a factory-pilot candidate rather than another handcrafted task.
Status: ACTIVE. Related design: Technical Research Factory architecture.

## ADR-014 — Research orchestration is an append-only deterministic state machine

Date: 2026-09-01
Decision: non-production research batches use semantic SHA-256 identities, immutable JSON events, pure replay-derived snapshots, one active attempt per source item, explicit finite attempt budgets and version/digest-verified checkpoints. Foundation #1 readiness is authoritative; orchestration cannot promote a blocked, partial, unknown, exhausted or mismatched source.
Rationale: stable replay and fail-closed resume are prerequisites for interrupted batches, while clock/UUID identity, mutable snapshots or implicit retries would permit duplicate work and budget bypass.
Consequences: event persistence remains caller-owned in this foundation; planners must emit canonical target/prospect references; reset/reopen, concurrency, distributed workers and external-result ingestion require later bounded decisions.
Status: ACTIVE. Related design: Technical Research Factory Orchestrator Foundation.

## ADR-015 — Execution planning requires explicit gap capability and canonical readiness

Date: 2026-09-01
Decision: a source can enter a research execution plan only when Foundation readiness passes and an explicit versioned SourceCapability intersects unresolved canonical GapPlan fields. Planner priority and all finite work/attempt bounds live in a semantically hashed PlanningPolicy; output uses existing Orchestrator contracts.
Rationale: source existence or presumed document richness is not proof of usefulness, and a planner that infers capabilities or owns a parallel work schema could promote blocked sources, chase vanity source counts or drift from replay semantics.
Consequences: unknown capability defers, no gap intersection is not-needed, exhausted sources defer, mismatch rejects, other failed readiness blocks, and declared capability provenance must be checked by a later typed execution-result layer.
Status: ACTIVE. Related design: Technical Research Factory Execution Planner.

## ADR-016 — Acquisition is pre-evidence and adapter output is untrusted

Date: 2026-09-01
Decision: the execution boundary accepts one bounded SourceWorkItem attempt through an explicitly declared adapter, validates typed outcomes/artifact metadata, and emits only existing Orchestrator events. `ACQUIRED` is not verified evidence and `NO-EVIDENCE` is not automatically researched-no-evidence; credentials and network are never persisted or used by synthetic adapters.
Rationale: acquisition, extraction and review have different trust levels. Keeping the boundary typed and immutable prevents adapter output from forging state, bypassing readiness/budgets, leaking secrets or changing production coverage.
Consequences: future adapters require separate security/provenance review; extraction/review queues remain a later bounded wave. Synthetic/local fixtures are the only executable adapters in this foundation.
Status: ACTIVE. Related design: Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation.

## ADR-017 — Raw extraction is content-bound and remains pre-review

Date: 2026-09-02
Decision: extraction accepts only a canonical successful `ACQUIRED` result plus a matching local content envelope, verifies artifact identity/media/byte length/SHA-256 before adapter invocation, and produces immutable raw candidates with canonical Factory provenance. Raw values, units, locations and explicitly supplied applicability/context are preserved without normalization or inference. Extraction emits no acquisition events and creates neither evidence nor review decisions.
Rationale: acquisition metadata is not document content, and extractor output is untrusted. A content-integrity and provenance boundary prevents parsing the wrong bytes, forged ownership, hidden retry/state changes, premature normalization and accidental production coupling.
Consequences: only deterministic local/synthetic UTF-8 adapters exist in this foundation; PDF/OCR/browser/network parsing, durable extraction persistence, evidence conversion and Review Queue lifecycle require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Extraction Agent / Local Extractor Adapter Foundation.

## ADR-018 — Review Queue is immutable eligibility, not a decision workflow

Date: 2026-09-02
Decision: Review Queue schema 1 creates one immutable `QUEUED` entry per validated raw extraction candidate and records non-reviewable extraction dispositions as typed ineligibility. Entries embed the unchanged candidate and bind it to canonical extraction and acquisition provenance. Queue construction has no mutable transitions, reviewer actions, evidence conversion or persistence.
Rationale: eligibility for future human review is a different trust boundary from extraction and from a human decision. Keeping queue presence pre-decision prevents extraction failures or zero candidates from becoming rejections, evidence absence or accepted facts.
Consequences: exact byte-equivalent duplicates may collapse by semantic entry identity, while identity collisions fail closed and different provenance remains distinct. Human Review Decisions, reviewer identity, normalization, conflict handling, evidence promotion, persistence and lifecycle integration require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Review Queue Foundation.

## ADR-019 — Human review decisions are immutable pre-evidence records

Date: 2026-09-02
Decision: Human Review Decision schema 1 records exactly one internally consistent decision payload per Review Queue entry in a bounded set using `ACCEPT`, `REJECT` or `NEEDS-MORE-REVIEW`. Records retain canonical queue/extraction/acquisition references, explicit opaque reviewer identity and an optional raw comment. They are immutable and create no evidence or workflow transition.
Rationale: a human outcome must be auditable without conflating reviewer intent with evidence verification or production acceptance. Deterministic identities and fail-closed duplicate conflicts prevent silent overwrite while preserving all upstream raw data.
Consequences: `ACCEPT` only permits future evidence processing, `REJECT` is candidate-local, and `NEEDS-MORE-REVIEW` triggers no automation. Authentication, supersession, evidence conversion, normalization, conflict resolution, researched-no-evidence, persistence and production promotion require later bounded work.
Status: ACTIVE. Related design: Technical Research Factory Human Review Decisions Foundation.

## ADR-020 — Evidence processing remains an explicit pre-promotion projection

Date: 2026-09-03
Decision: Evidence Processing schema 1 consumes immutable Human Review Decision records with their validated Review Queue entries and produces explicit `ACCEPTED-FOR-PROCESSING`, `REJECTED-CANDIDATE`, `NEEDS-MORE-REVIEW`, `INELIGIBLE` and `CANNOT-ADVANCE` records. It preserves raw candidates and canonical provenance; it does not create evidence or promote `ACCEPT`.
Rationale: an accepted human candidate still requires a separate, auditable processing boundary before normalization, conflict resolution or production evidence can be considered.
Consequences: rejected and deferred candidates remain non-advancing, missing queue context is typed ineligible, and directly observable accepted disagreements remain unresolved without winner selection. Evidence creation, researched-no-evidence conversion, normalization, promotion, persistence and lifecycle integration remain later layers.
Status: ACTIVE. Related design: Technical Research Factory Evidence-Processing Contract Foundation.

## ADR-021 — Ténéré pilot design preserves blocked readiness and synthetic traversal

Date: 2026-09-03
Decision: The future Ténéré batch pilot is designed for exactly `yamaha.tenere-700.gen1` MY2019 EU standard against prospect `BW3-F8197-E0`, with one source work item and one attempt. Interruption occurs after acquisition completion and before downstream processing; a validated checkpoint and replayed resume must equal uninterrupted state. A clearly separate synthetic/local prospect is the only executable fixture until the real prospect becomes execution-ready.
Rationale: checkpoint/resume behavior can be proven deterministically without weakening readiness or authenticating an external source.
Consequences: the real prospect remains `REGISTERED-NOT-REAUTHENTICATED` and `FACTORY-PILOT-CANDIDATE`; authentication, applicability proof, acquisition, extraction, review and processing remain future gated stages. No real evidence or production state can be produced by this design fixture.
Status: ACTIVE. Related design: Technical Research Factory Ténéré Interrupted/Resumed Batch Pilot Design.

## ADR-022 — Production promotion rollback is registry-exposure-only

Date: 2026-09-03
Decision: every bounded production registry promotion must retain an immutable record of the exact prior and resulting registry sets, promoted profile identity, entry/source graph and a deterministic rollback target. Rollback may remove only the exact promoted profile's registry exposure and restore the prior set; it must not delete production/source artifacts or alter research history, catalogue, evidence or coverage.
Rationale: registry exposure is the smallest reversible production boundary, while profile and provenance artifacts must remain auditable after rollback. A fail-closed record prevents ambiguous rollback scope and protects unrelated registered profiles.
Consequences: promotion governance is not complete without recorded prior/current sets, retained artifacts and regression validation. This Ducati record is readiness-only; no rollback is automatic or executed by the contract.
Status: ACTIVE. Related design: Phase 6 Production Promotion Rollback / Governance Closeout.


## ADR-028 — Research-to-runtime identity mapping contract

Date: 2026-09-07
Decision: Research grouping identities, runtime catalogue identities and
applicability constraints are separate fields in a deterministic,
non-production mapping contract. One grouping may map to one or more runtime
identities, but runtime resolution requires explicit applicable constraints;
unknown or partial discriminators never widen to all mapped variants. The
generic bodyStyles dimension distinguishes body-style variants while
preserving existing applicability dimensions and legacy targets.
Consequences: FZ1 research may use a generation grouping without collapsing
yamaha.fz1.gen2.n and yamaha.fz1.gen2.s, while
yamaha.fz1.gen1 remains isolated to yamaha.fz-fazer.fzs1000. The mapping is
research infrastructure only: it adds no evidence, technical values,
production profiles or Rider Service Core projection. Existing single-runtime
targets remain compatible without a mapping.
Status: ACTIVE. Related implementation: research/factory/identity-mapping.js.

## ADR-029 — Recovery requires explicit destination and authenticated recovery state

Date: 2026-09-08
Decision: Production password-reset requests require an explicit operator-supplied HTTPS callback URL. Only localhost development may derive the current origin/path. The reset UI is enabled only by a Supabase `PASSWORD_RECOVERY` event carrying a session user ID; URL markers alone are never sufficient, and password updates require the current session to match that ID.
Rationale: browser-derived production redirects and arbitrary recovery URL markers can target unintended destinations or expose reset UI without trusted recovery evidence.
Consequences: deployments must inject `window.REVLOG_CONFIG.recoveryRedirectUrl` before `js/supabase.js`; the Dashboard allow-list remains external and must match exactly. Missing or malformed production configuration fails closed. This does not change Supabase plan capabilities or imitate leaked-password protection.
Status: ACTIVE. Related implementation: `js/supabase.js`, `docs/project/DEPLOYMENT_RECOVERY.md`.

## ADR-030 — Raw extraction readiness is distinct from derived-content trust

Date: 2026-09-08
Decision: Technical Research Factory raw extraction uses a stage-specific
readiness gate. A precisely bounded authenticated/acquired source may be
eligible for raw extraction while unresolved applicability remains explicit;
this never implies evidence, promotion or production readiness. Extraction
content derived from a binary acquisition must use a deterministic envelope
bound to the exact parent artifact ID, digest, media type and byte length,
plus transformer identity/version and approved page-region. Detached text and
changed parent or derived content fail closed.
Rationale: the existing full-readiness gate correctly protects downstream
applicability, but it cannot safely express bounded raw inspection; the
existing UTF-8 envelope also could not establish custody of a PDF binary.
Consequences: future bounded PDF extraction may enter only through the
stage-specific gate and parent-bound bridge, with raw-candidate output still
separate from review, evidence and production. Existing UTF-8/local fixtures
and downstream gates remain compatible.
Status: ACTIVE. Related implementation: `research/factory/extraction-playbook.js`, `research/factory/derived-content-contracts.js`, `research/factory/extraction-agent.js`.

## ADR-031 — Field-oriented multi-source research policy

Date: 2026-09-08

Decision: Research planning is field/field-group-first rather than document-first. Source authority is field-dependent: source class, specialist domain, exact applicability, provenance, conflict state and corroboration determine whether a source may support a field. OEM web/support/fiche and bounded domain-specialist sources may use a fast path for permitted low-risk fields; safety, workshop, diagnostic, conflicting or unresolved cases use the existing deep path, including PDF/manual extraction. Discovery-only sources remain leads and do not become authority.

Consequences: future policy configuration can select allowed/preferred source classes, applicability requirements, corroboration and bounded search budgets without weakening the existing acquisition, extraction, review, evidence or production gates. Static FZ1 pilot results remain raw benchmark data; this decision creates no technical data and does not require live web, HTML or batch implementation. A later declarative extraction/policy prototype must remain closed-vocabulary, deterministic, provenance-bound and fail-closed.

Status: ACTIVE. Related design: `docs/project/FIELD_ORIENTED_MULTI_SOURCE_RESEARCH_POLICY.md`.

## ADR-033 — Materialization requirements remain a generic non-production gate

Date: 2026-09-19

Decision: The four future requirements emitted by an
`AUTHORIZATION-READY` `ProductionPromotionAuthorization` are represented by
a generic immutable `MaterializationRequirementsAuthorization/v1` gate before
any production materializer. The gate recognizes document, citation,
Technical Profile entry and registry-insertion requirements; it records
generic required input references, derives per-requirement and aggregate
`READY`/`PENDING`/`BLOCKED` states, and always keeps human authorization and
production materialization separate.

Rationale: The previous CBR500R wave correctly rejected the absence of this
shared boundary rather than inventing a target-specific mechanism. Ducati
downstream materialization reports are compatibility evidence, not a generic
Factory contract and do not define CBR500R production semantics.

Consequences: Unknown, missing, duplicate, malformed or upstream-blocked
requirements fail closed. The new gate preserves upstream lineage,
provenance, target applicability and raw source meaning, creates no
production documents/citations/profile entries/registry records, and does not
execute promotion. A later bounded wave may evaluate the exact CBR500R
authorization through this gate.

Status: ACTIVE. Related implementation: `research/factory/materialization-requirements.js`, `research/factory/materialization-requirements-contracts.js`.

## ADR-032 — Opaque acquired payloads are outside secret-shaped heuristics

Date: 2026-09-08

Decision: The exact `metadata.contentBase64` field on an acquired artifact is
treated as opaque source payload for secret-shaped textual scanning. The same
payload remains subject to Base64, byte-length, SHA-256 and deterministic
artifact identity validation. All control/provenance metadata, URLs and
arbitrary sibling payload fields remain secret-scanned; acquisition does not
retain request credentials.

Rationale: Public source bodies may legitimately contain words such as
`password`, `token` or `api_key`. Scanning their encoded custody payload made
valid HTTP artifacts fail before parent-bound derivation. A path-specific
exception preserves the control-data security boundary without disabling the
scanner globally.

Consequences: Generic public HTML acquisition can pass the artifact contract
when its exact retained body is valid and hash-bound. The same opaque-content
boundary applies to the canonical derived-text payload (`metadata.content` and
the derived artifact `content` field) and its extraction envelope `content`;
their integrity and parent custody remain mandatory. The exemption is not a
source-authority or applicability decision and does not change declarative
extraction, review, evidence or production behavior.

Status: ACTIVE. Related implementation: `research/factory/execution-contracts.js`.

## ADR-034 — Typed non-production materialization input references

Date: 2026-09-19

Decision: Materialization document inputs use separate immutable
`DocumentDefinitionReference/v1` and `SourceProvenanceReference/v1` objects.
The document reference carries validated document/source identity and an
authenticated HTTPS official path; the provenance reference carries the same
source identity plus candidate and source-location lineage. A document and
provenance reference are compatible only when their source, prospect,
document, authority and tier identities match. The generic materialization
gate accepts these typed refs only for the document requirement; citation,
Technical Profile and registry refs remain separate future boundaries.

Rationale: The previous document-input wave correctly rejected arbitrary
strings and the absence of standalone generic contracts. Typed immutable refs
prevent presence tokens from authorizing production readiness while preserving
the existing research provenance chain.

Consequences: IDs are deterministic, malformed/incomplete/mismatched refs
fail closed, refs are explicitly non-production, and `materializationAllowed`
remains false. This foundation does not reevaluate CBR500R or create any
production artifact.

Status: ACTIVE. Related implementation: `research/factory/materialization-input-reference-contracts.js`, `research/factory/materialization-requirements.js`.

## ADR-048 — Durable research demand is canonical and shared, while writes remain trusted-only

Date: 2026-09-20

Decision: Research on Demand Wave 2 persists the existing Wave 1 canonical
demand identity as the durable uniqueness key. Separate demand/status and
reusable-knowledge records preserve applicability, conditions, provenance and
lineage. Reusable knowledge is append-safe: a later contradictory applicable
candidate is retained as an explicit conflict and cannot silently replace a
prior record. Unknown required applicability cannot claim a broader demand.

Security posture: the repository migration enables RLS and creates no
anon/authenticated policy for the shared research tables. Future trusted
Factory/service access requires a separately authorized boundary; no browser
privileged write path is introduced.

Consequences: equivalent users and execution batches share one durable demand,
while request metadata remains lifecycle-only. The migration is repository
schema only and was not applied to a live database. Research remains separate
from production Technical Profiles, evidence and registry materialization.

Status: ACTIVE. Related implementation: `research/factory/reusable-knowledge-persistence.js`, `supabase/migrations/20260920102352_research_on_demand_wave2_durable_reuse.sql`.

## ADR-047 — Reusable demand identity is canonical and user-independent

Date: 2026-09-20

Decision: Non-production reusable research demand identity is derived from the
canonical catalogue variant, explicit applicability/context, canonical field
and operation, conditions, and the explicitly required applicability
dimensions. Canonical JSON serialization and the existing fail-closed
applicability validator are authoritative. User IDs, garage-row IDs, batch IDs,
TargetWork IDs and SourceWorkItem IDs are never identity inputs. A reusable
knowledge key is derived from the same canonical demand identity and retains
status, raw value and provenance separately.

Rationale: equivalent users must share reusable knowledge while semantically
different contexts must not collide. Existing Factory execution identities are
batch-scoped and cannot serve as cross-request knowledge identity. The local
Wave 1 proof shows exact reuse, deterministic missing-field classification,
partial safe projection and explicit in-progress/review/unsupported/blocked
states without production promotion.

Consequences: unknown required applicability fails closed; incompatible
contexts require separate research; safe fields remain projectable when an
unrelated field is blocked or awaiting review. Durable persistence and atomic
deduplication remain a separate Wave 2 boundary.

## ADR-045 — Source discovery and prospect registration boundary

Date: 2026-09-19

Decision: Catalogue queue targets may enter a generic, non-production
`SourceDiscoveryProspect/v1` lifecycle before becoming existing
`SourceProspect/v1` records. The lifecycle preserves explicit UNKNOWN and
PARTIAL identity/applicability dimensions and separates route discovery,
authentication, applicability proof, accessibility, exhaustion and
acquisition readiness. Only a complete `EXECUTION-READY` candidate may be
adapted to the existing SourceProspect contract.

Rationale: the catalogue-to-queue projection can identify unresolved targets,
but the existing SourceProspect contract represents a registered prospect and
does not safely model an unregistered candidate route. A typed intermediate
boundary prevents URL discovery from being mistaken for authentication,
applicability proof or acquisition.

Consequences: deterministic duplicate candidates are reused, conflicting
identity/publication candidates fail closed, and the foundation performs no
source discovery, acquisition, evidence, review, promotion or production
mutation. A future bounded pilot may register real candidates through this
boundary.

Status: ACTIVE. Related implementation: `research/factory/source-discovery-prospect-contracts.js`.

## ADR-044 — Generic controlled registry-insertion boundary

Date: 2026-09-19

Decision: `REGISTRY-INSERTION` is executed only through a generic,
authorization-bound `ProductionTechnicalProfileRegistryInsertionMaterialization/v1`
boundary. The executor accepts only validated typed applicability,
catalogue-identity and Technical Profile definition references; it requires an
existing non-registered profile container and an explicit registry store, and
supports deterministic `CREATED`/`REUSED` results with fail-closed conflict
handling. It never creates profile contents or cascades into other
materialization requirements.

Rationale: the CBR500R registry wave found typed registry inputs and a runtime
registry reader but no controlled production registry-insertion executor.
Arbitrary presence or direct registry mutation would cross the production
boundary without a reusable safety contract.

Consequences: synthetic tests validate the new generic boundary, while the
CBR500R profile remains non-registered until a later explicitly bounded wave.
Existing VFR/Ducati registry descriptors and semantics remain unchanged.

Status: ACTIVE. Related implementation: `research/factory/production-technical-profile-registry-insertion-materializer.js`.

## ADR-041 — Generic production citation materializer

Date: 2026-09-19

Decision: The exact `PRODUCTION-CITATION-MATERIALIZATION` requirement uses a
generic `ProductionCitationMaterialization/v1` executor bound to one validated
`ProductionMaterializationAuthorization/v1`. It accepts typed citation,
document, source-location and provenance references, preserves exact locator
semantics including `page: null`, writes only through an explicit citation
store, and returns deterministic `CREATED` or `REUSED` results. Conflicting
existing content fails closed; the executor never cascades to Technical
Profile or registry requirements.

Rationale: The prior real CBR500R citation attempt found no reusable generic
executor. A separate foundation is required because citation identity and
locator semantics differ from production-document materialization. The
foundation is synthetic-tested only; it does not materialize the CBR500R
citation.

Consequences: Production citation mutation is explicit, authorized,
idempotent and generic. No CBR500R citation was created in this wave; the
next bounded wave must rerun only that exact citation requirement.

Status: ACTIVE. Related implementation: `research/factory/production-citation-materializer.js`, `research/factory/production-citation-materializer-contracts.js`.

## ADR-042 — Generic production Technical Profile entry materializer

Date: 2026-09-19

Decision: `TECHNICAL-PROFILE-ENTRY-MATERIALIZATION` uses a generic
`ProductionTechnicalProfileEntryMaterialization/v1` executor bound to one
validated `ProductionMaterializationAuthorization/v1`. It accepts typed
intended-profile, entry-definition and citation references, requires an
already-existing production profile container, validates the materialized
document/citation binding and authorized value/applicability, and writes only
one verified entry through an explicit profile store. It returns deterministic
`CREATED` or `REUSED` results and rejects conflicting entries.

Rationale: The prior CBR500R entry wave found no generic controlled executor.
Creating a profile container would cross the separate registry/identity
boundary, so the foundation fails closed when that container is absent. The
executor is motorcycle-agnostic and synthetic-tested only.

Consequences: Technical Profile entry mutation remains explicit, idempotent
and separate from registry insertion. No CBR500R entry or registry membership
was created in this foundation wave; the next bounded wave must rerun only
that exact entry requirement.

Status: ACTIVE. Related implementation: `research/factory/production-technical-profile-entry-materializer.js`, `research/factory/production-technical-profile-entry-materializer-contracts.js`.

## ADR-043 — Generic production Technical Profile container boundary

Date: 2026-09-19

Decision: Production Technical Profile container creation is a separate
generic `ProductionTechnicalProfileContainerMaterialization/v1` boundary. It
consumes a validated intended-profile reference and explicit approved
materialization authorization, writes only through an explicit profile store,
supports deterministic `CREATED`/`REUSED` results and rejects conflicting
containers. It cannot claim registry membership; registry insertion remains
a separate lifecycle boundary.

Rationale: The CBR500R entry executor requires an existing production profile
container, but repository inspection found no CBR500R container and no shared
container-creation lifecycle. Creating the container implicitly during entry
materialization would cross the registry/identity boundary and weaken the
fail-closed design.

Consequences: The foundation is motorcycle-agnostic and synthetic-tested
only. No CBR500R profile or entry is created in this wave. The next bounded
step is the exact CBR500R profile-container prerequisite.

Status: ACTIVE. Related implementation: `research/factory/production-technical-profile-container-materializer.js`, `research/factory/production-technical-profile-container-materializer-contracts.js`.

## ADR-040 — Explicit generic production document materializer

Date: 2026-09-19

Decision: Add a generic `ProductionDocumentMaterializer/v1` executor that
accepts exactly one validated `ProductionMaterializationAuthorization/v1`,
the matching typed document/provenance references, an explicit production
document definition and an explicit document store. It executes only
`PRODUCTION-DOCUMENT-MATERIALIZATION`; citation, Technical Profile and
registry requirements are never cascaded automatically.

The executor derives a deterministic document identity and result identity,
creates through the supplied store when absent, reuses byte-equivalent
existing content, and fails closed on conflicting duplicates or any lineage,
authorization, identity or source mismatch. No timestamp or hidden external
state is required.

Consequences: the executor is reusable across manufacturers and document
types while production writes remain explicit and testable. Synthetic fixtures
prove creation, reuse, conflict rejection, authorization rejection and
idempotence. The CBR500R document remains unmaterialized until a separate
bounded execution wave.

Status: ACTIVE. Related implementation:
`research/factory/production-document-materializer.js`.

## ADR-039 — Explicit production materialization authorization boundary

Date: 2026-09-19

Decision: Introduce a generic `ProductionMaterializationAuthorization/v1`
boundary between a `REQUIREMENTS-READY`
`MaterializationRequirementsAuthorization` and any future production
materializer. The boundary binds exactly one validated four-requirement result
and requires an explicit typed human decision for this materialization
boundary. No decision produces a pending unauthorized result; approval may
authorize a future materializer; rejection remains unauthorized. The
authorization object itself never materializes production state and always
records `productionCreated: false` in this wave.

Rationale: Technical readiness is not human authorization. Reusing earlier
review, promotion or conversion decisions would allow a stale or unrelated
decision to cross the production boundary. A separate deterministic,
fail-closed and immutable authorization makes the final human-controlled gate
explicit while retaining production mutation as a later architecture.

Consequences: malformed, stale, incomplete, unknown or mismatched decisions
remain blocked or pending. The CBR500R ready requirement set has one
non-production pending projection and no human materialization authorization;
no production document, citation, Technical Profile, registry membership or
technical data changed.

Status: ACTIVE. Related implementation:
`research/factory/production-materialization-authorization.js`.

## ADR-037 — Typed non-production Technical Profile entry references

Date: 2026-09-19

Decision: The generic Technical Profile entry materialization requirement
accepts a typed `TECHNICAL-PROFILE-ENTRY-DEFINITION-REF` only when it binds a
validated intended Technical Profile reference, exact production mapping,
unchanged typed value, compatible citation reference and upstream production
authorization. The reference is immutable, deterministic, explicitly
non-production and carries no production profile or registry mutation.

Rationale: The CBR500R identity foundation established the intended profile
identity but not its future entry definition. A typed generic entry reference
keeps profile identity, entry contents, citation compatibility and registry
insertion separate while preventing arbitrary strings from making the
Technical Profile requirement READY.

Consequences: malformed, mismatched or incomplete profile-entry references
fail closed; document and citation readiness are unchanged; registry remains
a separate pending boundary; no production profile, registry membership or
technical data is created. The bounded CBR500R reevaluation is the first
instance and does not add target-specific logic to the Factory.

## ADR-046 — Research on Demand + Persistent Reuse remains a separate boundary

Date: 2026-09-20

Decision: Research on Demand + Persistent Reuse is PROPOSED/AUDITED only. The
existing catalogue/context, applicability, Research Factory lifecycle,
provenance, human-review and explicit production-authorization contracts remain
the reusable foundation. Future on-demand work must add a separate durable
non-production research-demand/status and reusable-knowledge boundary keyed by
canonical catalogue/context/field applicability; it must not use a user garage
row or committed production Technical Profile as a cache.

Rationale: repository inspection found no cross-request reusable-knowledge
store, demand ledger or profileless partial-reuse projection. TargetWork and
SourceWorkItem IDs are deterministic but batch-scoped execution identities.
The Factory is therefore not obsolete; only a thin demand/reuse adapter and
durable boundary are missing. A local-fixture proof should precede any API
provider or production-promotion work.

Consequences: known safe fields may be projected progressively, while unknown
applicability, RED, YELLOW, pre-evidence ACCEPT and source failures remain
explicit and fail closed. API Ninjas, schema changes, UI changes and production
profile mutation are separate future authorizations. Wave K remains unchanged.

Status: ACTIVE. Related implementation: `research/factory/technical-profile-entry-reference-contracts.js`, `research/factory/materialization-requirements.js`.

## ADR-038 — Typed non-production registry insertion references

Date: 2026-09-19

Decision: The generic `REGISTRY-INSERTION` requirement accepts separate typed
`ApplicabilityReference/v1` and `CatalogueIdentityReference/v1` objects plus
the existing intended Technical Profile reference. All three must agree on
target/catalog identity and production-authorization lineage. The references
are immutable, deterministic and explicitly non-production; they cannot claim
an existing production profile or registry membership.

Rationale: Registry readiness needs proven bounded applicability and catalogue
identity, but those facts must not be represented as registry membership or a
production profile. Typed references provide the missing fail-closed boundary
without inventing IDs or writing production state.

Consequences: malformed, mismatched, arbitrary or production-claiming refs
fail closed. All four CBR500R requirements can be READY while
`materializationAllowed` remains false and `productionCreated` remains false;
the controlled production-materialization authorization boundary remains a
separate later step.

Status: ACTIVE. Related implementation: `research/factory/registry-input-reference-contracts.js`, `research/factory/materialization-requirements.js`.

## ADR-036 — Non-production Technical Profile identity references

Date: 2026-09-19

Decision: Future Technical Profile materialization may use a typed,
deterministic `TechnicalProfileDefinitionReference/v1` that binds a target
ID, catalog variant, manufacturer/model/generation, year, market,
transmission, equipment and known ABS state. The reference explicitly has no
production profile ID and no registry membership; it is not a profile or a
registry record.

Rationale: CBR500R has a repository-proven catalog/target identity but no
production Technical Profile or registry entry. Existing VFR and Ducati
profile IDs are historical implementation identities, not a generic rule for
inventing a new production ID. A typed intended-profile reference preserves
the exact bounded identity while keeping identity, profile contents and
registry insertion separate.

Consequences: malformed, incomplete, mismatched or unproven catalogue
identity fails closed. The CBR500R reference is non-production only;
production profile data and registry membership remain absent.

Status: ACTIVE. Related implementation: `research/factory/technical-profile-identity-reference-contracts.js`.

## ADR-035 — Typed non-production citation and source-location references

Date: 2026-09-19

Decision: The generic citation materialization requirement uses separate
immutable `CitationDefinitionReference/v1` and `SourceLocationReference/v1`
objects together with a reused `DocumentDefinitionReference/v1`. Citation
identity is bound to the canonical research field and document identity;
location identity is bound to the source identity, document, existing
provenance reference and exact source locator. All refs remain explicitly
non-production.

Rationale: Citation readiness must not be satisfied by arbitrary presence
tokens or by inventing production citation records. The existing authenticated
source locator, including `page: null`, can be represented losslessly as a
typed generic reference and checked against the existing document identity.

Consequences: Compatible typed citation inputs can make only the citation
requirement READY; Technical Profile and registry requirements remain separate
pending boundaries. No citation, document, profile or registry materialization
is performed, and `materializationAllowed` remains false.

Status: ACTIVE. Related implementation: `research/factory/materialization-input-reference-contracts.js`, `research/factory/materialization-requirements.js`.
