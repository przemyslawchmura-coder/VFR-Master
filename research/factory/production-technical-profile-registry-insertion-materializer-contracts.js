// GENERIC production Technical Profile registry-insertion result contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const registryRefs = require("./registry-input-reference-contracts.js");

const SCHEMA_VERSION = 1;
const ACTIONS = Object.freeze(["CREATED", "REUSED"]);
const fields = new Set([
  "schemaVersion", "id", "productionMaterializationAuthorizationId",
  "materializationRequirementsAuthorizationId", "productionAuthorizationId",
  "humanDecisionId", "requirementType", "action", "registryEntry",
  "applicabilityRef", "catalogueIdentityRef", "profileDefinitionRef",
  "productionProfileId", "productionProfilePath", "registryMembership",
  "productionCreated"
]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function resultId(input) {
  return `production-technical-profile-registry-insertion.${crypto.createHash("sha256").update(json.canonicalSerialize({
    productionMaterializationAuthorizationId: input.productionMaterializationAuthorizationId,
    materializationRequirementsAuthorizationId: input.materializationRequirementsAuthorizationId,
    productionAuthorizationId: input.productionAuthorizationId,
    humanDecisionId: input.humanDecisionId,
    requirementType: input.requirementType,
    registryEntry: input.registryEntry,
    applicabilityRef: input.applicabilityRef,
    catalogueIdentityRef: input.catalogueIdentityRef,
    profileDefinitionRef: input.profileDefinitionRef,
    productionProfileId: input.productionProfileId,
    productionProfilePath: input.productionProfilePath
  })).digest("hex").slice(0, 24)}`;
}

function validateRegistryEntry(entry) {
  assert(entry && typeof entry === "object", "Registry insertion entry is incomplete");
  assert(typeof entry.profileId === "string" && entry.profileId.length > 0, "Registry insertion profileId is required");
  assert(Array.isArray(entry.catalogVariantKeys) && entry.catalogVariantKeys.length === 1 && typeof entry.catalogVariantKeys[0] === "string", "Registry insertion catalogVariantKeys are invalid");
  assert(entry.years && Number.isInteger(entry.years.from) && entry.years.from === entry.years.to, "Registry insertion years are invalid");
  assert(typeof entry.moduleId === "string" && entry.moduleId.length > 0, "Registry insertion moduleId is required");
  assert(entry.schemaVersion === "revlog-technical-profile/v1", "Registry insertion profile schemaVersion is invalid");
  assert(["draft", "review", "published", "deprecated"].includes(entry.status), "Registry insertion profile status is invalid");
}

function validateResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_VERSION, "Registry insertion result schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `Registry insertion result.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-technical-profile-registry-insertion\.[a-f0-9]{24}$/.test(input.id), "Registry insertion result.id is invalid");
  assert(input.requirementType === "REGISTRY-INSERTION", "Registry insertion result requirementType is invalid");
  assert(ACTIONS.includes(input.action), "Registry insertion result action is invalid");
  registryRefs.validateApplicabilityRef(input.applicabilityRef);
  registryRefs.validateCatalogueIdentityRef(input.catalogueIdentityRef);
  assert(input.profileDefinitionRef && input.profileDefinitionRef.nonProduction === true, "Registry insertion result profile reference is invalid");
  validateRegistryEntry(input.registryEntry);
  assert(input.registryEntry.profileId === input.productionProfileId && input.registryEntry.moduleId === input.productionProfilePath, "Registry insertion result profile identity is inconsistent");
  assert(input.registryEntry.catalogVariantKeys[0] === input.catalogueIdentityRef.targetIdentity.catalogVariantKey, "Registry insertion result catalogue identity is inconsistent");
  assert(input.registryEntry.years.from === input.profileDefinitionRef.profileIdentity.modelYear, "Registry insertion result year is inconsistent");
  assert(input.registryMembership === "REGISTERED", "Registry insertion result membership is invalid");
  assert(typeof input.productionCreated === "boolean" && input.productionCreated === (input.action === "CREATED"), "Registry insertion result productionCreated is invalid");
  assert(input.id === resultId(input), "Registry insertion result.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ SCHEMA_VERSION, ACTIONS, resultId, validateResult });
