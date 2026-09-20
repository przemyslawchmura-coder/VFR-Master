"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const json = require("../research/factory/json.js");
const hygiene = require("../research/factory/input-hygiene.js");
const pipeline = require("../research/factory/automatic-pipeline.js");
const waveG = require("../research/data/technical-research-factory-autonomous-batch.js");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");

const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-autonomous-batch.json", "utf8"));

test("input hygiene distinguishes unique, conditional, applicability and exact duplicate records", () => {
  const legitimate = waveG.buildLegitimateInputs();
  const conditional = { ...legitimate[4], input: { ...legitimate[4].input, condition: "driver with passenger, with cold tire" } };
  const applicability = { ...legitimate[1], input: { ...legitimate[1].input, applicability: { ...legitimate[1].input.applicability, ruleApplicable: false } } };
  const result = hygiene.analyzeBatch([...legitimate, conditional, applicability]);
  assert.equal(result.records.filter(item => item.status === "VALID-UNIQUE-RECORD").length, 5);
  assert.equal(result.records.filter(item => item.status === "DISTINCT-CONDITIONAL-RECORD").length, 2);
  assert.equal(result.records.filter(item => item.status === "DISTINCT-APPLICABILITY-RECORD").length, 2);
  const hostile = hygiene.analyzeBatch(waveE.buildInputs());
  assert.equal(hostile.records.filter(item => item.status === "EXACT-DUPLICATE").length, 2);
});

test("conflicting duplicates fail closed and retain both occurrences", () => {
  const items = waveG.buildLegitimateInputs();
  const conflict = { ...items[1], input: { ...items[1].input, rawValue: "23 lb/ft (31 Nm)" } };
  const result = pipeline.runAutonomousBatch([items[1], conflict]);
  assert.equal(result.records.length, 2);
  assert.equal(result.records.filter(item => item.hygiene.status === "CONFLICTING-DUPLICATE").length, 2);
  assert.ok(result.records.every(item => item.routingResult.route === "RED"));
  assert.ok(result.records.every(item => item.pipelineRecord === null));
  assert.ok(result.records.every(item => item.routingResult.sourceProvenance && item.routingResult.upstreamIdentity));
});

test("autonomous batch continues after record-local exceptions", () => {
  const result = pipeline.runAutonomousBatch(waveG.buildLegitimateInputs());
  assert.equal(result.records.length, 7);
  assert.equal(result.records.filter(item => item.routingResult.route === "GREEN").length, 6);
  assert.equal(result.records.filter(item => item.routingResult.route === "YELLOW").length, 1);
  assert.equal(result.records.filter(item => item.routingResult.route === "RED").length, 0);
  assert.equal(result.metrics.batchCompletedWithoutOperatorInterruption, true);
  assert.equal(result.metrics.newHumanAuthorizationsCreated, 0);
  assert.equal(result.externalSideEffects, false);
});

test("hostile Wave E fixture remains fail-closed and separate from legitimate metrics", () => {
  const report = waveG.buildReport();
  assert.deepEqual([report.assertions.hostileGreen, report.assertions.hostileYellow, report.assertions.hostileRed], [3, 2, 4]);
  assert.deepEqual([report.assertions.legitimateGreen, report.assertions.legitimateYellow, report.assertions.legitimateRed], [6, 1, 0]);
  assert.equal(report.hostile.batchSummary.fixtures[0].comparability, "HOSTILE-FAIL-CLOSED-FIXTURE");
  assert.equal(report.legitimate.batchSummary.fixtures[0].comparability, "EXISTING-REPOSITORY-BACKED-LEGITIMATE-SUBSET");
  assert.equal(report.assertions.newHumanAuthorizationsCreated, 0);
});

test("autonomous batch is permutation-independent and stored output is deterministic", () => {
  const inputs = waveG.buildLegitimateInputs();
  const first = pipeline.runAutonomousBatch(inputs);
  const second = pipeline.runAutonomousBatch([...inputs].reverse());
  assert.deepEqual(first, second);
  assert.deepEqual(waveG.buildReport(), stored);
  assert.equal(json.canonicalSerialize(first), json.canonicalSerialize(second));
  const hostile = waveE.buildInputs();
  assert.deepEqual(pipeline.runAutonomousBatch(hostile), pipeline.runAutonomousBatch([...hostile].reverse()));
});
