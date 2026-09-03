// NON-PRODUCTION pure rollback/governance readiness projection.
"use strict";

const contracts = require("./rollback-governance-contracts.js");
const json = require("./json.js");

function buildRollbackGovernanceRecord(input) {
  const before = json.canonicalSerialize(input);
  const blockers = [];
  if (!input || !input.profileIdentity || !input.profileIdentity.profileId) blockers.push("PROFILE-IDENTITY-INCOMPLETE");
  if (!input || !input.sourceIdentity || !input.sourceIdentity.documentId || !input.sourceIdentity.citationIds) blockers.push("SOURCE-IDENTITY-INCOMPLETE");
  if (!input || !Array.isArray(input.prePromotionRegistryIds) || !Array.isArray(input.postPromotionRegistryIds) || !Array.isArray(input.currentRegistryIds)) blockers.push("REGISTRY-STATE-INCOMPLETE");
  if (input && JSON.stringify(input.currentRegistryIds) !== JSON.stringify(input.postPromotionRegistryIds)) blockers.push("CURRENT-REGISTRY-DOES-NOT-MATCH-POST-PROMOTION");
  if (input && (!input.productionFilesRetained || !input.citationsRetained || !input.evidenceRetained || !input.reviewConversionAuthorizationHistoryRetained)) blockers.push("RETAINED-ARTIFACTS-INCOMPLETE");
  const result = { ...input, schemaVersion: contracts.ROLLBACK_GOVERNANCE_SCHEMA_VERSION, id: "placeholder", rollbackEligible: blockers.length === 0, rollbackActionScope: contracts.ROLLBACK_ACTION_SCOPE, rollbackBlockers: [...new Set(blockers)].sort(), actualRollbackExecuted: false };
  result.id = contracts.semanticId(result);
  const validated = contracts.validateRollbackGovernanceRecord(result);
  if (json.canonicalSerialize(input) !== before) throw new Error("Rollback governance projection mutated input");
  return validated;
}

module.exports = Object.freeze({ buildRollbackGovernanceRecord });
