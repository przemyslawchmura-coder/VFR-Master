"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const acquisition = require("../research/data/ducati-monster937-rider-service-core-acquisition.js");
const review = require("../research/data/ducati-monster937-rider-service-core-human-review.js");
const processing = require("../research/data/ducati-monster937-rider-service-core-evidence-processing.js");
const report = processing.buildReport();

test("exactly 39 accepted decisions are received and every one has an outcome", () => {
  assert.equal(report.acceptedCandidatesReceived, 39);
  assert.equal(report.outcomes.length, 39);
  assert.equal(new Set(report.outcomes.map(outcome => outcome.candidateId)).size, 39);
  assert.equal(report.successfullyProcessed, 39);
  assert.equal(report.processingContractBlocked, 0);
  assert.equal(report.processingReadyOutputs, 39);
  assert.equal(report.validationFailures, 0);
  assert.equal(report.duplicatesOrCollisions, 0);
  assert.equal(report.outcomes.filter(outcome => outcome.processingState === "CANNOT-ADVANCE").length, 0);
});

test("canonical records use the existing boundary and preserve exact context", () => {
  assert.equal(report.evidenceProcessingRecords.length, 39);
  assert.ok(report.evidenceProcessingRecords.every(record => record.state === "ACCEPTED-FOR-PROCESSING"));
  assert.ok(report.evidenceProcessingRecords.every(record => record.candidate.context.sourceId === acquisition.source.id));
  assert.ok(report.evidenceProcessingRecords.every(record => record.candidate.context.documentId === acquisition.source.documentId));
  assert.ok(report.evidenceProcessingRecords.every(record => record.candidate.applicability.abs === true && record.candidate.applicability.transmission === "manual"));
  assert.equal(report.rawValuesProvenanceApplicabilityPreserved, true);
  assert.equal(report.evidenceProcessingRecords.some(record => record.candidate.fieldId === "cooling.capacity"), false);
  assert.equal(review.buildReport().decisionCounts["NEEDS-MORE-REVIEW"], 5);
});

test("structured Rider Service Core associations survive processing", () => {
  const record = fieldId => report.evidenceProcessingRecords.find(item => item.candidate.fieldId === fieldId);
  const maintenance = record("maintenance.inspect");
  const fuses = record("electrical.fuse-ratings");
  const lighting = record("lighting.combined-high-low");
  assert.match(maintenance.candidate.rawValue, /drive chain tension and lubrication/);
  assert.match(fuses.candidate.rawValue, /ECU\/ABS\/IMU 5 A/);
  assert.match(lighting.candidate.rawValue, /LED low beam/);
  assert.equal(maintenance.candidate.context.originalCandidateId, "ducati.monster937.core.raw.038");
  assert.equal(fuses.candidate.context.originalCandidateId, "ducati.monster937.core.raw.028");
  assert.equal(lighting.candidate.context.originalCandidateId, "ducati.monster937.core.raw.030");
});

test("contract gaps are explicit and maintenance/fuse/lighting are not weakened", () => {
  assert.equal(report.maintenanceProcessing.acceptedInputs, 6);
  assert.equal(report.maintenanceProcessing.processingReady, 6);
  assert.equal(report.fuseProcessing.acceptedInputs, 1);
  assert.equal(report.fuseProcessing.processingReady, 1);
  assert.equal(report.lightingProcessing.acceptedInputs, 6);
  assert.equal(report.lightingProcessing.processingReady, 6);
  assert.equal(report.coolingCapacity.enteredProcessing, false);
  assert.equal(report.excludedNeedsMoreReview, 5);
  assert.equal(report.newlyDiscoveredContractGaps.length, 0);
});

test("production and upstream research remain unchanged", () => {
  const before = factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates);
  assert.equal(report.productionDucatiChanged, false);
  assert.equal(report.productionDucatiEntryCount, 6);
  assert.equal(report.vfrChanged, false);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.upstreamReviewStateChanged, false);
  assert.equal(factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates), before);
});

test("processing report is deterministic", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-evidence-processing.json"), "utf8"));
  assert.deepEqual(processing.buildReport(), report);
  assert.deepEqual(stored, report);
});
