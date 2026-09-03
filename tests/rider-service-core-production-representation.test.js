"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const contracts = require("../data/technical/rider-service-core-records.js");
const projection = require("../research/data/ducati-monster937-rider-service-core-production-representation.js");
const report = projection.buildReport();

test("generic contract supports scalar and structured repeating records without mutation", () => {
  const applicability = { modelYear: 2021, market: "EU", equipment: "standard", abs: true, transmission: "manual" };
  const provenance = { sourceId: "source.synthetic", documentId: "doc.synthetic", sourceLocation: { page: 1 } };
  const input = { canonicalFieldId: "maintenance.inspect", recordType: "repeating", structureType: "maintenance", rawValue: "inspect chain", rawUnit: null, details: { sourceText: "inspect chain", action: "INSPECT", association: { subject: "drive-chain" } }, applicability, provenance };
  const before = JSON.stringify(input);
  const record = contracts.createRecord(input);
  assert.equal(record.schemaVersion, contracts.SCHEMA_VERSION);
  assert.equal(record.details.action, "INSPECT");
  assert.equal(JSON.stringify(input), before);
  assert.equal(contracts.createRecord(input).id, record.id);
  assert.throws(() => contracts.createRecord({ ...input, details: { sourceText: "inspect chain", action: "INSPECT", association: {} }, rawValue: undefined }), /rawValue/);
});

test("Ducati processed records are all representable and excluded inputs remain excluded", () => {
  assert.equal(report.processedInputsInspected, 39);
  assert.equal(report.losslesslyRepresentable, 39);
  assert.equal(report.stillNotRepresentable, 0);
  assert.deepEqual(report.remainingStructuralBlockers, []);
  assert.equal(report.recordTypes.repeating > 0, true);
  assert.equal(report.records.some(record => record.canonicalFieldId === "cooling.capacity"), false);
  assert.equal(report.excludedNeedsMoreReview, 5);
  assert.equal(report.productionDucatiChanged, false);
  assert.equal(report.productionDucatiEntryCount, 6);
  assert.equal(report.vfrChanged, false);
});

test("production representation report is deterministic", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-production-representation.json"), "utf8"));
  assert.deepEqual(stored, report);
  assert.deepEqual(projection.buildReport(), report);
});
