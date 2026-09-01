// NON-PRODUCTION bounded execution agent for already-planned source work.
"use strict";

const foundation = require("./contracts.js");
const orchestratorContracts = require("./orchestrator-contracts.js");
const orchestrator = require("./orchestrator.js");
const events = require("./events.js");
const reducer = require("./reducer.js");
const execution = require("./execution-contracts.js");
const json = require("./json.js");

const fail = message => { throw new Error(`execution rejected: ${message}`); };
function bootstrap(planBatch) {
  const batch = orchestratorContracts.validateResearchBatch(planBatch.batch);
  const targetEvents = planBatch.targetWorks.map(targetWork => events.createEvent({ batchId: batch.id, sequence: 2, type: "target-added", payload: { targetWork } }));
  let history = [events.createEvent({ batchId: batch.id, sequence: 1, type: "batch-created", payload: { batch } })];
  targetEvents.forEach(item => { history = events.appendEvent(history, { batchId: batch.id, type: item.type, payload: item.payload }); });
  planBatch.sourceWorkItems.forEach(sourceWork => { history = events.appendEvent(history, { batchId: batch.id, type: "source-work-created", payload: { sourceWork } }); });
  history = events.appendEvent(history, { batchId: batch.id, type: "batch-resumed", payload: {} });
  return history;
}
function executeAttempt(history, workItem, adapter, context = {}) {
  if (!Array.isArray(history) || !history.length) fail("event history is required");
  const snapshot = reducer.reduceEvents(history);
  const work = orchestratorContracts.validateSourceWorkItem(workItem);
  const targetWork = snapshot.targets.find(item => item.id === work.targetWorkId);
  if (!targetWork || targetWork.batchId !== snapshot.batch.id) fail("batch identity mismatch");
  const current = snapshot.sourceWorkItems.find(item => item.id === work.id);
  if (!current) fail("source work is not in the event history");
  if (current.state !== "READY") fail(`source work is not executable: ${current.state}`);
  if (!work.readiness.passed) fail("Foundation readiness does not permit execution");
  if (!adapter || typeof adapter.execute !== "function" || !Array.isArray(adapter.supportedOperations) || !adapter.supportedOperations.includes(work.operation)) fail("adapter does not support requested operation");
  if (adapter.networkRequired || adapter.authenticationRequired && context.authenticationAvailable !== true) fail("required adapter capability is unavailable");
  const attempt = orchestrator.createResearchAttempt(work, current.attemptsUsed + 1);
  let next = events.appendEvent(history, { batchId: snapshot.batch.id, type: "attempt-started", payload: { attempt } });
  const request = execution.validateAcquisitionRequest({ schemaVersion: execution.EXECUTION_SCHEMA_VERSION, batchId: snapshot.batch.id, targetWorkId: work.targetWorkId, sourceWorkItemId: work.id, attemptId: attempt.id, prospectId: work.prospectId, operation: work.operation, adapterId: adapter.adapterId });
  const raw = adapter.execute(request);
  ["batchId", "sourceWorkItemId", "attemptId", "maxAttempts", "readiness", "state"].forEach(field => { if (Object.prototype.hasOwnProperty.call(raw || {}, field)) fail(`adapter outcome cannot supply canonical identity or state: ${field}`); });
  const outcome = execution.validateOutcome(raw);
  const result = execution.validateExecutionResult({ schemaVersion: execution.EXECUTION_SCHEMA_VERSION, batchId: snapshot.batch.id, sourceWorkItemId: work.id, attemptId: attempt.id, adapterId: adapter.adapterId, outcome });
  if (result.batchId !== snapshot.batch.id || result.sourceWorkItemId !== work.id || result.attemptId !== attempt.id) fail("adapter forged execution identity");
  const terminalType = outcome.retryClass === "BLOCKED" ? "attempt-blocked" : outcome.outcome === "TRANSIENT-FAILURE" && current.remainingAttempts === 1 ? "attempt-exhausted" : outcome.outcome === "TRANSIENT-FAILURE" ? "attempt-failed" : outcome.outcome === "PERMANENT-FAILURE" ? "attempt-exhausted" : "attempt-completed";
  next = events.appendEvent(next, { batchId: snapshot.batch.id, type: terminalType, payload: { attemptId: attempt.id, result } });
  return Object.freeze({ result, events: next, snapshot: reducer.reduceEvents(next) });
}

module.exports = Object.freeze({ bootstrap, executeAttempt });
