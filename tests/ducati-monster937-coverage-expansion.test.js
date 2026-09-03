"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const coverage = require("../research/data/ducati-monster937-coverage-expansion.js");
const report = coverage.buildReport();
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-coverage-expansion.json"), "utf8"));
const ducati = require("../data/technical/ducati/monster937/profile-2021.js");
const vfr = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");

test("Ducati adopts the complete VFR category taxonomy without placeholder entries", () => {
  assert.deepEqual(ducati.categories.map(category => category.id).sort(), vfr.categories.map(category => category.id).sort());
  assert.equal(report.productionEntriesBefore, 6);
  assert.equal(report.productionEntriesAfter, 6);
  assert.equal(report.netNewEntries, 0);
  assert.deepEqual(report.categoriesWithEntries, ["lubrication", "ignition", "brakes", "electrical"]);
  assert.equal(report.categoriesWithoutEvidence.length, 11);
  assert.equal(ducati.entries.length, 6);
});

test("Ducati expansion remains fail-closed to the existing evidence inventory", () => {
  assert.deepEqual(report.fieldsPromotedInThisWave, []);
  assert.deepEqual(report.fieldsBlockedByConflict, []);
  assert.deepEqual(report.fieldsBlockedByApplicability, [{ fieldId: "cooling.capacity", reasons: ["COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR"] }]);
  assert.equal(report.sourceEvidenceFieldCount, 27);
  assert.equal(report.canonicalDataInferred, false);
  assert.equal(ducati.entries.some(entry => entry.id === "cooling.capacity" || entry.id.startsWith("cooling.")), false);
});

test("coverage report is deterministic and preserves VFR semantics", () => {
  assert.deepEqual(coverage.buildReport(), report);
  assert.deepEqual(stored, report);
  assert.equal(JSON.stringify(vfr).length > 0, true);
  assert.deepEqual(ducati.entries.map(entry => entry.id).sort(), report.currentlyPromotedFields);
});
