// NON-PRODUCTION generic materialization-requirements authorization contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const MATERIALIZATION_REQUIREMENTS_SCHEMA_VERSION = 1;
const REQUIREMENT_TYPES = Object.freeze([
  "PRODUCTION-CITATION-MATERIALIZATION",
  "PRODUCTION-DOCUMENT-MATERIALIZATION",
  "REGISTRY-INSERTION",
  "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION"
]);
const REQUIREMENT_STATES = Object.freeze(["READY", "PENDING", "BLOCKED"]);
const AGGREGATE_STATES = Object.freeze(["REQUIREMENTS-READY", "REQUIREMENTS-PENDING", "REQUIREMENTS-BLOCKED"]);
const REQUIRED_INPUTS = Object.freeze({
  "PRODUCTION-DOCUMENT-MATERIALIZATION": Object.freeze(["document-definition-ref", "source-provenance-ref"]),
  "PRODUCTION-CITATION-MATERIALIZATION": Object.freeze(["citation-definition-ref", "document-definition-ref", "source-location-ref"]),
  "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": Object.freeze(["citation-definition-ref", "profile-entry-definition-ref", "profile-definition-ref"]),
  "REGISTRY-INSERTION": Object.freeze(["applicability-ref", "catalogue-identity-ref", "profile-definition-ref"])
});
const fields = new Set(["schemaVersion", "id", "productionAuthorizationId", "productionAuthorizationState", "productionAuthorizationReasons", "declaredRequirements", "requirements", "aggregateState", "aggregateReasons", "humanAuthorizationRequired", "materializationAllowed", "lineage", "sourceIdentity", "rawSource", "targetIdentity", "targetApplicability", "proposedProduction", "productionCreated"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

const materializationRequirementsAuthorizationId = input => `materialization-authorization.${crypto.createHash("sha256").update(json.canonicalSerialize({ productionAuthorizationId: input.productionAuthorizationId, requirements: input.requirements, aggregateState: input.aggregateState })).digest("hex").slice(0, 24)}`;

function validateMaterializationRequirementsAuthorization(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === MATERIALIZATION_REQUIREMENTS_SCHEMA_VERSION, "MaterializationRequirementsAuthorization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `MaterializationRequirementsAuthorization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^materialization-authorization\.[a-f0-9]{24}$/.test(input.id), "MaterializationRequirementsAuthorization.id is invalid");
  assert(typeof input.productionAuthorizationId === "string" && input.productionAuthorizationId.length > 0, "MaterializationRequirementsAuthorization.productionAuthorizationId is required");
  assert(input.productionAuthorizationState === "AUTHORIZATION-READY" || input.productionAuthorizationState === "AUTHORIZATION-BLOCKED", "MaterializationRequirementsAuthorization.productionAuthorizationState is invalid");
  assert(Array.isArray(input.productionAuthorizationReasons), "MaterializationRequirementsAuthorization.productionAuthorizationReasons is invalid");
  assert(Array.isArray(input.declaredRequirements) && input.declaredRequirements.length > 0, "MaterializationRequirementsAuthorization.declaredRequirements is required");
  assert(JSON.stringify(input.declaredRequirements) === JSON.stringify([...input.declaredRequirements].sort()), "MaterializationRequirementsAuthorization.declaredRequirements must be sorted");
  assert(input.declaredRequirements.every(item => REQUIREMENT_TYPES.includes(item)), "MaterializationRequirementsAuthorization contains an unknown requirement type");
  assert(new Set(input.declaredRequirements).size === input.declaredRequirements.length, "MaterializationRequirementsAuthorization contains duplicate requirements");
  assert(Array.isArray(input.requirements) && input.requirements.length === input.declaredRequirements.length, "MaterializationRequirementsAuthorization.requirements are incomplete");
  input.requirements.forEach(item => {
    assert(item && REQUIREMENT_TYPES.includes(item.type), "MaterializationRequirementsAuthorization requirement type is invalid");
    assert(input.declaredRequirements.includes(item.type), "MaterializationRequirementsAuthorization requirement is undeclared");
    assert(REQUIREMENT_STATES.includes(item.state), "MaterializationRequirementsAuthorization requirement state is invalid");
    assert(Array.isArray(item.requiredInputs) && JSON.stringify(item.requiredInputs) === JSON.stringify(REQUIRED_INPUTS[item.type]), "MaterializationRequirementsAuthorization required inputs are invalid");
    assert(Array.isArray(item.missingInputs) && item.missingInputs.every(ref => item.requiredInputs.includes(ref)), "MaterializationRequirementsAuthorization missing inputs are invalid");
    assert(Array.isArray(item.reasons), "MaterializationRequirementsAuthorization requirement reasons are invalid");
  });
  assert(input.aggregateState && AGGREGATE_STATES.includes(input.aggregateState), "MaterializationRequirementsAuthorization.aggregateState is invalid");
  assert(Array.isArray(input.aggregateReasons), "MaterializationRequirementsAuthorization.aggregateReasons is invalid");
  assert(input.humanAuthorizationRequired === true && input.materializationAllowed === false && input.productionCreated === false, "MaterializationRequirementsAuthorization production boundary is invalid");
  assert(input.lineage && input.lineage.productionAuthorizationId === input.productionAuthorizationId, "MaterializationRequirementsAuthorization lineage is incomplete");
  assert(input.sourceIdentity && input.targetIdentity && input.targetApplicability, "MaterializationRequirementsAuthorization source/target lineage is incomplete");
  assert(input.id === materializationRequirementsAuthorizationId(input), "MaterializationRequirementsAuthorization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ MATERIALIZATION_REQUIREMENTS_SCHEMA_VERSION, REQUIREMENT_TYPES, REQUIREMENT_STATES, AGGREGATE_STATES, REQUIRED_INPUTS, materializationRequirementsAuthorizationId, validateMaterializationRequirementsAuthorization });
