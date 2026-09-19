// GENERIC explicit production-citation executor. No automatic cascade.
"use strict";

const authorizationContracts = require("./production-materialization-authorization-contracts.js");
const requirementsContracts = require("./materialization-requirements-contracts.js");
const refs = require("./materialization-input-reference-contracts.js");
const contracts = require("./production-citation-materializer-contracts.js");
const documentContracts = require("./production-document-materializer-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function validateAuthorization(authorization, inputs) {
  const validated = authorizationContracts.validateProductionMaterializationAuthorization(authorization);
  assert(validated.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && validated.materializationAllowed === true && validated.productionCreated === false, "Production citation materializer requires explicit authorization");
  assert(validated.humanDecision && validated.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION", "Production citation materializer requires an approved human decision");
  assert(inputs && inputs.authorizationId === validated.id, "Production citation materializer authorization ID mismatch");
  assert(inputs.materializationRequirementsAuthorizationId === validated.materializationRequirementsAuthorizationId, "Production citation materializer requirements authorization mismatch");
  assert(inputs.productionAuthorizationId === validated.productionAuthorizationId, "Production citation materializer production authorization mismatch");
  assert(inputs.requirementType === contracts.PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT, "Production citation materializer requirement type mismatch");
  const requirement = validated.requirements.find(item => item.type === contracts.PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT);
  assert(requirement && requirement.state === "READY" && requirement.missingInputs.length === 0 && requirement.reasons.length === 0, "Production citation materialization requirement is not ready");
  assert(JSON.stringify(requirement.requiredInputs) === JSON.stringify(requirementsContracts.REQUIRED_INPUTS[contracts.PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT]), "Production citation materialization required inputs are invalid");
  return validated;
}

function materializeProductionCitation(authorization, inputs, store) {
  const validatedAuthorization = validateAuthorization(authorization, inputs);
  const before = json.canonicalSerialize(validatedAuthorization);
  assert(inputs.documentDefinitionRef && inputs.citationDefinitionRef && inputs.sourceLocationRef && inputs.sourceProvenanceRef, "Production citation materializer requires all typed references");
  const compatible = refs.assertCompatibleCitationInputs(inputs.citationDefinitionRef, inputs.documentDefinitionRef, inputs.sourceLocationRef);
  const compatibleProvenance = refs.assertCompatibleDocumentAndProvenance(compatible.document, inputs.sourceProvenanceRef);
  assert(compatible.location.sourceProvenanceRefId === compatibleProvenance.provenance.id, "Production citation materializer source provenance mismatch");
  ["sourceId", "prospectId", "documentId", "authority", "tier"].forEach(field => assert(compatible.document.sourceIdentity[field] === validatedAuthorization.sourceIdentity[field], `Production citation materializer ${field} does not match authorization`));
  assert(inputs.citationDefinitionRef.citationIdentity.canonicalFieldId === validatedAuthorization.lineage.researchCanonicalFieldId, "Production citation materializer research field mismatch");
  assert(inputs.productionDocumentId === documentContracts.productionDocumentId(compatible.document, compatibleProvenance.provenance), "Production citation materializer document identity mismatch");
  assert(store && typeof store.findByDocumentId === "function" && typeof store.findByCitationId === "function" && typeof store.createCitation === "function", "Production citation materializer requires an explicit document/citation store");
  assert(store.findByDocumentId(inputs.productionDocumentId), "Production citation materializer production document is missing");
  const citationId = contracts.productionCitationId(inputs.citationDefinitionRef, inputs.sourceLocationRef, inputs.productionDocumentId);
  const location = inputs.sourceLocationRef.sourceLocation;
  const citation = { id: citationId, documentId: inputs.productionDocumentId, canonicalFieldId: inputs.citationDefinitionRef.citationIdentity.canonicalFieldId, section: location.section, subsection: location.tableOrSubsection, pages: location.page === null ? [] : [String(location.page)], locator: location.locator, sourceLocation: location };
  let action;
  const existing = store.findByCitationId(citationId);
  if (existing === null || existing === undefined) { store.createCitation(json.immutableClone(citation)); action = "CREATED"; }
  else { assert(json.canonicalSerialize(existing) === json.canonicalSerialize(citation), "Existing production citation conflicts with authorized content"); action = "REUSED"; }
  const result = { schemaVersion: contracts.PRODUCTION_CITATION_MATERIALIZATION_SCHEMA_VERSION, id: "placeholder", productionMaterializationAuthorizationId: validatedAuthorization.id, materializationRequirementsAuthorizationId: validatedAuthorization.materializationRequirementsAuthorizationId, productionAuthorizationId: validatedAuthorization.productionAuthorizationId, humanDecisionId: validatedAuthorization.humanDecision.id, requirementType: contracts.PRODUCTION_CITATION_MATERIALIZATION_REQUIREMENT, action, productionDocumentId: inputs.productionDocumentId, productionCitationId: citationId, productionCitation: citation, sourceIdentity: compatible.citation.sourceIdentity, sourceProvenanceReferenceId: compatibleProvenance.provenance.id, targetIdentity: validatedAuthorization.targetIdentity, targetApplicability: validatedAuthorization.targetApplicability, productionCreated: action === "CREATED" };
  result.id = contracts.productionCitationMaterializationResultId(result);
  const validatedResult = contracts.validateProductionCitationMaterializationResult(result);
  assert(json.canonicalSerialize(validatedAuthorization) === before, "Production citation materializer mutated authorization");
  return validatedResult;
}

module.exports = Object.freeze({ materializeProductionCitation });
