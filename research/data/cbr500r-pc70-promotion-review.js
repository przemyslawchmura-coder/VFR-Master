// NON-PRODUCTION bounded pending promotion-review packet for one CBR500R record.
"use strict";

const factory = require("../factory/index.js");
const readinessProjection = require("./cbr500r-pc70-promotion-readiness.js");
const readinessReport = require("../reports/cbr500r-pc70-promotion-readiness.json");

const promotionCandidateId = "promotion-candidate.0c12373f56277561b2b692a2";
const applicabilityVerificationId = "applicability-verification.08059a67abc9eb226cb3fc82";

function buildPacket() {
  const readiness = readinessProjection.buildReadiness();
  if (readiness.state !== "PROMOTION-READY" || readiness.reasons.length !== 0) throw new Error("CBR500R promotion review requires the current PROMOTION-READY packet");
  if (readiness.packet.id !== promotionCandidateId) throw new Error("CBR500R promotion review packet identity is out of scope");
  if (readinessProjection.applicabilityVerification.id !== applicabilityVerificationId) throw new Error("CBR500R ABS applicability verification linkage is missing");
  return factory.createPendingPromotionReviewPacket(readiness, {
    promotionPacketId: promotionCandidateId,
    targetId: readiness.packet.targetIdentity.id,
    sourceProspectId: readiness.packet.sourceIdentity.prospectId,
    reviewQueueEntryId: readiness.packet.reviewQueueEntryId,
    humanReviewDecisionId: readiness.packet.humanReviewDecisionId,
    evidenceProcessingRecordId: readiness.packet.evidenceProcessingRecordId
  });
}

function buildReport() {
  const before = factory.orchestrationJson.canonicalSerialize(readinessProjection.record);
  const readiness = readinessProjection.buildReadiness();
  const packet = buildPacket();
  if (factory.orchestrationJson.canonicalSerialize(readinessProjection.record) !== before) throw new Error("Promotion review mutated upstream processing input");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-promotion-review/v1",
    promotionReviewSchemaVersion: factory.PROMOTION_REVIEW_SCHEMA_VERSION,
    promotionCandidateId,
    applicabilityVerificationId,
    readiness: { state: readiness.state, passed: readiness.passed, reasons: readiness.reasons },
    packet,
    assertions: { exactlyOneCandidateConsumed: true, readinessReady: readiness.state === "PROMOTION-READY" && readiness.reasons.length === 0, pendingState: packet.reviewState === "PENDING-PROMOTION-REVIEW", upstreamImmutable: true, rawValuePreserved: packet.rawValue === readiness.packet.rawValue, provenancePreserved: packet.provenance.candidateId === readiness.packet.provenance.candidateId, applicabilityPreserved: factory.orchestrationJson.canonicalSerialize(packet.applicability) === factory.orchestrationJson.canonicalSerialize(readiness.packet.applicability), noNormalization: true, noReviewerDecision: true, noPromotion: true, productionChanged: false }
  });
}

module.exports = Object.freeze({ buildPacket, buildReport });
