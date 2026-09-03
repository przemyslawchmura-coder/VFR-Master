// NON-PRODUCTION first explicit Ducati promotion-review decision batch.
"use strict";

const factory = require("../factory/index.js");
const projection = require("./held-promotion-review-projection.js");

const SCOPE = Object.freeze([
  ["ignition.spark-plug-oem", "NGK MAR9A-J"],
  ["lubrication.viscosity", "SAE 15W-50"],
  ["lubrication.api-jaso", "API: SN; JASO: MA2"],
  ["electrical.battery-capacity", "6.5 Ah"],
  ["electrical.battery-specification", "YUASA YT 7B-BS DRY, 12 V"],
  ["cooling.capacity", "Cooling circuit: 2.25 litres"],
  ["brakes.brake-fluid", "Front/rear brake circuit: DOT 4"]
]);
const reviewerId = "human-promotion-review.ducati.monster937.batch1";

function buildReport() {
  const held = projection.buildReport();
  const before = factory.orchestrationJson.canonicalSerialize(held);
  const bmwBefore = factory.orchestrationJson.canonicalSerialize(held.bmw);
  const selected = SCOPE.map(([fieldId, rawValue]) => {
    const matches = held.ducati.packets.filter(packet => packet.canonicalFieldId === fieldId && packet.rawValue === rawValue);
    if (matches.length !== 1) throw new Error(`Ducati promotion review scope does not identify exactly one packet for ${fieldId}`);
    const packet = matches[0];
    const decision = factory.createPromotionReviewDecision(packet, { decision: "APPROVED-FOR-CONVERSION", reviewerId, rationale: "Exact canonical field identity, raw value, provenance and applicability are present in the existing pending packet; approval permits only a later bounded schema-conversion review and performs no conversion." });
    return Object.freeze({ fieldId, rawValue, promotionReviewPacketId: packet.id, promotionPacketId: packet.promotionPacketId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId, decision });
  });
  if (factory.orchestrationJson.canonicalSerialize(held) !== before) throw new Error("Ducati/BMW held review projection was mutated");
  const selectedIds = new Set(selected.map(item => item.promotionReviewPacketId));
  const remainingDucatiPending = held.ducati.packets.filter(packet => !selectedIds.has(packet.id) && packet.reviewState === "PENDING-PROMOTION-REVIEW").length;
  const decisionsByState = state => selected.filter(item => item.decision.decision === state).length;
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-promotion-review-decisions/v1", date: "2026-09-03", reviewerId, scope: SCOPE, reviewed: selected, counts: Object.freeze({ reviewed: selected.length, approvedForConversion: decisionsByState("APPROVED-FOR-CONVERSION"), needsPromotionReview: decisionsByState("NEEDS-PROMOTION-REVIEW"), rejectedForPromotion: decisionsByState("REJECTED-FOR-PROMOTION"), remainingDucatiPending }), bmwUnchanged: factory.orchestrationJson.canonicalSerialize(held.bmw) === bmwBefore, upstreamResearchStateChanged: false, productionStateChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, researchHumanReviewAcceptMeansPromotionApproval: false, promotionConversionPerformed: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly seven existing Ducati pending promotion-review packets received one explicit APPROVED-FOR-CONVERSION decision. This is a pre-conversion review outcome only; research Human Review ACCEPT was not reused as promotion approval and no conversion or production mutation occurred." }), exactNextTask: "Keep the seven decisions pre-conversion and all other Ducati/BMW packets unchanged; separately authorize any future schema-conversion task." });
}

module.exports = Object.freeze({ SCOPE, buildReport });
