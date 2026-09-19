"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function readyAuthorization() {
  const result = {
    schemaVersion: 1,
    id: "placeholder",
    productionAuthorizationId: "production-authorization.fixture000000001",
    productionAuthorizationState: "AUTHORIZATION-READY",
    productionAuthorizationReasons: [],
    declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(),
    requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })),
    aggregateState: "REQUIREMENTS-READY",
    aggregateReasons: [],
    humanAuthorizationRequired: true,
    materializationAllowed: false,
    lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001" },
    sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" },
    rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "page:1" } } },
    targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" },
    targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" },
    proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } },
    productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result);
  result.lineage.materializationRequirementsAuthorizationId = result.id;
  const decision = factory.createProductionMaterializationDecision(result.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Synthetic approval for the generic materializer test." });
  return factory.authorizeProductionMaterialization(result, decision);
}

function materializationInput(authorization) {
  const sourceIdentity = { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" };
  const documentRef = factory.createDocumentDefinitionRef({ documentIdentity: { documentId: "document.fixture", publicationId: "FIXTURE-001", authority: "Fixture OEM", documentClass: "owner-manual", officialPath: "https://fixture.test/document.pdf" }, sourceIdentity });
  const provenanceRef = factory.createSourceProvenanceRef({ sourceIdentity, lineage: { candidateId: "extraction-candidate.fixture" }, sourceLocation: { locator: "page:1", page: 1, section: "Fixture", tableOrSubsection: "document:full" } });
  const documentId = factory.productionDocumentId(documentRef, provenanceRef);
  const productionDocument = { id: documentId, type: "oem-owners-manual", title: "Synthetic Fixture Owner Manual", manufacturer: "Fixture OEM", publicationId: "FIXTURE-001", edition: "Test", revision: null, language: "en", regions: ["ALL"], years: { from: 2099, to: 2099 }, url: "https://fixture.test/document.pdf", notes: "Synthetic document used only by automated tests." };
  return { authorizationId: authorization.id, materializationRequirementsAuthorizationId: authorization.materializationRequirementsAuthorizationId, productionAuthorizationId: authorization.productionAuthorizationId, requirementType: "PRODUCTION-DOCUMENT-MATERIALIZATION", documentDefinitionRef: documentRef, sourceProvenanceRef: provenanceRef, productionDocument };
}

function storeWith(initial = []) {
  const documents = new Map(initial.map(document => [document.id, structuredClone(document)]));
  return { findByDocumentId: id => documents.get(id) || null, createDocument: document => { if (documents.has(document.id)) throw new Error("duplicate document write"); documents.set(document.id, structuredClone(document)); }, count: () => documents.size };
}

test("authorized document input is created once and then safely reused", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const store = storeWith();
  const first = factory.materializeProductionDocument(authorization, input, store);
  const second = factory.materializeProductionDocument(authorization, input, store);
  assert.equal(first.action, "CREATED");
  assert.equal(first.productionCreated, true);
  assert.equal(second.action, "REUSED");
  assert.equal(second.productionCreated, false);
  assert.equal(first.id, second.id);
  assert.equal(store.count(), 1);
});

test("materializer rejects unauthorized, forged, stale and mismatched inputs", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const store = storeWith();
  const pending = { ...authorization, humanDecision: null, authorizationState: "PENDING-MATERIALIZATION-AUTHORIZATION", reasons: ["HUMAN-AUTHORIZATION-PENDING"], materializationAllowed: false };
  pending.id = factory.productionMaterializationAuthorizationId(pending);
  assert.throws(() => factory.materializeProductionDocument(pending, input, store), /explicit authorization/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, authorizationId: "production-materialization-authorization.000000000000000000000000" }, store), /authorization ID mismatch/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, productionAuthorizationId: "production-authorization.other" }, store), /production authorization mismatch/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, requirementType: "PRODUCTION-CITATION-MATERIALIZATION" }, store), /requirement type/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, documentDefinitionRef: null }, store), /requires document and provenance/i);
});

test("conflicting duplicate and incomplete source data fail closed", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const conflicting = { ...input.productionDocument, title: "Conflicting fixture" };
  const store = storeWith([conflicting]);
  assert.throws(() => factory.materializeProductionDocument(authorization, input, store), /conflicts/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, sourceProvenanceRef: { ...input.sourceProvenanceRef, sourceIdentity: { ...input.sourceProvenanceRef.sourceIdentity, authority: "Other OEM" } } }, store), /unstable|mismatch/i);
  assert.throws(() => factory.materializeProductionDocument(authorization, { ...input, productionDocument: { ...input.productionDocument, manufacturer: "Other OEM" } }, store), /identity|manufacturer/i);
});

test("materializer result is deterministic and does not mutate authorization", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const before = factory.orchestrationJson.canonicalSerialize(authorization);
  const first = factory.materializeProductionDocument(authorization, input, storeWith());
  const second = factory.materializeProductionDocument(authorization, input, storeWith());
  assert.deepEqual(first, second);
  assert.equal(factory.orchestrationJson.canonicalSerialize(authorization), before);
  assert.equal(first.requirementType, "PRODUCTION-DOCUMENT-MATERIALIZATION");
});
