"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const report = require("../research/data/technical-research-factory-execution-planner.js").buildReport();

function fixture() {
  const batch = report.batches[0];
  const work = { ...batch.sourceWorkItems[0], maxAttempts: 2 };
  const executableBatch = { ...batch, sourceWorkItems: [work] };
  return { batch: executableBatch, work, history: factory.bootstrap(executableBatch) };
}

test("execution contracts expose closed outcomes and adapter capabilities", () => {
  assert.equal(factory.EXECUTION_SCHEMA_VERSION, 1);
  assert.equal(factory.OUTCOMES.length, 10);
  assert.equal(factory.acquisitionAdapters.syntheticAdapters.acquired.networkRequired, false);
  assert.deepEqual(factory.acquisitionAdapters.syntheticAdapters.auth.supportedOperations, ["attempt-existing-source"]);
});

for (const name of ["acquired", "noEvidence", "blocked", "auth", "notFound", "mismatch", "unknown", "partial", "transient", "permanent"]) {
  test(`synthetic ${name} outcome is typed and JSON-safe`, () => {
    const { history, work } = fixture();
    const adapter = factory.acquisitionAdapters.syntheticAdapters[name];
    if (name === "auth") assert.throws(() => factory.executeAttempt(history, work, adapter), /capability/);
    else {
      const result = factory.executeAttempt(history, work, adapter);
      assert.equal(result.result.outcome.outcome, ({ noEvidence: "NO-EVIDENCE", acquired: "ACQUIRED", blocked: "ACCESS-BLOCKED", notFound: "NOT-FOUND", mismatch: "SOURCE-MISMATCH", unknown: "APPLICABILITY-UNKNOWN", partial: "APPLICABILITY-PARTIAL", transient: "TRANSIENT-FAILURE", permanent: "PERMANENT-FAILURE" })[name]);
      assert.doesNotThrow(() => JSON.stringify(result));
    }
  });
}

test("successful acquisition maps to canonical attempt events and does not mean evidence", () => {
  const { history, work } = fixture();
  const result = factory.executeAttempt(history, work, factory.acquisitionAdapters.syntheticAdapters.acquired);
  assert.deepEqual(result.events.map(event => event.type).slice(-2), ["attempt-started", "attempt-completed"]);
  assert.equal(result.snapshot.sourceWorkItems[0].state, "COMPLETED");
  assert.equal(result.result.outcome.artifact.originClassification, "LOCAL-SYNTHETIC");
  assert.equal(result.result.outcome.observations[0].type, "DOCUMENT-ACQUIRED");
});

test("transient failures retry finitely and then exhaust", () => {
  let { history, work } = fixture();
  const adapter = factory.acquisitionAdapters.syntheticAdapters.transient;
  let first = factory.executeAttempt(history, work, adapter);
  assert.equal(first.snapshot.sourceWorkItems[0].state, "READY");
  assert.equal(first.snapshot.sourceWorkItems[0].remainingAttempts, 1);
  let second = factory.executeAttempt(first.events, work, adapter);
  assert.equal(second.snapshot.sourceWorkItems[0].state, "EXHAUSTED");
  assert.equal(second.snapshot.sourceWorkItems[0].remainingAttempts, 0);
  assert.throws(() => factory.executeAttempt(second.events, work, adapter), /not executable/);
});

test("blocked, permanent, mismatch and no-evidence outcomes never become readiness or evidence state", () => {
  for (const name of ["blocked", "permanent", "mismatch", "noEvidence"]) {
    const { history, work } = fixture();
    const result = factory.executeAttempt(history, work, factory.acquisitionAdapters.syntheticAdapters[name]);
    assert.equal(result.snapshot.sourceWorkItems[0].state, name === "blocked" ? "BLOCKED" : name === "permanent" ? "EXHAUSTED" : "COMPLETED");
    assert.equal(result.result.outcome.outcome === "NO-EVIDENCE", true === (name === "noEvidence"));
  }
});

test("duplicate completed execution and unsupported operation are rejected", () => {
  const { history, work } = fixture();
  const adapter = factory.acquisitionAdapters.syntheticAdapters.acquired;
  const done = factory.executeAttempt(history, work, adapter);
  assert.throws(() => factory.executeAttempt(done.events, work, adapter), /not executable/);
  assert.throws(() => factory.executeAttempt(history, work, { ...adapter, supportedOperations: ["other"] }), /does not support/);
});

test("adapter output is validated and cannot inject secrets or forged values", () => {
  const { history, work } = fixture();
  const malformed = { adapterId: "local.bad", adapterVersion: "1", supportedOperations: [work.operation], networkRequired: false, authenticationRequired: false, execute: () => ({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "bad", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "x", metadata: { token: "no" } }], artifact: null }) };
  assert.throws(() => factory.executeAttempt(history, work, malformed), /secret-shaped|prohibited/);
  const forged = { ...malformed, execute: () => ({ schemaVersion: 1, outcome: "NO-EVIDENCE", retryClass: "NON-RETRYABLE", reasonCode: "ok", observations: [], artifact: null, batchId: "batch.forged" }) };
  assert.throws(() => factory.executeAttempt(history, work, forged), /forged|secret-shaped|prohibited|identity/);
});

test("checkpoint and resume preserve completed acquisition without duplicate attempts", () => {
  const { history, work } = fixture();
  const done = factory.executeAttempt(history, work, factory.acquisitionAdapters.syntheticAdapters.acquired);
  const checkpoint = factory.createCheckpoint(done.events);
  const resumed = factory.resumeFromCheckpoint(checkpoint, done.events);
  assert.equal(resumed.eventCount, done.snapshot.eventCount);
  assert.deepEqual(resumed, done.snapshot);
  assert.equal(resumed.attempts.length, 1);
});

test("planner output and existing real fixtures remain safely gated", () => {
  assert.equal(report.fixtureResults["honda-cbr500r"].decision, "DEFERRED");
  assert.equal(report.fixtureResults["yamaha-mt09"].decision, "DEFERRED");
  assert.equal(report.fixtureResults["harley-sportster"].decision, "REJECTED");
  assert.equal(report.fixtureResults["tenere-service"].decision, "BLOCKED");
  const original = JSON.stringify(report.batches);
  factory.validateResearchBatch(report.batches[0].batch);
  assert.equal(JSON.stringify(report.batches), original);
});
