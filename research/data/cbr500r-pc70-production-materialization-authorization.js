// NON-PRODUCTION projection of the CBR500R ready requirement set at the human gate.
"use strict";

const factory = require("../factory/index.js");
const registryResult = require("./cbr500r-pc70-registry-requirement-reevaluation.js");

const materializationRequirementsId = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildResult() {
  const source = registryResult.buildResult();
  if (source.materializationAuthorization.id !== materializationRequirementsId) throw new Error("CBR500R materialization authorization input is out of scope");
  const result = factory.authorizeProductionMaterialization(source.materializationAuthorization);
  if (result.authorizationState !== "PENDING-MATERIALIZATION-AUTHORIZATION" || result.materializationAllowed !== false || result.productionCreated !== false) throw new Error("CBR500R must remain pending at the human materialization authorization boundary");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-production-materialization-authorization/v1",
    materializationRequirementsId,
    productionAuthorizationId,
    authorization: result,
    assertions: {
      exactlyOneRequirementsAuthorizationConsumed: true,
      requirementsReadyConsumed: result.requirementsAuthorizationState === "REQUIREMENTS-READY" && result.requirementsAuthorizationReasons.length === 0,
      allFourRequirementsReady: result.requirements.every(item => item.state === "READY"),
      humanDecisionAbsent: result.humanDecision === null,
      materializationUnauthorized: result.authorizationState === "PENDING-MATERIALIZATION-AUTHORIZATION" && result.materializationAllowed === false,
      productionCreatedFalse: result.productionCreated === false,
      rawValuePreserved: result.rawSource.rawValue === source.materializationAuthorization.rawSource.rawValue,
      applicabilityPreserved: result.targetApplicability.abs === "KNOWN" && result.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noProductionMutation: true,
      noPromotion: true
    },
    next: "Perform bounded human materialization authorization for this exact CBR500R requirement set; do not materialize production data."
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R materialization authorization projection is not deterministic");
  const authorization = first.authorization;
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-production-materialization-authorization/v1",
    materializationRequirementsId,
    productionAuthorizationId,
    authorizationId: authorization.id,
    authorizationState: authorization.authorizationState,
    reasons: authorization.reasons,
    materializationAllowed: authorization.materializationAllowed,
    productionCreated: authorization.productionCreated,
    humanDecision: authorization.humanDecision,
    declaredRequirements: authorization.declaredRequirements,
    requirements: authorization.requirements,
    lineage: authorization.lineage,
    sourceIdentity: authorization.sourceIdentity,
    targetIdentity: authorization.targetIdentity,
    targetApplicability: authorization.targetApplicability,
    proposedProduction: authorization.proposedProduction,
    rawValue: authorization.rawSource.rawValue,
    assertions: first.assertions,
    next: first.next
  });
}

module.exports = Object.freeze({ buildResult, buildReport });
