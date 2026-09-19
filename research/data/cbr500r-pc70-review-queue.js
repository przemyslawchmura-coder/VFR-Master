// NON-PRODUCTION bounded Review Queue construction for one existing raw candidate.
"use strict";

const factory = require("../factory/index.js");
const execution = require("./cbr500r-pc70-owner-manual-execution.js");
const report = require("../reports/cbr500r-pc70-owner-manual-execution.json");

const candidateRecord = report.fields["lubrication.oil-specification"].rawCandidates.find(item => item.id === "extraction-candidate.87fcea8600978eff75d9f8d6");
if (!candidateRecord) throw new Error("The bounded CBR500R raw candidate is missing");

const batch = factory.createResearchBatch({
  purpose: "CBR500R PC70 2024 owner manual execution",
  policyId: "cbr500r-pc70-owner-manual-execution-v1",
  targets: [execution.target],
  maxAttemptsPerWorkItem: 1
}).batch;
const targetWork = factory.createTargetWork(batch, execution.target);
const sourceWorkItem = factory.createSourceWorkItem({ batch, targetWork, target: execution.target, prospect: execution.prospect, operation: "attempt-existing-source", maxAttempts: 1 });
const attempt = factory.createResearchAttempt(sourceWorkItem, 1);
const extractionResultId = report.extraction.oil.resultId;
const sourceLocation = Object.freeze({ page: null, section: "derived text", locator: "lines:55-64;chars:731-1026", tableOrSubsection: "document:full" });
const candidate = factory.validateExtractionCandidate({
  schemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
  id: candidateRecord.id,
  batchId: batch.id,
  targetId: execution.target.id,
  targetWorkId: targetWork.id,
  sourceWorkItemId: sourceWorkItem.id,
  attemptId: attempt.id,
  prospectId: execution.prospect.id,
  artifactId: report.derivation.derivedContentId,
  extractionResultId,
  adapterId: "declarative-text-extractor",
  adapterVersion: "1",
  fieldId: candidateRecord.fieldId,
  rawValue: candidateRecord.rawValue,
  rawUnit: null,
  sourceLocation,
  extractionMethod: "declarative-text-extractor/1",
  applicability: candidateRecord.applicability,
  context: {
    derivedContentId: report.derivation.derivedContentId,
    derivedContentDigest: report.derivation.derivedDigest,
    parentArtifactId: report.acquisition.artifactId,
    ruleId: report.extraction.oil.ruleId,
    sourceLocator: { startLine: 55, endLine: 64, startOffset: 731, endOffset: 1026 },
    sourceAuthority: { sourceClass: report.source.sourceClass, sourceIdentity: report.source.id, sourceUrl: report.source.url }
  },
  ordinal: 1
});
const extractionResult = factory.validateExtractionResult({
  schemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
  id: extractionResultId,
  batchId: batch.id,
  targetId: execution.target.id,
  targetWorkId: targetWork.id,
  sourceWorkItemId: sourceWorkItem.id,
  attemptId: attempt.id,
  prospectId: execution.prospect.id,
  artifactId: report.derivation.derivedContentId,
  adapterId: "declarative-text-extractor",
  adapterVersion: "1",
  disposition: "CANDIDATES-PRODUCED",
  candidates: [candidate],
  observations: [{ type: "CANDIDATE-EXTRACTED", detailCode: "DECLARATIVE_MATCHED", metadata: { ruleId: report.extraction.oil.ruleId, count: 1 } }]
});
const queue = factory.buildReviewQueue([extractionResult, extractionResult]);
if (queue.entries.length !== 1 || queue.entries[0].candidateId !== candidateRecord.id) throw new Error("CBR500R Review Queue construction did not produce exactly one deduplicated entry");

function buildQueue() { return queue; }
function buildReport() {
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-review-queue/v1",
    reviewQueueSchemaVersion: factory.REVIEW_QUEUE_SCHEMA_VERSION,
    candidateId: candidateRecord.id,
    target: report.target,
    fieldId: candidateRecord.fieldId,
    source: report.source,
    applicability: candidateRecord.applicability,
    queue: queue,
    assertions: {
      exactlyOneEntry: queue.entries.length === 1,
      duplicateInputsCollapsed: true,
      rawValuePreserved: queue.entries[0].candidate.rawValue === candidateRecord.rawValue,
      candidateIdentityPreserved: queue.entries[0].candidateId === candidateRecord.id,
      absUnresolved: queue.entries[0].candidate.applicability.abs === null,
      humanReviewDecisionCreated: false,
      evidenceProcessingOccurred: false,
      productionPromotionOccurred: false,
      productionChanged: false
    },
    next: "Bounded Human Review of exactly this one CBR500R oil-specification Review Queue entry."
  });
}

module.exports = Object.freeze({ buildQueue, buildReport, extractionResult, candidate });
