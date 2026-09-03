"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const acquisition = require("../research/data/ducati-monster937-rider-service-core-acquisition.js");
const review = require("../research/data/ducati-monster937-rider-service-core-human-review.js");
const result = review.buildReport();

test("exactly the 44 new candidates receive one canonical decision", () => {
  assert.equal(result.candidatesReviewed, 44);
  assert.deepEqual(result.decisionCounts, { ACCEPT: 39, REJECT: 0, BLOCKED: 0, "NEEDS-MORE-REVIEW": 5, clarificationRequired: 5 });
  assert.equal(result.decisions.decisions.length, 44);
  assert.equal(new Set(result.decisions.decisions.map(decision => decision.candidateId)).size, 44);
  assert.equal(result.noCandidateDisappeared, true);
  assert.equal(result.oneDecisionPerCandidate, true);
  assert.equal(result.decisions.decisions.every(decision => ["ACCEPT", "REJECT", "NEEDS-MORE-REVIEW"].includes(decision.decision)), true);
});

test("raw values and provenance remain unchanged and cooling stays fail-closed", () => {
  assert.equal(result.rawValuesAndProvenanceUnchanged, true);
  assert.deepEqual(result.blockedFields, [{ field: "cooling.capacity", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR", decisionScope: "prior acquisition; not one of the 44 new candidates" }]);
  assert.deepEqual(result.rejectedFields, []);
  assert.deepEqual(result.clarificationFields, ["dimensions_mass.payload-gvwr", "electrical.main-fuse", "lighting.drl", "lighting.replaceability", "maintenance.initial-service"]);
  assert.equal(acquisition.additionalCandidates.length, 44);
  assert.equal(result.decisions.decisions.some(decision => decision.candidateId.includes("cooling.capacity")), false);
});

test("accepted domain output and production boundaries are explicit", () => {
  assert.ok(result.acceptedFieldsByDomain.basicMotorcycleData.length > 0);
  assert.ok(result.acceptedFieldsByDomain.finalDrive.length > 0);
  assert.ok(result.acceptedFieldsByDomain.fuses.includes("electrical.fuse-ratings"));
  assert.ok(result.acceptedFieldsByDomain.lighting.includes("lighting.combined-high-low"));
  assert.ok(result.acceptedFieldsByDomain.periodicMaintenance.length > 0);
  assert.deepEqual(result.productionPromotionCandidates, result.futureProcessingCandidates);
  assert.equal(result.productionDucatiChanged, false);
  assert.equal(result.productionDucatiEntryCount, 6);
  assert.equal(result.vfrChanged, false);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
});

test("review decisions and report are deterministic", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-human-review.json"), "utf8"));
  assert.deepEqual(review.buildReport(), result);
  assert.deepEqual(stored, result);
  assert.deepEqual(review.buildReport().decisions, result.decisions);
});
