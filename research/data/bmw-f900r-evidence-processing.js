// NON-PRODUCTION BMW Evidence Processing projection. No final evidence.
"use strict";

const factory = require("../factory/index.js");
const review = require("./bmw-f900r-human-review.js");

function buildReport() {
  const humanReview = review.buildReport();
  const queueEntries = humanReview.reviewQueue.entries;
  const decisions = humanReview.decisions.decisions;
  if (queueEntries.length !== 13 || decisions.length !== 13) throw new Error("BMW processing requires exactly 13 queue entries and decisions");
  const before = factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions });
  const processed = factory.buildEvidenceProcessing({ queueEntries, decisions });
  const after = factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions });
  const decisionIds = new Set(decisions.map(decision => decision.id));
  const processedDecisionIds = new Set(processed.records.map(record => record.decisionId));
  if (processed.records.length !== decisions.length || processedDecisionIds.size !== decisions.length || [...decisionIds].some(id => !processedDecisionIds.has(id))) throw new Error("BMW processing did not represent every decision exactly once");
  const queueById = new Map(queueEntries.map(entry => [entry.id, entry]));
  const rawValuesAndProvenancePreserved = processed.records.every(record => {
    const entry = queueById.get(record.queueEntryId);
    return entry && factory.orchestrationJson.canonicalSerialize(record.candidate) === factory.orchestrationJson.canonicalSerialize(entry.candidate);
  });
  const count = state => processed.records.filter(record => record.state === state).length;
  const conflictRecords = processed.records.filter(record => record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT");
  return Object.freeze({
    schemaVersion: "revlog-bmw-f900r-evidence-processing/v1",
    target: humanReview.target,
    source: humanReview.source,
    reusedProspectId: humanReview.reusedProspectId,
    input: Object.freeze({ queuedRawCandidates: 13, humanReviewDecisions: decisions.length, acceptedDecisions: humanReview.decisionCounts.ACCEPT, rejectedDecisions: humanReview.decisionCounts.REJECT, needsMoreReviewDecisions: humanReview.decisionCounts["NEEDS-MORE-REVIEW"] }),
    records: processed.records,
    metrics: Object.freeze({ processingRecords: processed.records.length, acceptedForProcessing: count("ACCEPTED-FOR-PROCESSING"), cannotAdvance: count("CANNOT-ADVANCE"), rejectedCandidate: count("REJECTED-CANDIDATE"), needsMoreReview: count("NEEDS-MORE-REVIEW"), ineligible: count("INELIGIBLE"), conflictsDetected: conflictRecords.length, rawValuesAndProvenancePreserved, upstreamInputsUnchanged: before === after, humanReviewDecisionsUnchanged: before === after, evidenceRowsCreated: 0, serviceCoreBefore: 0, serviceCoreAfter: 0, productionChanged: false, researchedNoEvidenceCreated: false, normalizationPerformed: false, conflictsResolved: false }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The existing 13 BMW Human Review Decisions and exact Review Queue entries were projected through the canonical Evidence Processing contract. The processor preserved raw candidate payloads/provenance and classified any same-field raw-value disagreement as CANNOT-ADVANCE without conflict resolution or evidence creation.", risks: Object.freeze(["two directly sourced solo tire-pressure candidates remain a processor-detected same-field disagreement", "ACCEPTED-FOR-PROCESSING is not final evidence", "no normalization or promotion is performed"]), falsification: Object.freeze(["no new source, candidate or decision was created", "Human Review Decisions and queue entries were not mutated", "no evidence or production stage was invoked"]) }),
    exactNextTask: "Hold the BMW Evidence Processing records, including any CANNOT-ADVANCE conflict records; do not resolve conflicts or promote evidence without a separately authorized bounded review."
  });
}

module.exports = Object.freeze({ buildReport });
