// NON-PRODUCTION single-process orchestration record construction.
"use strict";

const foundation = require("./contracts.js");
const { evaluateReadiness } = require("./readiness.js");
const ids = require("./ids.js");
const contracts = require("./orchestrator-contracts.js");

function createResearchBatch({ purpose, policyId, targets, maxAttemptsPerWorkItem }) {
  if (!Array.isArray(targets) || !targets.length) throw new TypeError("canonical ResearchTargets are required");
  const canonicalTargets = targets.map(foundation.validateResearchTarget);
  const targetIds = [...new Set(canonicalTargets.map(target => target.id))].sort();
  if (targetIds.length !== canonicalTargets.length) throw new TypeError("duplicate ResearchTarget identity");
  const id = ids.batchId({ purpose, policyId, targetIds, maxAttemptsPerWorkItem });
  const batch = contracts.validateResearchBatch({ schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, id, purpose, policyId, targetIds, maxAttemptsPerWorkItem, foundationContractVersion: foundation.FACTORY_CONTRACT_VERSION });
  return Object.freeze({ batch, targets: Object.freeze(canonicalTargets) });
}

function createTargetWork(batch, target, required = true) {
  const canonicalBatch = contracts.validateResearchBatch(batch);
  const canonicalTarget = foundation.validateResearchTarget(target);
  if (!canonicalBatch.targetIds.includes(canonicalTarget.id)) throw new TypeError("ResearchTarget is outside batch identity");
  return contracts.validateTargetWork({ schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, id: ids.targetWorkId({ batchId: canonicalBatch.id, targetId: canonicalTarget.id }), batchId: canonicalBatch.id, targetId: canonicalTarget.id, required });
}

function createSourceWorkItem({ batch, targetWork, target, prospect, operation, maxAttempts }) {
  const canonicalBatch = contracts.validateResearchBatch(batch);
  const canonicalTargetWork = contracts.validateTargetWork(targetWork);
  const canonicalTarget = foundation.validateResearchTarget(target);
  const canonicalProspect = foundation.validateSourceProspect(prospect);
  if (canonicalTargetWork.batchId !== canonicalBatch.id || canonicalTargetWork.targetId !== canonicalTarget.id || canonicalProspect.targetId !== canonicalTarget.id) throw new TypeError("source work Foundation identity mismatch");
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > canonicalBatch.maxAttemptsPerWorkItem) throw new TypeError("source work attempts exceed bounded batch policy");
  const readiness = evaluateReadiness(canonicalTarget, canonicalProspect);
  const identity = { targetWorkId: canonicalTargetWork.id, prospectId: canonicalProspect.id, operation };
  return contracts.validateSourceWorkItem({ schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, id: ids.sourceWorkId(identity), ...identity, maxAttempts, readiness });
}

function createResearchAttempt(sourceWork, ordinal) {
  const canonical = contracts.validateSourceWorkItem(sourceWork);
  return contracts.validateResearchAttempt({ schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, id: ids.attemptId({ sourceWorkId: canonical.id, ordinal }), sourceWorkId: canonical.id, ordinal });
}

module.exports = Object.freeze({ createResearchBatch, createTargetWork, createSourceWorkItem, createResearchAttempt });
