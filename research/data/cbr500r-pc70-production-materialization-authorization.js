// NON-PRODUCTION explicit human authorization of the CBR500R requirement set.
"use strict";

const factory = require("../factory/index.js");
const registryResult = require("./cbr500r-pc70-registry-requirement-reevaluation.js");

const materializationRequirementsId = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";
const reviewerId = "reviewer.revlog.operator";
const rationale = "The exact CBR500R PC70 MY2024 USA/Canada oil-specification lineage has completed the bounded research, review, evidence-processing, applicability, schema-conversion, production-authorization and materialization-requirements gates. All four declared materialization requirements are READY. Approve this exact immutable lineage for future controlled production materialization.";

function buildResult() {
  const source = registryResult.buildResult();
  if (source.materializationAuthorization.id !== materializationRequirementsId) throw new Error("CBR500R materialization authorization input is out of scope");
  const decision = factory.createProductionMaterializationDecision(materializationRequirementsId, {
    decision: "APPROVE-FOR-MATERIALIZATION",
    reviewerId,
    rationale
  });
  const result = factory.authorizeProductionMaterialization(source.materializationAuthorization, decision);
  if (result.authorizationState !== "AUTHORIZED-FOR-MATERIALIZATION" || result.materializationAllowed !== true || result.productionCreated !== false) throw new Error("CBR500R human materialization authorization did not produce the expected future-only authorization");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-production-materialization-authorization/v1",
    materializationRequirementsId,
    productionAuthorizationId,
    authorization: result,
    assertions: {
      exactlyOneRequirementsAuthorizationConsumed: true,
      requirementsReadyConsumed: result.requirementsAuthorizationState === "REQUIREMENTS-READY" && result.requirementsAuthorizationReasons.length === 0,
      allFourRequirementsReady: result.requirements.every(item => item.state === "READY"),
      humanDecisionPreserved: result.humanDecision && result.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION" && result.humanDecision.reviewerId === reviewerId && result.humanDecision.rationale === rationale,
      materializationAuthorizedForFutureOnly: result.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && result.materializationAllowed === true && result.productionCreated === false,
      productionCreatedFalse: result.productionCreated === false,
      rawValuePreserved: result.rawSource.rawValue === source.materializationAuthorization.rawSource.rawValue,
      applicabilityPreserved: result.targetApplicability.abs === "KNOWN" && result.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noProductionMutation: true,
      noPromotion: true
    },
    next: "Design and execute the first bounded controlled production materializer for this exact authorized CBR500R lineage; do not broaden scope."
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
