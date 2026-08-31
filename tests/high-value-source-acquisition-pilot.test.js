"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const pilot = require("../research/data/high-value-source-acquisition-pilot.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const results = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();

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

test("executed pilot meets practical and total slot thresholds reproducibly", () => {
  assert.deepEqual(results.selectedTargetKeys, pilot.targets.map(target => target.catalogVariantKey));
  assert.equal(results.metrics.serviceCoreBefore, 51);
  assert.equal(results.metrics.verifiedTargetSlotGain, 50);
  assert.equal(results.metrics.serviceCoreAfter, 101);
  assert.equal(results.metrics.practicalServiceFieldGain, 48);
  assert.equal(results.metrics.genericSpecificationGain, 2);
  assert.ok(results.metrics.verifiedTargetSlotGain >= pilot.success.minimumVerifiedTargetSlots);
  assert.ok(results.metrics.practicalServiceFieldGain >= pilot.success.minimumPracticalServiceFields);
  assert.equal(results.conflicts.length, 0);
});

test("executed pilot preserves source budget, document identity, and applicability", () => {
  assert.equal(results.metrics.documentsInspected, 5);
  assert.equal(results.metrics.uniqueDocuments, 5);
  assert.equal(results.metrics.hostingLocations, 6);
  assert.equal(results.metrics.duplicateHostingLocations, 1);
  assert.equal(results.metrics.documentsYieldingEvidence, 2);
  assert.equal(results.metrics.sourceBudgetExceeded, false);
  assert.deepEqual(results.metrics.sourceTierDistribution, { A: 5, B: 0, C: 0, D: 0 });
  const ncOil = results.evidence.filter(row => row.catalogVariantKey === "honda.nc750x.rh09-1" && row.canonicalFieldId === "lubrication.capacity-filter");
  assert.deepEqual(ncOil.map(row => row.applicability.transmission).sort(), ["dct", "manual"]);
  assert.equal(new Set(ncOil.map(row => row.normalizedValue)).size, 2);
  assert.ok(results.evidence.filter(row => row.catalogVariantKey === "honda.nc750x.rh09-1").every(row => row.marketApplicability === "EU"));
  assert.ok(results.evidence.every(row => row.proofStatus === "VERIFIED-DIRECT" && row.sourceTier === "A"));
});

test("pilot keeps blocked targets explicit and production isolated", () => {
  assert.equal(results.targetResults.find(row => row.catalogVariantKey === "honda.vfr800.rc46.vtec.gen1").gain, 0);
  assert.equal(results.targetResults.find(row => row.catalogVariantKey === "honda.africa-twin.crf1100l-1").gain, 0);
  assert.equal(results.researchedNoEvidence.length, 3);
  assert.ok(results.sources.every(source => source.targets.length === 1));
});
