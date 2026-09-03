// NON-PRODUCTION deterministic report for Human Review Decisions.
"use strict";

const factory = require("../factory/index.js");
const queueData = require("./technical-research-factory-review-queue.js");

function buildReport() {
  const fixture = queueData.buildFixture();
  const entries = fixture.queue.entries;
  const examples = Object.fromEntries(factory.REVIEW_DECISIONS.map(decision => [decision, factory.buildReviewDecisions([{ queueEntry: entries[0], decision, reviewerId: "reviewer.synthetic", comment: "Raw reviewer note" }]).decisions[0].decision]));
  const decisions = factory.buildReviewDecisions([
    { queueEntry: entries[0], decision: "ACCEPT", reviewerId: "reviewer.synthetic", comment: "Suitable for future evidence processing" },
    { queueEntry: entries[1], decision: "NEEDS-MORE-REVIEW", reviewerId: "reviewer.synthetic", comment: null }
  ]);
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-human-review-decisions/v1",
    reviewDecisionSchemaVersion: factory.REVIEW_DECISION_SCHEMA_VERSION,
    reviewQueueSchemaVersion: factory.REVIEW_QUEUE_SCHEMA_VERSION,
    decisionVocabulary: factory.REVIEW_DECISIONS,
    examples,
    decisionCount: decisions.decisions.length,
    orderedDecisionIds: decisions.decisions.map(item => item.id),
    provenance: { queueEntryBound: decisions.decisions.every(item => entries.some(entry => entry.id === item.queueEntryId)), candidateBound: decisions.decisions.every(item => entries.some(entry => entry.candidateId === item.candidateId)), extractionBound: decisions.decisions.every(item => entries.some(entry => entry.extractionResultId === item.extractionResultId)), acquisitionBound: decisions.decisions.every(item => entries.some(entry => entry.attemptId === item.attemptId && entry.artifactId === item.artifactId && entry.prospectId === item.prospectId)) },
    semantics: { acceptMeansProceedToFutureProcessingOnly: true, rejectIsCandidateLocalOnly: true, needsMoreReviewTriggersNoAutomation: true, reviewerIdentityOpaque: true, commentRawAndIdentityNeutral: true },
    safety: { evidenceAdded: false, researchedNoEvidenceAdded: false, normalizationImplemented: false, conflictResolutionImplemented: false, persistenceImplemented: false, orchestratorEventsAdded: 0, acquisitionAttemptsConsumed: 0, queueEntriesMutated: false, extractionResultsMutated: false, productionChanged: false, networkUsed: false },
    audit: { classification: "ACCEPT-WITH-RISKS", risks: ["reviewer identity is caller-supplied opaque metadata without authentication", "decisions remain in-memory immutable records with caller-owned persistence", "evidence processing and decision supersession remain deliberately deferred"] }
  });
}

module.exports = Object.freeze({ buildReport });
