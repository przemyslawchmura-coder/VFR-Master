// NON-PRODUCTION Technical Research Factory execution boundary contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const foundation = require("./contracts.js");

const EXECUTION_SCHEMA_VERSION = 1;
const OUTCOMES = Object.freeze(["ACQUIRED", "NO-EVIDENCE", "ACCESS-BLOCKED", "AUTH-REQUIRED", "NOT-FOUND", "SOURCE-MISMATCH", "APPLICABILITY-UNKNOWN", "APPLICABILITY-PARTIAL", "TRANSIENT-FAILURE", "PERMANENT-FAILURE"]);
const RETRY_CLASSES = Object.freeze(["RETRYABLE", "NON-RETRYABLE", "BLOCKED"]);
const OBSERVATION_TYPES = Object.freeze(["DOCUMENT-ACQUIRED", "METADATA-ACQUIRED", "CONTENT-UNAVAILABLE", "LOGIN-WALL", "SOURCE-IDENTITY-MISMATCH", "DOCUMENT-APPLICABILITY-UNRESOLVED", "CANDIDATE-CONTENT-PRESENT"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);

function validateAcquisitionRequest(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXECUTION_SCHEMA_VERSION, "AcquisitionRequest schemaVersion is incompatible");
  assert(typeof input.batchId === "string" && input.batchId.startsWith("batch."), "AcquisitionRequest.batchId is required");
  assert(typeof input.targetWorkId === "string" && input.targetWorkId.startsWith("target-work."), "AcquisitionRequest.targetWorkId is required");
  assert(typeof input.sourceWorkItemId === "string" && input.sourceWorkItemId.startsWith("source-work."), "AcquisitionRequest.sourceWorkItemId is required");
  assert(typeof input.attemptId === "string" && input.attemptId.startsWith("attempt."), "AcquisitionRequest.attemptId is required");
  assert(typeof input.prospectId === "string" && input.prospectId.length > 0, "AcquisitionRequest.prospectId is required");
  assert(typeof input.operation === "string" && input.operation.length > 0, "AcquisitionRequest.operation is required");
  assert(typeof input.adapterId === "string" && input.adapterId.length > 0, "AcquisitionRequest.adapterId is required");
  return json.immutableClone(input);
}

function artifactId(input) { return `artifact.${digest(input)}`; }
function validateArtifact(input) {
  assert(input && typeof input === "object", "AcquisitionArtifact is required");
  assert(typeof input.id === "string" && input.id === artifactId({ prospectId: input.prospectId, attemptId: input.attemptId, mediaType: input.mediaType, contentDigest: input.contentDigest || null, locator: input.locator || null }), "AcquisitionArtifact.id is unstable");
  assert(typeof input.prospectId === "string" && typeof input.attemptId === "string", "AcquisitionArtifact identity is required");
  assert(typeof input.mediaType === "string" && input.mediaType.length > 0, "AcquisitionArtifact.mediaType is required");
  if (input.byteLength !== null) assert(Number.isInteger(input.byteLength) && input.byteLength >= 0, "AcquisitionArtifact.byteLength is invalid");
  if (input.contentDigest !== null) assert(typeof input.contentDigest === "string" && /^[a-f0-9]{64}$/.test(input.contentDigest), "AcquisitionArtifact.contentDigest is invalid");
  assert(typeof input.originClassification === "string" && typeof input.acquisitionMethod === "string", "AcquisitionArtifact provenance is required");
  json.assertJsonSafe(input.metadata || {});
  assert(!/(password|token|cookie|secret|api[-_]?key)/i.test(json.canonicalSerialize(input)), "AcquisitionArtifact contains prohibited secret-shaped data");
  return json.immutableClone(input);
}
function validateObservation(input) {
  assert(input && OBSERVATION_TYPES.includes(input.type), "AcquisitionObservation.type is invalid");
  assert(typeof input.detailCode === "string" && input.detailCode.length > 0, "AcquisitionObservation.detailCode is required");
  json.assertJsonSafe(input.metadata || {});
  return json.immutableClone(input);
}
function validateOutcome(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXECUTION_SCHEMA_VERSION, "AcquisitionOutcome schemaVersion is incompatible");
  assert(OUTCOMES.includes(input.outcome), "AcquisitionOutcome.outcome is invalid");
  assert(RETRY_CLASSES.includes(input.retryClass), "AcquisitionOutcome.retryClass is invalid");
  assert(typeof input.reasonCode === "string" && input.reasonCode.length > 0, "AcquisitionOutcome.reasonCode is required");
  assert(Array.isArray(input.observations), "AcquisitionOutcome.observations are required");
  input.observations.forEach(validateObservation);
  if (input.artifact !== null && input.artifact !== undefined) validateArtifact(input.artifact);
  assert(!/(password|token|cookie|secret|api[-_]?key)/i.test(json.canonicalSerialize(input)), "AcquisitionOutcome contains prohibited secret-shaped data");
  return json.immutableClone(input);
}
function validateExecutionResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXECUTION_SCHEMA_VERSION, "ExecutionResult schemaVersion is incompatible");
  assert(typeof input.batchId === "string" && typeof input.sourceWorkItemId === "string" && typeof input.attemptId === "string", "ExecutionResult identity is required");
  validateOutcome(input.outcome);
  return json.immutableClone(input);
}

module.exports = Object.freeze({ EXECUTION_SCHEMA_VERSION, OUTCOMES, RETRY_CLASSES, OBSERVATION_TYPES, artifactId, validateAcquisitionRequest, validateArtifact, validateObservation, validateOutcome, validateExecutionResult });
