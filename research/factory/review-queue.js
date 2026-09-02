// NON-PRODUCTION pure deterministic queue construction over raw extraction results.
"use strict";

const extraction = require("./extraction-contracts.js");
const contracts = require("./review-queue-contracts.js");
const json = require("./json.js");

const resultFields = new Set(["schemaVersion", "id", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion", "disposition", "candidates", "observations"]);
const candidateFields = new Set(["schemaVersion", "id", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "extractionResultId", "adapterId", "adapterVersion", "fieldId", "rawValue", "rawUnit", "sourceLocation", "extractionMethod", "applicability", "context", "ordinal"]);
const assertClosed = (input, allowed, label) => Object.keys(input).forEach(field => { if (!allowed.has(field)) throw new TypeError(`${label}.${field} is unsupported at the Review Queue boundary`); });
const canonicalResult = result => json.canonicalSerialize({ ...result, candidates: [...result.candidates].sort((a, b) => a.id.localeCompare(b.id)), observations: [...result.observations].sort((a, b) => json.canonicalSerialize(a).localeCompare(json.canonicalSerialize(b))) });

function classifyReviewEligibility(extractionResult) {
  const result = extraction.validateExtractionResult(extractionResult);
  assertClosed(result, resultFields, "ExtractionResult");
  result.candidates.forEach(candidate => assertClosed(candidate, candidateFields, "ExtractionCandidate"));
  if (result.disposition === "CANDIDATES-PRODUCED") return Object.freeze({ eligibility: "ELIGIBLE", reasonCode: null });
  return Object.freeze({ eligibility: "NOT-ELIGIBLE", reasonCode: contracts.INELIGIBILITY_REASONS[result.disposition] });
}

function buildReviewQueue(extractionResults) {
  if (!Array.isArray(extractionResults)) throw new TypeError("Review Queue requires an explicit extraction result array");
  const before = json.canonicalSerialize(extractionResults);
  const results = new Map();
  const entries = new Map();
  const ineligible = new Map();
  extractionResults.forEach(input => {
    const result = extraction.validateExtractionResult(input);
    if (results.has(result.id) && canonicalResult(results.get(result.id)) !== canonicalResult(result)) throw new TypeError("Review Queue extraction result identity collision");
    results.set(result.id, result);
    const eligibility = classifyReviewEligibility(result);
    if (eligibility.eligibility === "NOT-ELIGIBLE") {
      const record = contracts.validateReviewIneligibility({ schemaVersion: contracts.REVIEW_QUEUE_SCHEMA_VERSION, extractionResultId: result.id, disposition: result.disposition, eligibility: "NOT-ELIGIBLE", reasonCode: eligibility.reasonCode });
      const key = `${record.extractionResultId}|${record.reasonCode}`;
      if (ineligible.has(key) && json.canonicalSerialize(ineligible.get(key)) !== json.canonicalSerialize(record)) throw new TypeError("Review Queue ineligibility identity collision");
      ineligible.set(key, record);
      return;
    }
    result.candidates.forEach(candidate => {
      const identity = { extractionResultId: result.id, candidateId: candidate.id };
      const entry = contracts.validateReviewQueueEntry({ schemaVersion: contracts.REVIEW_QUEUE_SCHEMA_VERSION, id: contracts.reviewQueueEntryId(identity), state: "QUEUED", batchId: result.batchId, targetId: result.targetId, targetWorkId: result.targetWorkId, sourceWorkItemId: result.sourceWorkItemId, attemptId: result.attemptId, prospectId: result.prospectId, artifactId: result.artifactId, extractionResultId: result.id, candidateId: candidate.id, adapterId: result.adapterId, adapterVersion: result.adapterVersion, candidate });
      if (entries.has(entry.id) && json.canonicalSerialize(entries.get(entry.id)) !== json.canonicalSerialize(entry)) throw new TypeError("Review Queue entry identity collision");
      entries.set(entry.id, entry);
    });
  });
  if (json.canonicalSerialize(extractionResults) !== before) throw new Error("Review Queue construction mutated extraction results");
  return contracts.validateReviewQueue({ schemaVersion: contracts.REVIEW_QUEUE_SCHEMA_VERSION, entries: [...entries.values()].sort((a, b) => a.id.localeCompare(b.id)), ineligible: [...ineligible.values()].sort((a, b) => `${a.extractionResultId}|${a.reasonCode}`.localeCompare(`${b.extractionResultId}|${b.reasonCode}`)) });
}

module.exports = Object.freeze({ classifyReviewEligibility, buildReviewQueue });
