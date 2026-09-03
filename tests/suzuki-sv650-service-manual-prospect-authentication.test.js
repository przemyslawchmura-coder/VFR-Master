"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/suzuki-sv650-service-manual-prospect-authentication.js").buildReport();

test("selects the existing Suzuki SV650 prospect and official Tier A path", () => {
  assert.equal(report.target.catalogVariantKey, "suzuki.sv650.gen3");
  assert.equal(report.target.modelDesignation, "SV650A L9");
  assert.equal(report.prospect.id, "unknown.suzuki.sv650");
  assert.equal(report.prospect.sourceTier, "A");
  assert.equal(report.prospect.documentClass, "service manual");
  assert.equal(report.prospect.identity.authenticityVerified, true);
  assert.equal(report.prospect.identity.contentAccessible, false);
  assert.match(report.prospect.officialDelivery.path, /^https:\/\/motorcycle\.serviceportal\.suzuki\.eu\//);
});

test("keeps Suzuki applicability and readiness fail-closed", () => {
  assert.equal(report.prospect.applicability.year.state, "PARTIAL");
  assert.equal(report.prospect.applicability.euMarket.state, "PARTIAL");
  assert.equal(report.prospect.applicability.namedEquipment.state, "UNKNOWN");
  assert.equal(report.prospect.applicability.abs.state, "PARTIAL");
  assert.equal(report.prospect.applicability.transmission.state, "UNKNOWN");
  assert.equal(report.prospect.finalClassification, "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL");
  assert.equal(report.readinessGate.passed, false);
  assert.deepEqual(report.readinessGate.failed, ["yearKnown", "marketKnown", "safetyScopeSufficient"]);
});

test("creates no technical or production records", () => {
  assert.equal(report.externalResearchPerformed, true);
  assert.equal(report.technicalValuesInspected, false);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.rawCandidatesCreated, 0);
  assert.equal(report.reviewQueueRecordsCreated, 0);
  assert.equal(report.humanReviewDecisionsCreated, 0);
  assert.equal(report.evidenceProcessingRecordsCreated, 0);
  assert.equal(report.researchedNoEvidenceAdded, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
});

test("machine-readable report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/suzuki-sv650-service-manual-prospect-authentication.json"), "utf8"));
  assert.deepEqual(stored, report);
});
