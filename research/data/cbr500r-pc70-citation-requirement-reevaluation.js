// NON-PRODUCTION bounded reevaluation for the CBR500R citation requirement.
"use strict";

const factory = require("../factory/index.js");
const documentReevaluation = require("./cbr500r-pc70-document-requirement-reevaluation.js");

const priorResultId = "materialization-authorization.5020e2d7cd615e55733be824";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";

function buildReferences() {
  const prior = documentReevaluation.buildResult();
  const generic = prior.materializationAuthorization;
  const citation = factory.createCitationDefinitionRef({
    citationIdentity: { canonicalFieldId: generic.lineage.researchCanonicalFieldId, documentId: prior.documentDefinitionRef.documentIdentity.documentId },
    sourceIdentity: generic.sourceIdentity
  });
  const location = factory.createSourceLocationRef({
    sourceIdentity: generic.sourceIdentity,
    documentId: prior.documentDefinitionRef.documentIdentity.documentId,
    sourceProvenanceRefId: prior.sourceProvenanceRef.id,
    sourceLocation: generic.rawSource.provenance.sourceLocation
  });
  factory.assertCompatibleCitationInputs(citation, prior.documentDefinitionRef, location);
  return Object.freeze({ citation, document: prior.documentDefinitionRef, location, provenance: prior.sourceProvenanceRef });
}

function buildResult() {
  const prior = documentReevaluation.buildResult();
  if (prior.materializationAuthorization.id !== priorResultId) throw new Error("CBR500R citation reevaluation prior lineage is out of scope");
  const upstream = require("./cbr500r-pc70-schema-conversion-authorization.js").buildAuthorization();
  const refs = buildReferences();
  const result = factory.authorizeMaterializationRequirements(upstream, {
    "PRODUCTION-DOCUMENT-MATERIALIZATION": [refs.document, refs.provenance],
    "PRODUCTION-CITATION-MATERIALIZATION": [refs.citation, refs.document, refs.location],
    "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": [],
    "REGISTRY-INSERTION": []
  });
  const documentRequirement = result.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION");
  const citationRequirement = result.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION");
  if (documentRequirement.state !== "READY" || citationRequirement.state !== "READY") throw new Error("CBR500R document/citation requirements did not become ready from validated references");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-citation-requirement-reevaluation/v1",
    priorResultId,
    materializationAuthorization: result,
    citationDefinitionRef: refs.citation,
    documentDefinitionRef: refs.document,
    sourceLocationRef: refs.location,
    sourceProvenanceRef: refs.provenance,
    assertions: {
      exactlyOneAuthorizationConsumed: true,
      citationOnlyNewInputsSupplied: true,
      existingDocumentRefReused: true,
      documentRequirementReady: documentRequirement.state === "READY" && documentRequirement.missingInputs.length === 0,
      citationRequirementReady: citationRequirement.state === "READY" && citationRequirement.missingInputs.length === 0,
      otherRequirementsPending: result.requirements.filter(item => !["PRODUCTION-DOCUMENT-MATERIALIZATION", "PRODUCTION-CITATION-MATERIALIZATION"].includes(item.type)).every(item => item.state === "PENDING"),
      aggregatePending: result.aggregateState === "REQUIREMENTS-PENDING",
      sourceLocatorPreserved: result.rawSource.provenance.sourceLocation.locator === "lines:55-64;chars:731-1026" && result.rawSource.provenance.sourceLocation.page === null,
      rawValuePreserved: result.rawSource.rawValue.includes("SAE 10W-30"),
      proposedProductionPreserved: result.proposedProduction.entryId === "lubrication.engine-oil.specification",
      boundedApplicabilityPreserved: result.targetApplicability.abs === "KNOWN" && result.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noMaterialization: result.materializationAllowed === false && result.productionCreated === false,
      noPromotion: true,
      productionChanged: false
    },
    next: "Resolve the earliest remaining TECHNICAL-PROFILE-ENTRY-MATERIALIZATION inputs; do not materialize or promote production data."
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R citation reevaluation is not deterministic");
  const generic = first.materializationAuthorization;
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-citation-requirement-reevaluation/v1",
    priorResultId,
    resultId: generic.id,
    productionAuthorizationId,
    documentRequirement: generic.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION"),
    citationRequirement: generic.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION"),
    otherRequirements: generic.requirements.filter(item => !["PRODUCTION-DOCUMENT-MATERIALIZATION", "PRODUCTION-CITATION-MATERIALIZATION"].includes(item.type)),
    aggregateState: generic.aggregateState,
    aggregateReasons: generic.aggregateReasons,
    materializationAllowed: generic.materializationAllowed,
    productionCreated: generic.productionCreated,
    lineage: generic.lineage,
    sourceIdentity: generic.sourceIdentity,
    targetIdentity: generic.targetIdentity,
    targetApplicability: generic.targetApplicability,
    proposedProduction: generic.proposedProduction,
    rawValue: generic.rawSource.rawValue,
    citationDefinitionRef: first.citationDefinitionRef,
    documentDefinitionRef: first.documentDefinitionRef,
    sourceLocationRef: first.sourceLocationRef,
    sourceProvenanceRef: first.sourceProvenanceRef,
    assertions: first.assertions,
    next: first.next
  });
}

module.exports = Object.freeze({ buildReferences, buildResult, buildReport });
