"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const factory = require("../research/factory/index.js");

const body = "Public documentation example\napi_key=EXAMPLE_PUBLIC_VALUE\nAuthorization: Bearer EXAMPLE\npassword field\ntoken text";

function artifactFor(metadata = {}) {
  const bytes = Buffer.from(body, "utf8");
  const contentDigest = crypto.createHash("sha256").update(bytes).digest("hex");
  const artifact = {
    prospectId: "prospect.opaque-fixture",
    attemptId: "attempt.opaque-fixture",
    mediaType: "text/html",
    byteLength: bytes.length,
    contentDigest,
    originClassification: "REMOTE_HTTP_SOURCE",
    acquisitionMethod: "http.public-bounded",
    locator: "https://fixture.invalid/public",
    metadata: { contentBase64: bytes.toString("base64"), ...metadata }
  };
  artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest, locator: artifact.locator });
  return artifact;
}

test("opaque public payload bypasses only secret heuristics and remains integrity-bound", () => {
  const artifact = factory.validateArtifact(artifactFor());
  assert.equal(artifact.id, factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator }));
  assert.equal(factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "REMOTE_ARTIFACT_ACQUIRED", observations: [], artifact }).artifact.id, artifact.id);
  assert.deepEqual(artifact, factory.validateArtifact(artifactFor()));
});

test("control metadata and URLs remain secret-scanned", () => {
  for (const metadata of [{ apiKey: "control" }, { authorization: "Bearer control" }, { token: "control" }, { password: "control" }, { nested: { contentBase64: "api_key=control" } }]) {
    assert.throws(() => factory.validateArtifact(artifactFor(metadata)), /secret-shaped/);
  }
  const withSecretUrl = artifactFor();
  withSecretUrl.locator = "https://fixture.invalid/public?token=control";
  assert.throws(() => factory.validateArtifact(withSecretUrl), /secret-shaped|unstable/);
});

test("opaque payload structure and custody remain fail-closed", () => {
  const invalidBase64 = artifactFor({ contentBase64: "not-base64" });
  assert.throws(() => factory.validateArtifact(invalidBase64), /contentBase64 is (?:missing or )?invalid/);
  const tampered = artifactFor();
  tampered.metadata.contentBase64 = Buffer.from("changed", "utf8").toString("base64");
  assert.throws(() => factory.validateArtifact(tampered), /does not match artifact identity/);
  const changedDigest = artifactFor();
  changedDigest.contentDigest = "0".repeat(64);
  assert.throws(() => factory.validateArtifact(changedDigest), /unstable|does not match/);
  const sibling = artifactFor({ payload: { contentBase64: "api_key=control" } });
  assert.throws(() => factory.validateArtifact(sibling), /secret-shaped/);
});

test("valid opaque HTML remains usable by the parent-bound HTML derivative", () => {
  const artifact = factory.validateArtifact(artifactFor());
  const neutralBytes = Buffer.from("<main><h1>Public documentation</h1><p>Example text</p></main>", "utf8");
  const neutralDigest = crypto.createHash("sha256").update(neutralBytes).digest("hex");
  const neutral = artifactFor();
  neutral.byteLength = neutralBytes.length;
  neutral.contentDigest = neutralDigest;
  neutral.metadata.contentBase64 = neutralBytes.toString("base64");
  neutral.id = factory.artifactId({ prospectId: neutral.prospectId, attemptId: neutral.attemptId, mediaType: neutral.mediaType, contentDigest: neutral.contentDigest, locator: neutral.locator });
  const validNeutral = factory.validateArtifact(neutral);
  const derived = factory.createHtmlDerivedContent({ parentArtifact: validNeutral });
  assert.equal(derived.parentArtifactId, validNeutral.id);
  assert.match(derived.content, /Public documentation/);
  assert.equal(derived.content, "Public documentation\nExample text");
});
