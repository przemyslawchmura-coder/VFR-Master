// NON-PRODUCTION deterministic pre-decision Review Queue contracts.
"use strict";

const crypto = require("node:crypto");
const extraction = require("./extraction-contracts.js");
const json = require("./json.js");

const REVIEW_QUEUE_SCHEMA_VERSION = 1;
const REVIEW_QUEUE_STATES = Object.freeze(["QUEUED"]);
const REVIEW_ELIGIBILITY = Object.freeze(["ELIGIBLE", "NOT-ELIGIBLE"]);
const INELIGIBILITY_REASONS = Object.freeze({
  "NO-CANDIDATES": "ZERO-CANDIDATES",
  "UNSUPPORTED-MEDIA": "UNSUPPORTED-EXTRACTION",
  "CONTENT-DIGEST-MISMATCH": "CONTENT-INTEGRITY-FAILED",
  "PROVENANCE-INCOMPLETE": "EXTRACTION-PROVENANCE-INCOMPLETE",
  "FIELD-UNMAPPED": "FIELD-UNMAPPED",
  "PARSE-FAILURE": "EXTRACTION-PARSE-FAILED",
  "PERMANENT-EXTRACTION-FAILURE": "EXTRACTION-PERMANENTLY-FAILED"
});
const idPattern = /^review-queue-entry\.[a-f0-9]{24}$/;
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const entryFields = new Set(["schemaVersion", "id", "state", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "extractionResultId", "candidateId", "adapterId", "adapterVersion", "candidate"]);
const ineligibilityFields = new Set(["schemaVersion", "extractionResultId", "disposition", "eligibility", "reasonCode"]);
const queueFields = new Set(["schemaVersion", "entries", "ineligible"]);
const assertClosed = (input, allowed, label) => Object.keys(input).forEach(field => assert(allowed.has(field), `${label}.${field} is unsupported`));
const semanticId = (kind, value) => `${kind}.${crypto.createHash("sha256").update(json.canonicalSerialize({ kind, ...value })).digest("hex").slice(0, 24)}`;
const reviewQueueEntryId = ({ extractionResultId, candidateId }) => semanticId("review-queue-entry", { candidateId, extractionResultId });

function validateReviewQueueEntry(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REVIEW_QUEUE_SCHEMA_VERSION, "ReviewQueueEntry schemaVersion is incompatible");
  assertClosed(input, entryFields, "ReviewQueueEntry");
  assert(typeof input.id === "string" && idPattern.test(input.id), "ReviewQueueEntry.id is invalid");
  assert(REVIEW_QUEUE_STATES.includes(input.state), "ReviewQueueEntry.state is invalid");
  const candidate = extraction.validateExtractionCandidate(input.candidate);
  ["batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "extractionResultId", "candidateId", "adapterId", "adapterVersion"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `ReviewQueueEntry.${field} is required`));
  assert(input.candidateId === candidate.id, "ReviewQueueEntry candidate identity mismatch");
  assert(input.extractionResultId === candidate.extractionResultId, "ReviewQueueEntry extraction identity mismatch");
  ["batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert(input[field] === candidate[field], `ReviewQueueEntry.${field} does not match candidate provenance`));
  assert(input.id === reviewQueueEntryId({ extractionResultId: input.extractionResultId, candidateId: input.candidateId }), "ReviewQueueEntry.id is unstable");
  return json.immutableClone({ ...input, candidate });
}

function validateReviewIneligibility(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REVIEW_QUEUE_SCHEMA_VERSION, "ReviewIneligibility schemaVersion is incompatible");
  assertClosed(input, ineligibilityFields, "ReviewIneligibility");
  assert(input.eligibility === "NOT-ELIGIBLE", "ReviewIneligibility eligibility is invalid");
  assert(typeof input.extractionResultId === "string" && input.extractionResultId.length > 0, "ReviewIneligibility extractionResultId is required");
  assert(Object.prototype.hasOwnProperty.call(INELIGIBILITY_REASONS, input.disposition), "ReviewIneligibility disposition is invalid");
  assert(input.reasonCode === INELIGIBILITY_REASONS[input.disposition], "ReviewIneligibility reasonCode is inconsistent");
  return json.immutableClone(input);
}

function validateReviewQueue(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REVIEW_QUEUE_SCHEMA_VERSION, "ReviewQueue schemaVersion is incompatible");
  assertClosed(input, queueFields, "ReviewQueue");
  assert(Array.isArray(input.entries) && Array.isArray(input.ineligible), "ReviewQueue entries and ineligible are required");
  const entries = input.entries.map(validateReviewQueueEntry);
  const ineligible = input.ineligible.map(validateReviewIneligibility);
  assert(entries.every((entry, index) => index === 0 || entries[index - 1].id.localeCompare(entry.id) < 0), "ReviewQueue entries must be uniquely and deterministically ordered");
  assert(ineligible.every((item, index) => index === 0 || `${ineligible[index - 1].extractionResultId}|${ineligible[index - 1].reasonCode}`.localeCompare(`${item.extractionResultId}|${item.reasonCode}`) < 0), "ReviewQueue ineligible records must be uniquely and deterministically ordered");
  return json.immutableClone({ schemaVersion: REVIEW_QUEUE_SCHEMA_VERSION, entries, ineligible });
}

module.exports = Object.freeze({ REVIEW_QUEUE_SCHEMA_VERSION, REVIEW_QUEUE_STATES, REVIEW_ELIGIBILITY, INELIGIBILITY_REASONS, reviewQueueEntryId, validateReviewQueueEntry, validateReviewIneligibility, validateReviewQueue });
