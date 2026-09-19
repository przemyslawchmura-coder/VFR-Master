"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const processing = require("../research/data/mass-scale-bmw-c600-evidence-processing.js");

const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-evidence-processing.json", "utf8"));

test("BMW Evidence Processing consumes exactly the 24 review decisions", () => {
  assert.deepEqual(report.input, { queuedRawCandidates: 24, humanReviewDecisions: 24, acceptedDecisions: 24, rejectedDecisions: 0, needsMoreReviewDecisions: 0 });
  assert.equal(report.metrics.processingRecords, 24);
  assert.equal(report.metrics.acceptedForProcessing + report.metrics.cannotAdvance, 24);
  assert.equal(report.metrics.rejectedCandidate, 0);
  assert.equal(report.metrics.needsMoreReview, 0);
  assert.equal(report.metrics.ineligible, 0);
  assert.equal(report.metrics.conflictsDetected, report.metrics.cannotAdvance);
});

test("BMW Evidence Processing preserves raw lineage and conditional applicability", () => {
  assert.equal(report.metrics.rawValuesAndProvenancePreserved, true);
  assert.equal(report.metrics.upstreamInputsUnchanged, true);
  assert.equal(report.metrics.humanReviewDecisionsUnchanged, true);
  assert.equal(report.conditionalHandling.preserved, true);
  assert.equal(report.metrics.conditionalRecords, 9);
  assert.equal(report.metrics.evidenceRowsCreated, 0);
  assert.equal(report.metrics.productionChanged, false);
  assert.equal(report.metrics.catalogueChanged, false);
  assert.equal(report.metrics.registryChanged, false);
  assert.equal(report.metrics.normalizationPerformed, false);
  assert.equal(report.metrics.conflictsResolved, false);
});

test("BMW Evidence Processing is deterministic and idempotent", () => {
  assert.deepEqual(processing.buildReport(), report);
  assert.deepEqual(processing.buildReport(), processing.buildReport());
  assert.equal(new Set(report.records.map(record => record.decisionId)).size, 24);
});
