"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/held-promotion-review-projection.js").buildReport;

test("derives future promotion-review packet eligibility from held readiness results", () => {
  const result = report();
  assert.equal(result.ducati.total, 27);
  assert.equal(result.ducati.eligibleReviewPackets, 27);
  assert.equal(result.bmw.total, 13);
  assert.equal(result.bmw.eligibleReviewPackets, 11);
  assert.equal(result.bmw.blockedOrExcluded, 2);
  assert.ok(result.ducati.packets.every(packet => packet.reviewState === "PENDING-PROMOTION-REVIEW"));
  assert.ok(result.bmw.packets.every(packet => packet.reviewState === "PENDING-PROMOTION-REVIEW"));
});

test("BMW conflicts remain excluded and no promotion approval is created", () => {
  const result = report();
  assert.equal(result.bmw.blockedReasons.noUnresolvedConflict, 2);
  assert.equal(result.bmw.blockedReasons.processingAccepted, 2);
  assert.deepEqual(result.bmw.excluded.map(item => [...item.reasons].sort()), [["noUnresolvedConflict", "processingAccepted"], ["noUnresolvedConflict", "processingAccepted"]]);
  assert.equal(result.promotionApprovalsCreated, 0);
  assert.equal(result.researchHumanReviewAcceptMeansPromotionApproval, false);
});

test("upstream and production boundaries remain unchanged", () => {
  const result = report();
  assert.equal(result.ducati.upstreamUnchanged, true);
  assert.equal(result.bmw.upstreamUnchanged, true);
  assert.equal(result.upstreamResearchStateChanged, false);
  assert.equal(result.productionStateChanged, false);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
});

test("review projection report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/held-promotion-review-projection.json"), "utf8")), first);
});
