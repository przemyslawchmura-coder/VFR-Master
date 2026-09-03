"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const projection = require("../research/data/ducati-monster937-rider-service-core-promotion-readiness.js");
const report = projection.buildReport();

test("exactly 39 processed Ducati records receive one fail-closed readiness outcome", () => {
  assert.equal(report.processedInputsReceived, 39);
  assert.equal(report.outcomes.length, 39);
  assert.equal(new Set(report.outcomes.map(item => item.candidateId)).size, 39);
  assert.equal(report.promotionReady, 0);
  assert.equal(report.productionRepresentationBlocked, 39);
  assert.equal(report.structuralRepresentationBlocked, 1);
  assert.equal(report.provenanceApplicabilityConflictBlocked, 0);
  assert.equal(report.otherReadinessOutcomes, 0);
  assert.equal(report.duplicatesOrCollisions, 0);
  assert.ok(report.outcomes.every(item => item.gateState === "PROMOTION-READY" && item.readinessState === "BLOCKED"));
});

test("structured evidence remains associated and excluded inputs stay excluded", () => {
  assert.equal(report.maintenanceReadiness.inputs, 6);
  assert.equal(report.maintenanceReadiness.semanticsPreserved, true);
  assert.equal(report.fuseReadiness.inputs, 1);
  assert.equal(report.fuseReadiness.associationPreserved, false);
  assert.equal(report.fuseReadiness.blocked, 1);
  assert.equal(report.lightingReadiness.inputs, 6);
  assert.equal(report.lightingReadiness.semanticsPreserved, true);
  assert.deepEqual(report.coolingCapacity, { entered: false, state: "BLOCKED", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" });
  assert.equal(report.excludedNeedsMoreReview, 5);
});

test("production and upstream research remain unchanged", () => {
  assert.equal(report.productionDucatiChanged, false);
  assert.equal(report.productionDucatiEntryCount, 6);
  assert.equal(report.vfrChanged, false);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.humanReviewDecisionsChanged, false);
  assert.ok(report.outcomes.every(item => item.provenance.candidateId && item.rawValue !== null && item.applicability.modelYear === "KNOWN"));
});

test("promotion-readiness report is deterministic", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-promotion-readiness.json"), "utf8"));
  assert.deepEqual(stored, report);
  assert.deepEqual(projection.buildReport(), report);
});
