// NON-PRODUCTION immutable rollback/governance contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const ROLLBACK_GOVERNANCE_SCHEMA_VERSION = 1;
const ROLLBACK_ACTION_SCOPE = Object.freeze(["REMOVE-EXACT-PROFILE-REGISTRY-EXPOSURE", "RESTORE-PREVIOUS-REGISTERED-PROFILE-SET"]);
const fields = new Set([
  "schemaVersion", "id", "profileIdentity", "registryIdentity", "catalogueVariantKey", "yearRange", "moduleId", "schemaVersionRef",
  "registryStatus", "promotedEntryCount", "promotedEntryIds", "sourceIdentity", "prePromotionRegistryIds", "postPromotionRegistryIds",
  "currentRegistryIds", "rollbackEligible", "rollbackActionScope", "rollbackBlockers", "productionFilesRetained", "citationsRetained",
  "evidenceRetained", "reviewConversionAuthorizationHistoryRetained", "actualRollbackExecuted"
]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const unique = values => Array.isArray(values) && new Set(values).size === values.length;
const semanticId = input => `rollback-governance.${crypto.createHash("sha256").update(json.canonicalSerialize({ profileIdentity: input.profileIdentity, prePromotionRegistryIds: input.prePromotionRegistryIds, postPromotionRegistryIds: input.postPromotionRegistryIds })).digest("hex").slice(0, 24)}`;

function validateRollbackGovernanceRecord(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === ROLLBACK_GOVERNANCE_SCHEMA_VERSION, "RollbackGovernanceRecord schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `RollbackGovernanceRecord.${field} is unsupported`));
  assert(typeof input.id === "string" && /^rollback-governance\.[a-f0-9]{24}$/.test(input.id), "RollbackGovernanceRecord.id is invalid");
  assert(input.profileIdentity && typeof input.profileIdentity.profileId === "string" && input.profileIdentity.profileId.length > 0, "RollbackGovernanceRecord.profileIdentity is incomplete");
  assert(input.registryIdentity && typeof input.registryIdentity.registryName === "string" && input.registryIdentity.registryName.length > 0, "RollbackGovernanceRecord.registryIdentity is incomplete");
  assert(typeof input.catalogueVariantKey === "string" && input.catalogueVariantKey.length > 0, "RollbackGovernanceRecord.catalogueVariantKey is required");
  assert(input.yearRange && Number.isInteger(input.yearRange.from) && Number.isInteger(input.yearRange.to) && input.yearRange.from <= input.yearRange.to, "RollbackGovernanceRecord.yearRange is invalid");
  assert(typeof input.moduleId === "string" && input.moduleId.length > 0, "RollbackGovernanceRecord.moduleId is required");
  assert(typeof input.schemaVersionRef === "string" && input.schemaVersionRef.length > 0, "RollbackGovernanceRecord.schemaVersionRef is required");
  assert(typeof input.registryStatus === "string" && input.registryStatus.length > 0, "RollbackGovernanceRecord.registryStatus is required");
  assert(Number.isInteger(input.promotedEntryCount) && input.promotedEntryCount >= 0 && Array.isArray(input.promotedEntryIds) && input.promotedEntryIds.length === input.promotedEntryCount && unique(input.promotedEntryIds), "RollbackGovernanceRecord promoted entries are invalid");
  assert(input.sourceIdentity && typeof input.sourceIdentity.documentId === "string" && typeof input.sourceIdentity.citationIds === "object" && input.sourceIdentity.citationIds !== null, "RollbackGovernanceRecord.sourceIdentity is incomplete");
  ["prePromotionRegistryIds", "postPromotionRegistryIds", "currentRegistryIds"].forEach(field => assert(Array.isArray(input[field]) && unique(input[field]) && input[field].every(value => typeof value === "string" && value.length > 0), `RollbackGovernanceRecord.${field} is invalid`));
  assert(input.postPromotionRegistryIds.includes(input.profileIdentity.profileId) && !input.prePromotionRegistryIds.includes(input.profileIdentity.profileId), "RollbackGovernanceRecord promoted profile set is inconsistent");
  assert(json.canonicalSerialize(input.currentRegistryIds) === json.canonicalSerialize(input.postPromotionRegistryIds), "RollbackGovernanceRecord current registry does not match post-promotion state");
  assert(Array.isArray(input.rollbackActionScope) && json.canonicalSerialize(input.rollbackActionScope) === json.canonicalSerialize(ROLLBACK_ACTION_SCOPE), "RollbackGovernanceRecord rollback scope is invalid");
  assert(Array.isArray(input.rollbackBlockers) && (input.rollbackEligible === (input.rollbackBlockers.length === 0)), "RollbackGovernanceRecord eligibility/blockers are inconsistent");
  ["productionFilesRetained", "citationsRetained", "evidenceRetained", "reviewConversionAuthorizationHistoryRetained"].forEach(field => assert(input[field] === true, `RollbackGovernanceRecord.${field} must be retained`));
  assert(input.actualRollbackExecuted === false, "RollbackGovernanceRecord cannot execute rollback");
  assert(input.id === semanticId(input), "RollbackGovernanceRecord.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ ROLLBACK_GOVERNANCE_SCHEMA_VERSION, ROLLBACK_ACTION_SCOPE, semanticId, validateRollbackGovernanceRecord });
