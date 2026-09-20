"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const json = require("../research/factory/json.js");
const pipeline = require("../research/factory/automatic-pipeline.js");
const waveH = require("../research/data/technical-research-factory-large-batch.js");
const waveG = require("../research/data/technical-research-factory-autonomous-batch.js");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");

const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-large-batch.json", "utf8"));

test("Wave H selection accounts for every real repository-backed candidate", () => {
  const report = waveH.buildReport();
  assert.equal(report.datasetSelection.candidateCount.value, 32);
  assert.equal(report.datasetSelection.includedCount.value, 32);
  assert.equal(report.datasetSelection.excludedCount.value, 0);
  assert.deepEqual(report.datasetSelection.sourceSets, { bmwC600: { value: 24, measurementState: "MEASURED", scope: "Wave H selected repository-backed dataset", reason: "Directly observed batch execution" }, ducatiMonster937: { value: 7, measurementState: "MEASURED", scope: "Wave H selected repository-backed dataset", reason: "Directly observed batch execution" }, hondaCbr500r: { value: 1, measurementState: "MEASURED", scope: "Wave H selected repository-backed dataset", reason: "Directly observed batch execution" } });
  assert.ok(report.datasetSelection.includedRecords.every(record => record.legitimateRepositoryBacked && record.provenanceAvailable && record.authorizationAvailable));
});

test("Wave H has exact terminal accounting and continues through exceptions", () => {
  const report = waveH.buildReport();
  assert.deepEqual([report.assertions.green, report.assertions.yellow, report.assertions.red], [6, 1, 25]);
  assert.equal(report.assertions.includedCount, 32);
  assert.equal(report.legitimate.result.records.length, 32);
  assert.equal(report.legitimate.result.exceptionProjection.records.length, 26);
  assert.equal(report.legitimate.result.exceptionProjection.groups.length, 26);
  assert.equal(report.assertions.batchCompletedWithoutOperatorInterruption, true);
  assert.equal(report.assertions.newHumanAuthorizationsCreated, 0);
});

test("Wave H keeps conditions/applicability distinct and exposes capability gaps", () => {
  const report = waveH.buildReport();
  const records = report.legitimate.result.records;
  assert.equal(records.filter(record => record.hygiene.status === "EXACT-DUPLICATE").length, 0);
  assert.equal(records.filter(record => record.hygiene.status === "CONFLICTING-DUPLICATE").length, 0);
  assert.equal(records.filter(record => record.routingResult.reasonCodes.includes("UNSUPPORTED-RULE-CAPABILITY")).length, 25);
  assert.equal(records.filter(record => record.routingResult.route === "YELLOW").length, 1);
  assert.ok(records.every(record => record.routingResult.externalSideEffects === false));
});

test("Wave H is permutation-independent and preserves the Wave G hostile regression", () => {
  const inputs = waveH.buildLegitimateInputs();
  const first = pipeline.runAutonomousBatch(inputs);
  const reversed = pipeline.runAutonomousBatch([...inputs].reverse());
  const shuffled = pipeline.runAutonomousBatch([inputs[17], inputs[3], inputs[31], inputs[9], inputs[0], inputs[21], inputs[12], inputs[6], inputs[28], inputs[14], inputs[25], inputs[1], inputs[19], inputs[7], inputs[30], inputs[10], inputs[23], inputs[5], inputs[16], inputs[2], inputs[27], inputs[11], inputs[20], inputs[4], inputs[26], inputs[8], inputs[15], inputs[22], inputs[13], inputs[29], inputs[18], inputs[24]]);
  assert.deepEqual(first, reversed);
  assert.deepEqual(first, shuffled);
  const hostile = pipeline.runAutonomousBatch(waveE.buildInputs());
  assert.deepEqual(hostile.records.filter(record => record.routingResult.route).map(record => record.routingResult.route).reduce((counts, route) => { counts[route] += 1; return counts; }, { GREEN: 0, YELLOW: 0, RED: 0 }), { GREEN: 3, YELLOW: 2, RED: 4 });
  assert.equal(json.canonicalSerialize(first), json.canonicalSerialize(reversed));
});

test("Wave H report is deterministic and read-only", () => {
  const report = waveH.buildReport();
  assert.deepEqual(report, stored);
  assert.equal(report.assertions.externalSideEffects, false);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.evidenceChanged, false);
  assert.equal(waveG.buildReport().assertions.hostileGreen, 3);
});
