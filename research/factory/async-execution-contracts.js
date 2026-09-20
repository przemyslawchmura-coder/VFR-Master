// NON-PRODUCTION durable trusted execution contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const reusable = require("./reusable-knowledge-contracts.js");

const EXECUTION_SCHEMA_VERSION = 1;
const EXECUTION_STATES = Object.freeze(["READY", "RUNNING", "RETRYABLE", "COMPLETED", "TERMINAL", "BLOCKED", "UNSUPPORTED", "AWAITING_HUMAN_REVIEW"]);
const FAILURE_CLASSES = Object.freeze(["TRANSIENT", "PERMANENT", "BLOCKED", "UNSUPPORTED", "AWAITING_HUMAN_REVIEW"]);
const MAX_ATTEMPTS = 3;
const clone = value => json.immutableClone(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);

function executionIdentity(demandInput) {
  const demand = reusable.validateReusableDemand(demandInput.demand || demandInput);
  return Object.freeze({ executionId: `research-execution.${digest(demand.id)}`, jobKey: demand.id, demandId: demand.id });
}

function validateExecutionJob(input) {
  assert(input && typeof input === "object" && !Array.isArray(input), "execution job is required");
  assert(input.schemaVersion === EXECUTION_SCHEMA_VERSION, "execution schemaVersion is incompatible");
  assert(typeof input.executionId === "string" && /^research-execution\.[a-f0-9]{24}$/.test(input.executionId), "executionId is invalid");
  assert(typeof input.jobKey === "string" && input.jobKey.length > 0, "execution jobKey is required");
  assert(typeof input.demandId === "string" && input.demandId.length > 0, "execution demandId is required");
  assert(EXECUTION_STATES.includes(input.status), "execution status is invalid");
  assert(Number.isInteger(input.attemptCount) && input.attemptCount >= 0, "execution attemptCount is invalid");
  assert(Number.isInteger(input.maxAttempts) && input.maxAttempts > 0 && input.maxAttempts <= MAX_ATTEMPTS, "execution maxAttempts is invalid");
  if (input.lastFailure !== null && input.lastFailure !== undefined) assert(FAILURE_CLASSES.includes(input.lastFailure.classification), "execution failure classification is invalid");
  json.assertJsonSafe(input.checkpoint === undefined ? null : input.checkpoint);
  return clone(input);
}

module.exports = Object.freeze({ EXECUTION_SCHEMA_VERSION, EXECUTION_STATES, FAILURE_CLASSES, MAX_ATTEMPTS, executionIdentity, validateExecutionJob });
