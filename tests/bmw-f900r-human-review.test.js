"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const review = require("../research/data/bmw-f900r-human-review.js");

test("reviews exactly the 13 existing BMW queue entries once", () => {
  const result = review.buildReport();
  assert.equal(result.candidatesReviewed, 13);
  assert.equal(result.accountedCandidateIds.length, 13);
  assert.deepEqual(result.decisionCounts, { ACCEPT: 13, REJECT: 0, "NEEDS-MORE-REVIEW": 0 });
  assert.equal(new Set(result.decisions.decisions.map(item => item.queueEntryId)).size, 13);
  assert.equal(result.decisions.decisions.length, 13);
  assert.equal(result.reusedProspectId, "unknown.bmw.f900r");
  assert.equal(result.decisions.decisions[0].prospectId, "prospect.bmw.f900r.owner.my20.eu");
});

test("preserves raw candidate payloads and provenance without downstream promotion", () => {
  const result = review.buildReport();
  assert.equal(result.rawValuesAndProvenanceUnchanged, true);
  result.reviewQueue.entries.forEach(entry => assert.equal(entry.state, "QUEUED"));
  result.decisions.decisions.forEach(decision => assert.equal(decision.decision, "ACCEPT"));
  assert.equal(result.unresolvedOrAmbiguous, 0);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreBefore, 0);
  assert.equal(result.serviceCoreAfter, 0);
  assert.equal(result.productionChanged, false);
  assert.equal(result.normalizationPerformed, false);
  assert.equal(result.conflictsResolved, false);
});

test("BMW Human Review report is deterministic and stored output matches", () => {
  const first = review.buildReport();
  assert.deepEqual(review.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/bmw-f900r-human-review.json"), "utf8")), first);
});
