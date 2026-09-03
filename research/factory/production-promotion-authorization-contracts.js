// NON-PRODUCTION fail-closed authorization gate contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const AUTHORIZATION_SCHEMA_VERSION = 1;
const AUTHORIZATION_STATES = Object.freeze(["AUTHORIZATION-READY", "AUTHORIZATION-BLOCKED"]);
const FUTURE_MATERIALIZATION_REQUIREMENTS = Object.freeze(["PRODUCTION-DOCUMENT-MATERIALIZATION", "PRODUCTION-CITATION-MATERIALIZATION", "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION", "REGISTRY-INSERTION"]);
const fields = new Set(["schemaVersion", "id", "schemaConversionProjectionId", "promotionReviewDecisionId", "promotionReviewPacketId", "promotionPacketId", "evidenceProcessingRecordId", "researchCanonicalFieldId", "targetIdentity", "sourceIdentity", "proposedProduction", "rawSource", "targetApplicability", "authorizationState", "reasons", "futureMaterializationRequirements", "productionCreated"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const authorizationId = input => `production-authorization.${crypto.createHash("sha256").update(json.canonicalSerialize({ schemaConversionProjectionId: input.schemaConversionProjectionId, authorizationState: input.authorizationState })).digest("hex").slice(0, 24)}`;

function validateProductionPromotionAuthorization(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === AUTHORIZATION_SCHEMA_VERSION, "ProductionPromotionAuthorization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `ProductionPromotionAuthorization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-authorization\.[a-f0-9]{24}$/.test(input.id), "ProductionPromotionAuthorization.id is invalid");
  ["schemaConversionProjectionId", "promotionReviewDecisionId", "promotionReviewPacketId", "promotionPacketId", "evidenceProcessingRecordId", "researchCanonicalFieldId"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `ProductionPromotionAuthorization.${field} is required`));
  assert(input.targetIdentity && typeof input.targetIdentity.id === "string" && input.targetIdentity.id.length > 0, "ProductionPromotionAuthorization.targetIdentity is incomplete");
  assert(input.sourceIdentity && typeof input.sourceIdentity.prospectId === "string" && typeof input.sourceIdentity.documentId === "string" && typeof input.sourceIdentity.sourceId === "string", "ProductionPromotionAuthorization.sourceIdentity is incomplete");
  if (input.authorizationState === "AUTHORIZATION-READY") {
    assert(input.proposedProduction && typeof input.proposedProduction.entryId === "string" && typeof input.proposedProduction.categoryId === "string" && typeof input.proposedProduction.type === "string" && input.proposedProduction.value && typeof input.proposedProduction.value === "object", "ProductionPromotionAuthorization.proposedProduction is incomplete");
    assert(input.rawSource && Object.prototype.hasOwnProperty.call(input.rawSource, "rawValue") && Object.prototype.hasOwnProperty.call(input.rawSource, "rawUnit") && input.rawSource.provenance && input.rawSource.provenance.packet && input.rawSource.provenance.sourceLocation, "ProductionPromotionAuthorization.rawSource is incomplete");
    assert(input.targetApplicability && input.targetApplicability.modelYear === "KNOWN" && input.targetApplicability.market === "KNOWN" && input.targetApplicability.equipment === "SUFFICIENT" && input.targetApplicability.context === "SUFFICIENT", "ProductionPromotionAuthorization.targetApplicability is insufficient");
  }
  assert(AUTHORIZATION_STATES.includes(input.authorizationState), "ProductionPromotionAuthorization.authorizationState is invalid");
  assert(Array.isArray(input.reasons) && (input.authorizationState === "AUTHORIZATION-READY") === (input.reasons.length === 0), "ProductionPromotionAuthorization state/reasons are inconsistent");
  assert(Array.isArray(input.futureMaterializationRequirements) && JSON.stringify(input.futureMaterializationRequirements) === JSON.stringify(FUTURE_MATERIALIZATION_REQUIREMENTS), "ProductionPromotionAuthorization future requirements are invalid");
  assert(input.productionCreated === false, "ProductionPromotionAuthorization cannot claim production creation");
  assert(input.id === authorizationId(input), "ProductionPromotionAuthorization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ AUTHORIZATION_SCHEMA_VERSION, AUTHORIZATION_STATES, FUTURE_MATERIALIZATION_REQUIREMENTS, authorizationId, validateProductionPromotionAuthorization });
