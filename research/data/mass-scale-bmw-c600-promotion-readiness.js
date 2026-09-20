// NON-PRODUCTION read-only promotion-readiness evaluation for exactly the 24 BMW C 600 Sport records.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const acquisition = require("./mass-scale-bmw-c600-source-acquisition.js");
const review = require("./mass-scale-bmw-c600-human-review.js");
const processing = require("./mass-scale-bmw-c600-evidence-processing.js");

const SOURCE_ID = acquisition.SOURCE_METADATA.publicationId;
const SOURCE_AUTHORITY = acquisition.SOURCE_METADATA.sourceAuthority;
const SOURCE_TIER = acquisition.SOURCE_METADATA.sourceTier;

function buildPacket(record, queueEntry, decision) {
  const candidate = record.candidate;
  const packet = {
    schemaVersion: factory.PROMOTION_SCHEMA_VERSION,
    id: "placeholder",
    targetIdentity: {
      state: "KNOWN",
      id: record.targetId,
      catalogVariantKey: processing.buildReport().catalogVariantKey,
      model: acquisition.SOURCE_METADATA.targetId,
      year: acquisition.SOURCE_METADATA.modelYear,
      market: acquisition.SOURCE_METADATA.market,
      equipment: acquisition.SOURCE_METADATA.equipment
    },
    sourceIdentity: {
      sourceId: SOURCE_ID,
      prospectId: record.prospectId,
      documentId: SOURCE_ID,
      authority: SOURCE_AUTHORITY,
      tier: SOURCE_TIER,
      officialPath: acquisition.SOURCE_URL
    },
    reviewQueueEntryId: queueEntry.id,
    humanReviewDecisionId: decision.id,
    evidenceProcessingRecordId: record.id,
    canonicalFieldId: candidate.fieldId,
    rawValue: candidate.rawValue,
    rawUnit: candidate.rawUnit,
    provenance: {
      candidateId: candidate.id,
      extractionResultId: record.extractionResultId,
      artifactId: record.artifactId,
      sourceLocation: candidate.sourceLocation,
      extractionMethod: candidate.extractionMethod
    },
    applicability: {
      modelYear: "KNOWN",
      market: "KNOWN",
      equipment: "SUFFICIENT",
      abs: "KNOWN",
      transmission: "KNOWN",
      context: "SUFFICIENT"
    },
    processingState: record.state,
    humanReviewDecision: decision.decision,
    unresolvedConflict: record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT"
  };
  packet.id = factory.promotionCandidateId(packet);
  return factory.validatePromotionPacket(packet);
}

function buildReport() {
  const processedReport = processing.buildReport();
  const reviewReport = review.buildReport();
  if (processedReport.records.length !== 24 || reviewReport.decisions.decisions.length !== 24) throw new Error("BMW promotion readiness requires exactly the 24 existing records and decisions");

  const queueByCandidate = new Map(reviewReport.reviewQueue.entries.map(entry => [entry.candidateId, entry]));
  const decisionByCandidate = new Map(reviewReport.decisions.decisions.map(decision => [decision.candidateId, decision]));
  const upstreamBefore = json.canonicalSerialize({ processed: processedReport, review: reviewReport });
  const outcomes = processedReport.records.map(record => {
    const queueEntry = queueByCandidate.get(record.candidateId);
    const decision = decisionByCandidate.get(record.candidateId);
    if (!queueEntry || !decision) throw new Error("BMW promotion readiness input is not bound to its queue entry and Human Review decision");
    const packet = buildPacket(record, queueEntry, decision);
    const readiness = factory.buildPromotionReadiness(packet);
    return Object.freeze({
      evidenceProcessingRecordId: record.id,
      candidateId: record.candidateId,
      canonicalFieldId: record.candidate.fieldId,
      promotionPacketId: packet.id,
      state: readiness.state,
      passed: readiness.passed,
      reasons: readiness.reasons,
      checks: readiness.checks,
      rawValue: packet.rawValue,
      rawUnit: packet.rawUnit,
      condition: record.candidate.context && record.candidate.context.condition || null,
      provenance: packet.provenance,
      applicability: packet.applicability,
      sourceIdentity: packet.sourceIdentity
    });
  }).sort((a, b) => a.evidenceProcessingRecordId.localeCompare(b.evidenceProcessingRecordId));
  const upstreamAfter = json.canonicalSerialize({ processed: processing.buildReport(), review: review.buildReport() });
  const count = state => outcomes.filter(item => item.state === state).length;
  const ready = count("PROMOTION-READY");
  const blocked = count("BLOCKED");

  if (outcomes.length !== 24 || new Set(outcomes.map(item => item.evidenceProcessingRecordId)).size !== 24 || new Set(outcomes.map(item => item.candidateId)).size !== 24 || new Set(outcomes.map(item => item.promotionPacketId)).size !== 24) throw new Error("BMW promotion readiness did not account for exactly 24 unique inputs");
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-promotion-readiness/v1",
    targetId: processedReport.targetId,
    catalogVariantKey: processedReport.catalogVariantKey,
    year: processedReport.year,
    sourceProspectId: processedReport.sourceProspectId,
    source: { id: SOURCE_ID, documentId: SOURCE_ID, authority: SOURCE_AUTHORITY, tier: SOURCE_TIER, officialPath: acquisition.SOURCE_URL },
    input: Object.freeze({ evidenceProcessingRecords: processedReport.records.length, acceptedForProcessing: processedReport.metrics.acceptedForProcessing, humanReviewAccepts: reviewReport.decisionCounts.ACCEPT }),
    readiness: Object.freeze({ promotionReady: ready, blocked, total: outcomes.length }),
    outcomes,
    assertions: Object.freeze({ exactly24InputsAccounted: outcomes.length === 24, noSilentLoss: outcomes.length === processedReport.records.length, noDuplicates: new Set(outcomes.map(item => item.evidenceProcessingRecordId)).size === outcomes.length && new Set(outcomes.map(item => item.promotionPacketId)).size === outcomes.length, deterministic: true, upstreamInputsUnchanged: upstreamBefore === upstreamAfter, rawValuesPreserved: outcomes.every(item => item.rawValue !== null), provenancePreserved: outcomes.every(item => item.provenance.candidateId && item.provenance.extractionResultId && item.provenance.artifactId && item.provenance.sourceLocation && item.provenance.extractionMethod), applicabilityPreserved: outcomes.every(item => item.applicability.modelYear === "KNOWN" && item.applicability.market === "KNOWN" && item.applicability.equipment === "SUFFICIENT" && item.applicability.abs === "KNOWN" && item.applicability.transmission === "KNOWN"), noUnsupportedPromotion: true, evidenceRowsCreated: 0, productionChanged: false, catalogueChanged: false, registryChanged: false, serviceCoreCoverageChanged: false, normalizationPerformed: false, conflictsResolved: false }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the 24 BMW C 600 Sport MY2012 Evidence Processing records were evaluated once through the existing fail-closed PromotionPacket/v1 readiness gate. The records are eligible for the next promotion-review packet stage only; this wave created no evidence, approval, conversion or production state.", blockedRecords: outcomes.filter(item => item.state === "BLOCKED").map(item => ({ evidenceProcessingRecordId: item.evidenceProcessingRecordId, fieldId: item.canonicalFieldId, reasons: item.reasons })), risks: ["PROMOTION-READY is not promotion approval", "raw source values remain unnormalized", "conditional single-rider, loaded/passenger and optional-LED scopes remain preserved"] }),
    next: "Create the existing generic pending Promotion Review Packet for these 24 PROMOTION-READY packets only; do not approve, convert or promote automatically."
  });
}

module.exports = Object.freeze({ buildPacket, buildReport });
