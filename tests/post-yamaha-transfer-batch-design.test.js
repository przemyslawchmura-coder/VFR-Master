"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const design = require("../research/data/post-yamaha-transfer-batch-design.js");
const report = design.buildReport();

test("design reproduces measured Honda and Yamaha yield", () => {
  assert.deepEqual(report.baseline.honda, { targets: 5, documents: 5, yieldingDocuments: 2, verifiedGain: 50, practicalGain: 48, genericGain: 2, before: 51, after: 101, conflicts: 0, practicalPerYieldingDocument: 24, practicalPerInspectedDocument: 9.6 });
  assert.deepEqual(report.baseline.yamaha, { targets: 2, documents: 2, yieldingDocuments: 2, verifiedGain: 58, practicalGain: 54, genericGain: 4, before: 0, after: 58, conflicts: 0, practicalPerYieldingDocument: 27, practicalPerInspectedDocument: 27 });
});

test("UNKNOWN prospects remain unranked and ineligible", () => {
  const unknown = report.candidates.filter(candidate => candidate.sourceProspect.certainty === "UNKNOWN");
  assert.equal(unknown.length, 5);
  assert.ok(unknown.every(candidate => candidate.score === null && candidate.status !== "SELECT"));
  assert.match(report.model.eligibility, /cannot be selected/);
});

test("score is marginal document yield adjusted for risk, not total gap", () => {
  const harley = report.candidates.find(candidate => candidate.status === "SELECT");
  assert.equal(harley.score, ((6 + 18) / 2) - 4);
  assert.equal(harley.remainingPracticalGap, 37);
  assert.match(report.model.marginalRule, /never all missing fields/);
});

test("selected batch is exactly one edition-scoped Harley target", () => {
  assert.deepEqual(report.selectedBatch.map(target => target.catalogVariantKey), ["harley-davidson.revolution-max.sportster-s"]);
  assert.deepEqual(report.selectedBatch[0].years, { from: 2022, to: 2022 });
  assert.deepEqual(report.selectedBatch[0].markets, ["USA"]);
  assert.equal(report.selectedBatch[0].abs, null);
  assert.equal(report.audit.controlIncluded, false);
});

test("batch budget and non-production gates are bounded", () => {
  assert.equal(report.acceptance.maximumPrimaryDocumentsOverall, 1);
  assert.equal(report.acceptance.minimumVerifiedGain, 8);
  assert.equal(report.acceptance.minimumPracticalGain, 6);
  assert.equal(report.acceptance.maximumTierCDPracticalContribution, 0);
  assert.equal(report.acceptance.unresolvedSafetyCriticalConflicts, 0);
  assert.equal(report.evidenceAcquired, false);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
});

test("machine-readable design report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/post-yamaha-transfer-batch-design.json"), "utf8"));
  assert.deepEqual(stored, report);
});
