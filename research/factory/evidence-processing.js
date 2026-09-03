// NON-PRODUCTION pure deterministic pre-promotion evidence-processing projection.
"use strict";

const decisionContracts = require("./review-decision-contracts.js");
const queueContracts = require("./review-queue-contracts.js");
const contracts = require("./evidence-processing-contracts.js");
const json = require("./json.js");

const buildEvidenceProcessing = ({ decisions, queueEntries }) => {
  if (!Array.isArray(decisions) || !Array.isArray(queueEntries)) throw new TypeError("Evidence processing requires decisions and queue entries arrays");
  const before = json.canonicalSerialize({ decisions, queueEntries });
  const entries = new Map();
  queueEntries.forEach(entry => {
    const valid = queueContracts.validateReviewQueueEntry(entry);
    const existing = entries.get(valid.id);
    if (existing && json.canonicalSerialize(existing) !== json.canonicalSerialize(valid)) throw new TypeError("conflicting duplicate queue entry identity");
    entries.set(valid.id, valid);
  });
  const recordsByDecision = new Map();
  decisions.forEach(input => {
    const decision = decisionContracts.validateReviewDecision(input);
    const entry = entries.get(decision.queueEntryId);
    if (!entry) {
      const id = contracts.evidenceProcessingId({ decisionId: decision.id, queueEntryId: decision.queueEntryId, state: "INELIGIBLE" });
      recordsByDecision.set(decision.id, { schemaVersion: contracts.EVIDENCE_PROCESSING_SCHEMA_VERSION, id, state: "INELIGIBLE", reasonCode: "MISSING-QUEUE-ENTRY", decisionId: decision.id, queueEntryId: decision.queueEntryId, extractionResultId: decision.extractionResultId, candidateId: decision.candidateId, batchId: decision.batchId, targetId: decision.targetId, targetWorkId: decision.targetWorkId, sourceWorkItemId: decision.sourceWorkItemId, attemptId: decision.attemptId, prospectId: decision.prospectId, artifactId: decision.artifactId, adapterId: decision.adapterId, adapterVersion: decision.adapterVersion, candidate: null });
      return;
    }
    decisionContracts.validateDecisionAgainstQueueEntry(decision, entry);
    const state = decision.decision === "ACCEPT" ? "ACCEPTED-FOR-PROCESSING" : decision.decision === "REJECT" ? "REJECTED-CANDIDATE" : "NEEDS-MORE-REVIEW";
    const reasonCode = decision.decision === "ACCEPT" ? "ACCEPTED-DECISION" : decision.decision === "REJECT" ? "REJECTED-BY-REVIEW" : "REVIEW-DEFERRED";
    const candidate = entry.candidate;
    recordsByDecision.set(decision.id, { schemaVersion: contracts.EVIDENCE_PROCESSING_SCHEMA_VERSION, id: contracts.evidenceProcessingId({ decisionId: decision.id, queueEntryId: entry.id, state }), state, reasonCode, decisionId: decision.id, queueEntryId: entry.id, extractionResultId: entry.extractionResultId, candidateId: entry.candidateId, batchId: entry.batchId, targetId: entry.targetId, targetWorkId: entry.targetWorkId, sourceWorkItemId: entry.sourceWorkItemId, attemptId: entry.attemptId, prospectId: entry.prospectId, artifactId: entry.artifactId, adapterId: entry.adapterId, adapterVersion: entry.adapterVersion, candidate });
  });
  const accepted = [...recordsByDecision.values()].filter(record => record.state === "ACCEPTED-FOR-PROCESSING");
  const groups = new Map();
  accepted.forEach(record => { const key = `${record.targetId}|${record.targetWorkId}|${record.candidate.fieldId}`; const list = groups.get(key) || []; list.push(record); groups.set(key, list); });
  groups.forEach(list => {
    const distinctRaw = new Set(list.map(record => json.canonicalSerialize({ rawValue: record.candidate.rawValue, rawUnit: record.candidate.rawUnit }))).size > 1;
    if (distinctRaw) list.forEach(record => { record.state = "CANNOT-ADVANCE"; record.reasonCode = "UNRESOLVED-CANDIDATE-CONFLICT"; record.id = contracts.evidenceProcessingId({ decisionId: record.decisionId, queueEntryId: record.queueEntryId, state: record.state }); });
  });
  if (json.canonicalSerialize({ decisions, queueEntries }) !== before) throw new Error("Evidence processing mutated inputs");
  return contracts.validateEvidenceProcessingSet({ schemaVersion: contracts.EVIDENCE_PROCESSING_SCHEMA_VERSION, records: [...recordsByDecision.values()].sort((a, b) => a.id.localeCompare(b.id)) });
};

module.exports = Object.freeze({ buildEvidenceProcessing });
