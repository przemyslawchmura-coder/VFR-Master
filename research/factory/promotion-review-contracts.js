// NON-PRODUCTION promotion-review packet contracts. No approval or production conversion.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const promotion = require("./promotion-contracts.js");

const PROMOTION_REVIEW_SCHEMA_VERSION = 1;
const PROMOTION_REVIEW_STATES = Object.freeze(["PENDING-PROMOTION-REVIEW", "APPROVED-FOR-CONVERSION", "REJECTED-FOR-PROMOTION", "NEEDS-PROMOTION-REVIEW"]);
const fields = new Set(["schemaVersion", "id", "promotionPacketId", "targetIdentity", "sourceIdentity", "reviewQueueEntryId", "humanReviewDecisionId", "evidenceProcessingRecordId", "canonicalFieldId", "rawValue", "rawUnit", "provenance", "applicability", "promotionReadiness", "reviewState"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const semanticId = value => `promotion-review-packet.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const promotionReviewPacketId = ({ promotionPacketId, reviewState }) => semanticId({ promotionPacketId, reviewState });

function validatePromotionReviewPacket(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PROMOTION_REVIEW_SCHEMA_VERSION, "PromotionReviewPacket schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `PromotionReviewPacket.${field} is unsupported`));
  assert(typeof input.id === "string" && /^promotion-review-packet\.[a-f0-9]{24}$/.test(input.id), "PromotionReviewPacket.id is invalid");
  assert(typeof input.promotionPacketId === "string" && /^promotion-candidate\.[a-f0-9]{24}$/.test(input.promotionPacketId), "PromotionReviewPacket.promotionPacketId is invalid");
  assert(input.targetIdentity && typeof input.targetIdentity.id === "string", "PromotionReviewPacket.targetIdentity is incomplete");
  assert(input.sourceIdentity && typeof input.sourceIdentity.prospectId === "string" && typeof input.sourceIdentity.documentId === "string", "PromotionReviewPacket.sourceIdentity is incomplete");
  ["reviewQueueEntryId", "humanReviewDecisionId", "evidenceProcessingRecordId", "canonicalFieldId"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `PromotionReviewPacket.${field} is required`));
  assert(input.rawValue !== null, "PromotionReviewPacket.rawValue is required");
  assert(input.rawUnit === null || typeof input.rawUnit === "string", "PromotionReviewPacket.rawUnit is invalid");
  assert(input.provenance && typeof input.provenance.candidateId === "string" && input.provenance.sourceLocation, "PromotionReviewPacket.provenance is incomplete");
  assert(input.applicability && ["KNOWN", "SUFFICIENT"].includes(input.applicability.modelYear), "PromotionReviewPacket.applicability.modelYear is insufficient");
  assert(["KNOWN", "SUFFICIENT"].includes(input.applicability.market), "PromotionReviewPacket.applicability.market is insufficient");
  assert(["KNOWN", "SUFFICIENT"].includes(input.applicability.equipment), "PromotionReviewPacket.applicability.equipment is insufficient");
  assert(["KNOWN", "SUFFICIENT", "NOT-RELEVANT"].includes(input.applicability.abs), "PromotionReviewPacket.applicability.abs is insufficient");
  assert(["KNOWN", "SUFFICIENT", "NOT-RELEVANT"].includes(input.applicability.transmission), "PromotionReviewPacket.applicability.transmission is insufficient");
  assert(input.applicability.context === "SUFFICIENT", "PromotionReviewPacket.applicability.context is insufficient");
  assert(input.promotionReadiness && input.promotionReadiness.state === "PROMOTION-READY" && Array.isArray(input.promotionReadiness.reasons) && input.promotionReadiness.reasons.length === 0, "PromotionReviewPacket.promotionReadiness is not ready");
  assert(input.reviewState === "PENDING-PROMOTION-REVIEW", "PromotionReviewPacket.reviewState is invalid for foundation creation");
  assert(input.id === promotionReviewPacketId({ promotionPacketId: input.promotionPacketId, reviewState: input.reviewState }), "PromotionReviewPacket.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ PROMOTION_REVIEW_SCHEMA_VERSION, PROMOTION_REVIEW_STATES, promotionReviewPacketId, validatePromotionReviewPacket });
