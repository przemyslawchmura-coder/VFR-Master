"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const plan = require("../research/data/yamaha-fz1-2d1x-extraction-plan.js");
const acquisition = require("../research/data/yamaha-fz1-2d1x-owner-manual-acquisition.js");

test("plan binds only to the acquired 2D1X artifact and exact hash", () => {
  const value = plan.buildPlan();
  assert.equal(value.publicationCode, "2D1X");
  assert.equal(value.acquisitionArtifactId, acquisition.buildArtifact().id);
  assert.equal(value.artifactSha256, "bbaa777d8d0184f231573fdf6116d73b7770930d4bdf19b1f0d7386d6b7e2a93");
  assert.doesNotThrow(() => plan.assertArtifactMatches(acquisition.buildArtifact()));
  assert.throws(() => plan.assertArtifactMatches({ ...acquisition.buildArtifact(), contentDigest: "0".repeat(64) }), /identity mismatch/);
});

test("plan excludes the service lead, FZ1-S and broader years", () => {
  const value = plan.buildPlan();
  assert.deepEqual(value.runtimeIdentitiesExcluded, ["yamaha.fz1.gen2.s"]);
  assert.equal(value.excludedRegions.some(item => item.subject.includes("2D1-28197-E0")), true);
  assert.match(value.applicabilityGate.rules[1], /FZ1-S/);
  assert.deepEqual(value.applicabilityGate.required.modelYear, 2010);
});

test("plan preserves unresolved market and ABS applicability", () => {
  const value = plan.buildPlan();
  assert.deepEqual(value.applicabilityGate.mustRemainUnknownUnlessExplicitlyProven, ["market", "abs", "transmission", "equipment", "emissions"]);
  assert.match(value.applicabilityGate.rules[2], /JP-index/);
  assert.match(value.conditionalValueHandling, /conditional row/);
});

test("future candidate provenance and deterministic identity use existing Factory contracts", () => {
  const value = plan.buildPlan();
  assert.deepEqual(value.provenanceContract.existingCandidateFields, ["sourceLocation.page", "sourceLocation.section", "sourceLocation.locator", "applicability", "context"]);
  assert.match(value.provenanceContract.requiredFutureDetails.join("|"), /pdfPage.*printedPageOrUnknown.*tableOrSubsection/);
  assert.match(value.extractionIdentity.resultIdRecipe, /factory\.extractionResultId/);
  assert.match(value.extractionIdentity.candidateIdRecipe, /factory\.candidateId/);
});

test("plan has six approved regions, bounded output and no execution", () => {
  const value = plan.buildPlan();
  assert.equal(value.allowedRegions.length, 6);
  assert.equal(value.budget.maxRegions, 6);
  assert.equal(value.budget.maxRawCandidates, 24);
  assert.equal(value.execution, false);
  assert.equal(value.technicalValuesRecorded, false);
  assert.equal(value.technicalValuesExtracted, false);
  assert.equal(value.rawCandidatesCreated, 0);
  assert.equal(value.reviewQueueEntriesCreated, 0);
  assert.equal(value.evidenceRowsAdded, 0);
  assert.equal(value.serviceCoreCoverageChanged, false);
  assert.equal(value.productionChanged, false);
});

test("repeated plan construction is deterministic and artifact changes fail closed", () => {
  assert.deepEqual(plan.buildPlan(), plan.buildPlan());
  assert.throws(() => plan.validatePlan({ ...plan.buildPlan(), artifactSha256: "f".repeat(64) }), /source binding/);
});
