// NON-PRODUCTION explicit human authorization boundary before materialization.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const requirementsContracts = require("./materialization-requirements-contracts.js");

const PRODUCTION_MATERIALIZATION_AUTHORIZATION_SCHEMA_VERSION = 1;
const PRODUCTION_MATERIALIZATION_DECISION_SCHEMA_VERSION = 1;
const DECISION_TYPES = Object.freeze(["APPROVE-FOR-MATERIALIZATION", "REJECT-FOR-MATERIALIZATION"]);
const AUTHORIZATION_STATES = Object.freeze(["PENDING-MATERIALIZATION-AUTHORIZATION", "AUTHORIZED-FOR-MATERIALIZATION", "REJECTED-FOR-MATERIALIZATION", "BLOCKED-MATERIALIZATION-AUTHORIZATION"]);
const fields = new Set(["schemaVersion", "id", "materializationRequirementsAuthorizationId", "productionAuthorizationId", "requirementsAuthorizationState", "requirementsAuthorizationReasons", "declaredRequirements", "requirements", "humanDecision", "authorizationState", "reasons", "materializationAllowed", "productionCreated", "lineage", "sourceIdentity", "rawSource", "targetIdentity", "targetApplicability", "proposedProduction"]);
const decisionFields = new Set(["schemaVersion", "id", "materializationRequirementsAuthorizationId", "decision", "reviewerId", "rationale"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

const productionMaterializationDecisionId = input => `production-materialization-decision.${crypto.createHash("sha256").update(json.canonicalSerialize({ materializationRequirementsAuthorizationId: input.materializationRequirementsAuthorizationId, decision: input.decision, reviewerId: input.reviewerId, rationale: input.rationale })).digest("hex").slice(0, 24)}`;
const productionMaterializationAuthorizationId = input => `production-materialization-authorization.${crypto.createHash("sha256").update(json.canonicalSerialize({ materializationRequirementsAuthorizationId: input.materializationRequirementsAuthorizationId, humanDecision: input.humanDecision, authorizationState: input.authorizationState, reasons: input.reasons, materializationAllowed: input.materializationAllowed })).digest("hex").slice(0, 24)}`;

function validatePayload(input) {
  assert(input.sourceIdentity && nonEmpty(input.sourceIdentity.sourceId) && nonEmpty(input.sourceIdentity.prospectId) && nonEmpty(input.sourceIdentity.documentId) && nonEmpty(input.sourceIdentity.authority) && nonEmpty(input.sourceIdentity.tier), "ProductionMaterializationAuthorization source identity is incomplete");
  assert(input.rawSource && typeof input.rawSource.rawValue === "string" && input.rawSource.provenance && typeof input.rawSource.provenance === "object", "ProductionMaterializationAuthorization raw source is incomplete");
  assert(input.targetIdentity && nonEmpty(input.targetIdentity.id) && nonEmpty(input.targetIdentity.catalogVariantKey) && input.targetIdentity.id.includes(input.targetIdentity.catalogVariantKey), "ProductionMaterializationAuthorization target identity is incomplete");
  assert(input.targetApplicability && ["modelYear", "market", "transmission", "equipment", "abs"].every(field => nonEmpty(input.targetApplicability[field])), "ProductionMaterializationAuthorization applicability is incomplete");
  assert(input.proposedProduction && nonEmpty(input.proposedProduction.categoryId) && nonEmpty(input.proposedProduction.entryId) && nonEmpty(input.proposedProduction.type) && input.proposedProduction.value && typeof input.proposedProduction.value === "object", "ProductionMaterializationAuthorization proposed production is incomplete");
}

function validateProductionMaterializationDecision(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PRODUCTION_MATERIALIZATION_DECISION_SCHEMA_VERSION, "ProductionMaterializationDecision schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(decisionFields.has(field), `ProductionMaterializationDecision.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-materialization-decision\.[a-f0-9]{24}$/.test(input.id), "ProductionMaterializationDecision.id is invalid");
  assert(nonEmpty(input.materializationRequirementsAuthorizationId), "ProductionMaterializationDecision upstream authorization is required");
  assert(DECISION_TYPES.includes(input.decision), "ProductionMaterializationDecision.decision is invalid");
  assert(nonEmpty(input.reviewerId), "ProductionMaterializationDecision.reviewerId is required");
  assert(nonEmpty(input.rationale), "ProductionMaterializationDecision.rationale is required");
  assert(input.id === productionMaterializationDecisionId(input), "ProductionMaterializationDecision.id is unstable");
  return json.immutableClone(input);
}

function createProductionMaterializationDecision(materializationRequirementsAuthorizationId, { decision, reviewerId, rationale }) {
  const result = { schemaVersion: PRODUCTION_MATERIALIZATION_DECISION_SCHEMA_VERSION, id: "placeholder", materializationRequirementsAuthorizationId, decision, reviewerId, rationale };
  result.id = productionMaterializationDecisionId(result);
  return validateProductionMaterializationDecision(result);
}

function validateProductionMaterializationAuthorization(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PRODUCTION_MATERIALIZATION_AUTHORIZATION_SCHEMA_VERSION, "ProductionMaterializationAuthorization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `ProductionMaterializationAuthorization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-materialization-authorization\.[a-f0-9]{24}$/.test(input.id), "ProductionMaterializationAuthorization.id is invalid");
  assert(nonEmpty(input.materializationRequirementsAuthorizationId) && nonEmpty(input.productionAuthorizationId), "ProductionMaterializationAuthorization lineage is incomplete");
  assert(input.requirementsAuthorizationState === "REQUIREMENTS-READY" || input.requirementsAuthorizationState === "REQUIREMENTS-PENDING" || input.requirementsAuthorizationState === "REQUIREMENTS-BLOCKED", "ProductionMaterializationAuthorization upstream state is invalid");
  assert(Array.isArray(input.requirementsAuthorizationReasons), "ProductionMaterializationAuthorization upstream reasons are invalid");
  assert(Array.isArray(input.declaredRequirements) && JSON.stringify(input.declaredRequirements) === JSON.stringify([...input.declaredRequirements].sort()), "ProductionMaterializationAuthorization declared requirements are invalid");
  assert(input.declaredRequirements.every(item => requirementsContracts.REQUIREMENT_TYPES.includes(item)), "ProductionMaterializationAuthorization contains an unknown requirement");
  assert(new Set(input.declaredRequirements).size === input.declaredRequirements.length, "ProductionMaterializationAuthorization contains duplicate requirements");
  assert(Array.isArray(input.requirements) && input.requirements.length === input.declaredRequirements.length, "ProductionMaterializationAuthorization requirements are incomplete");
  input.requirements.forEach(item => {
    assert(item && input.declaredRequirements.includes(item.type), "ProductionMaterializationAuthorization requirement is undeclared");
    assert(item.state === "READY" || item.state === "PENDING" || item.state === "BLOCKED", "ProductionMaterializationAuthorization requirement state is invalid");
    assert(Array.isArray(item.requiredInputs) && Array.isArray(item.missingInputs) && Array.isArray(item.reasons), "ProductionMaterializationAuthorization requirement details are invalid");
    const expectedInputs = requirementsContracts.REQUIRED_INPUTS[item.type];
    assert(JSON.stringify(item.requiredInputs) === JSON.stringify(expectedInputs), `ProductionMaterializationAuthorization.${item.type} required inputs are invalid`);
    assert(new Set(item.requiredInputs).size === item.requiredInputs.length, `ProductionMaterializationAuthorization.${item.type} required inputs are duplicated`);
  });
  assert(input.humanDecision === null || validateProductionMaterializationDecision(input.humanDecision), "ProductionMaterializationAuthorization human decision is invalid");
  assert(AUTHORIZATION_STATES.includes(input.authorizationState), "ProductionMaterializationAuthorization state is invalid");
  assert(Array.isArray(input.reasons), "ProductionMaterializationAuthorization reasons are invalid");
  assert(typeof input.materializationAllowed === "boolean" && input.productionCreated === false, "ProductionMaterializationAuthorization production boundary is invalid");
  assert(input.materializationAllowed === (input.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION"), "ProductionMaterializationAuthorization allowed/state mismatch");
  assert(input.lineage && input.lineage.productionAuthorizationId === input.productionAuthorizationId && input.lineage.materializationRequirementsAuthorizationId === input.materializationRequirementsAuthorizationId, "ProductionMaterializationAuthorization lineage is incomplete");
  validatePayload(input);
  assert(input.id === productionMaterializationAuthorizationId(input), "ProductionMaterializationAuthorization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ PRODUCTION_MATERIALIZATION_AUTHORIZATION_SCHEMA_VERSION, PRODUCTION_MATERIALIZATION_DECISION_SCHEMA_VERSION, DECISION_TYPES, AUTHORIZATION_STATES, productionMaterializationDecisionId, productionMaterializationAuthorizationId, createProductionMaterializationDecision, validateProductionMaterializationDecision, validateProductionMaterializationAuthorization });
