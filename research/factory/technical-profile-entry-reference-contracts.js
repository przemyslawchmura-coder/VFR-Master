// NON-PRODUCTION generic intended Technical Profile entry references.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const identity = require("./technical-profile-identity-reference-contracts.js");
const inputRefs = require("./materialization-input-reference-contracts.js");

const TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_SCHEMA_VERSION = 1;
const TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_TYPE = "TECHNICAL-PROFILE-ENTRY-DEFINITION-REF";
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function technicalProfileEntryDefinitionRefId(input) {
  return `technical-profile-entry-definition-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, profileDefinitionRefId: input.profileDefinitionRefId, targetIdentity: input.targetIdentity, productionAuthorizationId: input.productionAuthorizationId, categoryId: input.categoryId, entryId: input.entryId, entryType: input.entryType, value: input.value, citationDefinitionRefId: input.citationDefinitionRefId, applicability: input.applicability, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function validateTechnicalProfileEntryDefinitionRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_SCHEMA_VERSION, "TechnicalProfileEntryDefinitionReference schemaVersion is incompatible");
  assert(input.type === TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_TYPE, "TechnicalProfileEntryDefinitionReference.type is invalid");
  assert(input.nonProduction === true, "TechnicalProfileEntryDefinitionReference must remain non-production");
  assert(input.profileDefinitionRefId && /^technical-profile-definition-ref\.[a-f0-9]{24}$/.test(input.profileDefinitionRefId), "TechnicalProfileEntryDefinitionReference.profileDefinitionRefId is invalid");
  assert(input.targetIdentity && typeof input.targetIdentity === "object", "TechnicalProfileEntryDefinitionReference.targetIdentity is incomplete");
  ["targetId", "catalogVariantKey"].forEach(field => assert(nonEmpty(input.targetIdentity[field]), `TechnicalProfileEntryDefinitionReference.targetIdentity.${field} is required`));
  assert(nonEmpty(input.productionAuthorizationId), "TechnicalProfileEntryDefinitionReference.productionAuthorizationId is required");
  assert(nonEmpty(input.categoryId) && nonEmpty(input.entryId) && nonEmpty(input.entryType), "TechnicalProfileEntryDefinitionReference production entry identity is incomplete");
  assert(input.value && typeof input.value === "object" && input.value.type === "text" && typeof input.value.text === "string", "TechnicalProfileEntryDefinitionReference.value is invalid");
  assert(input.citationDefinitionRefId && /^citation-definition-ref\.[a-f0-9]{24}$/.test(input.citationDefinitionRefId), "TechnicalProfileEntryDefinitionReference.citationDefinitionRefId is invalid");
  assert(input.applicability && typeof input.applicability === "object", "TechnicalProfileEntryDefinitionReference.applicability is incomplete");
  assert(typeof input.id === "string" && /^technical-profile-entry-definition-ref\.[a-f0-9]{24}$/.test(input.id), "TechnicalProfileEntryDefinitionReference.id is invalid");
  assert(input.id === technicalProfileEntryDefinitionRefId(input), "TechnicalProfileEntryDefinitionReference.id is unstable");
  return json.immutableClone(input);
}

function createTechnicalProfileEntryDefinitionRef(input) {
  const result = { schemaVersion: TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_SCHEMA_VERSION, type: TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_TYPE, id: "placeholder", profileDefinitionRefId: input.profileDefinitionRefId, targetIdentity: input.targetIdentity, productionAuthorizationId: input.productionAuthorizationId, categoryId: input.categoryId, entryId: input.entryId, entryType: input.entryType, value: input.value, citationDefinitionRefId: input.citationDefinitionRefId, applicability: input.applicability, nonProduction: true };
  result.id = technicalProfileEntryDefinitionRefId(result);
  return validateTechnicalProfileEntryDefinitionRef(result);
}

function assertCompatibleTechnicalProfileEntry(profileDefinitionRef, entryDefinitionRef, citationDefinitionRef, productionAuthorizationId) {
  const profile = identity.validateTechnicalProfileDefinitionRef(profileDefinitionRef);
  const entry = validateTechnicalProfileEntryDefinitionRef(entryDefinitionRef);
  const citation = inputRefs.validateCitationDefinitionRef(citationDefinitionRef);
  assert(entry.profileDefinitionRefId === profile.id, "Technical Profile entry/profile identity mismatch");
  assert(entry.targetIdentity.targetId === profile.profileIdentity.targetId && entry.targetIdentity.catalogVariantKey === profile.profileIdentity.catalogVariantKey, "Technical Profile entry target identity mismatch");
  assert(entry.citationDefinitionRefId === citation.id, "Technical Profile entry/citation identity mismatch");
  assert(citation.citationIdentity.canonicalFieldId === "lubrication.oil-specification" || nonEmpty(citation.citationIdentity.canonicalFieldId), "Technical Profile citation identity is incomplete");
  assert(entry.productionAuthorizationId === productionAuthorizationId, "Technical Profile entry authorization lineage mismatch");
  return Object.freeze({ profile, entry, citation });
}

module.exports = Object.freeze({ TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_SCHEMA_VERSION, TECHNICAL_PROFILE_ENTRY_DEFINITION_REF_TYPE, technicalProfileEntryDefinitionRefId, createTechnicalProfileEntryDefinitionRef, validateTechnicalProfileEntryDefinitionRef, assertCompatibleTechnicalProfileEntry });
