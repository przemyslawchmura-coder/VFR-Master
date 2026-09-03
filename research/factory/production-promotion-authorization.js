// NON-PRODUCTION pure authorization projection. Never writes production data.
"use strict";

const contracts = require("./production-promotion-authorization-contracts.js");
const json = require("./json.js");

function authorizeSchemaConversion(projection) {
  const before = json.canonicalSerialize(projection);
  const reasons = [];
  if (!projection || projection.conversionState !== "CONVERSION-READY") reasons.push("CONVERSION-NOT-READY");
  if (projection && projection.promotionReviewDecisionState !== "APPROVED-FOR-CONVERSION") reasons.push("PROMOTION-REVIEW-NOT-APPROVED-FOR-CONVERSION");
  if (!projection || !projection.targetIdentity || !projection.targetIdentity.id) reasons.push("TARGET-IDENTITY-INCOMPLETE");
  if (!projection || !projection.sourceIdentity || !projection.sourceIdentity.sourceId || !projection.sourceIdentity.prospectId || !projection.sourceIdentity.documentId) reasons.push("SOURCE-IDENTITY-INCOMPLETE");
  if (!projection || !projection.sourceProvenance || !projection.sourceProvenance.packet || !projection.sourceProvenance.sourceLocation) reasons.push("PROVENANCE-INCOMPLETE");
  if (!projection || !projection.targetApplicability || projection.targetApplicability.modelYear !== "KNOWN" || projection.targetApplicability.market !== "KNOWN" || projection.targetApplicability.equipment !== "SUFFICIENT" || projection.targetApplicability.context !== "SUFFICIENT") reasons.push("APPLICABILITY-INCOMPLETE");
  if (!projection || !projection.proposedProduction || !projection.proposedProduction.entryId || !projection.proposedProduction.categoryId || !projection.proposedProduction.type || !projection.proposedProduction.value) reasons.push("PRODUCTION-SHAPE-INCOMPLETE");
  const resultInput = { schemaVersion: contracts.AUTHORIZATION_SCHEMA_VERSION, id: "placeholder", schemaConversionProjectionId: projection && projection.id, promotionReviewDecisionId: projection && projection.promotionReviewDecisionId, promotionReviewPacketId: projection && projection.promotionReviewPacketId, promotionPacketId: projection && projection.promotionPacketId, evidenceProcessingRecordId: projection && projection.evidenceProcessingRecordId, researchCanonicalFieldId: projection && projection.researchCanonicalFieldId, targetIdentity: projection && projection.targetIdentity, sourceIdentity: projection && projection.sourceIdentity, proposedProduction: projection && projection.proposedProduction, rawSource: projection && { rawValue: projection.sourceProvenance && projection.sourceProvenance.packet && projection.sourceProvenance.packet.rawValue !== undefined ? projection.sourceProvenance.packet.rawValue : null, rawUnit: projection.sourceProvenance && projection.sourceProvenance.packet ? projection.sourceProvenance.packet.rawUnit : null, provenance: projection.sourceProvenance || {} }, targetApplicability: projection && projection.targetApplicability, authorizationState: reasons.length === 0 ? "AUTHORIZATION-READY" : "AUTHORIZATION-BLOCKED", reasons: [...new Set(reasons)].sort(), futureMaterializationRequirements: contracts.FUTURE_MATERIALIZATION_REQUIREMENTS, productionCreated: false };
  resultInput.id = contracts.authorizationId(resultInput);
  const result = contracts.validateProductionPromotionAuthorization(resultInput);
  if (json.canonicalSerialize(projection) !== before) throw new Error("Production authorization mutated schema-conversion input");
  return result;
}

module.exports = Object.freeze({ authorizeSchemaConversion });
