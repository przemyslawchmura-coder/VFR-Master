// NON-PRODUCTION Ducati Rider Service Core promotion-readiness projection.
// This audits processed records without creating promotion or production state.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-rider-service-core-acquisition.js");
const review = require("./ducati-monster937-rider-service-core-human-review.js");
const processing = require("./ducati-monster937-rider-service-core-evidence-processing.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");

const canonical = factory.orchestrationJson.canonicalSerialize;
const PRODUCTION_BLOCKER = "NO-LOSSLESS-PRODUCTION-MAPPING-ESTABLISHED";

function buildReport() {
  const processedReport = processing.buildReport();
  const reviewReport = review.buildReport();
  const canonicalInput = processing.buildCanonicalInput();
  const before = canonical({ candidates: acquisition.additionalCandidates, review: reviewReport, processed: processedReport });
  const originalDecisionByCandidate = new Map(reviewReport.decisions.decisions.filter(item => item.decision === "ACCEPT").map(item => [item.candidateId, item]));
  const profileEntryIds = new Set(profile.entries.map(entry => entry.id));
  const outcomes = processedReport.evidenceProcessingRecords.map(record => {
    const candidate = record.candidate;
    const originalCandidateId = candidate.context.originalCandidateId;
    const humanDecision = originalDecisionByCandidate.get(originalCandidateId);
    if (!humanDecision) throw new Error("processed candidate is not bound to an existing ACCEPT decision");
    const targetIdentity = { state: "KNOWN", id: acquisition.target.catalogVariantKey, catalogVariantKey: acquisition.target.catalogVariantKey, model: acquisition.target.model, year: acquisition.target.year, market: acquisition.target.market, equipment: acquisition.target.equipment };
    const sourceIdentity = { sourceId: acquisition.source.id, prospectId: "unknown.ducati.monster937", documentId: acquisition.source.documentId, authority: acquisition.source.publisher, tier: "A", officialPath: acquisition.source.url };
    const applicability = { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" };
    const packet = { schemaVersion: factory.PROMOTION_SCHEMA_VERSION, id: "placeholder", targetIdentity, sourceIdentity, reviewQueueEntryId: canonicalInput.queue.entries.find(entry => entry.candidate.context.originalCandidateId === originalCandidateId).id, humanReviewDecisionId: humanDecision.id, evidenceProcessingRecordId: record.id, canonicalFieldId: candidate.fieldId, rawValue: candidate.rawValue, rawUnit: candidate.rawUnit, provenance: { candidateId: candidate.id, extractionResultId: candidate.extractionResultId, artifactId: candidate.artifactId, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod }, applicability, processingState: record.state, humanReviewDecision: humanDecision.decision, unresolvedConflict: record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT" };
    packet.id = factory.promotionCandidateId(packet);
    const gate = factory.buildPromotionReadiness(packet);
    const domain = factory.RIDER_SERVICE_CORE_MATRIX.fieldMap[candidate.fieldId].domainId;
    const duplicateProductionEntry = profileEntryIds.has(candidate.fieldId);
    return Object.freeze({ candidateId: originalCandidateId, evidenceProcessingRecordId: record.id, humanReviewDecisionId: humanDecision.id, canonicalFieldId: candidate.fieldId, riderServiceCoreDomain: domain, gateState: gate.state, gateReasons: gate.reasons, readinessState: "BLOCKED", readinessReasons: Object.freeze([PRODUCTION_BLOCKER]), duplicateProductionEntry, maintenanceStructurePreserved: domain !== "periodic-maintenance" || Boolean(candidate.context && candidate.sourceLocation), fuseAssociationPreserved: candidate.fieldId !== "electrical.fuse-ratings" || Boolean(candidate.context && candidate.context.structure === "function-amperage-location"), lightingSemanticsPreserved: !candidate.fieldId.startsWith("lighting.") || Boolean(candidate.context), rawValue: candidate.rawValue, rawUnit: candidate.rawUnit, provenance: packet.provenance, applicability: packet.applicability });
  }).sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  if (outcomes.length !== 39 || new Set(outcomes.map(item => item.candidateId)).size !== outcomes.length) throw new Error("Ducati promotion-readiness inputs are not represented exactly once");
  if (canonical({ candidates: acquisition.additionalCandidates, review: reviewReport, processed: processedReport }) !== before) throw new Error("promotion-readiness projection mutated upstream input");
  const byDomain = Object.fromEntries(factory.RIDER_SERVICE_CORE_MATRIX.domains.map(domain => [domain.id, outcomes.filter(item => item.riderServiceCoreDomain === domain.id && item.readinessState === "PROMOTION-READY").length]));
  const structuralRepresentationBlocked = outcomes.filter(item => !item.maintenanceStructurePreserved || !item.fuseAssociationPreserved || !item.lightingSemanticsPreserved).length;
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-rider-service-core-promotion-readiness/v1", target: acquisition.target, source: acquisition.source, processedInputsReceived: processedReport.evidenceProcessingRecords.length, promotionReady: outcomes.filter(item => item.readinessState === "PROMOTION-READY").length, alreadyCovered: outcomes.filter(item => item.duplicateProductionEntry).length, productionRepresentationBlocked: outcomes.filter(item => item.readinessReasons.includes(PRODUCTION_BLOCKER)).length, structuralRepresentationBlocked, provenanceApplicabilityConflictBlocked: outcomes.filter(item => item.gateState === "BLOCKED").length, otherReadinessOutcomes: 0, duplicatesOrCollisions: outcomes.filter(item => item.duplicateProductionEntry).length, readyByRiderServiceCoreDomain: byDomain, maintenanceReadiness: Object.freeze({ inputs: outcomes.filter(item => item.riderServiceCoreDomain === "periodic-maintenance").length, blocked: outcomes.filter(item => item.riderServiceCoreDomain === "periodic-maintenance" && !item.maintenanceStructurePreserved).length, semanticsPreserved: outcomes.filter(item => item.riderServiceCoreDomain === "periodic-maintenance").every(item => item.maintenanceStructurePreserved) }), fuseReadiness: Object.freeze({ inputs: outcomes.filter(item => item.canonicalFieldId === "electrical.fuse-ratings").length, blocked: outcomes.filter(item => item.canonicalFieldId === "electrical.fuse-ratings" && !item.fuseAssociationPreserved).length, associationPreserved: outcomes.filter(item => item.canonicalFieldId === "electrical.fuse-ratings").every(item => item.fuseAssociationPreserved) }), lightingReadiness: Object.freeze({ inputs: outcomes.filter(item => item.riderServiceCoreDomain === "lighting").length, blocked: outcomes.filter(item => item.riderServiceCoreDomain === "lighting" && !item.lightingSemanticsPreserved).length, semanticsPreserved: outcomes.filter(item => item.riderServiceCoreDomain === "lighting").every(item => item.lightingSemanticsPreserved) }), coolingCapacity: Object.freeze({ entered: false, state: "BLOCKED", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" }), excludedNeedsMoreReview: 5, outcomes, productionDucatiChanged: false, productionDucatiEntryCount: profile.entries.length, vfrChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, humanReviewDecisionsChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "All 39 processed Ducati Rider Service Core records pass the canonical identity/provenance/applicability gate, but remain blocked because no lossless production-schema mapping has been established for these fields. The fuse candidate also lacks a preserved structured association in the current processing payload, so it is not promoted by inference. Existing production entries, structured source meaning and upstream review state remain unchanged." }), exactNextTask: "Define and review lossless generic production mappings for the blocked Core fields before any separate promotion wave; keep the five deferred candidates and cooling excluded." });
}

module.exports = Object.freeze({ buildReport });
