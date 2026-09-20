"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const pipeline = require("../research/factory/automatic-pipeline.js");
const waveA = require("../research/data/technical-research-factory-throughput-baseline.js");
const waveB = require("../research/data/technical-research-factory-safe-stage-runner.js");
const waveC = require("../research/data/technical-research-factory-routing.js");
const waveD = require("../research/data/technical-research-factory-rule-library.js");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/technical-research-factory-automatic-pipeline.json"), "utf8"));

test("Wave E stored report is deterministic and has exact mixed-pipeline accounting", () => {
  const report = waveE.buildReport();
  assert.deepEqual(report, stored);
  assert.equal(report.inputCount, 9);
  assert.deepEqual(report.assertions, { greenCount: 3, yellowCount: 2, redCount: 4, existingAuthorizationsConsumed: 3, newAuthorizationsCreated: 0, greenExcludedFromExceptions: true, allInputsAccountedFor: true, noAuthorizationFabricated: true, noRuleActivated: true, rawValuesPreserved: true, noEvidenceRows: true, productionChanged: false, serviceCoreChanged: false, cloudChanged: false, externalSideEffects: false });
  assert.equal(report.result.records.length, report.inputCount);
  assert.equal(report.result.exceptionProjection.records.length, 6);
});

test("GREEN records compose applied rules, existing authorization, runner advancement and routing", () => {
  const report = waveE.buildReport();
  const green = report.result.records.filter(record => record.routingResult.route === "GREEN");
  assert.equal(green.length, 3);
  green.forEach(record => {
    assert.equal(record.ruleEvaluation.state, "APPLIED");
    assert.equal(record.runnerResult.state, "ADVANCED");
    assert.equal(record.runnerResult.humanAuthorizationConsumed, true);
    assert.equal(record.routingResult.reasonCodes[0], "SAFE-RUNNER-ADVANCED");
    assert.equal(record.externalSideEffects, false);
  });
  assert.equal(green.reduce((sum, record) => sum + record.runnerResult.stageEnvelopes.filter(envelope => envelope.executionState === "ADVANCED").length, 0), 9);
});

test("YELLOW and RED records stop before the runner when rule semantics require it", () => {
  const report = waveE.buildReport();
  const yellow = report.result.records.filter(record => record.routingResult.route === "YELLOW");
  const red = report.result.records.filter(record => record.routingResult.route === "RED");
  assert.equal(yellow.length, 2);
  assert.ok(yellow.some(record => record.ruleEvaluation.reasonCode === "AMBIGUOUS-COMPOUND-VALUE"));
  assert.ok(yellow.some(record => record.ruleEvaluation.reasonCode === "RULE-NOT-APPLICABLE"));
  assert.ok(yellow.every(record => record.runnerResult === null));
  assert.equal(red.length, 4);
  assert.ok(red.every(record => record.runnerResult === null));
  assert.ok(red.some(record => record.ruleEvaluation.reasonCode === "DUPLICATE-SEMANTIC-INPUT"));
  assert.ok(red.some(record => record.ruleEvaluation.reasonCode === "RAW-VALUE-MISSING"));
});

test("existing authorizations are reused and no new decisions are created", () => {
  const report = waveE.buildReport();
  assert.equal(report.assertions.existingAuthorizationsConsumed, 3);
  assert.equal(report.assertions.newAuthorizationsCreated, 0);
  assert.equal(report.batchSummary.aggregate.newHumanAuthorizationsCreated.value, 0);
  assert.equal(report.batchSummary.aggregate.evidenceRowsCreated.value, 0);
  assert.equal(report.batchSummary.aggregate.productionWrites.value, 0);
});

test("exception projection preserves every non-GREEN record and lineage fields", () => {
  const report = waveE.buildReport();
  const exceptions = report.result.exceptionProjection;
  assert.equal(exceptions.records.length, 6);
  assert.ok(exceptions.records.every(record => record.route === "YELLOW" || record.route === "RED"));
  assert.ok(exceptions.records.every(record => Object.prototype.hasOwnProperty.call(record, "recordId") && Object.prototype.hasOwnProperty.call(record, "upstreamDigest")));
  assert.equal(exceptions.records.filter(record => record.reason === "RULE-EVALUATION-REJECTED").length, 2);
  assert.equal(exceptions.records.filter(record => record.reason === "DUPLICATE-SEMANTIC-INPUT").length, 2);
  assert.ok(exceptions.records.every(record => record.failedInvariants.length > 0));
  assert.equal(exceptions.groups.reduce((sum, group) => sum + group.recordIds.length, 0), exceptions.records.length);
});

test("permutation, duplicate visibility and upstream immutability are deterministic", () => {
  const inputs = waveE.buildInputs();
  const before = JSON.stringify(inputs);
  const first = pipeline.runBatch(inputs);
  const second = pipeline.runBatch([...inputs].reverse());
  assert.deepEqual(second, first);
  assert.equal(JSON.stringify(inputs), before);
  const duplicateRoutes = first.routed.routes.filter(route => route.reasonCodes.includes("DUPLICATE-SEMANTIC-INPUT"));
  assert.equal(duplicateRoutes.length, 2);
  assert.equal(first.routed.duplicateSemanticInputCount, 2);
});

test("observed metrics are measured honestly and historical Wave A remains unknown", () => {
  const report = waveE.buildReport();
  assert.equal(report.batchSummary.metrics.autoAdvanceRate.value, 3 / 9);
  assert.equal(report.batchSummary.metrics.humanTouchRate.value, 2 / 9);
  assert.equal(report.batchSummary.metrics.exceptionRate.value, 6 / 9);
  assert.equal(report.batchSummary.metrics.automaticSafeRecordRate.value, 3 / 9);
  assert.equal(report.batchSummary.metrics.sourceReuseRate.value, null);
  assert.equal(waveA.buildReport().metrics.autoAdvanceRate.measurementState, "NOT-MEASURED");
  assert.equal(waveA.buildReport().metrics.autoAdvanceRate.value, null);
});

test("Wave A-D reports remain semantically unchanged and Wave E is read-only", () => {
  const reports = [
    [waveA, "technical-research-factory-throughput-baseline"],
    [waveB, "technical-research-factory-safe-stage-runner"],
    [waveC, "technical-research-factory-routing"],
    [waveD, "technical-research-factory-rule-library"]
  ];
  reports.forEach(([module, name]) => assert.deepEqual(module.buildReport(), JSON.parse(fs.readFileSync(path.join(__dirname, `../research/reports/${name}.json`), "utf8"))));
  const report = waveE.buildReport();
  assert.equal(report.assertions.noAuthorizationFabricated, true);
  assert.equal(report.assertions.noEvidenceRows, true);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.externalSideEffects, false);
  assert.equal(factory.AUTOMATIC_PIPELINE_SCHEMA_VERSION, 1);
});
