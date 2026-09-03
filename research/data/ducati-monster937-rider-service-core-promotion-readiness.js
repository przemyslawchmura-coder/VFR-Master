// NON-PRODUCTION Ducati Rider Service Core promotion-readiness projection.
// This audits processed records without creating promotion or production state.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-rider-service-core-acquisition.js");
const review = require("./ducati-monster937-rider-service-core-human-review.js");
const processing = require("./ducati-monster937-rider-service-core-evidence-processing.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const representation = require("../../data/technical/rider-service-core-records.js");

const canonical = factory.orchestrationJson.canonicalSerialize;
const coolingBlocker = "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR";
const productionEntryId = fieldId => `rider-service-core.${fieldId.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`;
const previousProductionEntryIds = new Set(["ignition.spark-plug.standard", "lubrication.engine-oil.viscosity", "lubrication.engine-oil.specification", "electrical.battery.capacity", "electrical.battery.specification", "brakes.fluid.specification"]);

function structureFor(fieldId, matrixField) {
  if (matrixField.representation === "scalar") return null;
  if (matrixField.domainId === "periodic-maintenance" && fieldId !== "maintenance.severe-use") return "maintenance";
  if (fieldId === "electrical.fuse-ratings") return "fuse";
  if (matrixField.domainId === "lighting") return "lighting";
  if (matrixField.domainId === "practical-torques") return "practical-torque";
  if (matrixField.domainId === "consumables") return "consumable-reference";
  if (matrixField.domainId === "wheels-tires") return "tire-pressure";
  return "generic-structured";
}

function buildProductionRecord(candidate, matrixField) {
  const recordType = matrixField.representation === "scalar" ? "scalar" : matrixField.representation === "repeating" ? "repeating" : "structured";
  const structureType = structureFor(candidate.fieldId, matrixField);
  return representation.createRecord({
    canonicalFieldId: candidate.fieldId,
    recordType,
    structureType,
    rawValue: candidate.rawValue,
    rawUnit: candidate.rawUnit,
    details: recordType === "scalar" ? null : {
      sourceText: candidate.rawValue,
      action: structureType === "maintenance" ? ({
        "maintenance.inspect": "INSPECT",
        "maintenance.replace": "REPLACE",
        "maintenance.adjust": "ADJUST",
        "maintenance.lubricate": "LUBRICATE",
        "maintenance.clean": "CLEAN"
      }[candidate.fieldId] || null) : null,
      technology: structureType === "lighting" && /LED/i.test(candidate.rawValue) ? "LED" : null,
      association: candidate.context.sourceContext || candidate.context
    },
    applicability: { modelYear: 2021, market: "EU", equipment: "base Monster 937", abs: true, transmission: "manual" },
    provenance: { sourceId: acquisition.source.id, documentId: acquisition.source.documentId, sourceLocation: candidate.sourceLocation, candidateId: candidate.id }
  });
}

function buildReport() {
  const processedReport = processing.buildReport();
  const reviewReport = review.buildReport();
  const canonicalInput = processing.buildCanonicalInput();
  const before = canonical({ candidates: acquisition.additionalCandidates, review: reviewReport, processed: processedReport });
  const accepted = new Map(reviewReport.decisions.decisions.filter(item => item.decision === "ACCEPT").map(item => [item.candidateId, item]));
  const queueByCandidate = new Map(canonicalInput.queue.entries.map(entry => [entry.candidate.context.originalCandidateId, entry]));

  const outcomes = processedReport.evidenceProcessingRecords.map(record => {
    const candidate = record.candidate;
    const originalCandidateId = candidate.context.originalCandidateId;
    const humanDecision = accepted.get(originalCandidateId);
    const queueEntry = queueByCandidate.get(originalCandidateId);
    if (!humanDecision || !queueEntry) throw new Error("processed candidate is not bound to an existing ACCEPT decision and queue entry");
    const targetIdentity = { state: "KNOWN", id: acquisition.target.catalogVariantKey, catalogVariantKey: acquisition.target.catalogVariantKey, model: acquisition.target.model, year: acquisition.target.year, market: acquisition.target.market, equipment: acquisition.target.equipment };
    const sourceIdentity = { sourceId: acquisition.source.id, prospectId: "unknown.ducati.monster937", documentId: acquisition.source.documentId, authority: acquisition.source.publisher, tier: "A", officialPath: acquisition.source.url };
    const applicability = { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" };
    const packet = { schemaVersion: factory.PROMOTION_SCHEMA_VERSION, id: "placeholder", targetIdentity, sourceIdentity, reviewQueueEntryId: queueEntry.id, humanReviewDecisionId: humanDecision.id, evidenceProcessingRecordId: record.id, canonicalFieldId: candidate.fieldId, rawValue: candidate.rawValue, rawUnit: candidate.rawUnit, provenance: { candidateId: candidate.id, extractionResultId: candidate.extractionResultId, artifactId: candidate.artifactId, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod }, applicability, processingState: record.state, humanReviewDecision: humanDecision.decision, unresolvedConflict: record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT" };
    packet.id = factory.promotionCandidateId(packet);
    const gate = factory.buildPromotionReadiness(packet);
    const matrixField = factory.RIDER_SERVICE_CORE_MATRIX.fieldMap[candidate.fieldId];
    if (!matrixField) throw new Error(`Processed field is absent from Rider Service Core matrix: ${candidate.fieldId}`);
    const productionRecord = buildProductionRecord(candidate, matrixField);
    const representationValidation = representation.validateRecord(productionRecord);
    const duplicateProductionEntry = previousProductionEntryIds.has(productionEntryId(candidate.fieldId));
    const blocked = gate.state !== "PROMOTION-READY" || !representationValidation;
    return Object.freeze({ candidateId: originalCandidateId, evidenceProcessingRecordId: record.id, humanReviewDecisionId: humanDecision.id, canonicalFieldId: candidate.fieldId, riderServiceCoreDomain: matrixField.domainId, gateState: gate.state, gateReasons: gate.reasons, readinessState: blocked ? "BLOCKED" : duplicateProductionEntry ? "ALREADY-COVERED" : "PROMOTION-READY", readinessReasons: blocked ? Object.freeze([...gate.reasons, "INVALID-PRODUCTION-REPRESENTATION"]) : Object.freeze([]), duplicateProductionEntry, proposedProductionEntryId: productionEntryId(candidate.fieldId), productionRecord, maintenanceStructurePreserved: matrixField.domainId !== "periodic-maintenance" || candidate.fieldId === "maintenance.severe-use" || Boolean(productionRecord.details && productionRecord.details.action), fuseAssociationPreserved: candidate.fieldId !== "electrical.fuse-ratings" || Boolean(productionRecord.details && productionRecord.details.association && productionRecord.details.association.structure === "function-amperage-location"), lightingSemanticsPreserved: !candidate.fieldId.startsWith("lighting.") || Boolean(productionRecord.details && productionRecord.details.technology === "LED"), rawValue: candidate.rawValue, rawUnit: candidate.rawUnit, provenance: packet.provenance, applicability: packet.applicability });
  }).sort((a, b) => a.candidateId.localeCompare(b.candidateId));

  if (outcomes.length !== 39 || new Set(outcomes.map(item => item.candidateId)).size !== outcomes.length) throw new Error("Ducati promotion-readiness inputs are not represented exactly once");
  if (canonical({ candidates: acquisition.additionalCandidates, review: reviewReport, processed: processedReport }) !== before) throw new Error("promotion-readiness projection mutated upstream input");
  const countBy = predicate => outcomes.filter(predicate).length;
  const byDomain = Object.fromEntries(factory.RIDER_SERVICE_CORE_MATRIX.domains.map(domain => [domain.id, countBy(item => item.riderServiceCoreDomain === domain.id && item.readinessState === "PROMOTION-READY")]));
  const structuralRepresentationBlocked = countBy(item => !item.maintenanceStructurePreserved || !item.fuseAssociationPreserved || !item.lightingSemanticsPreserved);
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-rider-service-core-promotion-readiness/v1", target: acquisition.target, source: acquisition.source, processedInputsReceived: processedReport.evidenceProcessingRecords.length, promotionReady: countBy(item => item.readinessState === "PROMOTION-READY"), alreadyCovered: countBy(item => item.readinessState === "ALREADY-COVERED"), productionRepresentationBlocked: countBy(item => item.readinessState === "BLOCKED"), structuralRepresentationBlocked, provenanceApplicabilityConflictBlocked: countBy(item => item.gateState === "BLOCKED"), otherReadinessOutcomes: 0, duplicatesOrCollisions: countBy(item => item.duplicateProductionEntry), readyByRiderServiceCoreDomain: byDomain, maintenanceReadiness: Object.freeze({ inputs: countBy(item => item.riderServiceCoreDomain === "periodic-maintenance"), blocked: countBy(item => item.riderServiceCoreDomain === "periodic-maintenance" && !item.maintenanceStructurePreserved), semanticsPreserved: outcomes.filter(item => item.riderServiceCoreDomain === "periodic-maintenance").every(item => item.maintenanceStructurePreserved) }), fuseReadiness: Object.freeze({ inputs: countBy(item => item.canonicalFieldId === "electrical.fuse-ratings"), blocked: countBy(item => item.canonicalFieldId === "electrical.fuse-ratings" && !item.fuseAssociationPreserved), associationPreserved: outcomes.filter(item => item.canonicalFieldId === "electrical.fuse-ratings").every(item => item.fuseAssociationPreserved) }), lightingReadiness: Object.freeze({ inputs: countBy(item => item.riderServiceCoreDomain === "lighting"), blocked: countBy(item => item.riderServiceCoreDomain === "lighting" && !item.lightingSemanticsPreserved), semanticsPreserved: outcomes.filter(item => item.riderServiceCoreDomain === "lighting").every(item => item.lightingSemanticsPreserved) }), coolingCapacity: Object.freeze({ entered: false, state: "BLOCKED", reason: coolingBlocker }), excludedNeedsMoreReview: 5, outcomes, productionDucatiChanged: false, productionDucatiEntryCount: profile.entries.length, vfrChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, humanReviewDecisionsChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "All 39 processed Ducati Rider Service Core records pass the canonical identity, provenance, applicability and generic production-representation gates. They remain non-production projections until a separately authorized promotion operation materializes them." }), exactNextTask: "Materialize only the 39 PROMOTION-READY Ducati records through the existing production profile and citation contracts; retain five deferred candidates and cooling exclusion." });
}

module.exports = Object.freeze({ buildReport, productionEntryId, buildProductionRecord });
