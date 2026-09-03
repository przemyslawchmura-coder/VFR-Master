// NON-PRODUCTION pure deterministic Human Review Decision construction.
"use strict";

const queueContracts = require("./review-queue-contracts.js");
const contracts = require("./review-decision-contracts.js");
const json = require("./json.js");

const inputFields = new Set(["queueEntry", "decision", "reviewerId", "comment"]);
const assertClosed = input => Object.keys(input).forEach(field => { if (!inputFields.has(field)) throw new TypeError(`ReviewDecisionInput.${field} is unsupported`); });

function buildReviewDecisions(inputs) {
  if (!Array.isArray(inputs)) throw new TypeError("Human Review Decisions require an explicit input array");
  const before = json.canonicalSerialize(inputs);
  const byQueueEntry = new Map();
  inputs.forEach(input => {
    json.assertJsonSafe(input);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("ReviewDecisionInput must be an object");
    assertClosed(input);
    const entry = queueContracts.validateReviewQueueEntry(input.queueEntry);
    if (!contracts.REVIEW_DECISIONS.includes(input.decision)) throw new TypeError("ReviewDecisionInput.decision is invalid");
    if (typeof input.reviewerId !== "string" || input.reviewerId.length === 0) throw new TypeError("ReviewDecisionInput.reviewerId is required");
    if (input.comment !== undefined && input.comment !== null && typeof input.comment !== "string") throw new TypeError("ReviewDecisionInput.comment is invalid");
    const identity = { queueEntryId: entry.id, decision: input.decision, reviewerId: input.reviewerId };
    const record = contracts.validateDecisionAgainstQueueEntry({ schemaVersion: contracts.REVIEW_DECISION_SCHEMA_VERSION, id: contracts.reviewDecisionId(identity), queueEntryId: entry.id, extractionResultId: entry.extractionResultId, candidateId: entry.candidateId, batchId: entry.batchId, targetId: entry.targetId, targetWorkId: entry.targetWorkId, sourceWorkItemId: entry.sourceWorkItemId, attemptId: entry.attemptId, prospectId: entry.prospectId, artifactId: entry.artifactId, adapterId: entry.adapterId, adapterVersion: entry.adapterVersion, decision: input.decision, reviewerId: input.reviewerId, comment: input.comment === undefined ? null : input.comment }, entry);
    if (byQueueEntry.has(entry.id)) {
      const existing = byQueueEntry.get(entry.id);
      if (existing.decision !== record.decision) throw new TypeError("conflicting Human Review Decisions for one queue entry");
      if (json.canonicalSerialize(existing) !== json.canonicalSerialize(record)) throw new TypeError("inconsistent duplicate Human Review Decision payload");
      return;
    }
    byQueueEntry.set(entry.id, record);
  });
  if (json.canonicalSerialize(inputs) !== before) throw new Error("Human Review Decision construction mutated inputs");
  return contracts.validateReviewDecisionSet({ schemaVersion: contracts.REVIEW_DECISION_SCHEMA_VERSION, decisions: [...byQueueEntry.values()].sort((a, b) => a.id.localeCompare(b.id)) });
}

module.exports = Object.freeze({ buildReviewDecisions });
