// NON-PRODUCTION raw extraction boundary contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const pipeline = require("../lib/batch-research-pipeline.js");
const riderServiceCore = require("../schema/rider-service-core-v1.js");

const EXTRACTION_SCHEMA_VERSION = 1;
const EXTRACTION_OPERATION = "extract-raw-candidates";
const EXTRACTION_DISPOSITIONS = Object.freeze(["CANDIDATES-PRODUCED", "NO-CANDIDATES", "UNSUPPORTED-MEDIA", "CONTENT-DIGEST-MISMATCH", "PROVENANCE-INCOMPLETE", "FIELD-UNMAPPED", "PARSE-FAILURE", "PERMANENT-EXTRACTION-FAILURE"]);
const EXTRACTION_OBSERVATION_TYPES = Object.freeze(["CANDIDATE-EXTRACTED", "NO-CANDIDATES", "UNSUPPORTED-MEDIA", "CONTENT-INTEGRITY-FAILED", "PROVENANCE-INCOMPLETE", "FIELD-UNMAPPED", "PARSE-FAILED", "PERMANENT-FAILURE"]);
const SERVICE_CORE_FIELDS = Object.freeze([...new Set([...pipeline.serviceCoreFields, ...riderServiceCore.fieldIds])]);
const LEGACY_SERVICE_CORE_FIELDS = pipeline.serviceCoreFields;
const serviceCore = new Set(SERVICE_CORE_FIELDS);
const idPattern = /^[a-z][a-z-]*\.[a-f0-9]{24}$/;
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const hasSecrets = value => /(password|token|cookie|secret|api[-_]?key)/i.test(json.canonicalSerialize(value));
const sha256 = value => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const semanticId = (kind, value) => `${kind}.${sha256(json.canonicalSerialize(value)).slice(0, 24)}`;

function validateArtifactContentEnvelope(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXTRACTION_SCHEMA_VERSION, "ArtifactContentEnvelope schemaVersion is incompatible");
  assert(typeof input.artifactId === "string" && input.artifactId.startsWith("artifact."), "ArtifactContentEnvelope.artifactId is invalid");
  assert(typeof input.mediaType === "string" && input.mediaType.length > 0, "ArtifactContentEnvelope.mediaType is required");
  assert(Number.isInteger(input.byteLength) && input.byteLength >= 0, "ArtifactContentEnvelope.byteLength is invalid");
  assert(typeof input.contentDigest === "string" && /^[a-f0-9]{64}$/.test(input.contentDigest), "ArtifactContentEnvelope.contentDigest is invalid");
  assert(input.contentEncoding === "utf8", "ArtifactContentEnvelope supports only utf8 local content");
  assert(typeof input.content === "string", "ArtifactContentEnvelope.content must be a string");
  assert(!hasSecrets(input), "ArtifactContentEnvelope contains prohibited secret-shaped data");
  return json.immutableClone(input);
}

function validateExtractorAdapterDeclaration(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXTRACTION_SCHEMA_VERSION, "ExtractorAdapterDeclaration schemaVersion is incompatible");
  assert(typeof input.adapterId === "string" && input.adapterId.length > 0, "ExtractorAdapterDeclaration.adapterId is required");
  assert(typeof input.adapterVersion === "string" && input.adapterVersion.length > 0, "ExtractorAdapterDeclaration.adapterVersion is required");
  assert(Array.isArray(input.supportedMediaTypes) && input.supportedMediaTypes.length > 0 && input.supportedMediaTypes.every(value => typeof value === "string" && value.length > 0), "ExtractorAdapterDeclaration.supportedMediaTypes are invalid");
  assert(Array.isArray(input.supportedOperations) && input.supportedOperations.includes(EXTRACTION_OPERATION), "ExtractorAdapterDeclaration operation is unsupported");
  assert(input.deterministic === true && input.localOnly === true, "ExtractorAdapterDeclaration must be deterministic and local-only");
  return json.immutableClone(input);
}

function validateExtractionObservation(input) {
  json.assertJsonSafe(input);
  assert(input && EXTRACTION_OBSERVATION_TYPES.includes(input.type), "ExtractionObservation.type is invalid");
  assert(typeof input.detailCode === "string" && input.detailCode.length > 0, "ExtractionObservation.detailCode is required");
  assert(!hasSecrets(input), "ExtractionObservation contains prohibited secret-shaped data");
  return json.immutableClone({ ...input, metadata: input.metadata || {} });
}

function validateSourceLocation(input) {
  assert(input && typeof input === "object" && !Array.isArray(input), "ExtractionCandidate.sourceLocation is required");
  if (input.page !== null) assert(Number.isInteger(input.page) && input.page > 0, "ExtractionCandidate source page is invalid");
  if (input.section !== null) assert(typeof input.section === "string" && input.section.length > 0, "ExtractionCandidate source section is invalid");
  if (input.locator !== null) assert(typeof input.locator === "string" && input.locator.length > 0, "ExtractionCandidate source locator is invalid");
  assert(input.page !== null || input.section !== null || input.locator !== null, "ExtractionCandidate source location is empty");
}

function candidateId(input) { return semanticId("extraction-candidate", input); }
function extractionResultId(input) { return semanticId("extraction-result", input); }

function validateExtractionCandidate(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXTRACTION_SCHEMA_VERSION, "ExtractionCandidate schemaVersion is incompatible");
  assert(typeof input.id === "string" && idPattern.test(input.id) && input.id.startsWith("extraction-candidate."), "ExtractionCandidate.id is invalid");
  assert(serviceCore.has(input.fieldId), "ExtractionCandidate.fieldId is not in the Service Core");
  ["targetId", "artifactId", "prospectId", "attemptId", "sourceWorkItemId", "targetWorkId", "extractionResultId", "adapterId", "adapterVersion", "extractionMethod"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `ExtractionCandidate.${field} is required`));
  assert(Number.isInteger(input.ordinal) && input.ordinal > 0, "ExtractionCandidate.ordinal is invalid");
  assert(input.rawValue !== null, "ExtractionCandidate.rawValue is required");
  assert(input.rawUnit === null || typeof input.rawUnit === "string", "ExtractionCandidate.rawUnit is invalid");
  validateSourceLocation(input.sourceLocation);
  assert(input.applicability === null || typeof input.applicability === "object", "ExtractionCandidate.applicability is invalid");
  assert(input.context === null || typeof input.context === "object", "ExtractionCandidate.context is invalid");
  assert(input.id === candidateId({ extractionResultId: input.extractionResultId, artifactId: input.artifactId, targetId: input.targetId, fieldId: input.fieldId, sourceLocation: input.sourceLocation, ordinal: input.ordinal, adapterId: input.adapterId, adapterVersion: input.adapterVersion }), "ExtractionCandidate.id is unstable");
  assert(!hasSecrets(input), "ExtractionCandidate contains prohibited secret-shaped data");
  return json.immutableClone(input);
}

function validateExtractionResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EXTRACTION_SCHEMA_VERSION, "ExtractionResult schemaVersion is incompatible");
  assert(typeof input.id === "string" && idPattern.test(input.id) && input.id.startsWith("extraction-result."), "ExtractionResult.id is invalid");
  ["batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `ExtractionResult.${field} is required`));
  assert(EXTRACTION_DISPOSITIONS.includes(input.disposition), "ExtractionResult.disposition is invalid");
  assert(Array.isArray(input.candidates) && Array.isArray(input.observations), "ExtractionResult candidates and observations are required");
  input.candidates.forEach(validateExtractionCandidate);
  input.observations.forEach(validateExtractionObservation);
  assert(input.id === extractionResultId({ batchId: input.batchId, targetId: input.targetId, targetWorkId: input.targetWorkId, sourceWorkItemId: input.sourceWorkItemId, attemptId: input.attemptId, prospectId: input.prospectId, artifactId: input.artifactId, adapterId: input.adapterId, adapterVersion: input.adapterVersion, operation: EXTRACTION_OPERATION }), "ExtractionResult.id is unstable");
  input.candidates.forEach(candidate => {
    ["targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert(candidate[field] === input[field], `ExtractionCandidate.${field} does not match ExtractionResult`));
    assert(candidate.extractionResultId === input.id, "ExtractionCandidate.extractionResultId does not match ExtractionResult");
  });
  assert((input.disposition === "CANDIDATES-PRODUCED") === (input.candidates.length > 0), "ExtractionResult candidate disposition is inconsistent");
  assert(!hasSecrets(input), "ExtractionResult contains prohibited secret-shaped data");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ EXTRACTION_SCHEMA_VERSION, EXTRACTION_OPERATION, EXTRACTION_DISPOSITIONS, EXTRACTION_OBSERVATION_TYPES, LEGACY_SERVICE_CORE_FIELDS, SERVICE_CORE_FIELDS, RIDER_SERVICE_CORE_MATRIX: riderServiceCore, sha256, candidateId, extractionResultId, validateArtifactContentEnvelope, validateExtractorAdapterDeclaration, validateExtractionObservation, validateExtractionCandidate, validateExtractionResult });
