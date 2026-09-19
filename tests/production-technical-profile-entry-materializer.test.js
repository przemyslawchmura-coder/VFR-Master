"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function readyAuthorization() {
  const result = {
    schemaVersion: 1, id: "placeholder", productionAuthorizationId: "production-authorization.fixture000000001", productionAuthorizationState: "AUTHORIZATION-READY", productionAuthorizationReasons: [],
    declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(),
    requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })),
    aggregateState: "REQUIREMENTS-READY", aggregateReasons: [], humanAuthorizationRequired: true, materializationAllowed: false,
    lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001" },
    sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" },
    rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "lines:1-2" } } }, targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" },
    proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } }, productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result);
  result.lineage.materializationRequirementsAuthorizationId = result.id;
  const decision = factory.createProductionMaterializationDecision(result.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Synthetic approval for the generic Technical Profile entry materializer test." });
  return factory.authorizeProductionMaterialization(result, decision);
}

function input(authorization) {
  const sourceIdentity = authorization.sourceIdentity;
  const profile = factory.createTechnicalProfileDefinitionRef({ profileIdentity: { targetId: "target.fixture.model", catalogVariantKey: "fixture.model", manufacturer: "Fixture", model: "Model", generation: "Generation", modelYear: 2024, market: "USA", transmission: "manual", equipment: "standard", abs: true }, catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId: "target.fixture.model", catalogVariantKey: "fixture.model" } });
  const citation = factory.createCitationDefinitionRef({ citationIdentity: { canonicalFieldId: "lubrication.oil-specification", documentId: "document.fixture" }, sourceIdentity });
  const entry = factory.createTechnicalProfileEntryDefinitionRef({ profileDefinitionRefId: profile.id, targetIdentity: { targetId: profile.profileIdentity.targetId, catalogVariantKey: profile.profileIdentity.catalogVariantKey }, productionAuthorizationId: authorization.productionAuthorizationId, categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", entryType: "fluid", value: authorization.proposedProduction.value, citationDefinitionRefId: citation.id, applicability: authorization.targetApplicability });
  const productionCitation = { id: "cite.fixture", documentId: "doc.fixture", canonicalFieldId: "lubrication.oil-specification" };
  return { authorizationId: authorization.id, materializationRequirementsAuthorizationId: authorization.materializationRequirementsAuthorizationId, productionAuthorizationId: authorization.productionAuthorizationId, requirementType: "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION", profileDefinitionRef: profile, profileEntryDefinitionRef: entry, citationDefinitionRef: citation, productionDocumentId: productionCitation.documentId, productionCitationId: productionCitation.id, productionCitation };
}

function storeWith(existingEntry = null, profileExists = true) {
  const profile = { profileId: "fixture.profile.2024", path: "data/fixture/profile.js", entries: new Map(existingEntry ? [[existingEntry.id, structuredClone(existingEntry)]] : []) };
  return { findProfileByDefinition: () => profileExists ? profile : null, findDocumentById: id => id === "doc.fixture" ? { id } : null, findCitationById: id => id === "cite.fixture" ? { id, documentId: "doc.fixture", canonicalFieldId: "lubrication.oil-specification" } : null, findEntry: (container, id) => container.entries.get(id) || null, createEntry: (container, entry) => { if (container.entries.has(entry.id)) throw new Error("duplicate entry write"); container.entries.set(entry.id, structuredClone(entry)); }, count: () => profile.entries.size };
}

test("authorized entry is created once and then safely reused", () => {
  const authorization = readyAuthorization();
  const inputData = input(authorization);
  const store = storeWith();
  const first = factory.materializeProductionTechnicalProfileEntry(authorization, inputData, store);
  const second = factory.materializeProductionTechnicalProfileEntry(authorization, inputData, store);
  assert.equal(first.action, "CREATED"); assert.equal(second.action, "REUSED"); assert.equal(first.id, second.id); assert.equal(store.count(), 1); assert.equal(first.productionEntryId, "lubrication.engine-oil.specification"); assert.equal(first.productionCreated, true); assert.equal(second.productionCreated, false);
});

test("entry materializer rejects conflicts, missing profile containers and invalid bindings", () => {
  const authorization = readyAuthorization(); const inputData = input(authorization);
  const created = factory.materializeProductionTechnicalProfileEntry(authorization, inputData, storeWith());
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(authorization, inputData, storeWith({ ...created.productionEntry, value: { type: "text", text: "conflict" } })), /conflicts/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(authorization, inputData, storeWith(null, false)), /container is required/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(authorization, { ...inputData, productionCitationId: "cite.other" }, storeWith()), /missing|binding/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(authorization, { ...inputData, requirementType: "REGISTRY-INSERTION" }, storeWith()), /requirement type/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(authorization, { ...inputData, profileEntryDefinitionRef: "forged" }, storeWith()), /schemaVersion|reference/i);
});

test("entry result is deterministic, immutable and fail-closed for unauthorized input", () => {
  const authorization = readyAuthorization(); const inputData = input(authorization);
  const before = factory.orchestrationJson.canonicalSerialize(authorization);
  const first = factory.materializeProductionTechnicalProfileEntry(authorization, inputData, storeWith());
  const second = factory.materializeProductionTechnicalProfileEntry(authorization, inputData, storeWith());
  assert.deepEqual(first, second); assert.equal(factory.orchestrationJson.canonicalSerialize(authorization), before);
  const pending = { ...authorization, humanDecision: null, authorizationState: "PENDING-MATERIALIZATION-AUTHORIZATION", reasons: ["HUMAN-AUTHORIZATION-PENDING"], materializationAllowed: false }; pending.id = factory.productionMaterializationAuthorizationId(pending);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(pending, inputData, storeWith()), /explicit authorization/i);
});
