// GENERIC production-citation materialization result contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const PRODUCTION_CITATION_MATERIALIZATION_SCHEMA_VERSION = 1;
const PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT = "PRODUCTION-CITATION-MATERIALIZATION";
const PRODUCTION_CITATION_MATERIALIZATION_ACTIONS = Object.freeze(["CREATED", "REUSED"]);
const fields = new Set(["schemaVersion", "id", "productionMaterializationAuthorizationId", "materializationRequirementsAuthorizationId", "productionAuthorizationId", "humanDecisionId", "requirementType", "action", "productionDocumentId", "productionCitationId", "productionCitation", "sourceIdentity", "sourceProvenanceReferenceId", "targetIdentity", "targetApplicability", "productionCreated"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function productionCitationId(citationDefinitionRef, sourceLocationRef, productionDocumentId) {
  return `cite.${crypto.createHash("sha256").update(json.canonicalSerialize({ citationIdentity: citationDefinitionRef.citationIdentity, sourceIdentity: citationDefinitionRef.sourceIdentity, sourceLocation: sourceLocationRef.sourceLocation, sourceProvenanceRefId: sourceLocationRef.sourceProvenanceRefId, productionDocumentId })).digest("hex").slice(0, 24)}`;
}

function productionCitationMaterializationResultId(input) {
  return `production-citation-materialization.${crypto.createHash("sha256").update(json.canonicalSerialize({ authorizationId: input.productionMaterializationAuthorizationId, requirementType: input.requirementType, productionDocumentId: input.productionDocumentId, productionCitationId: input.productionCitationId, productionCitation: input.productionCitation, sourceProvenanceReferenceId: input.sourceProvenanceReferenceId })).digest("hex").slice(0, 24)}`;
}

function validateProductionCitationDefinition(citation) {
  json.assertJsonSafe(citation);
  assert(citation && typeof citation === "object", "Production citation is required");
  assert(nonEmpty(citation.id) && nonEmpty(citation.documentId) && nonEmpty(citation.canonicalFieldId), "Production citation identity is incomplete");
  assert(nonEmpty(citation.section) && nonEmpty(citation.subsection) && nonEmpty(citation.locator), "Production citation source location is incomplete");
  assert(Array.isArray(citation.pages), "Production citation pages are invalid");
  assert(citation.sourceLocation && (citation.sourceLocation.page === null || Number.isInteger(citation.sourceLocation.page) && citation.sourceLocation.page > 0), "Production citation page semantics are invalid");
  return json.immutableClone(citation);
}

function validateProductionCitationMaterializationResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === PRODUCTION_CITATION_MATERIALIZATION_SCHEMA_VERSION, "Production citation materialization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `Production citation materialization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-citation-materialization\.[a-f0-9]{24}$/.test(input.id), "Production citation materialization.id is invalid");
  assert(input.requirementType === PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT, "Production citation materializer requirement type is invalid");
  assert(PRODUCTION_CITATION_MATERIALIZATION_ACTIONS.includes(input.action), "Production citation materialization action is invalid");
  assert(nonEmpty(input.productionMaterializationAuthorizationId) && nonEmpty(input.materializationRequirementsAuthorizationId) && nonEmpty(input.productionAuthorizationId) && nonEmpty(input.humanDecisionId), "Production citation materialization lineage is incomplete");
  assert(nonEmpty(input.productionDocumentId) && nonEmpty(input.productionCitationId), "Production citation materialization identity is incomplete");
  assert(input.productionCitation && input.productionCitation.id === input.productionCitationId && input.productionCitation.documentId === input.productionDocumentId, "Production citation materialization citation identity is incomplete");
  validateProductionCitationDefinition(input.productionCitation);
  assert(input.sourceIdentity && nonEmpty(input.sourceProvenanceReferenceId) && input.targetIdentity && input.targetApplicability, "Production citation materialization provenance/applicability is incomplete");
  assert(typeof input.productionCreated === "boolean" && input.productionCreated === (input.action === "CREATED"), "Production citation materialization creation state is invalid");
  assert(input.id === productionCitationMaterializationResultId(input), "Production citation materialization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ PRODUCTION_CITATION_MATERIALIZATION_SCHEMA_VERSION, PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT, PRODUCTION_CITATION_MATERIALIZATION_ACTIONS, productionCitationId, productionCitationMaterializationResultId, validateProductionCitationDefinition, validateProductionCitationMaterializationResult });
