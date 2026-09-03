"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const processing = require("../research/data/bmw-f900r-evidence-processing.js");

test("processes exactly the existing BMW decisions once through the canonical contract", () => {
  const result = processing.buildReport();
  assert.equal(result.metrics.processingRecords, 13);
  assert.equal(result.metrics.acceptedForProcessing + result.metrics.cannotAdvance + result.metrics.rejectedCandidate + result.metrics.needsMoreReview + result.metrics.ineligible, 13);
  assert.equal(new Set(result.records.map(record => record.decisionId)).size, 13);
  assert.equal(result.metrics.rejectedCandidate, 0);
  assert.equal(result.metrics.needsMoreReview, 0);
  assert.equal(result.metrics.ineligible, 0);
  assert.equal(result.metrics.conflictsDetected, result.metrics.cannotAdvance);
});

test("preserves inputs and raw candidate provenance without evidence promotion", () => {
  const result = processing.buildReport();
  assert.equal(result.metrics.rawValuesAndProvenancePreserved, true);
  assert.equal(result.metrics.upstreamInputsUnchanged, true);
  assert.equal(result.metrics.humanReviewDecisionsUnchanged, true);
  assert.equal(result.metrics.evidenceRowsCreated, 0);
  assert.equal(result.metrics.serviceCoreBefore, 0);
  assert.equal(result.metrics.serviceCoreAfter, 0);
  assert.equal(result.metrics.productionChanged, false);
  assert.equal(result.metrics.normalizationPerformed, false);
  assert.equal(result.metrics.conflictsResolved, false);
});

test("BMW Evidence Processing report is deterministic and stored output matches", () => {
  const first = processing.buildReport();
  assert.deepEqual(processing.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/bmw-f900r-evidence-processing.json"), "utf8")), first);
});
