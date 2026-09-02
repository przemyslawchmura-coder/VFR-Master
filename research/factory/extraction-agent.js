// NON-PRODUCTION pure bounded extraction agent for acquired local content.
"use strict";

const foundation = require("./contracts.js");
const orchestration = require("./orchestrator-contracts.js");
const reducer = require("./reducer.js");
const execution = require("./execution-contracts.js");
const contracts = require("./extraction-contracts.js");
const json = require("./json.js");

const fail = message => { throw new Error(`extraction rejected: ${message}`); };
const forbidden = Object.freeze(["id", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "extractionResultId", "adapterId", "adapterVersion", "state", "proofStatus", "verificationState"]);
const rawCandidateFields = new Set(["fieldId", "rawValue", "rawUnit", "sourceLocation", "extractionMethod", "applicability", "context", "ordinal"]);
const rawResultFields = new Set(["disposition", "candidates", "observations"]);
const adapterDispositions = new Set(["CANDIDATES-PRODUCED", "NO-CANDIDATES", "FIELD-UNMAPPED", "PARSE-FAILURE", "PERMANENT-EXTRACTION-FAILURE"]);

function extractRawCandidates({ executionResult, events, researchTarget, contentEnvelope, adapter }) {
  const beforeEvents = json.canonicalSerialize(events);
  const acquired = execution.validateExecutionResult(executionResult);
  if (acquired.outcome.outcome !== "ACQUIRED" || !acquired.outcome.artifact) fail("ExecutionResult is not an acquired artifact");
  const snapshot = reducer.reduceEvents(events);
  const target = foundation.validateResearchTarget(researchTarget);
  const source = snapshot.sourceWorkItems.find(item => item.id === acquired.sourceWorkItemId);
  if (!source) fail("source work is not in canonical state");
  const targetWork = snapshot.targets.find(item => item.id === source.targetWorkId);
  if (!targetWork || targetWork.batchId !== snapshot.batch.id || targetWork.targetId !== target.id) fail("canonical target or batch identity mismatch");
  const attempt = snapshot.attempts.find(item => item.id === acquired.attemptId && item.sourceWorkId === source.id);
  if (!attempt || attempt.state !== "COMPLETED" || json.canonicalSerialize(attempt.result) !== json.canonicalSerialize(acquired)) fail("acquisition attempt identity or result mismatch");
  if (acquired.batchId !== targetWork.batchId) fail("ExecutionResult batch identity mismatch");
  const artifact = execution.validateArtifact(acquired.outcome.artifact);
  if (artifact.attemptId !== attempt.id || artifact.prospectId !== source.prospectId) fail("artifact provenance mismatch");
  const envelope = contracts.validateArtifactContentEnvelope(contentEnvelope);
  const declaration = contracts.validateExtractorAdapterDeclaration(adapter && { schemaVersion: adapter.schemaVersion, adapterId: adapter.adapterId, adapterVersion: adapter.adapterVersion, supportedMediaTypes: adapter.supportedMediaTypes, supportedOperations: adapter.supportedOperations, deterministic: adapter.deterministic, localOnly: adapter.localOnly });
  if (typeof adapter.execute !== "function") fail("extractor execute function is required");
  if (envelope.artifactId !== artifact.id || envelope.mediaType !== artifact.mediaType) fail("content envelope does not match artifact identity or media type");
  const identity = { batchId: targetWork.batchId, targetId: target.id, targetWorkId: targetWork.id, sourceWorkItemId: source.id, attemptId: attempt.id, prospectId: source.prospectId, artifactId: artifact.id, adapterId: declaration.adapterId, adapterVersion: declaration.adapterVersion };
  const resultId = contracts.extractionResultId({ ...identity, operation: contracts.EXTRACTION_OPERATION });
  const finish = (disposition, candidates, observations) => contracts.validateExtractionResult({ schemaVersion: contracts.EXTRACTION_SCHEMA_VERSION, id: resultId, ...identity, disposition, candidates, observations });
  const actualLength = Buffer.byteLength(envelope.content, "utf8");
  const actualDigest = contracts.sha256(envelope.content);
  if (artifact.contentDigest === null || artifact.byteLength === null) return finish("PROVENANCE-INCOMPLETE", [], [{ type: "PROVENANCE-INCOMPLETE", detailCode: "ARTIFACT_CONTENT_PROVENANCE_INCOMPLETE", metadata: {} }]);
  if (envelope.contentDigest !== artifact.contentDigest || actualDigest !== artifact.contentDigest || envelope.byteLength !== artifact.byteLength || actualLength !== artifact.byteLength) return finish("CONTENT-DIGEST-MISMATCH", [], [{ type: "CONTENT-INTEGRITY-FAILED", detailCode: "ARTIFACT_CONTENT_INTEGRITY_MISMATCH", metadata: {} }]);
  if (!declaration.supportedMediaTypes.includes(envelope.mediaType)) return finish("UNSUPPORTED-MEDIA", [], [{ type: "UNSUPPORTED-MEDIA", detailCode: "EXTRACTOR_MEDIA_TYPE_UNSUPPORTED", metadata: { mediaType: envelope.mediaType } }]);
  const raw = adapter.execute(json.immutableClone({ schemaVersion: contracts.EXTRACTION_SCHEMA_VERSION, operation: contracts.EXTRACTION_OPERATION, artifact: { id: artifact.id, mediaType: artifact.mediaType, byteLength: artifact.byteLength, contentDigest: artifact.contentDigest }, content: envelope.content }));
  json.assertJsonSafe(raw);
  if (!raw || !adapterDispositions.has(raw.disposition) || !Array.isArray(raw.candidates) || !Array.isArray(raw.observations)) fail("extractor output is malformed");
  Object.keys(raw).forEach(field => { if (!rawResultFields.has(field)) fail(`extractor output field is unsupported: ${field}`); });
  raw.candidates.forEach(candidate => {
    forbidden.forEach(field => { if (Object.prototype.hasOwnProperty.call(candidate, field)) fail(`extractor candidate cannot supply canonical field: ${field}`); });
    Object.keys(candidate).forEach(field => { if (!rawCandidateFields.has(field)) fail(`extractor candidate field is unsupported: ${field}`); });
  });
  raw.observations.forEach(contracts.validateExtractionObservation);
  const candidates = raw.candidates.map(candidate => {
    if (!contracts.SERVICE_CORE_FIELDS.includes(candidate.fieldId)) fail("extractor produced an unmapped field");
    const candidateIdentity = { extractionResultId: resultId, artifactId: artifact.id, targetId: target.id, fieldId: candidate.fieldId, sourceLocation: candidate.sourceLocation, ordinal: candidate.ordinal, adapterId: declaration.adapterId, adapterVersion: declaration.adapterVersion };
    return contracts.validateExtractionCandidate({ schemaVersion: contracts.EXTRACTION_SCHEMA_VERSION, id: contracts.candidateId(candidateIdentity), ...identity, extractionResultId: resultId, fieldId: candidate.fieldId, rawValue: candidate.rawValue, rawUnit: candidate.rawUnit === undefined ? null : candidate.rawUnit, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod, applicability: candidate.applicability === undefined ? null : candidate.applicability, context: candidate.context === undefined ? null : candidate.context, ordinal: candidate.ordinal });
  }).sort((a, b) => a.id.localeCompare(b.id));
  const result = finish(raw.disposition, candidates, raw.observations);
  if (json.canonicalSerialize(events) !== beforeEvents) fail("extractor mutated acquisition events");
  return result;
}

module.exports = Object.freeze({ extractRawCandidates });
