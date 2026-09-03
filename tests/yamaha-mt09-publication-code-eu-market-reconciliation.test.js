"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const data = require("../research/data/yamaha-mt09-publication-code-eu-market-reconciliation.js");
const report = data.buildReport();
const registry = require("../data/technical/technical-profile-registry.js");

test("reconciliation is fixed to the exact target and publication codes", () => {
  assert.equal(report.target.catalogVariantKey, "yamaha.mt-09.gen3");
  assert.equal(report.target.year, 2021);
  assert.equal(report.target.market, "EU");
  assert.equal(report.publications.b7n.code, "B7N-28197-E0");
  assert.equal(report.publications.lit.code, "LIT-11616-34-61");
  assert.ok(data.RELATIONSHIPS.includes(report.reconciliation.relationship));
  assert.equal(report.reconciliation.relationship, "RELATIONSHIP-UNRESOLVED");
});

test("official identities and applicability remain explicit", () => {
  assert.equal(report.publications.b7n.officialIdentity, "NOT-AUTHENTICATED");
  assert.equal(report.publications.b7n.metadataAccessibility, "MIRROR-ONLY");
  assert.equal(report.publications.lit.officialIdentity, "AUTHENTICATED");
  assert.equal(report.publications.lit.metadataAccessibility, "ACCESSIBLE-OFFICIAL-HTML");
  assert.equal(report.publications.lit.fullContentAccessibility, "ACCESS-BLOCKED-AUTH");
  assert.equal(report.reconciliation.modelCodes.MTN890.mapsTo, "standard MT-09");
  assert.equal(report.reconciliation.modelCodes.MTN890D.mapsTo, "MT-09 SP");
  assert.equal(report.reconciliation.applicability.modelYear2021, "PROVEN for LIT USA; UNKNOWN for B7N EU");
  assert.equal(report.reconciliation.applicability.euMarket, "UNKNOWN");
  assert.equal(report.reconciliation.applicability.standardSpScope, "STANDARD-AND-SP-AMBIGUOUS");
  assert.equal(report.reconciliation.applicability.absReadiness, "UNKNOWN");
  assert.equal(report.reconciliation.applicability.equipmentReadiness, "UNKNOWN");
});

test("readiness is blocked and anti-loop state is exhausted", () => {
  assert.equal(report.reconciliation.primaryReadinessClassification, "ACCESS-BLOCKED");
  assert.equal(report.readinessGate.passed, false);
  assert.equal(report.readinessGate.rankingEligible, false);
  assert.equal(report.reconciliation.antiLoopClassification, "MT09-AUTHENTICATION-PATH-EXHAUSTED");
  assert.match(report.exactNextTask, /Ténéré 700 service-manual prospect BW3-F8197-E0/);
  assert.doesNotMatch(report.exactNextTask, /B7N-28197-E0 versus/);
});

test("reconciliation changes no evidence, coverage or production", () => {
  assert.equal(report.technicalValuesInspected, false);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.researchedNoEvidenceAdded, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
  assert.equal(report.runtimeChanged, false);
  assert.equal(report.catalogueChanged, false);
  assert.equal(report.cloudBackendChanged, false);
  assert.equal(report.vfr800ProductionChanged, false);
  assert.equal(report.unrelatedProspectsResearched, false);
  assert.deepEqual(registry.map(item => item.profileId), ["honda.vfr800.rc46-vtec-gen1.2002", "ducati.monster937.2021"]);
});
