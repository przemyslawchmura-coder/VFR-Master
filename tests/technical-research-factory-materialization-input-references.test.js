"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

const sourceIdentity = { sourceId: "source.synthetic", prospectId: "prospect.synthetic", documentId: "document.synthetic", authority: "OEM", tier: "A" };
const documentInput = { documentIdentity: { documentId: "document.synthetic", publicationId: "PUBLICATION-SYNTHETIC-001", authority: "OEM", documentClass: "owner-manual", officialPath: "https://example.test/document.pdf" }, sourceIdentity };
const provenanceInput = { sourceIdentity, lineage: { artifactId: "artifact.synthetic", extractionResultId: "extraction-result.synthetic", candidateId: "extraction-candidate.synthetic00001" }, sourceLocation: { locator: "page:1", section: "Synthetic" } };

function syntheticAuthorization(overrides = {}) {
  const base = { schemaVersion: 1, id: "placeholder", schemaConversionProjectionId: "schema-conversion.synthetic00000000001", promotionReviewDecisionId: "promotion-review-decision.synthetic000001", promotionReviewPacketId: "promotion-review-packet.synthetic00001", promotionPacketId: "promotion-candidate.synthetic0000001", evidenceProcessingRecordId: "evidence-processing.synthetic000001", researchCanonicalFieldId: "synthetic.field", targetIdentity: { id: "target.synthetic" }, sourceIdentity, proposedProduction: { entryId: "synthetic.entry", categoryId: "synthetic", type: "specification", value: { type: "text", text: "raw" } }, rawSource: { rawValue: "raw", rawUnit: null, provenance: { packet: { candidateId: "extraction-candidate.synthetic00001", sourceLocation: { locator: "page:1" } }, sourceLocation: { locator: "page:1" } } }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", context: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN" }, authorizationState: "AUTHORIZATION-READY", reasons: [], futureMaterializationRequirements: [...factory.FUTURE_MATERIALIZATION_REQUIREMENTS], productionCreated: false };
  const result = Object.assign(base, overrides);
  result.id = factory.authorizationId(result);
  return result;
}

test("generic document and provenance refs are valid, deterministic and immutable", () => {
  const document = factory.createDocumentDefinitionRef(documentInput);
  const provenance = factory.createSourceProvenanceRef(provenanceInput);
  assert.equal(document.type, "DOCUMENT-DEFINITION-REF");
  assert.equal(provenance.type, "SOURCE-PROVENANCE-REF");
  assert.equal(document.id, factory.documentDefinitionRefId(document));
  assert.equal(provenance.id, factory.sourceProvenanceRefId(provenance));
  assert.deepEqual(factory.createDocumentDefinitionRef(documentInput), document);
  assert.deepEqual(factory.createSourceProvenanceRef(provenanceInput), provenance);
  assert.deepEqual(factory.assertCompatibleDocumentAndProvenance(document, provenance), { document, provenance });
});

test("refs reject malformed data, forged strings, unknown types and incomplete identity", () => {
  assert.throws(() => factory.validateDocumentDefinitionRef("foo"), /schemaVersion/);
  assert.throws(() => factory.validateSourceProvenanceRef("foo"), /schemaVersion/);
  assert.throws(() => factory.createDocumentDefinitionRef({ documentIdentity: { ...documentInput.documentIdentity, officialPath: "http://unsafe.test/document.pdf" }, sourceIdentity }), /HTTPS/);
  assert.throws(() => factory.createSourceProvenanceRef({ sourceIdentity: { ...sourceIdentity, documentId: "" }, lineage: provenanceInput.lineage, sourceLocation: provenanceInput.sourceLocation }), /required/);
  assert.throws(() => factory.validateDocumentDefinitionRef({ ...factory.createDocumentDefinitionRef(documentInput), type: "UNKNOWN" }), /type is invalid/);
});

test("document and provenance identity mismatches fail closed", () => {
  const document = factory.createDocumentDefinitionRef(documentInput);
  const provenance = factory.createSourceProvenanceRef({ ...provenanceInput, sourceIdentity: { ...sourceIdentity, documentId: "document.other" } });
  assert.throws(() => factory.assertCompatibleDocumentAndProvenance(document, provenance), /documentId mismatch/);
});

test("generic citation and source-location refs preserve identity and page-null locations", () => {
  const document = factory.createDocumentDefinitionRef(documentInput);
  const provenance = factory.createSourceProvenanceRef(provenanceInput);
  const citation = factory.createCitationDefinitionRef({ citationIdentity: { canonicalFieldId: "synthetic.field", documentId: "document.synthetic" }, sourceIdentity });
  const location = factory.createSourceLocationRef({ sourceIdentity, documentId: "document.synthetic", sourceProvenanceRefId: provenance.id, sourceLocation: { locator: "lines:1-2", page: null, section: "Synthetic", tableOrSubsection: "document:full" } });
  assert.equal(citation.id, factory.citationDefinitionRefId(citation));
  assert.equal(location.id, factory.sourceLocationRefId(location));
  assert.deepEqual(factory.assertCompatibleCitationInputs(citation, document, location), { citation, document, location });
});

test("only the document requirement can become ready from compatible typed refs", () => {
  const document = factory.createDocumentDefinitionRef(documentInput);
  const provenance = factory.createSourceProvenanceRef(provenanceInput);
  const provided = { "PRODUCTION-DOCUMENT-MATERIALIZATION": [document, provenance], "PRODUCTION-CITATION-MATERIALIZATION": [], "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION": [], "REGISTRY-INSERTION": [] };
  const result = factory.authorizeMaterializationRequirements(syntheticAuthorization(), provided);
  const documentRequirement = result.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION");
  assert.equal(documentRequirement.state, "READY");
  assert.deepEqual(documentRequirement.missingInputs, []);
  assert.equal(result.aggregateState, "REQUIREMENTS-PENDING");
  assert.equal(result.materializationAllowed, false);
  assert.equal(result.productionCreated, false);
  assert.ok(result.requirements.filter(item => item !== documentRequirement).every(item => item.state === "PENDING"));
});

test("only compatible typed citation inputs can make citation ready", () => {
  const document = factory.createDocumentDefinitionRef(documentInput);
  const provenance = factory.createSourceProvenanceRef(provenanceInput);
  const citation = factory.createCitationDefinitionRef({ citationIdentity: { canonicalFieldId: "synthetic.field", documentId: "document.synthetic" }, sourceIdentity });
  const location = factory.createSourceLocationRef({ sourceIdentity, documentId: "document.synthetic", sourceProvenanceRefId: provenance.id, sourceLocation: { locator: "page:1", page: null, section: "Synthetic", tableOrSubsection: "document:full" } });
  const result = factory.authorizeMaterializationRequirements(syntheticAuthorization(), { "PRODUCTION-DOCUMENT-MATERIALIZATION": [document, provenance], "PRODUCTION-CITATION-MATERIALIZATION": [citation, document, location] });
  assert.equal(result.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION").state, "READY");
  assert.throws(() => factory.authorizeMaterializationRequirements(syntheticAuthorization(), { "PRODUCTION-CITATION-MATERIALIZATION": ["foo", document, location] }), /unknown reference types/);
});

test("arbitrary strings cannot satisfy document inputs and blocked upstream stays blocked", () => {
  const provided = { "PRODUCTION-DOCUMENT-MATERIALIZATION": ["foo", "bar"] };
  assert.throws(() => factory.authorizeMaterializationRequirements(syntheticAuthorization(), provided), /unknown reference types/);
  const blocked = factory.authorizeMaterializationRequirements(syntheticAuthorization({ authorizationState: "AUTHORIZATION-BLOCKED", reasons: ["BLOCKED"] }), { "PRODUCTION-DOCUMENT-MATERIALIZATION": [factory.createDocumentDefinitionRef(documentInput), factory.createSourceProvenanceRef(provenanceInput)] });
  assert.equal(blocked.aggregateState, "REQUIREMENTS-BLOCKED");
  assert.equal(blocked.materializationAllowed, false);
});
