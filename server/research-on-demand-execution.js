// TRUSTED SERVER-SIDE FOUNDATION. Do not import from browser/runtime code.
"use strict";

const contracts = require("../research/factory/async-execution-contracts.js");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const json = require("../research/factory/json.js");

const clone = value => json.immutableClone(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const workerId = value => typeof value === "string" && value.length > 0 && value.length <= 160;

function assertIdentity(demand, executionId) {
  const identity = contracts.executionIdentity(demand);
  if (executionId !== undefined && executionId !== identity.executionId) throw new TypeError("execution identity does not match canonical demand");
  return identity;
}

function createLocalExecutionStore({ clock = () => Date.now() } = {}) {
  const jobs = new Map();
  const timestamp = () => new Date(clock()).toISOString();
  const copy = value => value === null || value === undefined ? value : clone(value);
  const create = input => {
    const identity = assertIdentity(input.demand, input.executionId);
    const existing = jobs.get(identity.executionId);
    if (existing) return Object.freeze({ ok: true, outcome: "REUSED", record: copy(existing) });
    const record = { schemaVersion: contracts.EXECUTION_SCHEMA_VERSION, executionId: identity.executionId, jobKey: identity.jobKey, demandId: identity.demandId, status: "READY", workerId: null, claimedAt: null, leaseExpiresAt: null, attemptCount: 0, maxAttempts: input.maxAttempts || contracts.MAX_ATTEMPTS, checkpoint: input.checkpoint === undefined ? null : copy(input.checkpoint), lastFailure: null, createdAt: timestamp(), updatedAt: timestamp() };
    contracts.validateExecutionJob(record); jobs.set(identity.executionId, record);
    return Object.freeze({ ok: true, outcome: "CREATED", record: copy(record) });
  };
  const read = executionId => copy(jobs.get(executionId) || null);
  const claim = ({ executionId, workerId: owner, leaseSeconds = 60 }) => {
    assert(workerId(owner), "trusted workerId is required"); assert(Number.isInteger(leaseSeconds) && leaseSeconds > 0 && leaseSeconds <= 3600, "leaseSeconds is invalid");
    const record = jobs.get(executionId); if (!record) return Object.freeze({ ok: false, outcome: "NOT_FOUND", record: null });
    const expired = record.status === "RUNNING" && record.leaseExpiresAt !== null && Date.parse(record.leaseExpiresAt) <= clock();
    if (!( ["READY", "RETRYABLE"].includes(record.status) || expired)) return Object.freeze({ ok: true, outcome: record.status === "RUNNING" ? "BUSY" : record.status, record: copy(record) });
    if (record.attemptCount >= record.maxAttempts) { record.status = "TERMINAL"; record.lastFailure = { classification: "PERMANENT", reason: "MAX-ATTEMPTS-EXHAUSTED" }; record.updatedAt = timestamp(); return Object.freeze({ ok: true, outcome: "TERMINAL", record: copy(record) }); }
    record.status = "RUNNING"; record.workerId = owner; record.claimedAt = timestamp(); record.leaseExpiresAt = new Date(clock() + leaseSeconds * 1000).toISOString(); record.attemptCount += 1; record.updatedAt = timestamp();
    return Object.freeze({ ok: true, outcome: "CLAIMED", record: copy(record) });
  };
  const checkpoint = ({ executionId, workerId: owner, value }) => {
    const record = jobs.get(executionId);
    if (!record || record.status !== "RUNNING" || record.workerId !== owner || Date.parse(record.leaseExpiresAt) <= clock()) return Object.freeze({ ok: false, outcome: "LEASE-INVALID", record: copy(record || null) });
    json.assertJsonSafe(value); record.checkpoint = copy(value); record.updatedAt = timestamp();
    return Object.freeze({ ok: true, outcome: "CHECKPOINTED", record: copy(record) });
  };
  const finish = ({ executionId, workerId: owner, outcome, failure = null, checkpoint: nextCheckpoint }) => {
    const record = jobs.get(executionId);
    if (!record || record.status !== "RUNNING" || record.workerId !== owner || Date.parse(record.leaseExpiresAt) <= clock()) return Object.freeze({ ok: false, outcome: "LEASE-INVALID", record: copy(record || null) });
    const terminal = { SUCCESS: "COMPLETED", PERMANENT: "TERMINAL", BLOCKED: "BLOCKED", UNSUPPORTED: "UNSUPPORTED", AWAITING_HUMAN_REVIEW: "AWAITING_HUMAN_REVIEW" }[outcome];
    if (outcome === "RETRYABLE") record.status = record.attemptCount < record.maxAttempts ? "RETRYABLE" : "TERMINAL";
    else if (terminal) record.status = terminal;
    else throw new TypeError("unsupported execution outcome");
    if (nextCheckpoint !== undefined) { json.assertJsonSafe(nextCheckpoint); record.checkpoint = copy(nextCheckpoint); }
    record.lastFailure = outcome === "SUCCESS" ? null : { classification: outcome === "RETRYABLE" ? "TRANSIENT" : outcome, ...(failure || {}) };
    record.workerId = null; record.claimedAt = null; record.leaseExpiresAt = null; record.updatedAt = timestamp();
    return Object.freeze({ ok: true, outcome: "FINISHED", record: copy(record) });
  };
  return Object.freeze({ create, read, claim, checkpoint, finish, snapshot: () => Object.freeze([...jobs.values()].map(copy)) });
}

function createRpcExecutionStore({ rpc }) {
  assert(typeof rpc === "function", "trusted execution RPC client is required");
  const call = (name, args) => { const result = rpc(name, args); if (!result || result.error) throw new Error(result && result.error ? result.error.message : `trusted RPC ${name} failed`); return result.data; };
  return Object.freeze({
    create: input => { const identity = contracts.executionIdentity(input.demand); return call("create_research_execution", { p_execution: { executionId: identity.executionId, jobKey: identity.jobKey, demandId: identity.demandId, maxAttempts: input.maxAttempts || contracts.MAX_ATTEMPTS, checkpoint: input.checkpoint || null } }); },
    read: executionId => call("read_research_execution", { p_execution_id: executionId }),
    claim: input => call("claim_research_execution", { p_execution_id: input.executionId, p_worker_id: input.workerId, p_lease_seconds: input.leaseSeconds || 60 }),
    checkpoint: input => call("checkpoint_research_execution", { p_execution_id: input.executionId, p_worker_id: input.workerId, p_checkpoint: input.value }),
    finish: input => call("finish_research_execution", { p_execution_id: input.executionId, p_worker_id: input.workerId, p_outcome: input.outcome, p_failure: input.failure || null, p_checkpoint: input.checkpoint === undefined ? null : input.checkpoint })
  });
}

function createTrustedAsyncExecutionService({ store, factoryExecutor, reusableWriter = null }) {
  assert(store && typeof store.create === "function" && typeof store.claim === "function", "trusted execution store is required"); assert(typeof factoryExecutor === "function", "existing Factory executor is required");
  function ensure(input) { const demand = reusable.validateReusableDemand(input.demand || input); const identity = assertIdentity(demand, input.executionId); return Object.freeze({ demand: clone(demand), identity, ...store.create({ demand, maxAttempts: input.maxAttempts, checkpoint: input.checkpoint }) }); }
  function claim(input) { assert(input && input.demand, "canonical demand is required to claim execution"); assertIdentity(input.demand, input.executionId); return store.claim(input); }
  function checkpoint(input) { return store.checkpoint(input); }
  async function runOnce({ demand, executionId, workerId: owner, leaseSeconds = 60 }) {
    assertIdentity(demand, executionId); const claimed = store.claim({ executionId, workerId: owner, leaseSeconds }); if (claimed.outcome !== "CLAIMED") return claimed;
    const job = claimed.record; const handoff = { phase: "FACTORY-HANDOFF", executionId: job.executionId, demandId: job.demandId, attempt: job.attemptCount, claimedAt: job.claimedAt }; const saved = checkpoint({ executionId: job.executionId, workerId: owner, value: handoff }); if (!saved.ok) return saved;
    const result = await factoryExecutor({ demand: clone(demand), execution: clone(saved.record), checkpoint: clone(handoff) });
    if (!result || typeof result.outcome !== "string") throw new TypeError("Factory executor result is invalid");
    if (result.outcome === "SUCCESS" && reusableWriter) await reusableWriter({ demand: clone(demand), result: clone(result.result) });
    const finished = store.finish({ executionId: job.executionId, workerId: owner, outcome: result.outcome, failure: result.failure, checkpoint: result.checkpoint === undefined ? handoff : result.checkpoint });
    return Object.freeze({ ...finished, factory: result });
  }
  return Object.freeze({ ensure, claim, checkpoint, runOnce, read: store.read, store });
}

module.exports = Object.freeze({ createLocalExecutionStore, createRpcExecutionStore, createTrustedAsyncExecutionService });
