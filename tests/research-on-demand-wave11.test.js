"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const execution = require("../server/research-on-demand-execution.js");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const bytes = Buffer.from("%PDF-1.7\ncontrolled acquisition fixture\n");

async function setup(t, { response, store, routes, expectedBytes = bytes } = {}) {
  const acquisition = require("../server/research-on-demand-acquisition.js");
  const real = require("../research/data/research-on-demand-honda-route.js").route;
  const route = { ...real, expectedDigest: hash(expectedBytes) };
  const demand = reusable.validateReusableDemand({ catalogVariantKey: route.target.catalogVariantKey, canonicalFieldId: route.fieldIds[0], operation: route.operation, applicability: route.target.scope, conditions: route.conditions, requiredApplicabilityDimensions: ["model", "generation", "year", "market", "abs", "transmission", "equipment"] });
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "revlog-wave11-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const artifactStore = store || require("../server/research-artifact-store.js").createFileArtifactStore({ directory });
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url, options) => { requests.push({ url, options }); return response ? response(url) : new Response(expectedBytes, { status: 200, headers: { "content-type": "application/pdf" } }); });
  const executor = acquisition.createSourceAcquisitionExecutor({ routes: routes || [route], artifactStore });
  let knowledgeWrites = 0;
  const service = execution.createTrustedAsyncExecutionService({ store: execution.createLocalExecutionStore(), factoryExecutor: executor, reusableWriter: () => { knowledgeWrites += 1; } });
  const run = async (input = demand) => { const ensured = service.ensure({ demand: input }); return service.runOnce({ demand: input, executionId: ensured.identity.executionId, workerId: "wave11-test" }); };
  return { route, real, demand, directory, artifactStore, requests, executor, service, run, knowledgeWrites: () => knowledgeWrites };
}

test("Wave 11 acquires through actual Factory orchestration and stops before extraction/reuse", async t => {
  const x = await setup(t);
  const result = await x.run();
  assert.equal(result.record.status, "BLOCKED");
  assert.equal(result.record.lastFailure.reason, "EXTRACTION-REQUIRED");
  const cp = result.record.checkpoint;
  assert.equal(cp.phase, "SOURCE-ACQUIRED");
  assert.equal(cp.demandId, x.demand.id);
  assert.equal(cp.sourceId, x.route.sourceId);
  assert.equal(cp.artifact.contentDigest, hash(bytes));
  assert.match(cp.factoryBatchId, /^batch\./);
  assert.match(cp.sourceWorkItemId, /^source-work\./);
  assert.equal(cp.acquisitionResultId, cp.artifact.attemptId);
  assert.equal(cp.artifact.prospectId, x.route.prospect.id);
  assert.equal(cp.productionMaterialized, false);
  assert.equal(cp.reusableKnowledgeCreated, false);
  assert.ok(!JSON.stringify(cp).includes("contentBase64"));
  assert.deepEqual(await x.artifactStore.read(hash(bytes)), bytes);
  assert.equal(x.knowledgeWrites(), 0);
  const duplicate = await x.run();
  assert.equal(duplicate.record.status, "BLOCKED");
  assert.equal(x.requests.length, 1);
});

for (const dimension of ["model", "generation", "markets", "transmissions", "abs", "equipment"]) {
  test(`unknown or incompatible ${dimension} blocks before network`, async t => {
    const x = await setup(t);
    for (const scope of [{ state: "UNKNOWN", values: [] }, { state: "KNOWN", values: [dimension === "abs" ? false : dimension === "transmissions" ? "automatic" : "wrong"] }]) {
      const demand = reusable.validateReusableDemand({ ...x.demand, applicability: { ...x.demand.applicability, [dimension]: scope } });
      const result = await x.run(demand);
      assert.equal(result.record.status, "BLOCKED");
      assert.notEqual(result.record.checkpoint.phase, "SOURCE-ACQUIRED");
    }
    assert.equal(x.requests.length, 0);
  });
}

test("wrong year, catalogue, modelCode, emissions or operation never acquires", async t => {
  const x = await setup(t);
  const inputs = [
    { applicability: { ...x.demand.applicability, years: { kind: "EXACT", from: 2023, to: 2023 } } },
    { catalogVariantKey: "honda.other" }, { conditions: { requestContext: { modelCode: "OTHER" } } },
    { conditions: { requestContext: { modelCode: "PC70", emissionsVariant: "unproven" } } },
    { operation: "other-operation" }, { conditions: null }
  ];
  for (const extra of inputs) assert.equal((await x.run(reusable.validateReusableDemand({ ...x.demand, ...extra }))).record.status, "BLOCKED");
  assert.equal(x.requests.length, 0);
});

test("unsupported field stays unsupported without acquiring or manufacturing no-evidence", async t => {
  const x = await setup(t);
  const result = await x.run(reusable.validateReusableDemand({ ...x.demand, canonicalFieldId: "tires_wheels.loaded-pressures" }));
  assert.equal(result.record.status, "UNSUPPORTED");
  assert.equal(x.requests.length, 0);
  assert.equal(x.knowledgeWrites(), 0);
});

test("changed document digest is rejected without custody", async t => {
  const x = await setup(t, { response: () => new Response("%PDF-other", { headers: { "content-type": "application/pdf" } }) });
  const result = await x.run();
  assert.equal(result.record.status, "BLOCKED");
  assert.equal(result.record.lastFailure.reason, "SOURCE-IDENTITY-MISMATCH");
  assert.deepEqual(await fs.readdir(x.directory), []);
});

test("redirect is rejected before contacting a different URL", async t => {
  const x = await setup(t, { response: () => new Response(null, { status: 302, headers: { location: "https://unapproved.example/manual.pdf" } }) });
  const result = await x.run();
  assert.equal(result.record.status, "BLOCKED");
  assert.equal(x.requests.length, 1);
  assert.deepEqual(await fs.readdir(x.directory), []);
});

for (const [http, status] of [[403, "BLOCKED"], [401, "BLOCKED"], [404, "TERMINAL"], [429, "RETRYABLE"], [503, "RETRYABLE"]]) {
  test(`HTTP ${http} preserves existing bounded ${status} classification`, async t => {
    const x = await setup(t, { response: () => new Response(null, { status: http }) });
    const result = await x.run();
    assert.equal(result.record.status, status);
    assert.notEqual(result.record.checkpoint.phase, "SOURCE-ACQUIRED");
    assert.deepEqual(await fs.readdir(x.directory), []);
    assert.equal(x.knowledgeWrites(), 0);
  });
}

test("custody failure cannot report an acquired checkpoint", async t => {
  const x = await setup(t, { store: { put: async () => { throw new Error("disk unavailable"); } } });
  const result = await x.run();
  assert.equal(result.record.status, "RETRYABLE");
  assert.notEqual(result.record.checkpoint.phase, "SOURCE-ACQUIRED");
  assert.equal(x.knowledgeWrites(), 0);
});

test("custody verifies duplicate bytes and rejects corrupted stored content", async t => {
  const x = await setup(t);
  const result = await x.run();
  const artifact = result.factory.checkpoint.artifact;
  const full = { ...artifact, metadata: { contentBase64: bytes.toString("base64") } };
  await x.artifactStore.put(full);
  await fs.writeFile(path.join(x.directory, `${hash(bytes)}.bin`), "corrupted");
  await assert.rejects(x.artifactStore.read(hash(bytes)), /digest|corrupt/i);
  await assert.rejects(x.artifactStore.put(full), /digest|corrupt/i);
});

test("real Honda route preserves historical inputs and passes exact Factory readiness", () => {
  const factory = require("../research/factory/index.js");
  const historical = require("../research/data/cbr500r-pc70-owner-manual-execution.js");
  const before = JSON.stringify({ target: historical.target, prospect: historical.prospect });
  const route = require("../research/data/research-on-demand-honda-route.js").route;
  assert.equal(factory.evaluateReadiness(route.target, route.prospect).passed, true);
  assert.equal(route.expectedDigest, require("../research/reports/cbr500r-pc70-owner-manual-execution.json").acquisition.artifactSha256);
  assert.deepEqual(route.fieldIds, ["lubrication.oil-specification"]);
  assert.equal(JSON.stringify({ target: historical.target, prospect: historical.prospect }), before);
  assert.equal(historical.prospect.publication.relationship, "RELATIONSHIP-UNRESOLVED");
  assert.equal(historical.target.scope.abs.state, "UNKNOWN");
});

test("source proof preflight checks the exact route without network", () => {
  const cp = require("node:child_process");
  const result = JSON.parse(cp.execFileSync(process.execPath, ["scripts/research-on-demand-source-acquisition-proof.js"], { cwd: path.join(__dirname, ".."), encoding: "utf8" }));
  assert.equal(result.mode, "PREFLIGHT");
  assert.equal(result.readiness.passed, true);
  assert.equal(result.externalAcquisition, false);
  assert.equal(result.liveSupabaseChanged, false);
});

for (const [error, reason] of [[new DOMException("stream timed out", "TimeoutError"), "REQUEST_TIMEOUT"], [new TypeError("connection interrupted"), "NETWORK_FAILURE"]]) {
  test(`interrupted response body remains retryable as ${reason}`, async t => {
    const x = await setup(t, { response: () => new Response(new ReadableStream({ start(controller) { controller.error(error); } }), { headers: { "content-type": "application/pdf" } }) });
    const result = await x.run();
    assert.equal(result.record.status, "RETRYABLE");
    assert.equal(result.record.lastFailure.reason, reason);
    assert.deepEqual(await fs.readdir(x.directory), []);
  });
}

test("streamed body beyond byte budget remains a permanent size failure", async t => {
  const x = await setup(t, { response: () => new Response(Buffer.alloc(8 * 1024 * 1024 + 1), { headers: { "content-type": "application/pdf" } }) });
  const result = await x.run();
  assert.equal(result.record.status, "TERMINAL");
  assert.equal(result.record.lastFailure.reason, "RESPONSE_TOO_LARGE");
});

test("official-manual-sized PDF bytes validate and reach custody without exhausting the stack", async t => {
  const manualSizedBytes = Buffer.alloc(6911749, 0x41);
  const x = await setup(t, { expectedBytes: manualSizedBytes });
  const result = await x.run();
  assert.equal(result.record.status, "BLOCKED");
  assert.equal(result.record.checkpoint.phase, "SOURCE-ACQUIRED");
  assert.equal(result.record.checkpoint.artifact.byteLength, 6911749);
  assert.deepEqual(await x.artifactStore.read(hash(manualSizedBytes)), manualSizedBytes);
});

test("outer retries produce distinct deterministic Factory attempt identities", async t => {
  let count = 0;
  const x = await setup(t, { response: () => ++count === 1 ? new Response(null, { status: 503 }) : new Response(bytes, { headers: { "content-type": "application/pdf" } }) });
  const first = await x.run();
  const second = await x.run();
  assert.equal(first.record.status, "RETRYABLE");
  assert.equal(second.record.status, "BLOCKED");
  assert.equal(second.record.attemptCount, 2);
  assert.notEqual(first.record.checkpoint.factoryBatchId, second.record.checkpoint.factoryBatchId);
  assert.notEqual(first.record.checkpoint.acquisitionResultId, second.record.checkpoint.acquisitionResultId);
  assert.equal(x.requests.length, 2);
});

test("source acquisition rejects wrong, unclaimed and stale outer execution state before network", async t => {
  const x = await setup(t);
  const ensured = x.service.ensure({ demand: x.demand });
  const unclaimedHandoff = { phase: "FACTORY-HANDOFF", executionId: ensured.identity.executionId, demandId: x.demand.id, attempt: 0, claimedAt: ensured.record.createdAt };
  await assert.rejects(x.executor({ demand: x.demand, execution: ensured.record, checkpoint: unclaimedHandoff }), /binding|claim|running/i);

  const otherDemand = reusable.validateReusableDemand({ ...x.demand, canonicalFieldId: "tires_wheels.loaded-pressures" });
  const other = x.service.ensure({ demand: otherDemand });
  const wrongHandoff = { phase: "FACTORY-HANDOFF", executionId: other.identity.executionId, demandId: otherDemand.id, attempt: 0, claimedAt: other.record.createdAt };
  await assert.rejects(x.executor({ demand: x.demand, execution: other.record, checkpoint: wrongHandoff }), /binding|identity/i);

  const claimed = x.service.claim({ demand: x.demand, executionId: ensured.identity.executionId, workerId: "wave11-binding-test", leaseSeconds: 60 });
  const currentHandoff = { phase: "FACTORY-HANDOFF", executionId: claimed.record.executionId, demandId: claimed.record.demandId, attempt: claimed.record.attemptCount, claimedAt: claimed.record.claimedAt };
  const saved = x.service.checkpoint({ executionId: claimed.record.executionId, workerId: "wave11-binding-test", value: currentHandoff });
  const staleClaimedAt = new Date(Date.parse(currentHandoff.claimedAt) - 1).toISOString();
  await assert.rejects(x.executor({ demand: x.demand, execution: saved.record, checkpoint: { ...currentHandoff, claimedAt: staleClaimedAt } }), /binding|checkpoint/i);
  assert.equal(x.requests.length, 0);
});

test("source acquisition rejects an expired execution lease before network", async t => {
  const x = await setup(t);
  const ensured = x.service.ensure({ demand: x.demand });
  const handoff = { phase: "FACTORY-HANDOFF", executionId: ensured.identity.executionId, demandId: x.demand.id, attempt: 1, claimedAt: "2000-01-01T00:00:00.000Z" };
  const expired = { ...ensured.record, status: "RUNNING", workerId: "expired-worker", claimedAt: handoff.claimedAt, leaseExpiresAt: "2000-01-01T00:01:00.000Z", attemptCount: 1, checkpoint: handoff };
  await assert.rejects(x.executor({ demand: x.demand, execution: expired, checkpoint: handoff }), /claim|lease|expired/i);
  assert.equal(x.requests.length, 0);
});

test("corrupt existing custody blocks the job and suppresses repeat acquisition", async t => {
  const x = await setup(t);
  await fs.writeFile(path.join(x.directory, `${hash(bytes)}.bin`), "corrupted");
  const first = await x.run();
  assert.equal(first.record.status, "BLOCKED");
  assert.equal(first.record.lastFailure.reason, "CUSTODY-INTEGRITY-FAILURE");
  assert.equal(x.requests.length, 1);
  const duplicate = await x.run();
  assert.equal(duplicate.record.status, "BLOCKED");
  assert.equal(x.requests.length, 1);
});

test("custody does not report success when the published directory entry cannot be synced", async t => {
  const x = await setup(t);
  const acquired = await x.run();
  const artifact = { ...acquired.record.checkpoint.artifact, metadata: { contentBase64: bytes.toString("base64") } };
  await fs.unlink(path.join(x.directory, `${hash(bytes)}.bin`));
  const realOpen = fs.open.bind(fs);
  t.mock.method(fs, "open", async (...args) => args[0] === x.directory
    ? { sync: async () => { throw new Error("directory sync unavailable"); }, close: async () => {} }
    : realOpen(...args));
  await assert.rejects(x.artifactStore.put(artifact), /directory sync unavailable/);
});

test("partial custody write is cleaned up and can be retried after disk recovery", async t => {
  const x = await setup(t);
  const acquired = await x.run();
  const artifact = { ...acquired.record.checkpoint.artifact, metadata: { contentBase64: bytes.toString("base64") } };
  await fs.unlink(path.join(x.directory, `${hash(bytes)}.bin`));
  const realOpen = fs.open.bind(fs);
  let interrupted = false;
  t.mock.method(fs, "open", async (...args) => {
    const handle = await realOpen(...args);
    const constants = require("node:fs").constants;
    if ((args[1] & constants.O_WRONLY) && !interrupted) {
      interrupted = true;
      return { writeFile: async value => { await handle.writeFile(value.subarray(0, 5)); throw new Error("disk full"); }, sync: handle.sync.bind(handle), close: handle.close.bind(handle) };
    }
    return handle;
  });
  await assert.rejects(x.artifactStore.put(artifact), /disk full/);
  assert.deepEqual(await fs.readdir(x.directory), []);
  await x.artifactStore.put(artifact);
  assert.deepEqual(await x.artifactStore.read(hash(bytes)), bytes);
});
