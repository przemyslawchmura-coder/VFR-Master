// NON-PRODUCTION generic materialization input-reference contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION = 1;
const DOCUMENT_DEFINITION_REF_TYPE = "DOCUMENT-DEFINITION-REF";
const SOURCE_PROVENANCE_REF_TYPE = "SOURCE-PROVENANCE-REF";
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const isNonEmptyString = value => typeof value === "string" && value.length > 0;

function sourceIdentityValid(identity, path) {
  assert(identity && typeof identity === "object", `${path} is incomplete`);
  ["sourceId", "prospectId", "documentId", "authority", "tier"].forEach(field => assert(isNonEmptyString(identity[field]), `${path}.${field} is required`));
  assert(identity.tier === "A" || identity.tier === "B", `${path}.tier is invalid`);
}

function documentDefinitionRefId(input) {
  return `document-definition-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, documentIdentity: input.documentIdentity, sourceIdentity: input.sourceIdentity, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function sourceProvenanceRefId(input) {
  return `source-provenance-ref.${crypto.createHash("sha256").update(json.canonicalSerialize({ type: input.type, sourceIdentity: input.sourceIdentity, lineage: input.lineage, sourceLocation: input.sourceLocation, nonProduction: input.nonProduction })).digest("hex").slice(0, 24)}`;
}

function validateDocumentDefinitionRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION, "DocumentDefinitionReference schemaVersion is incompatible");
  assert(input.type === DOCUMENT_DEFINITION_REF_TYPE, "DocumentDefinitionReference.type is invalid");
  assert(input.nonProduction === true, "DocumentDefinitionReference must remain non-production");
  assert(input.documentIdentity && typeof input.documentIdentity === "object", "DocumentDefinitionReference.documentIdentity is incomplete");
  ["documentId", "publicationId", "authority", "documentClass", "officialPath"].forEach(field => assert(isNonEmptyString(input.documentIdentity[field]), `DocumentDefinitionReference.documentIdentity.${field} is required`));
  assert(/^https:\/\//.test(input.documentIdentity.officialPath), "DocumentDefinitionReference.documentIdentity.officialPath must be HTTPS");
  sourceIdentityValid(input.sourceIdentity, "DocumentDefinitionReference.sourceIdentity");
  assert(input.documentIdentity.documentId === input.sourceIdentity.documentId, "DocumentDefinitionReference document identity does not match source identity");
  assert(typeof input.id === "string" && /^document-definition-ref\.[a-f0-9]{24}$/.test(input.id), "DocumentDefinitionReference.id is invalid");
  assert(input.id === documentDefinitionRefId(input), "DocumentDefinitionReference.id is unstable");
  return json.immutableClone(input);
}

function createDocumentDefinitionRef(input) {
  const result = { schemaVersion: MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION, type: DOCUMENT_DEFINITION_REF_TYPE, id: "placeholder", documentIdentity: input.documentIdentity, sourceIdentity: input.sourceIdentity, nonProduction: true };
  result.id = documentDefinitionRefId(result);
  return validateDocumentDefinitionRef(result);
}

function validateSourceProvenanceRef(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION, "SourceProvenanceReference schemaVersion is incompatible");
  assert(input.type === SOURCE_PROVENANCE_REF_TYPE, "SourceProvenanceReference.type is invalid");
  assert(input.nonProduction === true, "SourceProvenanceReference must remain non-production");
  sourceIdentityValid(input.sourceIdentity, "SourceProvenanceReference.sourceIdentity");
  assert(input.lineage && typeof input.lineage === "object", "SourceProvenanceReference.lineage is incomplete");
  assert(isNonEmptyString(input.lineage.candidateId), "SourceProvenanceReference.lineage.candidateId is required");
  assert(input.sourceLocation && typeof input.sourceLocation === "object" && isNonEmptyString(input.sourceLocation.locator), "SourceProvenanceReference.sourceLocation is incomplete");
  assert(typeof input.id === "string" && /^source-provenance-ref\.[a-f0-9]{24}$/.test(input.id), "SourceProvenanceReference.id is invalid");
  assert(input.id === sourceProvenanceRefId(input), "SourceProvenanceReference.id is unstable");
  return json.immutableClone(input);
}

function createSourceProvenanceRef(input) {
  const result = { schemaVersion: MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION, type: SOURCE_PROVENANCE_REF_TYPE, id: "placeholder", sourceIdentity: input.sourceIdentity, lineage: input.lineage, sourceLocation: input.sourceLocation, nonProduction: true };
  result.id = sourceProvenanceRefId(result);
  return validateSourceProvenanceRef(result);
}

function assertCompatibleDocumentAndProvenance(documentRef, provenanceRef) {
  const document = validateDocumentDefinitionRef(documentRef);
  const provenance = validateSourceProvenanceRef(provenanceRef);
  ["sourceId", "prospectId", "documentId", "authority", "tier"].forEach(field => assert(document.sourceIdentity[field] === provenance.sourceIdentity[field], `DocumentDefinitionReference and SourceProvenanceReference ${field} mismatch`));
  return Object.freeze({ document, provenance });
}

module.exports = Object.freeze({ MATERIALIZATION_INPUT_REFERENCE_SCHEMA_VERSION, DOCUMENT_DEFINITION_REF_TYPE, SOURCE_PROVENANCE_REF_TYPE, documentDefinitionRefId, sourceProvenanceRefId, createDocumentDefinitionRef, createSourceProvenanceRef, validateDocumentDefinitionRef, validateSourceProvenanceRef, assertCompatibleDocumentAndProvenance });
