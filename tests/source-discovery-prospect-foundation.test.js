"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const contracts = require("../research/factory/source-discovery-prospect-contracts.js");
const report = require("../research/data/source-discovery-prospect-foundation.js");

const queueTarget = { targetId: "fixture.model.2024", catalogVariantKey: "fixture.model", year: 2024, manufacturer: "Fixture Motor", family: "Fixture", generation: "I", applicability: { market: null, abs: null, transmission: null, equipment: null } };

test("queue target enters unresolved discovery without guessing applicability", () => {
  const candidate = contracts.candidateFromQueueTarget(queueTarget);
  assert.equal(candidate.state, "UNRESOLVED");
  assert.deepEqual(candidate.applicability.unresolvedDimensions, ["abs", "equipment", "market", "transmission"]);
  assert.equal(candidate.sourceRoute.officialUrl, null);
});

test("discovery, authentication and applicability remain separate", () => {
  const first = report.buildReport();
  assert.deepEqual(first.candidates.map(item => item.state), ["UNRESOLVED", "DISCOVERED", "APPLICABILITY-PARTIAL", "EXECUTION-READY"]);
  assert.equal(first.candidates[1].authenticationState, "UNKNOWN");
  assert.equal(first.candidates[2].state, "APPLICABILITY-PARTIAL");
  assert.equal(first.candidates[3].state, "EXECUTION-READY");
  assert.equal(first.productionChanged, false);
});

test("only a complete candidate transitions to the existing SourceProspect contract", () => {
  const ready = report.buildReport().candidates[3];
  const prospect = contracts.toExistingSourceProspect(ready);
  assert.equal(prospect.authenticationState, "AUTHENTICATED");
  assert.equal(prospect.readinessClassification, "EXECUTION-READY");
  assert.throws(() => contracts.toExistingSourceProspect(report.buildReport().candidates[2]), /not execution-ready/);
});

test("malformed identity, forged IDs and invalid conflicts fail closed", () => {
  const candidate = report.buildReport().candidates[0];
  assert.throws(() => contracts.validateCandidate({ ...candidate, targetId: "" }), /targetId/);
  assert.throws(() => contracts.validateCandidate({ ...candidate, id: "source-discovery-prospect.forged" }), /does not match/);
  assert.throws(() => contracts.validateCandidate({ ...candidate, applicability: { ...candidate.applicability, market: { state: "UNKNOWN", value: "EU" } } }), /must be null/);
  assert.throws(() => contracts.validateCandidate({ ...candidate, sourceRoute: { state: "KNOWN", officialUrl: "http://fixture.example/manual.pdf" } }), /official HTTPS/);
});

test("identical candidates reuse and conflicting candidates fail closed", () => {
  const candidate = report.buildReport().candidates[1];
  assert.equal(contracts.registerCandidates([candidate, candidate]).length, 1);
  const { id, state, ...candidateInput } = candidate;
  const conflicting = contracts.validateCandidate({ ...candidateInput, publication: { state: "KNOWN", value: "OTHER-2024-MANUAL" } });
  assert.throws(() => contracts.registerCandidates([candidate, conflicting]), /conflicting/);
});

test("synthetic report is deterministic", () => {
  const first = report.buildReport();
  assert.deepEqual(first, report.buildReport());
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/source-discovery-prospect-foundation.json", "utf8")), first);
});
