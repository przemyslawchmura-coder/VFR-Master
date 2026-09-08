"use strict";

const assert = require("node:assert/strict");
const http = require("node:http");
const test = require("node:test");
const crypto = require("node:crypto");
const factory = require("../research/factory/index.js");

const baseRequest = (url, overrides = {}) => ({ schemaVersion: 1, batchId: "batch.http-test", targetWorkId: "target-work.http-test", sourceWorkItemId: "source-work.http-test", attemptId: "attempt.http-test", prospectId: "prospect.http-test", operation: "attempt-existing-source", adapterId: "http.public-bounded", url, ...overrides });
function server(handler) {
  const instance = http.createServer(handler);
  return new Promise((resolve, reject) => instance.listen(0, "127.0.0.1", () => resolve({ instance, url: path => `http://127.0.0.1:${instance.address().port}${path}` }))); 
}
const close = instance => new Promise(resolve => { if (typeof instance.closeAllConnections === "function") instance.closeAllConnections(); instance.close(resolve); });

test("bounded HTTP adapter acquires exact HTML and preserves deterministic artifact identity", async () => {
  const body = "<html><body>synthetic</body></html>";
  const fixture = await server((req, res) => { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(body); });
  try {
    const adapter = factory.acquisitionAdapters.createHttpAdapter({ allowLocalhostForTests: true });
    const first = await adapter.execute(baseRequest(fixture.url("/page")));
    const second = await adapter.execute(baseRequest(fixture.url("/page")));
    assert.equal(first.outcome, "ACQUIRED"); assert.equal(first.artifact.mediaType, "text/html"); assert.equal(first.artifact.byteLength, Buffer.byteLength(body));
    assert.equal(first.artifact.contentDigest, crypto.createHash("sha256").update(body).digest("hex"));
    assert.equal(Buffer.from(first.artifact.metadata.contentBase64, "base64").toString(), body);
    assert.equal(first.artifact.id, second.artifact.id); assert.equal(first.artifact.metadata.requestedUrl, fixture.url("/page")); assert.equal(first.artifact.metadata.finalUrl, fixture.url("/page"));
    assert.equal(first.artifact.metadata.httpStatus, 200); assert.equal(first.artifact.metadata.redirectCount, 0); assert.equal(first.artifact.metadata.adapterId, "http.public-bounded");
  } finally { await close(fixture.instance); }
});

test("media, size, redirects and HTTP failures fail closed", async () => {
  const fixture = await server((req, res) => {
    if (req.url === "/redirect") return res.writeHead(302, { location: "/page" }).end();
    if (req.url === "/loop") return res.writeHead(302, { location: "/loop" }).end();
    if (req.url === "/json") { res.writeHead(200, { "content-type": "application/json" }); return res.end("{}"); }
    if (req.url === "/large") { res.writeHead(200, { "content-type": "text/html", "content-length": "20" }); return res.end("01234567890123456789"); }
    if (req.url === "/slow") return setTimeout(() => { res.writeHead(200, { "content-type": "text/html" }); res.end("late"); }, 100);
    if (req.url === "/missing") return res.writeHead(404).end();
    if (req.url === "/temporary") return res.writeHead(503).end();
    res.writeHead(200, { "content-type": "text/html" }); res.end("ok");
  });
  try {
    const adapter = factory.acquisitionAdapters.createHttpAdapter({ allowLocalhostForTests: true });
    assert.equal((await adapter.execute(baseRequest(fixture.url("/json"), { allowedMediaTypes: ["text/html"] }))).outcome, "PERMANENT-FAILURE");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/large"), { maxResponseBytes: 10 }))).reasonCode, "RESPONSE_TOO_LARGE");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/redirect"), { maxRedirects: 1 }))).outcome, "ACQUIRED");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/loop"), { maxRedirects: 1 }))).reasonCode, "REDIRECT_LIMIT_EXCEEDED");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/missing")))).outcome, "NOT-FOUND");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/temporary")))).outcome, "TRANSIENT-FAILURE");
    assert.equal((await adapter.execute(baseRequest(fixture.url("/slow"), { timeoutMs: 10 }))).reasonCode, "REQUEST_TIMEOUT");
  } finally { await close(fixture.instance); }
});

test("URL, timeout and chain-of-custody boundaries reject unsafe inputs", async () => {
  const adapter = factory.acquisitionAdapters.createHttpAdapter();
  assert.equal((await adapter.execute(baseRequest("file:///tmp/secret"))).outcome, "PERMANENT-FAILURE");
  assert.equal((await adapter.execute(baseRequest("ftp://example.test/page"))).outcome, "PERMANENT-FAILURE");
  assert.equal((await adapter.execute(baseRequest("http://127.0.0.1:9/"))).outcome, "PERMANENT-FAILURE");
  assert.throws(() => factory.acquisitionAdapters.createHttpAdapter({ adapterId: "" }), /adapterId/);
});

test("changed response bytes change the content digest and artifact identity", async () => {
  let version = 0;
  const fixture = await server((req, res) => { version += 1; const body = `version-${version}`; res.writeHead(200, { "content-type": "text/plain" }); res.end(body); });
  try {
    const adapter = factory.acquisitionAdapters.createHttpAdapter({ allowLocalhostForTests: true });
    const first = await adapter.execute(baseRequest(fixture.url("/changing")));
    const second = await adapter.execute(baseRequest(fixture.url("/changing")));
    assert.notEqual(first.artifact.contentDigest, second.artifact.contentDigest);
    assert.notEqual(first.artifact.id, second.artifact.id);
  } finally { await close(fixture.instance); }
});

test("HTTP acquisition does not infer authority or create downstream research state", async () => {
  const fixture = await server((req, res) => { res.writeHead(200, { "content-type": "text/plain" }); res.end("synthetic"); });
  try {
    const result = await factory.acquisitionAdapters.createHttpAdapter({ allowLocalhostForTests: true }).execute(baseRequest(fixture.url("/text")));
    assert.equal(result.artifact.originClassification, "REMOTE_HTTP_SOURCE");
    assert.equal(result.artifact.metadata.sourceMetadata.authority, undefined);
    assert.equal(result.artifact.metadata.adapterVersion, "1");
    assert.equal(result.reviewDecisionsCreated, undefined); assert.equal(result.evidenceRowsCreated, undefined); assert.equal(result.productionChanged, undefined);
  } finally { await close(fixture.instance); }
});
