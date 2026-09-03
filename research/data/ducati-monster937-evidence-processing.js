// NON-PRODUCTION Ducati Evidence Processing projection. No final evidence.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-owner-manual-acquisition.js");
const humanReview = require("./ducati-monster937-owner-manual-human-review.js");

function buildReport() {
  const review = humanReview.buildReport();
  const queueEntries = review.reviewQueue.entries;
  const decisions = review.decisions.decisions;
  const inputSnapshot = factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions });
  const processed = factory.buildEvidenceProcessing({ queueEntries, decisions });
  const outputSnapshot = factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions });
  const queueById = new Map(queueEntries.map(entry => [entry.id, entry]));
  const rawValuesAndProvenancePreserved = processed.records.every(record => {
    const entry = queueById.get(record.queueEntryId);
    return entry && factory.orchestrationJson.canonicalSerialize(record.candidate) === factory.orchestrationJson.canonicalSerialize(entry.candidate);
  });
  const count = state => processed.records.filter(record => record.state === state).length;
  const conflictRecords = processed.records.filter(record => record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT");
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-evidence-processing/v1",
    target: review.target,
    source: review.source,
    reusedProspectId: review.reusedProspectId,
    input: Object.freeze({ queuedRawCandidates: acquisition.runAcquisition().rawCandidates.length, humanReviewDecisions: decisions.length, acceptedDecisions: review.decisionCounts.ACCEPT, rejectedDecisions: review.decisionCounts.REJECT, needsMoreReviewDecisions: review.decisionCounts["NEEDS-MORE-REVIEW"] }),
    records: processed.records,
    metrics: Object.freeze({
      processingRecords: processed.records.length,
      acceptedForProcessing: count("ACCEPTED-FOR-PROCESSING"),
      cannotAdvance: count("CANNOT-ADVANCE"),
      rejectedCandidate: count("REJECTED-CANDIDATE"),
      needsMoreReview: count("NEEDS-MORE-REVIEW"),
      ineligible: count("INELIGIBLE"),
      conflictsDetected: conflictRecords.length,
      rawValuesAndProvenancePreserved,
      upstreamInputsUnchanged: inputSnapshot === outputSnapshot,
      evidenceRowsCreated: 0,
      serviceCoreBefore: acquisition.runAcquisition().metrics.serviceCoreBefore,
      serviceCoreAfter: acquisition.runAcquisition().metrics.serviceCoreAfter,
      productionChanged: false,
      researchedNoEvidenceCreated: false,
      normalizationPerformed: false,
      conflictsResolved: false
    }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Existing Ducati Human Review Decisions and their validated Review Queue entries were projected through the canonical Evidence Processing contract. Processing remains pre-promotion; raw candidate payloads and provenance are preserved and any contract-detected conflict remains CANNOT-ADVANCE.", risks: Object.freeze(["ACCEPTED-FOR-PROCESSING is not final evidence", "processing records are in-memory with caller-owned persistence", "no normalization or conflict resolution is performed"]), falsification: Object.freeze(["no new source or acquisition was used", "no evidence rows were created", "no production state was changed"]) }),
    exactNextTask: "Hold the 27 Ducati pre-promotion processing records; no further Ducati action or production promotion occurs until separately authorized."
  });
}

module.exports = Object.freeze({ buildReport });
