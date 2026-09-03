"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/post-bmw-triumph-phase5-reassessment.js").buildReport;

test("reassesses the complete repository-known prospect inventory without selecting blocked work", () => {
  const result = report();
  assert.equal(result.candidatesReassessed, 18);
  assert.equal(result.exclusionCounts["HELD-PRE-PROMOTION"], 2);
  assert.equal(result.exclusionCounts["ACCESS-BLOCKED"], 4);
  assert.equal(result.exclusionCounts["APPLICABILITY-BLOCKED"], 2);
  assert.equal(result.exclusionCounts.EXHAUSTED, 6);
  assert.equal(result.viableCandidatesRemaining.length, 0);
  assert.equal(result.selectedNextTarget, null);
});

test("reassessment is metadata-only and preserves production boundaries", () => {
  const result = report();
  assert.equal(result.newExternalResearchPerformed, false);
  assert.equal(result.technicalValuesInspected, false);
  assert.equal(result.evidenceRowsAdded, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
  assert.equal(result.productionChanged, false);
  assert.equal(result.audit.candidateSupply, "EXHAUSTED-OR-BLOCKED");
});

test("reassessment report is deterministic and stored output matches", () => {
  const result = report();
  assert.deepEqual(report(), result);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/post-bmw-triumph-phase5-reassessment.json"), "utf8")), result);
});
