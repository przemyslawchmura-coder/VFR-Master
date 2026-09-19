// REAL bounded production-document materialization audit for CBR500R only.
"use strict";

const fs = require("node:fs");
const factory = require("../factory/index.js");
const authorizationData = require("./cbr500r-pc70-production-materialization-authorization.js");
const referenceData = require("./cbr500r-pc70-document-requirement-reevaluation.js");
const productionRegistry = require("../../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");

const AUTHORIZATION_ID = "production-materialization-authorization.4cfd2472d8f6e8aac04d9afc";
const REQUIREMENTS_ID = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const PRODUCTION_AUTHORIZATION_ID = "production-authorization.42dfc09d17938fb18e6dc92d";
const DOCUMENT_REQUIREMENT = "PRODUCTION-DOCUMENT-MATERIALIZATION";
const DOCUMENT_PATH = "data/technical/documents/honda/cbr500r-pc70-2024-documents.js";

function productionDocument() {
  const refs = referenceData.buildReferences();
  const documentId = factory.productionDocumentId(refs.document, refs.provenance);
  const document = productionRegistry.documents[documentId];
  if (!document || document.id !== documentId) throw new Error("CBR500R production document is missing or has the wrong identity");
  return { refs, document };
}

function emptyStore() {
  const documents = new Map();
  return {
    findByDocumentId: id => documents.get(id) || null,
    createDocument: document => { if (documents.has(document.id)) throw new Error("duplicate production document"); documents.set(document.id, structuredClone(document)); },
    count: () => documents.size
  };
}

function executeTwice() {
  const authorization = authorizationData.buildResult().authorization;
  if (authorization.id !== AUTHORIZATION_ID || authorization.materializationRequirementsAuthorizationId !== REQUIREMENTS_ID || authorization.productionAuthorizationId !== PRODUCTION_AUTHORIZATION_ID) throw new Error("CBR500R production authorization is out of scope");
  const { refs, document } = productionDocument();
  const input = { authorizationId: authorization.id, materializationRequirementsAuthorizationId: REQUIREMENTS_ID, productionAuthorizationId: PRODUCTION_AUTHORIZATION_ID, requirementType: DOCUMENT_REQUIREMENT, documentDefinitionRef: refs.document, sourceProvenanceRef: refs.provenance, productionDocument: document };
  const store = emptyStore();
  const before = store.count();
  const first = factory.materializeProductionDocument(authorization, input, store);
  const afterFirst = store.count();
  const second = factory.materializeProductionDocument(authorization, input, store);
  const afterSecond = store.count();
  return { authorization, refs, document, first, second, counts: { before, afterFirst, afterSecond } };
}

function buildReport() {
  const run = executeTwice();
  const persisted = productionRegistry.documents[run.first.productionDocumentId];
  if (factory.orchestrationJson.canonicalSerialize(persisted) !== factory.orchestrationJson.canonicalSerialize(run.document)) throw new Error("Persisted CBR500R production document differs from materialized content");
  const report = {
    schemaVersion: "revlog-cbr500r-pc70-production-document-materialization/v1",
    authorizationId: run.authorization.id,
    humanDecisionId: run.authorization.humanDecision.id,
    materializationRequirementsId: run.authorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: run.authorization.productionAuthorizationId,
    requirementType: DOCUMENT_REQUIREMENT,
    productionDocumentId: run.first.productionDocumentId,
    productionDocumentPath: DOCUMENT_PATH,
    sourceIdentity: run.first.sourceIdentity,
    sourceProvenanceReferenceId: run.first.sourceProvenanceReferenceId,
    targetIdentity: run.first.targetIdentity,
    targetApplicability: run.first.targetApplicability,
    action: run.first.action,
    firstExecutionResultId: run.first.id,
    secondExecutionResultId: run.second.id,
    firstExecutionProductionCreated: run.first.productionCreated,
    secondExecutionAction: run.second.action,
    secondExecutionProductionCreated: run.second.productionCreated,
    documentCountBefore: run.counts.before,
    documentCountAfterFirst: run.counts.afterFirst,
    documentCountAfterRepeat: run.counts.afterSecond,
    citationMaterialized: false,
    technicalProfileMaterialized: false,
    registryInserted: false,
    productionCreated: false,
    rawValueChanged: false,
    applicabilityBroadened: false,
    historicalAbsPreserved: true,
    next: "Execute only PRODUCTION-CITATION-MATERIALIZATION for this exact CBR500R lineage."
  };
  const second = executeTwice();
  if (factory.orchestrationJson.canonicalSerialize(report) !== factory.orchestrationJson.canonicalSerialize({ ...report, firstExecutionResultId: second.first.id, secondExecutionResultId: second.second.id })) throw new Error("CBR500R production document materialization report is not deterministic");
  return Object.freeze(report);
}

module.exports = Object.freeze({ buildReport, executeTwice, productionDocument });
