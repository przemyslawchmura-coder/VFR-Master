// NON-PRODUCTION immutable Human Review Decision contracts.
"use strict";

const crypto = require("node:crypto");
const queue = require("./review-queue-contracts.js");
const json = require("./json.js");

const REVIEW_DECISION_SCHEMA_VERSION = 1;
const REVIEW_DECISIONS = Object.freeze(["ACCEPT", "REJECT", "NEEDS-MORE-REVIEW"]);
const idPattern = /^review-decision\.[a-f0-9]{24}$/;
const decisionFields = new Set(["schemaVersion", "id", "queueEntryId", "extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion", "decision", "reviewerId", "comment"]);
const setFields = new Set(["schemaVersion", "decisions"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertClosed = (input, allowed, label) => Object.keys(input).forEach(field => assert(allowed.has(field), `${label}.${field} is unsupported`));
const semanticId = (kind, value) => `${kind}.${crypto.createHash("sha256").update(json.canonicalSerialize({ kind, ...value })).digest("hex").slice(0, 24)}`;
const reviewDecisionId = ({ queueEntryId, decision, reviewerId }) => semanticId("review-decision", { decision, queueEntryId, reviewerId });

function validateReviewDecision(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REVIEW_DECISION_SCHEMA_VERSION, "ReviewDecision schemaVersion is incompatible");
  assertClosed(input, decisionFields, "ReviewDecision");
  assert(typeof input.id === "string" && idPattern.test(input.id), "ReviewDecision.id is invalid");
  ["queueEntryId", "extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert(typeof input[field] === "string" && input[field].length > 0, `ReviewDecision.${field} is required`));
  assert(REVIEW_DECISIONS.includes(input.decision), "ReviewDecision.decision is invalid");
  assert(typeof input.reviewerId === "string" && input.reviewerId.length > 0, "ReviewDecision.reviewerId is required");
  assert(input.comment === null || typeof input.comment === "string", "ReviewDecision.comment is invalid");
  assert(input.id === reviewDecisionId({ queueEntryId: input.queueEntryId, decision: input.decision, reviewerId: input.reviewerId }), "ReviewDecision.id is unstable");
  return json.immutableClone(input);
}

function validateReviewDecisionSet(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === REVIEW_DECISION_SCHEMA_VERSION, "ReviewDecisionSet schemaVersion is incompatible");
  assertClosed(input, setFields, "ReviewDecisionSet");
  assert(Array.isArray(input.decisions), "ReviewDecisionSet.decisions are required");
  const decisions = input.decisions.map(validateReviewDecision);
  assert(decisions.every((item, index) => index === 0 || decisions[index - 1].id.localeCompare(item.id) < 0), "ReviewDecisionSet decisions must be uniquely and deterministically ordered");
  assert(new Set(decisions.map(item => item.queueEntryId)).size === decisions.length, "ReviewDecisionSet permits only one decision per queue entry");
  return json.immutableClone({ schemaVersion: REVIEW_DECISION_SCHEMA_VERSION, decisions });
}

function validateDecisionAgainstQueueEntry(decision, queueEntry) {
  const record = validateReviewDecision(decision);
  const entry = queue.validateReviewQueueEntry(queueEntry);
  const relationships = { queueEntryId: entry.id, extractionResultId: entry.extractionResultId, candidateId: entry.candidateId, batchId: entry.batchId, targetId: entry.targetId, targetWorkId: entry.targetWorkId, sourceWorkItemId: entry.sourceWorkItemId, attemptId: entry.attemptId, prospectId: entry.prospectId, artifactId: entry.artifactId, adapterId: entry.adapterId, adapterVersion: entry.adapterVersion };
  Object.entries(relationships).forEach(([field, value]) => assert(record[field] === value, `ReviewDecision.${field} does not match ReviewQueueEntry`));
  return record;
}

module.exports = Object.freeze({ REVIEW_DECISION_SCHEMA_VERSION, REVIEW_DECISIONS, reviewDecisionId, validateReviewDecision, validateReviewDecisionSet, validateDecisionAgainstQueueEntry });
