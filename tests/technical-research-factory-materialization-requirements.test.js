"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function synthetic(overrides = {}) {
  const base = {
    schemaVersion: 1, id: "production-authorization.synthetic000000000001", schemaConversionProjectionId: "schema-conversion.synthetic00000000001", promotionReviewDecisionId: "promotion-review-decision.synthetic000001", promotionReviewPacketId: "promotion-review-packet.synthetic00001", promotionPacketId: "promotion-candidate.synthetic0000001", evidenceProcessingRecordId: "evidence-processing.synthetic000001", researchCanonicalFieldId: "lubrication.oil-specification", targetIdentity: { id: "target.synthetic.model", catalogVariantKey: "synthetic.model" }, sourceIdentity: { sourceId: "source.synthetic", prospectId: "prospect.synthetic", documentId: "document.synthetic", authority: "OEM", tier: "A" }, proposedProduction: { entryId: "lubrication.engine-oil.specification", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "raw" } }, rawSource: { rawValue: "raw", rawUnit: null, provenance: { packet: { candidateId: "extraction-candidate.synthetic00001", sourceLocation: { locator: "page:1" } }, sourceLocation: { locator: "page:1" } } }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", context: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN" }, authorizationState: "AUTHORIZATION-READY", reasons: [], futureMaterializationRequirements: [...factory.FUTURE_MATERIALIZATION_REQUIREMENTS], productionCreated: false
  };
  const result = Object.assign(base, overrides);
  result.id = factory.authorizationId(result);
  return result;
}

const genericSourceIdentity = { sourceId: "source.synthetic", prospectId: "prospect.synthetic", documentId: "document.synthetic", authority: "OEM", tier: "A" };
const genericDocumentRef = factory.createDocumentDefinitionRef({ documentIdentity: { documentId: "document.synthetic", publicationId: "PUBLICATION-SYNTHETIC-001", authority: "OEM", documentClass: "owner-manual", officialPath: "https://example.test/document.pdf" }, sourceIdentity: genericSourceIdentity });
const genericProvenanceRef = factory.createSourceProvenanceRef({ sourceIdentity: genericSourceIdentity, lineage: { candidateId: "extraction-candidate.synthetic00001" }, sourceLocation: { locator: "page:1" } });
const genericCitationRef = factory.createCitationDefinitionRef({ citationIdentity: { canonicalFieldId: "lubrication.oil-specification", documentId: "document.synthetic" }, sourceIdentity: genericSourceIdentity });
const genericLocationRef = factory.createSourceLocationRef({ sourceIdentity: genericSourceIdentity, documentId: "document.synthetic", sourceProvenanceRefId: genericProvenanceRef.id, sourceLocation: { locator: "page:1", page: null, section: "Synthetic", tableOrSubsection: "document:full" } });
const genericProfileRef = factory.createTechnicalProfileDefinitionRef({ profileIdentity: { targetId: "target.synthetic.model", catalogVariantKey: "synthetic.model", manufacturer: "Synthetic", model: "Model", generation: "I", modelYear: 2024, market: "EU", transmission: "manual", equipment: "standard", abs: true }, catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId: "target.synthetic.model", catalogVariantKey: "synthetic.model" } });
const genericEntryRef = factory.createTechnicalProfileEntryDefinitionRef({ profileDefinitionRefId: genericProfileRef.id, targetIdentity: { targetId: "target.synthetic.model", catalogVariantKey: "synthetic.model" }, productionAuthorizationId: factory.authorizationId(synthetic()), categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", entryType: "fluid", value: { type: "text", text: "raw" }, citationDefinitionRefId: genericCitationRef.id, applicability: synthetic().targetApplicability });
const allInputs = Object.fromEntries(factory.REQUIREMENT_TYPES.map(type => [type, [...factory.REQUIRED_INPUTS[type]]]));
allInputs["PRODUCTION-DOCUMENT-MATERIALIZATION"] = [genericDocumentRef, genericProvenanceRef];
allInputs["PRODUCTION-CITATION-MATERIALIZATION"] = [genericCitationRef, genericDocumentRef, genericLocationRef];
allInputs["TECHNICAL-PROFILE-ENTRY-MATERIALIZATION"] = [genericCitationRef, genericEntryRef, genericProfileRef];

test("four declared requirements produce a pending generic readiness projection", () => {
  const result = factory.authorizeMaterializationRequirements(synthetic());
  assert.equal(result.aggregateState, "REQUIREMENTS-PENDING");
  assert.equal(result.requirements.length, 4);
  assert.ok(result.requirements.every(item => item.state === "PENDING"));
  assert.equal(result.humanAuthorizationRequired, true);
  assert.equal(result.materializationAllowed, false);
  assert.equal(result.productionCreated, false);
});

test("complete generic input references produce readiness without permitting materialization", () => {
  const result = factory.authorizeMaterializationRequirements(synthetic(), allInputs);
  assert.equal(result.aggregateState, "REQUIREMENTS-READY");
  assert.ok(result.requirements.every(item => item.state === "READY"));
  assert.equal(result.materializationAllowed, false);
});

test("requirements are order-independent, deterministic and immutable", () => {
  const input = synthetic();
  const before = factory.orchestrationJson.canonicalSerialize(input);
  const first = factory.authorizeMaterializationRequirements(input);
  assert.deepEqual(factory.authorizeMaterializationRequirements(input), first);
  assert.equal(factory.orchestrationJson.canonicalSerialize(input), before);
  assert.equal(first.id, factory.materializationRequirementsAuthorizationId(first));
  assert.deepEqual(first.declaredRequirements, [...first.declaredRequirements].sort());
});

test("non-ready or production-created upstream authorization fails closed", () => {
  const blocked = factory.authorizeMaterializationRequirements(synthetic({ authorizationState: "AUTHORIZATION-BLOCKED", reasons: ["X"] }));
  assert.equal(blocked.productionAuthorizationState, "AUTHORIZATION-BLOCKED");
  assert.equal(blocked.aggregateState, "REQUIREMENTS-BLOCKED");
  assert.ok(blocked.requirements.every(item => item.state === "BLOCKED" && item.reasons.includes("UPSTREAM-AUTHORIZATION-BLOCKED")));
  assert.throws(() => factory.authorizeMaterializationRequirements(synthetic({ productionCreated: true })), /cannot claim production creation/);
});

test("unknown, missing, duplicate and malformed requirement declarations fail closed", () => {
  assert.throws(() => factory.authorizeMaterializationRequirements(synthetic({ futureMaterializationRequirements: ["UNKNOWN"] })), /future requirements are invalid/);
  assert.throws(() => factory.authorizeMaterializationRequirements(synthetic({ futureMaterializationRequirements: [] })), /future requirements are invalid/);
  assert.throws(() => factory.authorizeMaterializationRequirements(synthetic({ futureMaterializationRequirements: [factory.FUTURE_MATERIALIZATION_REQUIREMENTS[0], factory.FUTURE_MATERIALIZATION_REQUIREMENTS[0]] })), /future requirements are invalid/);
  assert.throws(() => factory.authorizeMaterializationRequirements(synthetic(), { [factory.REQUIREMENT_TYPES[0]]: "not-an-array" }), /inputs.*invalid/);
});

test("generic output retains lineage, provenance and applicability", () => {
  const result = factory.authorizeMaterializationRequirements(synthetic());
  assert.equal(result.lineage.productionAuthorizationId, factory.authorizationId(synthetic()));
  assert.equal(result.lineage.schemaConversionProjectionId, "schema-conversion.synthetic00000000001");
  assert.equal(result.rawSource.rawValue, "raw");
  assert.equal(result.sourceIdentity.tier, "A");
  assert.equal(result.targetApplicability.abs, "KNOWN");
  assert.equal(result.proposedProduction.entryId, "lubrication.engine-oil.specification");
});
