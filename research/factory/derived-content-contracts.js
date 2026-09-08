// NON-PRODUCTION parent-bound derived-content bridge for local extraction.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const execution = require("./execution-contracts.js");
const extraction = require("./extraction-contracts.js");

const SCHEMA_VERSION = 1;
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digestBytes = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const decode = (content, encoding) => encoding === "utf8" ? Buffer.from(content, "utf8") : Buffer.from(content, "base64");
const derivedLocator = ({ parentArtifactId, transformerId, transformerVersion, regionId }) => `derived://${parentArtifactId}/${transformerId}/${transformerVersion}/${regionId}`;

function validateParentBytes(parentArtifact, bytes) {
  const parent = execution.validateArtifact(parentArtifact);
  assert(Buffer.isBuffer(bytes) || bytes instanceof Uint8Array, "parent artifact bytes are required");
  const actualDigest = digestBytes(bytes);
  assert(parent.contentDigest && actualDigest === parent.contentDigest, "parent artifact content digest mismatch");
  assert(parent.byteLength !== null && bytes.byteLength === parent.byteLength, "parent artifact byte length mismatch");
  return true;
}

function derivedId(input) {
  return execution.artifactId({ prospectId: input.prospectId, attemptId: input.attemptId, mediaType: input.mediaType, contentDigest: input.contentDigest, locator: input.locator });
}

function validateRegion(region) {
  assert(region && typeof region.id === "string" && region.id.length > 0, "derived content region id is required");
  assert(Array.isArray(region.pdfPages) && region.pdfPages.length > 0 && region.pdfPages.every(page => Number.isInteger(page) && page > 0), "derived content region pages are invalid");
  return json.immutableClone(region);
}

function createDerivedContent({ parentArtifact, parentBytes, transformerId, transformerVersion, region, approvedRegionIds, content, contentEncoding = "utf8", mediaType = "text/plain" }) {
  const parent = execution.validateArtifact(parentArtifact);
  validateParentBytes(parent, parentBytes);
  assert(typeof transformerId === "string" && transformerId.length > 0 && typeof transformerVersion === "string" && transformerVersion.length > 0, "transformer identity is required");
  const validatedRegion = validateRegion(region);
  assert(Array.isArray(approvedRegionIds) && approvedRegionIds.includes(validatedRegion.id), "derived content region is not approved");
  assert((contentEncoding === "utf8" && typeof content === "string") || (contentEncoding === "base64" && typeof content === "string" && /^[A-Za-z0-9+/]*={0,2}$/.test(content)), "derived content encoding is invalid");
  const bytes = decode(content, contentEncoding);
  assert(bytes.length > 0, "derived content must not be empty");
  const contentDigest = digestBytes(bytes);
  const locator = derivedLocator({ parentArtifactId: parent.id, transformerId, transformerVersion, regionId: validatedRegion.id });
  const artifact = {
    id: derivedId({ prospectId: parent.prospectId, attemptId: parent.attemptId, mediaType, contentDigest, locator }),
    prospectId: parent.prospectId,
    attemptId: parent.attemptId,
    mediaType,
    byteLength: bytes.length,
    contentDigest,
    originClassification: "DERIVED-FROM-ACQUIRED-ARTIFACT",
    acquisitionMethod: "LOCAL-DETERMINISTIC-TRANSFORM",
    locator,
    metadata: { parentArtifactId: parent.id, parentContentDigest: parent.contentDigest, parentMediaType: parent.mediaType, parentByteLength: parent.byteLength, transformerId, transformerVersion, region: validatedRegion, contentEncoding, content }
  };
  execution.validateArtifact(artifact);
  return Object.freeze(json.immutableClone({ schemaVersion: SCHEMA_VERSION, ...artifact, parentArtifactId: parent.id, parentContentDigest: parent.contentDigest, parentMediaType: parent.mediaType, parentByteLength: parent.byteLength, transformerId, transformerVersion, region: validatedRegion, contentEncoding, content }));
}

function validateDerivedContent(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_VERSION, "DerivedContent schemaVersion is incompatible");
  execution.validateArtifact(input);
  ["parentArtifactId", "parentContentDigest", "parentMediaType", "transformerId", "transformerVersion", "contentEncoding", "content"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `DerivedContent.${field} is required`));
  assert(/^[a-f0-9]{64}$/.test(input.parentContentDigest), "DerivedContent.parentContentDigest is invalid");
  assert(input.contentEncoding === "utf8" || input.contentEncoding === "base64", "DerivedContent.contentEncoding is invalid");
  assert(Number.isInteger(input.parentByteLength) && input.parentByteLength > 0, "DerivedContent.parentByteLength is invalid");
  validateRegion(input.region);
  const bytes = decode(input.content, input.contentEncoding);
  assert(input.byteLength === bytes.length && input.contentDigest === digestBytes(bytes), "DerivedContent content identity mismatch");
  assert(input.id === derivedId({ prospectId: input.prospectId, attemptId: input.attemptId, mediaType: input.mediaType, contentDigest: input.contentDigest, locator: input.locator }), "DerivedContent.id is unstable");
  assert(input.metadata?.parentArtifactId === input.parentArtifactId && input.metadata?.transformerId === input.transformerId && input.metadata?.transformerVersion === input.transformerVersion, "DerivedContent chain metadata mismatch");
  return json.immutableClone(input);
}

function assertBoundToParent(input, parentArtifact) {
  const derived = validateDerivedContent(input);
  const parent = execution.validateArtifact(parentArtifact);
  assert(derived.parentArtifactId === parent.id && derived.parentContentDigest === parent.contentDigest && derived.parentMediaType === parent.mediaType && derived.parentByteLength === parent.byteLength, "DerivedContent parent binding mismatch");
  return true;
}

function toExtractionEnvelope(input) {
  const derived = validateDerivedContent(input);
  assert(derived.contentEncoding === "utf8", "Extraction Agent requires UTF-8 derived content");
  return extraction.validateArtifactContentEnvelope({ schemaVersion: extraction.EXTRACTION_SCHEMA_VERSION, artifactId: derived.id, mediaType: derived.mediaType, byteLength: derived.byteLength, contentDigest: derived.contentDigest, contentEncoding: "utf8", content: derived.content });
}

module.exports = Object.freeze({ SCHEMA_VERSION, digestBytes, derivedId, validateParentBytes, createDerivedContent, validateDerivedContent, assertBoundToParent, toExtractionEnvelope });
