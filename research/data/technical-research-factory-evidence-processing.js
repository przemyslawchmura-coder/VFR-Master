// NON-PRODUCTION deterministic report for the pre-promotion evidence-processing boundary.
"use strict";

const factory = require("../factory/index.js");
const queueData = require("./technical-research-factory-review-queue.js");

function buildReport() {
  const fixture = queueData.buildFixture();
  const entries = fixture.queue.entries;
  const decisions = factory.buildReviewDecisions([
    { queueEntry: entries[0], decision: "ACCEPT", reviewerId: "reviewer.synthetic", comment: "future processing only" },
    { queueEntry: entries[1], decision: "NEEDS-MORE-REVIEW", reviewerId: "reviewer.synthetic", comment: null }
  ]);
  const processed = factory.buildEvidenceProcessing({ queueEntries: entries, decisions: decisions.decisions });
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-evidence-processing/v1",
    evidenceProcessingSchemaVersion: factory.EVIDENCE_PROCESSING_SCHEMA_VERSION,
    reviewDecisionSchemaVersion: factory.REVIEW_DECISION_SCHEMA_VERSION,
    states: factory.EVIDENCE_PROCESSING_STATES,
    recordCount: processed.records.length,
    statesProduced: processed.records.map(record => record.state),
    provenance: { queueBound: processed.records.every(record => entries.some(entry => entry.id === record.queueEntryId)), candidateBound: processed.records.every(record => entries.some(entry => entry.candidateId === record.candidateId)), extractionBound: processed.records.every(record => entries.some(entry => entry.extractionResultId === record.extractionResultId)), acquisitionBound: processed.records.every(record => entries.some(entry => entry.attemptId === record.attemptId && entry.artifactId === record.artifactId && entry.prospectId === record.prospectId)) },
    rawPreservation: { values: processed.records.filter(record => record.candidate).every(record => entries.some(entry => entry.candidateId === record.candidateId && entry.candidate.rawValue === record.candidate.rawValue)), normalized: false },
    semantics: { acceptIsPrePromotion: processed.records.some(record => record.state === "ACCEPTED-FOR-PROCESSING"), rejectIsCandidateLocal: true, needsMoreReviewDoesNotAdvance: processed.records.some(record => record.state === "NEEDS-MORE-REVIEW") },
    safety: { evidenceCreated: false, researchedNoEvidenceAdded: false, normalizationImplemented: false, promotionImplemented: false, conflictResolutionImplemented: false, orchestratorEventsAdded: 0, acquisitionAttemptsConsumed: 0, productionChanged: false, networkUsed: false },
    audit: { classification: "ACCEPT-WITH-RISKS", risks: ["accepted disagreements remain unresolved until a later conflict layer", "processing records are in-memory with caller-owned persistence", "decision provenance depends on the supplied immutable queue entries"] }
  });
}

module.exports = Object.freeze({ buildReport });
