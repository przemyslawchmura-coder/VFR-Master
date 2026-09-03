"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const data = require("../research/data/bmw-f900r-owner-manual-acquisition.js");

test("acquires only the authenticated BMW MY2020 EU F 900 R 0K11 source", () => {
  const result = data.runAcquisition();
  assert.equal(result.source.publicationId, "F_0K11_RM_0520_76.pdf");
  assert.equal(result.source.authenticationState, "OFFICIAL-BMW-MY2020-EU-F900R-0K11-CONFIRMED");
  assert.deepEqual(result.source.models, ["F 900 R (0K11)"]);
  assert.deepEqual(result.source.years, { from: 2020, to: 2020 });
  assert.deepEqual(result.source.markets, ["EU"]);
  assert.equal(result.execution.outcome.outcome, "ACQUIRED");
  assert.equal(result.extraction.disposition, "CANDIDATES-PRODUCED");
});

test("preserves raw candidates, provenance and applicability at the queue boundary", () => {
  const result = data.runAcquisition();
  assert.equal(result.rawCandidates.length, result.reviewQueueEntries.length);
  assert.ok(result.rawCandidates.length > 0);
  result.reviewQueueEntries.forEach(entry => {
    const candidate = result.rawCandidates.find(item => item.id === entry.candidateId);
    assert.equal(entry.state, "QUEUED");
    assert.deepEqual(entry.candidate, candidate);
    assert.equal(candidate.sourceLocation.locator.startsWith("F_0K11_RM_0520_76.pdf#pdf-page-"), true);
    assert.deepEqual(candidate.applicability, { model: "F 900 R", modelCode: "0K11", generation: "I", year: 2020, market: "EU", equipment: "standard road model", excludedEquipment: ["F 900 R A2 (0K31)", "F 900 XR"], transmission: "manual", abs: true });
    assert.equal(candidate.context.scope, "base F 900 R standard road model");
  });
  assert.equal(result.metrics.ambiguousCandidates, 0);
  assert.equal(result.metrics.conflictingCandidates, 0);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
  assert.equal(result.productionChanged, false);
});

test("acquisition report is deterministic and stored output matches", () => {
  const first = data.runAcquisition();
  assert.deepEqual(data.runAcquisition(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/bmw-f900r-owner-manual-acquisition.json"), "utf8")), first);
});
