"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const readiness = require("../research/data/cbr500r-pc70-promotion-readiness.js");
const applicability = require("../research/data/cbr500r-pc70-abs-applicability.js");

test("CBR500R readiness evaluates exactly one processing record through the generic gate", () => {
  const result = readiness.buildReadiness();
  assert.equal(result.state, "PROMOTION-READY");
  assert.equal(result.passed, true);
  assert.deepEqual(result.reasons, []);
  assert.equal(result.packet.processingState, "ACCEPTED-FOR-PROCESSING");
  assert.equal(result.packet.humanReviewDecision, "ACCEPT");
  assert.equal(result.packet.applicability.abs, "KNOWN");
  assert.equal(result.packet.rawValue, readiness.record.candidate.rawValue);
  assert.equal(result.packet.provenance.candidateId, readiness.record.candidateId);
  assert.equal(result.packet.id, factory.promotionCandidateId(result.packet));
});

test("CBR500R readiness is deterministic, immutable and does not promote", () => {
  const first = readiness.buildReport();
  assert.deepEqual(readiness.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/cbr500r-pc70-promotion-readiness.json"), "utf8")), first);
  assert.equal(first.originalApplicability.abs, null);
  assert.equal(first.packetApplicability.abs, "KNOWN");
  assert.equal(first.verifiedApplicability.abs, true);
  assert.equal(first.readiness.state, "PROMOTION-READY");
  assert.deepEqual(first.readiness.reasons, []);
  assert.equal(first.assertions.normalizationPerformed, false);
  assert.equal(first.assertions.promotionOccurred, false);
  assert.equal(first.assertions.productionChanged, false);
});

test("ABS applicability verification is deterministic, scoped and preserves the upstream unresolved state", () => {
  const first = applicability.buildReport();
  assert.deepEqual(applicability.buildReport(), first);
  assert.equal(first.sourceApplicabilityBefore.abs, null);
  assert.equal(first.verifiedApplicability.abs, true);
  assert.equal(first.verifiedApplicability.modelYear, 2024);
  assert.deepEqual(first.verifiedApplicability.market, ["USA", "Canada"]);
  assert.equal(first.assertions.upstreamArtifactsMutated, false);
  assert.equal(first.assertions.noNormalization, true);
  assert.equal(first.assertions.noConflictChange, true);
});
