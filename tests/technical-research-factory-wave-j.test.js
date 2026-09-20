"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const pipeline = require("../research/factory/automatic-pipeline.js");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");
const waveH = require("../research/data/technical-research-factory-large-batch.js");
const waveI = require("../research/data/technical-research-factory-wave-i.js");
const waveD = require("../research/data/technical-research-factory-rule-library.js");
const waveJ = require("../research/data/technical-research-factory-wave-j.js");
const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-j.json", "utf8"));

test("Wave J verifies exactly 23 remaining unsupported records", () => {
  const report = waveJ.buildReport();
  assert.equal(report.verifiedInventory.unsupportedCount.value, 23);
  assert.equal(report.verifiedInventory.uniqueRecordCount.value, 23);
  assert.equal(report.assertions.all23AccountedExactlyOnce, true);
  assert.equal(report.verifiedInventory.pressureYellowExcluded, true);
  assert.equal(report.selectedCapability, null);
});

test("Wave J decision-only analysis preserves all repeated semantic boundaries", () => {
  const report = waveJ.buildReport();
  assert.deepEqual(report.repeatedCandidateClasses.map(item => [item.capabilityClass, item.count]), [
    ["LUBRICATION-SPECIFICATION-TEXT", 4],
    ["LIGHTING-COMPONENT-SPECIFICATION", 4],
    ["OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE", 2],
    ["TIRE-SIZE-STRUCTURED", 2],
    ["BATTERY-SPECIFICATION-TEXT", 2],
    ["BRAKE-FLUID-SPECIFICATION-TEXT", 2]
  ]);
  assert.equal(report.repeatedCandidateClasses.every(item => item.decision === "DEFERRED-UNSAFE"), true);
  assert.equal(report.singletonDispositions.length, 7);
  assert.equal(report.assertions.pressureBoundaryPreserved, true);
});

test("Wave J rerun is unchanged, deterministic and preserves Wave G/I behavior", () => {
  const report = waveJ.buildReport();
  assert.deepEqual(report.before, { GREEN: 8, YELLOW: 1, RED: 23 });
  assert.deepEqual(report.after, report.before);
  assert.equal(report.authorization.newCreated.value, 0);
  assert.equal(report.assertions.permutationIndependent, true);
  assert.equal(report.assertions.batteryRecordsRemainSupported, true);
  const hostile = pipeline.runAutonomousBatch(waveE.buildInputs());
  assert.deepEqual(hostile.records.map(record => record.routingResult.route).reduce((out, route) => { out[route] += 1; return out; }, { GREEN: 0, YELLOW: 0, RED: 0 }), { GREEN: 3, YELLOW: 2, RED: 4 });
  assert.deepEqual(waveH.buildReport().assertions.hostileRegression, [3, 2, 4]);
  assert.deepEqual(waveI.buildReport(), JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-i.json", "utf8")));
  assert.deepEqual(waveD.buildReport(), JSON.parse(fs.readFileSync("research/reports/technical-research-factory-rule-library.json", "utf8")));
});

test("Wave J report is stored deterministically and remains read-only", () => {
  assert.deepEqual(waveJ.buildReport(), stored);
  const report = waveJ.buildReport();
  assert.equal(report.assertions.noCapabilityImplemented, true);
  assert.equal(report.assertions.externalSideEffects, false);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.exceptions.records.value, 24);
  assert.equal(report.exceptions.groups.value, 24);
});
