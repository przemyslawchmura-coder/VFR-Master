// NON-PRODUCTION read-only creation of pending promotion-review packets for exactly the 24 BMW records.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const readinessProjection = require("./mass-scale-bmw-c600-promotion-readiness.js");
const processing = require("./mass-scale-bmw-c600-evidence-processing.js");
const review = require("./mass-scale-bmw-c600-human-review.js");

function buildReport() {
  const readinessReport = readinessProjection.buildReport();
  const processedReport = processing.buildReport();
  const reviewReport = review.buildReport();
  if (readinessReport.outcomes.length !== 24 || processedReport.records.length !== 24 || reviewReport.decisions.decisions.length !== 24) throw new Error("BMW promotion review requires exactly the 24 current readiness inputs");

  const queueByCandidate = new Map(reviewReport.reviewQueue.entries.map(entry => [entry.candidateId, entry]));
  const decisionByCandidate = new Map(reviewReport.decisions.decisions.map(decision => [decision.candidateId, decision]));
  const readinessByRecord = new Map(readinessReport.outcomes.map(outcome => [outcome.evidenceProcessingRecordId, outcome]));
  const upstreamBefore = json.canonicalSerialize({ readiness: readinessReport, processed: processedReport, review: reviewReport });
  const packets = processedReport.records.map(record => {
    const queueEntry = queueByCandidate.get(record.candidateId);
    const decision = decisionByCandidate.get(record.candidateId);
    const readinessOutcome = readinessByRecord.get(record.id);
    if (!queueEntry || !decision || !readinessOutcome) throw new Error("BMW promotion review input is missing its readiness, queue or decision lineage");
    const packetInput = readinessProjection.buildPacket(record, queueEntry, decision);
    const readiness = factory.buildPromotionReadiness(packetInput);
    if (readiness.packet.id !== readinessOutcome.promotionPacketId || readiness.state !== readinessOutcome.state || readiness.reasons.length !== readinessOutcome.reasons.length) throw new Error("BMW promotion review readiness does not match the completed readiness output");
    const packet = factory.createPendingPromotionReviewPacket(readiness, { promotionPacketId: packetInput.id, targetId: packetInput.targetIdentity.id, sourceProspectId: packetInput.sourceIdentity.prospectId, reviewQueueEntryId: packetInput.reviewQueueEntryId, humanReviewDecisionId: packetInput.humanReviewDecisionId, evidenceProcessingRecordId: packetInput.evidenceProcessingRecordId });
    return packet;
  }).sort((a, b) => a.id.localeCompare(b.id));
  const upstreamAfter = json.canonicalSerialize({ readiness: readinessProjection.buildReport(), processed: processing.buildReport(), review: review.buildReport() });
  if (packets.length !== 24 || new Set(packets.map(packet => packet.id)).size !== 24 || new Set(packets.map(packet => packet.promotionPacketId)).size !== 24) throw new Error("BMW promotion review did not create exactly one unique packet per input");
  const conditionalContexts = readinessReport.outcomes.filter(outcome => outcome.condition).map(outcome => ({ evidenceProcessingRecordId: outcome.evidenceProcessingRecordId, canonicalFieldId: outcome.canonicalFieldId, condition: outcome.condition })).sort((a, b) => a.evidenceProcessingRecordId.localeCompare(b.evidenceProcessingRecordId));
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-promotion-review/v1",
    targetId: readinessReport.targetId,
    catalogVariantKey: readinessReport.catalogVariantKey,
    year: readinessReport.year,
    sourceProspectId: readinessReport.sourceProspectId,
    input: Object.freeze({ promotionReadinessRecords: readinessReport.outcomes.length, promotionReady: readinessReport.readiness.promotionReady, blocked: readinessReport.readiness.blocked }),
    packets,
    conditionalContexts,
    counts: Object.freeze({ created: packets.length, pending: packets.filter(packet => packet.reviewState === "PENDING-PROMOTION-REVIEW").length, approved: packets.filter(packet => packet.reviewState === "APPROVED-FOR-CONVERSION").length, rejected: packets.filter(packet => packet.reviewState === "REJECTED-FOR-PROMOTION").length, needsReview: packets.filter(packet => packet.reviewState === "NEEDS-PROMOTION-REVIEW").length, conditionalContexts: conditionalContexts.length }),
    assertions: Object.freeze({ exactly24Inputs: readinessReport.outcomes.length === 24, exactlyOnePacketPerInput: packets.length === 24, noMissingInputs: packets.every(packet => readinessByRecord.has(packet.evidenceProcessingRecordId)), noDuplicatePackets: new Set(packets.map(packet => packet.id)).size === packets.length, noDuplicateInputs: new Set(packets.map(packet => packet.evidenceProcessingRecordId)).size === packets.length, allPending: packets.every(packet => packet.reviewState === "PENDING-PROMOTION-REVIEW"), noApprovalOrPromotion: packets.every(packet => !["APPROVED-FOR-CONVERSION", "REJECTED-FOR-PROMOTION", "NEEDS-PROMOTION-REVIEW"].includes(packet.reviewState)), rawValuesPreserved: packets.every(packet => packet.rawValue !== null), conditionsPreserved: conditionalContexts.length === 9 && conditionalContexts.every(item => item.condition), provenancePreserved: packets.every(packet => packet.provenance.candidateId && packet.provenance.sourceLocation), sourceIdentityPreserved: packets.every(packet => packet.sourceIdentity.prospectId && packet.sourceIdentity.documentId && packet.sourceIdentity.officialPath), applicabilityPreserved: packets.every(packet => packet.applicability.modelYear === "KNOWN" && packet.applicability.market === "KNOWN" && packet.applicability.equipment === "SUFFICIENT" && packet.applicability.abs === "KNOWN" && packet.applicability.transmission === "KNOWN" && packet.applicability.context === "SUFFICIENT"), upstreamReadinessUnchanged: upstreamBefore === upstreamAfter, evidenceRowsCreated: 0, productionChanged: false, catalogueChanged: false, registryChanged: false, serviceCoreCoverageChanged: false, cloudChanged: false, normalizationPerformed: false, conversionPerformed: false }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the 24 existing BMW C 600 Sport MY2012 PROMOTION-READY packets were presented through the generic PromotionReviewPacket/v1 lifecycle as pending human-review packets. No approval, rejection, conversion, evidence creation or production mutation occurred.", blockedInputs: [], risks: ["PENDING-PROMOTION-REVIEW is not promotion approval", "research Human Review ACCEPT remains distinct from promotion approval", "conditional raw contexts remain unchanged"] }),
    next: "Keep these 24 packets pending; obtain a separate explicit human promotion-review decision before any future schema conversion."
  });
}

module.exports = Object.freeze({ buildReport });
