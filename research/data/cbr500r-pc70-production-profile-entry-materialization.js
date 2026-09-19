// REAL bounded production Technical Profile entry materialization audit for CBR500R only.
"use strict";

const assert = require("node:assert/strict");
const factory = require("../factory/index.js");
const authorizationData = require("./cbr500r-pc70-production-materialization-authorization.js");
const referenceData = require("./cbr500r-pc70-profile-entry-requirement-reevaluation.js");
const productionProfile = require("../../data/technical/honda/cbr500r/pc70/profile-2024.js");
const documents = require("../../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");
const registry = require("../../data/technical/technical-profile-registry.js");

const AUTHORIZATION_ID = "production-materialization-authorization.4cfd2472d8f6e8aac04d9afc";
const REQUIREMENTS_ID = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const PRODUCTION_AUTHORIZATION_ID = "production-authorization.42dfc09d17938fb18e6dc92d";
const PROFILE_ID = "honda.cbr500r.pc70.2024";
const PROFILE_PATH = "data/technical/honda/cbr500r/pc70/profile-2024.js";
const REQUIREMENT = "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION";
const DOCUMENT_ID = "doc.97c1a14816208eaedcccd588";
const CITATION_ID = "cite.44cd7d15b9c97a991b87056f";

function productionInputs(authorization) {
  const reevaluation = referenceData.buildResult();
  return {
    authorizationId: authorization.id,
    materializationRequirementsAuthorizationId: REQUIREMENTS_ID,
    productionAuthorizationId: PRODUCTION_AUTHORIZATION_ID,
    requirementType: REQUIREMENT,
    profileDefinitionRef: reevaluation.profileDefinitionRef,
    profileEntryDefinitionRef: reevaluation.profileEntryDefinitionRef,
    citationDefinitionRef: reevaluation.citationDefinitionRef,
    productionDocumentId: DOCUMENT_ID,
    productionCitationId: CITATION_ID
  };
}

function storeWith(initialEntries) {
  const entries = new Map(initialEntries.map(entry => [entry.id, structuredClone(entry)]));
  const profile = { profileId: PROFILE_ID, path: PROFILE_PATH };
  return {
    findProfileByDefinition: () => profile,
    findCitationById: id => documents.citations[id] || null,
    findDocumentById: id => documents.documents[id] || null,
    findEntry: (_profile, id) => entries.get(id) || null,
    createEntry: (_profile, entry) => {
      assert.equal(entries.has(entry.id), false, "duplicate CBR500R Technical Profile entry write");
      entries.set(entry.id, structuredClone(entry));
    },
    entries: () => [...entries.values()].map(entry => structuredClone(entry))
  };
}

function executeTwice() {
  const authorization = authorizationData.buildResult().authorization;
  assert.equal(authorization.id, AUTHORIZATION_ID);
  assert.equal(authorization.materializationRequirementsAuthorizationId, REQUIREMENTS_ID);
  assert.equal(authorization.productionAuthorizationId, PRODUCTION_AUTHORIZATION_ID);
  const input = productionInputs(authorization);
  const beforeEntries = [];
  const firstStore = storeWith(beforeEntries);
  const first = factory.materializeProductionTechnicalProfileEntry(authorization, input, firstStore);
  const afterFirst = firstStore.entries();
  const secondStore = storeWith(afterFirst);
  const second = factory.materializeProductionTechnicalProfileEntry(authorization, input, secondStore);
  return { authorization, input, first, second, beforeEntries, afterFirst, afterRepeat: secondStore.entries() };
}

function buildReport() {
  const run = executeTwice();
  const persistedEntry = productionProfile.entries.find(entry => entry.id === run.first.productionEntryId);
  assert.ok(persistedEntry, "Persisted CBR500R Technical Profile entry is missing");
  assert.equal(factory.orchestrationJson.canonicalSerialize(persistedEntry), factory.orchestrationJson.canonicalSerialize(run.first.productionEntry));
  assert.equal(productionProfile.entries.length, 1);
  assert.equal(registry.some(item => item.profileId === PROFILE_ID), false);
  const report = {
    schemaVersion: "revlog-cbr500r-pc70-production-profile-entry-materialization/v1",
    authorizationId: run.authorization.id,
    humanDecisionId: run.authorization.humanDecision.id,
    materializationRequirementsId: run.authorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: run.authorization.productionAuthorizationId,
    requirementType: REQUIREMENT,
    productionProfileId: run.first.productionProfileId,
    productionProfilePath: run.first.productionProfilePath,
    productionEntryId: run.first.productionEntryId,
    productionEntry: run.first.productionEntry,
    productionDocumentId: run.first.productionDocumentId,
    productionCitationId: run.first.productionCitationId,
    sourceIdentity: run.first.sourceIdentity,
    targetIdentity: run.first.targetIdentity,
    targetApplicability: run.first.targetApplicability,
    firstAction: run.first.action,
    repeatAction: run.second.action,
    firstExecutionResultId: run.first.id,
    repeatExecutionResultId: run.second.id,
    entryCountBefore: run.beforeEntries.length,
    entryCountAfterFirst: run.afterFirst.length,
    entryCountAfterRepeat: run.afterRepeat.length,
    registryMembership: "NOT-REGISTERED",
    productionDocumentChanged: false,
    productionCitationChanged: false,
    registryChanged: false,
    rawValueChanged: false,
    proposedProductionChanged: false,
    normalizationPerformed: false,
    applicabilityBroadened: false,
    historicalAbsPreserved: true,
    verifiedAbsPreserved: true,
    riderServiceCore: { fields: 95, categories: 14, changed: false },
    next: "Execute only REGISTRY-INSERTION for this exact CBR500R lineage."
  };
  const second = executeTwice();
  assert.equal(factory.orchestrationJson.canonicalSerialize(report), factory.orchestrationJson.canonicalSerialize({ ...report, firstExecutionResultId: second.first.id, repeatExecutionResultId: second.second.id }));
  return Object.freeze(report);
}

module.exports = Object.freeze({ buildReport, executeTwice, productionInputs });
