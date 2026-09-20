// NON-PRODUCTION deterministic Wave A BatchSummary/v2 contract.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const BATCH_SUMMARY_SCHEMA_VERSION = 2;
const MEASUREMENT_STATES = Object.freeze(["MEASURED", "UNKNOWN", "NOT-MEASURED"]);
const SAFE_STOP_STATES = Object.freeze(["PRE-MATERIALIZATION", "UNKNOWN"]);
const fields = new Set(["schemaVersion", "id", "scope", "fixtures", "aggregate", "metrics", "safeStop", "boundary", "contractVersions"]);
const fixtureFields = new Set(["fixtureId", "lifecycleGeneration", "comparability", "scope", "counts", "stageStates", "metrics", "humanActions", "safeStop", "workCounters", "sourceIdentity", "notes"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const semanticId = value => `batch-summary.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const batchSummaryId = input => semanticId({ scope: input.scope, fixtures: [...input.fixtures].sort((a, b) => a.fixtureId.localeCompare(b.fixtureId)), aggregate: input.aggregate, metrics: input.metrics, safeStop: input.safeStop, boundary: input.boundary, contractVersions: input.contractVersions });

function validateMeasurement(input, label) {
  json.assertJsonSafe(input);
  assert(input && MEASUREMENT_STATES.includes(input.measurementState), `${label}.measurementState is invalid`);
  assert(Object.prototype.hasOwnProperty.call(input, "value"), `${label}.value is required`);
  if (input.measurementState === "MEASURED") assert(typeof input.value === "number" && Number.isFinite(input.value) && input.value >= 0, `${label}.value must be a non-negative finite number when measured`);
  else assert(input.value === null, `${label}.value must be null when unavailable`);
  assert(typeof input.scope === "string" && input.scope.length > 0, `${label}.scope is required`);
  assert(typeof input.reason === "string" && input.reason.length > 0, `${label}.reason is required`);
  return json.immutableClone(input);
}

function validateMetric(input, label) {
  json.assertJsonSafe(input);
  assert(typeof input.name === "string" && input.name.length > 0, `${label}.name is required`);
  validateMeasurement(input.numerator, `${label}.numerator`);
  validateMeasurement(input.denominator, `${label}.denominator`);
  validateMeasurement({ measurementState: input.measurementState, value: input.value, scope: input.scope, reason: input.reason }, label);
  assert(Array.isArray(input.contractVersions), `${label}.contractVersions is required`);
  assert((input.measurementState === "MEASURED") === (input.value !== null), `${label} must not emit a percentage without a measured value`);
  if (input.measurementState === "MEASURED") {
    assert(input.denominator.measurementState === "MEASURED" && input.denominator.value > 0, `${label} measured percentage requires a positive measured denominator`);
    assert(input.numerator.measurementState === "MEASURED" && input.numerator.value <= input.denominator.value, `${label} numerator is outside denominator`);
  }
  return json.immutableClone(input);
}

function validateCountMap(input, label) {
  assert(input && typeof input === "object" && !Array.isArray(input), `${label} is required`);
  Object.entries(input).forEach(([key, value]) => validateMeasurement(value, `${label}.${key}`));
  return input;
}

function validateFixture(input) {
  json.assertJsonSafe(input);
  Object.keys(input).forEach(field => assert(fixtureFields.has(field), `BatchSummary.fixture.${field} is unsupported`));
  ["fixtureId", "lifecycleGeneration", "comparability", "safeStop"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `BatchSummary.fixture.${field} is required`));
  validateCountMap(input.scope, "BatchSummary.fixture.scope");
  validateCountMap(input.counts, "BatchSummary.fixture.counts");
  validateCountMap(input.stageStates, "BatchSummary.fixture.stageStates");
  Object.values(input.metrics).forEach(metric => validateMetric(metric, `BatchSummary.fixture.metrics.${metric.name}`));
  validateCountMap(input.humanActions, "BatchSummary.fixture.humanActions");
  validateCountMap(input.workCounters, "BatchSummary.fixture.workCounters");
  assert(input.sourceIdentity && typeof input.sourceIdentity === "object", "BatchSummary.fixture.sourceIdentity is required");
  assert(Array.isArray(input.notes), "BatchSummary.fixture.notes is required");
  return json.immutableClone(input);
}

function validateBatchSummary(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === BATCH_SUMMARY_SCHEMA_VERSION, "BatchSummary/v2 schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `BatchSummary/v2.${field} is unsupported`));
  assert(typeof input.id === "string" && /^batch-summary\.[a-f0-9]{24}$/.test(input.id), "BatchSummary/v2.id is invalid");
  assert(input.id === batchSummaryId(input), "BatchSummary/v2.id is unstable");
  assert(input.scope && typeof input.scope.id === "string" && typeof input.scope.label === "string", "BatchSummary/v2.scope is incomplete");
  assert(Array.isArray(input.fixtures) && input.fixtures.length > 0, "BatchSummary/v2.fixtures are required");
  const fixtures = input.fixtures.map(validateFixture).sort((a, b) => a.fixtureId.localeCompare(b.fixtureId));
  assert(fixtures.every((item, index) => index === 0 || fixtures[index - 1].fixtureId.localeCompare(item.fixtureId) < 0), "BatchSummary/v2 fixture IDs must be unique and ordered");
  validateCountMap(input.aggregate, "BatchSummary/v2.aggregate");
  Object.values(input.metrics).forEach(metric => validateMetric(metric, `BatchSummary/v2.metrics.${metric.name}`));
  assert(SAFE_STOP_STATES.includes(input.safeStop), "BatchSummary/v2.safeStop is invalid");
  assert(input.boundary && input.boundary.productionMaterialization === false && input.boundary.evidenceMaterialization === false, "BatchSummary/v2 boundary is not read-only");
  assert(input.contractVersions && typeof input.contractVersions === "object", "BatchSummary/v2.contractVersions is required");
  return json.immutableClone({ ...input, fixtures });
}

module.exports = Object.freeze({ BATCH_SUMMARY_SCHEMA_VERSION, MEASUREMENT_STATES, SAFE_STOP_STATES, batchSummaryId, validateMeasurement, validateMetric, validateBatchSummary });
