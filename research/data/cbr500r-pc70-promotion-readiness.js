// NON-PRODUCTION read-only promotion-readiness evaluation for one CBR500R record.
"use strict";

const factory = require("../factory/index.js");
const execution = require("./cbr500r-pc70-owner-manual-execution.js");
const applicabilityVerification = require("./cbr500r-pc70-abs-applicability.js");
const processingReport = require("../reports/cbr500r-pc70-evidence-processing.json");
const applicabilityReport = require("../reports/cbr500r-pc70-abs-applicability.json");

const record = processingReport.processedRecords.find(item => item.id === "evidence-processing.87cd135fb44ebc569aebacb9");
if (!record || processingReport.processedRecords.length !== 1) throw new Error("The bounded CBR500R processing record is missing or scope is not exactly one record");
if (record.state !== "ACCEPTED-FOR-PROCESSING") throw new Error("Promotion readiness requires ACCEPTED-FOR-PROCESSING");

const queueEntryId = "review-queue-entry.7b8d56af51c808e15dd558ac";
const humanReviewDecisionId = "review-decision.3d8c7cebfd3c3c4f34b1f163";

const verifiedApplicability = applicabilityVerification.buildReport();
if (applicabilityReport.id !== applicabilityVerification.id || applicabilityReport.schemaVersion !== verifiedApplicability.schemaVersion) throw new Error("ABS applicability verification report is stale or mismatched");
if (verifiedApplicability.lineage.promotionCandidateId !== "promotion-candidate.0c12373f56277561b2b692a2") throw new Error("ABS applicability verification is not bound to the CBR500R promotion packet");

function buildPacket() {
  const candidate = record.candidate;
  const packet = {
    schemaVersion: factory.PROMOTION_SCHEMA_VERSION,
    id: "placeholder",
    targetIdentity: { state: "KNOWN", id: record.targetId, catalogVariantKey: execution.target.catalogVariantKey, model: "CBR500R", year: 2024, market: "USA/Canada", equipment: "standard road model" },
    sourceIdentity: { sourceId: execution.source.id, prospectId: record.prospectId, documentId: execution.source.publicationId, authority: execution.source.publisher, tier: execution.source.tier, officialPath: execution.source.url },
    reviewQueueEntryId: queueEntryId,
    humanReviewDecisionId,
    evidenceProcessingRecordId: record.id,
    canonicalFieldId: candidate.fieldId,
    rawValue: candidate.rawValue,
    rawUnit: candidate.rawUnit,
    provenance: { candidateId: candidate.id, extractionResultId: candidate.extractionResultId, artifactId: candidate.artifactId, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod },
    applicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" },
    processingState: record.state,
    humanReviewDecision: "ACCEPT",
    unresolvedConflict: false
  };
  packet.id = factory.promotionCandidateId(packet);
  return factory.validatePromotionPacket(packet);
}

function buildReadiness() {
  const packet = buildPacket();
  return factory.buildPromotionReadiness(packet);
}

function buildReport() {
  const before = factory.orchestrationJson.canonicalSerialize(record);
  const readiness = buildReadiness();
  if (factory.orchestrationJson.canonicalSerialize(record) !== before) throw new Error("Promotion readiness mutated the processing record");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-promotion-readiness/v1",
    promotionSchemaVersion: factory.PROMOTION_SCHEMA_VERSION,
    evidenceProcessingRecordId: record.id,
    humanReviewDecisionId,
    queueEntryId,
    candidateId: record.candidateId,
    target: processingReport.target,
    fieldId: processingReport.fieldId,
    source: processingReport.source,
    originalApplicability: processingReport.applicability,
    packetApplicability: readiness.packet.applicability,
    packet: readiness.packet,
    readiness: { state: readiness.state, passed: readiness.passed, checks: readiness.checks, reasons: readiness.reasons },
    applicabilityVerificationId: verifiedApplicability.id,
    verifiedApplicability: verifiedApplicability.verifiedApplicability,
    assertions: { exactlyOneRecordEvaluated: true, upstreamUnchanged: true, rawValuePreserved: readiness.packet.rawValue === record.candidate.rawValue, provenancePreserved: readiness.packet.provenance.candidateId === record.candidate.id, absResolvedByBoundedVerification: verifiedApplicability.verifiedApplicability.abs === true, otherApplicabilityUnchanged: verifiedApplicability.assertions.otherApplicabilityUnchanged, normalizationPerformed: false, conflictResolved: false, promotionOccurred: false, productionChanged: false },
    next: "Create the existing generic pending Promotion Review Packet for exactly this CBR500R PROMOTION-READY packet; do not approve or promote it."
  });
}

module.exports = Object.freeze({ buildPacket, buildReadiness, buildReport, record, applicabilityVerification: verifiedApplicability });
