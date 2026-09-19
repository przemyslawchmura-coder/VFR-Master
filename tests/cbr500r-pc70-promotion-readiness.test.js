"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const readiness = require("../research/data/cbr500r-pc70-promotion-readiness.js");

test("CBR500R readiness evaluates exactly one processing record through the generic gate", () => {
  const result = readiness.buildReadiness();
  assert.equal(result.state, "BLOCKED");
  assert.equal(result.passed, false);
  assert.deepEqual(result.reasons, ["absSufficient"]);
  assert.equal(result.packet.processingState, "ACCEPTED-FOR-PROCESSING");
  assert.equal(result.packet.humanReviewDecision, "ACCEPT");
  assert.equal(result.packet.applicability.abs, "UNKNOWN");
  assert.equal(result.packet.rawValue, readiness.record.candidate.rawValue);
  assert.equal(result.packet.provenance.candidateId, readiness.record.candidateId);
  assert.equal(result.packet.id, factory.promotionCandidateId(result.packet));
});

test("CBR500R readiness is deterministic, immutable and does not promote", () => {
  const first = readiness.buildReport();
  assert.deepEqual(readiness.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/cbr500r-pc70-promotion-readiness.json"), "utf8")), first);
  assert.equal(first.originalApplicability.abs, null);
  assert.equal(first.packetApplicability.abs, "UNKNOWN");
  assert.equal(first.readiness.state, "BLOCKED");
  assert.deepEqual(first.readiness.reasons, ["absSufficient"]);
  assert.equal(first.assertions.normalizationPerformed, false);
  assert.equal(first.assertions.promotionOccurred, false);
  assert.equal(first.assertions.productionChanged, false);
});
