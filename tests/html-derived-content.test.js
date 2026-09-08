"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const test = require("node:test");
const factory = require("../research/factory/index.js");

const parentFor = (content, mediaType = "text/html") => {
  const bytes = Buffer.from(content, "utf8");
  const contentDigest = crypto.createHash("sha256").update(bytes).digest("hex");
  const artifact = { prospectId: "prospect.html-fixture", attemptId: "attempt.html-fixture", mediaType, byteLength: bytes.length, contentDigest, originClassification: "REMOTE_HTTP_SOURCE", acquisitionMethod: "http.public-bounded", locator: "https://fixture.invalid/page", metadata: { contentBase64: bytes.toString("base64"), requestedUrl: "https://fixture.invalid/page", finalUrl: "https://fixture.invalid/page" } };
  artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType, contentDigest, locator: artifact.locator });
  return factory.validateArtifact(artifact);
};

const html = "<!doctype html><!-- ignored --><html><head><style>hidden style</style><script>hidden script</script></head><body>\n<h1>Title &amp; one</h1><p>First <strong>paragraph</strong>.</p><div>Second&nbsp;line<br>next</div><table><tr><th>Head</th><td>Cell</td></tr></table><a href=\"https://example.invalid\">Link text</a></body></html>";

test("HTML and XHTML parent artifacts produce bounded normalized text", () => {
  const first = factory.createHtmlDerivedContent({ parentArtifact: parentFor(html) });
  const xhtml = factory.createHtmlDerivedContent({ parentArtifact: parentFor(html, "application/xhtml+xml") });
  assert.equal(first.parentArtifactId, first.metadata.parentArtifactId);
  assert.equal(first.parentContentDigest, first.metadata.parentContentDigest);
  assert.equal(first.region.documentLocator, "document:full");
  assert.equal(first.mediaType, "text/plain");
  assert.equal(first.content, "Title & one\nFirst paragraph.\nSecond line\nnext\nHead\nCell\nLink text");
  assert.equal(xhtml.content, first.content);
  assert.ok(Object.isFrozen(first));
});

test("HTML derivation re-verifies custody, rejects invalid parents and remains deterministic", () => {
  const parent = parentFor("<p>stable</p>");
  const first = factory.createHtmlDerivedContent({ parentArtifact: parent });
  const second = factory.createHtmlDerivedContent({ parentArtifact: parent });
  assert.deepEqual(first, second);
  const changed = factory.createHtmlDerivedContent({ parentArtifact: parentFor("<p>changed</p>") });
  assert.notEqual(first.contentDigest, changed.contentDigest);
  assert.notEqual(first.id, changed.id);
  const versioned = factory.createHtmlDerivedContent({ parentArtifact: parent, transformerVersion: "2" });
  assert.notEqual(first.id, versioned.id);
  const badDigest = { ...parent, contentDigest: "0".repeat(64) };
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: badDigest }), /artifact identity|unstable/);
  const badBase64 = { ...parent, metadata: { ...parent.metadata, contentBase64: "not-base64" } };
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: badBase64 }), /missing or invalid/);
  const missing = { ...parent, metadata: {} };
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: missing }), /missing or invalid/);
});

test("HTML derivation enforces input/output boundaries without network or field parsing", () => {
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: parentFor("<p>pdf</p>", "application/pdf") }), /unsupported/);
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: parentFor("<script>only code</script>") }), /empty/);
  assert.throws(() => factory.createHtmlDerivedContent({ parentArtifact: parentFor("<p>too large</p>"), maxDerivedBytes: 1 }), /exceeds/);
  const source = fs.readFileSync(require.resolve("../research/factory/html-derived-content.js"), "utf8");
  assert.doesNotMatch(source, /fetch|https?:\/\//i);
  assert.doesNotMatch(source, /css|xpath|oil|tire|chain|honda|yamaha/i);
});

test("derived source text is opaque while derived custody metadata remains protected", () => {
  const source = "<main><p>Documentation example</p><p>api_key=EXAMPLE_PUBLIC_VALUE</p><p>Authorization: Bearer EXAMPLE</p><p>password field</p><p>token text</p></main>";
  const derived = factory.createHtmlDerivedContent({ parentArtifact: parentFor(source) });
  assert.match(derived.content, /api_key=EXAMPLE_PUBLIC_VALUE/);
  assert.match(derived.content, /Authorization: Bearer EXAMPLE/);
  assert.doesNotThrow(() => factory.validateDerivedContent(derived));
  assert.doesNotThrow(() => factory.toExtractionEnvelope(derived));
  const metadataSecret = { ...derived, metadata: { ...derived.metadata, transformerId: "secret-transformer" } };
  assert.throws(() => factory.validateDerivedContent(metadataSecret), /secret-shaped/);
});
