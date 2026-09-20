"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const boundary = require("../server/research-on-demand-boundary.js");
const factory = require("../research/factory/index.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");

const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260920120000_research_on_demand_wave5_trusted_boundary.sql"), "utf8");
const request = () => ({
  catalogVariantKey: fixture.safeDemand.catalogVariantKey,
  canonicalFieldId: fixture.safeDemand.canonicalFieldId,
  operation: fixture.safeDemand.operation,
  applicability: fixture.safeDemand.applicability,
  conditions: fixture.safeDemand.conditions,
  requiredApplicabilityDimensions: fixture.safeDemand.requiredApplicabilityDimensions
});

function serviceWith(handoff = () => ({ factory: "existing", execution: "deferred" })) {
  const store = boundary.createAtomicLocalTrustedStore();
  const service = boundary.createTrustedResearchOnDemandBoundary({ store, factoryHandoff: handoff });
  return { store, service };
}

test("trusted boundary derives Wave 1 identity and rejects forged request state", () => {
  const { service } = serviceWith();
  const derived = service.deriveCanonicalDemand(request());
  assert.equal(derived.id, fixture.safeDemand.id);
  assert.equal(derived.knowledgeKey, fixture.safeDemand.knowledgeKey);
  for (const key of ["demandId", "knowledgeKey", "status", "provenance", "lineage", "userId", "garageRowId"]) {
    assert.throws(() => service.request({ ...request(), [key]: "forged" }), /not accepted/);
  }
  assert.throws(() => service.request({ ...request(), applicability: { ...request().applicability, markets: { state: "UNKNOWN", values: [] } } }), error => error.code === "CONTEXT-UNKNOWN");
});

test("equivalent simultaneous requests create one durable demand and one Factory handoff", async () => {
  let handoffs = 0;
  const { store, service } = serviceWith(() => { handoffs += 1; return { factory: "existing", eligible: true }; });
  const results = await Promise.all([service.request(request()), service.request(request())]);
  assert.deepEqual(results.map(result => result.outcome).sort(), ["CREATED", "REUSED-EXISTING-STATE"]);
  assert.equal(handoffs, 1);
  assert.equal(store.snapshot().demands.length, 1);
  assert.equal(results.filter(result => result.outcome === "CREATED")[0].handoff.eligible, true);
});

test("claim survives request end and later equivalent request joins durable IN_PROGRESS", () => {
  const { service } = serviceWith();
  const first = service.request(request());
  const second = service.request(request());
  assert.equal(first.outcome, "CREATED");
  assert.equal(second.outcome, "REUSED-EXISTING-STATE");
  assert.equal(second.classification, "JOIN-IN-PROGRESS");
  assert.equal(second.status, "IN_PROGRESS");
});

test("blocked, review, unsupported and reusable durable states remain explicit", () => {
  const store = boundary.createAtomicLocalTrustedStore();
  const service = boundary.createTrustedResearchOnDemandBoundary({ store, factoryHandoff: () => ({ eligible: true }) });
  for (const status of ["BLOCKED", "AWAITING_HUMAN_REVIEW", "UNSUPPORTED"]) {
    const demand = factory.validateReusableDemand({ ...request(), canonicalFieldId: `${request().canonicalFieldId}.${status.toLowerCase()}` });
    store.claim({ demand, status });
    assert.equal(service.request({ ...request(), canonicalFieldId: demand.canonicalFieldId }).status, status);
  }
  const reusableDemand = factory.validateReusableDemand({ ...request(), canonicalFieldId: "reusable.field" });
  store.claim({ demand: reusableDemand, status: "MISSING" });
  store.putKnowledge({ demand: reusableDemand, status: "REUSABLE", value: "SAFE", rawValue: "raw-safe", provenance: { sourceId: "fixture", sourceType: "synthetic-local-fixture", locator: "fixture://wave5" }, lineage: { boundary: "accepted-pre-evidence" } });
  store.setStatus({ demandId: reusableDemand.id, status: "REUSABLE" });
  assert.equal(service.request({ ...request(), canonicalFieldId: reusableDemand.canonicalFieldId }).classification, "REUSED");
});

test("trusted Factory result persists provenance, lineage, raw and reusable values", () => {
  const { service } = serviceWith(() => ({ factory: "existing", work: "synthetic-local" }));
  const first = service.request(request());
  const persisted = service.persistFactoryResult({ demand: request(), result: { demandId: first.demand.id, status: "REUSABLE", value: "SAFE", rawValue: "raw-safe", provenance: { sourceId: "factory.synthetic", sourceType: "synthetic-local-fixture", locator: "fixture://wave5/factory" }, lineage: { batchId: "batch.synthetic", sourceWorkItemId: "source-work.synthetic", boundary: "accepted-pre-evidence" } } });
  assert.equal(persisted.outcome, "CREATED");
  const reused = service.request(request());
  assert.equal(reused.classification, "REUSED");
  assert.equal(reused.record.value, "SAFE");
  assert.equal(reused.record.rawValue, "raw-safe");
  assert.equal(reused.record.provenance.sourceType, "synthetic-local-fixture");
  assert.equal(reused.record.lineage.boundary, "accepted-pre-evidence");
});

test("conflicting knowledge remains append-safe and does not overwrite prior content", () => {
  const { service, store } = serviceWith();
  const first = service.request(request());
  const value = { demand: request(), status: "REUSABLE", value: "SAFE-A", rawValue: "raw-a", provenance: { sourceId: "source-a", sourceType: "synthetic-local-fixture", locator: "fixture://a" }, lineage: { boundary: "accepted-pre-evidence" } };
  assert.equal(service.persistFactoryResult({ demand: request(), result: { ...value, demandId: first.demand.id } }).outcome, "CREATED");
  const conflict = store.putKnowledge({ demand: request(), status: "REUSABLE", value: "CONFLICT-B", rawValue: "raw-b", provenance: { sourceId: "source-b", sourceType: "synthetic-local-fixture", locator: "fixture://b" }, lineage: { boundary: "accepted-pre-evidence" } });
  assert.equal(conflict.outcome, "CONFLICT");
  assert.equal(store.snapshot().knowledge[0].value, "SAFE-A");
});

test("Wave 5 SQL contract keeps tables fail-closed and uniqueness storage-enforced", () => {
  assert.match(migration, /on conflict \(demand_id\) do nothing/i);
  assert.match(migration, /create or replace function public\.claim_research_demand/i);
  assert.match(migration, /create or replace function public\.put_research_reusable_knowledge/i);
  assert.match(migration, /pg_advisory_xact_lock\(hashtext\(p_record->>'knowledgeKey'\)\)/i);
  assert.match(migration, /case when same_key_exists then 'CONFLICT' else 'CREATED' end/i);
  assert.match(migration, /revoke all on function public\.claim_research_demand\(jsonb\) from public, anon, authenticated/i);
  assert.match(migration, /grant execute on function public\.claim_research_demand\(jsonb\) to service_role/i);
  assert.match(migration, /grant execute on function public\.put_research_reusable_knowledge\(jsonb\) to service_role/i);
  assert.doesNotMatch(migration, /service[_-]?role\s*[:=]\s*['"]/i);
  assert.doesNotMatch(migration, /api[_-]?ninjas|https?:\/\//i);
});
