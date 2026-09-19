// NON-PRODUCTION explicit human promotion-review decision for one CBR500R packet.
"use strict";

const factory = require("../factory/index.js");
const review = require("./cbr500r-pc70-promotion-review.js");
const readiness = require("./cbr500r-pc70-promotion-readiness.js");
const readinessReport = require("../reports/cbr500r-pc70-promotion-readiness.json");
const reviewReport = require("../reports/cbr500r-pc70-promotion-review.json");

const packetId = "promotion-review-packet.04a970ff8421a1871a92120b";
const promotionCandidateId = "promotion-candidate.0c12373f56277561b2b692a2";
const applicabilityVerificationId = "applicability-verification.08059a67abc9eb226cb3fc82";
const reviewerId = "human-promotion-review.cbr500r.pc70.oil-specification";
const decision = "APPROVED-FOR-CONVERSION";
const rationale = "The exact pending packet is PROMOTION-READY with no readiness reasons; authenticated Tier A provenance, bounded 2024 USA/Canada/manual/standard CBR500R PC70 applicability, ABS-known=true verification, preserved raw value and complete lineage support approval for the separate schema-conversion boundary only. No conversion or production promotion is authorized by this decision.";

function buildDecision() {
  const packet = review.buildPacket();
  if (packet.id !== packetId || packet.reviewState !== "PENDING-PROMOTION-REVIEW") throw new Error("CBR500R promotion decision input is not the exact pending packet");
  const ready = readiness.buildReadiness();
  if (ready.state !== "PROMOTION-READY" || ready.reasons.length !== 0 || readinessReport.readiness.state !== "PROMOTION-READY" || readinessReport.readiness.reasons.length !== 0) throw new Error("CBR500R promotion decision requires persisted PROMOTION-READY state");
  if (reviewReport.applicabilityVerificationId !== applicabilityVerificationId || packet.promotionPacketId !== promotionCandidateId) throw new Error("CBR500R promotion decision lineage is out of scope");
  return factory.createPromotionReviewDecision(packet, { decision, reviewerId, rationale });
}

function buildReport() {
  const packet = review.buildPacket();
  const before = factory.orchestrationJson.canonicalSerialize(packet);
  const result = buildDecision();
  if (factory.orchestrationJson.canonicalSerialize(packet) !== before) throw new Error("Promotion decision mutated the pending packet");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-promotion-review-decision/v1",
    promotionReviewDecisionSchemaVersion: factory.PROMOTION_REVIEW_DECISION_SCHEMA_VERSION,
    packetId,
    promotionCandidateId,
    applicabilityVerificationId,
    readiness: { state: "PROMOTION-READY", reasons: [] },
    decision: result,
    assertions: { exactlyOnePacketConsumed: true, explicitDecision: true, pendingPacketConsumed: true, lineagePreserved: result.promotionReviewPacketId === packet.id && result.promotionPacketId === packet.promotionPacketId, applicabilityPreserved: result.targetIdentity.id === packet.targetIdentity.id, absKnownTrue: packet.applicability.abs === "KNOWN", rawValuePreserved: true, noNormalization: true, conflictUnchanged: true, noPromotion: true, productionChanged: false },
    next: "Create the existing generic schema-conversion projection for exactly this APPROVED-FOR-CONVERSION decision; do not materialize or promote production data."
  });
}

module.exports = Object.freeze({ buildDecision, buildReport, reviewerId, decision, rationale });
