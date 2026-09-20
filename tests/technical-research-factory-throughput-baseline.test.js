"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const contracts = require("../research/factory/batch-summary-contracts.js");
const baseline = require("../research/data/technical-research-factory-throughput-baseline.js");
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/technical-research-factory-throughput-baseline.json"), "utf8"));

test("BatchSummary/v2 contract validates deterministic baseline and rejects unstable identity", () => {
  const first = baseline.buildReport();
  assert.deepEqual(first, stored);
  assert.equal(first.schemaVersion, 2);
  assert.equal(first.id, contracts.batchSummaryId(first));
  assert.equal(first.fixtures.length, 5);
  assert.equal(first.assertions.deterministic, true);
});

test("permuted fixture input has the same summary identity and output", () => {
  const first = baseline.buildReport();
  const { assertions, next, ...summary } = first;
  const permuted = contracts.validateBatchSummary({ ...summary, fixtures: [...first.fixtures].reverse(), id: first.id });
  const { assertions: ignoredAssertions, next: ignoredNext, ...validated } = first;
  assert.deepEqual(permuted, validated);
});

test("unknown and not-measured metrics never become percentages, while zero is measured", () => {
  const first = baseline.buildReport();
  assert.equal(first.metrics.autoAdvanceRate.value, null);
  assert.equal(first.metrics.autoAdvanceRate.measurementState, "NOT-MEASURED");
  assert.equal(first.metrics.sourceReuseRate.value, null);
  assert.equal(first.metrics.sourceReuseRate.measurementState, "NOT-MEASURED");
  const bmw = first.fixtures.find(item => item.fixtureId === "bmw-c600-2012-complete-chain");
  assert.equal(bmw.counts.failures.value, 0);
  assert.equal(bmw.counts.retries.value, null);
  assert.equal(bmw.counts.retries.measurementState, "UNKNOWN");
  assert.equal(bmw.metrics.humanTouchRate.value, 1);
  assert.throws(() => contracts.validateMetric({ name: "unsafe", numerator: { value: 1, measurementState: "MEASURED", scope: "x", reason: "x" }, denominator: { value: null, measurementState: "UNKNOWN", scope: "x", reason: "x" }, measurementState: "MEASURED", value: 1, scope: "x", reason: "x", contractVersions: [] }));
});

test("BMW regression anchor and all fixture boundaries remain intact", () => {
  const first = baseline.buildReport();
  const bmw = first.fixtures.find(item => item.fixtureId === "bmw-c600-2012-complete-chain");
  assert.equal(bmw.counts.promotionReady.value, 24);
  assert.equal(bmw.counts.queueRecords.value, 24);
  assert.equal(bmw.counts.humanReviewRecords.value, 24);
  assert.equal(bmw.counts.conversionReady.value, 24);
  assert.equal(bmw.counts.conditionalContexts.value, 9);
  assert.equal(first.safeStop, "PRE-MATERIALIZATION");
  assert.deepEqual(first.boundary, { productionMaterialization: false, evidenceMaterialization: false, serviceCoreMutation: false, catalogueMutation: false, registryMutation: false, cloudMutation: false, uiMutation: false });
  assert.equal(first.assertions.inputsReadOnly, true);
  assert.equal(first.assertions.productionChanged, false);
  assert.equal(first.assertions.evidenceChanged, false);
  assert.equal(first.assertions.serviceCoreChanged, false);
  assert.equal(first.assertions.cloudChanged, false);
});
