// NON-PRODUCTION deterministic semantic identifiers.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const assertText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(`${label} is required for stable identity`);
  return value.trim();
};
const digest = identity => crypto.createHash("sha256").update(json.canonicalSerialize(identity)).digest("hex").slice(0, 24);
const make = (kind, identity) => `${kind}.${digest({ kind, ...identity })}`;

function batchId({ purpose, targetIds, policyId, maxAttemptsPerWorkItem }) {
  if (!Array.isArray(targetIds) || !targetIds.length) throw new TypeError("batch targetIds are required for stable identity");
  if (!Number.isInteger(maxAttemptsPerWorkItem) || maxAttemptsPerWorkItem < 1) throw new TypeError("batch maxAttemptsPerWorkItem is required for stable identity");
  const targets = [...new Set(targetIds.map(value => assertText(value, "batch targetId")))].sort();
  return make("batch", { maxAttemptsPerWorkItem, purpose: assertText(purpose, "batch purpose"), policyId: assertText(policyId, "batch policyId"), targetIds: targets });
}
const targetWorkId = ({ batchId: batch, targetId }) => make("target-work", { batchId: assertText(batch, "batchId"), targetId: assertText(targetId, "targetId") });
const sourceWorkId = ({ targetWorkId: targetWork, prospectId, operation }) => make("source-work", { operation: assertText(operation, "source operation"), prospectId: assertText(prospectId, "prospectId"), targetWorkId: assertText(targetWork, "targetWorkId") });
const attemptId = ({ sourceWorkId: sourceWork, ordinal }) => {
  if (!Number.isInteger(ordinal) || ordinal < 1) throw new TypeError("attempt ordinal must be a positive integer");
  return make("attempt", { ordinal, sourceWorkId: assertText(sourceWork, "sourceWorkId") });
};
const eventId = ({ batchId: batch, sequence, type, payload }) => {
  if (!Number.isInteger(sequence) || sequence < 1) throw new TypeError("event sequence must be a positive integer");
  return make("event", { batchId: assertText(batch, "batchId"), payload: json.canonicalize(payload), sequence, type: assertText(type, "event type") });
};
const checkpointId = ({ batchId: batch, eventCount, eventDigest }) => {
  if (!Number.isInteger(eventCount) || eventCount < 1) throw new TypeError("checkpoint eventCount must be positive");
  return make("checkpoint", { batchId: assertText(batch, "batchId"), eventCount, eventDigest: assertText(eventDigest, "eventDigest") });
};

module.exports = Object.freeze({ batchId, targetWorkId, sourceWorkId, attemptId, eventId, checkpointId });
