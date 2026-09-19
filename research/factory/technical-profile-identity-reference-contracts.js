// NON-PRODUCTION generic intended Technical Profile identity references.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const TECHNICAL_PROFILE_DEFINITION_REF_SCHEMA_VERSION = 1;
const TECHNICAL_PROFILE_DEFINITION_REF_TYPE = "TECHNICAL-PROFILE-DEFINITION-REF";
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function technicalProfileDefinitionRefId(input) {
  return `technical-profile-definition-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, profileIdentity: input.profileIdentity, catalogueIdentityProof: input.catalogueIdentityProof, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function validateTechnicalProfileDefinitionRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === TECHNICAL_PROFILE_DEFINITION_REF_SCHEMA_VERSION, "TechnicalProfileDefinitionReference schemaVersion is incompatible");
  assert(input.type === TECHNICAL_PROFILE_DEFINITION_REF_TYPE, "TechnicalProfileDefinitionReference.type is invalid");
  assert(input.nonProduction === true, "TechnicalProfileDefinitionReference must remain non-production");
  assert(input.productionProfileId === null, "TechnicalProfileDefinitionReference cannot claim an existing production profile");
  assert(input.registryMembership === "NOT-REGISTERED", "TechnicalProfileDefinitionReference registry membership is invalid");
  const identity = input.profileIdentity;
  assert(identity && typeof identity === "object", "TechnicalProfileDefinitionReference.profileIdentity is incomplete");
  ["targetId", "catalogVariantKey", "manufacturer", "model", "generation", "market", "transmission", "equipment"].forEach(field => assert(nonEmpty(identity[field]), `TechnicalProfileDefinitionReference.profileIdentity.${field} is required`));
  assert(/^target\.[a-z0-9.-]+$/.test(identity.targetId), "TechnicalProfileDefinitionReference.targetId is invalid");
  assert(/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(identity.catalogVariantKey), "TechnicalProfileDefinitionReference.catalogVariantKey is invalid");
  assert(identity.targetId.includes(identity.catalogVariantKey), "TechnicalProfileDefinitionReference target/catalog identity mismatch");
  assert(Number.isInteger(identity.modelYear) && identity.modelYear >= 1900 && identity.modelYear <= 2100, "TechnicalProfileDefinitionReference.modelYear is invalid");
  assert(typeof identity.abs === "boolean", "TechnicalProfileDefinitionReference.abs must be known");
  const proof = input.catalogueIdentityProof;
  assert(proof && proof.source === "repository-catalogue-and-research-target", "TechnicalProfileDefinitionReference catalogue identity proof is missing");
  assert(proof.catalogVariantKey === identity.catalogVariantKey && proof.targetId === identity.targetId, "TechnicalProfileDefinitionReference catalogue identity proof does not match");
  assert(typeof input.id === "string" && /^technical-profile-definition-ref\.[a-f0-9]{24}$/.test(input.id), "TechnicalProfileDefinitionReference.id is invalid");
  assert(input.id === technicalProfileDefinitionRefId(input), "TechnicalProfileDefinitionReference.id is unstable");
  return json.immutableClone(input);
}

function createTechnicalProfileDefinitionRef(input) {
  const result = {
    schemaVersion: TECHNICAL_PROFILE_DEFINITION_REF_SCHEMA_VERSION,
    type: TECHNICAL_PROFILE_DEFINITION_REF_TYPE,
    id: "placeholder",
    profileIdentity: input.profileIdentity,
    catalogueIdentityProof: input.catalogueIdentityProof,
    productionProfileId: null,
    registryMembership: "NOT-REGISTERED",
    nonProduction: true
  };
  result.id = technicalProfileDefinitionRefId(result);
  return validateTechnicalProfileDefinitionRef(result);
}

module.exports = Object.freeze({ TECHNICAL_PROFILE_DEFINITION_REF_SCHEMA_VERSION, TECHNICAL_PROFILE_DEFINITION_REF_TYPE, technicalProfileDefinitionRefId, createTechnicalProfileDefinitionRef, validateTechnicalProfileDefinitionRef });
