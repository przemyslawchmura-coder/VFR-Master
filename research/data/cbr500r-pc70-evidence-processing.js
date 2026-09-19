// NON-PRODUCTION bounded Evidence Processing for one accepted CBR500R decision.
"use strict";

const factory = require("../factory/index.js");
const queueReport = require("../reports/cbr500r-pc70-review-queue.json");
const reviewReport = require("../reports/cbr500r-pc70-human-review.json");

const queueEntries = queueReport.queue.entries;
const decisions = [reviewReport.decision];
if (queueEntries.length !== 1 || queueEntries[0].id !== reviewReport.decision.queueEntryId) throw new Error("CBR500R Evidence Processing scope must contain exactly one linked queue entry");
if (reviewReport.decision.decision !== "ACCEPT") throw new Error("CBR500R Evidence Processing requires the accepted Human Review Decision");
if (reviewReport.decision.id !== "review-decision.3d8c7cebfd3c3c4f34b1f163") throw new Error("Unexpected CBR500R Human Review Decision");

function buildProcessed() {
  const before = factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions });
  const processed = factory.buildEvidenceProcessing({ queueEntries, decisions });
  if (processed.records.length !== 1 || processed.records[0].decisionId !== reviewReport.decision.id) throw new Error("CBR500R processing did not represent exactly one decision");
  if (factory.orchestrationJson.canonicalSerialize({ queueEntries, decisions }) !== before) throw new Error("CBR500R Evidence Processing mutated upstream inputs");
  return processed;
}

function buildReport() {
  const processed = buildProcessed();
  const record = processed.records[0];
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-evidence-processing/v1",
    evidenceProcessingSchemaVersion: factory.EVIDENCE_PROCESSING_SCHEMA_VERSION,
    target: queueReport.target,
    fieldId: queueReport.fieldId,
    source: queueReport.source,
    applicability: queueReport.applicability,
    input: {
      queueEntries: queueEntries.length,
      humanReviewDecisions: decisions.length,
      acceptedDecisions: decisions.filter(item => item.decision === "ACCEPT").length
    },
    processedRecords: processed.records,
    metrics: {
      processingRecords: processed.records.length,
      acceptedForProcessing: processed.records.filter(item => item.state === "ACCEPTED-FOR-PROCESSING").length,
      cannotAdvance: processed.records.filter(item => item.state === "CANNOT-ADVANCE").length,
      conflictsDetected: processed.records.filter(item => item.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT").length,
      rawValueAndProvenancePreserved: factory.orchestrationJson.canonicalSerialize(record.candidate) === factory.orchestrationJson.canonicalSerialize(queueEntries[0].candidate),
      normalizationPerformed: false,
      evidenceRowsCreated: 0,
      productionChanged: false
    },
    assertions: {
      exactlyOneAcceptedDecisionConsumed: true,
      lineagePreserved: record.decisionId === reviewReport.decision.id && record.queueEntryId === queueEntries[0].id && record.candidateId === queueEntries[0].candidateId,
      applicabilityPreserved: record.candidate.applicability.abs === null,
      unsupportedConflictResolution: false,
      promotionOccurred: false,
      productionTechnicalDataChanged: false
    },
    next: "Bounded promotion-readiness evaluation for exactly this one CBR500R Evidence Processing record; do not promote automatically."
  });
}

module.exports = Object.freeze({ buildProcessed, buildReport, queueEntries, decisions });
