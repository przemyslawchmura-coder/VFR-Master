"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function authorization() {
  const result = {
    schemaVersion: 1, id: "placeholder", productionAuthorizationId: "production-authorization.fixture000000001", productionAuthorizationState: "AUTHORIZATION-READY", productionAuthorizationReasons: [], declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(), requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })), aggregateState: "REQUIREMENTS-READY", aggregateReasons: [], humanAuthorizationRequired: true, materializationAllowed: false, lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001" }, sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" }, rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "lines:1-2" } } }, targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" }, proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } }, productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result); result.lineage.materializationRequirementsAuthorizationId = result.id;
  return factory.authorizeProductionMaterialization(result, factory.createProductionMaterializationDecision(result.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Synthetic approval for the generic profile container materializer test." }));
}

function input(auth) {
  const profileDefinitionRef = factory.createTechnicalProfileDefinitionRef({ profileIdentity: { targetId: "target.fixture.model", catalogVariantKey: "fixture.model", manufacturer: "Fixture", model: "Model", generation: "Generation", modelYear: 2024, market: "USA", transmission: "manual", equipment: "standard", abs: true }, catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId: "target.fixture.model", catalogVariantKey: "fixture.model" } });
  return { authorizationId: auth.id, productionAuthorizationId: auth.productionAuthorizationId, profileDefinitionRef, productionProfileId: "fixture.profile.2024", productionProfilePath: "data/fixture/profile.js", productionProfile: { id: "fixture.profile.2024", schemaVersion: "revlog-technical-profile/v1", registryMembership: "NOT-REGISTERED", entries: [] } };
}

function storeWith(existing = null) {
  let profile = existing;
  return { findProfileByDefinition: () => profile, createProfile: value => { if (profile) throw new Error("duplicate profile write"); profile = structuredClone(value); }, current: () => profile };
}

test("generic profile container materializer creates once and reuses safely", () => {
  const auth = authorization(); const inputs = input(auth); const store = storeWith();
  const first = factory.materializeProductionTechnicalProfileContainer(auth, inputs, store);
  const second = factory.materializeProductionTechnicalProfileContainer(auth, inputs, store);
  assert.equal(first.action, "CREATED"); assert.equal(second.action, "REUSED"); assert.equal(first.id, second.id); assert.equal(first.registryMembership, "NOT-REGISTERED"); assert.equal(store.current().profile.id, "fixture.profile.2024");
});

test("container materializer fails closed for conflicts, malformed refs, stale authorization and production membership", () => {
  const auth = authorization(); const inputs = input(auth);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(auth, inputs, storeWith({ id: inputs.productionProfileId, path: inputs.productionProfilePath, profile: { ...inputs.productionProfile, entries: [{ id: "different" }] } })), /conflicts/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(auth, { ...inputs, profileDefinitionRef: "forged" }, storeWith()), /schemaVersion|reference/i);
  const pending = { ...auth, humanDecision: null, authorizationState: "PENDING-MATERIALIZATION-AUTHORIZATION", reasons: ["HUMAN-AUTHORIZATION-PENDING"], materializationAllowed: false }; pending.id = factory.productionMaterializationAuthorizationId(pending);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(pending, inputs, storeWith()), /explicit authorization/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileContainer(auth, { ...inputs, productionProfile: { ...inputs.productionProfile, registryMembership: "REGISTERED" } }, storeWith()), /registry membership/i);
});

test("container result is deterministic and inputs remain immutable", () => {
  const auth = authorization(); const inputs = input(auth); const before = factory.orchestrationJson.canonicalSerialize(auth);
  const first = factory.materializeProductionTechnicalProfileContainer(auth, inputs, storeWith()); const second = factory.materializeProductionTechnicalProfileContainer(auth, inputs, storeWith());
  assert.deepEqual(first, second); assert.equal(factory.orchestrationJson.canonicalSerialize(auth), before); assert.equal(first.productionCreated, true); assert.equal(second.productionCreated, true);
});
