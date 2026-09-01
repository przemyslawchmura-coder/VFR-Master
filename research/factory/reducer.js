// NON-PRODUCTION pure deterministic factory event reducer.
"use strict";

const foundation = require("./contracts.js");
const ids = require("./ids.js");
const contracts = require("./orchestrator-contracts.js");
const json = require("./json.js");

const fail = message => { throw new Error(`invalid orchestrator transition: ${message}`); };
const get = (map, id, label) => map.get(id) || fail(`${label} ${id} does not exist`);
const terminalResolved = new Set(["COMPLETED", "REJECTED"]);

function derivedTargetState(target, sources) {
  const states = sources.filter(item => item.targetWorkId === target.id).map(item => item.state);
  if (!states.length) return "PLANNED";
  if (states.includes("IN_PROGRESS")) return "IN_PROGRESS";
  if (states.every(state => terminalResolved.has(state))) return "COMPLETED";
  if (states.includes("BLOCKED")) return "BLOCKED";
  if (states.every(state => state === "EXHAUSTED")) return "EXHAUSTED";
  if (states.every(state => state === "DEFERRED")) return "DEFERRED";
  if (states.includes("READY")) return "READY";
  return "PLANNED";
}

function reduceEvents(inputEvents) {
  if (!Array.isArray(inputEvents) || !inputEvents.length) fail("at least one event is required");
  const events = inputEvents.map(contracts.validateResearchEvent);
  let batch = null;
  const targets = new Map();
  const sources = new Map();
  const attempts = new Map();
  const checkpointIds = [];

  events.forEach((event, index) => {
    if (event.sequence !== index + 1) fail(`event sequence ${event.sequence} is not contiguous`);
    if (event.id !== ids.eventId(event)) fail(`event ${event.id} identity does not match its content`);
    if (batch && event.batchId !== batch.id) fail("events from different batches cannot be reduced together");
    const payload = event.payload;
    switch (event.type) {
      case "batch-created": {
        if (batch || index !== 0) fail("batch-created must be the first and only creation event");
        const record = contracts.validateResearchBatch(payload.batch);
        if (record.id !== event.batchId || record.id !== ids.batchId(record)) fail("batch-created identity mismatch");
        batch = { ...record, state: "PLANNED" };
        break;
      }
      case "target-added": {
        if (!batch || batch.state !== "PLANNED") fail("targets may only be added while batch is PLANNED");
        const record = contracts.validateTargetWork(payload.targetWork);
        if (record.batchId !== batch.id || !batch.targetIds.includes(record.targetId)) fail("target is outside the batch identity");
        if (record.id !== ids.targetWorkId(record) || targets.has(record.id)) fail("duplicate or unstable target work identity");
        targets.set(record.id, { ...record, state: "PLANNED" });
        break;
      }
      case "source-work-created": {
        if (!batch || batch.state !== "PLANNED") fail("source work may only be created while batch is PLANNED");
        const record = contracts.validateSourceWorkItem(payload.sourceWork);
        get(targets, record.targetWorkId, "target work");
        if (record.id !== ids.sourceWorkId(record) || sources.has(record.id)) fail("duplicate or unstable source work identity");
        if (record.maxAttempts > batch.maxAttemptsPerWorkItem) fail("source work attempt budget exceeds batch policy");
        let state = "BLOCKED";
        if (record.readiness.passed) state = "READY";
        else if (record.readiness.classification === "REJECTED-MISMATCH") state = "REJECTED";
        else if (record.readiness.classification === "EXHAUSTED / LOW-MARGINAL-YIELD") state = "EXHAUSTED";
        sources.set(record.id, { ...record, state, attemptsUsed: 0, remainingAttempts: record.maxAttempts, activeAttemptId: null });
        break;
      }
      case "batch-resumed":
        if (!batch || !["PLANNED", "PAUSED"].includes(batch.state)) fail("only PLANNED or PAUSED batch can resume");
        if (batch.state === "PLANNED" && targets.size !== batch.targetIds.length) fail("all identified targets must be added before activation");
        batch.state = "ACTIVE";
        break;
      case "batch-paused":
        if (!batch || batch.state !== "ACTIVE") fail("only ACTIVE batch can pause");
        if ([...sources.values()].some(item => item.state === "IN_PROGRESS")) fail("batch cannot pause with an active attempt");
        batch.state = "PAUSED";
        break;
      case "attempt-started": {
        if (!batch || batch.state !== "ACTIVE") fail("attempt requires ACTIVE batch");
        const source = get(sources, payload.attempt?.sourceWorkId, "source work");
        if (source.state !== "READY" || source.activeAttemptId) fail("source work is not ready for a single active attempt");
        const ordinal = source.attemptsUsed + 1;
        if (ordinal > source.maxAttempts) fail("attempt budget exhausted");
        if (payload.attempt.id !== ids.attemptId({ sourceWorkId: source.id, ordinal }) || payload.attempt.ordinal !== ordinal) fail("attempt identity or ordinal is invalid");
        attempts.set(payload.attempt.id, { schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, id: payload.attempt.id, sourceWorkId: source.id, ordinal, state: "IN_PROGRESS", result: null });
        source.state = "IN_PROGRESS"; source.attemptsUsed = ordinal; source.remainingAttempts = source.maxAttempts - ordinal; source.activeAttemptId = payload.attempt.id;
        break;
      }
      case "attempt-completed":
      case "attempt-failed":
      case "attempt-blocked":
      case "attempt-exhausted": {
        const attempt = get(attempts, payload.attemptId, "attempt");
        const source = get(sources, attempt.sourceWorkId, "source work");
        if (attempt.state !== "IN_PROGRESS" || source.activeAttemptId !== attempt.id) fail("attempt is not active");
        const stateByType = { "attempt-completed": "COMPLETED", "attempt-failed": "FAILED", "attempt-blocked": "BLOCKED", "attempt-exhausted": "EXHAUSTED" };
        attempt.state = stateByType[event.type]; attempt.result = Object.prototype.hasOwnProperty.call(payload, "result") ? payload.result : null; source.activeAttemptId = null;
        if (event.type === "attempt-completed") source.state = "COMPLETED";
        else if (event.type === "attempt-blocked") source.state = "BLOCKED";
        else if (event.type === "attempt-exhausted" || source.remainingAttempts === 0) source.state = "EXHAUSTED";
        else source.state = "READY";
        break;
      }
      case "work-deferred": {
        const source = get(sources, payload.sourceWorkId, "source work");
        if (!batch || !["PLANNED", "ACTIVE", "PAUSED"].includes(batch.state) || source.state === "IN_PROGRESS" || terminalResolved.has(source.state) || source.state === "EXHAUSTED") fail("source work cannot be deferred from its current state");
        if (typeof payload.reason !== "string" || !payload.reason) fail("defer reason is required");
        source.state = "DEFERRED";
        break;
      }
      case "checkpoint-created":
        if (!batch || !["ACTIVE", "PAUSED"].includes(batch.state)) fail("checkpoint requires ACTIVE or PAUSED batch");
        if (typeof payload.checkpointId !== "string" || !payload.checkpointId.startsWith("checkpoint.")) fail("checkpoint identity is required");
        if (checkpointIds.includes(payload.checkpointId)) fail("checkpoint event is duplicated");
        checkpointIds.push(payload.checkpointId);
        break;
      case "batch-completed": {
        if (!batch || !["ACTIVE", "PAUSED"].includes(batch.state)) fail("only ACTIVE or PAUSED batch can complete");
        const targetValues = [...targets.values()];
        const sourceValues = [...sources.values()];
        const unresolved = targetValues.filter(target => target.required && derivedTargetState(target, sourceValues) !== "COMPLETED");
        if (unresolved.length) fail("batch has unresolved required target work");
        batch.state = "COMPLETED";
        break;
      }
      default: fail(`unsupported event ${event.type}`);
    }
  });
  if (!batch) fail("batch was not created");
  const sourceValues = [...sources.values()].sort((a, b) => a.id.localeCompare(b.id));
  const targetValues = [...targets.values()].map(target => ({ ...target, state: derivedTargetState(target, sourceValues) })).sort((a, b) => a.id.localeCompare(b.id));
  const snapshot = {
    schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION,
    foundationContractVersion: foundation.FACTORY_CONTRACT_VERSION,
    batch: { ...batch },
    eventCount: events.length,
    lastEventId: events.at(-1).id,
    targets: targetValues,
    sourceWorkItems: sourceValues,
    attempts: [...attempts.values()].sort((a, b) => a.id.localeCompare(b.id)),
    checkpointIds: [...checkpointIds].sort()
  };
  return contracts.validateResearchSnapshot(snapshot);
}

module.exports = Object.freeze({ reduceEvents });
