"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const pipeline = require("../research/factory/automatic-pipeline.js");
const rules = require("../research/factory/deterministic-rule-library.js");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");
const waveH = require("../research/data/technical-research-factory-large-batch.js");
const waveI = require("../research/data/technical-research-factory-wave-i.js");
const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-i.json", "utf8"));

test("Wave I inventories all 25 original capability gaps exactly once", () => {
  const report = waveI.buildReport();
  assert.equal(report.capabilityGapInventory.total.value, 25);
  assert.equal(report.assertions.allGapsAccountedForExactlyOnce, true);
  assert.deepEqual(report.baseline.red, { value: 25, measurementState: "MEASURED", scope: "Wave I exact Wave H legitimate dataset", reason: "Directly observed deterministic execution" });
  assert.equal(report.assertions.selectedRecordCount, 2);
});

test("battery-capacity rule is strict, lossless and versioned", () => {
  const items = waveI.waveIInputs().filter(item => item.input.canonicalFieldId === "electrical.battery-capacity");
  assert.equal(items.length, 2);
  const results = items.map(item => rules.evaluate(rules.BATTERY_CAPACITY_RULE, item.input));
  assert.deepEqual(results.map(result => [result.state, result.output.unit]), [["APPLIED", "Ah"], ["APPLIED", "Ah"]]);
  results.forEach((result, index) => { assert.equal(result.rawValue, items[index].input.rawValue); assert.deepEqual(result.provenance, items[index].input.provenance); assert.deepEqual(result.applicability, items[index].input.applicability); assert.equal(result.condition, null); });
  assert.equal(rules.evaluate(rules.BATTERY_CAPACITY_RULE, { ...items[0].input, rawValue: "12 V, 11.2 Ah" }).state, "REJECTED");
  assert.equal(rules.evaluate(rules.BATTERY_CAPACITY_RULE, { ...items[0].input, rawValue: "11.2" }).reasonCode, "REQUIRED-UNIT-MISSING");
  const old = rules.createRule({ ...rules.BATTERY_CAPACITY_RULE, ruleVersion: "0.9.0" });
  assert.notEqual(old.id, rules.BATTERY_CAPACITY_RULE.id);
  assert.notEqual(rules.evaluate(old, items[0].input).id, results[0].id);
});

test("Wave I changes only the selected capability and preserves hostile regression", () => {
  const report = waveI.buildReport();
  assert.deepEqual(report.after.routes, { GREEN: 8, YELLOW: 1, RED: 23 });
  assert.deepEqual(report.after.counts.rulesApplied, { value: 8, measurementState: "MEASURED", scope: "Wave I exact Wave H legitimate dataset", reason: "Directly observed deterministic execution" });
  assert.equal(report.after.counts.newHumanAuthorizationsCreated.value, 0);
  assert.equal(report.assertions.pressureBoundaryPreserved, true);
  const hostile = pipeline.runAutonomousBatch(waveE.buildInputs());
  assert.deepEqual(hostile.records.map(record => record.routingResult.route).reduce((out, route) => { out[route] += 1; return out; }, { GREEN: 0, YELLOW: 0, RED: 0 }), { GREEN: 3, YELLOW: 2, RED: 4 });
  assert.deepEqual(waveH.buildReport().assertions.hostileRegression, [3, 2, 4]);
});

test("Wave I is deterministic, permutation-independent and read-only", () => {
  const inputs = waveI.waveIInputs();
  const before = JSON.stringify(inputs);
  const first = pipeline.runAutonomousBatch(inputs);
  assert.deepEqual(first, pipeline.runAutonomousBatch([...inputs].reverse()));
  assert.equal(JSON.stringify(inputs), before);
  assert.deepEqual(waveI.buildReport(), stored);
  assert.equal(stored.assertions.permutationIndependent, true);
  assert.equal(stored.externalSideEffects, false);
  assert.equal(stored.assertions.productionChanged, false);
});
