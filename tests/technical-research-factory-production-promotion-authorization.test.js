"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const json = require("../research/factory/json.js");
const cbr500r = require("../research/data/cbr500r-pc70-schema-conversion-authorization.js");

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

test("CBR500R conversion authorization consumes exactly the ready projection", () => {
  const report = cbr500r.buildReport();
  assert.equal(report.schemaConversionId, "schema-conversion.0408c67195304a42913cbbb4");
  assert.equal(report.authorization.id, "production-authorization.42dfc09d17938fb18e6dc92d");
  assert.equal(report.authorization.authorizationState, "AUTHORIZATION-READY");
  assert.deepEqual(report.authorization.reasons, []);
  assert.equal(report.authorization.productionCreated, false);
  assert.equal(report.authorization.targetApplicability.abs, "KNOWN");
  assert.equal(report.authorization.proposedProduction.entryId, "lubrication.engine-oil.specification");
});

test("CBR500R authorization report is deterministic and production-isolated", () => {
  const first = cbr500r.buildReport();
  assert.deepEqual(cbr500r.buildReport(), first);
  assert.deepEqual(JSON.parse(require("node:fs").readFileSync(require("node:path").join(__dirname, "../research/reports/cbr500r-pc70-schema-conversion-authorization.json"), "utf8")), first);
  assert.equal(first.assertions.noMaterialization, true);
  assert.equal(first.assertions.noPromotion, true);
  assert.equal(first.assertions.productionChanged, false);
});
