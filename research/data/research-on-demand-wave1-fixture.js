// NON-PRODUCTION synthetic local fixture for Research on Demand Wave 1.
"use strict";

const contracts = require("../factory/reusable-knowledge-contracts.js");

const applicability = Object.freeze({
  schemaVersion: 1,
  model: { state: "KNOWN", values: ["Synthetic Roadster"] },
  generation: { state: "KNOWN", values: ["fixture-gen-a"] },
  years: { kind: "EXACT", from: 2098, to: 2098 },
  markets: { state: "KNOWN", values: ["FIXTURE-MARKET"] },
  transmissions: { state: "KNOWN", values: ["manual"] },
  abs: { state: "KNOWN", values: [true] },
  equipment: { state: "KNOWN", values: ["fixture-standard"] }
});

const demand = (canonicalFieldId, extra = {}) => contracts.validateReusableDemand({
  catalogVariantKey: "fixture.synthetic-roadster.gen-a",
  canonicalFieldId,
  operation: "read-synthetic-technical-value",
  applicability: extra.applicability || applicability,
  conditions: extra.conditions || { fixtureCondition: "base" },
  requiredApplicabilityDimensions: extra.requiredApplicabilityDimensions || ["year", "market", "abs", "transmission", "equipment"]
});

const safeDemand = demand("fixture.lubrication.synthetic-safe");
const reviewDemand = demand("fixture.brakes.synthetic-review");
const blockedDemand = demand("fixture.tires.synthetic-blocked");
const inProgressDemand = demand("fixture.electrical.synthetic-in-progress");

const provenance = field => ({ sourceId: `fixture.source.${field}`, sourceType: "synthetic-local-fixture", locator: `fixture://wave1/${field}` });
const records = Object.freeze([
  contracts.createReusableKnowledge({ demand: safeDemand, status: "REUSABLE", value: "SYNTHETIC-SAFE-VALUE-A", rawValue: "raw-fixture-safe-a", provenance: provenance("safe") }),
  contracts.createReusableKnowledge({ demand: reviewDemand, status: "AWAITING_HUMAN_REVIEW", value: null, rawValue: "raw-fixture-review-b", provenance: provenance("review") }),
  contracts.createReusableKnowledge({ demand: blockedDemand, status: "BLOCKED", value: null, rawValue: "raw-fixture-blocked-c", provenance: provenance("blocked") }),
  contracts.createReusableKnowledge({ demand: inProgressDemand, status: "IN_PROGRESS", value: null, rawValue: null, provenance: provenance("in-progress") })
]);

function buildFixture() {
  return Object.freeze({ schemaVersion: 1, applicability, demands: Object.freeze({ safeDemand, reviewDemand, blockedDemand, inProgressDemand }), records });
}

module.exports = Object.freeze({ buildFixture, applicability, demand, safeDemand, reviewDemand, blockedDemand, inProgressDemand, records });
