// NON-PRODUCTION bounded Human Promotion Review decisions for exactly the 24 BMW packets.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const pending = require("./mass-scale-bmw-c600-promotion-review.js");
const readiness = require("./mass-scale-bmw-c600-promotion-readiness.js");

const REVIEWER_ID = "human-promotion-review.bmw-c600.batch1";

function rationale(packet, conditionalByRecord) {
  const condition = conditionalByRecord.get(packet.evidenceProcessingRecordId);
  const conditionText = condition ? ` Conditional context remains explicit and unchanged: ${condition.condition}.` : "";
  return `Exact BMW C 600 Sport MY2012 field identity, raw value, source identity, locator, provenance and target applicability are present in the existing pending packet. Approve only for a separately authorized bounded schema-conversion review; preserve the raw source wording and do not create evidence or production state.${conditionText}`;
}

function buildReport() {
  const pendingReport = pending.buildReport();
  const readinessReport = readiness.buildReport();
  if (pendingReport.packets.length !== 24 || pendingReport.counts.pending !== 24 || pendingReport.counts.approved !== 0 || pendingReport.counts.rejected !== 0 || pendingReport.counts.needsReview !== 0) throw new Error("BMW decision scope requires exactly 24 pending packets and no prior decisions");
  if (readinessReport.readiness.promotionReady !== 24 || readinessReport.readiness.blocked !== 0) throw new Error("BMW decision scope requires unchanged 24/24 promotion readiness");
  const before = json.canonicalSerialize({ pending: pendingReport, readiness: readinessReport });
  const conditionalByRecord = new Map(pendingReport.conditionalContexts.map(item => [item.evidenceProcessingRecordId, item]));
  const decisions = pendingReport.packets.map(packet => factory.createPromotionReviewDecision(packet, { decision: "APPROVED-FOR-CONVERSION", reviewerId: REVIEWER_ID, rationale: rationale(packet, conditionalByRecord) })).sort((a, b) => a.id.localeCompare(b.id));
  const after = json.canonicalSerialize({ pending: pending.buildReport(), readiness: readiness.buildReport() });
  if (before !== after) throw new Error("BMW promotion review decision mutated upstream input");
  if (decisions.length !== 24 || new Set(decisions.map(decision => decision.id)).size !== 24 || new Set(decisions.map(decision => decision.promotionReviewPacketId)).size !== 24) throw new Error("BMW promotion review did not produce exactly one unique decision per packet");
  const conditionalPacketIds = new Set(pendingReport.conditionalContexts.map(item => pendingReport.packets.find(packet => packet.evidenceProcessingRecordId === item.evidenceProcessingRecordId).id));
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-promotion-review-decisions/v1",
    targetId: pendingReport.targetId,
    catalogVariantKey: pendingReport.catalogVariantKey,
    year: pendingReport.year,
    sourceProspectId: pendingReport.sourceProspectId,
    reviewerId: REVIEWER_ID,
    input: Object.freeze({ pendingPackets: pendingReport.packets.length, promotionReady: readinessReport.readiness.promotionReady, blocked: readinessReport.readiness.blocked }),
    decisions,
    counts: Object.freeze({ reviewed: decisions.length, approvedForConversion: decisions.filter(decision => decision.decision === "APPROVED-FOR-CONVERSION").length, rejectedForPromotion: decisions.filter(decision => decision.decision === "REJECTED-FOR-PROMOTION").length, needsPromotionReview: decisions.filter(decision => decision.decision === "NEEDS-PROMOTION-REVIEW").length, conditionalContextsReviewed: decisions.filter(decision => conditionalPacketIds.has(decision.promotionReviewPacketId)).length }),
    assertions: Object.freeze({ exactly24Inputs: pendingReport.packets.length === 24, exactly24Decisions: decisions.length === 24, noMissingPackets: decisions.every(decision => pendingReport.packets.some(packet => packet.id === decision.promotionReviewPacketId)), noDuplicateDecisions: new Set(decisions.map(decision => decision.id)).size === decisions.length, noDuplicatePackets: new Set(decisions.map(decision => decision.promotionReviewPacketId)).size === decisions.length, packetIdsPreserved: decisions.every(decision => pendingReport.packets.some(packet => packet.id === decision.promotionReviewPacketId && packet.promotionPacketId === decision.promotionPacketId)), provenancePreserved: pendingReport.assertions.provenancePreserved, sourceIdentityPreserved: pendingReport.assertions.sourceIdentityPreserved, applicabilityPreserved: pendingReport.assertions.applicabilityPreserved, rawValuesPreserved: pendingReport.assertions.rawValuesPreserved, conditionsPreserved: pendingReport.assertions.conditionsPreserved && conditionalPacketIds.size === 9, researchHumanReviewAcceptNotReused: true, readinessNotAutoApproval: true, conversionPerformed: false, evidenceRowsCreated: 0, productionChanged: false, catalogueChanged: false, registryChanged: false, serviceCoreCoverageChanged: false, cloudChanged: false, upstreamUnchanged: before === after }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the 24 existing BMW C 600 Sport MY2012 pending packets received one explicit APPROVED-FOR-CONVERSION decision through the generic contract. Approval permits only a separately authorized downstream schema-conversion review; no conversion, evidence creation, production materialization or Service Core change occurred.", rejected: [], deferred: [], needsMoreReview: [], risks: ["APPROVED-FOR-CONVERSION is not schema conversion or production approval", "conditional raw contexts remain bounded and must be preserved downstream", "research Human Review ACCEPT and PROMOTION-READY were not treated as this decision"] }),
    next: "Create a separately authorized bounded schema-conversion projection for exactly these 24 APPROVED-FOR-CONVERSION decisions; do not materialize or promote automatically."
  });
}

module.exports = Object.freeze({ REVIEWER_ID, buildReport });
