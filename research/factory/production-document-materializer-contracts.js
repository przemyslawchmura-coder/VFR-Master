// GENERIC production-document materialization result contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const sources = require("../../js/technical/technical-profile-sources.js");

const PRODUCTION_DOCUMENT_MATERIALIZATION_SCHEMA_VERSION = 1;
const PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT = "PRODUCTION-DOCUMENT-MATERIALIZATION";
const PRODUCTION_DOCUMENT_MATERIALIZATION_ACTIONS = Object.freeze(["CREATED", "REUSED"]);
const fields = new Set([
  "schemaVersion", "id", "productionMaterializationAuthorizationId",
  "materializationRequirementsAuthorizationId", "productionAuthorizationId",
  "humanDecisionId", "requirementType", "action", "productionDocumentId",
  "productionDocumentReference", "productionDocument", "sourceIdentity",
  "sourceProvenanceReferenceId", "targetIdentity", "targetApplicability",
  "productionCreated"
]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function productionDocumentId(documentDefinitionRef, sourceProvenanceRef) {
  return `doc.${crypto.createHash("sha256").update(json.canonicalSerialize({ documentIdentity: documentDefinitionRef.documentIdentity, sourceIdentity: documentDefinitionRef.sourceIdentity, provenanceId: sourceProvenanceRef.id })).digest("hex").slice(0, 24)}`;
}

function productionDocumentMaterializationResultId(input) {
  return `production-document-materialization.${crypto.createHash("sha256").update(json.canonicalSerialize({ authorizationId: input.productionMaterializationAuthorizationId, requirementType: input.requirementType, productionDocumentId: input.productionDocumentId, productionDocument: input.productionDocument, sourceProvenanceReferenceId: input.sourceProvenanceReferenceId })).digest("hex").slice(0, 24)}`;
}

function validateProductionDocumentDefinition(document) {
  json.assertJsonSafe(document);
  assert(document && typeof document === "object", "Production document is required");
  assert(nonEmpty(document.id), "Production document.id is required");
  assert(sources.isKnownDocumentType(document.type), "Production document.type is unknown");
  assert(nonEmpty(document.title), "Production document.title is required");
  assert(nonEmpty(document.manufacturer), "Production document.manufacturer is required");
  assert(nonEmpty(document.publicationId), "Production document.publicationId is required");
  assert(nonEmpty(document.language), "Production document.language is required");
  assert(Array.isArray(document.regions) && document.regions.length > 0 && document.regions.every(nonEmpty), "Production document.regions are required");
  assert(document.years && Number.isInteger(document.years.from) && Number.isInteger(document.years.to) && document.years.from <= document.years.to, "Production document.years are invalid");
  assert(typeof document.url === "string" && /^https:\/\//.test(document.url), "Production document.url must be HTTPS");
  return json.immutableClone(document);
}

function validateProductionDocumentMaterializationResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PRODUCTION_DOCUMENT_MATERIALIZATION_SCHEMA_VERSION, "Production document materialization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `Production document materialization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-document-materialization\.[a-f0-9]{24}$/.test(input.id), "Production document materialization.id is invalid");
  assert(input.requirementType === PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT, "Production document materializer requirement type is invalid");
  assert(PRODUCTION_DOCUMENT_MATERIALIZATION_ACTIONS.includes(input.action), "Production document materialization action is invalid");
  assert(nonEmpty(input.productionMaterializationAuthorizationId) && nonEmpty(input.materializationRequirementsAuthorizationId) && nonEmpty(input.productionAuthorizationId) && nonEmpty(input.humanDecisionId), "Production document materialization lineage is incomplete");
  assert(nonEmpty(input.productionDocumentId) && input.productionDocument && input.productionDocument.id === input.productionDocumentId, "Production document materialization document identity is incomplete");
  validateProductionDocumentDefinition(input.productionDocument);
  assert(input.productionDocumentReference && input.productionDocumentReference.documentId === input.productionDocumentId, "Production document materialization document reference is incomplete");
  assert(input.sourceIdentity && input.sourceProvenanceReferenceId && input.targetIdentity && input.targetApplicability, "Production document materialization provenance/applicability is incomplete");
  assert(typeof input.productionCreated === "boolean" && input.productionCreated === (input.action === "CREATED"), "Production document materialization creation state is invalid");
  assert(input.id === productionDocumentMaterializationResultId(input), "Production document materialization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({
  PRODUCTION_DOCUMENT_MATERIALIZATION_SCHEMA_VERSION,
  PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT,
  PRODUCTION_DOCUMENT_MATERIALIZATION_ACTIONS,
  productionDocumentId,
  productionDocumentMaterializationResultId,
  validateProductionDocumentDefinition,
  validateProductionDocumentMaterializationResult
});
