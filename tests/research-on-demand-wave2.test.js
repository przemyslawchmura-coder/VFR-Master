"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const persistence = require("../research/factory/reusable-knowledge-persistence.js");
const factory = require("../research/factory/index.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");

const migration = fs.readFileSync(path.join(__dirname, "../supabase/migrations/20260920102352_research_on_demand_wave2_durable_reuse.sql"), "utf8");

test("Wave 2 reuses the Wave 1 identity and excludes request or batch identity", () => {
  const first = persistence.normalizeDurableDemand({ demand: fixture.safeDemand, status: "MISSING", lifecycle: { userId: "user-a", batchId: "batch-a", targetWorkId: "target-a" } });
  const second = persistence.normalizeDurableDemand({ demand: { ...fixture.safeDemand, userId: "user-b", garageRowId: "garage-b", batchId: "batch-b", requiredApplicabilityDimensions: [...fixture.safeDemand.requiredApplicabilityDimensions].reverse() }, status: "MISSING", lifecycle: { userId: "user-b", batchId: "batch-b", targetWorkId: "target-b" } });
  assert.equal(first.demandId, fixture.safeDemand.id);
  assert.equal(first.knowledgeKey, fixture.safeDemand.knowledgeKey);
  assert.equal(first.demandId, second.demandId);
  assert.notDeepEqual(first.lifecycle, second.lifecycle);
});

test("migration enforces durable uniqueness and append-safe knowledge invariants", () => {
  assert.match(migration, /constraint research_demands_pkey primary key \(demand_id\)/i);
  assert.match(migration, /constraint research_demands_demand_id_unique unique \(demand_id\)/i);
  assert.match(migration, /constraint research_reusable_knowledge_content_unique unique \(knowledge_key, content_digest\)/i);
  assert.match(migration, /foreign key \(demand_id\) references public\.research_demands \(demand_id\)/i);
  assert.match(migration, /on conflict \(demand_id\)\s+do nothing\s+returning demand_id/i);
  assert.match(migration, /alter table public\.research_demands enable row level security/i);
  assert.match(migration, /alter table public\.research_reusable_knowledge enable row level security/i);
  assert.match(migration, /revoke all on table public\.research_demands from anon, authenticated/i);
  assert.match(migration, /revoke all on table public\.research_reusable_knowledge from anon, authenticated/i);
  assert.doesNotMatch(migration, /service_role|secret|api[_-]?key/i);
  assert.doesNotMatch(migration, /drop table|delete from|truncate/i);
});

test("equivalent claims create one durable demand and different contexts remain independent", () => {
  const repository = persistence.createLocalDurableRepository();
  const first = repository.claim({ demand: fixture.safeDemand, status: "MISSING", lifecycle: { requester: "A" } });
  const second = repository.claim({ demand: { ...fixture.safeDemand, userId: "B", batchId: "B" }, status: "MISSING", lifecycle: { requester: "B" } });
  const different = repository.claim({ demand: fixture.demand("fixture.cooling.synthetic-missing"), status: "MISSING" });
  assert.equal(first.outcome, "CREATED");
  assert.equal(second.outcome, "REUSED");
  assert.equal(first.record.demandId, second.record.demandId);
  assert.equal(different.outcome, "CREATED");
  assert.equal(repository.snapshot().demands.length, 2);
});

test("unknown applicability fails closed before claiming a broader demand", () => {
  const repository = persistence.createLocalDurableRepository();
  const unknown = factory.validateReusableDemand({ ...fixture.safeDemand, applicability: { ...fixture.applicability, markets: { state: "UNKNOWN", values: [] } } });
  const lookup = factory.lookupReusableKnowledge({ demand: unknown, repository: fixture.records });
  assert.equal(lookup.classification, "CONTEXT-UNKNOWN");
  const claim = repository.claim({ demand: unknown, status: "MISSING" });
  assert.equal(claim.outcome, "CONTEXT-UNKNOWN");
  assert.equal(claim.record, null);
  assert.equal(repository.snapshot().demands.length, 0);
});

test("durable statuses represent lifecycle states without a second identity", () => {
  const repository = persistence.createLocalDurableRepository();
  for (const [demand, status] of [[fixture.inProgressDemand, "IN_PROGRESS"], [fixture.reviewDemand, "AWAITING_HUMAN_REVIEW"], [fixture.safeDemand, "REUSABLE"], [fixture.blockedDemand, "BLOCKED"]]) {
    assert.equal(repository.claim({ demand, status }).record.status, status);
  }
  assert.deepEqual(repository.snapshot().demands.map(item => item.status).sort(), ["AWAITING_HUMAN_REVIEW", "BLOCKED", "IN_PROGRESS", "REUSABLE"]);
});

test("reusable knowledge preserves provenance, applicability, conditions and lineage", () => {
  const repository = persistence.createLocalDurableRepository();
  repository.claim({ demand: fixture.safeDemand, status: "MISSING" });
  const result = repository.putKnowledge({ demand: fixture.safeDemand, status: "REUSABLE", value: "SYNTHETIC-SAFE-VALUE-A", rawValue: "raw-fixture-safe-a", provenance: { sourceId: "fixture.source.safe", sourceType: "synthetic-local-fixture", locator: "fixture://wave2/safe" }, lineage: { reviewId: "review-fixture-safe", evidenceId: "evidence-fixture-safe" } });
  assert.equal(result.outcome, "CREATED");
  assert.deepEqual(result.record.applicability, fixture.safeDemand.applicability);
  assert.deepEqual(result.record.conditions, fixture.safeDemand.conditions);
  assert.equal(result.record.provenance.sourceId, "fixture.source.safe");
  assert.equal(result.record.lineage.reviewId, "review-fixture-safe");
  assert.equal(persistence.lookupDurableKnowledge(repository, fixture.safeDemand).classification, "REUSED");
});

test("conflicting knowledge is appended explicitly and cannot overwrite safe knowledge", () => {
  const repository = persistence.createLocalDurableRepository();
  repository.claim({ demand: fixture.safeDemand, status: "MISSING" });
  const base = { demand: fixture.safeDemand, status: "REUSABLE", rawValue: "raw-a", provenance: { sourceId: "source-a", sourceType: "synthetic-local-fixture", locator: "fixture://a" } };
  assert.equal(repository.putKnowledge({ ...base, value: "SAFE-A" }).outcome, "CREATED");
  assert.equal(repository.putKnowledge({ ...base, value: "CONFLICT-B", provenance: { ...base.provenance, sourceId: "source-b", locator: "fixture://b" } }).outcome, "CONFLICT");
  const read = repository.readKnowledge(fixture.safeDemand);
  assert.equal(read.classification, "CONFLICT");
  assert.equal(read.records.length, 2);
  assert.equal(repository.snapshot().knowledge.find(record => record.value === "SAFE-A").value, "SAFE-A");
});

test("safe fields remain usable when another field is blocked and persistence failure fails closed", () => {
  const repository = persistence.createLocalDurableRepository();
  repository.claim({ demand: fixture.safeDemand, status: "MISSING" });
  repository.claim({ demand: fixture.blockedDemand, status: "BLOCKED" });
  repository.putKnowledge({ demand: fixture.safeDemand, status: "REUSABLE", value: "SAFE-A", provenance: { sourceId: "source-a", sourceType: "synthetic-local-fixture", locator: "fixture://a" } });
  assert.equal(persistence.lookupDurableKnowledge(repository, fixture.safeDemand).classification, "REUSED");
  const unavailable = persistence.createLocalDurableRepository({ available: false });
  assert.equal(unavailable.claim({ demand: fixture.safeDemand }).outcome, "PERSISTENCE-UNAVAILABLE");
  assert.equal(persistence.lookupDurableKnowledge(unavailable, fixture.safeDemand).classification, "PERSISTENCE-UNAVAILABLE");
});

test("Wave 2 remains local, non-production and acquisition-free", () => {
  const source = fs.readFileSync(path.join(__dirname, "../research/factory/reusable-knowledge-persistence.js"), "utf8");
  assert.doesNotMatch(source, /supabase|registerProfile|TechnicalProfileRegistry|TechnicalDatabase|MotorcycleDatabase/i);
  assert.equal(persistence.createLocalDurableRepository().snapshot().knowledge.length, 0);
});
