"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const review = require("../research/data/ducati-monster937-owner-manual-human-review.js");
const processing = require("../research/data/ducati-monster937-evidence-processing.js");

test("projects all existing Ducati decisions through canonical Evidence Processing", () => {
  const report = processing.buildReport();
  assert.equal(report.input.queuedRawCandidates, 27);
  assert.equal(report.input.humanReviewDecisions, 27);
  assert.deepEqual(report.metrics, { processingRecords: 27, acceptedForProcessing: 27, cannotAdvance: 0, rejectedCandidate: 0, needsMoreReview: 0, ineligible: 0, conflictsDetected: 0, rawValuesAndProvenancePreserved: true, upstreamInputsUnchanged: true, evidenceRowsCreated: 0, serviceCoreBefore: 0, serviceCoreAfter: 0, productionChanged: false, researchedNoEvidenceCreated: false, normalizationPerformed: false, conflictsResolved: false });
  assert.ok(report.records.every(record => record.state === "ACCEPTED-FOR-PROCESSING"));
});

test("processing preserves queue candidates and remains pre-promotion", () => {
  const report = processing.buildReport();
  const sourceEntries = review.buildReport().reviewQueue.entries;
  const byId = new Map(sourceEntries.map(entry => [entry.id, entry]));
  report.records.forEach(record => assert.deepEqual(record.candidate, byId.get(record.queueEntryId).candidate));
  assert.equal(report.metrics.evidenceRowsCreated, 0);
  assert.equal(report.metrics.serviceCoreBefore, 0);
  assert.equal(report.metrics.serviceCoreAfter, 0);
  assert.equal(report.metrics.productionChanged, false);
});

test("stored processing report is deterministic", () => {
  const first = processing.buildReport();
  assert.deepEqual(processing.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-evidence-processing.json"), "utf8")), first);
});
