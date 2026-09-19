"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const review = require("../research/data/mass-scale-bmw-c600-human-review.js");

const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-human-review.json", "utf8"));

test("BMW C 600 human review accounts for exactly the existing 24 candidates", () => {
  assert.equal(report.candidatesReviewed, 24);
  assert.equal(report.reviewQueue.entries.length, 24);
  assert.equal(report.decisions.decisions.length, 24);
  assert.deepEqual(report.decisionCounts, { ACCEPT: 24, REJECT: 0, "NEEDS-MORE-REVIEW": 0 });
  assert.deepEqual(report.rejectedOrBlockedCandidateIds, []);
});

test("BMW review preserves exact raw payload, provenance and conditional rows", () => {
  assert.equal(report.rawValuesAndProvenanceUnchanged, true);
  assert.equal(report.conditionalCandidateIds.length, 9);
  assert.equal(report.normalizationPerformed, false);
  assert.equal(report.conflictsResolved, false);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.productionChanged, false);
  assert.equal(report.registryChanged, false);
  assert.ok(report.decisions.decisions.every(item => item.decision === "ACCEPT" && item.comment.includes("unchanged")));
});

test("BMW human review is deterministic and idempotent", () => {
  assert.deepEqual(review.buildReport(), report);
  assert.deepEqual(review.buildReview().decisions, review.buildReview().decisions);
  assert.equal(new Set(report.decisions.decisions.map(item => item.id)).size, 24);
});
