"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function readyAuthorization() {
  const result = {
    schemaVersion: 1, id: "placeholder",
    productionAuthorizationId: "production-authorization.fixture000000001",
    productionAuthorizationState: "AUTHORIZATION-READY", productionAuthorizationReasons: [],
    declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(),
    requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })),
    aggregateState: "REQUIREMENTS-READY", aggregateReasons: [], humanAuthorizationRequired: true,
    materializationAllowed: false,
    lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001", researchCanonicalFieldId: "lubrication.oil-specification" },
    sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" },
    rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "lines:1-2" } } },
    targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" },
    targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" },
    proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } },
    productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result);
  result.lineage.materializationRequirementsAuthorizationId = result.id;
  const decision = factory.createProductionMaterializationDecision(result.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Synthetic approval for the generic citation materializer test." });
  return factory.authorizeProductionMaterialization(result, decision);
}

function materializationInput(authorization) {
  const sourceIdentity = { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "Fixture OEM", tier: "A" };
  const documentRef = factory.createDocumentDefinitionRef({ documentIdentity: { documentId: "document.fixture", publicationId: "FIXTURE-001", authority: "Fixture OEM", documentClass: "owner-manual", officialPath: "https://fixture.test/document.pdf" }, sourceIdentity });
  const provenanceRef = factory.createSourceProvenanceRef({ sourceIdentity, lineage: { candidateId: "extraction-candidate.fixture" }, sourceLocation: { locator: "lines:1-2", page: null, section: "Fixture", tableOrSubsection: "document:full" } });
  const citationRef = factory.createCitationDefinitionRef({ citationIdentity: { canonicalFieldId: "lubrication.oil-specification", documentId: "document.fixture" }, sourceIdentity });
  const locationRef = factory.createSourceLocationRef({ sourceIdentity, documentId: "document.fixture", sourceProvenanceRefId: provenanceRef.id, sourceLocation: provenanceRef.sourceLocation });
  const productionDocumentId = factory.productionDocumentId(documentRef, provenanceRef);
  return { authorizationId: authorization.id, materializationRequirementsAuthorizationId: authorization.materializationRequirementsAuthorizationId, productionAuthorizationId: authorization.productionAuthorizationId, requirementType: "PRODUCTION-CITATION-MATERIALIZATION", citationDefinitionRef: citationRef, documentDefinitionRef: documentRef, sourceLocationRef: locationRef, sourceProvenanceRef: provenanceRef, productionDocumentId };
}

function storeWith(initialDocuments = [], initialCitations = []) {
  const documents = new Map(initialDocuments.map(document => [document.id, structuredClone(document)]));
  const citations = new Map(initialCitations.map(citation => [citation.id, structuredClone(citation)]));
  return {
    findByDocumentId: id => documents.get(id) || null,
    findByCitationId: id => citations.get(id) || null,
    createCitation: citation => { if (citations.has(citation.id)) throw new Error("duplicate citation write"); citations.set(citation.id, structuredClone(citation)); },
    citationCount: () => citations.size
  };
}

test("authorized citation input is created once and then safely reused", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const document = { id: input.productionDocumentId };
  const store = storeWith([document]);
  const first = factory.materializeProductionCitation(authorization, input, store);
  const second = factory.materializeProductionCitation(authorization, input, store);
  assert.equal(first.action, "CREATED");
  assert.equal(second.action, "REUSED");
  assert.equal(first.id, second.id);
  assert.equal(first.productionCreated, true);
  assert.equal(second.productionCreated, false);
  assert.equal(store.citationCount(), 1);
  assert.equal(first.productionCitation.sourceLocation.page, null);
});

test("citation materializer rejects unauthorized, stale, wrong requirement and missing document inputs", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const store = storeWith([{ id: input.productionDocumentId }]);
  const pending = { ...authorization, humanDecision: null, authorizationState: "PENDING-MATERIALIZATION-AUTHORIZATION", reasons: ["HUMAN-AUTHORIZATION-PENDING"], materializationAllowed: false };
  pending.id = factory.productionMaterializationAuthorizationId(pending);
  assert.throws(() => factory.materializeProductionCitation(pending, input, store), /explicit authorization/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, authorizationId: "production-materialization-authorization.000000000000000000000000" }, store), /authorization ID mismatch/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, requirementType: "PRODUCTION-DOCUMENT-MATERIALIZATION" }, store), /requirement type/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, productionDocumentId: "doc.000000000000000000000000" }, store), /document identity|missing/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, sourceLocationRef: null }, store), /typed references/i);
});

test("conflicting citation, mismatched provenance and missing production document fail closed", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const firstStore = storeWith([{ id: input.productionDocumentId }]);
  const first = factory.materializeProductionCitation(authorization, input, firstStore);
  const conflicting = { ...first.productionCitation, locator: "forged" };
  assert.throws(() => factory.materializeProductionCitation(authorization, input, storeWith([{ id: input.productionDocumentId }], [conflicting])), /conflicts/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, sourceProvenanceRef: { ...input.sourceProvenanceRef, sourceIdentity: { ...input.sourceProvenanceRef.sourceIdentity, authority: "Other OEM" } } }, firstStore), /unstable|mismatch/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, input, storeWith()), /document is missing/i);
  assert.throws(() => factory.materializeProductionCitation(authorization, { ...input, sourceLocationRef: { ...input.sourceLocationRef, sourceLocation: { ...input.sourceLocationRef.sourceLocation, locator: "" } } }, firstStore), /unstable|required/i);
});

test("citation result is deterministic and does not mutate authorization or inputs", () => {
  const authorization = readyAuthorization();
  const input = materializationInput(authorization);
  const beforeAuthorization = factory.orchestrationJson.canonicalSerialize(authorization);
  const beforeInput = factory.orchestrationJson.canonicalSerialize(input);
  const first = factory.materializeProductionCitation(authorization, input, storeWith([{ id: input.productionDocumentId }]));
  const second = factory.materializeProductionCitation(authorization, input, storeWith([{ id: input.productionDocumentId }]));
  assert.deepEqual(first, second);
  assert.equal(factory.orchestrationJson.canonicalSerialize(authorization), beforeAuthorization);
  assert.equal(factory.orchestrationJson.canonicalSerialize(input), beforeInput);
});
