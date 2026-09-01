// NON-PRODUCTION execution-planner contracts.
"use strict";

const crypto = require("node:crypto");
const pipeline = require("../lib/batch-research-pipeline.js");
const json = require("./json.js");

const PLANNER_SCHEMA_VERSION = 1;
const PLANNING_DECISIONS = Object.freeze(["PLANNED", "DEFERRED", "REJECTED", "BLOCKED", "NOT-NEEDED"]);
const DECISION_REASONS = Object.freeze(["PLANNED_GAP_MATCH", "TARGET_NOT_IN_PLAN", "FOUNDATION_REJECTED_MISMATCH", "FOUNDATION_EXHAUSTED", "FOUNDATION_READINESS_BLOCKED", "CAPABILITY_UNKNOWN", "SOURCE_CLASS_NOT_ALLOWED", "SOURCE_TIER_NOT_ALLOWED", "NO_UNRESOLVED_GAP", "TARGET_WORK_LIMIT"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const uniqueSorted = values => [...new Set(values)].sort();
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);
const policyIdentity = record => ({ batchPurpose: record.batchPurpose, maxAttemptsPerSourceWorkItem: record.maxAttemptsPerSourceWorkItem, maxSourceWorkItemsPerTarget: record.maxSourceWorkItemsPerTarget, maxWorkItemsPerBatch: record.maxWorkItemsPerBatch, maxTargetsPerBatch: record.maxTargetsPerBatch, maxTotalAttemptsPerBatch: record.maxTotalAttemptsPerBatch, sourceClassPriority: record.sourceClassPriority, sourceTierPriority: record.sourceTierPriority, practicalFieldIds: record.practicalFieldIds });

function validatePlanningPolicy(input) {
  assert(input && input.schemaVersion === PLANNER_SCHEMA_VERSION, `planner schemaVersion must equal ${PLANNER_SCHEMA_VERSION}`);
  const record = json.clone(input);
  assert(typeof record.batchPurpose === "string" && record.batchPurpose.length, "PlanningPolicy.batchPurpose is required");
  ["maxAttemptsPerSourceWorkItem", "maxSourceWorkItemsPerTarget", "maxWorkItemsPerBatch", "maxTargetsPerBatch", "maxTotalAttemptsPerBatch"].forEach(field => assert(Number.isInteger(record[field]) && record[field] > 0, `PlanningPolicy.${field} must be positive`));
  assert(record.maxWorkItemsPerBatch >= record.maxTargetsPerBatch, "PlanningPolicy must allow at least one work item per target");
  assert(record.maxTotalAttemptsPerBatch >= record.maxAttemptsPerSourceWorkItem, "PlanningPolicy total attempt budget is too small");
  assert(Array.isArray(record.sourceClassPriority) && record.sourceClassPriority.length && record.sourceClassPriority.every(value => typeof value === "string" && value.length), "PlanningPolicy.sourceClassPriority is required");
  assert(Array.isArray(record.sourceTierPriority) && record.sourceTierPriority.length && record.sourceTierPriority.every(value => ["A", "B", "C", "D"].includes(value)), "PlanningPolicy.sourceTierPriority is invalid");
  const allowedFields = new Set(pipeline.serviceCoreFields);
  assert(Array.isArray(record.practicalFieldIds) && record.practicalFieldIds.every(field => allowedFields.has(field)), "PlanningPolicy.practicalFieldIds contains a non-Service-Core field");
  record.sourceClassPriority = uniqueSorted(record.sourceClassPriority).sort((a, b) => input.sourceClassPriority.indexOf(a) - input.sourceClassPriority.indexOf(b));
  record.sourceTierPriority = uniqueSorted(record.sourceTierPriority).sort((a, b) => input.sourceTierPriority.indexOf(a) - input.sourceTierPriority.indexOf(b));
  record.practicalFieldIds = uniqueSorted(record.practicalFieldIds);
  const expectedId = `planner-policy.${digest(policyIdentity(record))}`;
  if (record.id !== undefined) assert(record.id === expectedId, "PlanningPolicy.id does not match policy semantics");
  record.id = expectedId;
  return json.immutableClone(record);
}

function validateSourceCapability(input) {
  assert(input && input.schemaVersion === PLANNER_SCHEMA_VERSION, `planner schemaVersion must equal ${PLANNER_SCHEMA_VERSION}`);
  assert(typeof input.prospectId === "string" && input.prospectId.length, "SourceCapability.prospectId is required");
  assert(typeof input.operation === "string" && input.operation.length, "SourceCapability.operation is required");
  assert(["KNOWN", "UNKNOWN"].includes(input.state), "SourceCapability.state is invalid");
  const fields = input.fieldIds === undefined ? [] : input.fieldIds;
  const allowedFields = new Set(pipeline.serviceCoreFields);
  assert(Array.isArray(fields) && fields.every(field => allowedFields.has(field)), "SourceCapability.fieldIds contains a non-Service-Core field");
  if (input.state === "KNOWN") assert(fields.length > 0, "KNOWN SourceCapability requires fields");
  if (input.state === "UNKNOWN") assert(fields.length === 0, "UNKNOWN SourceCapability cannot claim fields");
  return json.immutableClone({ schemaVersion: PLANNER_SCHEMA_VERSION, prospectId: input.prospectId, operation: input.operation, state: input.state, fieldIds: uniqueSorted(fields) });
}

function validateExecutionPlan(record) {
  assert(record && record.schemaVersion === PLANNER_SCHEMA_VERSION, `planner schemaVersion must equal ${PLANNER_SCHEMA_VERSION}`);
  assert(record.policy && record.policy.id, "ExecutionPlan.policy is required");
  assert(Array.isArray(record.decisions) && record.decisions.every(item => PLANNING_DECISIONS.includes(item.decision) && DECISION_REASONS.includes(item.reasonCode)), "ExecutionPlan decisions are invalid");
  assert(Array.isArray(record.batches), "ExecutionPlan.batches is required");
  json.assertJsonSafe(record);
  return json.immutableClone(record);
}

module.exports = Object.freeze({ PLANNER_SCHEMA_VERSION, PLANNING_DECISIONS, DECISION_REASONS, validatePlanningPolicy, validateSourceCapability, validateExecutionPlan });
