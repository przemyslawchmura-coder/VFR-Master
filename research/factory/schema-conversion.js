// NON-PRODUCTION pure schema-conversion projection. Never writes production data.
"use strict";

const contracts = require("./schema-conversion-contracts.js");
const json = require("./json.js");

function projectSchemaConversion(input) {
  if (!input || !input.promotionReviewDecision || !input.promotionReviewPacket) throw new TypeError("Schema conversion requires promotion decision and packet");
  const decision = input.promotionReviewDecision;
  const packet = input.promotionReviewPacket;
  if (decision.promotionReviewPacketId !== packet.id || decision.promotionPacketId !== packet.promotionPacketId || decision.evidenceProcessingRecordId !== packet.evidenceProcessingRecordId || decision.canonicalFieldId !== packet.canonicalFieldId) throw new TypeError("Schema conversion upstream identity mismatch");
  if (decision.decision !== "APPROVED-FOR-CONVERSION") throw new TypeError("Schema conversion requires APPROVED-FOR-CONVERSION");
  const before = json.canonicalSerialize({ decision, packet });
  const proposal = input.proposedProduction;
  const blockedReasons = Object.freeze([...(input.blockedReasons || [])].sort());
  const resultInput = { schemaVersion: contracts.SCHEMA_CONVERSION_SCHEMA_VERSION, id: "placeholder", promotionReviewDecisionId: decision.id, promotionReviewPacketId: packet.id, promotionPacketId: packet.promotionPacketId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId, researchCanonicalFieldId: packet.canonicalFieldId, proposedProduction: proposal, sourceProvenance: { packet: { promotionReviewPacketId: packet.id, promotionPacketId: packet.promotionPacketId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId, canonicalFieldId: packet.canonicalFieldId, rawValue: packet.rawValue, rawUnit: packet.rawUnit, provenance: packet.provenance }, sourceLocation: packet.provenance.sourceLocation }, targetApplicability: packet.applicability, conversionState: blockedReasons.length === 0 ? "CONVERSION-READY" : "CONVERSION-BLOCKED", blockedReasons };
  resultInput.id = contracts.schemaConversionId(resultInput);
  const result = contracts.validateSchemaConversionProjection(resultInput);
  if (json.canonicalSerialize({ decision, packet }) !== before) throw new Error("Schema conversion mutated upstream input");
  return result;
}

module.exports = Object.freeze({ projectSchemaConversion });
