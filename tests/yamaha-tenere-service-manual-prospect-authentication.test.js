"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/yamaha-tenere-service-manual-prospect-authentication.js").buildReport();
const acquisitionStatus = require("../research/data/source-acquisition-status.js");

test("authenticates only BW3-F8197-E0 identity and official delivery", () => {
  assert.equal(report.prospect.publication, "BW3-F8197-E0");
  assert.equal(report.prospect.identity.state, "AUTHENTICATED-METADATA");
  assert.equal(report.prospect.identity.contentAccessible, false);
  assert.equal(report.prospect.identity.authenticityVerified, true);
  assert.equal(report.prospect.officialDelivery.classification, "ACCESS-BLOCKED-AUTH");
  assert.match(report.prospect.officialDelivery.path, /^https:\/\/rmi\.yamaha-motor\.eu\//);
  assert.equal(acquisitionStatus.profiles["yamaha.tenere700.gen1"].serviceManual.contentAccessible, false);
});

test("keeps exact applicability fail-closed", () => {
  assert.equal(report.prospect.applicability.model.state, "KNOWN-METADATA");
  assert.equal(report.prospect.applicability.year.state, "UNRESOLVED-MISMATCH");
  assert.equal(report.prospect.applicability.euMarket.state, "UNRESOLVED");
  assert.equal(report.prospect.applicability.abs.state, "UNKNOWN");
  assert.equal(report.prospect.applicability.transmission.state, "UNKNOWN");
  assert.equal(report.readinessGate.passed, false);
  assert.deepEqual(report.readinessGate.failed, ["yearKnown", "marketKnown", "safetyScopeSufficient"]);
});

test("creates no technical or downstream research records", () => {
  assert.equal(report.technicalValuesInspected, false);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.rawCandidatesCreated, 0);
  assert.equal(report.reviewQueueRecordsCreated, 0);
  assert.equal(report.humanReviewDecisionsCreated, 0);
  assert.equal(report.evidenceProcessingRecordsCreated, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
});

test("machine-readable report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/yamaha-tenere-service-manual-prospect-authentication.json"), "utf8"));
  assert.deepEqual(stored, report);
});
