// NON-PRODUCTION lossless schema-conversion projection contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const SCHEMA_CONVERSION_SCHEMA_VERSION = 1;
const CONVERSION_STATES = Object.freeze(["CONVERSION-READY", "CONVERSION-BLOCKED"]);
const fields = new Set(["schemaVersion", "id", "promotionReviewDecisionId", "promotionReviewPacketId", "promotionPacketId", "evidenceProcessingRecordId", "researchCanonicalFieldId", "proposedProduction", "sourceProvenance", "targetApplicability", "conversionState", "blockedReasons"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const semanticId = value => `schema-conversion.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const schemaConversionId = ({ promotionReviewDecisionId, researchCanonicalFieldId, conversionState }) => semanticId({ promotionReviewDecisionId, researchCanonicalFieldId, conversionState });

function validateSchemaConversionProjection(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_CONVERSION_SCHEMA_VERSION, "SchemaConversionProjection schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `SchemaConversionProjection.${field} is unsupported`));
  assert(typeof input.id === "string" && /^schema-conversion\.[a-f0-9]{24}$/.test(input.id), "SchemaConversionProjection.id is invalid");
  ["promotionReviewDecisionId", "promotionReviewPacketId", "promotionPacketId", "evidenceProcessingRecordId", "researchCanonicalFieldId"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `SchemaConversionProjection.${field} is required`));
  assert(input.proposedProduction && typeof input.proposedProduction === "object", "SchemaConversionProjection.proposedProduction is required");
  ["entryId", "categoryId", "type", "value"].forEach(field => assert(Object.prototype.hasOwnProperty.call(input.proposedProduction, field), `SchemaConversionProjection.proposedProduction.${field} is required`));
  if (input.conversionState === "CONVERSION-READY") ["entryId", "categoryId", "type"].forEach(field => assert(typeof input.proposedProduction[field] === "string" && input.proposedProduction[field].length > 0, `SchemaConversionProjection.proposedProduction.${field} is incomplete`));
  assert(input.sourceProvenance && typeof input.sourceProvenance === "object" && input.sourceProvenance.packet && input.sourceProvenance.sourceLocation, "SchemaConversionProjection.sourceProvenance is incomplete");
  assert(input.targetApplicability && typeof input.targetApplicability === "object" && input.targetApplicability.modelYear === "KNOWN" && input.targetApplicability.market === "KNOWN" && input.targetApplicability.equipment === "SUFFICIENT", "SchemaConversionProjection.targetApplicability is insufficient");
  assert(CONVERSION_STATES.includes(input.conversionState), "SchemaConversionProjection.conversionState is invalid");
  assert(Array.isArray(input.blockedReasons), "SchemaConversionProjection.blockedReasons is required");
  assert((input.conversionState === "CONVERSION-READY") === (input.blockedReasons.length === 0), "SchemaConversionProjection state/reasons are inconsistent");
  assert(input.id === schemaConversionId(input), "SchemaConversionProjection.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ SCHEMA_CONVERSION_SCHEMA_VERSION, CONVERSION_STATES, schemaConversionId, validateSchemaConversionProjection });
