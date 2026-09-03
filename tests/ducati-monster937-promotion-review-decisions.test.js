"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-promotion-review-decisions.js").buildReport;

test("reviews exactly the seven requested Ducati fields once", () => {
  const result = report();
  assert.equal(result.counts.reviewed, 7);
  assert.equal(result.counts.approvedForConversion, 7);
  assert.equal(result.counts.needsPromotionReview, 0);
  assert.equal(result.counts.rejectedForPromotion, 0);
  assert.equal(result.counts.remainingDucatiPending, 20);
  assert.equal(new Set(result.reviewed.map(item => item.promotionReviewPacketId)).size, 7);
  assert.equal(new Set(result.reviewed.map(item => item.decision.id)).size, 7);
});

test("research ACCEPT remains distinct and BMW/upstream/production stay unchanged", () => {
  const result = report();
  assert.ok(result.reviewed.every(item => item.decision.decision === "APPROVED-FOR-CONVERSION"));
  assert.equal(result.researchHumanReviewAcceptMeansPromotionApproval, false);
  assert.equal(result.bmwUnchanged, true);
  assert.equal(result.upstreamResearchStateChanged, false);
  assert.equal(result.productionStateChanged, false);
  assert.equal(result.promotionConversionPerformed, false);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
});

test("decision report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-promotion-review-decisions.json"), "utf8")), first);
});
