"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const projection = require("../research/data/mass-scale-bmw-c600-promotion-review.js");

const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-promotion-review.json", "utf8"));

test("BMW promotion review creates exactly one pending packet per 24 ready input", () => {
  assert.deepEqual(report.input, { promotionReadinessRecords: 24, promotionReady: 24, blocked: 0 });
  assert.deepEqual(report.counts, { created: 24, pending: 24, approved: 0, rejected: 0, needsReview: 0, conditionalContexts: 9 });
  assert.equal(report.packets.length, 24);
  assert.equal(new Set(report.packets.map(packet => packet.id)).size, 24);
  assert.equal(new Set(report.packets.map(packet => packet.evidenceProcessingRecordId)).size, 24);
  assert.ok(report.packets.every(packet => packet.reviewState === "PENDING-PROMOTION-REVIEW"));
});

test("BMW pending packets preserve lineage, raw data and applicability", () => {
  assert.equal(report.assertions.noMissingInputs, true);
  assert.equal(report.assertions.rawValuesPreserved, true);
  assert.equal(report.assertions.conditionsPreserved, true);
  assert.equal(report.conditionalContexts.length, 9);
  assert.equal(report.assertions.provenancePreserved, true);
  assert.equal(report.assertions.sourceIdentityPreserved, true);
  assert.equal(report.assertions.applicabilityPreserved, true);
  assert.equal(report.assertions.upstreamReadinessUnchanged, true);
});

test("BMW promotion review is deterministic and review-only", () => {
  assert.deepEqual(projection.buildReport(), report);
  assert.deepEqual(projection.buildReport(), projection.buildReport());
  assert.equal(report.assertions.allPending, true);
  assert.equal(report.assertions.noApprovalOrPromotion, true);
  assert.equal(report.assertions.evidenceRowsCreated, 0);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.serviceCoreCoverageChanged, false);
  assert.equal(report.assertions.conversionPerformed, false);
});
