"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const pilot = require("../research/data/mass-scale-blocker-resolution-pilot.js");

test("consumes exactly the ten discovery-pilot targets", () => {
  const report = pilot.buildReport();
  assert.equal(report.targetsConsidered, 10);
  assert.equal(report.targets.length, 10);
  assert.equal(Object.keys(report.beforeStates).length, 10);
});

test("BMW blocker resolution reaches an execution-ready projection only", () => {
  const report = pilot.buildReport();
  const bmw = report.targets.find(item => item.catalogVariantKey === "bmw.c-scooter.c600-sport");
  assert.equal(bmw.before, "APPLICABILITY-PARTIAL");
  assert.equal(bmw.after, "EXECUTION-READY");
  assert.match(bmw.readyProspectProjectionId, /^prospect\./);
  assert.equal(bmw.sourceProspectCreated, false);
  assert.equal(bmw.acquisitionAllowed, false);
});

test("KTM resolves only proven ABS and EU identity", () => {
  const report = pilot.buildReport();
  const ktm = report.targets.find(item => item.catalogVariantKey === "ktm.390-duke.gen1");
  assert.equal(ktm.after, "APPLICABILITY-PARTIAL");
  assert.equal(ktm.candidate.applicability.abs.value, true);
  assert.equal(ktm.candidate.applicability.market.value, "EU");
  assert.deepEqual(ktm.candidate.applicability.unresolvedDimensions, ["equipment", "transmission"]);
});

test("unknowns and downstream boundaries remain fail-closed", () => {
  const report = pilot.buildReport();
  assert.equal(report.metrics.executionReady, 1);
  assert.equal(report.safeForAcquisition, false);
  assert.deepEqual(report.sourceProspectsCreated, []);
  assert.equal(report.acquisitionPerformed, false);
  assert.equal(report.extractionPerformed, false);
  assert.equal(report.productionChanged, false);
  const honda = report.targets.find(item => item.catalogVariantKey === "honda.africa-twin.crf1000l");
  assert.equal(honda.after, "UNRESOLVED");
  assert.deepEqual(honda.candidate.applicability.unresolvedDimensions, ["abs", "equipment", "market", "model", "transmission", "year"]);
});

test("resolution report is deterministic and persisted", () => {
  const first = pilot.buildReport();
  assert.deepEqual(first, pilot.buildReport());
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/mass-scale-blocker-resolution-pilot.json", "utf8")), first);
});
