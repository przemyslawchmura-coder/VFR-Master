// GENERIC production Technical Profile entry materialization result contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_SCHEMA_VERSION = 1;
const PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT = "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION";
const ACTIONS = Object.freeze(["CREATED", "REUSED"]);
const fields = new Set(["schemaVersion", "id", "productionMaterializationAuthorizationId", "materializationRequirementsAuthorizationId", "productionAuthorizationId", "humanDecisionId", "requirementType", "action", "profileIdentity", "productionProfileId", "productionProfilePath", "productionEntryId", "productionEntry", "productionDocumentId", "productionCitationId", "sourceIdentity", "targetIdentity", "targetApplicability", "productionCreated"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function productionTechnicalProfileEntryMaterializationResultId(input) {
  return `production-technical-profile-entry-materialization.${crypto.createHash("sha256").update(json.canonicalSerialize({ authorizationId: input.productionMaterializationAuthorizationId, requirementType: input.requirementType, productionProfileId: input.productionProfileId, productionEntryId: input.productionEntryId, productionEntry: input.productionEntry, productionDocumentId: input.productionDocumentId, productionCitationId: input.productionCitationId })).digest("hex").slice(0, 24)}`;
}

function validateProductionTechnicalProfileEntry(entry) {
  json.assertJsonSafe(entry);
  assert(entry && typeof entry === "object", "Production Technical Profile entry is required");
  assert(nonEmpty(entry.id) && nonEmpty(entry.type) && nonEmpty(entry.categoryId), "Production Technical Profile entry identity is incomplete");
  assert(entry.status === "verified", "Production Technical Profile entry must be verified");
  assert(Array.isArray(entry.sourceIds) && entry.sourceIds.length === 1 && nonEmpty(entry.sourceIds[0]), "Production Technical Profile entry citation binding is incomplete");
  assert(entry.value && typeof entry.value === "object", "Production Technical Profile entry value is incomplete");
  return json.immutableClone(entry);
}

function validateProductionTechnicalProfileEntryMaterializationResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_SCHEMA_VERSION, "Production Technical Profile entry materialization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `Production Technical Profile entry materialization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-technical-profile-entry-materialization\.[a-f0-9]{24}$/.test(input.id), "Production Technical Profile entry materialization.id is invalid");
  assert(input.requirementType === PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT, "Production Technical Profile entry materializer requirement type is invalid");
  assert(ACTIONS.includes(input.action), "Production Technical Profile entry materialization action is invalid");
  assert(input.profileIdentity && nonEmpty(input.profileIdentity.targetId) && nonEmpty(input.profileIdentity.catalogVariantKey), "Production Technical Profile entry profile identity is incomplete");
  assert(nonEmpty(input.productionProfileId) && nonEmpty(input.productionEntryId) && nonEmpty(input.productionProfilePath), "Production Technical Profile entry production identity is incomplete");
  assert(input.productionEntry && input.productionEntry.id === input.productionEntryId, "Production Technical Profile entry identity is incomplete");
  validateProductionTechnicalProfileEntry(input.productionEntry);
  assert(nonEmpty(input.productionDocumentId) && nonEmpty(input.productionCitationId), "Production Technical Profile entry source binding is incomplete");
  assert(input.sourceIdentity && input.targetIdentity && input.targetApplicability, "Production Technical Profile entry lineage is incomplete");
  assert(typeof input.productionCreated === "boolean" && input.productionCreated === (input.action === "CREATED"), "Production Technical Profile entry creation state is invalid");
  assert(input.id === productionTechnicalProfileEntryMaterializationResultId(input), "Production Technical Profile entry materialization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_SCHEMA_VERSION, PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT, ACTIONS, productionTechnicalProfileEntryMaterializationResultId, validateProductionTechnicalProfileEntry, validateProductionTechnicalProfileEntryMaterializationResult });
