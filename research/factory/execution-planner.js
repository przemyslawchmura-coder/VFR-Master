// NON-PRODUCTION deterministic GapPlan-to-orchestrator execution planner.
"use strict";

const foundation = require("./contracts.js");
const { evaluateReadiness } = require("./readiness.js");
const plannerContracts = require("./planner-contracts.js");
const orchestrator = require("./orchestrator.js");
const json = require("./json.js");
const { comparePriority, priorityTuple } = require("./priority.js");
const pipeline = require("../lib/batch-research-pipeline.js");

const semanticKey = candidate => `${candidate.prospect.id}|${candidate.capability.operation}`;
const same = (a, b) => json.canonicalSerialize(a) === json.canonicalSerialize(b);
function uniqueRecords(records, idOf, label) {
  const map = new Map();
  records.forEach(record => {
    const id = idOf(record);
    if (map.has(id) && !same(map.get(id), record)) throw new TypeError(`conflicting duplicate ${label}: ${id}`);
    map.set(id, record);
  });
  return map;
}
function needState(gapPlan, field) {
  if (gapPlan.conflictedFields.includes(field)) return "CONFLICT";
  if (gapPlan.researchedNoEvidenceFields.includes(field)) return "RESEARCHED-NO-EVIDENCE";
  return "MISSING";
}
function baseDecision(candidate, decision, reasonCode, extra = {}) {
  return { schemaVersion: plannerContracts.PLANNER_SCHEMA_VERSION, candidateKey: semanticKey(candidate), targetId: candidate.prospect.targetId, prospectId: candidate.prospect.id, operation: candidate.capability.operation, decision, reasonCode, duplicateInputsRemoved: candidate.duplicateInputsRemoved, addressedNeeds: [], ...extra };
}

function planExecution(input) {
  json.assertJsonSafe(input);
  const policy = plannerContracts.validatePlanningPolicy(input.policy);
  const targets = input.targets.map(foundation.validateResearchTarget);
  const targetMap = uniqueRecords(targets, target => target.id, "ResearchTarget");
  const gapPlans = input.gapPlans.map(plan => foundation.validateGapPlan(plan, pipeline.serviceCoreFields));
  const gapMap = uniqueRecords(gapPlans, plan => plan.targetId, "GapPlan");
  targetMap.forEach((target, id) => { if (!gapMap.has(id)) throw new TypeError(`GapPlan missing for target ${id}`); });

  const normalized = input.candidates.map(candidate => {
    const prospect = foundation.validateSourceProspect(candidate.prospect);
    const capability = plannerContracts.validateSourceCapability(candidate.capability);
    if (capability.prospectId !== prospect.id) throw new TypeError("SourceCapability prospect identity mismatch");
    if (!Number.isInteger(candidate.maxAttempts) || candidate.maxAttempts < 1 || candidate.maxAttempts > policy.maxAttemptsPerSourceWorkItem) throw new TypeError("candidate maxAttempts exceeds PlanningPolicy");
    const target = targetMap.get(prospect.targetId);
    json.assertJsonSafe(candidate.readiness);
    const readiness = target ? evaluateReadiness(target, prospect) : json.immutableClone(candidate.readiness);
    if (target && !same(readiness, candidate.readiness)) throw new TypeError(`Foundation readiness input mismatch for ${prospect.id}`);
    return { prospect, capability, readiness, maxAttempts: candidate.maxAttempts, duplicateInputsRemoved: 0 };
  });
  const candidateMap = new Map();
  normalized.forEach(candidate => {
    const key = semanticKey(candidate);
    if (candidateMap.has(key)) {
      const current = candidateMap.get(key);
      const comparable = value => ({ prospect: value.prospect, capability: value.capability, readiness: value.readiness, maxAttempts: value.maxAttempts });
      if (!same(comparable(current), comparable(candidate))) throw new TypeError(`conflicting duplicate planning candidate: ${key}`);
      current.duplicateInputsRemoved += 1;
    } else candidateMap.set(key, candidate);
  });

  const decisions = []; const eligibleByTarget = new Map();
  [...candidateMap.values()].sort((a, b) => semanticKey(a).localeCompare(semanticKey(b))).forEach(candidate => {
    const target = targetMap.get(candidate.prospect.targetId);
    if (!target) { decisions.push(baseDecision(candidate, "REJECTED", "TARGET_NOT_IN_PLAN")); return; }
    const gapPlan = gapMap.get(target.id);
    if (!candidate.readiness.passed) {
      if (candidate.readiness.classification === "REJECTED-MISMATCH") decisions.push(baseDecision(candidate, "REJECTED", "FOUNDATION_REJECTED_MISMATCH"));
      else if (candidate.readiness.classification === "EXHAUSTED / LOW-MARGINAL-YIELD") decisions.push(baseDecision(candidate, "DEFERRED", "FOUNDATION_EXHAUSTED"));
      else decisions.push(baseDecision(candidate, "BLOCKED", "FOUNDATION_READINESS_BLOCKED"));
      return;
    }
    if (candidate.capability.state === "UNKNOWN") { decisions.push(baseDecision(candidate, "DEFERRED", "CAPABILITY_UNKNOWN")); return; }
    if (!policy.sourceClassPriority.includes(candidate.prospect.documentClass)) { decisions.push(baseDecision(candidate, "DEFERRED", "SOURCE_CLASS_NOT_ALLOWED")); return; }
    if (!policy.sourceTierPriority.includes(candidate.prospect.sourceTier)) { decisions.push(baseDecision(candidate, "DEFERRED", "SOURCE_TIER_NOT_ALLOWED")); return; }
    const remaining = new Set(gapPlan.remainingFields);
    const addressedFields = candidate.capability.fieldIds.filter(field => remaining.has(field));
    if (!addressedFields.length) { decisions.push(baseDecision(candidate, "NOT-NEEDED", "NO_UNRESOLVED_GAP")); return; }
    const enriched = { ...candidate, target, gapPlan, addressedFields };
    if (!eligibleByTarget.has(target.id)) eligibleByTarget.set(target.id, []);
    eligibleByTarget.get(target.id).push(enriched);
  });

  const selected = [];
  [...eligibleByTarget.keys()].sort().forEach(targetId => {
    const ranked = eligibleByTarget.get(targetId).sort((a, b) => comparePriority(a, b, policy));
    ranked.forEach((candidate, index) => {
      const addressedNeeds = candidate.addressedFields.map(fieldId => ({ fieldId, state: needState(candidate.gapPlan, fieldId) }));
      if (index >= policy.maxSourceWorkItemsPerTarget) decisions.push(baseDecision(candidate, "DEFERRED", "TARGET_WORK_LIMIT", { addressedNeeds, priority: priorityTuple(candidate, policy) }));
      else selected.push(candidate);
    });
  });

  const bins = [];
  selected.sort((a, b) => a.target.id.localeCompare(b.target.id) || comparePriority(a, b, policy)).forEach(candidate => {
    let bin = bins.find(item => item.items.length < policy.maxWorkItemsPerBatch && item.attempts + candidate.maxAttempts <= policy.maxTotalAttemptsPerBatch && (item.targetIds.has(candidate.target.id) || item.targetIds.size < policy.maxTargetsPerBatch));
    if (!bin) { bin = { items: [], targetIds: new Set(), attempts: 0 }; bins.push(bin); }
    bin.items.push(candidate); bin.targetIds.add(candidate.target.id); bin.attempts += candidate.maxAttempts;
  });

  const batches = bins.map((bin, index) => {
    const batchTargets = [...bin.targetIds].sort().map(id => targetMap.get(id));
    const built = orchestrator.createResearchBatch({ purpose: `${policy.batchPurpose}.part-${index + 1}`, policyId: policy.id, targets: batchTargets, maxAttemptsPerWorkItem: policy.maxAttemptsPerSourceWorkItem });
    const targetWorks = batchTargets.map(target => orchestrator.createTargetWork(built.batch, target));
    const targetWorkMap = new Map(targetWorks.map(item => [item.targetId, item]));
    const sourceWorkItems = bin.items.map(candidate => orchestrator.createSourceWorkItem({ batch: built.batch, targetWork: targetWorkMap.get(candidate.target.id), target: candidate.target, prospect: candidate.prospect, operation: candidate.capability.operation, maxAttempts: candidate.maxAttempts })).sort((a, b) => a.id.localeCompare(b.id));
    bin.items.forEach(candidate => {
      const sourceWork = sourceWorkItems.find(item => item.prospectId === candidate.prospect.id && item.operation === candidate.capability.operation);
      decisions.push(baseDecision(candidate, "PLANNED", "PLANNED_GAP_MATCH", { addressedNeeds: candidate.addressedFields.map(fieldId => ({ fieldId, state: needState(candidate.gapPlan, fieldId) })), priority: priorityTuple(candidate, policy), batchId: built.batch.id, targetWorkId: targetWorkMap.get(candidate.target.id).id, sourceWorkItemId: sourceWork.id }));
    });
    return { batch: built.batch, targetWorks, sourceWorkItems, plannedAttempts: bin.attempts };
  });

  const orderedDecisions = decisions.sort((a, b) => a.candidateKey.localeCompare(b.candidateKey));
  const counts = Object.fromEntries(plannerContracts.PLANNING_DECISIONS.map(state => [state, orderedDecisions.filter(item => item.decision === state).length]));
  return plannerContracts.validateExecutionPlan({ schemaVersion: plannerContracts.PLANNER_SCHEMA_VERSION, policy, summary: { targetsConsidered: targetMap.size, gapsConsidered: [...gapMap.values()].reduce((sum, plan) => sum + plan.remainingFields.length, 0), prospectsConsidered: candidateMap.size, duplicateCandidateInputsRemoved: normalized.length - candidateMap.size, batchesProduced: batches.length, workItemsProduced: batches.reduce((sum, batch) => sum + batch.sourceWorkItems.length, 0), plannedAttempts: batches.reduce((sum, batch) => sum + batch.plannedAttempts, 0), decisionCounts: counts }, decisions: orderedDecisions, batches });
}

module.exports = Object.freeze({ planExecution, needState });
