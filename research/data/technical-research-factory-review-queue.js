// NON-PRODUCTION deterministic report for the pre-decision Review Queue boundary.
"use strict";

const factory = require("../factory/index.js");
const extractionData = require("./technical-research-factory-extraction-agent.js");

function buildFixture() {
  const fixture = extractionData.buildFixture();
  const produced = extractionData.run(fixture, "candidates");
  return Object.freeze({ fixture, produced, queue: factory.buildReviewQueue([produced]) });
}

function buildReport() {
  const { produced } = buildFixture();
  const nonReviewable = factory.EXTRACTION_DISPOSITIONS.filter(disposition => disposition !== "CANDIDATES-PRODUCED").map((disposition, index) => {
    const adapterVersion = `report-${index + 1}`;
    const id = factory.extractionResultId({ batchId: produced.batchId, targetId: produced.targetId, targetWorkId: produced.targetWorkId, sourceWorkItemId: produced.sourceWorkItemId, attemptId: produced.attemptId, prospectId: produced.prospectId, artifactId: produced.artifactId, adapterId: produced.adapterId, adapterVersion, operation: factory.EXTRACTION_OPERATION });
    return factory.validateExtractionResult({ ...produced, id, adapterVersion, disposition, candidates: [] });
  });
  const queue = factory.buildReviewQueue([produced, produced, ...nonReviewable]);
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-review-queue/v1",
    reviewQueueSchemaVersion: factory.REVIEW_QUEUE_SCHEMA_VERSION,
    extractionSchemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
    queueStates: factory.REVIEW_QUEUE_STATES,
    eligibilityStates: factory.REVIEW_ELIGIBILITY,
    entryCount: queue.entries.length,
    exactDuplicateCollapsed: queue.entries.length === produced.candidates.length,
    orderedEntryIds: queue.entries.map(entry => entry.id),
    ineligible: queue.ineligible.map(item => ({ disposition: item.disposition, reasonCode: item.reasonCode })),
    provenance: { resultBound: queue.entries.every(entry => entry.extractionResultId === produced.id), candidateBound: queue.entries.every(entry => produced.candidates.some(candidate => candidate.id === entry.candidateId)), acquisitionBound: queue.entries.every(entry => entry.attemptId === produced.attemptId && entry.artifactId === produced.artifactId && entry.prospectId === produced.prospectId), targetBound: queue.entries.every(entry => entry.targetId === produced.targetId && entry.targetWorkId === produced.targetWorkId && entry.sourceWorkItemId === produced.sourceWorkItemId) },
    rawPreservation: { values: queue.entries.every(entry => entry.candidate.rawValue === produced.candidates.find(candidate => candidate.id === entry.candidateId).rawValue), units: queue.entries.every(entry => entry.candidate.rawUnit === produced.candidates.find(candidate => candidate.id === entry.candidateId).rawUnit), locations: queue.entries.every(entry => factory.orchestrationJson.canonicalSerialize(entry.candidate.sourceLocation) === factory.orchestrationJson.canonicalSerialize(produced.candidates.find(candidate => candidate.id === entry.candidateId).sourceLocation)), applicabilityAndContext: queue.entries.every(entry => factory.orchestrationJson.canonicalSerialize([entry.candidate.applicability, entry.candidate.context]) === factory.orchestrationJson.canonicalSerialize([produced.candidates.find(candidate => candidate.id === entry.candidateId).applicability, produced.candidates.find(candidate => candidate.id === entry.candidateId).context])), normalized: false },
    safety: { humanDecisionsImplemented: false, evidenceAdded: false, researchedNoEvidenceAdded: false, conflictResolutionImplemented: false, persistenceImplemented: false, orchestratorEventsAdded: 0, acquisitionAttemptsConsumed: 0, productionChanged: false, networkUsed: false },
    audit: { classification: "ACCEPT-WITH-RISKS", risks: ["queue entries are in-memory values with caller-owned persistence", "human review decisions and reviewer identity are deliberately deferred", "eligibility is limited to validated candidate-producing extraction results"] }
  });
}

module.exports = Object.freeze({ buildReport, buildFixture });
