"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const projection = require("../research/data/mass-scale-bmw-c600-promotion-review-decisions.js");

const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-promotion-review-decisions.json", "utf8"));

test("BMW human promotion review consumes exactly 24 pending packets once", () => {
  assert.deepEqual(report.input, { pendingPackets: 24, promotionReady: 24, blocked: 0 });
  assert.deepEqual(report.counts, { reviewed: 24, approvedForConversion: 24, rejectedForPromotion: 0, needsPromotionReview: 0, conditionalContextsReviewed: 9 });
  assert.equal(report.decisions.length, 24);
  assert.equal(new Set(report.decisions.map(decision => decision.id)).size, 24);
  assert.equal(new Set(report.decisions.map(decision => decision.promotionReviewPacketId)).size, 24);
  assert.ok(report.decisions.every(decision => decision.decision === "APPROVED-FOR-CONVERSION"));
});

test("BMW decisions preserve raw values, conditions, provenance and applicability", () => {
  assert.equal(report.assertions.noMissingPackets, true);
  assert.equal(report.assertions.packetIdsPreserved, true);
  assert.equal(report.assertions.rawValuesPreserved, true);
  assert.equal(report.assertions.conditionsPreserved, true);
  assert.equal(report.assertions.provenancePreserved, true);
  assert.equal(report.assertions.sourceIdentityPreserved, true);
  assert.equal(report.assertions.applicabilityPreserved, true);
  assert.equal(report.assertions.researchHumanReviewAcceptNotReused, true);
  assert.equal(report.assertions.readinessNotAutoApproval, true);
});

test("BMW decisions are deterministic and do not convert or materialize", () => {
  assert.deepEqual(projection.buildReport(), report);
  assert.deepEqual(projection.buildReport(), projection.buildReport());
  assert.equal(report.assertions.conversionPerformed, false);
  assert.equal(report.assertions.evidenceRowsCreated, 0);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.serviceCoreCoverageChanged, false);
  assert.equal(report.assertions.upstreamUnchanged, true);
});
