// NON-PRODUCTION read-only schema-conversion projection for exactly the 24 BMW decisions.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const decisions = require("./mass-scale-bmw-c600-promotion-review-decisions.js");
const packets = require("./mass-scale-bmw-c600-promotion-review.js");
const readiness = require("./mass-scale-bmw-c600-promotion-readiness.js");
const processing = require("./mass-scale-bmw-c600-evidence-processing.js");

const BLOCKED_REASONS = Object.freeze([]);

function buildReport() {
  const decisionReport = decisions.buildReport();
  const packetReport = packets.buildReport();
  const readinessReport = readiness.buildReport();
  const processingReport = processing.buildReport();
  if (decisionReport.decisions.length !== 24 || decisionReport.counts.approvedForConversion !== 24) throw new Error("BMW schema conversion requires exactly 24 approved decisions");
  if (packetReport.packets.length !== 24 || readinessReport.outcomes.length !== 24 || processingReport.records.length !== 24) throw new Error("BMW schema conversion upstream scope is not exactly 24 records");

  const packetById = new Map(packetReport.packets.map(packet => [packet.id, packet]));
  const conditionalByRecord = new Map(packetReport.conditionalContexts.map(item => [item.evidenceProcessingRecordId, item]));
  const upstreamBefore = json.canonicalSerialize({ decisionReport, packetReport, readinessReport, processingReport });
  const projections = decisionReport.decisions.map(decision => {
    const packet = packetById.get(decision.promotionReviewPacketId);
    if (!packet) throw new Error(`BMW schema conversion input packet is missing: ${decision.promotionReviewPacketId}`);
    const categoryId = packet.canonicalFieldId.split(".")[0];
    return factory.projectSchemaConversion({
      promotionReviewDecision: decision,
      promotionReviewPacket: packet,
      proposedProduction: {
        entryId: packet.canonicalFieldId,
        categoryId,
        type: "raw-text",
        value: { type: "text", text: packet.rawValue }
      },
      blockedReasons: BLOCKED_REASONS
    });
  }).sort((a, b) => a.id.localeCompare(b.id));
  const upstreamAfter = json.canonicalSerialize({
    decisionReport: decisions.buildReport(),
    packetReport: packets.buildReport(),
    readinessReport: readiness.buildReport(),
    processingReport: processing.buildReport()
  });
  if (upstreamBefore !== upstreamAfter) throw new Error("BMW schema conversion mutated upstream state");
  if (projections.length !== 24 || new Set(projections.map(item => item.id)).size !== 24 || new Set(projections.map(item => item.promotionReviewDecisionId)).size !== 24) throw new Error("BMW schema conversion did not produce one unique outcome per decision");

  const conditionalContexts = [...conditionalByRecord.values()].sort((a, b) => a.evidenceProcessingRecordId.localeCompare(b.evidenceProcessingRecordId)).map(context => {
    const projection = projections.find(item => item.evidenceProcessingRecordId === context.evidenceProcessingRecordId);
    if (!projection || projection.sourceProvenance.packet.rawValue !== packetById.get(projection.promotionReviewPacketId).rawValue) throw new Error(`BMW conditional context lost: ${context.evidenceProcessingRecordId}`);
    return Object.freeze({ ...context, promotionReviewPacketId: projection.promotionReviewPacketId, schemaConversionProjectionId: projection.id });
  });
  const conversionReady = projections.filter(item => item.conversionState === "CONVERSION-READY");
  const conversionBlocked = projections.filter(item => item.conversionState === "CONVERSION-BLOCKED");
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-schema-conversion/v1",
    targetId: packetReport.targetId,
    catalogVariantKey: packetReport.catalogVariantKey,
    year: packetReport.year,
    sourceProspectId: packetReport.sourceProspectId,
    contract: "SchemaConversionProjection/v1 via generic Research Factory contract",
    input: Object.freeze({ decisionsReceived: decisionReport.decisions.length, eligible: decisionReport.counts.approvedForConversion, missing: 0, duplicates: 0 }),
    projections,
    conditionalContexts,
    counts: Object.freeze({ total: projections.length, conversionReady: conversionReady.length, conversionBlocked: conversionBlocked.length }),
    blockedReasons: Object.freeze(Object.fromEntries([...new Set(conversionBlocked.flatMap(item => item.blockedReasons))].sort().map(reason => [reason, conversionBlocked.filter(item => item.blockedReasons.includes(reason)).length]))),
    handling: Object.freeze({ representation: "LOSSLESS-RAW-TEXT", numericNormalization: false, unitConversion: false, compoundDecomposition: false, compoundValuesRetainedAsRawText: true, conditionsRetainedInUpstreamContextMap: true }),
    assertions: Object.freeze({ exactly24ApprovedInputs: decisionReport.counts.approvedForConversion === 24, exactly24Outcomes: projections.length === 24, noMissingInputs: projections.every(item => decisionReport.decisions.some(decision => decision.id === item.promotionReviewDecisionId)), noDuplicateInputs: new Set(projections.map(item => item.promotionReviewDecisionId)).size === projections.length, deterministicIds: projections.every(item => item.id === factory.schemaConversionId(item)), stableOrdering: projections.every((item, index) => index === 0 || projections[index - 1].id.localeCompare(item.id) < 0), completeLineage: projections.every(item => item.sourceProvenance.packet.promotionReviewDecisionId === undefined && item.sourceProvenance.packet.promotionReviewPacketId === item.promotionReviewPacketId && item.sourceProvenance.packet.promotionPacketId === item.promotionPacketId && item.sourceProvenance.packet.evidenceProcessingRecordId === item.evidenceProcessingRecordId && item.sourceProvenance.packet.canonicalFieldId === item.researchCanonicalFieldId), rawValuesPreserved: projections.every(item => item.proposedProduction.value.text === item.sourceProvenance.packet.rawValue), provenancePreserved: projections.every(item => item.sourceProvenance.packet.provenance.candidateId && item.sourceProvenance.sourceLocation), sourceIdentityPreserved: projections.every(item => item.sourceIdentity.documentId && item.sourceIdentity.prospectId), applicabilityPreserved: projections.every(item => item.targetApplicability.modelYear === "KNOWN" && item.targetApplicability.market === "KNOWN" && item.targetApplicability.equipment === "SUFFICIENT" && item.targetApplicability.context === "SUFFICIENT"), conditionalContextsPreserved: conditionalContexts.length === 9 && conditionalContexts.every(item => item.condition), noConversionOfNumbers: projections.every(item => item.proposedProduction.value.type === "text"), noEvidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, catalogueChanged: false, registryChanged: false, cloudChanged: false, upstreamUnchanged: upstreamBefore === upstreamAfter }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the 24 approved BMW C 600 Sport MY2012 decisions were projected through the generic SchemaConversionProjection/v1 contract. All 24 are lossless raw-text conversion-ready projections; no numeric normalization, compound decomposition, evidence creation or production materialization occurred.", blocked: conversionBlocked.map(item => ({ id: item.id, field: item.researchCanonicalFieldId, reasons: item.blockedReasons })) }),
    next: "Separately authorize a bounded evidence-materialization review for exactly these 24 conversion-ready projections; do not materialize automatically."
  });
}

module.exports = Object.freeze({ buildReport });
