"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const json = require("../research/factory/json.js");

function synthetic(overrides = {}) {
  const projection = { id: "schema-conversion.aaaaaaaaaaaaaaaaaaaaaaaa", promotionReviewDecisionId: "promotion-review-decision.bbbbbbbbbbbbbbbbbbbbbbbb", promotionReviewDecisionState: "APPROVED-FOR-CONVERSION", promotionReviewPacketId: "promotion-review-packet.cccccccccccccccccccccccc", promotionPacketId: "promotion-candidate.dddddddddddddddddddddddd", evidenceProcessingRecordId: "evidence-processing.eeeeeeeeeeeeeeeeeeeeeeee", researchCanonicalFieldId: "electrical.battery.capacity", targetIdentity: { id: "ducati.monster.937" }, sourceIdentity: { sourceId: "source.ducati", prospectId: "prospect.ducati", documentId: "manual.ducati", authority: "Ducati", tier: "A", officialPath: "https://ducati.example/manual" }, proposedProduction: { entryId: "electrical.battery.capacity", categoryId: "electrical", type: "specification", value: { type: "quantity", amount: 6.5, unit: "Ah" } }, sourceProvenance: { packet: { rawValue: "6.5 Ah", rawUnit: "Ah", provenance: { candidateId: "candidate.ffffffffffffffffffffffff", sourceLocation: { locator: "printed-page:1", section: "Battery" } } }, sourceLocation: { locator: "printed-page:1", section: "Battery" } }, targetApplicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" }, conversionState: "CONVERSION-READY", blockedReasons: [] };
  return Object.assign(projection, overrides);
}

test("accepted conversion projection is authorization-ready and immutable", () => {
  const input = synthetic(); const before = json.canonicalSerialize(input); const result = factory.authorizeSchemaConversion(input);
  assert.equal(result.authorizationState, "AUTHORIZATION-READY"); assert.equal(result.productionCreated, false); assert.equal(json.canonicalSerialize(input), before); assert.deepEqual(result.futureMaterializationRequirements, factory.FUTURE_MATERIALIZATION_REQUIREMENTS);
});

test("blocked conversion, missing provenance and insufficient applicability fail closed", () => {
  assert.equal(factory.authorizeSchemaConversion(synthetic({ conversionState: "CONVERSION-BLOCKED", blockedReasons: ["X"] })).authorizationState, "AUTHORIZATION-BLOCKED");
  assert.match(factory.authorizeSchemaConversion(synthetic({ sourceProvenance: null })).reasons.join(","), /PROVENANCE-INCOMPLETE/);
  assert.match(factory.authorizeSchemaConversion(synthetic({ targetApplicability: { modelYear: "KNOWN", market: "UNKNOWN", equipment: "SUFFICIENT", context: "SUFFICIENT" } })).reasons.join(","), /APPLICABILITY-INCOMPLETE/);
});

test("authorization IDs and results are deterministic", () => { assert.deepEqual(factory.authorizeSchemaConversion(synthetic()), factory.authorizeSchemaConversion(synthetic())); });
