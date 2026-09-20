"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const projection = require("../research/data/mass-scale-bmw-c600-promotion-readiness.js");

const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-promotion-readiness.json", "utf8"));

test("BMW promotion readiness evaluates exactly the 24 Evidence Processing records", () => {
  assert.deepEqual(report.input, { evidenceProcessingRecords: 24, acceptedForProcessing: 24, humanReviewAccepts: 24 });
  assert.deepEqual(report.readiness, { promotionReady: 24, blocked: 0, total: 24 });
  assert.equal(report.outcomes.length, 24);
  assert.equal(new Set(report.outcomes.map(item => item.evidenceProcessingRecordId)).size, 24);
  assert.equal(new Set(report.outcomes.map(item => item.candidateId)).size, 24);
  assert.ok(report.outcomes.every(item => item.state === "PROMOTION-READY" && item.passed === true && item.reasons.length === 0));
});

test("BMW readiness preserves provenance, applicability and conditional raw context", () => {
  assert.equal(report.assertions.upstreamInputsUnchanged, true);
  assert.equal(report.assertions.rawValuesPreserved, true);
  assert.equal(report.assertions.provenancePreserved, true);
  assert.equal(report.assertions.applicabilityPreserved, true);
  assert.equal(report.outcomes.filter(item => item.condition).length, 9);
  assert.equal(report.assertions.evidenceRowsCreated, 0);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.normalizationPerformed, false);
  assert.equal(report.assertions.conflictsResolved, false);
});

test("BMW promotion readiness is deterministic, immutable and non-promoting", () => {
  assert.deepEqual(projection.buildReport(), report);
  assert.deepEqual(projection.buildReport(), projection.buildReport());
  assert.equal(report.assertions.noUnsupportedPromotion, true);
});
