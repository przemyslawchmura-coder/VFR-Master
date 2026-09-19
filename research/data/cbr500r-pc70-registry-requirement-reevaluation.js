// NON-PRODUCTION bounded reevaluation for the CBR500R registry requirement.
"use strict";

const factory = require("../factory/index.js");
const previous = require("./cbr500r-pc70-profile-entry-requirement-reevaluation.js");
const authorizationData = require("./cbr500r-pc70-schema-conversion-authorization.js");
const identity = require("./cbr500r-pc70-technical-profile-identity.js");
const applicabilityData = require("./cbr500r-pc70-abs-applicability.js");

const priorResultId = "materialization-authorization.1ecd058954cf8f9084d5b6ec";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildReferences() {
  const profileDefinitionRef = identity.buildReference();
  const targetIdentity = { targetId: profileDefinitionRef.profileIdentity.targetId, catalogVariantKey: profileDefinitionRef.profileIdentity.catalogVariantKey };
  const verified = applicabilityData.buildReport().verifiedApplicability;
  const applicabilityRef = factory.createApplicabilityRef({
    targetIdentity,
    applicability: verified,
    verificationId: applicabilityData.id,
    productionAuthorizationId
  });
  const catalogueIdentityRef = factory.createCatalogueIdentityRef({
    targetIdentity,
    identityProof: { source: "repository-catalogue-and-research-target", targetId: targetIdentity.targetId, catalogVariantKey: targetIdentity.catalogVariantKey },
    productionAuthorizationId
  });
  factory.assertCompatibleRegistryInputs(applicabilityRef, catalogueIdentityRef, profileDefinitionRef, productionAuthorizationId);
  return Object.freeze({ applicabilityRef, catalogueIdentityRef, profileDefinitionRef });
}

function buildResult() {
  const prior = previous.buildResult();
  if (prior.materializationAuthorization.id !== priorResultId) throw new Error("CBR500R registry reevaluation prior result is out of scope");
  const upstream = authorizationData.buildAuthorization();
  if (upstream.id !== productionAuthorizationId) throw new Error("CBR500R registry reevaluation authorization is out of scope");
  const refs = buildReferences();
  const result = factory.authorizeMaterializationRequirements(upstream, {
    "PRODUCTION-DOCUMENT-MATERIALIZATION": [prior.documentDefinitionRef, prior.sourceProvenanceRef],
    "PRODUCTION-CITATION-MATERIALIZATION": [prior.citationDefinitionRef, prior.documentDefinitionRef, prior.sourceLocationRef],
    "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": [prior.citationDefinitionRef, prior.profileEntryDefinitionRef, prior.profileDefinitionRef],
    "REGISTRY-INSERTION": [refs.applicabilityRef, refs.catalogueIdentityRef, refs.profileDefinitionRef]
  });
  if (!result.requirements.every(item => item.state === "READY")) throw new Error("CBR500R registry requirement did not become ready from validated references");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-registry-requirement-reevaluation/v1",
    priorResultId,
    materializationAuthorization: result,
    applicabilityRef: refs.applicabilityRef,
    catalogueIdentityRef: refs.catalogueIdentityRef,
    profileDefinitionRef: refs.profileDefinitionRef,
    profileEntryDefinitionRef: prior.profileEntryDefinitionRef,
    citationDefinitionRef: prior.citationDefinitionRef,
    documentDefinitionRef: prior.documentDefinitionRef,
    sourceLocationRef: prior.sourceLocationRef,
    sourceProvenanceRef: prior.sourceProvenanceRef,
    assertions: {
      exactlyOneAuthorizationConsumed: true,
      registryOnlyNewInputsSupplied: true,
      allRequirementsReady: result.requirements.every(item => item.state === "READY"),
      boundedTargetPreserved: refs.catalogueIdentityRef.targetIdentity.targetId === "target.honda.cbr500r.pc70.2024.usa-canada",
      applicabilityVerified: refs.applicabilityRef.applicability.abs === true && refs.applicabilityRef.applicability.modelYear === 2024,
      nonProduction: refs.applicabilityRef.nonProduction === true && refs.catalogueIdentityRef.nonProduction === true && refs.profileDefinitionRef.nonProduction === true,
      noProductionProfile: refs.profileDefinitionRef.productionProfileId === null,
      notRegistered: refs.profileDefinitionRef.registryMembership === "NOT-REGISTERED" && refs.catalogueIdentityRef.registryMembership === "NOT-REGISTERED",
      rawValuePreserved: result.rawSource.rawValue === upstream.rawSource.rawValue,
      proposedProductionPreserved: result.proposedProduction.entryId === "lubrication.engine-oil.specification",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noMaterialization: result.materializationAllowed === false && result.productionCreated === false,
      noPromotion: true,
      productionChanged: false
    },
    next: "Design the bounded controlled production-materialization authorization boundary; do not materialize or promote production data."
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R registry reevaluation is not deterministic");
  const generic = first.materializationAuthorization;
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-registry-requirement-reevaluation/v1",
    priorResultId,
    resultId: generic.id,
    productionAuthorizationId,
    documentRequirement: generic.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION"),
    citationRequirement: generic.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION"),
    profileRequirement: generic.requirements.find(item => item.type === "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION"),
    registryRequirement: generic.requirements.find(item => item.type === "REGISTRY-INSERTION"),
    aggregateState: generic.aggregateState,
    aggregateReasons: generic.aggregateReasons,
    humanAuthorizationRequired: generic.humanAuthorizationRequired,
    materializationAllowed: generic.materializationAllowed,
    productionCreated: generic.productionCreated,
    lineage: generic.lineage,
    sourceIdentity: generic.sourceIdentity,
    targetIdentity: generic.targetIdentity,
    targetApplicability: generic.targetApplicability,
    proposedProduction: generic.proposedProduction,
    rawValue: generic.rawSource.rawValue,
    applicabilityRef: first.applicabilityRef,
    catalogueIdentityRef: first.catalogueIdentityRef,
    profileDefinitionRef: first.profileDefinitionRef,
    assertions: first.assertions,
    next: first.next
  });
}

module.exports = Object.freeze({ buildReferences, buildResult, buildReport });
