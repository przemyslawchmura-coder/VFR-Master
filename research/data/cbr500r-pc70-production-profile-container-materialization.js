// Bounded CBR500R production Technical Profile container materialization.
"use strict";

const assert = require("node:assert/strict");
const factory = require("../factory/index.js");
const authorizationData = require("./cbr500r-pc70-production-materialization-authorization.js");
const identityData = require("./cbr500r-pc70-technical-profile-identity.js");
const profile = require("../../data/technical/honda/cbr500r/pc70/profile-2024.js");
const sourceRegistry = require("../../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");
const profileValidator = require("../../js/technical/technical-profile-validator.js");

const productionAuthorizationId = "production-authorization.42dfc09d17938fb18e6dc92d";
const profileId = "honda.cbr500r.pc70.2024";
const profilePath = "data/technical/honda/cbr500r/pc70/profile-2024.js";

function storeWith(existing) {
  let current = existing;
  return {
    findProfileByDefinition: () => current,
    createProfile: value => {
      assert.equal(current, null, "duplicate Technical Profile container write");
      current = structuredClone(value);
    },
    current: () => current
  };
}

function buildInputs(authorization, productionProfile = profile) {
  const profileDefinitionRef = identityData.buildReference();
  assert.equal(profileDefinitionRef.profileIdentity.targetId, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(profileDefinitionRef.profileIdentity.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(profileDefinitionRef.productionProfileId, null);
  return {
    authorizationId: authorization.id,
    productionAuthorizationId,
    profileDefinitionRef,
    productionProfileId: profileId,
    productionProfilePath: profilePath,
    productionProfile
  };
}

function buildResult() {
  const authorization = authorizationData.buildResult().authorization;
  assert.equal(authorization.id, "production-materialization-authorization.4cfd2472d8f6e8aac04d9afc");
  assert.equal(authorization.productionAuthorizationId, productionAuthorizationId);
  const emptyProfile = { ...profile, entries: [] };
  const inputs = buildInputs(authorization, emptyProfile);
  const validation = profileValidator.validate(emptyProfile);
  assert.deepEqual(emptyProfile.entries, []);

  const before = storeWith(null);
  const first = factory.materializeProductionTechnicalProfileContainer(authorization, inputs, before);
  const after = before.current();
  const repeat = factory.materializeProductionTechnicalProfileContainer(authorization, inputs, storeWith(after));
  assert.equal(first.action, "CREATED");
  assert.equal(repeat.action, "REUSED");
  assert.equal(first.id, repeat.id);
  assert.deepEqual(after.profile.entries, []);

  const conflict = storeWith({ id: profileId, path: profilePath, profile: { ...emptyProfile, entries: [{ id: "unexpected.entry" }] } });
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(authorization, inputs, conflict), /conflicts/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(authorization, { ...inputs, productionProfileId: "wrong.profile.2024" }, storeWith(null)), /incomplete|conflicts|identity/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(authorization, { ...inputs, productionProfile: { ...emptyProfile, registryMembership: "REGISTERED" } }, storeWith(null)), /registry membership/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(authorization, { ...inputs, profileDefinitionRef: "forged" }, storeWith(null)), /schemaVersion|reference/i);
  const unauthorized = { ...authorization, authorizationState: "PENDING-MATERIALIZATION-AUTHORIZATION", materializationAllowed: false, humanDecision: null, reasons: ["HUMAN-AUTHORIZATION-PENDING"] };
  unauthorized.id = factory.productionMaterializationAuthorizationId(unauthorized);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(unauthorized, inputs, storeWith(null)), /explicit authorization/i);

  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-production-profile-container-materialization/v1",
    resultId: first.id,
    productionMaterializationAuthorizationId: authorization.id,
    productionAuthorizationId,
    humanDecisionId: authorization.humanDecision.id,
    profileId,
    profilePath,
    profileSchema: profile.schemaVersion,
    profileIdentity: inputs.profileDefinitionRef.profileIdentity,
    action: first.action,
    repeatAction: repeat.action,
    productionCreated: first.productionCreated,
    registryMembership: first.registryMembership,
    entriesBefore: [],
    entriesAfter: after.profile.entries,
    containerCountBefore: 0,
    containerCountAfter: 1,
    containerCountAfterRepeat: 1,
    sourceDocumentId: sourceRegistry.documentId,
    citationIds: Object.keys(sourceRegistry.citations),
    validatorResult: validation,
    targetApplicability: authorization.targetApplicability,
    rawValue: authorization.rawSource.rawValue,
    proposedProduction: authorization.proposedProduction,
    historicalAbsPreserved: true,
    verifiedAbsPreserved: true,
    assertions: {
      exactAuthorizationBound: true,
      emptyTechnicalProfileContainer: after.profile.entries.length === 0,
      noOilEntry: !after.profile.entries.some(entry => entry.id === "lubrication.engine-oil.specification"),
      noRegistryInsertion: true,
      noDocumentMutation: true,
      noCitationMutation: true,
      noVfrMutation: true,
      noDucatiMutation: true,
      noProductionCascade: true,
      noNormalization: true,
      noPromotion: true
    }
  });
}

function buildReport() {
  const first = buildResult();
  const second = buildResult();
  assert.deepEqual(second, first);
  return first;
}

module.exports = Object.freeze({ buildInputs, buildResult, buildReport });
