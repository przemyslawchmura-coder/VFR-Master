"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const pilot = require("../research/data/high-value-source-acquisition-pilot.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");

test("high-value pilot is bounded and uses the shared Service Core", () => {
  assert.equal(pilot.validate(), true);
  assert.ok(pilot.targets.length >= 4 && pilot.targets.length <= 6);
  assert.equal(pilot.targets.length, 5);
  assert.equal(pilot.success.minimumPracticalServiceFields, 10);
  assert.equal(pilot.success.minimumVerifiedTargetSlots, 15);
  assert.ok(pilot.practicalServiceFields.every(field => pipeline.serviceCoreFields.includes(field)));
  assert.ok(pilot.genericSpecificationFields.every(field => pipeline.serviceCoreFields.includes(field)));
});

test("pilot prioritizes Tier A/B and has actionable stop rules", () => {
  assert.deepEqual(pilot.sourceOrder.slice(0, 2), ["A", "B"]);
  assert.ok(pilot.sourceTiers.A.some(item => /workshop|owner manual/.test(item)));
  assert.ok(pilot.stopConditions.some(item => /zero practical/.test(item)));
  assert.ok(pilot.success.requiredReportingMetrics.includes("practicalServiceFieldGain"));
});
