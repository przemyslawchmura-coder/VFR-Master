"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-owner-manual-prospect-registration.js").buildReport();

test("registers the exact Ducati Tier A prospect", () => {
  assert.equal(report.target.catalogVariantKey, "ducati.monster.937");
  assert.equal(report.target.year, 2021);
  assert.equal(report.target.market, "EU");
  assert.equal(report.prospect.id, "unknown.ducati.monster937");
  assert.equal(report.prospect.sourceTier, "A");
  assert.equal(report.prospect.documentClass, "owner manual");
  assert.match(report.prospect.officialDelivery.path, /^https:\/\/www\.ducati\.com\/ww\/en\/service-maintenance\/owner-manuals$/);
  assert.equal(report.prospect.applicability.sp.state, "EXCLUDED");
});

test("passes only the metadata readiness gate", () => {
  assert.equal(report.readinessGate.passed, true);
  assert.equal(report.prospect.finalClassification, "EXECUTION-READY");
  assert.equal(report.prospect.applicability.abs.state, "KNOWN-METADATA");
  assert.equal(report.prospect.applicability.transmission.state, "KNOWN-METADATA");
  assert.equal(report.prospect.identity.contentAccessible, false);
});

test("creates no technical or production records", () => {
  assert.equal(report.technicalValuesInspected, false);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.researchedNoEvidenceAdded, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
});

test("machine-readable report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/ducati-monster937-owner-manual-prospect-registration.json"), "utf8"));
  assert.deepEqual(stored, report);
});
