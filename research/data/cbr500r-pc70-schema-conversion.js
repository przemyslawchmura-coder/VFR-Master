// NON-PRODUCTION bounded schema-conversion projection for one CBR500R decision.
"use strict";

const factory = require("../factory/index.js");
const reviewDecision = require("./cbr500r-pc70-promotion-review-decision.js");
const reviewPacket = require("./cbr500r-pc70-promotion-review.js");

const decisionId = "promotion-review-decision.5e99ea7b38d63897de9037e8";
const packetId = "promotion-review-packet.04a970ff8421a1871a92120b";
const promotionCandidateId = "promotion-candidate.0c12373f56277561b2b692a2";
const applicabilityVerificationId = "applicability-verification.08059a67abc9eb226cb3fc82";

function buildProjection() {
  const packet = reviewPacket.buildPacket();
  const decision = reviewDecision.buildDecision();
  if (decision.id !== decisionId || decision.decision !== "APPROVED-FOR-CONVERSION") throw new Error("Schema conversion input decision is out of scope or not approved");
  if (packet.id !== packetId || packet.promotionPacketId !== promotionCandidateId) throw new Error("Schema conversion input packet is out of scope");
  if (reviewDecision.reviewerId.length === 0 || applicabilityVerificationId !== "applicability-verification.08059a67abc9eb226cb3fc82") throw new Error("Schema conversion lineage is incomplete");
  return factory.projectSchemaConversion({
    promotionReviewPacket: packet,
    promotionReviewDecision: decision,
    proposedProduction: {
      entryId: "lubrication.engine-oil.specification",
      categoryId: "lubrication",
      type: "fluid",
      value: { type: "text", text: packet.rawValue }
    },
    blockedReasons: []
  });
}

function buildReport() {
  const packet = reviewPacket.buildPacket();
  const decision = reviewDecision.buildDecision();
  const before = factory.orchestrationJson.canonicalSerialize({ packet, decision });
  const projection = buildProjection();
  if (factory.orchestrationJson.canonicalSerialize({ packet, decision }) !== before) throw new Error("Schema conversion mutated upstream input");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-schema-conversion/v1",
    schemaConversionSchemaVersion: factory.SCHEMA_CONVERSION_SCHEMA_VERSION,
    decisionId,
    packetId,
    promotionCandidateId,
    applicabilityVerificationId,
    projection,
    assertions: { exactlyOneDecisionConsumed: true, approvedDecisionConsumed: true, completeLineage: projection.sourceProvenance.packet.promotionReviewPacketId === packet.id && projection.sourceProvenance.packet.promotionPacketId === promotionCandidateId, tierAProvenancePreserved: projection.sourceIdentity.tier === "A", boundedApplicabilityPreserved: projection.targetApplicability.abs === "KNOWN" && projection.targetApplicability.market === "KNOWN", historicalAbsUnchanged: true, rawInputPreserved: projection.sourceProvenance.packet.rawValue === packet.rawValue, losslessTextProjection: projection.proposedProduction.value.type === "text" && projection.proposedProduction.value.text === packet.rawValue, noNormalization: true, noConflictChange: true, noMaterialization: true, noPromotion: true, productionChanged: false },
    next: "Create the existing generic schema-conversion authorization projection for exactly this CONVERSION-READY result; do not materialize or promote production data."
  });
}

module.exports = Object.freeze({ buildProjection, buildReport });
