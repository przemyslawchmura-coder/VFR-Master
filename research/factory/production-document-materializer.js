// GENERIC explicit production-document executor. No automatic cascade.
"use strict";

const authorizationContracts = require("./production-materialization-authorization-contracts.js");
const requirementsContracts = require("./materialization-requirements-contracts.js");
const refs = require("./materialization-input-reference-contracts.js");
const contracts = require("./production-document-materializer-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const nonEmpty = value => typeof value === "string" && value.length > 0;

function assertAuthorizationInput(authorization, inputs) {
  const validated = authorizationContracts.validateProductionMaterializationAuthorization(authorization);
  assert(validated.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && validated.materializationAllowed === true, "Production document materializer requires explicit authorization");
  assert(validated.productionCreated === false, "Production document materializer received an already-created authorization");
  assert(validated.humanDecision && validated.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION", "Production document materializer requires an approved human decision");
  assert(inputs && inputs.authorizationId === validated.id, "Production document materializer authorization ID mismatch");
  assert(inputs.requirementType === contracts.PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT, "Production document materializer requirement type mismatch");
  assert(inputs.materializationRequirementsAuthorizationId === validated.materializationRequirementsAuthorizationId, "Production document materializer requirements authorization mismatch");
  assert(inputs.productionAuthorizationId === validated.productionAuthorizationId, "Production document materializer production authorization mismatch");
  const requirement = validated.requirements.find(item => item.type === contracts.PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT);
  assert(requirement && requirement.state === "READY" && requirement.missingInputs.length === 0 && requirement.reasons.length === 0, "Production document materialization requirement is not ready");
  assert(JSON.stringify(requirement.requiredInputs) === JSON.stringify(requirementsContracts.REQUIRED_INPUTS[contracts.PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT]), "Production document materialization required inputs are invalid");
  return validated;
}

function assertReferences(authorization, inputs) {
  assert(inputs.documentDefinitionRef && inputs.sourceProvenanceRef, "Production document materializer requires document and provenance references");
  const compatible = refs.assertCompatibleDocumentAndProvenance(inputs.documentDefinitionRef, inputs.sourceProvenanceRef);
  ["sourceId", "prospectId", "documentId", "authority", "tier"].forEach(field => assert(compatible.document.sourceIdentity[field] === authorization.sourceIdentity[field], `Production document materializer ${field} does not match authorization`));
  assert(inputs.documentDefinitionRef.documentIdentity.documentId === authorization.sourceIdentity.documentId, "Production document materializer document identity does not match authorization");
  return compatible;
}

function materializeProductionDocument(authorization, inputs, store) {
  const validatedAuthorization = assertAuthorizationInput(authorization, inputs);
  const before = json.canonicalSerialize(validatedAuthorization);
  const { document, provenance } = assertReferences(validatedAuthorization, inputs);
  contracts.validateProductionDocumentDefinition(inputs.productionDocument);
  const expectedDocumentId = contracts.productionDocumentId(document, provenance);
  assert(inputs.productionDocument.id === expectedDocumentId, "Production document identity is not derived from the validated references");
  assert(inputs.productionDocument.manufacturer === document.documentIdentity.authority, "Production document manufacturer does not match source authority");
  assert(inputs.productionDocument.publicationId === document.documentIdentity.publicationId, "Production document publication identity does not match source");
  assert(inputs.productionDocument.url === document.documentIdentity.officialPath, "Production document URL does not match source");
  assert(store && typeof store.findByDocumentId === "function" && typeof store.createDocument === "function", "Production document materializer requires an explicit document store");
  const existing = store.findByDocumentId(expectedDocumentId);
  let action;
  if (existing === null || existing === undefined) {
    store.createDocument(json.immutableClone(inputs.productionDocument));
    action = "CREATED";
  } else {
    const existingValidated = contracts.validateProductionDocumentDefinition(existing);
    assert(json.canonicalSerialize(existingValidated) === json.canonicalSerialize(inputs.productionDocument), "Existing production document conflicts with authorized content");
    action = "REUSED";
  }
  const result = {
    schemaVersion: contracts.PRODUCTION_DOCUMENT_MATERIALIZATION_SCHEMA_VERSION,
    id: "placeholder",
    productionMaterializationAuthorizationId: validatedAuthorization.id,
    materializationRequirementsAuthorizationId: validatedAuthorization.materializationRequirementsAuthorizationId,
    productionAuthorizationId: validatedAuthorization.productionAuthorizationId,
    humanDecisionId: validatedAuthorization.humanDecision.id,
    requirementType: contracts.PRODUCTION_DOCUMENT_MATERIALIZATION_REQUIREMENT,
    action,
    productionDocumentId: expectedDocumentId,
    productionDocumentReference: { documentId: expectedDocumentId, registryKey: expectedDocumentId },
    productionDocument: inputs.productionDocument,
    sourceIdentity: document.sourceIdentity,
    sourceProvenanceReferenceId: provenance.id,
    targetIdentity: validatedAuthorization.targetIdentity,
    targetApplicability: validatedAuthorization.targetApplicability,
    productionCreated: action === "CREATED"
  };
  result.id = contracts.productionDocumentMaterializationResultId(result);
  const validatedResult = contracts.validateProductionDocumentMaterializationResult(result);
  assert(json.canonicalSerialize(validatedAuthorization) === before, "Production document materializer mutated authorization");
  return validatedResult;
}

module.exports = Object.freeze({ materializeProductionDocument });
