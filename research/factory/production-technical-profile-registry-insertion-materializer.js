// GENERIC explicit registry-insertion executor. It never creates profile contents.
"use strict";

const authorizationContracts = require("./production-materialization-authorization-contracts.js");
const registryRefs = require("./registry-input-reference-contracts.js");
const contracts = require("./production-technical-profile-registry-insertion-materializer-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function materializeProductionTechnicalProfileRegistryInsertion(authorization, inputs, store) {
  const validated = authorizationContracts.validateProductionMaterializationAuthorization(authorization);
  assert(validated.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && validated.materializationAllowed === true && validated.productionCreated === false, "Registry insertion requires explicit authorization");
  assert(validated.humanDecision && validated.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION" && validated.humanDecision.materializationRequirementsAuthorizationId === validated.materializationRequirementsAuthorizationId, "Registry insertion human decision is stale or invalid");
  const requirement = validated.requirements.find(item => item.type === "REGISTRY-INSERTION");
  assert(requirement && requirement.state === "READY" && requirement.missingInputs.length === 0 && requirement.reasons.length === 0, "Registry insertion requirement is not ready");
  assert(inputs && inputs.authorizationId === validated.id && inputs.productionAuthorizationId === validated.productionAuthorizationId, "Registry insertion authorization lineage mismatch");
  assert(inputs.requirementType === "REGISTRY-INSERTION", "Registry insertion materializer requires the registry requirement");
  const compatible = registryRefs.assertCompatibleRegistryInputs(inputs.applicabilityRef, inputs.catalogueIdentityRef, inputs.profileDefinitionRef, validated.productionAuthorizationId);
  assert(typeof inputs.productionProfileId === "string" && typeof inputs.productionProfilePath === "string", "Registry insertion production profile identity is incomplete");
  const identity = compatible.profile.profileIdentity;
  assert(inputs.catalogueIdentityRef.targetIdentity.targetId === identity.targetId && inputs.catalogueIdentityRef.targetIdentity.catalogVariantKey === identity.catalogVariantKey, "Registry insertion target identity mismatch");
  const entry = inputs.registryEntry;
  assert(entry && entry.profileId === inputs.productionProfileId && entry.moduleId === inputs.productionProfilePath, "Registry insertion profile identity does not match registry entry");
  assert(entry.catalogVariantKeys.length === 1 && entry.catalogVariantKeys[0] === identity.catalogVariantKey, "Registry insertion catalogue key mismatch");
  assert(entry.years.from === identity.modelYear && entry.years.to === identity.modelYear, "Registry insertion year mismatch");
  assert(store && typeof store.findProfile === "function" && typeof store.findRegistryEntry === "function" && typeof store.createRegistryEntry === "function", "Registry insertion requires an explicit registry store");
  const profile = store.findProfile(inputs.productionProfileId, inputs.productionProfilePath);
  assert(profile && profile.id === inputs.productionProfileId && profile.path === inputs.productionProfilePath, "Registry insertion requires the existing production profile container");
  assert(profile.profile && profile.profile.registryMembership === "NOT-REGISTERED", "Registry insertion profile membership is invalid");
  const before = json.canonicalSerialize(validated);
  const existing = store.findRegistryEntry(entry);
  let action;
  if (existing === null || existing === undefined) {
    store.createRegistryEntry(json.immutableClone(entry));
    action = "CREATED";
  } else {
    assert(json.canonicalSerialize(existing) === json.canonicalSerialize(entry), "Existing registry entry conflicts with authorized identity");
    action = "REUSED";
  }
  const result = {
    schemaVersion: contracts.SCHEMA_VERSION,
    id: "placeholder",
    productionMaterializationAuthorizationId: validated.id,
    materializationRequirementsAuthorizationId: validated.materializationRequirementsAuthorizationId,
    productionAuthorizationId: validated.productionAuthorizationId,
    humanDecisionId: validated.humanDecision.id,
    requirementType: "REGISTRY-INSERTION",
    action,
    registryEntry: entry,
    applicabilityRef: compatible.applicability,
    catalogueIdentityRef: compatible.catalogue,
    profileDefinitionRef: compatible.profile,
    productionProfileId: inputs.productionProfileId,
    productionProfilePath: inputs.productionProfilePath,
    registryMembership: "REGISTERED",
    productionCreated: action === "CREATED"
  };
  result.id = contracts.resultId(result);
  const validatedResult = contracts.validateResult(result);
  assert(json.canonicalSerialize(validated) === before, "Registry insertion materializer mutated authorization");
  return validatedResult;
}

module.exports = Object.freeze({ materializeProductionTechnicalProfileRegistryInsertion });
