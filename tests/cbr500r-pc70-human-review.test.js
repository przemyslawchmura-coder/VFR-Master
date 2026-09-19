"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const review = require("../research/data/cbr500r-pc70-human-review.js");

test("CBR500R Human Review creates exactly one deterministic pre-evidence decision", () => {
  const first = review.buildDecision();
  const second = review.buildDecision();
  assert.deepEqual(second, first);
  assert.equal(first.id, factory.reviewDecisionId({ queueEntryId: review.queueEntry.id, decision: "ACCEPT", reviewerId: review.reviewerId }));
  assert.equal(first.queueEntryId, "review-queue-entry.7b8d56af51c808e15dd558ac");
  assert.equal(first.candidateId, "extraction-candidate.87fcea8600978eff75d9f8d6");
  assert.equal(review.queueEntry.state, "QUEUED");
  assert.equal(review.queueEntry.candidate.rawValue, require("../research/reports/cbr500r-pc70-review-queue.json").queue.entries[0].candidate.rawValue);
  assert.equal(review.queueEntry.candidate.applicability.abs, null);
  assert.equal(Object.prototype.hasOwnProperty.call(first, "evidence"), false);
});

test("CBR500R Human Review report is deterministic and persisted without downstream effects", () => {
  const first = review.buildReport();
  const second = review.buildReport();
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/cbr500r-pc70-human-review.json"), "utf8"));
  assert.deepEqual(second, first);
  assert.deepEqual(stored, first);
  assert.equal(first.decision.decision, "ACCEPT");
  assert.equal(first.applicability.abs, null);
  assert.equal(first.assertions.evidenceProcessingOccurred, false);
  assert.equal(first.assertions.productionPromotionOccurred, false);
  assert.equal(first.assertions.productionChanged, false);
});
