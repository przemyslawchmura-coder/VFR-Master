"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const acquisition = require("../research/data/ducati-monster937-owner-manual-acquisition.js");
const review = require("../research/data/ducati-monster937-owner-manual-human-review.js");

test("reviews exactly the acquired Ducati candidate set", () => {
  const report = review.buildReport();
  assert.equal(report.candidatesReviewed, 27);
  assert.deepEqual(report.decisionCounts, { ACCEPT: 27, REJECT: 0, "NEEDS-MORE-REVIEW": 0 });
  assert.equal(report.unresolvedOrAmbiguous, 0);
  assert.equal(report.reviewQueue.entries.length, 27);
  assert.equal(report.decisions.decisions.length, 27);
  assert.ok(report.decisions.decisions.every(item => item.decision === "ACCEPT"));
});

test("preserves raw values, provenance and applicability without downstream records", () => {
  const report = review.buildReport();
  const source = acquisition.runAcquisition().source;
  assert.equal(report.source.documentId, source.documentId);
  assert.equal(report.rawValuesAndProvenanceUnchanged, true);
  assert.ok(report.reviewQueue.entries.every(entry => entry.candidate.applicability.abs === true && entry.candidate.applicability.transmission === "manual"));
  assert.ok(report.reviewQueue.entries.every(entry => entry.candidate.context.printedPage && entry.candidate.sourceLocation.section));
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.serviceCoreCoverageChange, 0);
  assert.equal(report.productionChanged, false);
  assert.equal(report.researchedNoEvidenceCreated, false);
  assert.equal(report.normalizationPerformed, false);
  assert.equal(report.conflictsResolved, false);
});

test("review report is deterministic and stored output matches", () => {
  const first = review.buildReport();
  const second = review.buildReport();
  assert.deepEqual(second, first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-human-review.json"), "utf8")), first);
});
