"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function synthetic(overrides = {}) {
  const packet = { schemaVersion: 1, id: "placeholder", targetIdentity: { state: "KNOWN", id: "target.synthetic", catalogVariantKey: "fixture.variant", model: "Fixture", year: 2020, market: "EU", equipment: "standard" }, sourceIdentity: { sourceId: "source.synthetic", prospectId: "prospect.synthetic", documentId: "document.synthetic", authority: "Fixture Authority", tier: "A", officialPath: "https://official.example/fixture" }, reviewQueueEntryId: "review-queue-entry.111111111111111111111111", humanReviewDecisionId: "review-decision.222222222222222222222222", evidenceProcessingRecordId: "evidence-processing.333333333333333333333333", canonicalFieldId: "lubrication.oil-specification", rawValue: "SAE 10W-40", rawUnit: null, provenance: { candidateId: "extraction-candidate.444444444444444444444444", extractionResultId: "extraction-result.555555555555555555555555", artifactId: "artifact.synthetic", sourceLocation: { page: 4, section: "Lubrication", locator: "line:1" }, extractionMethod: "SYNTHETIC-EXACT" }, applicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" }, processingState: "ACCEPTED-FOR-PROCESSING", humanReviewDecision: "ACCEPT", unresolvedConflict: false, ...overrides };
  packet.id = factory.promotionCandidateId(packet);
  return { packet, readiness: factory.buildPromotionReadiness(packet) };
}

test("PROMOTION-READY synthetic candidate creates only a pending review packet", () => {
  const { readiness } = synthetic();
  const packet = factory.createPendingPromotionReviewPacket(readiness);
  assert.equal(packet.reviewState, "PENDING-PROMOTION-REVIEW");
  assert.equal(packet.promotionReadiness.state, "PROMOTION-READY");
  assert.equal(packet.promotionReadiness.passed, true);
});

test("BLOCKED candidate cannot create a reviewable packet", () => {
  const { readiness } = synthetic({ unresolvedConflict: true });
  assert.equal(readiness.state, "BLOCKED");
  assert.throws(() => factory.createPendingPromotionReviewPacket(readiness), /PROMOTION-READY/);
});

test("upstream identity mismatch fails closed", () => {
  const { readiness } = synthetic();
  const chain = { promotionPacketId: readiness.packet.id, targetId: "target.other", sourceProspectId: readiness.packet.sourceIdentity.prospectId, reviewQueueEntryId: readiness.packet.reviewQueueEntryId, humanReviewDecisionId: readiness.packet.humanReviewDecisionId, evidenceProcessingRecordId: readiness.packet.evidenceProcessingRecordId };
  assert.throws(() => factory.createPendingPromotionReviewPacket(readiness, chain), /identity chain mismatch/);
});

test("incomplete provenance or applicability fails closed", () => {
  const missingProvenance = synthetic({ provenance: { candidateId: null, extractionResultId: null, artifactId: null, sourceLocation: null, extractionMethod: null } });
  assert.throws(() => factory.createPendingPromotionReviewPacket(missingProvenance.readiness), /PROMOTION-READY|provenance/);
  const missingApplicability = synthetic({ applicability: { modelYear: "KNOWN", market: "UNKNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" } });
  assert.throws(() => factory.createPendingPromotionReviewPacket(missingApplicability.readiness), /market|readiness/);
});

test("research ACCEPT does not imply promotion approval", () => {
  const { readiness } = synthetic();
  const packet = factory.createPendingPromotionReviewPacket(readiness);
  assert.equal(packet.humanReviewDecisionId, readiness.packet.humanReviewDecisionId);
  assert.equal(packet.reviewState, "PENDING-PROMOTION-REVIEW");
  assert.notEqual(packet.reviewState, "APPROVED-FOR-CONVERSION");
});

test("review packet IDs/results are deterministic and raw payload is preserved", () => {
  const first = factory.createPendingPromotionReviewPacket(synthetic().readiness);
  const second = factory.createPendingPromotionReviewPacket(synthetic().readiness);
  assert.equal(first.id, second.id);
  assert.deepEqual(first, second);
  assert.equal(first.rawValue, "SAE 10W-40");
  assert.equal(first.rawUnit, null);
  assert.deepEqual(first.provenance.sourceLocation, { page: 4, section: "Lubrication", locator: "line:1" });
  assert.equal(Object.isFrozen(first), true);
});
