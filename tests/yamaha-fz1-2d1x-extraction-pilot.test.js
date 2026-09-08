"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const pilot = require("../research/data/yamaha-fz1-2d1x-extraction-pilot.js");
const plan = require("../research/data/yamaha-fz1-2d1x-extraction-plan.js");
const acquisition = require("../research/data/yamaha-fz1-2d1x-owner-manual-acquisition.js");

const pdfPath = "/private/tmp/fz1-2d1x.pdf";
const available = require("node:fs").existsSync(pdfPath);

test("pilot uses the exact acquired artifact and generic raw-readiness gate", { skip: !available }, () => {
  const report = pilot.runPilot({ pdfPath });
  assert.equal(report.artifactId, acquisition.buildArtifact().id);
  assert.equal(report.artifactSha256, plan.EXPECTED_SHA256);
  assert.equal(report.readiness.classification, "RAW-EXTRACTION-READY");
  assert.equal(report.readiness.downstream.evidenceReady, false);
  assert.equal(report.approvedRegions.length, 6);
  assert.equal(report.budget.consumedRawCandidates <= 24, true);
});

test("pilot output is raw-only, applicability-bound and provenance-complete", { skip: !available }, () => {
  const report = pilot.runPilot({ pdfPath });
  assert.equal(report.candidates.length > 0, true);
  assert.equal(report.candidates.every(candidate => candidate.artifactId.startsWith("artifact.")), true);
  assert.equal(report.candidates.every(candidate => candidate.context.derivedContentId), true);
  assert.equal(report.candidates.every(candidate => candidate.sourceLocation.page && candidate.sourceLocation.section && candidate.sourceLocation.locator && candidate.sourceLocation.tableOrSubsection), true);
  assert.equal(report.candidates.every(candidate => candidate.applicability.market === "UNKNOWN" && candidate.applicability.abs === "UNKNOWN"), true);
  assert.equal(report.candidates.some(candidate => candidate.context.condition), true);
  assert.equal(report.reviewDecisionsCreated, 0);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
  assert.deepEqual(report, pilot.buildReport({ pdfPath }));
});

test("repeated pilot is deterministic and remains inside the six-region boundary", { skip: !available }, () => {
  assert.deepEqual(pilot.runPilot({ pdfPath }), pilot.runPilot({ pdfPath }));
  assert.deepEqual(pilot.runPilot({ pdfPath }).approvedRegions.map(region => region.pages), plan.allowedRegions.map(region => region.pdfPages));
  assert.equal(pilot.runPilot({ pdfPath }).candidates.some(candidate => candidate.applicability.model.includes("FZ1-S")), false);
  assert.equal(pilot.runPilot({ pdfPath }).candidates.some(candidate => candidate.applicability.modelYear !== 2010), false);
});

test("changed parent bytes fail before extraction and the service lead remains untouched", () => {
  assert.throws(() => factory.validateParentBytes(pilot.artifact, Buffer.from("changed PDF")), /digest mismatch/);
  assert.equal(plan.buildPlan().serviceManualLeadTouched, false);
  assert.equal(acquisition.buildReport().twoD1ServiceLead.touched, false);
});
