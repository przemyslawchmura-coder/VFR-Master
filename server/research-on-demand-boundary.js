// TRUSTED SERVER-SIDE FOUNDATION. Do not import from browser/runtime code.
"use strict";

const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const persistence = require("../research/factory/reusable-knowledge-persistence.js");

const FORBIDDEN_REQUEST_KEYS = Object.freeze([
  "demandId", "knowledgeKey", "status", "provenance", "lineage",
  "reviewDecision", "factoryBatchId", "targetWorkId", "sourceWorkItemId",
  "attemptId", "userId", "garageRowId", "batchId"
]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const clone = value => JSON.parse(JSON.stringify(value));

function rejectForbiddenKeys(value, path = "request") {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) return value.forEach((item, index) => rejectForbiddenKeys(item, `${path}[${index}]`));
  Object.keys(value).forEach(key => {
    if (FORBIDDEN_REQUEST_KEYS.includes(key)) throw new TypeError(`${path}.${key} is not accepted from an ordinary client`);
    rejectForbiddenKeys(value[key], `${path}.${key}`);
  });
}

function deriveCanonicalDemand(request) {
  assert(request && typeof request === "object" && !Array.isArray(request), "trusted research request is required");
  rejectForbiddenKeys(request);
  const input = request.demand || request;
  const demand = reusable.validateReusableDemand(input);
  const context = reusable.contextIsKnown(demand);
  if (!context.complete) {
    const error = new TypeError("required research applicability context is unknown");
    error.code = "CONTEXT-UNKNOWN";
    error.missingDimensions = context.missingDimensions;
    throw error;
  }
  return demand;
}

function statusForDemand(store, demand) {
  if (typeof store.readDemand !== "function") return null;
  const record = store.readDemand(demand.id);
  return record ? clone(record) : null;
}

function createTrustedResearchOnDemandBoundary({ store, factoryHandoff }) {
  assert(store && typeof store.claim === "function", "trusted durable store is required");
  assert(typeof store.readKnowledge === "function", "trusted durable knowledge lookup is required");
  assert(typeof store.putKnowledge === "function", "trusted durable knowledge write is required");
  assert(typeof store.setStatus === "function", "trusted durable status write is required");
  assert(typeof factoryHandoff === "function", "trusted Factory handoff is required");

  function request(input) {
    const demand = deriveCanonicalDemand(input);
    const knowledge = persistence.lookupDurableKnowledge(store, demand);
    const durableRecords = store.readKnowledge(demand).records || [];
    const durableRecord = durableRecords.find(record => record.knowledgeKey === demand.knowledgeKey && record.status === knowledge.status) || null;
    if (["REUSED", "JOIN-IN-PROGRESS", "JOIN-HUMAN-REVIEW", "PRESERVE-UNSUPPORTED", "PRESERVE-BLOCKED"].includes(knowledge.classification)) {
      return Object.freeze({ outcome: "REUSED-EXISTING-STATE", demand: clone(demand), status: knowledge.status, classification: knowledge.classification, record: durableRecord || knowledge.record });
    }
    const existing = statusForDemand(store, demand);
    if (existing) return Object.freeze({ outcome: "REUSED-EXISTING-STATE", demand: clone(demand), status: existing.status, classification: existing.status === "IN_PROGRESS" ? "JOIN-IN-PROGRESS" : existing.status, record: existing });
    const claim = store.claim({ demand, status: "IN_PROGRESS", lifecycle: { boundary: "trusted-wave5", handoff: "PENDING" } });
    if (!claim.ok) return Object.freeze({ outcome: claim.outcome, demand: clone(demand), status: null, classification: claim.outcome, record: null });
    if (claim.outcome === "REUSED") {
      return Object.freeze({ outcome: "REUSED-EXISTING-STATE", demand: clone(demand), status: claim.record.status, classification: claim.record.status === "IN_PROGRESS" ? "JOIN-IN-PROGRESS" : claim.record.status, record: claim.record });
    }
    const handoff = factoryHandoff({ demand: clone(demand), claim: clone(claim.record) });
    return Object.freeze({ outcome: "CREATED", demand: clone(demand), status: claim.record.status, classification: "JOIN-IN-PROGRESS", handoff: clone(handoff), record: claim.record });
  }

  function persistFactoryResult(input) {
    assert(input && input.demand && input.result, "trusted Factory result is required");
    const demand = deriveCanonicalDemand(input.demand);
    assert(input.result.demandId === demand.id, "Factory result demand identity does not match request");
    assert(input.result.provenance && input.result.lineage, "Factory result provenance and lineage are required");
    const stored = store.putKnowledge({
      demand,
      status: input.result.status || "REUSABLE",
      value: input.result.value,
      rawValue: input.result.rawValue,
      provenance: input.result.provenance,
      lineage: input.result.lineage
    });
    if (!["CREATED", "REUSED"].includes(stored.outcome)) return Object.freeze({ outcome: stored.outcome, record: stored.record || null });
    const status = store.setStatus({ demandId: demand.id, status: input.result.status || "REUSABLE", lifecycle: { boundary: "trusted-wave5", completed: true } });
    return Object.freeze({ outcome: stored.outcome, record: stored.record, demand: status.record });
  }

  return Object.freeze({ request, persistFactoryResult, deriveCanonicalDemand });
}

function createRpcStore({ rpc }) {
  assert(typeof rpc === "function", "trusted RPC client is required");
  const call = (name, args) => {
    const result = rpc(name, args);
    if (!result || result.error) throw new Error(result && result.error ? result.error.message : `trusted RPC ${name} failed`);
    return result.data;
  };
  return Object.freeze({
    claim: input => {
      const demand = reusable.validateReusableDemand(input.demand || input);
      return call("claim_research_demand", { p_demand: { ...persistence.normalizeDurableDemand(input), identity: reusable.demandIdentity(demand) } });
    },
    readDemand: demandId => call("read_research_demand", { p_demand_id: demandId }),
    readKnowledge: demand => ({ ok: true, classification: "AVAILABLE", records: call("read_research_knowledge", { p_knowledge_key: demand.knowledgeKey }) || [] }),
    setStatus: input => call("set_research_demand_status", { p_demand_id: input.demandId, p_status: input.status, p_lifecycle: input.lifecycle || null }),
    putKnowledge: input => call("put_research_reusable_knowledge", { p_record: persistence.knowledgeRecord(input) })
  });
}

function createAtomicLocalTrustedStore() {
  const repository = persistence.createLocalDurableRepository();
  const demands = new Map();
  return Object.freeze({
    claim(input) {
      const result = repository.claim(input);
      if (result.record) demands.set(result.record.demandId, result.record);
      return result;
    },
    readDemand: demandId => demands.has(demandId) ? clone(demands.get(demandId)) : null,
    readKnowledge: repository.readKnowledge,
    setStatus(input) {
      const result = repository.setStatus(input);
      if (result.record) demands.set(result.record.demandId, result.record);
      return result;
    },
    putKnowledge: repository.putKnowledge,
    snapshot: repository.snapshot
  });
}

module.exports = Object.freeze({ createTrustedResearchOnDemandBoundary, createRpcStore, createAtomicLocalTrustedStore, deriveCanonicalDemand, FORBIDDEN_REQUEST_KEYS });
