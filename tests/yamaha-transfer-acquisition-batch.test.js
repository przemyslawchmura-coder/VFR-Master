"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const execution = require("../research/data/yamaha-transfer-acquisition-batch-results.js");
const results = execution.runBatch();

test("fixed Yamaha batch resolves exactly the designed two editions", () => {
  assert.deepEqual(results.targetKeys, ["yamaha.mt-09.gen3", "yamaha.tenere-700.gen1"]);
  assert.deepEqual(results.targetResults.map(target => target.before), [0, 0]);
  assert.deepEqual(results.sources.map(source => source.years), [{ from: 2021, to: 2021 }, { from: 2019, to: 2019 }]);
  assert.ok(results.evidence.every(row => row.marketApplicability === "EU" && row.applicability.transmission === "manual" && row.applicability.abs === true));
});

test("official source identity and document deduplication are reproducible", () => {
  assert.deepEqual(results.sources.map(source => source.publicationId), ["B7N-28199-E0", "BW3-F8199-E0"]);
  assert.ok(results.sources.every(source => source.tier === "A" && source.sourceClass === "official-owner-manual" && source.officialHost === "cdn2.yamaha-motor.eu"));
  assert.ok(results.sources.every(source => /^[0-9a-f]{64}$/.test(source.contentHashSha256)));
  assert.equal(results.metrics.uniqueDocuments, 2);
  assert.equal(results.metrics.hostingLocations, 2);
  assert.equal(results.metrics.duplicateHostingLocations, 0);
});

test("execution exceeds practical thresholds without vanity substitution", () => {
  assert.equal(results.metrics.verifiedSlotsBefore, 0);
  assert.equal(results.metrics.verifiedSlotsAfter, 58);
  assert.equal(results.metrics.netNewVerifiedSlots, 58);
  assert.equal(results.metrics.practicalServiceFieldGain, 54);
  assert.equal(results.metrics.genericSpecificationGain, 4);
  assert.ok(results.targetResults.every(target => target.practicalGain === 27));
  assert.deepEqual(results.metrics.sourceTierDistribution, { A: 2, B: 0, C: 0, D: 0 });
});

test("equipment, ABS, chain and tire conditions remain explicit", () => {
  const mtRows = results.evidence.filter(row => row.catalogVariantKey === "yamaha.mt-09.gen3");
  const tenereRows = results.evidence.filter(row => row.catalogVariantKey === "yamaha.tenere-700.gen1");
  assert.ok(mtRows.every(row => row.applicability.equipment === "standard-mt09"));
  assert.ok(tenereRows.every(row => row.applicability.equipment === "standard-xtz690"));
  assert.equal(mtRows.find(row => row.canonicalFieldId === "final_drive.chain-slack").normalizedValue.condition, "unloaded-on-sidestand");
  assert.equal(tenereRows.find(row => row.canonicalFieldId === "tires_wheels.loaded-pressures").normalizedValue.excludedCondition, "off-road-200-kPa-front-rear");
  assert.equal(results.conflicts.length, 0);
});

test("source budget and researched-no-evidence outcomes are explicit", () => {
  assert.equal(results.metrics.primaryDocumentsUsed, 2);
  assert.equal(results.metrics.primaryDocumentBudget, 4);
  assert.equal(results.metrics.sourceBudgetExceeded, false);
  assert.equal(results.researchedNoEvidence.length, 20);
  assert.ok(results.targetResults.every(target => target.importantRemainingPracticalGaps.includes("torques.front-axle")));
});

test("machine-readable execution report is exactly reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/yamaha-transfer-acquisition-batch.json"), "utf8"));
  assert.deepEqual(stored, results);
});
