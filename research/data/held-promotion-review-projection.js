// NON-PRODUCTION read-only eligibility projection for future human promotion review.
"use strict";

const factory = require("../factory/index.js");
const heldProjection = require("./held-promotion-projection.js");

const canonical = factory.orchestrationJson.canonicalSerialize;

function projectDataset(dataset) {
  const before = canonical(dataset);
  const eligible = dataset.projections.filter(item => item.readiness.state === "PROMOTION-READY");
  const packets = eligible.map(item => factory.createPendingPromotionReviewPacket(item.readiness));
  const excluded = dataset.projections.filter(item => item.readiness.state !== "PROMOTION-READY").map(item => ({ processingRecordId: item.processingRecordId, reasons: item.readiness.reasons }));
  if (canonical(dataset) !== before) throw new Error(`${dataset.name} held projection was mutated`);
  return Object.freeze({ name: dataset.name, total: dataset.total, eligibleReviewPackets: packets.length, blockedOrExcluded: excluded.length, blockedReasons: dataset.blockedReasons, packets, excluded, upstreamUnchanged: dataset.upstreamUnchanged && dataset.rawValuesUnitsProvenanceApplicabilityUnchanged });
}

function buildReport() {
  const held = heldProjection.buildReport();
  const before = canonical(held);
  const ducati = projectDataset(held.ducati);
  const bmw = projectDataset(held.bmw);
  if (canonical(held) !== before) throw new Error("Held promotion projection was mutated");
  return Object.freeze({ schemaVersion: "revlog-held-promotion-review-projection/v1", date: "2026-09-03", mode: "READ-ONLY", ducati, bmw, promotionApprovalsCreated: 0, upstreamResearchStateChanged: false, productionStateChanged: false, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, researchHumanReviewAcceptMeansPromotionApproval: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Only PROMOTION-READY held records were presented as PENDING-PROMOTION-REVIEW packets. No promotion-review approval, rejection or needs-review decision was created; research Human Review ACCEPT remains a separate pre-evidence decision." }), exactNextTask: "Keep packets pending; obtain a separate explicit human promotion-review decision before any future schema conversion." });
}

module.exports = Object.freeze({ buildReport });
