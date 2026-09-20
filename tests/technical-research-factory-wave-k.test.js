"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const waveK = require("../research/data/technical-research-factory-wave-k.js");

const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-k.json", "utf8"));

test("Wave K accounts for exactly 23 unsupported gaps and selects NONE", () => {
  const report = waveK.buildReport();
  assert.equal(report.verifiedInventory.exactGapCount.value, 23);
  assert.equal(report.verifiedInventory.uniqueRecordCount.value, 23);
  assert.equal(report.repeatedClasses.reduce((sum, item) => sum + item.count, 0), 16);
  assert.equal(report.singletonSummary.length, 7);
  assert.equal(report.independentAudit.verdict, "ACCEPT");
  assert.equal(report.selectedCapability, null);
});

test("Wave K preserves semantic boundaries and read-only routing", () => {
  const report = waveK.buildReport();
  assert.deepEqual(report.routingBefore, { GREEN: 8, YELLOW: 1, RED: 23 });
  assert.deepEqual(report.routingAfter, report.routingBefore);
  assert.deepEqual(report.affectedRecordIds, []);
  assert.equal(report.authorizationChanges, 0);
  assert.equal(report.implementationPerformed, false);
  assert.equal(report.productionBoundary.externalSideEffects, false);
  assert.equal(report.regression.batteryRecordsRemainSupported, true);
  assert.equal(report.regression.pressureBoundaryPreserved, true);
  assert.deepEqual(report.regression.waveGHostileRoutes, [3, 2, 4]);
  assert.equal(report.repeatedClasses.every(item => item.semanticAnalysis.sufficientToProposeContract === false), true);
});

test("Wave K report is deterministic and stored byte-for-byte", () => {
  assert.deepEqual(waveK.buildReport(), stored);
  assert.deepEqual(waveK.buildReport(), waveK.buildReport());
  assert.equal(waveK.buildReport().independentAudit.reportMatchesExecutableArtifacts, true);
});
