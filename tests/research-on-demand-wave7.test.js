"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");
const boundary = require("../server/research-on-demand-boundary.js");
const execution = require("../server/research-on-demand-execution.js");

const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260920115950_research_on_demand_wave7_execution.sql"), "utf8");
const demand = fixture.demand("lubrication.viscosity");
const context = { schemaVersion: 1, status: "ready", requiredContext: [], context: { catalogVariantKey: demand.catalogVariantKey, model: "Synthetic Roadster", generation: "fixture-gen-a", year: 2098, market: "FIXTURE-MARKET", abs: true, transmission: "manual", equipment: ["fixture-standard"], bodyStyle: null, manufacturer: "Synthetic", family: "Roadster" } };

function localService(options = {}) {
  let time = Date.parse("2098-01-01T00:00:00.000Z");
  const store = execution.createLocalExecutionStore({ clock: () => time });
  const service = execution.createTrustedAsyncExecutionService({ store, factoryExecutor: options.factoryExecutor || (() => ({ outcome: "SUCCESS", result: { demandId: demand.id, status: "REUSABLE", value: "SYNTHETIC-WAVE7", rawValue: "raw-wave7", provenance: { sourceId: "wave7.synthetic", sourceType: "synthetic-local-fixture", locator: "fixture://wave7" }, lineage: { boundary: "trusted-wave7", factoryBatchId: "batch.synthetic", sourceWorkItemId: "source-work.synthetic", checkpoint: "checkpoint.synthetic" } }, checkpoint: { phase: "FACTORY-COMPLETED" } })), reusableWriter: options.reusableWriter });
  return { service, store, advance: milliseconds => { time += milliseconds; } };
}

test("canonical execution identity derives only from the Wave 1 demand", () => {
  const first = factory.executionIdentity({ ...demand, userId: "user-a", garageRowId: "garage-a", batchId: "batch-a" });
  const second = factory.executionIdentity({ ...demand, userId: "user-b", garageRowId: "garage-b", batchId: "batch-b" });
  assert.deepEqual(first, second);
  assert.throws(() => execution.createTrustedAsyncExecutionService({ store: execution.createLocalExecutionStore(), factoryExecutor: () => ({ outcome: "SUCCESS" }) }).claim({ executionId: "research-execution.000000000000000000000000", workerId: "browser" }), /canonical demand/);
});

test("one demand creates one durable execution and equivalent ensure reuses it", () => {
  const { service, store } = localService();
  const first = service.ensure({ demand, maxAttempts: 3 });
  const second = service.ensure({ demand: { ...demand, userId: "other-user", garageRowId: "other-garage" } });
  assert.equal(first.outcome, "CREATED");
  assert.equal(second.outcome, "REUSED");
  assert.equal(store.snapshot().length, 1);
  assert.equal(first.identity.executionId, second.identity.executionId);
});

test("racing trusted workers produce one owner, durable lease and no browser claim path", () => {
  const { service } = localService();
  const created = service.ensure({ demand });
  const claims = ["worker-a", "worker-b"].map(workerId => service.claim({ demand, executionId: created.identity.executionId, workerId, leaseSeconds: 60 }));
  assert.deepEqual(claims.map(item => item.outcome).sort(), ["BUSY", "CLAIMED"]);
  assert.equal(claims.find(item => item.outcome === "CLAIMED").record.workerId, "worker-a");
  assert.equal(service.claim({ demand, executionId: created.identity.executionId, workerId: "browser" }).outcome, "BUSY");
});

test("expired lease is reclaimed and checkpoint survives request loss", () => {
  const { service, store, advance } = localService();
  const created = service.ensure({ demand });
  const claimed = service.claim({ demand, executionId: created.identity.executionId, workerId: "worker-a", leaseSeconds: 1 });
  assert.equal(service.checkpoint({ executionId: created.identity.executionId, workerId: "worker-a", value: { phase: "FACTORY-HANDOFF", eventCount: 4 } }).outcome, "CHECKPOINTED");
  advance(1001);
  const reclaimed = service.claim({ demand, executionId: created.identity.executionId, workerId: "worker-b", leaseSeconds: 60 });
  assert.equal(reclaimed.outcome, "CLAIMED");
  assert.equal(reclaimed.record.attemptCount, 2);
  assert.deepEqual(reclaimed.record.checkpoint, { phase: "FACTORY-HANDOFF", eventCount: 4 });
  assert.notEqual(claimed.record.workerId, reclaimed.record.workerId);
  assert.equal(store.read(created.identity.executionId).status, "RUNNING");
});

test("reclaimed execution resumes existing Factory lifecycle and persists synthetic reusable knowledge", async () => {
  let calls = 0;
  const repository = boundary.createAtomicLocalTrustedStore();
  const demandService = boundary.createTrustedResearchOnDemandBoundary({ store: repository, factoryHandoff: () => ({ eligible: true }) });
  const canonicalDemand = { ...demand }; delete canonicalDemand.id; delete canonicalDemand.knowledgeKey;
  demandService.request(canonicalDemand);
  const { service } = localService({
    factoryExecutor: ({ demand: currentDemand }) => { calls += 1; const run = factory.executeFactoryBridge({ context, demand: currentDemand }); return { outcome: "SUCCESS", result: { demandId: currentDemand.id, status: "REUSABLE", value: "SYNTHETIC-WAVE7", rawValue: "raw-wave7", provenance: { sourceId: run.prospect.id, sourceType: "synthetic-local-fixture", locator: "fixture://wave7/factory" }, lineage: { factoryBatchId: run.execution.snapshot.batch.id, sourceWorkItemId: run.execution.snapshot.sourceWorkItems[0].id, acquisitionResultId: run.execution.result.attemptId, boundary: "accepted-pre-evidence" } }, checkpoint: { phase: "FACTORY-COMPLETED", factoryBatchId: run.execution.snapshot.batch.id } }; },
    reusableWriter: input => { const canonical = { ...input.demand }; delete canonical.id; delete canonical.knowledgeKey; return demandService.persistFactoryResult({ demand: canonical, result: input.result }); }
  });
  const created = service.ensure({ demand });
  const result = await service.runOnce({ demand, executionId: created.identity.executionId, workerId: "worker-a" });
  assert.equal(result.record.status, "COMPLETED");
  assert.equal(calls, 1);
  assert.equal(repository.snapshot().knowledge[0].value, "SYNTHETIC-WAVE7");
  assert.equal(repository.snapshot().knowledge[0].lineage.boundary, "accepted-pre-evidence");
  assert.equal(service.read(created.identity.executionId).checkpoint.phase, "FACTORY-COMPLETED");
  assert.equal((await service.runOnce({ demand, executionId: created.identity.executionId, workerId: "worker-b" })).outcome, "COMPLETED");
  assert.equal(calls, 1);
});

test("retryable failure is bounded and terminal or explicit states never retry", async () => {
  let calls = 0;
  const { service } = localService({ factoryExecutor: () => { calls += 1; return { outcome: "RETRYABLE", failure: { reason: "synthetic transient" } }; } });
  const created = service.ensure({ demand, maxAttempts: 2 });
  assert.equal((await service.runOnce({ demand, executionId: created.identity.executionId, workerId: "worker-a" })).record.status, "RETRYABLE");
  assert.equal((await service.runOnce({ demand, executionId: created.identity.executionId, workerId: "worker-b" })).record.status, "TERMINAL");
  assert.equal((await service.runOnce({ demand, executionId: created.identity.executionId, workerId: "worker-c" })).outcome, "TERMINAL");
  assert.equal(calls, 2);
  for (const outcome of ["PERMANENT", "BLOCKED", "UNSUPPORTED", "AWAITING_HUMAN_REVIEW"]) {
    const current = fixture.demand(`fixture.async.${outcome.toLowerCase()}`);
    const local = localService({ factoryExecutor: () => ({ outcome }) });
    const made = local.service.ensure({ demand: current });
    const finished = await local.service.runOnce({ demand: current, executionId: made.identity.executionId, workerId: "worker" });
    assert.equal(finished.record.status, outcome === "PERMANENT" ? "TERMINAL" : outcome);
    assert.equal((await local.service.runOnce({ demand: current, executionId: made.identity.executionId, workerId: "worker-2" })).outcome, finished.record.status);
  }
});

test("Wave 7 SQL keeps execution storage and privileged mutation fail-closed", () => {
  assert.match(migration, /create table public\.research_execution_jobs/i);
  assert.match(migration, /unique \(demand_id\)/i);
  assert.match(migration, /for update/i);
  assert.match(migration, /lease_expires_at/i);
  assert.match(migration, /attempt_count = attempt_count \+ 1/i);
  assert.match(migration, /revoke all on table public\.research_execution_jobs from anon, authenticated/i);
  for (const name of ["create_research_execution", "read_research_execution", "claim_research_execution", "checkpoint_research_execution", "finish_research_execution"]) {
    assert.match(migration, new RegExp(`revoke all on function public\\.${name}`, "i"));
    assert.match(migration, new RegExp(`grant execute on function public\\.${name}.*to service_role`, "is"));
  }
  assert.doesNotMatch(migration, /api[_-]?ninjas|manufacturer|fetch\(|https?:\/\//i);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, "../server/research-on-demand-execution.js"), "utf8"), /service[_-]?role\s*[:=]\s*['"]|fetch\(|https?:\/\//i);
});
