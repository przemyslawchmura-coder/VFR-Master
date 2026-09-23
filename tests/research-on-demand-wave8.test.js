"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const execution = require("../server/research-on-demand-execution.js");
const fixture = require("../research/data/research-on-demand-wave1-fixture.js");

const sharedPath = path.join(__dirname, "../supabase/functions/_shared/research-on-demand-worker.mjs");
const edgePath = path.join(__dirname, "../supabase/functions/research-on-demand-worker/index.ts");
const sharedSource = fs.readFileSync(sharedPath, "utf8");
const edgeSource = fs.readFileSync(edgePath, "utf8");
const demand = fixture.demand("lubrication.viscosity");
const demandInput = { ...demand };
delete demandInput.id;
delete demandInput.knowledgeKey;

async function loadWorker() { return import(sharedPath); }

function rpcHarness({ maxAttempts = 3 } = {}) {
  let time = Date.parse("2098-01-01T00:00:00.000Z");
  const store = execution.createLocalExecutionStore({ clock: () => time });
  const demands = new Map();
  const calls = [];
  const rpc = async (name, args) => {
    calls.push(name);
    if (name === "claim_research_demand") {
      const input = args.p_demand;
      const existing = demands.get(input.demandId);
      if (existing) return { data: { outcome: "REUSED", record: existing } };
      const record = { demandId: input.demandId, status: "IN_PROGRESS", lifecycle: input.lifecycle };
      demands.set(input.demandId, record);
      return { data: { outcome: "CREATED", record } };
    }
    if (name === "create_research_execution") return { data: store.create({ demand: { ...demand, id: args.p_execution.demandId, knowledgeKey: `reusable-knowledge.${args.p_execution.demandId.slice(-24)}` }, maxAttempts }) };
    if (name === "claim_research_execution") return { data: store.claim({ executionId: args.p_execution_id, workerId: args.p_worker_id, leaseSeconds: args.p_lease_seconds }) };
    if (name === "checkpoint_research_execution") return { data: store.checkpoint({ executionId: args.p_execution_id, workerId: args.p_worker_id, value: args.p_checkpoint }) };
    if (name === "finish_research_execution") return { data: store.finish({ executionId: args.p_execution_id, workerId: args.p_worker_id, outcome: args.p_outcome, failure: args.p_failure, checkpoint: args.p_checkpoint }) };
    throw new Error(`unexpected RPC ${name}`);
  };
  return { rpc, store, calls, advance: milliseconds => { time += milliseconds; } };
}

test("trusted Edge worker reaches the Factory adapter and persists terminal success", async () => {
  const { createBoundedWorker } = await loadWorker();
  const harness = rpcHarness();
  let adapterCalls = 0;
  const worker = createBoundedWorker({ rpc: harness.rpc, workerId: "edge-test", factoryAdapter: async ({ checkpoint }) => { adapterCalls += 1; return { outcome: "SUCCESS", checkpoint: { ...checkpoint, phase: "FACTORY-COMPLETED" } }; } });
  const result = await worker.run({ demand: demandInput });
  assert.equal(result.outcome, "COMPLETED");
  assert.equal(adapterCalls, 1);
  assert.deepEqual(harness.calls, ["claim_research_demand", "create_research_execution", "claim_research_execution", "checkpoint_research_execution", "finish_research_execution"]);
  assert.equal(result.record.checkpoint.phase, "FACTORY-COMPLETED");
});

test("trusted configuration fails closed and secrets stay outside the Edge response path", async () => {
  const { trustedConfiguration } = await loadWorker();
  assert.throws(() => trustedConfiguration({ SUPABASE_URL: "https://non-production.invalid", RESEARCH_WORKER_ENVIRONMENT: "non-production" }), /configuration is incomplete/);
  assert.doesNotMatch(edgeSource, /json\(\{[^}]*?(?:SECRET_KEYS|SERVICE_ROLE_KEY|workerToken)/s);
  assert.match(sharedSource, /SUPABASE_SECRET_KEYS/);
  assert.match(sharedSource, /RESEARCH_WORKER_TOKEN/);
  assert.doesNotMatch(edgeSource, /js\/|index\.html|window\.|document\./);
});

test("concurrent invocations preserve one active claim", async () => {
  const { createBoundedWorker } = await loadWorker();
  const harness = rpcHarness();
  let adapterCalls = 0;
  const adapter = async () => { adapterCalls += 1; await new Promise(resolve => setTimeout(resolve, 5)); return { outcome: "SUCCESS", checkpoint: { phase: "FACTORY-COMPLETED" } }; };
  const first = createBoundedWorker({ rpc: harness.rpc, workerId: "edge-a", factoryAdapter: adapter });
  const second = createBoundedWorker({ rpc: harness.rpc, workerId: "edge-b", factoryAdapter: adapter });
  const results = await Promise.all([first.run({ demand: demandInput }), second.run({ demand: demandInput })]);
  assert.deepEqual(results.map(result => result.outcome).sort(), ["BUSY", "COMPLETED"]);
  assert.equal(adapterCalls, 1);
});

test("retryable Factory failure remains bounded by max attempts", async () => {
  const { createBoundedWorker } = await loadWorker();
  const harness = rpcHarness({ maxAttempts: 3 });
  let adapterCalls = 0;
  const worker = createBoundedWorker({ rpc: harness.rpc, workerId: "edge-retry", factoryAdapter: async () => { adapterCalls += 1; return { outcome: "RETRYABLE", failure: { reason: "synthetic transient" }, checkpoint: { phase: "FACTORY-RETRYABLE" } }; } });
  const results = [];
  for (let attempt = 0; attempt < 4; attempt += 1) results.push((await worker.run({ demand: demandInput })).outcome);
  assert.deepEqual(results, ["RETRYABLE", "RETRYABLE", "TERMINAL", "TERMINAL"]);
  assert.equal(adapterCalls, 3);
});

test("Edge worker is one bounded invocation with no scheduler, polling or production promotion", () => {
  assert.doesNotMatch(edgeSource, /setInterval|setTimeout|while\s*\(|for\s*\(\s*;;/);
  assert.doesNotMatch(sharedSource, /setInterval|setTimeout|while\s*\(|for\s*\(\s*;;/);
  assert.match(sharedSource, /claim_research_execution/);
  assert.match(sharedSource, /checkpoint_research_execution/);
  assert.match(sharedSource, /finish_research_execution/);
  assert.match(edgeSource, /productionMaterialized: false/);
  assert.match(edgeSource, /externalAcquisition: false/);
});
