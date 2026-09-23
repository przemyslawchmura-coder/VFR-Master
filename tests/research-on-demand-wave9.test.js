"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const intake = require("../server/research-on-demand-intake.js");
const boundary = require("../server/research-on-demand-boundary.js");
const persistence = require("../research/factory/reusable-knowledge-persistence.js");
const factory = require("../research/factory/index.js");

const catalogue = {
  resolveByKey(key) {
    if (key !== "fixture.roadster.gen-a") return null;
    return { brand: { id: "fixture", name: "Fixture" }, model: { id: "roadster", name: "Roadster" }, variant: { id: "gen-a", key, name: "Generation A", yearFrom: 2020, yearTo: 2025 } };
  }
};

const motorcycle = (overrides = {}) => ({ catalogVariantKey: "fixture.roadster.gen-a", year: 2021, region: "EU", abs: true, transmission: "manual", equipment: ["standard"], ...overrides });
const request = (overrides = {}) => ({ motorcycle: motorcycle(), catalogue, fields: ["lubrication.viscosity"], ...overrides });
const seedReusable = (repository, demand) => {
  repository.claim({ demand, status: "MISSING" });
  repository.putKnowledge({ demand, status: "REUSABLE", value: "SAFE-VALUE", rawValue: "raw-safe", provenance: { sourceId: "fixture.source", sourceType: "synthetic-local-fixture", locator: "fixture://wave9" } });
  repository.setStatus({ demandId: demand.id, status: "REUSABLE" });
};

function makeService({ handoff = () => ({ eligible: true }) } = {}) {
  const store = boundary.createAtomicLocalTrustedStore();
  const trustedBoundary = boundary.createTrustedResearchOnDemandBoundary({ store, factoryHandoff: handoff });
  return { store, trustedBoundary, service: intake.createUserDemandIntake({ repository: store, trustedBoundary }) };
}

test("compatible knowledge is reused without creating durable research demand", () => {
  const repository = persistence.createLocalDurableRepository();
  const demand = factory.demandFor(factory.buildResearchContext(motorcycle(), catalogue), "lubrication.viscosity");
  seedReusable(repository, demand);
  const result = intake.createUserDemandIntake({ repository }).inspect(request());
  assert.equal(result.decision, "REUSED");
  assert.equal(result.results[0].classification, "REUSED");
  assert.equal(repository.snapshot().demands.length, 1);
});

test("missing knowledge becomes one canonical durable demand through the trusted boundary", () => {
  let handoffs = 0;
  const { store, service } = makeService({ handoff: () => { handoffs += 1; return { eligible: true }; } });
  const result = service.inspect(request());
  assert.equal(result.decision, "RESEARCH-REQUIRED");
  assert.equal(result.results[0].classification, "MISSING");
  assert.equal(result.results[0].durable.outcome, "CREATED");
  assert.equal(result.results[0].durable.demand.id, result.results[0].demand.id);
  assert.equal(handoffs, 1);
  assert.equal(store.snapshot().demands.length, 1);
});

test("identical repeated demand reuses the canonical identity and durable state", () => {
  let handoffs = 0;
  const { store, service } = makeService({ handoff: () => { handoffs += 1; return { eligible: true }; } });
  const first = service.inspect(request());
  const second = service.inspect(request({ motorcycle: motorcycle({ id: "different-garage", nickname: "ignored" }) }));
  assert.equal(first.results[0].demand.id, second.results[0].demand.id);
  assert.equal(first.results[0].durable.outcome, "CREATED");
  assert.equal(second.results[0].classification, "JOIN-IN-PROGRESS");
  assert.equal(second.results[0].durable, undefined);
  assert.equal(handoffs, 1);
  assert.equal(store.snapshot().demands.length, 1);
});

test("incompatible applicability is not silently reused", () => {
  const repository = persistence.createLocalDurableRepository();
  const base = factory.demandFor(factory.buildResearchContext(motorcycle(), catalogue), "lubrication.viscosity");
  seedReusable(repository, base);
  const result = intake.createUserDemandIntake({ repository }).inspect(request({ motorcycle: motorcycle({ region: "US" }) }));
  assert.equal(result.decision, "CONFLICT-AMBIGUOUS");
  assert.equal(result.results[0].classification, "INCOMPATIBLE");
  assert.equal(result.results[0].durable, undefined);
});

test("unknown critical applicability remains fail-closed", () => {
  const repository = persistence.createLocalDurableRepository();
  const result = intake.createUserDemandIntake({ repository }).inspect(request({ motorcycle: motorcycle({ region: null }) }));
  assert.equal(result.decision, "CONFLICT-AMBIGUOUS");
  assert.equal(result.results[0].classification, "CONTEXT-UNKNOWN");
  assert.equal(repository.snapshot().demands.length, 0);
});

test("missing catalogue identity remains unresolved without creating a demand", () => {
  const repository = persistence.createLocalDurableRepository();
  const result = intake.createUserDemandIntake({ repository }).inspect(request({ motorcycle: motorcycle({ catalogVariantKey: null }) }));
  assert.equal(result.decision, "CONFLICT-AMBIGUOUS");
  assert.deepEqual(result.requiredContext, ["catalogVariantKey", "catalogueVariant"]);
  assert.equal(repository.snapshot().demands.length, 0);
});

test("intake is server-side and does not expose trusted worker credentials or invoke the worker", () => {
  const source = fs.readFileSync(require.resolve("../server/research-on-demand-intake.js"), "utf8");
  assert.doesNotMatch(source, /RESEARCH_WORKER_TOKEN|SERVICE_ROLE_KEY|SUPABASE_SECRET_KEYS|supabase|fetch\s*\(/i);
  assert.doesNotMatch(source, /worker\.run|research-on-demand-worker/i);
});

test("known request context remains provider-neutral and canonical", () => {
  const repository = persistence.createLocalDurableRepository();
  const result = intake.createUserDemandIntake({ repository }).inspect(request({ motorcycle: motorcycle({ modelCode: "FIX-01", emissionsVariant: "EURO-FIX" }) }));
  assert.equal(result.decision, "RESEARCH-REQUIRED");
  assert.equal(result.results[0].demand.conditions.requestContext.modelCode, "FIX-01");
  assert.equal(result.results[0].demand.conditions.requestContext.emissionsVariant, "EURO-FIX");
  assert.doesNotMatch(JSON.stringify(result), /api.?ninjas|provider|http/i);
});
