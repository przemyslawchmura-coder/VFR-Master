"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const design = require("../research/data/post-pilot-scaling-reassessment.js");
const pilot = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const catalog = require("../scripts/motorcycle-catalog-report.js").loadCatalog();
const report = design.buildReport();

test("reassessment reproduces the executed pilot instead of changing its semantics", () => {
  assert.deepEqual(report.pilotBaseline, {
    classification: "ACCEPT-WITH-RISKS", targets: 5, serviceCoreBefore: pilot.metrics.serviceCoreBefore,
    serviceCoreAfter: pilot.metrics.serviceCoreAfter, verifiedGain: pilot.metrics.verifiedTargetSlotGain,
    practicalGain: pilot.metrics.practicalServiceFieldGain, genericGain: pilot.metrics.genericSpecificationGain,
    documentsInspected: pilot.metrics.documentsInspected, uniqueDocuments: pilot.metrics.uniqueDocuments,
    yieldingDocuments: pilot.metrics.documentsYieldingEvidence, sourceTiers: pilot.metrics.sourceTierDistribution,
    evidenceRows: pilot.metrics.evidenceRowsProduced, conflicts: pilot.metrics.conflictsDiscovered,
    sourceBudgetExceeded: pilot.metrics.sourceBudgetExceeded, productionChanged: false, vfrProductionChanged: false
  });
});

test("candidate pool is bounded, cross-manufacturer, and UNKNOWN prospects stay unranked", () => {
  assert.equal(design.candidates.length, 10);
  assert.equal(new Set(design.candidates.map(candidate => candidate.manufacturer)).size, 7);
  assert.ok(design.candidates.filter(candidate => candidate.officialSourceProspects === "UNKNOWN").every(candidate => candidate.totalScore === null));
  assert.match(design.rubric.unknownRule, /not selectable/);
});

test("selected targets resolve to catalogue identities and remain narrowly edition-scoped", () => {
  const keys = new Set(catalog.flatMap(brand => brand.models.flatMap(model => model.variants.map(variant => variant.key))));
  assert.deepEqual(design.selectedBatch.map(target => target.catalogVariantKey), ["yamaha.mt-09.gen3", "yamaha.tenere-700.gen1"]);
  assert.ok(design.selectedBatch.every(target => keys.has(target.catalogVariantKey) && target.years.from === target.years.to && target.startingCoverage === 0));
  assert.deepEqual(design.selectedBatch.map(target => target.transmission), ["manual", "manual"]);
});

test("thresholds reward practical Tier A/B yield and keep the batch bounded", () => {
  assert.equal(design.acceptance.minimumVerifiedSlotGain, 24);
  assert.equal(design.acceptance.minimumPracticalServiceSlotGain, 22);
  assert.equal(design.acceptance.maximumPrimaryDocumentsOverall, 4);
  assert.equal(design.acceptance.maximumTierCDPracticalEvidenceRows, 0);
  assert.equal(design.acceptance.unresolvedSafetyCriticalConflicts, 0);
  assert.equal(design.audit.classification, "ACCEPT-WITH-RISKS");
});

test("machine-readable companion is exactly reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/post-pilot-scaling-reassessment.json"), "utf8"));
  assert.deepEqual(stored, report);
});
