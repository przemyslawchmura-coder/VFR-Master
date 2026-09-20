// NON-PRODUCTION durable-boundary contract and local proof for Wave 2.
"use strict";

const crypto = require("node:crypto");
const reusable = require("./reusable-knowledge-contracts.js");
const json = require("./json.js");

const DURABLE_SCHEMA_VERSION = 1;
const DURABLE_DEMAND_STATES = Object.freeze([
  "MISSING", "IN_PROGRESS", "AWAITING_HUMAN_REVIEW", "REUSABLE", "UNSUPPORTED", "BLOCKED"
]);
const CLAIM_OUTCOMES = Object.freeze(["CREATED", "REUSED", "CONTEXT-UNKNOWN", "PERSISTENCE-UNAVAILABLE"]);
const KNOWLEDGE_OUTCOMES = Object.freeze(["CREATED", "REUSED", "CONFLICT", "PERSISTENCE-UNAVAILABLE"]);
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);
const clone = value => json.immutableClone(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function validateStatus(status) {
  assert(DURABLE_DEMAND_STATES.includes(status), "durable demand status is invalid");
  return status;
}

function normalizeDurableDemand(input) {
  const demand = reusable.validateReusableDemand(input.demand || input);
  const status = validateStatus(input.status || "MISSING");
  const lifecycle = input.lifecycle === undefined ? null : clone(input.lifecycle);
  json.assertJsonSafe(lifecycle);
  return Object.freeze({
    schemaVersion: DURABLE_SCHEMA_VERSION,
    demandId: demand.id,
    knowledgeKey: demand.knowledgeKey,
    catalogVariantKey: demand.catalogVariantKey,
    canonicalFieldId: demand.canonicalFieldId,
    operation: demand.operation,
    applicability: demand.applicability,
    conditions: demand.conditions,
    requiredApplicabilityDimensions: demand.requiredApplicabilityDimensions,
    status,
    lifecycle
  });
}

function knowledgeRecord(input) {
  const demand = reusable.validateReusableDemand(input.demand || input);
  const knowledge = reusable.createReusableKnowledge({
    demand, status: input.status, value: input.value, rawValue: input.rawValue, provenance: input.provenance
  });
  const lineage = input.lineage === undefined ? null : clone(input.lineage);
  json.assertJsonSafe(lineage);
  const content = { knowledgeKey: knowledge.knowledgeKey, status: knowledge.status, value: knowledge.value, rawValue: knowledge.rawValue, provenance: knowledge.provenance, lineage };
  const contentDigest = digest(content);
  return Object.freeze({
    schemaVersion: DURABLE_SCHEMA_VERSION,
    recordId: `reusable-knowledge-record.${contentDigest}`,
    contentDigest,
    ...knowledge,
    lineage
  });
}

const sameDemand = (left, right) => {
  const comparable = value => {
    const { lifecycle, ...semantic } = value;
    return semantic;
  };
  return json.canonicalSerialize(comparable(left)) === json.canonicalSerialize(comparable(right));
};

function createLocalDurableRepository(options = {}) {
  const demands = new Map();
  const knowledge = new Map();
  const available = options.available !== false;
  const unavailable = () => Object.freeze({ ok: false, outcome: "PERSISTENCE-UNAVAILABLE", record: null });

  function claim(input) {
    if (!available) return unavailable();
    const candidate = normalizeDurableDemand(input);
    const context = reusable.contextIsKnown(reusable.validateReusableDemand(input.demand || input));
    if (!context.complete) return Object.freeze({ ok: false, outcome: "CONTEXT-UNKNOWN", missingDimensions: context.missingDimensions, record: null });
    const existing = demands.get(candidate.demandId);
    if (existing) {
      if (!sameDemand(existing, candidate)) throw new TypeError("conflicting durable demand identity");
      return Object.freeze({ ok: true, outcome: "REUSED", record: clone(existing) });
    }
    demands.set(candidate.demandId, candidate);
    return Object.freeze({ ok: true, outcome: "CREATED", record: clone(candidate) });
  }

  function setStatus(input) {
    if (!available) return unavailable();
    const current = demands.get(input.demandId);
    assert(current, "durable demand does not exist");
    const next = normalizeDurableDemand({ ...current, status: input.status, lifecycle: input.lifecycle === undefined ? current.lifecycle : input.lifecycle });
    demands.set(next.demandId, next);
    return Object.freeze({ ok: true, outcome: "UPDATED", record: clone(next) });
  }

  function putKnowledge(input) {
    if (!available) return unavailable();
    const candidate = knowledgeRecord(input);
    const sameKey = [...knowledge.values()].filter(record => record.knowledgeKey === candidate.knowledgeKey);
    const exact = sameKey.find(record => record.contentDigest === candidate.contentDigest);
    if (exact) return Object.freeze({ ok: true, outcome: "REUSED", record: clone(exact) });
    knowledge.set(candidate.recordId, candidate);
    return Object.freeze({ ok: true, outcome: sameKey.length > 0 ? "CONFLICT" : "CREATED", record: clone(candidate) });
  }

  function readKnowledge(demand) {
    if (!available) return Object.freeze({ ok: false, classification: "PERSISTENCE-UNAVAILABLE", records: Object.freeze([]) });
    const normalized = reusable.validateReusableDemand(demand);
    const records = [...knowledge.values()].filter(record => record.knowledgeKey === normalized.knowledgeKey).sort((a, b) => a.recordId.localeCompare(b.recordId));
    return Object.freeze({ ok: true, classification: records.length > 1 ? "CONFLICT" : "AVAILABLE", records: Object.freeze(records.map(clone)) });
  }

  return Object.freeze({
    claim, setStatus, putKnowledge, readKnowledge,
    snapshot: () => Object.freeze({ demands: Object.freeze([...demands.values()].map(clone)), knowledge: Object.freeze([...knowledge.values()].map(clone)) })
  });
}

function lookupDurableKnowledge(repository, demand) {
  const result = repository.readKnowledge(demand);
  if (!result.ok || result.classification === "CONFLICT") return result;
  return reusable.lookupReusableKnowledge({ demand, repository: result.records });
}

module.exports = Object.freeze({
  DURABLE_SCHEMA_VERSION, DURABLE_DEMAND_STATES, CLAIM_OUTCOMES, KNOWLEDGE_OUTCOMES,
  normalizeDurableDemand, knowledgeRecord, createLocalDurableRepository, lookupDurableKnowledge
});
