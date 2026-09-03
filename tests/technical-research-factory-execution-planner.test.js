"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const readinessInventory = require("../research/data/source-prospect-authentication-quality-reassessment.js");
const yamaha = require("../research/data/yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js").runBatch();
const plannerReport = require("../research/data/technical-research-factory-execution-planner.js");
const storedPlannerReport = require("../research/reports/technical-research-factory-execution-planner.json");

const known = values => ({ state: "KNOWN", values });
const unknown = () => ({ state: "UNKNOWN", values: [] });
const scope = (model = "fixture.model", overrides = {}) => ({ schemaVersion: 1, model: known([model]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]), ...overrides });
const target = (id = "target.fixture.model.2021.eu", overrides = {}) => factory.validateResearchTarget({ schemaVersion: 1, id, catalogVariantKey: id.replace(/^target\./, "").replace(/\.2021\.eu$/, ""), manufacturer: "Fixture", family: "Fixture Model", scope: scope(id.replace(/^target\./, "").replace(/\.2021\.eu$/, "")), sourcePriorityPolicyId: "tier-ab-practical-marginal-v1", serviceCoreBaseline: { verified: 0, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE", ...overrides });
const prospect = (t, id = "prospect.fixture.manual", overrides = {}) => factory.validateSourceProspect({ schemaVersion: 1, id, targetId: t.id, documentClass: "official-owner-manual", authority: { name: "Fixture Motor", state: "KNOWN" }, documentIdentity: { title: "Fixture Manual", state: "KNOWN" }, publication: { relationship: "SINGLE", identifiers: [{ value: id, namespace: "Fixture", region: "EU", proofState: "AUTHENTICATED" }] }, officialLocations: [{ host: "manuals.fixture.invalid", path: `/${id}.pdf` }], sourceTier: "A", authenticationState: "AUTHENTICATED", accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: t.scope, exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "HIGH", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "bounded fixture", ...overrides });
const gap = (t, overrides = {}) => factory.validateGapPlan({ schemaVersion: 1, id: `${t.id}.gap-plan`, targetId: t.id, startingCoverage: { verified: 41, total: 44 }, remainingFields: ["lubrication.capacity-drain", "cooling.capacity", "torques.front-axle"], safetyCriticalRemainingFields: ["lubrication.capacity-drain", "cooling.capacity", "torques.front-axle"], researchedNoEvidenceFields: [], conflictedFields: [], attemptedSourceClasses: [], sourceClassRelevance: {}, expectedMarginalOpportunity: "HIGH", ...overrides }, pipeline.serviceCoreFields);
const policy = (overrides = {}) => factory.validatePlanningPolicy({ schemaVersion: 1, batchPurpose: "execution-planner-test", maxAttemptsPerSourceWorkItem: 2, maxSourceWorkItemsPerTarget: 2, maxWorkItemsPerBatch: 3, maxTargetsPerBatch: 2, maxTotalAttemptsPerBatch: 4, sourceClassPriority: ["official-service-manual", "official-owner-manual"], sourceTierPriority: ["A", "B"], practicalFieldIds: ["lubrication.capacity-drain", "cooling.capacity", "torques.front-axle"], ...overrides });
const capability = (p, fields, operation = "acquire-existing-source", state = "KNOWN") => ({ schemaVersion: 1, prospectId: p.id, operation, state, fieldIds: fields });
const candidate = (t, p, fields, options = {}) => ({ prospect: p, readiness: factory.evaluateReadiness(t, p), capability: capability(p, fields, options.operation, options.capabilityState), maxAttempts: options.maxAttempts || 1 });
const input = (targets, gaps, candidates, planningPolicy = policy()) => ({ targets, gapPlans: gaps, candidates, policy: planningPolicy });

test("planner schema and semantic policy identity are deterministic", () => {
  const one = policy(); const two = policy(); const changed = policy({ maxWorkItemsPerBatch: 4 });
  assert.equal(factory.PLANNER_SCHEMA_VERSION, 1); assert.equal(one.id, two.id); assert.notEqual(one.id, changed.id);
  assert.throws(() => factory.validatePlanningPolicy({ ...one, id: "planner-policy.000000000000000000000000" }), /semantics/);
});

test("identical semantic inputs and reordered arrays produce byte-equivalent plans", () => {
  const a = target(); const b = target("target.fixture.second.2021.eu");
  const pa = prospect(a); const pb = prospect(b, "prospect.fixture.second");
  const first = factory.planExecution(input([a, b], [gap(a), gap(b)], [candidate(a, pa, ["cooling.capacity"]), candidate(b, pb, ["torques.front-axle"])]));
  const second = factory.planExecution(input([b, a], [gap(b), gap(a)], [candidate(b, pb, ["torques.front-axle"]), candidate(a, pa, ["cooling.capacity"])]));
  assert.equal(factory.orchestrationJson.canonicalSerialize(first), factory.orchestrationJson.canonicalSerialize(second));
  assert.deepEqual(first.batches.map(item => item.batch.id), second.batches.map(item => item.batch.id));
});

test("duplicate candidates collapse and equivalent replanning creates no duplicate work", () => {
  const t = target(); const p = prospect(t); const c = candidate(t, p, ["cooling.capacity"]);
  const plan = factory.planExecution(input([t, t], [gap(t), gap(t)], [c, c]));
  assert.equal(plan.summary.duplicateCandidateInputsRemoved, 1); assert.equal(plan.summary.workItemsProduced, 1);
  assert.equal(new Set(plan.batches.flatMap(batch => batch.sourceWorkItems.map(item => item.id))).size, 1);
  const replanned = factory.planExecution(input([t], [gap(t)], [c]));
  assert.deepEqual(plan.batches, replanned.batches); assert.equal(plan.summary.gapsConsidered, replanned.summary.gapsConsidered);
});

test("planning is gap-driven and unknown capability is never assumed useful", () => {
  const t = target(); const needed = prospect(t); const irrelevant = prospect(t, "prospect.fixture.irrelevant"); const opaque = prospect(t, "prospect.fixture.opaque");
  const plan = factory.planExecution(input([t], [gap(t)], [candidate(t, needed, ["cooling.capacity"]), candidate(t, irrelevant, ["ignition.plug-gap"]), candidate(t, opaque, [], { capabilityState: "UNKNOWN" })]));
  const byId = id => plan.decisions.find(item => item.prospectId === id);
  assert.equal(byId(needed.id).decision, "PLANNED"); assert.equal(byId(irrelevant.id).decision, "NOT-NEEDED"); assert.equal(byId(opaque.id).reasonCode, "CAPABILITY_UNKNOWN");
});

test("researched-no-evidence and conflict needs retain their distinct states", () => {
  const t = target(); const p = prospect(t);
  const g = gap(t, { researchedNoEvidenceFields: ["cooling.capacity"], conflictedFields: ["torques.front-axle"] });
  const plan = factory.planExecution(input([t], [g], [candidate(t, p, ["cooling.capacity", "torques.front-axle", "lubrication.capacity-drain"])]));
  const needs = Object.fromEntries(plan.decisions[0].addressedNeeds.map(item => [item.fieldId, item.state]));
  assert.equal(needs["cooling.capacity"], "RESEARCHED-NO-EVIDENCE"); assert.equal(needs["torques.front-axle"], "CONFLICT"); assert.equal(needs["lubrication.capacity-drain"], "MISSING");
});

test("Foundation blocked unknown partial exhausted and rejected states fail closed", () => {
  const t = target();
  const records = [
    prospect(t, "prospect.fixture.blocked", { accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESS-BLOCKED-AUTH" }, readinessClassification: "ACCESS-BLOCKED" }),
    prospect(t, "prospect.fixture.unknown", { applicability: scope(t.catalogVariantKey, { markets: unknown() }), readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" }),
    prospect(t, "prospect.fixture.partial", { applicability: scope(t.catalogVariantKey, { equipment: { state: "PARTIAL", values: ["standard"] } }), readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" }),
    prospect(t, "prospect.fixture.exhausted", { exhaustionState: "EXHAUSTED", readinessClassification: "EXHAUSTED / LOW-MARGINAL-YIELD" }),
    prospect(t, "prospect.fixture.rejected", { applicability: scope(t.catalogVariantKey, { years: { kind: "EXACT", from: 2022, to: 2022 } }), authenticationState: "REJECTED-MISMATCH", readinessClassification: "REJECTED-MISMATCH" })
  ];
  const plan = factory.planExecution(input([t], [gap(t)], records.map(p => candidate(t, p, ["cooling.capacity"]))));
  assert.equal(plan.summary.workItemsProduced, 0);
  assert.deepEqual(plan.decisions.map(item => item.decision).sort(), ["BLOCKED", "BLOCKED", "BLOCKED", "DEFERRED", "REJECTED"].sort());
});

test("applicability dimensions remain explicit and cannot collapse into planned work", () => {
  const t = target();
  const variants = [
    prospect(t, "prospect.fixture.abs-unknown", { applicability: scope(t.catalogVariantKey, { abs: unknown() }), readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" }),
    prospect(t, "prospect.fixture.dct", { applicability: scope(t.catalogVariantKey, { transmissions: known(["dct"]) }), readinessClassification: "REJECTED-MISMATCH" }),
    prospect(t, "prospect.fixture.us", { applicability: scope(t.catalogVariantKey, { markets: known(["US"]) }), readinessClassification: "REJECTED-MISMATCH" }),
    prospect(t, "prospect.fixture.sp", { applicability: scope(t.catalogVariantKey, { equipment: known(["SP"]) }), readinessClassification: "REJECTED-MISMATCH" }),
    prospect(t, "prospect.fixture.2022", { applicability: scope(t.catalogVariantKey, { years: { kind: "EXACT", from: 2022, to: 2022 } }), readinessClassification: "REJECTED-MISMATCH" })
  ];
  const plan = factory.planExecution(input([t], [gap(t)], variants.map(p => candidate(t, p, ["cooling.capacity"]))));
  assert.equal(plan.summary.workItemsProduced, 0); assert.equal(t.scope.abs.values[0], false);
  assert.ok(plan.decisions.every(item => item.decision === "BLOCKED" || item.decision === "REJECTED"));
});

test("priority favors safety/practical coverage then source class and stable tie-breaker", () => {
  const t = target();
  const service = prospect(t, "prospect.fixture.service", { documentClass: "official-service-manual" });
  const owner = prospect(t, "prospect.fixture.owner");
  const limited = policy({ maxSourceWorkItemsPerTarget: 1 });
  const plan = factory.planExecution(input([t], [gap(t)], [candidate(t, owner, ["cooling.capacity"]), candidate(t, service, ["cooling.capacity", "torques.front-axle"])], limited));
  assert.equal(plan.summary.workItemsProduced, 1); assert.equal(plan.decisions.find(item => item.decision === "PLANNED").prospectId, service.id);
  assert.equal(plan.decisions.find(item => item.prospectId === owner.id).reasonCode, "TARGET_WORK_LIMIT");
});

test("finite target work attempt and multi-target batch bounds are enforced", () => {
  const targets = [target(), target("target.fixture.second.2021.eu"), target("target.fixture.third.2021.eu")];
  const candidates = targets.flatMap((t, index) => [candidate(t, prospect(t, `prospect.fixture.${index}.a`), ["cooling.capacity"], { maxAttempts: 2 }), candidate(t, prospect(t, `prospect.fixture.${index}.b`), ["torques.front-axle"], { maxAttempts: 2 })]);
  const bounded = policy({ maxSourceWorkItemsPerTarget: 1, maxWorkItemsPerBatch: 2, maxTargetsPerBatch: 2, maxTotalAttemptsPerBatch: 4 });
  const plan = factory.planExecution(input(targets, targets.map(gap), candidates, bounded));
  assert.equal(plan.summary.workItemsProduced, 3); assert.equal(plan.batches.length, 2);
  assert.ok(plan.batches.every(batch => batch.sourceWorkItems.length <= 2 && batch.targetWorks.length <= 2 && batch.plannedAttempts <= 4));
  assert.ok(plan.batches.flatMap(batch => batch.sourceWorkItems).every(item => item.maxAttempts === 2));
});

test("plan is immutable JSON-safe and survives JSON round trip", () => {
  const t = target(); const p = prospect(t); const original = input([t], [gap(t)], [candidate(t, p, ["cooling.capacity"])]); const before = JSON.stringify(original);
  const plan = factory.planExecution(original); const roundTrip = JSON.parse(JSON.stringify(plan));
  assert.deepEqual(roundTrip, plan); assert.equal(JSON.stringify(original), before); assert.ok(Object.isFrozen(plan)); assert.doesNotThrow(() => factory.orchestrationJson.assertJsonSafe(plan));
});

test("planned output is consumed directly by existing orchestrator events and reducer", () => {
  const t = target(); const p = prospect(t); const plan = factory.planExecution(input([t], [gap(t)], [candidate(t, p, ["cooling.capacity"])])); const planned = plan.batches[0];
  let events = [];
  events = factory.events.appendEvent(events, { batchId: planned.batch.id, type: "batch-created", payload: { batch: planned.batch } });
  for (const targetWork of planned.targetWorks) events = factory.events.appendEvent(events, { batchId: planned.batch.id, type: "target-added", payload: { targetWork } });
  for (const sourceWork of planned.sourceWorkItems) events = factory.events.appendEvent(events, { batchId: planned.batch.id, type: "source-work-created", payload: { sourceWork } });
  events = factory.events.appendEvent(events, { batchId: planned.batch.id, type: "batch-resumed" });
  const snapshot = factory.reduceEvents(events);
  assert.equal(snapshot.sourceWorkItems[0].state, "READY"); assert.equal(snapshot.sourceWorkItems[0].id, planned.sourceWorkItems[0].id);
});

function existingFixtureCandidates() {
  const records = [];
  const add = (name, t, p) => records.push({ name, target: t, prospect: p, gapPlan: factory.generateGapPlan(t), candidate: candidate(t, p, ["cooling.capacity"]) });
  const mt = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  add("yamaha", mt, factory.adapters.fromLegacyAcquiredSource(yamaha.sources[0], mt));
  const cb = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  add("honda", cb, factory.adapters.fromLegacyAcquiredSource(honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00"), cb));
  const hd = factory.adapters.fromLegacyResearchTarget(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  add("harley", hd, factory.adapters.fromLegacyAcquiredSource(harley.source, hd));
  for (const [name, id, family] of [["tenere", "yamaha.tenere700.service.bw3-f8197-e0", "Ténéré 700"], ["vfr800", "honda.vfr800.service-mirror.61mcw07", "VFR800"]]) {
    const legacy = readinessInventory.prospects.find(item => item.id === id);
    const t = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: legacy.catalogVariantKey, manufacturer: legacy.manufacturer, family, generation: name === "tenere" ? "I" : "RC46 VTEC", years: legacy.years, markets: legacy.markets, transmission: "manual", abs: name === "tenere" ? true : null, equipment: "standard" }, { verified: name === "tenere" ? 29 : 13 });
    add(name, t, factory.adapters.fromLegacySourceProspect(legacy, t));
  }
  return records;
}

test("existing Honda VFR800 Yamaha Harley and Ténéré fixtures remain safely unplanned", () => {
  const fixtures = existingFixtureCandidates(); const before = JSON.stringify(fixtures);
  const plan = factory.planExecution(input(fixtures.map(item => item.target), fixtures.map(item => item.gapPlan), fixtures.map(item => item.candidate), policy({ sourceClassPriority: ["service manual", "owner manual", "official service-data publication"] })));
  assert.equal(plan.summary.workItemsProduced, 0);
  const decisions = Object.fromEntries(fixtures.map(item => [item.name, plan.decisions.find(decision => decision.prospectId === item.prospect.id).decision]));
  assert.deepEqual(decisions, { honda: "DEFERRED", harley: "REJECTED", tenere: "BLOCKED", vfr800: "DEFERRED", yamaha: "DEFERRED" });
  assert.equal(JSON.stringify(fixtures), before); assert.equal(fixtures.find(item => item.name === "tenere").prospect.authenticationState, "PARTIAL");
});

test("planner report is reproducible, isolated and selects one execution-adapter NEXT", () => {
  const report = plannerReport.buildReport();
  assert.deepEqual(report, storedPlannerReport); assert.equal(report.plannerSchemaVersion, 1); assert.equal(report.serviceCoreFieldCount, 44);
  assert.deepEqual(report.summary.decisionCounts, { BLOCKED: 1, DEFERRED: 4, "NOT-NEEDED": 1, PLANNED: 1, REJECTED: 1 });
  assert.equal(report.exactNextTasks.length, 1); assert.match(report.exactNextTasks[0].task, /Execution Agent/);
  assert.equal(report.externalResearchPerformed, false); assert.equal(report.productionChanged, false); assert.equal(report.tenereAuthenticationExecuted, false);
});
