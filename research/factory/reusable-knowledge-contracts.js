// NON-PRODUCTION deterministic reusable-demand and knowledge contracts.
"use strict";

const crypto = require("node:crypto");
const contracts = require("./contracts.js");
const applicability = require("./applicability.js");
const json = require("./json.js");

const REUSABLE_KNOWLEDGE_SCHEMA_VERSION = 1;
const REUSABLE_KNOWLEDGE_STATES = Object.freeze([
  "REUSABLE",
  "IN_PROGRESS",
  "AWAITING_HUMAN_REVIEW",
  "UNSUPPORTED",
  "BLOCKED"
]);
const RESULT_CLASSIFICATIONS = Object.freeze([
  "REUSED",
  "JOIN-IN-PROGRESS",
  "JOIN-HUMAN-REVIEW",
  "PRESERVE-UNSUPPORTED",
  "PRESERVE-BLOCKED",
  "MISSING",
  "INCOMPATIBLE",
  "CONTEXT-UNKNOWN"
]);
const REQUIRED_DIMENSIONS = Object.freeze(["model", "generation", "year", "market", "abs", "transmission", "equipment", "bodyStyle"]);
const DIMENSION_KEYS = Object.freeze({ model: "model", generation: "generation", year: "years", market: "markets", abs: "abs", transmission: "transmissions", equipment: "equipment", bodyStyle: "bodyStyles" });
const idDigest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertText = (value, label) => assert(typeof value === "string" && value.trim().length > 0, `${label} is required`);
const assertId = (value, label) => assert(typeof value === "string" && /^[a-z0-9][a-z0-9._:/-]*$/i.test(value), `${label} is invalid`);
const clone = value => json.immutableClone(value);

function normalizeRequiredDimensions(value) {
  assert(Array.isArray(value) && value.length > 0, "requiredApplicabilityDimensions are required");
  const normalized = [...new Set(value)];
  assert(normalized.every(item => REQUIRED_DIMENSIONS.includes(item)), "requiredApplicabilityDimensions contain an unsupported dimension");
  return Object.freeze(normalized.sort());
}

function demandIdentity(input) {
  json.assertJsonSafe(input);
  assertId(input.catalogVariantKey, "catalogVariantKey");
  assertText(input.canonicalFieldId, "canonicalFieldId");
  assertText(input.operation, "operation");
  const normalizedApplicability = contracts.validateApplicabilityScope(input.applicability);
  const requiredApplicabilityDimensions = normalizeRequiredDimensions(input.requiredApplicabilityDimensions);
  const identity = {
    applicability: normalizedApplicability,
    canonicalFieldId: input.canonicalFieldId.trim(),
    catalogVariantKey: input.catalogVariantKey.trim(),
    conditions: input.conditions === undefined ? null : clone(input.conditions),
    operation: input.operation.trim(),
    requiredApplicabilityDimensions
  };
  return Object.freeze(identity);
}

function validateReusableDemand(input) {
  const identity = demandIdentity(input.identity || input);
  const id = `reusable-demand.${idDigest(identity)}`;
  const knowledgeKey = `reusable-knowledge.${idDigest(identity)}`;
  return Object.freeze({
    schemaVersion: REUSABLE_KNOWLEDGE_SCHEMA_VERSION,
    id,
    knowledgeKey,
    ...clone(identity)
  });
}

function contextKnown(scope, dimension) {
  const key = DIMENSION_KEYS[dimension];
  if (key === "years") return scope.years.kind !== "UNKNOWN";
  return scope[key] && scope[key].state === "KNOWN";
}

function contextIsKnown(demand) {
  const missing = demand.requiredApplicabilityDimensions.filter(dimension => !contextKnown(demand.applicability, dimension));
  return Object.freeze({ complete: missing.length === 0, missingDimensions: Object.freeze(missing) });
}

function validateProvenance(provenance, required) {
  if (provenance === null || provenance === undefined) {
    assert(!required, "reusable knowledge provenance is required");
    return null;
  }
  json.assertJsonSafe(provenance);
  assert(typeof provenance.sourceId === "string" && provenance.sourceId.length > 0, "provenance.sourceId is required");
  assert(typeof provenance.sourceType === "string" && provenance.sourceType.length > 0, "provenance.sourceType is required");
  assert(typeof provenance.locator === "string" && provenance.locator.length > 0, "provenance.locator is required");
  return clone(provenance);
}

function createReusableKnowledge(input) {
  const demand = validateReusableDemand(input.demand);
  assert(REUSABLE_KNOWLEDGE_STATES.includes(input.status), "reusable knowledge status is invalid");
  const reusable = input.status === "REUSABLE";
  if (reusable) {
    assert(input.value !== null && input.value !== undefined, "reusable knowledge value is required");
    json.assertJsonSafe(input.value);
  } else assert(input.value === null || input.value === undefined, "non-reusable knowledge cannot expose a safe value");
  if (input.rawValue !== null && input.rawValue !== undefined) json.assertJsonSafe(input.rawValue);
  const provenance = validateProvenance(input.provenance, reusable);
  return Object.freeze({
    schemaVersion: REUSABLE_KNOWLEDGE_SCHEMA_VERSION,
    id: demand.knowledgeKey,
    demandId: demand.id,
    knowledgeKey: demand.knowledgeKey,
    catalogVariantKey: demand.catalogVariantKey,
    canonicalFieldId: demand.canonicalFieldId,
    operation: demand.operation,
    applicability: demand.applicability,
    conditions: demand.conditions,
    requiredApplicabilityDimensions: demand.requiredApplicabilityDimensions,
    status: input.status,
    value: reusable ? clone(input.value) : null,
    rawValue: input.rawValue === undefined ? null : clone(input.rawValue),
    provenance
  });
}

function normalizeRepository(repository) {
  const records = Array.isArray(repository) ? repository : repository && repository.records;
  assert(Array.isArray(records), "reusable knowledge repository records are required");
  const byKey = new Map();
  records.map(record => {
    json.assertJsonSafe(record);
    assert(record.schemaVersion === REUSABLE_KNOWLEDGE_SCHEMA_VERSION, "reusable knowledge schemaVersion is invalid");
    const demand = validateReusableDemand({ identity: { catalogVariantKey: record.catalogVariantKey, canonicalFieldId: record.canonicalFieldId, operation: record.operation, applicability: record.applicability, conditions: record.conditions, requiredApplicabilityDimensions: record.requiredApplicabilityDimensions } });
    assert(record.id === record.knowledgeKey && record.knowledgeKey === demand.knowledgeKey, "reusable knowledge identity is invalid");
    const canonical = createReusableKnowledge({ demand, status: record.status, value: record.value, rawValue: record.rawValue, provenance: record.provenance });
    if (byKey.has(canonical.knowledgeKey) && json.canonicalSerialize(byKey.get(canonical.knowledgeKey)) !== json.canonicalSerialize(canonical)) throw new TypeError("conflicting reusable knowledge identity");
    byKey.set(canonical.knowledgeKey, canonical);
    return canonical;
  });
  return Object.freeze([...byKey.values()].sort((a, b) => a.knowledgeKey.localeCompare(b.knowledgeKey)));
}

function relatedRecord(record, demand) {
  return record.catalogVariantKey === demand.catalogVariantKey && record.canonicalFieldId === demand.canonicalFieldId && record.operation === demand.operation && record.applicability && json.canonicalSerialize(record.conditions) === json.canonicalSerialize(demand.conditions);
}

function classifyRecord(record) {
  if (record.status === "REUSABLE") return "REUSED";
  if (record.status === "IN_PROGRESS") return "JOIN-IN-PROGRESS";
  if (record.status === "AWAITING_HUMAN_REVIEW") return "JOIN-HUMAN-REVIEW";
  if (record.status === "UNSUPPORTED") return "PRESERVE-UNSUPPORTED";
  return "PRESERVE-BLOCKED";
}

function lookupReusableKnowledge(input) {
  const demand = validateReusableDemand(input.demand || input);
  const repository = normalizeRepository(input.repository || []);
  const context = contextIsKnown(demand);
  const direct = repository.find(record => record.knowledgeKey === demand.knowledgeKey);
  let classification = null;
  let record = null;
  if (!context.complete) classification = "CONTEXT-UNKNOWN";
  else if (direct) {
    const comparison = applicability.evaluateApplicability(demand.applicability, direct.applicability);
    if (comparison.overall === "MATCH") { record = direct; classification = classifyRecord(direct); }
    else classification = "INCOMPATIBLE";
  } else if (repository.some(item => relatedRecord(item, demand))) classification = "INCOMPATIBLE";
  else classification = "MISSING";
  return Object.freeze({
    demandId: demand.id,
    knowledgeKey: demand.knowledgeKey,
    canonicalFieldId: demand.canonicalFieldId,
    applicability: demand.applicability,
    conditions: demand.conditions,
    classification,
    status: record ? record.status : null,
    joinExisting: classification === "JOIN-IN-PROGRESS" || classification === "JOIN-HUMAN-REVIEW",
    newResearchNeeded: classification === "MISSING" || classification === "INCOMPATIBLE",
    contextMissingDimensions: context.missingDimensions,
    record: record ? clone(record) : null
  });
}

function projectReusableKnowledge({ requests, repository = [] }) {
  assert(Array.isArray(requests), "reusable knowledge requests are required");
  const normalized = requests.map(request => validateReusableDemand(request));
  const unique = new Map();
  normalized.forEach(demand => {
    if (unique.has(demand.id) && json.canonicalSerialize(unique.get(demand.id)) !== json.canonicalSerialize(demand)) throw new TypeError("conflicting duplicate reusable demand");
    unique.set(demand.id, demand);
  });
  const results = [...unique.values()].sort((a, b) => a.id.localeCompare(b.id)).map(demand => lookupReusableKnowledge({ demand, repository }));
  const item = result => ({ demandId: result.demandId, knowledgeKey: result.knowledgeKey, canonicalFieldId: result.canonicalFieldId, applicability: result.applicability, conditions: result.conditions, classification: result.classification, status: result.status, value: result.record && result.record.status === "REUSABLE" ? result.record.value : null, rawValue: result.record ? result.record.rawValue : null, provenance: result.record ? result.record.provenance : null, contextMissingDimensions: result.contextMissingDimensions });
  const projected = results.map(item);
  const by = classification => projected.filter(result => result.classification === classification);
  return Object.freeze({
    schemaVersion: REUSABLE_KNOWLEDGE_SCHEMA_VERSION,
    requests: Object.freeze(projected),
    known: Object.freeze(by("REUSED")),
    inProgress: Object.freeze(by("JOIN-IN-PROGRESS")),
    review: Object.freeze(by("JOIN-HUMAN-REVIEW")),
    unsupported: Object.freeze(by("PRESERVE-UNSUPPORTED")),
    blocked: Object.freeze(by("PRESERVE-BLOCKED")),
    missing: Object.freeze(by("MISSING")),
    incompatible: Object.freeze(by("INCOMPATIBLE")),
    contextUnknown: Object.freeze(by("CONTEXT-UNKNOWN")),
    newResearchNeeded: Object.freeze(projected.filter(result => result.classification === "MISSING" || result.classification === "INCOMPATIBLE")),
    productionMaterialized: false,
    externalAcquisition: false
  });
}

module.exports = Object.freeze({ REUSABLE_KNOWLEDGE_SCHEMA_VERSION, REUSABLE_KNOWLEDGE_STATES, RESULT_CLASSIFICATIONS, REQUIRED_DIMENSIONS, demandIdentity, validateReusableDemand, createReusableKnowledge, normalizeRepository, contextIsKnown, lookupReusableKnowledge, projectReusableKnowledge });
