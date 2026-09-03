// NON-PRODUCTION fail-closed Phase 6 promotion readiness gate.
"use strict";

const contracts = require("./promotion-contracts.js");
const json = require("./json.js");

const evaluatePromotionReadiness = input => {
  const packet = contracts.validatePromotionPacket(input);
  const target = packet.targetIdentity;
  const source = packet.sourceIdentity;
  const provenance = packet.provenance;
  const checks = {
    processingAccepted: packet.processingState === "ACCEPTED-FOR-PROCESSING",
    noUnresolvedConflict: packet.unresolvedConflict === false,
    exactTargetIdentity: target.state === "KNOWN" && typeof target.catalogVariantKey === "string" && target.catalogVariantKey.length > 0,
    modelYearKnown: packet.applicability.modelYear === "KNOWN",
    marketKnown: packet.applicability.market === "KNOWN",
    equipmentSufficient: ["KNOWN", "SUFFICIENT"].includes(packet.applicability.equipment),
    absSufficient: ["KNOWN", "SUFFICIENT", "NOT-RELEVANT"].includes(packet.applicability.abs),
    transmissionSufficient: ["KNOWN", "SUFFICIENT", "NOT-RELEVANT"].includes(packet.applicability.transmission),
    sourceIdentityComplete: Boolean(source.sourceId && source.prospectId && source.documentId && source.authority && source.tier && source.officialPath),
    provenanceComplete: Boolean(provenance.candidateId && provenance.extractionResultId && provenance.artifactId && provenance.sourceLocation && provenance.extractionMethod),
    rawContextSufficient: packet.rawValue !== null && (packet.rawUnit === null || typeof packet.rawUnit === "string") && packet.applicability.context === "SUFFICIENT",
    humanReviewAccepted: packet.humanReviewDecision === "ACCEPT"
  };
  const failed = Object.freeze(Object.keys(checks).filter(key => !checks[key]));
  return Object.freeze({ state: failed.length === 0 ? "PROMOTION-READY" : "BLOCKED", passed: failed.length === 0, checks: Object.freeze(checks), reasons: failed, packet });
};

const buildPromotionReadiness = input => {
  const before = json.canonicalSerialize(input);
  const result = evaluatePromotionReadiness(input);
  if (json.canonicalSerialize(input) !== before) throw new Error("Promotion readiness mutated input");
  return result;
};

module.exports = Object.freeze({ evaluatePromotionReadiness, buildPromotionReadiness });
