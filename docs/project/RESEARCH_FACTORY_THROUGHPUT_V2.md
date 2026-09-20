# Technical Research Factory — Maximum Automation / Throughput v2

Status: DESIGN ONLY — no runtime automation is implemented by this document.

Date: 2026-09-20

## 1. Design objective and non-negotiable boundaries

The Factory should let a human define a bounded research scope, execute every
deterministic-safe operation automatically, present only meaningful exceptions,
and stop before evidence or production materialization. Throughput is a design
goal; it never overrides provenance, applicability, conflict, immutability or
production-isolation gates.

The proposed v2 is an orchestration layer around the existing contracts. It is
not a replacement pipeline and does not change the meaning of `ACCEPT`,
`PROMOTION-READY`, `APPROVED-FOR-CONVERSION` or any production authorization
state.

Hard boundary:

```text
ResearchTarget / batch scope
  -> source planning and gap calculation
  -> authenticated acquisition
  -> custody-bound extraction
  -> Review Queue
  -> exception review / explicit Human Review decisions
  -> Evidence Processing
  -> PromotionPacket readiness
  -> pending PromotionReviewPacket
  -> explicit PromotionReviewDecision
  -> SchemaConversionProjection
  -> SAFE STOP
  -> separately authorized evidence / production materialization
```

The final arrow is not part of maximum automatic advancement. Research output
must not import into the browser runtime, create evidence rows, change Rider
Service Core coverage, alter catalogue/registry state, or write Supabase.

## 2. Repository audit: current lifecycle

The following is the current repository-backed lifecycle, not a hypothetical
one.

| Stage | Existing implementation | Deterministic-safe work | Genuine judgment / external boundary |
| --- | --- | --- | --- |
| Target creation | `research/factory/contracts.js`, identity and gap contracts | Validate identity, applicability dimensions, field set, baseline and stable IDs | Human defines the bounded research scope; unknown identity remains unresolved |
| Planning / source discovery | `execution-planner.js`, source-discovery contracts, coverage/queue projection | Deduplicate prospects, compare policy, calculate gaps, rank and batch | Source route/authentication/applicability may require human or external confirmation |
| Acquisition | `execution-agent.js`, `execution-contracts.js`, acquisition adapters | Build canonical request, execute bounded adapter, validate custody/result, classify retry | Network availability, login/access, source identity and wrong-publication findings |
| Extraction | `extraction-agent.js`, extraction contracts/playbook/adapters | Verify parent artifact, digest/length, adapter version, raw candidate identity and order | Semantic ambiguity, unsupported layout, unrecognized field or conditional meaning |
| Review Queue | `review-queue.js` and contracts | Build one immutable entry per raw candidate, collapse exact duplicates, retain ineligible results | None for queue construction; queue entry is not a decision |
| Human Review | `review-decisions.js` and decision contracts | Validate decision-to-queue lineage and deterministic decision identity | Candidate acceptance/rejection/deferment is a human decision; `ACCEPT` is pre-evidence |
| Evidence Processing | `evidence-processing.js` and contracts | Consume decisions exactly once, preserve candidate, detect same-field raw conflicts | Conflicts remain unresolved; no researched-no-evidence state is manufactured |
| Promotion readiness | `promotion-readiness.js`, `promotion-contracts.js` | Validate processing state, source identity, provenance, applicability and conflict gate | A failed gate is blocked, not repaired by inference |
| Pending promotion packet | `promotion-review.js` and contracts | Project ready packets deterministically and preserve raw payload | Packet is pending; it is not approval |
| Promotion review | `promotion-review-decision-contracts.js` | Validate explicit decision lineage and immutable input | Human decides whether the packet may enter conversion; readiness is not approval |
| Schema conversion | `schema-conversion.js` and contracts | Produce deterministic read-only projections and preserve lineage/raw values | New mapping, compound/conditional interpretation or unsafe representation is review/blocking work |
| Evidence/production materialization | materialization and production materializer contracts | Validate a separately authorized request | Always separately human-authorized; never an automatic consequence of conversion readiness |

Existing orchestration is deliberately lower-level. `orchestrator-contracts.js`
defines batch, target work, source work, attempt, event and checkpoint states;
`reducer.js` derives state from an ordered event history; `checkpoint.js`
replays and verifies a prefix digest and snapshot digest. `execution-agent.js`
can run a planned source attempt synchronously or asynchronously, but it does
not yet drive the whole lifecycle through all downstream stages.

### Observed throughput waste

The repository cases show structural, not benchmarked, waste:

* BMW C 600 Sport produced 24 raw candidates, then required separate bounded
  waves for Human Review, Evidence Processing, readiness, pending packets,
  promotion decisions and schema-conversion projection. The latter deterministic
  projections are now 24/24 `CONVERSION-READY`; the records were manually
  advanced through multiple deterministic boundaries.
* Ducati Monster 937 used separate review-decision and schema-conversion
  projections. Seven decisions yielded six conversion-ready records and one
  deliberately blocked cooling mapping. This is evidence that a batch must
  continue green records while retaining a per-record block.
* CBR500R used a one-record path through review, readiness, conversion,
  authorization and materialization requirements. Repeated one-record reports
  demonstrate lifecycle overhead that a batch runner should absorb, while the
  production boundary must remain explicit.
* Honda/Yamaha batch work already demonstrates document reuse and batch
  reporting, but the reports are separate execution artifacts rather than one
  resumable end-to-end run.

These cases establish repeated serialization, report loading, validation and
memory/checkpoint handoff. They do not provide reliable elapsed-time or current
human-touch percentages; v2 must measure those instead of inventing them.

## 3. Proposed v2 architecture

Add one generic `ResearchBatchRunner/v2` orchestration component above the
existing modules. The runner owns scheduling and routing only. It must call the
current validators and pure stage functions, never recreate their semantics.

### Core objects

1. `ResearchBatch/v2` — immutable batch scope: targets, desired fields,
   markets/equipment/ABS/transmission dimensions, source policy, rule-library
   version, extractor policy/version, concurrency and retry limits.
2. `StageEnvelope/v2` — stage name, input identity/digest, contract version,
   implementation/rule versions, output IDs/digests, routing result and event
   sequence. It links outputs to existing contracts without adding production
   fields to them.
3. `ExceptionRecord/v2` — stable record/target/field lineage, route (`YELLOW`
   or `RED`), reason code, exact failed invariant, evidence references and
   allowed human action. It never contains an approval shortcut.
4. `BatchSummary/v2` — deterministic counts and work counters, sorted by stable
   IDs, including cache hits, retries, green/yellow/red routing and safe-stop
   boundary.
5. `ResearchCache/v2` — content-addressed references to existing immutable
   artifacts/results, never a substitute for applicability validation.

The runner should emit existing `events.js` events and use `reducer.js` and
`checkpoint.js` as the authoritative resume mechanism. A v2 envelope may be
stored in event payloads, but existing event identity, sequence and snapshot
verification remain mandatory.

### Safe advancement loop

For every ready work item, the runner:

1. validates the current contract and input digest;
2. checks an exact cache key and revalidates target/source applicability;
3. invokes the stage adapter/pure projection;
4. validates output through the existing contract;
5. records a content-addressed output reference and stage envelope;
6. routes each record independently;
7. schedules only downstream work whose prerequisites are complete;
8. checkpoints after deterministic bounded groups and before external retries.

A failed or yellow record must not pause unrelated green records. Batch
completion requires every required work item to be terminal; it does not
require every item to be successful.

## 4. GREEN / YELLOW / RED routing

Routing is a deterministic classification of a validated stage result, not a
new evidence grade.

### GREEN — automatic advancement

GREEN requires all relevant existing gates to pass: canonical target identity,
trusted/authenticated source identity, explicit applicable model/year/market/
ABS/transmission/equipment scope, recognized field, complete source location
and provenance, deterministic adapter/rule version, lossless value
representation, no unresolved conflict, and a valid next-stage contract.

GREEN may advance through acquisition, extraction, queue construction, Evidence
Processing, readiness, packet creation and read-only schema conversion. It may
not approve human decisions or materialize production data. A GREEN result at
one stage is re-evaluated at the next stage.

### YELLOW — human exception review

YELLOW means the record is potentially usable but requires a bounded human
interpretation that the current deterministic contracts do not provide. Typical
reasons are conditional applicability, a compound value without a proven
lossless decomposition, optional equipment variants, competing evidence,
source wording with semantic ambiguity, an unseen mapping, or a reusable-rule
proposal.

YELLOW is grouped by reason and field, but each record remains separately
traceable. Human resolution produces either a candidate-local decision or an
explicit versioned rule proposal. It does not silently rewrite upstream data.

### RED — fail closed

RED means automatic continuation is unsafe: missing/invalid provenance,
conflicting target identity, unknown or insufficient applicability, invalid or
unauthenticated source, failed custody/digest, unsupported schema/media, hard
acquisition failure, exhausted retry budget or irreconcilable evidence.

RED remains blocked/deferred with the exact failed invariant. It is not counted
as human-approved work and cannot be bypassed by a batch-level override.

## 5. Exception-driven review

The runner should expose one consolidated exception queue grouped by stable
reason code, then by target/field and source. A summary may say `YELLOW: 51`,
but every item must retain its record ID and full lineage. The queue must show
raw value, source locator, applicability, condition, failed invariant and the
next legal decision states.

Two different actions must remain separate:

* `RECORD DECISION` resolves one candidate/record under the existing Human
  Review or Promotion Review vocabulary.
* `RULE PROPOSAL` proposes a reusable transformation or applicability mapping.

A record decision never becomes a global rule automatically. A rule proposal
must be reviewed, expressed as code/configuration, versioned, unit-tested,
fixture-tested against positive and negative cases, and explicitly activated.
Existing records are not silently reprocessed when a rule is activated; a new
run with a new rule version produces new content-addressed outputs.

## 6. Deterministic rule library

The first generic rule library should cover recurring representations only:
pressure, torque, capacity, dimensions, imperial/metric pairs, spark-plug gap,
tire size, battery capacity, bulb specification and fuse ratings.

Each rule has a stable ID, semantic version, input contract, output contract,
accepted units/precision, applicability requirements, raw-text preservation
policy, rejection codes, and test fixtures. A rule may parse a value only when
the source wording and condition support a lossless result. It must preserve the
original raw value, unit, source location and rule version beside any parsed
representation. It must reject unsupported precision, compound semantics,
unknown context and ambiguous alternatives.

AI/model output may propose a rule or classify an exception, but it cannot
become an active rule or trusted evidence without deterministic implementation,
human review and tests. Rule activation is a repository change, not a runtime
side effect.

## 7. Source cache and content-addressed reuse

Reuse is document-centric, but applicability remains target-specific. The
cache key should include:

```text
source identity + canonical publication identifiers + content hash/version
+ authenticated trust classification + acquisition adapter/version
```

Extraction reuse additionally includes:

```text
artifact hash + extractor adapter/version + playbook/model-plan version
+ exact extraction scope/field set + target applicability scope
```

Parsing/conversion reuse additionally includes the exact upstream output
digest, rule-library version and target mapping contract. Any change to source
bytes, adapter, playbook, rule, contract or applicability invalidates the
derived cache key. A cache hit still runs contract validation and target
applicability checks; a cached document cannot be applied outside its proven
scope. Source URL/mirror identity is never treated as technical independence.

## 8. Applicability fan-out

One authenticated publication may fan out to many target-specific outputs only
when its explicit applicability map proves manufacturer/model family, year
range, market, ABS, transmission and equipment coverage. The fan-out creates
separate target-bound candidate/output identities, each retaining the same
source document identity and the target-specific applicability proof.

The runner must reject guessed year inheritance, platform similarity, regional
inheritance, ABS/manual/DCT substitution and optional-equipment broadening.
An applicability map should represent `MATCH`, `MISMATCH`, `PARTIAL` and
`UNKNOWN` using the existing semantics; only `MATCH` can enter GREEN. A shared
publication can reduce acquisition and extraction work without collapsing
target records or conditional contexts.

## 9. Incremental research and batch input

The batch input should be a data file validated by the existing target and
applicability contracts. It can contain one target, a model family, a
manufacturer, or a bounded multi-manufacturer set:

```text
targets or catalogue selection
year/market/equipment/ABS/transmission scope
desired canonical field IDs
source priority/authentication policy
retry/concurrency budgets
rule and extractor policy versions
```

Before source work, the runner computes a deterministic coverage/gap plan from
existing verified evidence and research history. Fields already sufficiently
covered are excluded unless refresh, conflict repair, source replacement or
applicability change is explicit. The gap output is sorted by canonical target
and field identity and is itself checkpointed. No missing value is inferred from
nearby models or years.

## 10. Checkpoint, resume and bounded concurrency

The existing event/reducer/checkpoint infrastructure is the right foundation.
V2 should add stage envelopes and scheduler metadata to events rather than
introducing a second state machine.

Resume rules:

* verify the checkpoint event prefix digest and snapshot digest before work;
* skip only an output whose exact input/cache/contract digest matches;
* retry only non-terminal retryable work within the existing attempt budget;
* keep YELLOW and RED records independent of unrelated GREEN work;
* make external attempts idempotent by stable work/attempt identity;
* checkpoint after each bounded deterministic group and before pausing;
* reject duplicate or out-of-order event sequences.

Safe concurrency candidates are independent target/source acquisition requests,
independent extraction of immutable artifacts, cache lookups and pure
validation/projection. Shared event append, sequence assignment, per-source
retry state, conflict grouping and final summaries require a deterministic
single writer or merge barrier. Ordering must be canonicalized by stable IDs;
parallel completion timing must never affect output IDs or routing.

## 11. One-command operator experience

The implementation target is one repository-convention CLI invocation, for
example a future `node scripts/research-batch.js <validated-batch>`, only after
the responsibility boundaries are implemented and tested. The command should:

1. validate and fingerprint the batch;
2. load or create the event history;
3. calculate coverage/gaps and planned source work;
4. run safe work with bounded concurrency and cache reuse;
5. emit the machine-readable summary and exception queue;
6. stop at YELLOW/RED or at the pre-materialization boundary;
7. persist a resumable checkpoint.

The exact CLI syntax is intentionally deferred until the runner contract and
batch file shape exist. A command must never mean “approve everything” or
“write production”.

## 12. Machine-readable summary and metrics

`BatchSummary/v2` should include deterministic counts for targets, desired
fields, already-covered fields, source requirements, source/cache hits,
acquisition outcomes, extracted candidates, queue entries, Evidence Processing
states, GREEN/YELLOW/RED records, promotion-ready/blocked records,
conversion-ready/blocked records, retries, failures, human actions and safe
stop reason. It should also expose work counters and duration when available;
duration is diagnostic, not identity-bearing.

Required metrics:

* **AUTO-ADVANCE RATE** = eligible records advanced automatically / all eligible
  records.
* **HUMAN TOUCH RATE** = records requiring human action / all researched records.
* **SOURCE REUSE RATE** = reused authenticated source requirements / all source
  requirements.
* **RESEARCH DUPLICATION RATE** = repeated equivalent operations / all research
  operations.

Metrics must declare denominators, scope, rule/contract versions and whether
cache hits count as work. No current percentage is claimed by this design;
existing reports provide counts, not a comparable end-to-end denominator.

The operational target is at least 90% automatic advancement for unambiguous
Tier-A records. This is a measured target with a falsification report, not a
gate that permits weaker validation. A lower result is acceptable when the
exceptions are real; a higher result is invalid if it hides ambiguity.

## 13. Migration and implementation waves

All waves are non-production unless explicitly stated otherwise. Existing
artifacts remain readable and useful.

### A — Baseline and summary contract

Scope: define `BatchSummary/v2`, denominators, stage counters and a report over
existing BMW/Ducati/CBR500R/Honda/Yamaha fixtures.

Invariants: no source/research/production mutation; deterministic counts;
explicit unknown denominators.

Tests/acceptance: repeated runs and permuted inputs produce identical summary;
BMW 24-record lineage and current production boundary remain unchanged.

Non-goals: no scheduler, cache or new research.

### B — Safe-stage runner over existing contracts

Scope: one runner that advances only already-planned synthetic/fixture work
through acquisition-result validation, extraction, queue, Evidence Processing,
readiness, packet and read-only conversion boundaries.

Invariants: existing validators remain authoritative; no auto Human Review or
materialization.

Tests/acceptance: mixed green/yellow/red fixture; one failed item does not stop
green items; all IDs and lineage match direct stage execution.

Non-goals: no new rule semantics or live source acquisition.

### C — Routing and exception queue

Scope: deterministic GREEN/YELLOW/RED reason taxonomy and grouped exception
projection.

Invariants: record decision and rule proposal remain distinct; red fail-closed.

Tests/acceptance: every exception has exact failed invariant and source
lineage; no ambiguous fixture routes green.

Non-goals: no AI approval and no global rule activation.

### D — Versioned deterministic rule library

Scope: small generic parser set with raw-preserving outputs and negative tests.

Invariants: versioned keys, no invented precision, unsupported compounds fail
closed.

Tests/acceptance: torque/pressure/capacity/dimension/tire/battery/bulb/fuse
fixtures cover imperial/metric, conditional and ambiguous cases.

Non-goals: no automatic semantic interpretation of unseen manufacturer wording.

### E — Source/artifact cache and extraction reuse

Scope: cache identity and validation for authenticated documents and derived
extraction results.

Invariants: hash/version/applicability binding; stale or out-of-scope hits fail.

Tests/acceptance: same artifact reuses; changed bytes/adapter/playbook/rule or
scope invalidates; mirror copies do not become independent claims.

Non-goals: no source discovery beyond supplied repository routes.

### F — Coverage planner and applicability fan-out

Scope: deterministic gap subtraction and target-specific fan-out for one
explicitly multi-target publication.

Invariants: no inferred years/markets/equipment; separate target identities.

Tests/acceptance: exact-match fan-out succeeds; partial/unknown/mismatch cases
route yellow/red; already-covered fields are not reacquired.

Non-goals: no new production coverage and no automatic evidence creation.

### G — Checkpoint/resume and bounded concurrency

Scope: extend event payloads/scheduler with stage envelopes, idempotent resume
and deterministic merge barriers.

Invariants: prefix/snapshot replay, no duplicate attempts, stable order.

Tests/acceptance: interruption/resume equals uninterrupted output; concurrent
completion permutations produce identical IDs, summary and state.

Non-goals: no uncontrolled parallelism or second state machine.

### H — Batch CLI and exception review projection

Scope: validated batch input, one-command safe execution, summary and grouped
exception queue.

Invariants: safe stop before materialization; human actions explicit and
resumable.

Tests/acceptance: single-target, family, manufacturer and mixed batch shapes;
one blocked target does not hide other results.

Non-goals: no production write, cloud write or UI integration.

### I — Measured pilot and throughput challenge

Scope: run only an authorized fixture/research pilot using existing BMW,
Ducati, CBR500R and Honda/Yamaha shapes; compare direct-stage and runner
outputs and measure the four metrics.

Invariants: no new motorcycle or materialization in the design transition;
independent audit before scale-up.

Acceptance: target the >=90% automatic advancement metric for unambiguous
Tier-A records without reducing any gate; publish misses and exception causes.

Non-goals: no 100-target rollout before checkpoint and review bottlenecks are
measured.

## 14. Independent architecture challenge and guardrails

| Risk | Guardrail |
| --- | --- |
| GREEN advances ambiguous evidence | GREEN requires explicit applicability, recognized field, complete provenance, deterministic representation and zero unresolved conflict; unknown/conditional cases route out. |
| Source reuse leaks applicability | Cache hit revalidates target-specific applicability; fan-out requires an explicit applicability map and creates separate target identities. |
| Year-range fan-out creates false universality | Range is accepted only when the source explicitly covers it under existing scope semantics; otherwise partial/unknown is not GREEN. |
| Cached extraction is stale | Key by content hash plus adapter/playbook/model-plan version and exact scope; changed inputs invalidate. |
| Reusable rule changes source meaning | Rule preserves raw text and locator, is versioned/tested, and requires activation; existing outputs are immutable. |
| Batch hides individual failures | Per-record state and reason codes are mandatory; summary includes all terminal and unresolved records. |
| Resume duplicates evidence | Stable work/attempt/output IDs, prefix/snapshot digests and idempotent merge barriers; no stage writes production. |
| Concurrency changes IDs/results | IDs use canonical semantic inputs; event append has one ordered writer; final collections sort by stable IDs. |
| Automation crosses production boundary | Runner has an explicit safe-stop state and no materializer capability; production authorization remains a separate contract and command. |
| AI interpretation becomes trusted | AI can only propose an exception classification or rule; deterministic code/config plus tests and human activation are required. |
| Human batch approval over-broadens scope | Decisions remain record-local unless a separately versioned rule is activated; packet/applicability lineage is checked at every boundary. |

## 15. Acceptance criteria for v2 completion

V2 is not complete until it demonstrates, against existing fixtures:

1. Direct stage execution and runner execution produce identical deterministic
   IDs, raw values, provenance, applicability and condition semantics.
2. GREEN records advance automatically through every safe research/conversion
   stage and stop before materialization.
3. YELLOW and RED records are individually visible, grouped by reason, and do
   not block unrelated GREEN records.
4. Source/document/extraction reuse is content-addressed and invalidates on
   relevant version, hash, scope or contract changes.
5. Interrupted and resumed execution equals uninterrupted execution and never
   duplicates work or evidence.
6. Batch summaries expose denominators and all required human-effort metrics;
   no unsupported percentage is claimed.
7. The >=90% Tier-A unambiguous automatic-advancement target is measured,
   reported with exceptions, and never used to weaken validation.
8. Production, Rider Service Core, catalogue, registry, Supabase/cloud and UI
   remain byte/semantic unchanged in the pilot.

## Exact next

The next bounded implementation wave should be **A — deterministic throughput
baseline and `BatchSummary/v2` design/fixture projection**. It must not execute
BMW evidence materialization, add a motorcycle, or implement production writes.
