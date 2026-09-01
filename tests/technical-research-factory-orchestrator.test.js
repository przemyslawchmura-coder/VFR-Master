"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const readinessInventory = require("../research/data/source-prospect-authentication-quality-reassessment.js");
const yamaha = require("../research/data/yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js").runBatch();
const orchestratorReport = require("../research/data/technical-research-factory-orchestrator-foundation.js");
const storedOrchestratorReport = require("../research/reports/technical-research-factory-orchestrator-foundation.json");

const known = values => ({ state: "KNOWN", values });
const unknown = () => ({ state: "UNKNOWN", values: [] });
const scope = (overrides = {}) => ({ schemaVersion: 1, model: known(["fixture.model"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]), ...overrides });
const fixtureTarget = (overrides = {}) => factory.validateResearchTarget({ schemaVersion: 1, id: "target.fixture.model.2021.eu", catalogVariantKey: "fixture.model", manufacturer: "Fixture", family: "Fixture Model", scope: scope(), sourcePriorityPolicyId: "tier-ab-practical-marginal-v1", serviceCoreBaseline: { verified: 0, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE", ...overrides });
const fixtureProspect = (target, overrides = {}) => factory.validateSourceProspect({ schemaVersion: 1, id: "prospect.fixture.manual", targetId: target.id, documentClass: "official-owner-manual", authority: { name: "Fixture Motor", state: "KNOWN" }, documentIdentity: { title: "Fixture Manual", state: "KNOWN" }, publication: { relationship: "SINGLE", identifiers: [{ value: "FIX-1", namespace: "Fixture", region: "EU", type: "publication-code", proofState: "AUTHENTICATED" }] }, officialLocations: [{ host: "manuals.fixture.invalid", path: "/FIX-1.pdf" }], sourceTier: "A", authenticationState: "AUTHENTICATED", accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: target.scope, exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "HIGH", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "bounded fixture", ...overrides });

function records(target = fixtureTarget(), prospect = fixtureProspect(target), maxAttempts = 2) {
  const built = factory.createResearchBatch({ purpose: "orchestrator-foundation-test", policyId: "bounded-v1", targets: [target], maxAttemptsPerWorkItem: maxAttempts });
  const targetWork = factory.createTargetWork(built.batch, target);
  const sourceWork = factory.createSourceWorkItem({ batch: built.batch, targetWork, target, prospect, operation: "authenticate-existing-prospect", maxAttempts });
  return { batch: built.batch, target, targetWork, prospect, sourceWork };
}
function initialEvents(records) {
  let events = [];
  events = factory.events.appendEvent(events, { batchId: records.batch.id, type: "batch-created", payload: { batch: records.batch } });
  events = factory.events.appendEvent(events, { batchId: records.batch.id, type: "target-added", payload: { targetWork: records.targetWork } });
  events = factory.events.appendEvent(events, { batchId: records.batch.id, type: "source-work-created", payload: { sourceWork: records.sourceWork } });
  events = factory.events.appendEvent(events, { batchId: records.batch.id, type: "batch-resumed" });
  return events;
}

test("orchestration schema and stable semantic IDs are deterministic", () => {
  const target = fixtureTarget();
  const first = records(target);
  const second = records(target);
  assert.equal(factory.ORCHESTRATOR_SCHEMA_VERSION, 1);
  assert.equal(first.batch.id, second.batch.id);
  assert.equal(first.targetWork.id, second.targetWork.id);
  assert.equal(first.sourceWork.id, second.sourceWork.id);
  assert.equal(factory.createResearchAttempt(first.sourceWork, 1).id, factory.createResearchAttempt(second.sourceWork, 1).id);
  assert.notEqual(factory.ids.sourceWorkId({ targetWorkId: first.targetWork.id, prospectId: first.prospect.id, operation: "acquire" }), first.sourceWork.id);
  assert.throws(() => factory.ids.batchId({ purpose: "x", policyId: "p", targetIds: [], maxAttemptsPerWorkItem: 1 }), /required/);
});

test("batch identity ignores target array order but changes with semantic policy", () => {
  const a = fixtureTarget();
  const b = fixtureTarget({ id: "target.fixture.model.2022.us", scope: scope({ years: { kind: "EXACT", from: 2022, to: 2022 }, markets: known(["US"]) }) });
  const one = factory.createResearchBatch({ purpose: "same", policyId: "p1", targets: [a, b], maxAttemptsPerWorkItem: 2 }).batch;
  const two = factory.createResearchBatch({ purpose: "same", policyId: "p1", targets: [b, a], maxAttemptsPerWorkItem: 2 }).batch;
  const three = factory.createResearchBatch({ purpose: "same", policyId: "p2", targets: [a, b], maxAttemptsPerWorkItem: 2 }).batch;
  const four = factory.createResearchBatch({ purpose: "same", policyId: "p1", targets: [a, b], maxAttemptsPerWorkItem: 3 }).batch;
  assert.equal(one.id, two.id); assert.notEqual(one.id, three.id); assert.notEqual(one.id, four.id);
});

test("events and snapshots replay byte-equivalently without mutation", () => {
  const r = records(); const events = initialEvents(r); const before = JSON.stringify(events);
  const first = factory.reduceEvents(events); const second = factory.reduceEvents(JSON.parse(JSON.stringify(events)));
  assert.equal(factory.orchestrationJson.canonicalSerialize(first), factory.orchestrationJson.canonicalSerialize(second));
  assert.equal(JSON.stringify(events), before); assert.equal(first.batch.state, "ACTIVE"); assert.equal(first.sourceWorkItems[0].state, "READY");
});

test("JSON safety rejects undefined, non-finite, Dates and circular data", () => {
  const r = records();
  for (const payload of [{ value: undefined }, { value: NaN }, { value: Infinity }, { value: new Date(0) }]) assert.throws(() => factory.events.createEvent({ batchId: r.batch.id, sequence: 1, type: "batch-resumed", payload }), /JSON|undefined|finite/);
  const circular = {}; circular.self = circular;
  assert.throws(() => factory.events.createEvent({ batchId: r.batch.id, sequence: 1, type: "batch-resumed", payload: circular }), /circular/);
});

test("bounded attempts retry once and then exhaust without reset", () => {
  const r = records(); let events = initialEvents(r);
  const a1 = factory.createResearchAttempt(r.sourceWork, 1);
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt: a1 } });
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-failed", payload: { attemptId: a1.id, result: { reason: "fixture failure" } } });
  assert.equal(factory.reduceEvents(events).sourceWorkItems[0].state, "READY");
  const a2 = factory.createResearchAttempt(r.sourceWork, 2);
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt: a2 } });
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-failed", payload: { attemptId: a2.id } });
  const snapshot = factory.reduceEvents(events);
  assert.equal(snapshot.sourceWorkItems[0].state, "EXHAUSTED"); assert.equal(snapshot.sourceWorkItems[0].attemptsUsed, 2); assert.equal(snapshot.sourceWorkItems[0].remainingAttempts, 0);
  const a3 = { ...factory.createResearchAttempt(r.sourceWork, 3) };
  const invalid = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt: a3 } });
  assert.throws(() => factory.reduceEvents(invalid), /not ready|exhausted/);
});

test("invalid and impossible transitions fail closed", () => {
  const r = records(); let events = initialEvents(r); const attempt = factory.createResearchAttempt(r.sourceWork, 1);
  const completedBeforeStart = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-completed", payload: { attemptId: attempt.id } });
  assert.throws(() => factory.reduceEvents(completedBeforeStart), /does not exist/);
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt } });
  const duplicate = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt } });
  assert.throws(() => factory.reduceEvents(duplicate), /not ready/);
  const prematureComplete = factory.events.appendEvent(events, { batchId: r.batch.id, type: "batch-completed" });
  assert.throws(() => factory.reduceEvents(prematureComplete), /unresolved/);
});

test("checkpoint resume equals uninterrupted replay and prevents duplicate work", () => {
  const r = records(); let events = initialEvents(r); const attempt = factory.createResearchAttempt(r.sourceWork, 1);
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt } });
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-completed", payload: { attemptId: attempt.id, result: { outcome: "fixture-only" } } });
  const checkpoint = factory.createCheckpoint(events);
  let continued = factory.events.appendEvent(events, { batchId: r.batch.id, type: "checkpoint-created", payload: { checkpointId: checkpoint.id } });
  continued = factory.events.appendEvent(continued, { batchId: r.batch.id, type: "batch-completed" });
  assert.deepEqual(factory.resumeFromCheckpoint(checkpoint, continued), factory.reduceEvents(continued));
  const duplicate = factory.events.appendEvent(continued.slice(0, 2), { batchId: r.batch.id, type: "target-added", payload: { targetWork: r.targetWork } });
  assert.throws(() => factory.reduceEvents(duplicate), /duplicate/);
  const tampered = JSON.parse(JSON.stringify(continued)); tampered[0].payload.batch.purpose = "tampered";
  assert.throws(() => factory.resumeFromCheckpoint(checkpoint, tampered), /incompatible/);
});

test("checkpoint schema and Foundation contract incompatibility fail closed", () => {
  const r = records(); const events = initialEvents(r); const checkpoint = factory.createCheckpoint(events);
  assert.throws(() => factory.resumeFromCheckpoint({ ...checkpoint, schemaVersion: 2 }, events), /schemaVersion/);
  assert.throws(() => factory.resumeFromCheckpoint({ ...checkpoint, foundationContractVersion: 2 }, events), /Foundation/);
});

test("Foundation readiness and applicability dimensions cannot be upgraded", () => {
  const target = fixtureTarget();
  const cases = [
    ["abs", scope({ abs: unknown() })], ["transmission", scope({ transmissions: known(["dct"]) })],
    ["market", scope({ markets: known(["US"]) })], ["year", scope({ years: { kind: "EXACT", from: 2022, to: 2022 } })],
    ["equipment", scope({ equipment: known(["SP"]) })]
  ];
  for (const [, applicability] of cases) {
    const prospect = fixtureProspect(target, { applicability, readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" });
    const r = records(target, prospect); const snapshot = factory.reduceEvents(initialEvents(r));
    assert.equal(r.sourceWork.readiness.passed, false); assert.notEqual(snapshot.sourceWorkItems[0].state, "READY");
  }
  assert.equal(target.scope.abs.values[0], false);
});

test("blocked and mirror-only sources remain blocked", () => {
  const target = fixtureTarget();
  for (const access of ["ACCESS-BLOCKED-AUTH", "MIRROR-ONLY"]) {
    const prospect = fixtureProspect(target, { accessibility: { metadata: access, fullContent: access }, readinessClassification: access === "MIRROR-ONLY" ? "SOURCE-IDENTITY-PARTIAL" : "ACCESS-BLOCKED" });
    const r = records(target, prospect); const snapshot = factory.reduceEvents(initialEvents(r));
    assert.equal(snapshot.sourceWorkItems[0].state, "BLOCKED");
    const attempt = factory.createResearchAttempt(r.sourceWork, 1);
    const invalid = factory.events.appendEvent(initialEvents(r), { batchId: r.batch.id, type: "attempt-started", payload: { attempt } });
    assert.throws(() => factory.reduceEvents(invalid), /not ready/);
  }
});

function realFixtureRecords() {
  const mtTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const yamahaProspect = factory.adapters.fromLegacyAcquiredSource(yamaha.sources[0], mtTarget);
  const hondaTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  const hondaProspect = factory.adapters.fromLegacyAcquiredSource(honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00"), hondaTarget);
  const harleyTarget = factory.adapters.fromLegacyResearchTarget(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  const harleyProspect = factory.adapters.fromLegacyAcquiredSource(harley.source, harleyTarget);
  const tenereLegacy = readinessInventory.prospects.find(item => item.id === "yamaha.tenere700.service.bw3-f8197-e0");
  const tenereTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: tenereLegacy.catalogVariantKey, manufacturer: "Yamaha", family: "Ténéré 700", generation: "I", years: tenereLegacy.years, markets: tenereLegacy.markets, transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const tenereProspect = factory.adapters.fromLegacySourceProspect(tenereLegacy, tenereTarget);
  return { yamaha: [mtTarget, yamahaProspect], honda: [hondaTarget, hondaProspect], harley: [harleyTarget, harleyProspect], tenere: [tenereTarget, tenereProspect] };
}

test("existing Honda Yamaha Harley and Ténéré fixtures integrate without mutation", () => {
  const fixtures = realFixtureRecords();
  const expected = { yamaha: "EXHAUSTED", honda: "EXHAUSTED", harley: "REJECTED", tenere: "BLOCKED" };
  for (const [name, [target, prospect]] of Object.entries(fixtures)) {
    const before = JSON.stringify({ target, prospect }); const r = records(target, prospect); const snapshot = factory.reduceEvents(initialEvents(r));
    assert.equal(snapshot.sourceWorkItems[0].state, expected[name]); assert.equal(JSON.stringify({ target, prospect }), before);
  }
  assert.equal(fixtures.tenere[1].authenticationState, "REGISTERED-NOT-REAUTHENTICATED");
});

test("completed work cannot restart and completed batch is terminal", () => {
  const r = records(); let events = initialEvents(r); const attempt = factory.createResearchAttempt(r.sourceWork, 1);
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-started", payload: { attempt } });
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "attempt-completed", payload: { attemptId: attempt.id } });
  events = factory.events.appendEvent(events, { batchId: r.batch.id, type: "batch-completed" });
  assert.equal(factory.reduceEvents(events).batch.state, "COMPLETED");
  const restart = factory.events.appendEvent(events, { batchId: r.batch.id, type: "batch-resumed" });
  assert.throws(() => factory.reduceEvents(restart), /only PLANNED or PAUSED/);
});

test("orchestrator report is reproducible, isolated and selects one planner NEXT", () => {
  const report = orchestratorReport.buildReport();
  assert.deepEqual(report, storedOrchestratorReport);
  assert.equal(report.fixtures.length, 4); assert.ok(report.fixtures.every(item => item.replayVerified));
  assert.equal(report.serviceCoreFieldCount, 44); assert.equal(report.exactNextTasks.length, 1);
  assert.match(report.exactNextTasks[0].task, /Execution Planner/);
  assert.equal(report.externalResearchPerformed, false); assert.equal(report.productionChanged, false); assert.equal(report.tenereAuthenticationExecuted, false);
});
