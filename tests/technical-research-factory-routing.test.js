"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const runner = require("../research/factory/safe-stage-runner.js");
const routing = require("../research/factory/routing.js");
const waveC = require("../research/data/technical-research-factory-routing.js");
const waveB = require("../research/data/technical-research-factory-safe-stage-runner.js");
const waveA = require("../research/data/technical-research-factory-throughput-baseline.js");
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/technical-research-factory-routing.json"), "utf8"));

test("mixed fixture routes GREEN, YELLOW and RED deterministically", () => {
  const report = waveC.buildReport();
  assert.deepEqual(report, stored);
  assert.deepEqual(report.assertions, { greenCount: 1, yellowCount: 1, redCount: 6, greenExcludedFromExceptions: true, runnerAgreement: true, duplicateInputsVisible: true, noAuthorizationCreated: true, noRuleActivated: true, evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, cloudChanged: false, externalSideEffects: false });
  assert.equal(report.exceptionProjection.records.length, 7);
  assert.equal(report.exceptionProjection.groups.length, 6);
});

test("GREEN requires an advanced runner result and YELLOW preserves the human boundary", () => {
  const report = waveC.buildReport();
  const green = report.routed.routes.find(item => item.route === "GREEN");
  const yellow = report.routed.routes.find(item => item.route === "YELLOW");
  assert.equal(green.reasonCodes[0], "SAFE-RUNNER-ADVANCED");
  assert.equal(green.nextLegalAction, "STOP-BEFORE-PRODUCTION-MATERIALIZATION");
  assert.equal(yellow.reasonCodes[0], "PROMOTION-REVIEW-REQUIRED");
  assert.equal(yellow.nextLegalAction, "SUPPLY-EXISTING-PROMOTION-REVIEW-DECISION");
  assert.equal(yellow.route, "YELLOW");
  assert.equal(yellow.externalSideEffects, false);
});

test("structural failures route RED and retain exact reasons", () => {
  const report = waveC.buildReport();
  const redReasons = report.routed.routes.filter(item => item.route === "RED").flatMap(item => item.reasonCodes);
  for (const reason of ["MISSING-UPSTREAM-ARTIFACT", "DOWNSTREAM-CONTRACT-REJECTED", "PROMOTION-DECISION-MISMATCH", "UNSUPPORTED-STAGE", "DUPLICATE-SEMANTIC-INPUT"]) assert.ok(redReasons.includes(reason));
  assert.equal(report.routed.duplicateSemanticInputCount, 2);
  assert.equal(report.exceptionProjection.records.filter(item => item.reason === "DUPLICATE-SEMANTIC-INPUT").length, 2);
});

test("exceptions are grouped without hiding records, and GREEN is excluded", () => {
  const report = waveC.buildReport();
  const projection = report.exceptionProjection;
  assert.ok(projection.groups.every(group => group.recordIds.length > 0));
  assert.ok(projection.records.every(record => record.route === "YELLOW" || record.route === "RED"));
  assert.equal(projection.records.some(record => record.route === "GREEN"), false);
  assert.equal(projection.records[0].route, "YELLOW");
  assert.equal(projection.records.slice(1).every(record => record.route === "RED"), true);
  assert.deepEqual(projection, require("../research/factory/exception-projection.js").project(report.routed));
});

test("routing is order-independent and inputs remain immutable", () => {
  const inputs = waveC.buildInputs();
  const before = JSON.stringify(inputs.map(item => item.input));
  const first = routing.routeBatch(inputs);
  const second = routing.routeBatch([...inputs].reverse());
  assert.deepEqual(second, first);
  assert.equal(JSON.stringify(inputs.map(item => item.input)), before);
  first.routes.forEach(item => assert.equal(item.id, factory.routingResultId ? factory.routingResultId(item) : item.id));
});

test("router agrees with Wave B runner and does not alter historical metrics", () => {
  const report = waveC.buildReport();
  const waveBReport = waveB.buildReport();
  const waveAReport = waveA.buildReport();
  const green = report.routed.routes.find(item => item.route === "GREEN");
  const yellow = report.routed.routes.find(item => item.route === "YELLOW");
  assert.equal(green.reasonCodes[0], "SAFE-RUNNER-ADVANCED");
  assert.equal(yellow.reasonCodes[0], waveBReport.pending.stopReason);
  assert.equal(waveAReport.metrics.autoAdvanceRate.measurementState, "NOT-MEASURED");
  assert.equal(waveAReport.metrics.autoAdvanceRate.value, null);
  assert.equal(report.batchSummary.metrics.autoAdvanceRate.value, 1);
  assert.equal(report.batchSummary.metrics.humanTouchRate.value, 0.125);
});
