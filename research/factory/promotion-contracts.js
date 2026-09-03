// NON-PRODUCTION Phase 6 promotion packet contracts. No production conversion or persistence.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const extraction = require("./extraction-contracts.js");
const processing = require("./evidence-processing-contracts.js");

const PROMOTION_SCHEMA_VERSION = 1;
const PROMOTION_STATES = Object.freeze(["PROMOTION-READY", "BLOCKED"]);
const PROCESSING_STATES = processing.EVIDENCE_PROCESSING_STATES;
const fields = new Set(["schemaVersion", "id", "targetIdentity", "sourceIdentity", "reviewQueueEntryId", "humanReviewDecisionId", "evidenceProcessingRecordId", "canonicalFieldId", "rawValue", "rawUnit", "provenance", "applicability", "processingState", "humanReviewDecision", "unresolvedConflict"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertClosed = input => Object.keys(input).forEach(field => assert(fields.has(field), `PromotionPacket.${field} is unsupported`));
const semanticId = value => `promotion-candidate.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const promotionCandidateId = input => semanticId({ targetId: input.targetIdentity.id, processingRecordId: input.evidenceProcessingRecordId, queueEntryId: input.reviewQueueEntryId, decisionId: input.humanReviewDecisionId, fieldId: input.canonicalFieldId });

function validatePromotionPacket(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PROMOTION_SCHEMA_VERSION, "PromotionPacket schemaVersion is incompatible");
  assertClosed(input);
  assert(typeof input.id === "string" && /^promotion-candidate\.[a-f0-9]{24}$/.test(input.id), "PromotionPacket.id is invalid");
  assert(input.targetIdentity && typeof input.targetIdentity === "object" && typeof input.targetIdentity.id === "string" && input.targetIdentity.id.length > 0, "PromotionPacket.targetIdentity is incomplete");
  assert(input.sourceIdentity && typeof input.sourceIdentity === "object", "PromotionPacket.sourceIdentity is required");
  ["sourceId", "prospectId", "documentId", "authority", "tier", "officialPath"].forEach(field => assert(typeof input.sourceIdentity[field] === "string" && input.sourceIdentity[field].length > 0, `PromotionPacket.sourceIdentity.${field} is required`));
  assert(["A", "B"].includes(input.sourceIdentity.tier), "PromotionPacket.sourceIdentity.tier is invalid");
  ["reviewQueueEntryId", "humanReviewDecisionId", "evidenceProcessingRecordId", "canonicalFieldId"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `PromotionPacket.${field} is required`));
  assert(extraction.SERVICE_CORE_FIELDS.includes(input.canonicalFieldId), "PromotionPacket.canonicalFieldId is not in the Service Core");
  assert(input.rawValue !== null, "PromotionPacket.rawValue is required");
  assert(input.rawUnit === null || typeof input.rawUnit === "string", "PromotionPacket.rawUnit is invalid");
  assert(input.provenance && typeof input.provenance === "object", "PromotionPacket.provenance is required");
  ["candidateId", "extractionResultId", "artifactId", "sourceLocation", "extractionMethod"].forEach(field => assert(Object.prototype.hasOwnProperty.call(input.provenance, field), `PromotionPacket.provenance.${field} is required`));
  assert(input.applicability && typeof input.applicability === "object", "PromotionPacket.applicability is required");
  ["modelYear", "market", "equipment", "abs", "transmission"].forEach(field => assert(["KNOWN", "SUFFICIENT", "UNKNOWN", "INSUFFICIENT"].includes(input.applicability[field]) || input.applicability[field] === "NOT-RELEVANT", `PromotionPacket.applicability.${field} is unresolved`));
  assert(PROCESSING_STATES.includes(input.processingState), "PromotionPacket.processingState is invalid");
  assert(input.humanReviewDecision === "ACCEPT" || ["REJECT", "NEEDS-MORE-REVIEW"].includes(input.humanReviewDecision), "PromotionPacket.humanReviewDecision is invalid");
  assert(typeof input.unresolvedConflict === "boolean", "PromotionPacket.unresolvedConflict is required");
  assert(input.id === promotionCandidateId(input), "PromotionPacket.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ PROMOTION_SCHEMA_VERSION, PROMOTION_STATES, promotionCandidateId, validatePromotionPacket });
