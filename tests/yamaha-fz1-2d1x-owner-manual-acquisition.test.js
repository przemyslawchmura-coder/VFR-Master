"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const acquisition = require("../research/data/yamaha-fz1-2d1x-owner-manual-acquisition.js");
const authentication = require("../research/data/yamaha-fz1-source-authentication.js");
const factory = require("../research/factory/index.js");

test("FZ1 acquisition selects only the authenticated 2D1X prospect", () => {
  assert.equal(acquisition.target.id, authentication.target.id);
  assert.equal(acquisition.prospect.publication.identifiers[0].value, "2D1X");
  assert.equal(acquisition.prospect.id.includes("2d1-28197-e0"), false);
  assert.deepEqual(acquisition.batchSetup.batch.targetIds, [authentication.target.id]);
  assert.equal(acquisition.batchSetup.sourceWorkItem.prospectId, acquisition.prospect.id);
});

test("acquisition preserves separate runtime identities and narrow applicability", () => {
  const report = acquisition.buildReport();
  assert.equal(report.targetResearchIdentity, "yamaha.fz1.gen2");
  assert.deepEqual(authentication.target.identityMapping.runtimeIdentities.map(item => item.catalogVariantKey), ["yamaha.fz1.gen2.n", "yamaha.fz1.gen2.s"]);
  assert.deepEqual(report.applicabilityBefore, report.applicabilityAfter);
  assert.equal(report.applicabilityAfter.market, "UNKNOWN");
  assert.equal(report.applicabilityAfter.abs, "UNKNOWN");
  assert.equal(report.applicabilityAfter.equipment, "UNKNOWN");
  assert.equal(report.applicabilityAfter.emissions, "UNKNOWN");
});

test("official provenance, artifact identity and content identity are deterministic", () => {
  const first = acquisition.buildReport();
  const second = acquisition.buildReport();
  assert.deepEqual(first, second);
  assert.equal(first.provenance.classification, "OFFICIAL-YAMAHA-DIRECT");
  assert.match(first.acquisition.outcome.artifact.contentDigest, /^[a-f0-9]{64}$/);
  assert.equal(first.acquisition.outcome.artifact.id, factory.artifactId({ prospectId: acquisition.prospect.id, attemptId: "attempt.000000000000000000000000", mediaType: "application/pdf", contentDigest: first.acquisition.outcome.artifact.contentDigest, locator: acquisition.finalLocation }));
});

test("HTML/error responses cannot masquerade as acquired PDF", () => {
  assert.equal(acquisition.classifyResponse({ httpStatus: 200, contentType: "text/html", byteLength: 100, signature: "<html>" }), "REJECTED-UNEXPECTED-DOCUMENT");
  assert.equal(acquisition.classifyResponse({ httpStatus: 404, contentType: "application/pdf", byteLength: 100, signature: "%PDF-1.3" }), "REJECTED-UNEXPECTED-DOCUMENT");
});

test("acquisition remains outside extraction, review, evidence and production", () => {
  const report = acquisition.buildReport();
  assert.equal(report.technicalValuesExtracted, false);
  assert.equal(report.rawCandidatesCreated, 0);
  assert.equal(report.reviewQueueEntriesCreated, 0);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
  assert.equal(report.twoD1ServiceLead.touched, false);
});
