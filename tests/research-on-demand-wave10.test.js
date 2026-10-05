"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const intake = require("../server/research-on-demand-intake.js");
const boundary = require("../server/research-on-demand-boundary.js");
const execution = require("../server/research-on-demand-execution.js");
const factoryAdapter = require("../server/research-on-demand-factory.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");

const context = { schemaVersion: 1, status: "ready", requiredContext: [], context: { catalogVariantKey: fixture.safeDemand.catalogVariantKey, model: "Synthetic Roadster", generation: "fixture-gen-a", year: 2098, market: "FIXTURE-MARKET", abs: true, transmission: "manual", equipment: ["fixture-standard"], bodyStyle: null, modelCode: "FIX-01", emissionsVariant: "EURO-FIX", manufacturer: "Synthetic", family: "Roadster" } };
const catalogue = { resolveByKey: key => key === context.context.catalogVariantKey ? { brand: { id: "synthetic", name: "Synthetic" }, model: { id: "roadster", name: "Roadster" }, variant: { id: "fixture-gen-a", key, name: "Fixture Generation A", yearFrom: 2098, yearTo: 2098 } } : null };
const motorcycle = (overrides = {}) => ({ catalogVariantKey: context.context.catalogVariantKey, year: 2098, region: "FIXTURE-MARKET", abs: true, transmission: "manual", equipment: ["fixture-standard"], modelCode: "FIX-01", emissionsVariant: "EURO-FIX", ...overrides });
const proofField = "lubrication.viscosity";
const request = (overrides = {}) => ({ motorcycle: motorcycle(), catalogue, fields: [proofField], ...overrides });

function setup({ resultResolver = () => fixture.records[0], factoryExecutor, reusableWriter } = {}) {
  const store = boundary.createAtomicLocalTrustedStore();
  const trustedBoundary = boundary.createTrustedResearchOnDemandBoundary({ store, factoryHandoff: () => ({ eligible: true }) });
  const service = intake.createUserDemandIntake({ repository: store, trustedBoundary });
  const inspected = service.inspect(request());
  const demand = inspected.results[0].demand;
  const executor = factoryExecutor || factoryAdapter.createRepositoryBackedFactoryExecutor({ context, resultResolver: input => ({ ...resultResolver(input), demandId: demand.id }) });
  const writer = reusableWriter || (input => {
    const { id, knowledgeKey, schemaVersion, ...canonicalDemand } = input.demand;
    return trustedBoundary.persistFactoryResult({ demand: canonicalDemand, result: input.result });
  });
  const executionService = execution.createTrustedAsyncExecutionService({ store: execution.createLocalExecutionStore(), factoryExecutor: executor, reusableWriter: writer });
  return { store, trustedBoundary, service, inspected, demand, executionService };
}

test("Wave 10 runs the existing Factory, persists through Wave 5, and reuses later", async () => {
  let factoryCalls = 0;
  const configured = setup({ resultResolver: ({ factoryRun }) => { factoryCalls += 1; assert.equal(factoryRun.execution.result.outcome.outcome, "ACQUIRED"); return fixture.records[0]; } });
  const created = configured.executionService.ensure({ demand: configured.demand });
  const result = await configured.executionService.runOnce({ demand: configured.demand, executionId: created.identity.executionId, workerId: "wave10-worker" });
  assert.equal(result.record.status, "COMPLETED");
  assert.equal(result.record.checkpoint.phase, "FACTORY-COMPLETED");
  assert.equal(factoryCalls, 1);
  assert.equal(configured.store.snapshot().knowledge[0].value, fixture.records[0].value);
  assert.equal(configured.store.snapshot().knowledge[0].canonicalFieldId, proofField);
  assert.deepEqual(configured.store.snapshot().knowledge[0].conditions.requestContext, { modelCode: "FIX-01", emissionsVariant: "EURO-FIX" });
  assert.equal(configured.store.snapshot().knowledge[0].lineage.boundary, "accepted-pre-evidence");
  const later = configured.service.inspect(request());
  assert.equal(later.decision, "REUSED");
  assert.equal(later.results[0].classification, "REUSED");
  assert.equal(configured.store.snapshot().demands.length, 1);
});

test("Wave 10 preserves modelCode/emissionsVariant and rejects incompatible or unknown applicability", async () => {
  const configured = setup();
  const created = configured.executionService.ensure({ demand: configured.demand });
  await configured.executionService.runOnce({ demand: configured.demand, executionId: created.identity.executionId, workerId: "wave10-worker" });
  const incompatible = configured.service.inspect(request({ motorcycle: motorcycle({ region: "OTHER-MARKET" }) }));
  assert.equal(incompatible.decision, "CONFLICT-AMBIGUOUS");
  assert.equal(incompatible.results[0].classification, "INCOMPATIBLE");
  const unknown = configured.service.inspect(request({ motorcycle: motorcycle({ region: null }) }));
  assert.equal(unknown.decision, "CONFLICT-AMBIGUOUS");
  assert.equal(unknown.results[0].classification, "CONTEXT-UNKNOWN");
  const withContext = configured.service.inspect(request({ motorcycle: motorcycle({ modelCode: "FIX-01", emissionsVariant: "EURO-FIX" }) }));
  assert.equal(withContext.results[0].demand.conditions.requestContext.modelCode, "FIX-01");
  assert.equal(withContext.results[0].demand.conditions.requestContext.emissionsVariant, "EURO-FIX");
});

test("Factory failure and trusted persistence failure cannot complete the job", async () => {
  const factoryFailed = setup({ factoryExecutor: async () => { throw new Error("factory failed"); } });
  const first = factoryFailed.executionService.ensure({ demand: factoryFailed.demand, maxAttempts: 1 });
  const firstResult = await factoryFailed.executionService.runOnce({ demand: factoryFailed.demand, executionId: first.identity.executionId, workerId: "wave10-worker" });
  assert.equal(firstResult.record.status, "TERMINAL");
  assert.notEqual(firstResult.record.status, "COMPLETED");

  const persistenceFailed = setup({ reusableWriter: async () => { throw new Error("persistence failed"); } });
  const second = persistenceFailed.executionService.ensure({ demand: persistenceFailed.demand, maxAttempts: 1 });
  const secondResult = await persistenceFailed.executionService.runOnce({ demand: persistenceFailed.demand, executionId: second.identity.executionId, workerId: "wave10-worker" });
  assert.equal(secondResult.record.status, "TERMINAL");
  assert.notEqual(secondResult.record.status, "COMPLETED");
});

test("Wave 10 remains server-side, provider-neutral and non-production", () => {
  const source = fs.readFileSync(require.resolve("../server/research-on-demand-factory.js"), "utf8");
  assert.doesNotMatch(source, /fetch\s*\(|api.?ninjas|SERVICE_ROLE_KEY|RESEARCH_WORKER_TOKEN|supabase/i);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, "../server/research-on-demand-factory.js"), "utf8"), /productionProfile|registry|technical-profile-core-matrix/i);
  assert.equal(context.context.catalogVariantKey, fixture.safeDemand.catalogVariantKey);
});
