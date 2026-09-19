// GENERIC production Technical Profile container materialization result contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const identity = require("./technical-profile-identity-reference-contracts.js");

const SCHEMA_VERSION = 1;
const ACTIONS = Object.freeze(["CREATED", "REUSED"]);
const fields = new Set(["schemaVersion", "id", "productionMaterializationAuthorizationId", "productionAuthorizationId", "humanDecisionId", "action", "profileIdentity", "profileIdentityReference", "productionProfileId", "productionProfilePath", "productionProfile", "productionCreated", "registryMembership"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function productionTechnicalProfileContainerMaterializationResultId(input) {
  return `production-technical-profile-container-materialization.${crypto.createHash("sha256").update(json.canonicalSerialize({ authorizationId: input.productionMaterializationAuthorizationId, productionAuthorizationId: input.productionAuthorizationId, profileIdentity: input.profileIdentity, productionProfileId: input.productionProfileId, productionProfilePath: input.productionProfilePath, productionProfile: input.productionProfile })).digest("hex").slice(0, 24)}`;
}

function validateProductionTechnicalProfileContainerMaterializationResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_VERSION, "Technical Profile container materialization schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `Technical Profile container materialization.${field} is unsupported`));
  assert(typeof input.id === "string" && /^production-technical-profile-container-materialization\.[a-f0-9]{24}$/.test(input.id), "Technical Profile container materialization.id is invalid");
  assert(ACTIONS.includes(input.action), "Technical Profile container materialization action is invalid");
  identity.validateTechnicalProfileDefinitionRef(input.profileIdentityReference);
  assert(typeof input.productionProfileId === "string" && input.productionProfileId.length > 0 && typeof input.productionProfilePath === "string" && input.productionProfilePath.length > 0, "Technical Profile container production identity is incomplete");
  assert(input.productionProfile && typeof input.productionProfile === "object" && input.productionProfile.id === input.productionProfileId, "Technical Profile container is incomplete");
  assert(input.registryMembership === "NOT-REGISTERED", "Technical Profile container cannot claim registry membership");
  assert(typeof input.productionCreated === "boolean" && input.productionCreated === (input.action === "CREATED"), "Technical Profile container creation state is invalid");
  assert(input.id === productionTechnicalProfileContainerMaterializationResultId(input), "Technical Profile container materialization.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ SCHEMA_VERSION, ACTIONS, productionTechnicalProfileContainerMaterializationResultId, validateProductionTechnicalProfileContainerMaterializationResult });
