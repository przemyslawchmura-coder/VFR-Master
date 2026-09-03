// NON-PRODUCTION pre-promotion evidence-processing boundary contracts.
"use strict";

const crypto = require("node:crypto");
const decisions = require("./review-decision-contracts.js");
const queue = require("./review-queue-contracts.js");
const json = require("./json.js");

const EVIDENCE_PROCESSING_SCHEMA_VERSION = 1;
const EVIDENCE_PROCESSING_STATES = Object.freeze(["ACCEPTED-FOR-PROCESSING", "REJECTED-CANDIDATE", "NEEDS-MORE-REVIEW", "INELIGIBLE", "CANNOT-ADVANCE"]);
const EVIDENCE_PROCESSING_REASONS = Object.freeze(["ACCEPTED-DECISION", "REJECTED-BY-REVIEW", "REVIEW-DEFERRED", "MISSING-QUEUE-ENTRY", "UNRESOLVED-CANDIDATE-CONFLICT"]);
const recordFields = new Set(["schemaVersion", "id", "state", "reasonCode", "decisionId", "queueEntryId", "extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion", "candidate"]);
const setFields = new Set(["schemaVersion", "records"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertClosed = (input, allowed, label) => Object.keys(input).forEach(field => assert(allowed.has(field), `${label}.${field} is unsupported`));
const semanticId = (value) => `evidence-processing.${crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24)}`;
const evidenceProcessingId = ({ decisionId, queueEntryId, state }) => semanticId({ decisionId, queueEntryId, state });

function validateEvidenceProcessingRecord(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EVIDENCE_PROCESSING_SCHEMA_VERSION, "EvidenceProcessingRecord schemaVersion is incompatible");
  assertClosed(input, recordFields, "EvidenceProcessingRecord");
  assert(typeof input.id === "string" && /^evidence-processing\.[a-f0-9]{24}$/.test(input.id), "EvidenceProcessingRecord.id is invalid");
  assert(EVIDENCE_PROCESSING_STATES.includes(input.state), "EvidenceProcessingRecord.state is invalid");
  assert(EVIDENCE_PROCESSING_REASONS.includes(input.reasonCode), "EvidenceProcessingRecord.reasonCode is invalid");
  ["decisionId", "queueEntryId", "extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `EvidenceProcessingRecord.${field} is required`));
  if (input.state === "INELIGIBLE") assert(input.candidate === null, "EvidenceProcessingRecord ineligible candidate must be null");
  else {
    assert(input.candidate && typeof input.candidate === "object" && !Array.isArray(input.candidate), "EvidenceProcessingRecord.candidate is required");
    queue.validateReviewQueueEntry({ schemaVersion: queue.REVIEW_QUEUE_SCHEMA_VERSION, id: input.queueEntryId, state: "QUEUED", batchId: input.batchId, targetId: input.targetId, targetWorkId: input.targetWorkId, sourceWorkItemId: input.sourceWorkItemId, attemptId: input.attemptId, prospectId: input.prospectId, artifactId: input.artifactId, extractionResultId: input.extractionResultId, candidateId: input.candidateId, adapterId: input.adapterId, adapterVersion: input.adapterVersion, candidate: input.candidate });
  }
  assert(input.id === evidenceProcessingId({ decisionId: input.decisionId, queueEntryId: input.queueEntryId, state: input.state }), "EvidenceProcessingRecord.id is unstable");
  assert((input.state === "ACCEPTED-FOR-PROCESSING") === (input.reasonCode === "ACCEPTED-DECISION"), "EvidenceProcessingRecord accepted state is inconsistent");
  return json.immutableClone(input);
}

function validateEvidenceProcessingSet(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === EVIDENCE_PROCESSING_SCHEMA_VERSION, "EvidenceProcessingSet schemaVersion is incompatible");
  assertClosed(input, setFields, "EvidenceProcessingSet");
  assert(Array.isArray(input.records), "EvidenceProcessingSet.records are required");
  const records = input.records.map(validateEvidenceProcessingRecord);
  assert(records.every((item, index) => index === 0 || records[index - 1].id.localeCompare(item.id) < 0), "EvidenceProcessingSet records must be uniquely and deterministically ordered");
  return json.immutableClone({ schemaVersion: EVIDENCE_PROCESSING_SCHEMA_VERSION, records });
}

module.exports = Object.freeze({ EVIDENCE_PROCESSING_SCHEMA_VERSION, EVIDENCE_PROCESSING_STATES, EVIDENCE_PROCESSING_REASONS, evidenceProcessingId, validateEvidenceProcessingRecord, validateEvidenceProcessingSet });
