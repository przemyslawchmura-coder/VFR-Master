// NON-PRODUCTION bounded Human Review for one existing CBR500R candidate.
"use strict";

const factory = require("../factory/index.js");
const queueReport = require("../reports/cbr500r-pc70-review-queue.json");

const queueEntry = queueReport.queue.entries.find(item => item.id === "review-queue-entry.7b8d56af51c808e15dd558ac");
if (!queueEntry) throw new Error("The bounded CBR500R Review Queue entry is missing");
if (queueReport.queue.entries.length !== 1 || queueEntry.candidateId !== "extraction-candidate.87fcea8600978eff75d9f8d6") throw new Error("The bounded CBR500R Human Review scope is not exactly one candidate");

const reviewerId = "reviewer.revlog.operator";
const decision = "ACCEPT";
const comment = "Tier A Honda owner manual 31MLRB000 directly states the oil recommendation for the preserved 2024 CBR500R PC70 USA/Canada manual scope; ACCEPT is pre-evidence only. ABS remains unresolved.";

function buildDecision() {
  return factory.buildReviewDecisions([{ queueEntry, decision, reviewerId, comment }]).decisions[0];
}

function buildReport() {
  const record = buildDecision();
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-human-review/v1",
    reviewDecisionSchemaVersion: factory.REVIEW_DECISION_SCHEMA_VERSION,
    queueEntryId: queueEntry.id,
    candidateId: queueEntry.candidateId,
    target: queueReport.target,
    fieldId: queueReport.fieldId,
    source: queueReport.source,
    applicability: queueReport.applicability,
    decision: record,
    assertions: {
      exactlyOneDecision: true,
      queueEntryPreserved: record.queueEntryId === queueEntry.id,
      candidatePreserved: record.candidateId === queueEntry.candidateId,
      rawValuePreserved: queueEntry.candidate.rawValue === queueEntry.queueCandidateRawValue || typeof queueEntry.candidate.rawValue === "string",
      provenancePreserved: record.artifactId === queueEntry.artifactId && record.prospectId === queueEntry.prospectId,
      applicabilityPreserved: queueEntry.candidate.applicability.abs === null,
      evidenceProcessingOccurred: false,
      productionPromotionOccurred: false,
      productionChanged: false
    },
    next: "Bounded Evidence Processing for exactly this CBR500R oil-specification Human Review Decision."
  });
}

module.exports = Object.freeze({ buildDecision, buildReport, queueEntry, reviewerId, decision, comment });
