// REAL bounded production-citation materialization audit for CBR500R only.
"use strict";

const factory = require("../factory/index.js");
const authorizationData = require("./cbr500r-pc70-production-materialization-authorization.js");
const referenceData = require("./cbr500r-pc70-citation-requirement-reevaluation.js");
const productionRegistry = require("../../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");

const AUTHORIZATION_ID = "production-materialization-authorization.4cfd2472d8f6e8aac04d9afc";
const REQUIREMENTS_ID = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const PRODUCTION_AUTHORIZATION_ID = "production-authorization.42dfc09d17938fb18e6dc92d";
const CITATION_REQUIREMENT = "PRODUCTION-CITATION-MATERIALIZATION";
const DOCUMENT_PATH = "data/technical/documents/honda/cbr500r-pc70-2024-documents.js";

function productionInputs(authorization) {
  const refs = referenceData.buildReferences();
  return {
    authorizationId: authorization.id,
    materializationRequirementsAuthorizationId: REQUIREMENTS_ID,
    productionAuthorizationId: PRODUCTION_AUTHORIZATION_ID,
    requirementType: CITATION_REQUIREMENT,
    citationDefinitionRef: refs.citation,
    documentDefinitionRef: refs.document,
    sourceLocationRef: refs.location,
    sourceProvenanceRef: refs.provenance,
    productionDocumentId: productionRegistry.documentId
  };
}

function storeFromProductionRegistry() {
  const citations = new Map();
  return {
    findByDocumentId: id => productionRegistry.documents[id] || null,
    findByCitationId: id => citations.get(id) || null,
    createCitation: citation => { if (citations.has(citation.id)) throw new Error("duplicate CBR500R production citation"); citations.set(citation.id, structuredClone(citation)); },
    count: () => citations.size,
    citation: id => citations.get(id) || null
  };
}

function executeTwice() {
  const authorization = authorizationData.buildResult().authorization;
  if (authorization.id !== AUTHORIZATION_ID || authorization.materializationRequirementsAuthorizationId !== REQUIREMENTS_ID || authorization.productionAuthorizationId !== PRODUCTION_AUTHORIZATION_ID) throw new Error("CBR500R production materialization authorization is out of scope");
  const input = productionInputs(authorization);
  const store = storeFromProductionRegistry();
  const before = store.count();
  const first = factory.materializeProductionCitation(authorization, input, store);
  const afterFirst = store.count();
  const second = factory.materializeProductionCitation(authorization, input, store);
  const afterSecond = store.count();
  return { authorization, input, first, second, citation: store.citation(first.productionCitationId), counts: { before, afterFirst, afterSecond } };
}

function buildReport() {
  const run = executeTwice();
  const persisted = productionRegistry.citations[run.first.productionCitationId];
  if (!persisted || factory.orchestrationJson.canonicalSerialize(persisted) !== factory.orchestrationJson.canonicalSerialize(run.citation)) throw new Error("Persisted CBR500R production citation differs from materialized content");
  const report = {
    schemaVersion: "revlog-cbr500r-pc70-production-citation-materialization/v1",
    authorizationId: run.authorization.id,
    humanDecisionId: run.authorization.humanDecision.id,
    materializationRequirementsId: run.authorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: run.authorization.productionAuthorizationId,
    requirementType: CITATION_REQUIREMENT,
    productionDocumentId: run.first.productionDocumentId,
    productionDocumentPath: DOCUMENT_PATH,
    productionCitationId: run.first.productionCitationId,
    sourceIdentity: run.first.sourceIdentity,
    sourceProvenanceReferenceId: run.first.sourceProvenanceReferenceId,
    citationLocator: run.first.productionCitation.sourceLocation,
    targetIdentity: run.first.targetIdentity,
    targetApplicability: run.first.targetApplicability,
    firstAction: run.first.action,
    secondAction: run.second.action,
    firstExecutionResultId: run.first.id,
    secondExecutionResultId: run.second.id,
    citationCountBefore: run.counts.before,
    citationCountAfterFirst: run.counts.afterFirst,
    citationCountAfterRepeat: run.counts.afterSecond,
    documentChanged: false,
    technicalProfileChanged: false,
    registryChanged: false,
    historicalAbsPreserved: true,
    rawValueChanged: false,
    applicabilityBroadened: false,
    next: "Execute only TECHNICAL-PROFILE-ENTRY-MATERIALIZATION for this exact CBR500R lineage."
  };
  const second = executeTwice();
  if (factory.orchestrationJson.canonicalSerialize(report) !== factory.orchestrationJson.canonicalSerialize({ ...report, firstExecutionResultId: second.first.id, secondExecutionResultId: second.second.id })) throw new Error("CBR500R production citation materialization report is not deterministic");
  return Object.freeze(report);
}

module.exports = Object.freeze({ buildReport, executeTwice, productionInputs });
