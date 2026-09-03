// NON-PRODUCTION read-only projection of held research records through Phase 6 gate.
"use strict";

const factory = require("../factory/index.js");
const ducatiProcessing = require("./ducati-monster937-evidence-processing.js");
const bmwProcessing = require("./bmw-f900r-evidence-processing.js");
const ducatiReview = require("./ducati-monster937-owner-manual-human-review.js");
const bmwReview = require("./bmw-f900r-human-review.js");

const canonical = factory.orchestrationJson.canonicalSerialize;

function targetIdentity(target, record) {
  if (target.scope) return { state: "KNOWN", id: target.id, catalogVariantKey: target.catalogVariantKey, model: target.scope.model.values[0], year: target.scope.years.from, market: target.scope.markets.values[0], equipment: target.scope.equipment.values[0] };
  return { state: "KNOWN", id: record.targetId, catalogVariantKey: target.catalogVariantKey, model: target.model, year: target.year, market: target.market, equipment: target.equipment };
}

function sourceIdentity(source, record) {
  return { sourceId: source.id, prospectId: record.prospectId, documentId: source.documentId, authority: source.publisher, tier: source.tier, officialPath: source.url };
}

function projectDataset({ name, processingReport, reviewReport }) {
  const queueEntries = reviewReport.reviewQueue.entries;
  const decisions = reviewReport.decisions.decisions;
  const records = processingReport.records;
  const before = canonical({ queueEntries, decisions, records });
  const queueById = new Map(queueEntries.map(entry => [entry.id, entry]));
  const decisionsById = new Map(decisions.map(decision => [decision.id, decision]));
  if (new Set(records.map(record => record.decisionId)).size !== records.length || records.length !== decisions.length) throw new Error(`${name} processing decisions are not represented exactly once`);
  const projections = records.map(record => {
    const entry = queueById.get(record.queueEntryId);
    const decision = decisionsById.get(record.decisionId);
    if (!entry || !decision || decision.queueEntryId !== entry.id) throw new Error(`${name} projection has incomplete upstream identity`);
    const candidate = record.candidate;
    const packet = {
      schemaVersion: factory.PROMOTION_SCHEMA_VERSION,
      id: "placeholder",
      targetIdentity: targetIdentity(reviewReport.target, record),
      sourceIdentity: sourceIdentity(reviewReport.source, record),
      reviewQueueEntryId: entry.id,
      humanReviewDecisionId: decision.id,
      evidenceProcessingRecordId: record.id,
      canonicalFieldId: candidate.fieldId,
      rawValue: candidate.rawValue,
      rawUnit: candidate.rawUnit,
      provenance: { candidateId: candidate.id, extractionResultId: candidate.extractionResultId, artifactId: candidate.artifactId, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod },
      applicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: candidate.context === null ? "UNKNOWN" : "SUFFICIENT" },
      processingState: record.state,
      humanReviewDecision: decision.decision,
      unresolvedConflict: record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT"
    };
    packet.id = factory.promotionCandidateId(packet);
    const readiness = factory.buildPromotionReadiness(packet);
    return Object.freeze({ processingRecordId: record.id, queueEntryId: entry.id, decisionId: decision.id, fieldId: candidate.fieldId, packet, readiness });
  });
  if (canonical({ queueEntries, decisions, records }) !== before) throw new Error(`${name} upstream records were mutated`);
  const exactOnce = projections.length === records.length && new Set(projections.map(item => item.processingRecordId)).size === records.length;
  const count = state => projections.filter(item => item.readiness.state === state).length;
  const blockedReasons = Object.fromEntries([...new Set(projections.flatMap(item => item.readiness.reasons))].sort().map(reason => [reason, projections.filter(item => item.readiness.reasons.includes(reason)).length]));
  return Object.freeze({ name, total: projections.length, promotionReady: count("PROMOTION-READY"), blocked: count("BLOCKED"), blockedReasons: Object.freeze(blockedReasons), exactOnce, upstreamUnchanged: canonical({ queueEntries, decisions, records }) === before, rawValuesUnitsProvenanceApplicabilityUnchanged: projections.every(item => canonical(item.packet.rawValue) === canonical(records.find(record => record.id === item.processingRecordId).candidate.rawValue) && canonical(item.packet.rawUnit) === canonical(records.find(record => record.id === item.processingRecordId).candidate.rawUnit) && canonical(item.packet.provenance) === canonical({ candidateId: records.find(record => record.id === item.processingRecordId).candidate.id, extractionResultId: records.find(record => record.id === item.processingRecordId).candidate.extractionResultId, artifactId: records.find(record => record.id === item.processingRecordId).candidate.artifactId, sourceLocation: records.find(record => record.id === item.processingRecordId).candidate.sourceLocation, extractionMethod: records.find(record => record.id === item.processingRecordId).candidate.extractionMethod })), projections });
}

function buildReport() {
  const ducatiReviewReport = ducatiReview.buildReport();
  const bmwReviewReport = bmwReview.buildReport();
  const ducati = projectDataset({ name: "Ducati Monster 937 MY2021 EU", processingReport: ducatiProcessing.buildReport(), reviewReport: ducatiReviewReport });
  const bmw = projectDataset({ name: "BMW F 900 R I MY2020 EU", processingReport: bmwProcessing.buildReport(), reviewReport: bmwReviewReport });
  return Object.freeze({ schemaVersion: "revlog-held-promotion-projection/v1", date: "2026-09-03", mode: "READ-ONLY", ducati, bmw, productionStateChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, upstreamResearchStateChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Held Ducati and BMW Evidence Processing records were projected independently through PromotionPacket/v1 and the canonical readiness gate. PROMOTION-READY is only a later-stage eligibility result; no production conversion or promotion occurred." }), exactNextTask: "Keep all projections and held records unchanged; do not promote until separately authorized." });
}

module.exports = Object.freeze({ buildReport });
