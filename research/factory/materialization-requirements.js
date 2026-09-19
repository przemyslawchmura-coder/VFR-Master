// NON-PRODUCTION generic materialization-requirements authorization gate.
"use strict";

const authorizationContracts = require("./production-promotion-authorization-contracts.js");
const contracts = require("./materialization-requirements-contracts.js");
const json = require("./json.js");

function authorizeMaterializationRequirements(productionAuthorization, providedInputs = {}) {
  const upstream = authorizationContracts.validateProductionPromotionAuthorization(productionAuthorization);
  const before = json.canonicalSerialize(upstream);
  if (!Array.isArray(upstream.futureMaterializationRequirements) || upstream.futureMaterializationRequirements.length === 0) throw new TypeError("MaterializationRequirementsAuthorization requires declared materialization requirements");
  if (new Set(upstream.futureMaterializationRequirements).size !== upstream.futureMaterializationRequirements.length) throw new TypeError("MaterializationRequirementsAuthorization rejects duplicate requirements");
  if (!upstream.futureMaterializationRequirements.every(item => contracts.REQUIREMENT_TYPES.includes(item))) throw new TypeError("MaterializationRequirementsAuthorization rejects unknown requirements");
  if (!providedInputs || typeof providedInputs !== "object" || Array.isArray(providedInputs)) throw new TypeError("MaterializationRequirementsAuthorization providedInputs is invalid");

  const declaredRequirements = [...upstream.futureMaterializationRequirements].sort();
  const upstreamBlocked = upstream.authorizationState !== "AUTHORIZATION-READY" || upstream.reasons.length > 0;
  const requirements = declaredRequirements.map(type => {
    const requiredInputs = contracts.REQUIRED_INPUTS[type];
    const supplied = providedInputs[type] === undefined ? [] : providedInputs[type];
    if (!Array.isArray(supplied) || supplied.some(item => typeof item !== "string" || item.length === 0)) throw new TypeError(`MaterializationRequirementsAuthorization inputs for ${type} are invalid`);
    const missingInputs = requiredInputs.filter(item => !supplied.includes(item));
    const state = upstreamBlocked ? "BLOCKED" : missingInputs.length > 0 ? "PENDING" : "READY";
    const reasons = upstreamBlocked ? ["UPSTREAM-AUTHORIZATION-BLOCKED"] : missingInputs.length > 0 ? ["REQUIRED-MATERIALIZATION-INPUTS-MISSING"] : [];
    return { type, state, requiredInputs: [...requiredInputs], missingInputs, reasons };
  });
  const aggregateState = requirements.some(item => item.state === "BLOCKED") ? "REQUIREMENTS-BLOCKED" : requirements.some(item => item.state === "PENDING") ? "REQUIREMENTS-PENDING" : "REQUIREMENTS-READY";
  const aggregateReasons = aggregateState === "REQUIREMENTS-READY" ? [] : [aggregateState === "REQUIREMENTS-BLOCKED" ? "MATERIALIZATION-REQUIREMENT-BLOCKED" : "MATERIALIZATION-INPUTS-PENDING"];
  const resultInput = {
    schemaVersion: contracts.MATERIALIZATION_REQUIREMENTS_SCHEMA_VERSION,
    id: "placeholder",
    productionAuthorizationId: upstream.id,
    productionAuthorizationState: upstream.authorizationState,
    productionAuthorizationReasons: [...upstream.reasons],
    declaredRequirements,
    requirements,
    aggregateState,
    aggregateReasons,
    humanAuthorizationRequired: true,
    materializationAllowed: false,
    lineage: {
      productionAuthorizationId: upstream.id,
      schemaConversionProjectionId: upstream.schemaConversionProjectionId,
      promotionReviewDecisionId: upstream.promotionReviewDecisionId,
      promotionReviewPacketId: upstream.promotionReviewPacketId,
      promotionPacketId: upstream.promotionPacketId,
      evidenceProcessingRecordId: upstream.evidenceProcessingRecordId,
      researchCanonicalFieldId: upstream.researchCanonicalFieldId
    },
    sourceIdentity: upstream.sourceIdentity,
    rawSource: upstream.rawSource,
    targetIdentity: upstream.targetIdentity,
    targetApplicability: upstream.targetApplicability,
    proposedProduction: upstream.proposedProduction,
    productionCreated: false
  };
  resultInput.id = contracts.materializationRequirementsAuthorizationId(resultInput);
  const result = contracts.validateMaterializationRequirementsAuthorization(resultInput);
  if (json.canonicalSerialize(upstream) !== before) throw new Error("Materialization requirements authorization mutated upstream authorization");
  return result;
}

module.exports = Object.freeze({ authorizeMaterializationRequirements });
