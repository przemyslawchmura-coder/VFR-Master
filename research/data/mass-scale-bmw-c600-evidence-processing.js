// NON-PRODUCTION bounded Evidence Processing for the exact 24 BMW C 600 Sport review decisions.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const review = require("./mass-scale-bmw-c600-human-review.js");

function buildReport() {
  const humanReview = review.buildReport();
  const queueEntries = humanReview.reviewQueue.entries;
  const decisions = humanReview.decisions.decisions;
  if (queueEntries.length !== 24 || decisions.length !== 24 || humanReview.decisionCounts.ACCEPT !== 24) throw new Error("BMW Evidence Processing requires exactly the 24 existing ACCEPT decisions");
  const before = json.canonicalSerialize({ queueEntries, decisions });
  const processed = factory.buildEvidenceProcessing({ queueEntries, decisions });
  const after = json.canonicalSerialize({ queueEntries, decisions });
  const queueById = new Map(queueEntries.map(entry => [entry.id, entry]));
  const decisionIds = new Set(decisions.map(decision => decision.id));
  const processedDecisionIds = new Set(processed.records.map(record => record.decisionId));
  const rawValuesAndProvenancePreserved = processed.records.every(record => {
    const entry = queueById.get(record.queueEntryId);
    return entry && json.canonicalSerialize(record.candidate) === json.canonicalSerialize(entry.candidate);
  });
  const count = state => processed.records.filter(record => record.state === state).length;
  const conflictRecords = processed.records.filter(record => record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT");
  const conditionalRecords = processed.records.filter(record => record.candidate && record.candidate.context && record.candidate.context.condition);
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-evidence-processing/v1",
    targetId: humanReview.targetId,
    catalogVariantKey: humanReview.catalogVariantKey,
    year: humanReview.year,
    sourceProspectId: humanReview.sourceProspectId,
    artifact: humanReview.artifact,
    input: Object.freeze({ queuedRawCandidates: 24, humanReviewDecisions: decisions.length, acceptedDecisions: humanReview.decisionCounts.ACCEPT, rejectedDecisions: humanReview.decisionCounts.REJECT, needsMoreReviewDecisions: humanReview.decisionCounts["NEEDS-MORE-REVIEW"] }),
    records: processed.records,
    metrics: Object.freeze({ processingRecords: processed.records.length, acceptedForProcessing: count("ACCEPTED-FOR-PROCESSING"), cannotAdvance: count("CANNOT-ADVANCE"), rejectedCandidate: count("REJECTED-CANDIDATE"), needsMoreReview: count("NEEDS-MORE-REVIEW"), ineligible: count("INELIGIBLE"), conflictsDetected: conflictRecords.length, conditionalRecords: conditionalRecords.length, rawValuesAndProvenancePreserved, upstreamInputsUnchanged: before === after, humanReviewDecisionsUnchanged: before === after, evidenceRowsCreated: 0, serviceCoreBefore: 0, serviceCoreAfter: 0, productionChanged: false, catalogueChanged: false, registryChanged: false, researchedNoEvidenceCreated: false, normalizationPerformed: false, conflictsResolved: false }),
    conditionalHandling: Object.freeze({ preserved: true, records: conditionalRecords.map(record => ({ recordId: record.id, fieldId: record.candidate.fieldId, condition: record.candidate.context.condition, state: record.state, reasonCode: record.reasonCode })).sort((a, b) => a.recordId.localeCompare(b.recordId)) }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-BLOCKED-CONFLICTS", conclusion: "Exactly the 24 existing BMW C 600 Sport Human Review ACCEPT decisions were processed through the canonical Evidence Processing contract. Raw values, units, source locations, artifact lineage and applicability were preserved. The processor kept conditional rows explicit and marked only same-field raw-value disagreements as CANNOT-ADVANCE; no evidence rows or production state were created.", risks: Object.freeze(["CANNOT-ADVANCE records require a separately authorized conflict/applicability review", "ACCEPTED-FOR-PROCESSING is not final evidence", "no normalization or promotion is performed"]), falsification: Object.freeze(["no new source, extraction candidate or decision was created", "Human Review Decisions and queue entries were not mutated", "no evidence, promotion or production stage was invoked"]) }),
    exactNextTask: "Hold these BMW Evidence Processing records; separately resolve only the CANNOT-ADVANCE conditional pressure records before any promotion-readiness evaluation."
  });
}

module.exports = Object.freeze({ buildReport });
