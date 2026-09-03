// NON-PRODUCTION pure creation of pending human promotion-review packets.
"use strict";

const contracts = require("./promotion-review-contracts.js");
const promotion = require("./promotion-contracts.js");
const json = require("./json.js");

function createPendingPromotionReviewPacket(readiness, identityChain = null) {
  const before = json.canonicalSerialize(readiness);
  if (!readiness || readiness.state !== "PROMOTION-READY" || !Array.isArray(readiness.reasons) || readiness.reasons.length !== 0) throw new TypeError("PromotionReviewPacket requires PROMOTION-READY readiness with no reasons");
  const source = readiness.packet;
  const packet = promotion.validatePromotionPacket(source);
  if (identityChain) {
    const expected = { promotionPacketId: packet.id, targetId: packet.targetIdentity.id, sourceProspectId: packet.sourceIdentity.prospectId, reviewQueueEntryId: packet.reviewQueueEntryId, humanReviewDecisionId: packet.humanReviewDecisionId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId };
    Object.entries(expected).forEach(([field, value]) => { if (identityChain[field] !== value) throw new TypeError(`PromotionReviewPacket identity chain mismatch: ${field}`); });
  }
  const reviewPacket = { schemaVersion: contracts.PROMOTION_REVIEW_SCHEMA_VERSION, id: "placeholder", promotionPacketId: packet.id, targetIdentity: packet.targetIdentity, sourceIdentity: packet.sourceIdentity, reviewQueueEntryId: packet.reviewQueueEntryId, humanReviewDecisionId: packet.humanReviewDecisionId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId, canonicalFieldId: packet.canonicalFieldId, rawValue: packet.rawValue, rawUnit: packet.rawUnit, provenance: packet.provenance, applicability: packet.applicability, promotionReadiness: { state: readiness.state, passed: readiness.passed, reasons: readiness.reasons }, reviewState: "PENDING-PROMOTION-REVIEW" };
  reviewPacket.id = contracts.promotionReviewPacketId(reviewPacket);
  const result = contracts.validatePromotionReviewPacket(reviewPacket);
  if (json.canonicalSerialize(readiness) !== before) throw new Error("Promotion review mutated readiness input");
  return result;
}

module.exports = Object.freeze({ createPendingPromotionReviewPacket });
