"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dataset = require("../research/data/research-dataset.js");
const validator = require("../js/research/research-data-validator.js");
const reports = require("../js/research/research-report-generator.js");

const ROOT = path.resolve(__dirname, "..");
const clone = value => JSON.parse(JSON.stringify(value));
const hondaCatalog = require("../research/data/catalog/honda.js");
const yamahaCatalog = require("../research/data/catalog/yamaha.js");
const hondaCandidates = require("../research/data/candidates/honda.js");
const yamahaCandidates = require("../research/data/candidates/yamaha.js");

test("entire expanded research dataset is structurally valid", () => {
  assert.deepEqual(validator.validateResearchDataset(dataset), { valid: true, errors: [], warnings: [] });
});

test("Honda and Yamaha catalog expansions exceed their evidence-led targets", () => {
  assert.ok(dataset.catalog.filter(record => record.manufacturer === "Honda").length >= 50);
  assert.ok(dataset.catalog.filter(record => record.manufacturer === "Yamaha").length >= 40);
  assert.ok(hondaCatalog.every(record => record.manufacturer === "Honda"));
  assert.ok(yamahaCatalog.every(record => record.manufacturer === "Yamaha"));
});

test("all source and research IDs are globally unique", () => {
  const sourceIds = dataset.sources.map(source => source.id);
  const researchIds = [...dataset.catalog, ...dataset.candidates].map(record => record.researchRecordId);
  assert.equal(new Set(sourceIds).size, sourceIds.length);
  assert.equal(new Set(researchIds).size, researchIds.length);
});

test("all proposed keys are unique, normalized, and collision detection fails closed", () => {
  const keys = dataset.catalog.map(record => record.proposedCatalogVariantKey);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(keys.every(key => /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/.test(key)));
  const copy = clone(dataset);
  copy.catalog[1].proposedCatalogVariantKey = copy.catalog[0].proposedCatalogVariantKey;
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "DUPLICATE_PROPOSED_CATALOG_KEY"));
});

test("year boundaries are plausible and impossible years are rejected", () => {
  assert.ok(dataset.catalog.every(record => record.years.from >= 1885 && (record.years.to === null || record.years.to >= record.years.from)));
  const copy = clone(dataset); copy.catalog[0].years.from = 1700;
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "IMPOSSIBLE_YEAR"));
});

test("every source reference resolves and candidate points to a catalog key", () => {
  const sources = new Set(dataset.sources.map(source => source.id));
  const keys = new Set(dataset.catalog.map(record => record.proposedCatalogVariantKey));
  assert.ok([...dataset.catalog, ...dataset.candidates].every(record => record.sourceIds.length && record.sourceIds.every(id => sources.has(id))));
  assert.ok(dataset.candidates.every(candidate => keys.has(candidate.proposedCatalogVariantKey)));
  const copy = clone(dataset); copy.candidates[0].proposedCatalogVariantKey = "unknown.catalog.key";
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "UNKNOWN_CATALOG_KEY"));
});

test("research statuses and source types come from central registries", () => {
  assert.ok([...dataset.catalog, ...dataset.candidates].every(record => validator.RESEARCH_STATUSES.includes(record.status)));
  assert.ok(dataset.sources.every(source => validator.RESEARCH_SOURCE_TYPES.includes(source.type)));
});

test("technical candidate target is met only with official sourced records", () => {
  assert.ok(hondaCandidates.length + yamahaCandidates.length >= 100);
  const sourceMap = new Map(dataset.sources.map(source => [source.id, source]));
  assert.ok([...hondaCandidates, ...yamahaCandidates].every(candidate => candidate.sourceIds.every(id => sourceMap.get(id).type.startsWith("official-"))));
});

test("numeric normalized values require units", () => {
  const copy = clone(dataset);
  const candidate = copy.candidates.find(record => typeof record.normalizedCandidateValue === "number");
  candidate.unit = null;
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "MISSING_NORMALIZED_UNIT"));
});

test("numeric normalized ranges and applicability metadata fail closed", () => {
  const rangeCopy = clone(dataset);
  const rangeCandidate = rangeCopy.candidates.find(record => record.normalizedCandidateValue && typeof record.normalizedCandidateValue === "object" && record.normalizedCandidateValue.min !== undefined);
  rangeCandidate.unit = null;
  assert.ok(validator.validateResearchDataset(rangeCopy).errors.some(error => error.code === "MISSING_NORMALIZED_UNIT"));
  const applicabilityCopy = clone(dataset);
  applicabilityCopy.candidates[0].abs = "false";
  assert.ok(validator.validateResearchDataset(applicabilityCopy).errors.some(error => error.code === "INVALID_APPLICABILITY"));
});

test("conflict groups remain preserved and incomplete groups fail", () => {
  const copy = clone(dataset);
  copy.candidates[0].status = "conflicting";
  copy.candidates[0].conflictGroup = "conflict.synthetic";
  assert.ok(validator.validateResearchDataset(copy).errors.some(error => error.code === "INCOMPLETE_CONFLICT_GROUP"));
  const second = clone(copy.candidates[0]); second.researchRecordId = "candidate.synthetic.conflict"; second.rawValue = "different";
  copy.candidates.push(second);
  assert.equal(validator.validateResearchDataset(copy).errors.some(error => error.code === "INCOMPLETE_CONFLICT_GROUP"), false);
});

test("semantic duplicates remain warnings and are not deleted", () => {
  const copy = clone(dataset); const duplicate = clone(copy.candidates[0]); duplicate.researchRecordId = "candidate.synthetic.duplicate"; copy.candidates.push(duplicate);
  const result = validator.validateResearchDataset(copy);
  assert.ok(result.warnings.some(warning => warning.code === "DUPLICATE_CANDIDATE"));
  assert.equal(copy.candidates.length, dataset.candidates.length + 1);
});

test("unknown applicability remains null rather than false or empty equipment", () => {
  assert.ok([...hondaCatalog, ...yamahaCatalog].every(record => record.region === null && record.abs === null && record.equipment === null));
  assert.ok([...hondaCandidates, ...yamahaCandidates].every(record => record.abs === null && record.equipment === null));
});

test("validator and quality gate do not mutate the dataset", () => {
  const before = JSON.stringify(dataset);
  validator.validateResearchDataset(dataset);
  validator.buildResearchQualityGate(dataset);
  assert.equal(JSON.stringify(dataset), before);
});

test("dataset module merge is deterministic", () => {
  delete require.cache[require.resolve("../research/data/research-dataset.js")];
  const loadedAgain = require("../research/data/research-dataset.js");
  assert.deepEqual(loadedAgain, dataset);
});

test("report metrics are deterministic and match Honda/Yamaha coverage", () => {
  const first = reports.buildResearchMetrics(dataset);
  const second = reports.buildResearchMetrics(dataset);
  assert.deepEqual(first, second);
  assert.deepEqual({ honda: first.byManufacturer.Honda.technicalCandidates, yamaha: first.byManufacturer.Yamaha.technicalCandidates }, { honda: 112, yamaha: 148 });
  assert.deepEqual(first.totals, { sources: 53, manufacturers: 11, modelFamilies: 93, catalogRecords: 167, technicalCandidates: 274, conflicts: 0 });
});

test("automatic research quality gate reports zero structural errors", () => {
  assert.deepEqual(validator.buildResearchQualityGate(dataset), {
    passed: true, structuralErrors: 0, warnings: 0, catalogRecordsWithoutSources: 0,
    candidatesWithoutSources: 0, brokenSourceReferences: 0, invalidUrls: 0,
    duplicateIds: 0, duplicateProposedKeys: 0, invalidYearRanges: 0,
    candidatesWithUnknownCatalogKey: 0, incompleteConflicts: 0
  });
});

test("generated coverage reports contain the computed totals", () => {
  const catalogReport = fs.readFileSync(path.join(ROOT, "research/reports/motorcycle-catalog-coverage.md"), "utf8");
  const technicalReport = fs.readFileSync(path.join(ROOT, "research/reports/technical-data-coverage.md"), "utf8");
  assert.match(catalogReport, /Generation\/variant records: 167/);
  assert.match(technicalReport, /Technical candidates: 274/);
  assert.match(technicalReport, /Honda: 112 candidates/);
  assert.match(technicalReport, /Yamaha: 148 candidates/);
});

test("deep readiness metrics and report are deterministic", () => {
  const keys = ["honda.cbr500r.gen4", "yamaha.mt09.gen3", "yamaha.tenere700.gen1"];
  const first = reports.buildDeepProfileMetrics(dataset, keys);
  assert.deepEqual(first, reports.buildDeepProfileMetrics(dataset, keys));
  assert.equal(first["honda.cbr500r.gen4"].totalCandidates, 60);
  assert.equal(first["yamaha.mt09.gen3"].totalCandidates, 58);
  assert.equal(first["yamaha.tenere700.gen1"].totalCandidates, 60);
  assert.ok(Object.values(first).every(item => item.recommendation === "research-more"));
  assert.equal(reports.renderDeepProfileReadinessReport(dataset, keys).trimEnd(), fs.readFileSync(path.join(ROOT, "research/reports/deep-profile-readiness.md"), "utf8").trimEnd());
});
