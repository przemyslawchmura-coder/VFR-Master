// NON-PRODUCTION pure authorization gate before production materialization.
"use strict";

const requirementsContracts = require("./materialization-requirements-contracts.js");
const contracts = require("./production-materialization-authorization-contracts.js");
const json = require("./json.js");

function authorizeProductionMaterialization(requirementsAuthorization, humanDecision = null) {
  const upstream = requirementsContracts.validateMaterializationRequirementsAuthorization(requirementsAuthorization);
  const before = json.canonicalSerialize(upstream);
  const expectedRequirements = [...requirementsContracts.REQUIREMENT_TYPES].sort();
  const exactRequirements = upstream.declaredRequirements.length === expectedRequirements.length && JSON.stringify(upstream.declaredRequirements) === JSON.stringify(expectedRequirements);
  const allReady = exactRequirements && upstream.aggregateState === "REQUIREMENTS-READY" && upstream.aggregateReasons.length === 0 && upstream.requirements.length === expectedRequirements.length && upstream.requirements.every(item => item.state === "READY" && item.missingInputs.length === 0 && item.reasons.length === 0);
  if (humanDecision !== null) contracts.validateProductionMaterializationDecision(humanDecision);
  const decision = humanDecision === null ? null : json.immutableClone(humanDecision);
  const reasons = [];
  if (!exactRequirements) reasons.push("REQUIREMENTS-SET-INCOMPLETE");
  if (upstream.aggregateState !== "REQUIREMENTS-READY") reasons.push("REQUIREMENTS-NOT-READY");
  if (upstream.aggregateReasons.length > 0) reasons.push("UPSTREAM-REASONS-PRESENT");
  if (!allReady && reasons.length === 0) reasons.push("INDIVIDUAL-REQUIREMENT-NOT-READY");
  if (decision && decision.materializationRequirementsAuthorizationId !== upstream.id) reasons.push("STALE-HUMAN-DECISION");
  if (decision && decision.decision === "REJECT-FOR-MATERIALIZATION") reasons.push("HUMAN-MATERIALIZATION-REJECTED");
  const blocked = reasons.some(reason => ["REQUIREMENTS-SET-INCOMPLETE", "REQUIREMENTS-NOT-READY", "UPSTREAM-REASONS-PRESENT", "INDIVIDUAL-REQUIREMENT-NOT-READY", "STALE-HUMAN-DECISION"].includes(reason));
  const authorizationState = blocked ? "BLOCKED-MATERIALIZATION-AUTHORIZATION" : decision === null ? "PENDING-MATERIALIZATION-AUTHORIZATION" : decision.decision === "APPROVE-FOR-MATERIALIZATION" ? "AUTHORIZED-FOR-MATERIALIZATION" : "REJECTED-FOR-MATERIALIZATION";
  if (authorizationState === "PENDING-MATERIALIZATION-AUTHORIZATION") reasons.push("HUMAN-AUTHORIZATION-PENDING");
  const result = {
    schemaVersion: contracts.PRODUCTION_MATERIALIZATION_AUTHORIZATION_SCHEMA_VERSION,
    id: "placeholder",
    materializationRequirementsAuthorizationId: upstream.id,
    productionAuthorizationId: upstream.productionAuthorizationId,
    requirementsAuthorizationState: upstream.aggregateState,
    requirementsAuthorizationReasons: [...upstream.aggregateReasons],
    declaredRequirements: [...upstream.declaredRequirements],
    requirements: upstream.requirements,
    humanDecision: decision,
    authorizationState,
    reasons,
    materializationAllowed: authorizationState === "AUTHORIZED-FOR-MATERIALIZATION",
    productionCreated: false,
    lineage: { ...upstream.lineage, materializationRequirementsAuthorizationId: upstream.id },
    sourceIdentity: upstream.sourceIdentity,
    rawSource: upstream.rawSource,
    targetIdentity: upstream.targetIdentity,
    targetApplicability: upstream.targetApplicability,
    proposedProduction: upstream.proposedProduction
  };
  result.id = contracts.productionMaterializationAuthorizationId(result);
  const validated = contracts.validateProductionMaterializationAuthorization(result);
  if (json.canonicalSerialize(upstream) !== before) throw new Error("Production materialization authorization mutated upstream requirements authorization");
  return validated;
}

module.exports = Object.freeze({ authorizeProductionMaterialization });
