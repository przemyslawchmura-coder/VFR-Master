"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const json = require("../research/factory/json.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");

const buildRequest = (demand, extras = {}) => ({ ...demand, ...extras });

test("equivalent canonical demands share identity independent of user or property order", () => {
  const first = factory.validateReusableDemand({ ...fixture.safeDemand, userId: "user-a", garageRowId: "garage-a", batchId: "batch-a" });
  const second = factory.validateReusableDemand({
    requiredApplicabilityDimensions: [...fixture.safeDemand.requiredApplicabilityDimensions].reverse(),
    conditions: { fixtureCondition: "base" },
    operation: fixture.safeDemand.operation,
    applicability: { ...fixture.applicability, equipment: { values: ["fixture-standard"], state: "KNOWN" } },
    canonicalFieldId: fixture.safeDemand.canonicalFieldId,
    catalogVariantKey: fixture.safeDemand.catalogVariantKey,
    userId: "user-b",
    garageRowId: "garage-b",
    batchId: "batch-b"
  });
  assert.equal(first.id, second.id);
  assert.equal(first.knowledgeKey, second.knowledgeKey);
  assert.equal(json.canonicalSerialize(first), json.canonicalSerialize(second));
});

test("different applicability produces a different identity and an explicit incompatible result", () => {
  const differentMarket = factory.validateReusableDemand(buildRequest(fixture.safeDemand, {
    applicability: { ...fixture.applicability, markets: { state: "KNOWN", values: ["OTHER-FIXTURE-MARKET"] } }
  }));
  assert.notEqual(differentMarket.id, fixture.safeDemand.id);
  const result = factory.lookupReusableKnowledge({ demand: differentMarket, repository: fixture.records });
  assert.equal(result.classification, "INCOMPATIBLE");
  assert.equal(result.newResearchNeeded, true);
});

test("unknown required applicability fails closed without reuse", () => {
  const unknownMarket = factory.validateReusableDemand(buildRequest(fixture.safeDemand, {
    applicability: { ...fixture.applicability, markets: { state: "UNKNOWN", values: [] } }
  }));
  const result = factory.lookupReusableKnowledge({ demand: unknownMarket, repository: fixture.records });
  assert.equal(result.classification, "CONTEXT-UNKNOWN");
  assert.deepEqual(result.contextMissingDimensions, ["market"]);
  assert.equal(result.record, null);
});

test("exact reusable knowledge lookup preserves value, raw value, provenance and applicability", () => {
  const result = factory.lookupReusableKnowledge({ demand: fixture.safeDemand, repository: fixture.records });
  assert.equal(result.classification, "REUSED");
  assert.equal(result.status, "REUSABLE");
  assert.equal(result.record.value, "SYNTHETIC-SAFE-VALUE-A");
  assert.equal(result.record.rawValue, "raw-fixture-safe-a");
  assert.equal(result.record.provenance.sourceId, "fixture.source.safe");
  assert.deepEqual(result.record.applicability, fixture.safeDemand.applicability);
});

test("partial projection is deterministic, order-independent and keeps review/block states explicit", () => {
  const requests = [fixture.blockedDemand, fixture.safeDemand, fixture.inProgressDemand, fixture.reviewDemand];
  const first = factory.projectReusableKnowledge({ requests, repository: fixture.records });
  const second = factory.projectReusableKnowledge({ requests: [...requests].reverse(), repository: fixture.records });
  assert.deepEqual(first, second);
  assert.deepEqual(first.known.map(item => item.canonicalFieldId), ["fixture.lubrication.synthetic-safe"]);
  assert.deepEqual(first.review.map(item => item.canonicalFieldId), ["fixture.brakes.synthetic-review"]);
  assert.deepEqual(first.blocked.map(item => item.canonicalFieldId), ["fixture.tires.synthetic-blocked"]);
  assert.deepEqual(first.inProgress.map(item => item.canonicalFieldId), ["fixture.electrical.synthetic-in-progress"]);
  assert.equal(first.known[0].value, "SYNTHETIC-SAFE-VALUE-A");
  assert.equal(first.blocked[0].value, null);
  assert.equal(first.productionMaterialized, false);
  assert.equal(first.externalAcquisition, false);
});

test("equivalent demand states classify as join/reuse, while absent knowledge needs new research", () => {
  assert.equal(factory.lookupReusableKnowledge({ demand: fixture.safeDemand, repository: fixture.records }).classification, "REUSED");
  assert.equal(factory.lookupReusableKnowledge({ demand: fixture.inProgressDemand, repository: fixture.records }).classification, "JOIN-IN-PROGRESS");
  assert.equal(factory.lookupReusableKnowledge({ demand: fixture.reviewDemand, repository: fixture.records }).classification, "JOIN-HUMAN-REVIEW");
  assert.equal(factory.lookupReusableKnowledge({ demand: fixture.blockedDemand, repository: fixture.records }).classification, "PRESERVE-BLOCKED");
  const missing = fixture.demand("fixture.cooling.synthetic-missing");
  const missingResult = factory.lookupReusableKnowledge({ demand: missing, repository: fixture.records });
  assert.equal(missingResult.classification, "MISSING");
  assert.equal(missingResult.newResearchNeeded, true);
});

test("fixture and contract remain non-production and do not acquire or materialize", () => {
  const result = factory.projectReusableKnowledge({ requests: [fixture.safeDemand], repository: fixture.records });
  assert.equal(result.productionMaterialized, false);
  assert.equal(result.externalAcquisition, false);
  assert.equal(fixture.buildFixture().schemaVersion, 1);
  assert.ok(fixture.records.every(record => record.provenance.sourceType === "synthetic-local-fixture"));
});
