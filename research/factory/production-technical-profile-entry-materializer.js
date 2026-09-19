// GENERIC explicit Technical Profile entry executor. No registry cascade.
"use strict";

const authorizationContracts = require("./production-materialization-authorization-contracts.js");
const requirementsContracts = require("./materialization-requirements-contracts.js");
const refs = require("./technical-profile-entry-reference-contracts.js");
const citationContracts = require("./production-citation-materializer-contracts.js");
const contracts = require("./production-technical-profile-entry-materializer-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function validateAuthorization(authorization, inputs) {
  const validated = authorizationContracts.validateProductionMaterializationAuthorization(authorization);
  assert(validated.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && validated.materializationAllowed === true && validated.productionCreated === false, "Technical Profile entry materializer requires explicit authorization");
  assert(validated.humanDecision && validated.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION", "Technical Profile entry materializer requires an approved human decision");
  assert(inputs && inputs.authorizationId === validated.id, "Technical Profile entry materializer authorization ID mismatch");
  assert(inputs.materializationRequirementsAuthorizationId === validated.materializationRequirementsAuthorizationId, "Technical Profile entry materializer requirements authorization mismatch");
  assert(inputs.productionAuthorizationId === validated.productionAuthorizationId, "Technical Profile entry materializer production authorization mismatch");
  assert(inputs.requirementType === contracts.PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT, "Technical Profile entry materializer requirement type mismatch");
  const requirement = validated.requirements.find(item => item.type === contracts.PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT);
  assert(requirement && requirement.state === "READY" && requirement.missingInputs.length === 0 && requirement.reasons.length === 0, "Technical Profile entry materialization requirement is not ready");
  assert(JSON.stringify(requirement.requiredInputs) === JSON.stringify(requirementsContracts.REQUIRED_INPUTS[contracts.PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT]), "Technical Profile entry materialization required inputs are invalid");
  return validated;
}

function materializeProductionTechnicalProfileEntry(authorization, inputs, store) {
  const validatedAuthorization = validateAuthorization(authorization, inputs);
  const before = json.canonicalSerialize(validatedAuthorization);
  assert(inputs.profileDefinitionRef && inputs.profileEntryDefinitionRef && inputs.citationDefinitionRef, "Technical Profile entry materializer requires typed references");
  const compatible = refs.assertCompatibleTechnicalProfileEntry(inputs.profileDefinitionRef, inputs.profileEntryDefinitionRef, inputs.citationDefinitionRef, validatedAuthorization.productionAuthorizationId);
  assert(json.canonicalSerialize(compatible.entry.value) === json.canonicalSerialize(validatedAuthorization.proposedProduction.value), "Technical Profile entry value does not match authorized production value");
  assert(compatible.entry.categoryId === validatedAuthorization.proposedProduction.categoryId && compatible.entry.entryId === validatedAuthorization.proposedProduction.entryId && compatible.entry.entryType === validatedAuthorization.proposedProduction.type, "Technical Profile entry mapping does not match authorized production mapping");
  assert(!validatedAuthorization.lineage.researchCanonicalFieldId || compatible.citation.citationIdentity.canonicalFieldId === validatedAuthorization.lineage.researchCanonicalFieldId, "Technical Profile entry citation field does not match authorization lineage");
  assert(applicabilityIsCompatible(compatible.entry.applicability, validatedAuthorization.targetApplicability), "Technical Profile entry applicability does not match authorization");
  assert(store && typeof store.findProfileByDefinition === "function" && typeof store.findCitationById === "function" && typeof store.findDocumentById === "function" && typeof store.findEntry === "function" && typeof store.createEntry === "function", "Technical Profile entry materializer requires an explicit profile/document/citation store");
  const profile = store.findProfileByDefinition(compatible.profile);
  assert(profile && typeof profile.profileId === "string" && typeof profile.path === "string", "Existing production Technical Profile container is required");
  const productionDocumentId = inputs.productionDocumentId;
  const productionCitationId = inputs.productionCitationId;
  assert(typeof productionDocumentId === "string" && typeof productionCitationId === "string", "Technical Profile entry production source IDs are required");
  const document = store.findDocumentById(productionDocumentId);
  const citation = store.findCitationById(productionCitationId);
  assert(document && citation, "Technical Profile entry production document/citation is missing");
  assert(citation.documentId === productionDocumentId && citation.canonicalFieldId === compatible.citation.citationIdentity.canonicalFieldId, "Technical Profile entry citation binding is incompatible");
  const entry = { id: compatible.entry.entryId, type: compatible.entry.entryType, categoryId: compatible.entry.categoryId, value: compatible.entry.value, applicability: compatible.entry.applicability, status: "verified", sourceIds: [productionCitationId] };
  let action;
  const existing = store.findEntry(profile, entry.id);
  if (existing === null || existing === undefined) { store.createEntry(profile, json.immutableClone(entry)); action = "CREATED"; }
  else { assert(json.canonicalSerialize(existing) === json.canonicalSerialize(entry), "Existing Technical Profile entry conflicts with authorized content"); action = "REUSED"; }
  const result = { schemaVersion: contracts.PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_SCHEMA_VERSION, id: "placeholder", productionMaterializationAuthorizationId: validatedAuthorization.id, materializationRequirementsAuthorizationId: validatedAuthorization.materializationRequirementsAuthorizationId, productionAuthorizationId: validatedAuthorization.productionAuthorizationId, humanDecisionId: validatedAuthorization.humanDecision.id, requirementType: contracts.PRODUCTION_TECHNICAL_PROFILE_ENTRY_MATERIALIZATION_REQUIREMENT, action, profileIdentity: compatible.profile.profileIdentity, productionProfileId: profile.profileId, productionProfilePath: profile.path, productionEntryId: entry.id, productionEntry: entry, productionDocumentId, productionCitationId, sourceIdentity: validatedAuthorization.sourceIdentity, targetIdentity: validatedAuthorization.targetIdentity, targetApplicability: validatedAuthorization.targetApplicability, productionCreated: action === "CREATED" };
  result.id = contracts.productionTechnicalProfileEntryMaterializationResultId(result);
  const validatedResult = contracts.validateProductionTechnicalProfileEntryMaterializationResult(result);
  assert(json.canonicalSerialize(validatedAuthorization) === before, "Technical Profile entry materializer mutated authorization");
  return validatedResult;
}

function applicabilityIsCompatible(entryApplicability, authorizedApplicability) {
  if (!entryApplicability || !authorizedApplicability) return false;
  for (const field of ["modelYear", "market", "transmission", "context"]) {
    if (entryApplicability[field] !== authorizedApplicability[field]) return false;
  }
  if (authorizedApplicability.equipment === "SUFFICIENT") {
    if (entryApplicability.equipment !== "SUFFICIENT" && !(Array.isArray(entryApplicability.equipment) && entryApplicability.equipment.length > 0)) return false;
  } else if (entryApplicability.equipment !== authorizedApplicability.equipment) {
    return false;
  }
  if (authorizedApplicability.abs === "KNOWN") {
    if (entryApplicability.abs !== "KNOWN" && typeof entryApplicability.abs !== "boolean") return false;
  } else if (entryApplicability.abs !== authorizedApplicability.abs) {
    return false;
  }
  return true;
}

module.exports = Object.freeze({ materializeProductionTechnicalProfileEntry });
