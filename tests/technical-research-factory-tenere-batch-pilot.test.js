"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const pilot = require("../research/data/technical-research-factory-tenere-batch-pilot.js");

test("Ténéré pilot design binds the exact target, prospect and applicability", () => {
  const design = pilot.buildDesign();
  assert.equal(design.target.catalogVariantKey, "yamaha.tenere-700.gen1");
  assert.deepEqual(design.target.years, { kind: "EXACT", from: 2019, to: 2019 });
  assert.deepEqual(design.target.markets, { state: "KNOWN", values: ["EU"] });
  assert.equal(design.prospect.publication, "BW3-F8197-E0");
  assert.equal(design.prospect.state, "PARTIAL");
  assert.equal(design.prospect.executionReady, false);
  assert.equal(design.budgets.targets, 1); assert.equal(design.budgets.sourceWorkItems, 1); assert.equal(design.budgets.maxAttemptsPerWorkItem, 1);
});

test("real Ténéré readiness remains blocked and distinct from the synthetic path", () => {
  assert.equal(pilot.blockedProspect.id, "yamaha.tenere700.service.bw3-f8197-e0");
  assert.equal(pilot.blockedProspect.authenticationState, "PARTIAL");
  assert.equal(factory.evaluateReadiness(pilot.target, pilot.blockedProspect).passed, false);
  assert.notEqual(pilot.blockedProspect.id, pilot.syntheticProspect.id);
});

test("synthetic design run pauses at the declared point and validates checkpoint resume", () => {
  const run = pilot.buildSyntheticRun();
  assert.equal(run.acquired.result.outcome.outcome, "ACQUIRED");
  assert.equal(run.pausedEvents.at(-1).type, "batch-paused");
  assert.equal(run.checkpoint.eventCount, run.pausedEvents.length);
  assert.equal(run.resumedSnapshot.batch.state, "PAUSED");
  assert.equal(factory.orchestrationJson.canonicalSerialize(run.uninterruptedSnapshot), factory.orchestrationJson.canonicalSerialize(run.resumedAfterResumeSnapshot));
  assert.equal(run.resumedAfterResumeSnapshot.batch.state, "ACTIVE");
});

test("resume cannot duplicate completed work or exceed the one-attempt budget", () => {
  const run = pilot.buildSyntheticRun(); const resumedWork = run.resumedAfterResumeSnapshot.sourceWorkItems[0];
  assert.equal(resumedWork.state, "COMPLETED"); assert.equal(resumedWork.attemptsUsed, 1); assert.equal(resumedWork.remainingAttempts, 0);
  assert.throws(() => factory.executeAttempt(run.resumedEvents, resumedWork, {}), /not executable/);
  assert.equal(run.resumedAfterResumeSnapshot.attempts.length, 1);
});

test("future-ready path traverses acquisition, extraction, queue, decisions and processing once", () => {
  const run = pilot.buildSyntheticRun();
  assert.equal(run.extracted.disposition, "CANDIDATES-PRODUCED");
  assert.equal(run.queue.entries.length, 2); assert.equal(run.decisions.decisions.length, 1); assert.equal(run.processing.records.length, 1);
  assert.equal(run.processing.records[0].state, "ACCEPTED-FOR-PROCESSING");
  assert.equal(run.processing.records[0].candidate.rawValue, run.queue.entries[0].candidate.rawValue);
});

test("pilot outputs are deterministic, immutable and preserve upstream inputs", () => {
  const first = pilot.buildSyntheticRun(); const second = pilot.buildSyntheticRun();
  assert.deepEqual(second.processing, first.processing); assert.deepEqual(second.resumedAfterResumeSnapshot, first.resumedAfterResumeSnapshot);
  assert.equal(Object.isFrozen(first.checkpoint), true); assert.equal(Object.isFrozen(first.processing), true);
  assert.equal(first.processing.records[0].candidate.rawUnit, first.queue.entries[0].candidate.rawUnit);
  assert.equal(first.initialEvents.length, 4); assert.equal(first.acquired.snapshot.attempts.length, 1);
});

test("checkpoint tampering and non-ready real prospect remain fail closed", () => {
  const run = pilot.buildSyntheticRun();
  assert.throws(() => factory.resumeFromCheckpoint({ ...run.checkpoint, eventDigest: "0".repeat(64) }, run.pausedEvents), /incompatible|verification/);
  assert.ok(pilot.buildDesign().stopConditions.some(item => item.includes("real prospect remains not execution-ready")));
});

test("pilot design stays outside production runtime and creates no evidence or coverage", () => {
  const root = path.resolve(__dirname, "..");
  const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /tenere-batch-pilot/));
  const design = pilot.buildDesign(); assert.ok(design.acceptance.every(item => !/coverage|evidence|production.*change/i.test(item) || /no evidence|coverage|production.*change/i.test(item)));
});
