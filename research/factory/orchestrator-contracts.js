// NON-PRODUCTION Technical Research Factory orchestration contracts.
"use strict";

const foundation = require("./contracts.js");
const json = require("./json.js");

const ORCHESTRATOR_SCHEMA_VERSION = 1;
const BATCH_STATES = Object.freeze(["PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "BLOCKED"]);
const WORK_STATES = Object.freeze(["PLANNED", "READY", "IN_PROGRESS", "BLOCKED", "EXHAUSTED", "DEFERRED", "COMPLETED", "REJECTED"]);
const ATTEMPT_STATES = Object.freeze(["IN_PROGRESS", "COMPLETED", "FAILED", "BLOCKED", "EXHAUSTED"]);
const EVENT_TYPES = Object.freeze(["batch-created", "target-added", "source-work-created", "attempt-started", "attempt-completed", "attempt-failed", "attempt-blocked", "attempt-exhausted", "work-deferred", "checkpoint-created", "batch-paused", "batch-resumed", "batch-completed"]);
const idPattern = /^[a-z][a-z-]*\.[a-f0-9]{24}$/;
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertVersion = record => assert(record && record.schemaVersion === ORCHESTRATOR_SCHEMA_VERSION, `orchestrator schemaVersion must equal ${ORCHESTRATOR_SCHEMA_VERSION}`);
const assertId = (value, kind) => assert(typeof value === "string" && idPattern.test(value) && value.startsWith(`${kind}.`), `${kind} ID is invalid`);

function validateResearchBatch(record) {
  assertVersion(record); assertId(record.id, "batch");
  assert(typeof record.purpose === "string" && record.purpose.length, "ResearchBatch.purpose is required");
  assert(typeof record.policyId === "string" && record.policyId.length, "ResearchBatch.policyId is required");
  assert(Array.isArray(record.targetIds) && record.targetIds.length > 0 && record.targetIds.every(value => typeof value === "string" && value.length), "ResearchBatch.targetIds are required");
  assert(Number.isInteger(record.maxAttemptsPerWorkItem) && record.maxAttemptsPerWorkItem > 0, "ResearchBatch.maxAttemptsPerWorkItem must be positive");
  assert(record.foundationContractVersion === foundation.FACTORY_CONTRACT_VERSION, "ResearchBatch Foundation contract version is incompatible");
  return json.immutableClone(record);
}
function validateTargetWork(record) {
  assertVersion(record); assertId(record.id, "target-work"); assertId(record.batchId, "batch");
  assert(typeof record.targetId === "string" && record.targetId.length, "TargetWork.targetId is required");
  assert(typeof record.required === "boolean", "TargetWork.required must be boolean");
  return json.immutableClone(record);
}
function validateSourceWorkItem(record) {
  assertVersion(record); assertId(record.id, "source-work"); assertId(record.targetWorkId, "target-work");
  assert(typeof record.prospectId === "string" && record.prospectId.length, "SourceWorkItem.prospectId is required");
  assert(typeof record.operation === "string" && record.operation.length, "SourceWorkItem.operation is required");
  assert(Number.isInteger(record.maxAttempts) && record.maxAttempts > 0, "SourceWorkItem.maxAttempts must be positive");
  assert(record.readiness && typeof record.readiness.passed === "boolean" && foundation.READINESS.includes(record.readiness.classification), "SourceWorkItem Foundation readiness is invalid");
  return json.immutableClone(record);
}
function validateResearchAttempt(record) {
  assertVersion(record); assertId(record.id, "attempt"); assertId(record.sourceWorkId, "source-work");
  assert(Number.isInteger(record.ordinal) && record.ordinal > 0, "ResearchAttempt.ordinal must be positive");
  if (record.state !== undefined) assert(ATTEMPT_STATES.includes(record.state), "ResearchAttempt.state is invalid");
  return json.immutableClone(record);
}
function validateResearchEvent(record) {
  assertVersion(record); assertId(record.id, "event"); assertId(record.batchId, "batch");
  assert(Number.isInteger(record.sequence) && record.sequence > 0, "ResearchEvent.sequence must be positive");
  assert(EVENT_TYPES.includes(record.type), "ResearchEvent.type is invalid");
  json.assertJsonSafe(record.payload);
  return json.immutableClone(record);
}
function validateCheckpoint(record) {
  assertVersion(record); assertId(record.id, "checkpoint"); assertId(record.batchId, "batch");
  assert(record.foundationContractVersion === foundation.FACTORY_CONTRACT_VERSION, "Checkpoint Foundation contract version is incompatible");
  assert(Number.isInteger(record.eventCount) && record.eventCount > 0, "Checkpoint.eventCount must be positive");
  assert(typeof record.eventDigest === "string" && /^[a-f0-9]{64}$/.test(record.eventDigest), "Checkpoint.eventDigest is invalid");
  assert(typeof record.snapshotDigest === "string" && /^[a-f0-9]{64}$/.test(record.snapshotDigest), "Checkpoint.snapshotDigest is invalid");
  json.assertJsonSafe(record.snapshot);
  return json.immutableClone(record);
}
function validateResearchSnapshot(record) {
  assertVersion(record);
  assert(record.foundationContractVersion === foundation.FACTORY_CONTRACT_VERSION, "ResearchSnapshot Foundation contract version is incompatible");
  assert(record.batch && BATCH_STATES.includes(record.batch.state), "ResearchSnapshot batch state is invalid");
  assert(Array.isArray(record.targets) && record.targets.every(item => WORK_STATES.includes(item.state)), "ResearchSnapshot targets are invalid");
  assert(Array.isArray(record.sourceWorkItems) && record.sourceWorkItems.every(item => WORK_STATES.includes(item.state)), "ResearchSnapshot source work is invalid");
  assert(Array.isArray(record.attempts) && record.attempts.every(item => ATTEMPT_STATES.includes(item.state)), "ResearchSnapshot attempts are invalid");
  assert(Number.isInteger(record.eventCount) && record.eventCount > 0, "ResearchSnapshot.eventCount must be positive");
  return json.immutableClone(record);
}

module.exports = Object.freeze({ ORCHESTRATOR_SCHEMA_VERSION, BATCH_STATES, WORK_STATES, ATTEMPT_STATES, EVENT_TYPES, validateResearchBatch, validateTargetWork, validateSourceWorkItem, validateResearchAttempt, validateResearchEvent, validateResearchSnapshot, validateCheckpoint });
