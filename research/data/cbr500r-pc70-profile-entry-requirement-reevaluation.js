// NON-PRODUCTION bounded reevaluation for the CBR500R Technical Profile entry requirement.
"use strict";

const factory = require("../factory/index.js");
const citationReevaluation = require("./cbr500r-pc70-citation-requirement-reevaluation.js");
const identity = require("./cbr500r-pc70-technical-profile-identity.js");
const authorizationData = require("./cbr500r-pc70-schema-conversion-authorization.js");

const priorResultId = "materialization-authorization.c502d73aa436d3605af55040";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildResult() {
  const prior = citationReevaluation.buildResult();
  if (prior.materializationAuthorization.id !== priorResultId) throw new Error("CBR500R Technical Profile reevaluation prior result is out of scope");
  const upstream = authorizationData.buildAuthorization();
  if (upstream.id !== productionAuthorizationId) throw new Error("CBR500R Technical Profile reevaluation authorization is out of scope");
  const profileDefinitionRef = identity.buildReference();
  const entryDefinitionRef = factory.createTechnicalProfileEntryDefinitionRef({
    profileDefinitionRefId: profileDefinitionRef.id,
    targetIdentity: { targetId: profileDefinitionRef.profileIdentity.targetId, catalogVariantKey: profileDefinitionRef.profileIdentity.catalogVariantKey },
    productionAuthorizationId: upstream.id,
    categoryId: upstream.proposedProduction.categoryId,
    entryId: upstream.proposedProduction.entryId,
    entryType: upstream.proposedProduction.type,
    value: upstream.proposedProduction.value,
    citationDefinitionRefId: prior.citationDefinitionRef.id,
    applicability: upstream.targetApplicability
  });
  factory.assertCompatibleTechnicalProfileEntry(profileDefinitionRef, entryDefinitionRef, prior.citationDefinitionRef, upstream.id);
  const result = factory.authorizeMaterializationRequirements(upstream, {
    "PRODUCTION-DOCUMENT-MATERIALIZATION": [prior.documentDefinitionRef, prior.sourceProvenanceRef],
    "PRODUCTION-CITATION-MATERIALIZATION": [prior.citationDefinitionRef, prior.documentDefinitionRef, prior.sourceLocationRef],
    "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": [prior.citationDefinitionRef, entryDefinitionRef, profileDefinitionRef],
    "REGISTRY-INSERTION": []
  });
  const profileRequirement = result.requirements.find(item => item.type === "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION");
  const registryRequirement = result.requirements.find(item => item.type === "REGISTRY-INSERTION");
  if (profileRequirement.state !== "READY" || profileRequirement.missingInputs.length !== 0 || profileRequirement.reasons.length !== 0) throw new Error("CBR500R Technical Profile entry requirement did not become ready from validated references");
  if (registryRequirement.state !== "PENDING") throw new Error("CBR500R registry requirement changed outside this bounded wave");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-profile-entry-requirement-reevaluation/v1",
    priorResultId,
    materializationAuthorization: result,
    profileDefinitionRef,
    profileEntryDefinitionRef: entryDefinitionRef,
    citationDefinitionRef: prior.citationDefinitionRef,
    documentDefinitionRef: prior.documentDefinitionRef,
    sourceLocationRef: prior.sourceLocationRef,
    sourceProvenanceRef: prior.sourceProvenanceRef,
    assertions: {
      exactlyOneAuthorizationConsumed: true,
      profileEntryOnlyNewInputsSupplied: true,
      documentRequirementReady: result.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION").state === "READY",
      citationRequirementReady: result.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION").state === "READY",
      profileRequirementReady: profileRequirement.state === "READY" && profileRequirement.missingInputs.length === 0,
      registryUnchangedPending: registryRequirement.state === "PENDING" && registryRequirement.missingInputs.length > 0,
      aggregatePending: result.aggregateState === "REQUIREMENTS-PENDING",
      targetIdentityBound: entryDefinitionRef.targetIdentity.targetId === "target.honda.cbr500r.pc70.2024.usa-canada" && entryDefinitionRef.targetIdentity.catalogVariantKey === "honda.cbr500r.pc70",
      productionMappingPreserved: entryDefinitionRef.entryId === "lubrication.engine-oil.specification" && entryDefinitionRef.categoryId === "lubrication" && entryDefinitionRef.entryType === "fluid",
      rawValuePreserved: entryDefinitionRef.value.text === upstream.proposedProduction.value.text && result.rawSource.rawValue === upstream.rawSource.rawValue,
      boundedApplicabilityPreserved: result.targetApplicability.abs === "KNOWN" && result.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      nonProduction: profileDefinitionRef.nonProduction === true && entryDefinitionRef.nonProduction === true,
      noNormalization: true,
      noMaterialization: result.materializationAllowed === false && result.productionCreated === false,
      noPromotion: true,
      productionChanged: false
    },
    next: "Resolve REGISTRY-INSERTION inputs; do not materialize or promote production data."
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R Technical Profile entry reevaluation is not deterministic");
  const generic = first.materializationAuthorization;
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-profile-entry-requirement-reevaluation/v1",
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
    profileDefinitionRef: first.profileDefinitionRef,
    profileEntryDefinitionRef: first.profileEntryDefinitionRef,
    citationDefinitionRef: first.citationDefinitionRef,
    assertions: first.assertions,
    next: first.next
  });
}

module.exports = Object.freeze({ buildResult, buildReport });
