"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const report = require("../research/data/yamaha-mt09-service-manual-prospect-authentication.js").buildReport();
const productionRegistry = require("../data/technical/technical-profile-registry.js");
const acquisitionStatus = require("../research/data/source-acquisition-status.js");

test("authentication is fixed to the MT-09 prospect and preserves identifiers", () => {
  assert.equal(report.target.catalogVariantKey, "yamaha.mt-09.gen3");
  assert.equal(report.target.year, 2021);
  assert.equal(report.target.market, "EU");
  assert.equal(report.prospect.b7n.publicationCode, "B7N-28197-E0");
  assert.equal(report.prospect.lit.publicationCode, "LIT-11616-34-61");
  assert.equal(report.prospect.codeRelationship.state, "UNRESOLVED");
  assert.equal(report.prospect.codeRelationship.provenEquivalent, false);
  const registered = acquisitionStatus.profiles["yamaha.mt09.gen3"].serviceManual;
  assert.equal(registered.codeRelationship, "RELATIONSHIP-UNRESOLVED");
  assert.equal(registered.contentAccessible, false);
  assert.equal(registered.authenticityVerified, false);
});

test("official access and applicability states remain explicit and fail closed", () => {
  assert.equal(report.prospect.lit.access, "ACCESS-BLOCKED-AUTH");
  assert.match(report.prospect.lit.officialDeliveryPath, /^https:\/\/www\.yamahapubs\.com\//);
  assert.equal(report.prospect.applicability.year.state, "KNOWN-US");
  assert.equal(report.prospect.applicability.euMarket.state, "UNKNOWN");
  assert.equal(report.prospect.applicability.standard.state, "KNOWN-US-METADATA");
  assert.equal(report.prospect.applicability.sp.state, "KNOWN-US-METADATA");
  assert.equal(report.prospect.applicability.standardSpSeparable.state, "UNKNOWN");
  assert.equal(report.prospect.applicability.abs.state, "UNKNOWN");
  assert.equal(report.prospect.applicability.equipment.state, "UNKNOWN");
  assert.equal(report.prospect.finalClassification, "ACCESS-BLOCKED");
  assert.equal(report.readinessGate.passed, false);
  assert.equal(report.readinessGate.rankingEligible, false);
  assert.ok(report.readinessGate.failed.includes("marketKnown"));
  assert.ok(report.readinessGate.failed.includes("accessibilityFeasible"));
  assert.ok(report.readinessGate.failed.includes("safetyScopeSufficient"));
});

test("authentication creates no technical evidence or coverage", () => {
  assert.equal(report.technicalValuesExtracted, false);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.researchedNoEvidenceAdded, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.deepEqual(report.reproducedOwnerManualResult, { before: 0, after: 29, verifiedGain: 29, practicalGain: 27, genericGain: 2, publicationId: "B7N-28199-E0" });
});

test("production and VFR800 remain isolated", () => {
  assert.equal(report.productionChanged, false);
  assert.equal(report.runtimeChanged, false);
  assert.equal(report.catalogueChanged, false);
  assert.equal(report.cloudBackendChanged, false);
  assert.equal(report.vfr800ProductionChanged, false);
  assert.deepEqual(productionRegistry.map(item => item.profileId), ["honda.vfr800.rc46-vtec-gen1.2002", "ducati.monster937.2021"]);
});
