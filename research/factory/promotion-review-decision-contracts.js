// NON-PRODUCTION explicit human promotion-review decision contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const review = require("./promotion-review-contracts.js");

const PROMOTION_REVIEW_DECISION_SCHEMA_VERSION = 1;
const PROMOTION_REVIEW_DECISIONS = Object.freeze(["APPROVED-FOR-CONVERSION", "REJECTED-FOR-PROMOTION", "NEEDS-PROMOTION-REVIEW"]);
const fields = new Set(["schemaVersion", "id", "promotionReviewPacketId", "promotionPacketId", "evidenceProcessingRecordId", "canonicalFieldId", "targetIdentity", "decision", "reviewerId", "rationale"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const semanticId = value => `promotion-review-decision.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const promotionReviewDecisionId = ({ promotionReviewPacketId, decision, reviewerId }) => semanticId({ promotionReviewPacketId, decision, reviewerId });

function validatePromotionReviewDecision(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PROMOTION_REVIEW_DECISION_SCHEMA_VERSION, "PromotionReviewDecision schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `PromotionReviewDecision.${field} is unsupported`));
  assert(typeof input.id === "string" && /^promotion-review-decision\.[a-f0-9]{24}$/.test(input.id), "PromotionReviewDecision.id is invalid");
  assert(typeof input.promotionReviewPacketId === "string" && /^promotion-review-packet\.[a-f0-9]{24}$/.test(input.promotionReviewPacketId), "PromotionReviewDecision.promotionReviewPacketId is invalid");
  assert(typeof input.promotionPacketId === "string" && /^promotion-candidate\.[a-f0-9]{24}$/.test(input.promotionPacketId), "PromotionReviewDecision.promotionPacketId is invalid");
  assert(typeof input.evidenceProcessingRecordId === "string" && input.evidenceProcessingRecordId.startsWith("evidence-processing."), "PromotionReviewDecision.evidenceProcessingRecordId is invalid");
  assert(typeof input.canonicalFieldId === "string" && input.canonicalFieldId.length > 0, "PromotionReviewDecision.canonicalFieldId is required");
  assert(input.targetIdentity && typeof input.targetIdentity.id === "string", "PromotionReviewDecision.targetIdentity is incomplete");
  assert(PROMOTION_REVIEW_DECISIONS.includes(input.decision), "PromotionReviewDecision.decision is invalid");
  assert(typeof input.reviewerId === "string" && input.reviewerId.length > 0, "PromotionReviewDecision.reviewerId is required");
  assert(typeof input.rationale === "string" && input.rationale.length > 0, "PromotionReviewDecision.rationale is required");
  assert(input.id === promotionReviewDecisionId(input), "PromotionReviewDecision.id is unstable");
  return json.immutableClone(input);
}

function createPromotionReviewDecision(packet, { decision, reviewerId, rationale }) {
  const validPacket = review.validatePromotionReviewPacket(packet);
  const record = { schemaVersion: PROMOTION_REVIEW_DECISION_SCHEMA_VERSION, id: "placeholder", promotionReviewPacketId: validPacket.id, promotionPacketId: validPacket.promotionPacketId, evidenceProcessingRecordId: validPacket.evidenceProcessingRecordId, canonicalFieldId: validPacket.canonicalFieldId, targetIdentity: validPacket.targetIdentity, decision, reviewerId, rationale };
  record.id = promotionReviewDecisionId(record);
  return validatePromotionReviewDecision(record);
}

module.exports = Object.freeze({ PROMOTION_REVIEW_DECISION_SCHEMA_VERSION, PROMOTION_REVIEW_DECISIONS, promotionReviewDecisionId, validatePromotionReviewDecision, createPromotionReviewDecision });
