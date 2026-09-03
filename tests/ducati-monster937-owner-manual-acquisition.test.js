"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const acquisition = require("../research/data/ducati-monster937-owner-manual-acquisition.js");
const report = acquisition.runAcquisition();

test("acquires only the authenticated Ducati MY2021 EU owner manual", () => {
  assert.equal(report.reusedProspectId, "unknown.ducati.monster937");
  assert.equal(report.target.catalogVariantKey, "ducati.monster.937");
  assert.equal(report.source.tier, "A");
  assert.equal(report.source.sourceClass, "official-owner-manual");
  assert.match(report.source.url, /^https:\/\/downloads\.ctfassets\.net\/.*OM_-_Monster_937_-_937_Plus_-_EN_-_MY21\.pdf$/);
  assert.equal(report.preExtractionIdentityCheck.preExtractionCheckPassed, true);
  assert.equal(report.source.yieldedEvidence, false);
  assert.equal(report.metrics.primaryDocumentsUsed, 1);
});

test("raw candidates preserve exact Service Core scope and provenance", () => {
  assert.equal(report.rawCandidates.length, 27);
  assert.ok(report.rawCandidates.every(candidate => candidate.catalogVariantKey === "ducati.monster.937"));
  assert.ok(report.rawCandidates.every(candidate => candidate.sourceId === report.source.id));
  assert.ok(report.rawCandidates.every(candidate => candidate.printedPage && candidate.section && candidate.normalizationState === "UNNORMALIZED"));
  assert.ok(report.rawCandidates.every(candidate => candidate.applicability.abs === true && candidate.applicability.transmission === "manual"));
  assert.ok(report.rawCandidates.every(candidate => candidate.reviewState === "QUEUED" && candidate.proofStatus === "PRE-EVIDENCE-CANDIDATE"));
  assert.equal(new Set(report.rawCandidates.map(candidate => candidate.canonicalFieldId)).size, 27);
});

test("stops before human decision, evidence or production promotion", () => {
  assert.deepEqual(report.reviewDecisionCounts, { accepted: 0, rejected: 0, needsMoreReview: 0, queued: 27 });
  assert.equal(report.evidence.length, 0);
  assert.equal(report.metrics.serviceCoreBefore, 0);
  assert.equal(report.metrics.serviceCoreAfter, 0);
  assert.equal(report.metrics.practicalGain, 0);
  assert.equal(report.metrics.genericGain, 0);
  assert.equal(report.metrics.conflicts, 0);
  assert.equal(report.metrics.ambiguousFields, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
});

test("machine-readable report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/ducati-monster937-owner-manual-acquisition.json"), "utf8"));
  assert.deepEqual(stored, report);
});
