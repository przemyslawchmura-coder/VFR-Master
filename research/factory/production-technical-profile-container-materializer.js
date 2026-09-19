// GENERIC explicit Technical Profile container executor. Registry insertion is separate.
"use strict";

const authorizationContracts = require("./production-materialization-authorization-contracts.js");
const identity = require("./technical-profile-identity-reference-contracts.js");
const contracts = require("./production-technical-profile-container-materializer-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function materializeProductionTechnicalProfileContainer(authorization, inputs, store) {
  const validated = authorizationContracts.validateProductionMaterializationAuthorization(authorization);
  assert(validated.authorizationState === "AUTHORIZED-FOR-MATERIALIZATION" && validated.materializationAllowed === true && validated.productionCreated === false, "Technical Profile container materializer requires explicit authorization");
  assert(validated.humanDecision && validated.humanDecision.decision === "APPROVE-FOR-MATERIALIZATION", "Technical Profile container materializer requires an approved human decision");
  assert(inputs && inputs.authorizationId === validated.id && inputs.productionAuthorizationId === validated.productionAuthorizationId, "Technical Profile container authorization lineage mismatch");
  const profileDefinitionRef = identity.validateTechnicalProfileDefinitionRef(inputs.profileDefinitionRef);
  assert(store && typeof store.findProfileByDefinition === "function" && typeof store.createProfile === "function", "Technical Profile container materializer requires an explicit profile store");
  assert(inputs.productionProfileId && inputs.productionProfilePath && inputs.productionProfile, "Technical Profile container definition is incomplete");
  assert(inputs.productionProfileId !== profileDefinitionRef.productionProfileId, "Technical Profile container input must not reuse a production profile ID from the non-production reference");
  assert(inputs.productionProfile.registryMembership === "NOT-REGISTERED", "Technical Profile container must remain outside registry membership");
  const before = json.canonicalSerialize(validated);
  let action;
  const existing = store.findProfileByDefinition(profileDefinitionRef);
  if (existing === null || existing === undefined) { store.createProfile({ id: inputs.productionProfileId, path: inputs.productionProfilePath, profile: json.immutableClone(inputs.productionProfile) }); action = "CREATED"; }
  else { assert(json.canonicalSerialize(existing) === json.canonicalSerialize({ id: inputs.productionProfileId, path: inputs.productionProfilePath, profile: inputs.productionProfile }), "Existing Technical Profile container conflicts with authorized content"); action = "REUSED"; }
  const result = { schemaVersion: contracts.SCHEMA_VERSION, id: "placeholder", productionMaterializationAuthorizationId: validated.id, productionAuthorizationId: validated.productionAuthorizationId, humanDecisionId: validated.humanDecision.id, action, profileIdentity: profileDefinitionRef.profileIdentity, profileIdentityReference: profileDefinitionRef, productionProfileId: inputs.productionProfileId, productionProfilePath: inputs.productionProfilePath, productionProfile: inputs.productionProfile, productionCreated: action === "CREATED", registryMembership: "NOT-REGISTERED" };
  result.id = contracts.productionTechnicalProfileContainerMaterializationResultId(result);
  const validatedResult = contracts.validateProductionTechnicalProfileContainerMaterializationResult(result);
  assert(json.canonicalSerialize(validated) === before, "Technical Profile container materializer mutated authorization");
  return validatedResult;
}

module.exports = Object.freeze({ materializeProductionTechnicalProfileContainer });
