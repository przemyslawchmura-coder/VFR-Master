"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const runner = require("../research/factory/safe-stage-runner.js");
const packetFixture = require("../research/data/cbr500r-pc70-promotion-review.js");
const decisionFixture = require("../research/data/cbr500r-pc70-promotion-review-decision.js");
const conversionFixture = require("../research/data/cbr500r-pc70-schema-conversion.js");
const waveB = require("../research/data/technical-research-factory-safe-stage-runner.js");
const waveA = require("../research/data/technical-research-factory-throughput-baseline.js");
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/technical-research-factory-safe-stage-runner.json"), "utf8"));

function inputs() {
  const packet = packetFixture.buildPacket();
  const decision = decisionFixture.buildDecision();
  const proposedProduction = conversionFixture.buildProjection().proposedProduction;
  return { packet, decision, proposedProduction, pending: { promotionReviewPacket: packet }, continuation: { promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction } };
}

test("safe-stage runner validates deterministic envelopes and states", () => {
  const { pending, continuation } = inputs();
  const stopped = runner.runPromotionReviewToConversion(pending);
  const advanced = runner.runPromotionReviewToConversion(continuation);
  assert.equal(stopped.state, "SAFE-STOP");
  assert.equal(stopped.stopReason, "PROMOTION-REVIEW-REQUIRED");
  assert.equal(advanced.state, "ADVANCED");
  assert.equal(advanced.stopReason, null);
  assert.equal(advanced.externalSideEffects, false);
  advanced.stageEnvelopes.forEach(envelope => assert.equal(envelope.externalSideEffects, false));
  assert.doesNotThrow(() => factory.validateRunnerResult(advanced));
});

test("existing decision continues, but runner never creates a human decision", () => {
  const { pending, continuation } = inputs();
  const before = JSON.stringify({ packet: pending.promotionReviewPacket, decision: continuation.promotionReviewDecision });
  const stopped = runner.runPromotionReviewToConversion(pending);
  const advanced = runner.runPromotionReviewToConversion(continuation);
  assert.equal(stopped.humanAuthorizationConsumed, false);
  assert.equal(advanced.humanAuthorizationConsumed, true);
  assert.equal(JSON.stringify({ packet: pending.promotionReviewPacket, decision: continuation.promotionReviewDecision }), before);
  assert.equal(advanced.output.conversionState, "CONVERSION-READY");
});

test("runner output is semantically identical to direct existing-stage execution", () => {
  const { continuation } = inputs();
  const direct = factory.projectSchemaConversion({ promotionReviewPacket: continuation.promotionReviewPacket, promotionReviewDecision: continuation.promotionReviewDecision, proposedProduction: continuation.proposedProduction, blockedReasons: [] });
  const result = runner.runPromotionReviewToConversion(continuation);
  assert.deepEqual(result.output, direct);
});

test("fail-closed matrix covers missing, invalid, rejection, mismatch, unsupported and duplicate input", () => {
  const { packet, decision, proposedProduction } = inputs();
  assert.equal(runner.runPromotionReviewToConversion({}).stopReason, "MISSING-UPSTREAM-ARTIFACT");
  assert.equal(runner.runPromotionReviewToConversion({ promotionReviewPacket: { ...packet, reviewState: "APPROVED-FOR-CONVERSION" } }).stopReason, "DOWNSTREAM-CONTRACT-REJECTED");
  assert.equal(runner.runPromotionReviewToConversion({ promotionReviewPacket: packet, promotionReviewDecision: { ...decision, decision: "REJECTED-FOR-PROMOTION" }, proposedProduction }).stopReason, "DOWNSTREAM-CONTRACT-REJECTED");
  assert.equal(runner.runPromotionReviewToConversion({ promotionReviewPacket: packet, promotionReviewDecision: { ...decision, promotionPacketId: "promotion-candidate.888888888888888888888888" }, proposedProduction }).stopReason, "PROMOTION-DECISION-MISMATCH");
  assert.equal(runner.runStage({ stage: "SOURCE-CACHE", input: packet }).stopReason, "UNSUPPORTED-STAGE");
  const duplicate = runner.runBatch([{ promotionReviewPacket: packet }, { promotionReviewPacket: packet }]);
  assert.equal(duplicate.length, 1);
  assert.equal(duplicate[0].state, "FAILED");
  assert.equal(duplicate[0].stopReason, "DUPLICATE-SEMANTIC-INPUT");
});

test("equivalent scenario ordering produces identical outcomes and BatchSummary/v2", () => {
  const { pending, continuation } = inputs();
  const first = runner.runBatch([continuation, pending]);
  const second = runner.runBatch([pending, continuation]);
  assert.deepEqual(second, first);
  const report = waveB.buildReport();
  assert.deepEqual(report, stored);
  assert.equal(report.batchSummary.id, factory.batchSummaryId(report.batchSummary));
  assert.equal(report.batchSummary.metrics.autoAdvanceRate.value, 1);
  assert.equal(report.batchSummary.metrics.sourceReuseRate.value, null);
});

test("Wave B report remains a read-only proof and Wave A historical unknowns stay unchanged", () => {
  const report = waveB.buildReport();
  const baseline = waveA.buildReport();
  assert.equal(report.assertions.externalSideEffects, false);
  assert.equal(report.assertions.evidenceRowsCreated, 0);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(baseline.metrics.autoAdvanceRate.measurementState, "NOT-MEASURED");
  assert.equal(baseline.metrics.autoAdvanceRate.value, null);
  assert.equal(baseline.metrics.sourceReuseRate.measurementState, "NOT-MEASURED");
});
