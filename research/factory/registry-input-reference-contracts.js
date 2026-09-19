// NON-PRODUCTION generic registry-insertion input references.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const identity = require("./technical-profile-identity-reference-contracts.js");

const REGISTRY_INPUT_REF_SCHEMA_VERSION = 1;
const APPLICABILITY_REF_TYPE = "APPLICABILITY-REF";
const CATALOGUE_IDENTITY_REF_TYPE = "CATALOGUE-IDENTITY-REF";
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function applicabilityRefId(input) {
  return `applicability-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, targetIdentity: input.targetIdentity, applicability: input.applicability, verificationId: input.verificationId, productionAuthorizationId: input.productionAuthorizationId, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function catalogueIdentityRefId(input) {
  return `catalogue-identity-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, targetIdentity: input.targetIdentity, identityProof: input.identityProof, productionAuthorizationId: input.productionAuthorizationId, productionProfileId: input.productionProfileId, registryMembership: input.registryMembership, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function validateTargetIdentity(targetIdentity, path) {
  assert(targetIdentity && typeof targetIdentity === "object", `${path} is incomplete`);
  assert(/^target\.[a-z0-9.-]+$/.test(targetIdentity.targetId || ""), `${path}.targetId is invalid`);
  assert(/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(targetIdentity.catalogVariantKey || ""), `${path}.catalogVariantKey is invalid`);
  assert(targetIdentity.targetId.includes(targetIdentity.catalogVariantKey), `${path} target/catalog identity mismatch`);
}

function validateApplicabilityRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REGISTRY_INPUT_REF_SCHEMA_VERSION, "ApplicabilityReference schemaVersion is incompatible");
  assert(input.type === APPLICABILITY_REF_TYPE, "ApplicabilityReference.type is invalid");
  assert(input.nonProduction === true, "ApplicabilityReference must remain non-production");
  validateTargetIdentity(input.targetIdentity, "ApplicabilityReference.targetIdentity");
  const applicability = input.applicability;
  assert(applicability && typeof applicability === "object", "ApplicabilityReference.applicability is incomplete");
  assert(Number.isInteger(applicability.modelYear) && applicability.modelYear >= 1900 && applicability.modelYear <= 2100, "ApplicabilityReference.modelYear is invalid");
  assert(Array.isArray(applicability.market) && applicability.market.length > 0 && applicability.market.every(nonEmpty), "ApplicabilityReference.market is invalid");
  assert(nonEmpty(applicability.transmission) && nonEmpty(applicability.equipment), "ApplicabilityReference transmission/equipment is incomplete");
  assert(typeof applicability.abs === "boolean", "ApplicabilityReference.abs must be known");
  assert(/^applicability-verification\.[a-f0-9]{24}$/.test(input.verificationId || ""), "ApplicabilityReference.verificationId is invalid");
  assert(nonEmpty(input.productionAuthorizationId), "ApplicabilityReference.productionAuthorizationId is required");
  assert(typeof input.id === "string" && /^applicability-ref\.[a-f0-9]{24}$/.test(input.id), "ApplicabilityReference.id is invalid");
  assert(input.id === applicabilityRefId(input), "ApplicabilityReference.id is unstable");
  return json.immutableClone(input);
}

function createApplicabilityRef(input) {
  const result = { schemaVersion: REGISTRY_INPUT_REF_SCHEMA_VERSION, type: APPLICABILITY_REF_TYPE, id: "placeholder", targetIdentity: input.targetIdentity, applicability: input.applicability, verificationId: input.verificationId, productionAuthorizationId: input.productionAuthorizationId, nonProduction: true };
  result.id = applicabilityRefId(result);
  return validateApplicabilityRef(result);
}

function validateCatalogueIdentityRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REGISTRY_INPUT_REF_SCHEMA_VERSION, "CatalogueIdentityReference schemaVersion is incompatible");
  assert(input.type === CATALOGUE_IDENTITY_REF_TYPE, "CatalogueIdentityReference.type is invalid");
  assert(input.nonProduction === true, "CatalogueIdentityReference must remain non-production");
  assert(input.productionProfileId === null, "CatalogueIdentityReference cannot claim an existing production profile");
  assert(input.registryMembership === "NOT-REGISTERED", "CatalogueIdentityReference registry membership is invalid");
  validateTargetIdentity(input.targetIdentity, "CatalogueIdentityReference.targetIdentity");
  assert(input.identityProof && input.identityProof.source === "repository-catalogue-and-research-target", "CatalogueIdentityReference identity proof is missing");
  assert(input.identityProof.targetId === input.targetIdentity.targetId && input.identityProof.catalogVariantKey === input.targetIdentity.catalogVariantKey, "CatalogueIdentityReference identity proof does not match");
  assert(nonEmpty(input.productionAuthorizationId), "CatalogueIdentityReference.productionAuthorizationId is required");
  assert(typeof input.id === "string" && /^catalogue-identity-ref\.[a-f0-9]{24}$/.test(input.id), "CatalogueIdentityReference.id is invalid");
  assert(input.id === catalogueIdentityRefId(input), "CatalogueIdentityReference.id is unstable");
  return json.immutableClone(input);
}

function createCatalogueIdentityRef(input) {
  const result = { schemaVersion: REGISTRY_INPUT_REF_SCHEMA_VERSION, type: CATALOGUE_IDENTITY_REF_TYPE, id: "placeholder", targetIdentity: input.targetIdentity, identityProof: input.identityProof, productionAuthorizationId: input.productionAuthorizationId, productionProfileId: null, registryMembership: "NOT-REGISTERED", nonProduction: true };
  result.id = catalogueIdentityRefId(result);
  return validateCatalogueIdentityRef(result);
}

function assertCompatibleRegistryInputs(applicabilityRef, catalogueIdentityRef, profileDefinitionRef, productionAuthorizationId) {
  const applicability = validateApplicabilityRef(applicabilityRef);
  const catalogue = validateCatalogueIdentityRef(catalogueIdentityRef);
  const profile = identity.validateTechnicalProfileDefinitionRef(profileDefinitionRef);
  assert(applicability.productionAuthorizationId === productionAuthorizationId && catalogue.productionAuthorizationId === productionAuthorizationId, "Registry input authorization lineage mismatch");
  assert(applicability.targetIdentity.targetId === catalogue.targetIdentity.targetId && applicability.targetIdentity.catalogVariantKey === catalogue.targetIdentity.catalogVariantKey, "Registry input target identity mismatch");
  assert(profile.profileIdentity.targetId === catalogue.targetIdentity.targetId && profile.profileIdentity.catalogVariantKey === catalogue.targetIdentity.catalogVariantKey, "Registry input/profile identity mismatch");
  assert(applicability.applicability.modelYear === profile.profileIdentity.modelYear && applicability.applicability.abs === profile.profileIdentity.abs, "Registry applicability/profile identity mismatch");
  return Object.freeze({ applicability, catalogue, profile });
}

module.exports = Object.freeze({ REGISTRY_INPUT_REF_SCHEMA_VERSION, APPLICABILITY_REF_TYPE, CATALOGUE_IDENTITY_REF_TYPE, applicabilityRefId, catalogueIdentityRefId, createApplicabilityRef, createCatalogueIdentityRef, validateApplicabilityRef, validateCatalogueIdentityRef, assertCompatibleRegistryInputs });
