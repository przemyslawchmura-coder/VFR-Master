"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

function synthetic(overrides = {}) {
  const packet = { schemaVersion: 1, id: "promotion-review-packet.111111111111111111111111", promotionPacketId: "promotion-candidate.222222222222222222222222", targetIdentity: { id: "target.synthetic", catalogVariantKey: "fixture.variant" }, sourceIdentity: { prospectId: "prospect.synthetic", documentId: "document.synthetic" }, reviewQueueEntryId: "review-queue-entry.333333333333333333333333", humanReviewDecisionId: "promotion-review-decision.444444444444444444444444", evidenceProcessingRecordId: "evidence-processing.555555555555555555555555", canonicalFieldId: "lubrication.viscosity", rawValue: "SAE 15W-50", rawUnit: null, provenance: { candidateId: "extraction-candidate.666666666666666666666666", sourceLocation: { page: 1, section: "Oil" } }, applicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN" }, ...overrides };
  const decision = { id: "promotion-review-decision.777777777777777777777777", promotionReviewPacketId: packet.id, promotionPacketId: packet.promotionPacketId, evidenceProcessingRecordId: packet.evidenceProcessingRecordId, canonicalFieldId: packet.canonicalFieldId, decision: "APPROVED-FOR-CONVERSION" };
  return { packet, decision };
}

test("lossless synthetic mapping is CONVERSION-READY", () => {
  const { packet, decision } = synthetic();
  const result = factory.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: { entryId: "lubrication.engine-oil.viscosity", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "SAE 15W-50" } }, blockedReasons: [] });
  assert.equal(result.conversionState, "CONVERSION-READY");
  assert.equal(result.proposedProduction.value.text, "SAE 15W-50");
});

test("blocked mapping remains CONVERSION-BLOCKED", () => {
  const { packet, decision } = synthetic({ canonicalFieldId: "cooling.capacity", rawValue: "Cooling circuit: 2.25 litres" });
  const result = factory.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: { entryId: "cooling.coolant.capacity-engine-radiator", categoryId: "cooling", type: "fluid", value: { type: "quantity", amount: 2.25, unit: "L" } }, blockedReasons: ["COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR"] });
  assert.equal(result.conversionState, "CONVERSION-BLOCKED");
  assert.ok(result.blockedReasons.includes("COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR"));
});

test("identity mismatch and non-approved decisions fail closed", () => {
  const { packet, decision } = synthetic();
  assert.throws(() => factory.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: { ...decision, promotionPacketId: "promotion-candidate.888888888888888888888888" }, proposedProduction: { entryId: "x", categoryId: "x", type: "fluid", value: { type: "text", text: "x" } }, blockedReasons: [] }), /identity mismatch/);
  assert.throws(() => factory.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: { ...decision, decision: "REJECTED-FOR-PROMOTION" }, proposedProduction: { entryId: "x", categoryId: "x", type: "fluid", value: { type: "text", text: "x" } }, blockedReasons: [] }), /APPROVED-FOR-CONVERSION/);
});

test("projection preserves inputs and proposed raw value without profile or registry writes", () => {
  const { packet, decision } = synthetic();
  const before = JSON.stringify({ packet, decision });
  const result = factory.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: { entryId: "lubrication.engine-oil.viscosity", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "SAE 15W-50" } }, blockedReasons: [] });
  assert.equal(JSON.stringify({ packet, decision }), before);
  assert.equal(result.sourceProvenance.packet.rawValue, "SAE 15W-50");
  assert.equal(result.sourceProvenance.packet.rawUnit, null);
  assert.equal(result.productionProfileCreated, undefined);
});

test("conversion IDs and results are deterministic", () => {
  const input = synthetic();
  const args = { promotionReviewPacket: input.packet, promotionReviewDecision: input.decision, proposedProduction: { entryId: "lubrication.engine-oil.viscosity", categoryId: "lubrication", type: "fluid", value: { type: "text", text: "SAE 15W-50" } }, blockedReasons: [] };
  assert.deepEqual(factory.projectSchemaConversion(args), factory.projectSchemaConversion(args));
});
