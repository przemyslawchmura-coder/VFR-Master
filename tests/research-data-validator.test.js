"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const dataset = require("../research/data/research-dataset.js");
const validator = require("../js/research/research-data-validator.js");

const clone = value => JSON.parse(JSON.stringify(value));

test("research seed dataset passes staging validation", () => {
  const result = validator.validateResearchDataset(dataset);
  assert.deepEqual(result, { valid: true, errors: [], warnings: [] });
});

test("research validator detects duplicate source and research IDs", () => {
  const copy = clone(dataset);
  copy.sources.push(clone(copy.sources[0]));
  copy.candidates[1].researchRecordId = copy.candidates[0].researchRecordId;
  const codes = validator.validateResearchDataset(copy).errors.map(error => error.code);
  assert.ok(codes.includes("DUPLICATE_SOURCE_ID"));
  assert.ok(codes.includes("DUPLICATE_RESEARCH_RECORD_ID"));
});

test("research validator rejects invalid year ranges and proposed keys", () => {
  const copy = clone(dataset);
  copy.catalog[0].years = { from: 2025, to: 2020 };
  copy.catalog[0].proposedCatalogVariantKey = "Honda VFR";
  const codes = validator.validateResearchDataset(copy).errors.map(error => error.code);
  assert.ok(codes.includes("INVALID_YEAR_RANGE"));
  assert.ok(codes.includes("INVALID_PROPOSED_CATALOG_KEY"));
});

test("research validator rejects broken source references and malformed URLs", () => {
  const copy = clone(dataset);
  copy.sources[0].url = "javascript:alert(1)";
  copy.candidates[0].sourceIds = ["research.missing"];
  const codes = validator.validateResearchDataset(copy).errors.map(error => error.code);
  assert.ok(codes.includes("INVALID_SOURCE_URL"));
  assert.ok(codes.includes("UNKNOWN_SOURCE_ID"));
});

test("research conflicts preserve at least two candidates and are never resolved", () => {
  const copy = clone(dataset);
  copy.candidates[0].status = "conflicting";
  copy.candidates[0].conflictGroup = "conflict.oil.capacity";
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "INCOMPLETE_CONFLICT_GROUP"));
  const other = clone(copy.candidates[0]);
  other.researchRecordId = "candidate.conflict.second";
  other.rawValue = "different raw value";
  copy.candidates.push(other);
  assert.equal(validator.validateResearchDataset(copy).errors.some(error => error.code === "INCOMPLETE_CONFLICT_GROUP"), false);
});

test("research validator reports semantic duplicate candidates without deleting them", () => {
  const copy = clone(dataset);
  const duplicate = clone(copy.candidates[0]);
  duplicate.researchRecordId = "candidate.duplicate";
  copy.candidates.push(duplicate);
  const result = validator.validateResearchDataset(copy);
  assert.equal(result.valid, true);
  assert.ok(result.warnings.some(warning => warning.code === "DUPLICATE_CANDIDATE"));
  assert.equal(copy.candidates.length, dataset.candidates.length + 1);
});

test("research validation does not mutate staging data", () => {
  const before = JSON.stringify(dataset);
  validator.validateResearchDataset(dataset);
  assert.equal(JSON.stringify(dataset), before);
});
