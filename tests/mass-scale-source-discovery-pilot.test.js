"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const pilot = require("../research/data/mass-scale-source-discovery-pilot.js");
const contracts = require("../research/factory/source-discovery-prospect-contracts.js");

test("uses exactly the approved ten-target plan and preserves before states", () => {
  const report = pilot.buildReport();
  assert.equal(report.targetsConsidered, 10);
  assert.equal(report.targetsSelected, 10);
  assert.deepEqual(report.beforeReadiness, { READY: 0, BLOCKED: 1, EXHAUSTED: 1, UNRESOLVED: 8 });
  assert.equal(new Set(report.targets.map(item => item.targetId)).size, 10);
});

test("official route discovery remains distinct from readiness", () => {
  const report = pilot.buildReport();
  assert.equal(report.metrics.officialRoutesFound, 6);
  assert.equal(report.metrics.executionReady, 0);
  assert.equal(report.afterDiscoveryStates["EXECUTION-READY"], 0);
  assert.ok(report.targets.some(item => item.after === "APPLICABILITY-PARTIAL"));
  assert.ok(report.targets.some(item => item.after === "DISCOVERED"));
  assert.ok(report.targets.some(item => item.after === "UNRESOLVED"));
});

test("unknown applicability and no downstream state are preserved", () => {
  const report = pilot.buildReport();
  const honda = report.targets.find(item => item.catalogVariantKey === "honda.africa-twin.crf1000l");
  assert.deepEqual(honda.candidate.applicability.unresolvedDimensions, ["abs", "equipment", "market", "model", "transmission", "year"]);
  assert.equal(report.safeForAcquisition, false);
  assert.deepEqual(report.sourceProspectsCreated, []);
  assert.equal(report.acquisitionPerformed, false);
  assert.equal(report.researchStateCreated, false);
});

test("malformed and conflicting discovery identities fail closed", () => {
  const candidate = pilot.buildReport().targets.find(item => item.catalogVariantKey === "bmw.c-scooter.c600-sport").candidate;
  assert.throws(() => contracts.validateCandidate({ ...candidate, targetId: "" }), /targetId/);
  assert.throws(() => contracts.validateCandidate({ ...candidate, id: "source-discovery-prospect.forged" }), /does not match/);
  assert.throws(() => contracts.validateCandidate({ ...candidate, applicability: { ...candidate.applicability, market: { state: "UNKNOWN", value: "EU" } } }), /must be null/);
});

test("pilot report is deterministic and persisted", () => {
  const first = pilot.buildReport();
  assert.deepEqual(first, pilot.buildReport());
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/mass-scale-source-discovery-pilot.json", "utf8")), first);
});
