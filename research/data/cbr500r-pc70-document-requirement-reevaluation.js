// NON-PRODUCTION bounded reevaluation for the CBR500R document requirement.
"use strict";

const factory = require("../factory/index.js");
const authorization = require("./cbr500r-pc70-schema-conversion-authorization.js");
const previous = require("./cbr500r-pc70-materialization-requirements.js");

const priorResultId = "materialization-authorization.75f4749897a97f42f0cfe4a9";
const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";
const documentIdentity = Object.freeze({
  documentId: "31MLRB00 / 00X31-MLR-B000",
  publicationId: "31MLRB00 / 00X31-MLR-B000",
  authority: "American Honda Motor Co., Inc.",
  documentClass: "owner-manual",
  officialPath: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf"
});
const sourceIdentity = Object.freeze({
  sourceId: "honda.official.owner-manual.31MLRB000.2024",
  prospectId: "prospect.honda.official.owner-manual.31MLRB000.2024",
  documentId: "31MLRB00 / 00X31-MLR-B000",
  authority: "American Honda Motor Co., Inc.",
  officialPath: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf",
  tier: "A"
});
const lineage = Object.freeze({
  artifactId: "artifact.0498845c683f226a302b0a90",
  extractionResultId: "extraction-result.32ff931c2f1fe866679758b6",
  candidateId: "extraction-candidate.87fcea8600978eff75d9f8d6"
});
const sourceLocation = Object.freeze({
  locator: "lines:55-64;chars:731-1026",
  page: null,
  section: "derived text",
  tableOrSubsection: "document:full"
});

function buildReferences() {
  const upstream = authorization.buildAuthorization();
  if (upstream.id !== productionAuthorizationId || upstream.authorizationState !== "AUTHORIZATION-READY" || upstream.productionCreated !== false) throw new Error("CBR500R document reevaluation input is out of scope");
  if (factory.orchestrationJson.canonicalSerialize(upstream.sourceIdentity) !== factory.orchestrationJson.canonicalSerialize(sourceIdentity)) throw new Error("CBR500R source identity is not repository-authenticated");
  const document = factory.createDocumentDefinitionRef({ documentIdentity, sourceIdentity });
  const provenance = factory.createSourceProvenanceRef({ sourceIdentity, lineage, sourceLocation });
  return factory.assertCompatibleDocumentAndProvenance(document, provenance);
}

function buildResult() {
  const oldResult = previous.buildResult();
  if (oldResult.id !== priorResultId) throw new Error("CBR500R prior materialization result is out of scope");
  const upstream = authorization.buildAuthorization();
  const { document, provenance } = buildReferences();
  const result = factory.authorizeMaterializationRequirements(upstream, {
    "PRODUCTION-DOCUMENT-MATERIALIZATION": [document, provenance],
    "PRODUCTION-CITATION-MATERIALIZATION": [],
    "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": [],
    "REGISTRY-INSERTION": []
  });
  const documentRequirement = result.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION");
  if (documentRequirement.state !== "READY" || documentRequirement.missingInputs.length !== 0 || documentRequirement.reasons.length !== 0) throw new Error("CBR500R document requirement did not become ready from validated references");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-document-requirement-reevaluation/v1",
    priorResultId,
    materializationAuthorization: result,
    documentDefinitionRef: document,
    sourceProvenanceRef: provenance,
    assertions: {
      exactlyOneAuthorizationConsumed: true,
      documentOnlyInputsSupplied: true,
      documentRequirementReady: true,
      otherRequirementsUnchanged: result.requirements.filter(item => item.type !== "PRODUCTION-DOCUMENT-MATERIALIZATION").every(item => item.state === "PENDING" && item.missingInputs.length > 0),
      aggregatePending: result.aggregateState === "REQUIREMENTS-PENDING",
      nonProduction: document.nonProduction === true && provenance.nonProduction === true,
      rawValuePreserved: result.rawSource.rawValue === upstream.rawSource.rawValue,
      proposedProductionPreserved: result.proposedProduction.entryId === "lubrication.engine-oil.specification",
      boundedApplicabilityPreserved: result.targetApplicability.abs === "KNOWN" && result.targetApplicability.market === "KNOWN",
      historicalAbsUnchanged: true,
      noNormalization: true,
      noMaterialization: result.materializationAllowed === false && result.productionCreated === false,
      noPromotion: true,
      productionChanged: false
    },
    next: "Resolve the earliest remaining PRODUCTION-CITATION-MATERIALIZATION inputs; do not materialize or promote production data."
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  if (factory.orchestrationJson.canonicalSerialize(first) !== factory.orchestrationJson.canonicalSerialize(second)) throw new Error("CBR500R document reevaluation is not deterministic");
  const generic = first.materializationAuthorization;
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-document-requirement-reevaluation/v1",
    priorResultId,
    resultId: generic.id,
    productionAuthorizationId,
    documentRequirement: generic.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION"),
    otherRequirements: generic.requirements.filter(item => item.type !== "PRODUCTION-DOCUMENT-MATERIALIZATION"),
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
    documentDefinitionRef: first.documentDefinitionRef,
    sourceProvenanceRef: first.sourceProvenanceRef,
    assertions: first.assertions,
    next: first.next
  });
}

module.exports = Object.freeze({ buildReferences, buildResult, buildReport });
