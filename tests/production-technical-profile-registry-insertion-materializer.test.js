"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function authorization() {
  const result = {
    schemaVersion: 1, id: "placeholder", productionAuthorizationId: "production-authorization.fixture000000001", productionAuthorizationState: "AUTHORIZATION-READY", productionAuthorizationReasons: [], declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(), requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })), aggregateState: "REQUIREMENTS-READY", aggregateReasons: [], humanAuthorizationRequired: true, materializationAllowed: false, lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001" }, sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" }, rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "lines:1-2" } } }, targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" }, proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } }, productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result); result.lineage.materializationRequirementsAuthorizationId = result.id;
  return factory.authorizeProductionMaterialization(result, factory.createProductionMaterializationDecision(result.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Synthetic approval for the registry insertion materializer." }));
}

function inputs(auth) {
  const profileDefinitionRef = factory.createTechnicalProfileDefinitionRef({ profileIdentity: { targetId: "target.fixture.model", catalogVariantKey: "fixture.model", manufacturer: "Fixture", model: "Model", generation: "Generation", modelYear: 2024, market: "USA", transmission: "manual", equipment: "standard", abs: true }, catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId: "target.fixture.model", catalogVariantKey: "fixture.model" } });
  const applicabilityRef = factory.createApplicabilityRef({ targetIdentity: { targetId: "target.fixture.model", catalogVariantKey: "fixture.model" }, applicability: { modelYear: 2024, market: ["USA"], transmission: "manual", equipment: "standard", abs: true }, verificationId: "applicability-verification.aaaaaaaaaaaaaaaaaaaaaaaa", productionAuthorizationId: auth.productionAuthorizationId });
  const catalogueIdentityRef = factory.createCatalogueIdentityRef({ targetIdentity: { targetId: "target.fixture.model", catalogVariantKey: "fixture.model" }, identityProof: { source: "repository-catalogue-and-research-target", targetId: "target.fixture.model", catalogVariantKey: "fixture.model" }, productionAuthorizationId: auth.productionAuthorizationId });
  const profileId = "fixture.profile.2024"; const profilePath = "data/fixture/profile-2024.js";
  return { authorizationId: auth.id, productionAuthorizationId: auth.productionAuthorizationId, requirementType: "REGISTRY-INSERTION", applicabilityRef, catalogueIdentityRef, profileDefinitionRef, productionProfileId: profileId, productionProfilePath: profilePath, registryEntry: { profileId, catalogVariantKeys: ["fixture.model"], years: { from: 2024, to: 2024 }, moduleId: profilePath, status: "review", schemaVersion: "revlog-technical-profile/v1" } };
}

function storeWith(registryEntry = null, profile = null) {
  let registry = registryEntry;
  const productionProfile = profile || { id: "fixture.profile.2024", path: "data/fixture/profile-2024.js", profile: { id: "fixture.profile.2024", registryMembership: "NOT-REGISTERED", entries: [] } };
  return { findProfile: () => productionProfile, findRegistryEntry: () => registry, createRegistryEntry: value => { if (registry) throw new Error("duplicate registry write"); registry = structuredClone(value); }, current: () => registry };
}

test("generic registry insertion creates once and reuses safely", () => {
  const auth = authorization(); const input = inputs(auth); const store = storeWith();
  const first = factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, store);
  const second = factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, store);
  assert.equal(first.action, "CREATED"); assert.equal(second.action, "REUSED"); assert.equal(first.id, second.id); assert.equal(store.current().profileId, "fixture.profile.2024");
});

test("registry insertion fails closed for wrong requirement, identity, membership and conflict", () => {
  const auth = authorization(); const input = inputs(auth);
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(auth, { ...input, requirementType: "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION" }, storeWith()), /requirement/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(auth, { ...input, catalogueIdentityRef: "forged" }, storeWith()), /schemaVersion|Catalogue|reference/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, storeWith(null, { id: input.productionProfileId, path: input.productionProfilePath, profile: { id: input.productionProfileId, registryMembership: "REGISTERED" } })), /membership/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, storeWith({ ...input.registryEntry, status: "published" })), /conflicts/i);
});

test("registry result is deterministic and authorization remains immutable", () => {
  const auth = authorization(); const input = inputs(auth); const before = factory.orchestrationJson.canonicalSerialize(auth);
  const first = factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, storeWith()); const second = factory.materializeProductionTechnicalProfileRegistryInsertion(auth, input, storeWith());
  assert.deepEqual(first, second); assert.equal(factory.orchestrationJson.canonicalSerialize(auth), before); assert.equal(first.productionCreated, true); assert.equal(first.registryMembership, "REGISTERED");
});
