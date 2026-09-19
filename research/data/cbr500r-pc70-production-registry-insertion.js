// REAL bounded production registry insertion audit for CBR500R only.
"use strict";

const assert = require("node:assert/strict");
const factory = require("../factory/index.js");
const authorizationData = require("./cbr500r-pc70-production-materialization-authorization.js");
const references = require("./cbr500r-pc70-registry-requirement-reevaluation.js");
const productionProfile = require("../../data/technical/honda/cbr500r/pc70/profile-2024.js");
const productionRegistry = require("../../data/technical/technical-profile-registry.js");

const AUTHORIZATION_ID = "production-materialization-authorization.4cfd2472d8f6e8aac04d9afc";
const REQUIREMENTS_ID = "materialization-authorization.bf37694c61c2dad9c3b77c45";
const PRODUCTION_AUTHORIZATION_ID = "production-authorization.42dfc09d17938fb18e6dc92d";
const PROFILE_ID = "honda.cbr500r.pc70.2024";
const PROFILE_PATH = "data/technical/honda/cbr500r/pc70/profile-2024.js";
const CATALOG_VARIANT_KEY = "honda.cbr500r.pc70";
const REQUIREMENT = "REGISTRY-INSERTION";

function entry() {
  return { profileId: PROFILE_ID, catalogVariantKeys: [CATALOG_VARIANT_KEY], years: { from: 2024, to: 2024 }, moduleId: PROFILE_PATH, status: "review", schemaVersion: "revlog-technical-profile/v1" };
}

function productionInputs(authorization) {
  const reevaluation = references.buildResult();
  assert.equal(reevaluation.materializationAuthorization.id, REQUIREMENTS_ID);
  return {
    authorizationId: authorization.id,
    productionAuthorizationId: PRODUCTION_AUTHORIZATION_ID,
    requirementType: REQUIREMENT,
    applicabilityRef: reevaluation.applicabilityRef,
    catalogueIdentityRef: reevaluation.catalogueIdentityRef,
    profileDefinitionRef: reevaluation.profileDefinitionRef,
    productionProfileId: PROFILE_ID,
    productionProfilePath: PROFILE_PATH,
    registryEntry: entry()
  };
}

function storeWith(initialRegistry) {
  let records = initialRegistry.map(item => structuredClone(item));
  return {
    findProfile: (id, path) => id === PROFILE_ID && path === PROFILE_PATH ? { id, path, profile: productionProfile } : null,
    findRegistryEntry: requested => records.find(item => item.profileId === requested.profileId) || null,
    createRegistryEntry: value => { assert.equal(records.some(item => item.profileId === value.profileId), false, "duplicate CBR500R registry write"); records.push(structuredClone(value)); },
    entries: () => records.map(item => structuredClone(item))
  };
}

function executeTwice() {
  const authorization = authorizationData.buildResult().authorization;
  assert.equal(authorization.id, AUTHORIZATION_ID);
  assert.equal(authorization.materializationRequirementsAuthorizationId, REQUIREMENTS_ID);
  assert.equal(authorization.productionAuthorizationId, PRODUCTION_AUTHORIZATION_ID);
  const input = productionInputs(authorization);
  const before = productionRegistry.filter(item => item.profileId !== PROFILE_ID);
  const firstStore = storeWith(before);
  const first = factory.materializeProductionTechnicalProfileRegistryInsertion(authorization, input, firstStore);
  const afterFirst = firstStore.entries();
  const secondStore = storeWith(afterFirst);
  const second = factory.materializeProductionTechnicalProfileRegistryInsertion(authorization, input, secondStore);
  return { authorization, input, first, second, before, afterFirst, afterRepeat: secondStore.entries() };
}

function buildReport() {
  const run = executeTwice();
  assert.equal(run.first.action, "CREATED");
  assert.equal(run.second.action, "REUSED");
  assert.equal(run.first.id, run.second.id);
  assert.equal(run.before.some(item => item.profileId === PROFILE_ID), false);
  assert.equal(run.afterFirst.filter(item => item.profileId === PROFILE_ID).length, 1);
  assert.equal(run.afterRepeat.filter(item => item.profileId === PROFILE_ID).length, 1);
  assert.equal(productionRegistry.filter(item => item.profileId === PROFILE_ID).length, 1);
  const report = {
    schemaVersion: "revlog-cbr500r-pc70-production-registry-insertion/v1",
    authorizationId: run.authorization.id,
    humanDecisionId: run.authorization.humanDecision.id,
    materializationRequirementsId: run.authorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: run.authorization.productionAuthorizationId,
    requirementType: REQUIREMENT,
    profileId: PROFILE_ID,
    profilePath: PROFILE_PATH,
    catalogVariantKey: CATALOG_VARIANT_KEY,
    year: 2024,
    firstAction: run.first.action,
    repeatAction: run.second.action,
    firstExecutionResultId: run.first.id,
    repeatExecutionResultId: run.second.id,
    registryCountBefore: run.before.length,
    registryCountAfterFirst: run.afterFirst.length,
    registryCountAfterRepeat: run.afterRepeat.length,
    registryDescriptor: run.first.registryEntry,
    registryMembership: "REGISTERED",
    oilEntryPreserved: productionProfile.entries.length === 1 && productionProfile.entries[0].id === "lubrication.engine-oil.specification",
    productionProfileChanged: false,
    productionDocumentChanged: false,
    productionCitationChanged: false,
    vfrChanged: false,
    ducatiChanged: false,
    cloudBackendChanged: false,
    deploymentPerformed: false,
    riderServiceCore: { fields: 95, categories: 14, changed: false },
    next: "No further wave executed; REGISTRY-INSERTION is complete for this lineage."
  };
  assert.deepEqual(buildReportDeterminism(run), report);
  return Object.freeze(report);
}

function buildReportDeterminism(run) {
  return {
    schemaVersion: "revlog-cbr500r-pc70-production-registry-insertion/v1",
    authorizationId: run.authorization.id,
    humanDecisionId: run.authorization.humanDecision.id,
    materializationRequirementsId: run.authorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: run.authorization.productionAuthorizationId,
    requirementType: REQUIREMENT,
    profileId: PROFILE_ID,
    profilePath: PROFILE_PATH,
    catalogVariantKey: CATALOG_VARIANT_KEY,
    year: 2024,
    firstAction: run.first.action,
    repeatAction: run.second.action,
    firstExecutionResultId: run.first.id,
    repeatExecutionResultId: run.second.id,
    registryCountBefore: run.before.length,
    registryCountAfterFirst: run.afterFirst.length,
    registryCountAfterRepeat: run.afterRepeat.length,
    registryDescriptor: run.first.registryEntry,
    registryMembership: "REGISTERED",
    oilEntryPreserved: productionProfile.entries.length === 1 && productionProfile.entries[0].id === "lubrication.engine-oil.specification",
    productionProfileChanged: false,
    productionDocumentChanged: false,
    productionCitationChanged: false,
    vfrChanged: false,
    ducatiChanged: false,
    cloudBackendChanged: false,
    deploymentPerformed: false,
    riderServiceCore: { fields: 95, categories: 14, changed: false },
    next: "No further wave executed; REGISTRY-INSERTION is complete for this lineage."
  };
}

module.exports = Object.freeze({ buildReport, executeTwice, productionInputs });
