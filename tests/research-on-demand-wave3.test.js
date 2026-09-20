"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const persistence = require("../research/factory/reusable-knowledge-persistence.js");

const catalogue = {
  resolveByKey(key) {
    if (key !== "fixture.roadster.gen-a") return null;
    return {
      brand: { id: "fixture", name: "Fixture" },
      model: { id: "roadster", name: "Roadster" },
      variant: { id: "gen-a", key, name: "Generation A", storedModel: "Roadster", yearFrom: 2020, yearTo: 2025 }
    };
  }
};

const motorcycle = (overrides = {}) => ({
  id: "garage-a",
  catalogVariantKey: "fixture.roadster.gen-a",
  year: 2021,
  region: "EU",
  abs: true,
  transmission: "manual",
  equipment: ["standard"],
  ...overrides
});

function seedReusable(repository, demand, value = "KNOWN-SAFE") {
  repository.claim({ demand, status: "MISSING", lifecycle: { requester: "seed" } });
  repository.putKnowledge({ demand, status: "REUSABLE", value, rawValue: `raw:${value}`, provenance: { sourceId: "fixture.seed", sourceType: "synthetic-local-fixture", locator: "fixture://seed" }, lineage: { reviewId: "seed-accepted-pre-evidence" } });
  repository.setStatus({ demandId: demand.id, status: "REUSABLE" });
}

test("active motorcycle maps to deterministic canonical context without garage identity", () => {
  const first = factory.buildResearchContext(motorcycle({ id: "garage-a" }), catalogue);
  const second = factory.buildResearchContext(motorcycle({ id: "garage-b", nickname: "other" }), catalogue);
  assert.deepEqual(first, second);
  assert.equal(first.context.catalogVariantKey, "fixture.roadster.gen-a");
  assert.equal(first.context.model, "roadster");
  assert.equal(first.context.generation, "gen-a");
  assert.equal(first.context.year, 2021);
  assert.equal(first.context.market, "EU");
});

test("Wave 3 performs reusable lookup first, creates one demand, uses Factory lifecycle and recomputes projection", () => {
  const repository = persistence.createLocalDurableRepository();
  const safe = factory.demandFor(factory.buildResearchContext(motorcycle(), catalogue), "lubrication.viscosity");
  seedReusable(repository, safe, "SAFE-VALUE");
  const result = factory.requestResearch({ motorcycle: motorcycle(), catalogue, fields: ["lubrication.viscosity", "cooling.capacity"], repository, syntheticValues: { "cooling.capacity": { value: "1.8 L", rawValue: "1.8 litres" } } });
  assert.equal(result.before.known.length, 1);
  assert.equal(result.before.missing.length, 1);
  assert.equal(result.work.length, 1);
  assert.equal(result.work[0].factoryRun.plan.summary.workItemsProduced, 1);
  assert.ok(result.work[0].factoryRun.events.some(event => event.type === "attempt-completed"));
  assert.equal(result.after.known.find(item => item.canonicalFieldId === "lubrication.viscosity").value, "SAFE-VALUE");
  assert.equal(result.after.known.find(item => item.canonicalFieldId === "cooling.capacity").value, "1.8 L");
  assert.equal(result.productionMaterialized, false);
  assert.equal(result.externalAcquisition, false);
  assert.equal(repository.snapshot().demands.length, 2);
  assert.equal(repository.snapshot().knowledge.length, 2);
});

test("equivalent second user reuses demand and result, while changed applicability is incompatible", () => {
  const repository = persistence.createLocalDurableRepository();
  const first = factory.requestResearch({ motorcycle: motorcycle({ id: "garage-a" }), catalogue, fields: ["cooling.capacity"], repository, syntheticValues: { "cooling.capacity": "1.8 L" } });
  const second = factory.requestResearch({ motorcycle: motorcycle({ id: "garage-b" }), catalogue, fields: ["cooling.capacity"], repository, syntheticValues: { "cooling.capacity": "SHOULD-NOT-RUN" } });
  assert.equal(first.demands[0].id, second.demands[0].id);
  assert.equal(second.work.length, 0);
  assert.equal(second.after.known[0].value, "1.8 L");
  assert.equal(repository.snapshot().demands.length, 1);
  const incompatible = factory.demandFor(factory.buildResearchContext(motorcycle({ region: "US" }), catalogue), "cooling.capacity");
  assert.equal(factory.lookupReusableKnowledge({ demand: incompatible, repository: repository.snapshot().knowledge }).classification, "INCOMPATIBLE");
});

test("unknown context fails closed and explicit blocked/review states do not hide safe fields", () => {
  const repository = persistence.createLocalDurableRepository();
  const context = factory.buildResearchContext(motorcycle(), catalogue);
  const safe = factory.demandFor(context, "lubrication.viscosity");
  const blocked = factory.demandFor(context, "brakes.fluid-interval");
  const review = factory.demandFor(context, "tires_wheels.front-size");
  seedReusable(repository, safe, "SAFE");
  repository.claim({ demand: blocked, status: "BLOCKED" });
  repository.claim({ demand: review, status: "AWAITING_HUMAN_REVIEW" });
  const partial = factory.requestResearch({ motorcycle: motorcycle(), catalogue, fields: ["lubrication.viscosity", "brakes.fluid-interval", "tires_wheels.front-size"], repository });
  assert.equal(partial.work.length, 0);
  assert.equal(partial.after.known[0].value, "SAFE");
  assert.equal(partial.after.blocked[0].canonicalFieldId, "brakes.fluid-interval");
  assert.equal(partial.after.review[0].canonicalFieldId, "tires_wheels.front-size");
  const unknown = factory.requestResearch({ motorcycle: motorcycle({ region: null }), catalogue, fields: ["cooling.capacity"], repository });
  assert.equal(unknown.context.status, "ready");
  assert.equal(unknown.after.contextUnknown[0].canonicalFieldId, "cooling.capacity");
  assert.equal(unknown.work.length, 0);
  assert.equal(repository.snapshot().demands.length, 3);
});

test("synthetic result preserves provenance and pre-evidence lineage without production mutation", () => {
  const repository = persistence.createLocalDurableRepository();
  const result = factory.requestResearch({ motorcycle: motorcycle(), catalogue, fields: ["cooling.capacity"], repository, syntheticValues: { "cooling.capacity": { value: "1.8 L", rawValue: "1.8 litres" } } });
  const record = repository.snapshot().knowledge[0];
  assert.equal(record.provenance.sourceType, "synthetic-local-fixture");
  assert.equal(record.rawValue, "1.8 litres");
  assert.equal(record.lineage.boundary, "accepted-pre-evidence");
  assert.equal(result.after.known[0].provenance.sourceType, "synthetic-local-fixture");
});
