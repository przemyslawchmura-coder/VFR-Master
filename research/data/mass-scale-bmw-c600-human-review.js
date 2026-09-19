// NON-PRODUCTION bounded Human Review for the existing 24 BMW C 600 Sport raw candidates.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const rawReport = require("../reports/mass-scale-bmw-c600-raw-extraction.json");

const REVIEWER_ID = "reviewer.bmw-c600.phase5";
const RESULT_GROUPS = new Map();
for (const candidate of rawReport.rawCandidates) {
  const group = RESULT_GROUPS.get(candidate.extractionResultId) || [];
  group.push(candidate);
  RESULT_GROUPS.set(candidate.extractionResultId, group);
}

function buildExtractionResults() {
  return [...RESULT_GROUPS.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([extractionResultId, candidates]) => {
    const first = candidates[0];
    return factory.validateExtractionResult({
      schemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
      id: extractionResultId,
      batchId: first.batchId,
      targetId: first.targetId,
      targetWorkId: first.targetWorkId,
      sourceWorkItemId: first.sourceWorkItemId,
      attemptId: first.attemptId,
      prospectId: first.prospectId,
      artifactId: first.artifactId,
      adapterId: first.adapterId,
      adapterVersion: first.adapterVersion,
      disposition: "CANDIDATES-PRODUCED",
      candidates: candidates.slice().sort((a, b) => a.id.localeCompare(b.id)),
      observations: [{ type: "CANDIDATE-EXTRACTED", detailCode: "BMW_C600_RAW_CANDIDATES_REVIEWED", metadata: { candidateCount: candidates.length } }]
    });
  });
}

function reviewComment(candidate) {
  const condition = candidate.context && candidate.context.condition;
  const conditionText = condition ? ` Conditional applicability preserved exactly: ${condition}.` : "";
  return `Direct BMW C 600 Sport MY2012 USA rider-manual text is present at ${candidate.sourceLocation.section}; accept the raw value, source location, provenance and bounded applicability unchanged for future evidence processing only.${conditionText} No normalization, conflict resolution or production promotion performed.`;
}

function buildReview() {
  const extractionResults = buildExtractionResults();
  const queue = factory.buildReviewQueue(extractionResults);
  if (queue.entries.length !== rawReport.rawCandidateCount) throw new Error("BMW Human Review scope is not exactly the 24 existing raw candidates");
  const decisions = factory.buildReviewDecisions(queue.entries.map(entry => ({ queueEntry: entry, decision: "ACCEPT", reviewerId: REVIEWER_ID, comment: reviewComment(entry.candidate) })));
  return { extractionResults, queue, decisions };
}

function buildReport() {
  const review = buildReview();
  const rawById = new Map(rawReport.rawCandidates.map(candidate => [candidate.id, candidate]));
  const accounted = review.queue.entries.map(entry => entry.candidateId).sort();
  const rawValuesAndProvenanceUnchanged = review.queue.entries.every(entry => {
    const raw = rawById.get(entry.candidateId);
    return raw && json.canonicalSerialize(raw) === json.canonicalSerialize(entry.candidate);
  });
  const conditionalCandidateIds = rawReport.rawCandidates.filter(candidate => candidate.context && candidate.context.condition).map(candidate => candidate.id).sort();
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-human-review/v1",
    targetId: rawReport.targetId,
    catalogVariantKey: rawReport.catalogVariantKey,
    year: rawReport.year,
    sourceProspectId: rawReport.sourceProspectId,
    artifact: rawReport.artifact,
    candidatesReviewed: review.queue.entries.length,
    accountedCandidateIds: accounted,
    reviewQueue: review.queue,
    decisions: review.decisions,
    decisionCounts: Object.freeze({ ACCEPT: review.decisions.decisions.filter(item => item.decision === "ACCEPT").length, REJECT: 0, "NEEDS-MORE-REVIEW": 0 }),
    conditionalCandidateIds,
    rejectedOrBlockedCandidateIds: [],
    rawValuesAndProvenanceUnchanged,
    evidenceRowsCreated: 0,
    productionChanged: false,
    catalogueChanged: false,
    registryChanged: false,
    serviceCoreBefore: 0,
    serviceCoreAfter: 0,
    serviceCoreCoverageChange: 0,
    normalizationPerformed: false,
    conflictsResolved: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "All 24 existing BMW C 600 Sport raw candidates received explicit pre-evidence ACCEPT decisions because each retains direct authenticated manual support, source location, exact raw value and bounded applicability. Conditional rows remain conditional; no evidence, conflict resolution or production promotion occurred.", risks: Object.freeze(["ACCEPT is pre-evidence and does not imply verified production evidence", "same-field capacity candidates remain independently represented for later processing", "loaded/single-rider and optional LED conditions remain bounded to their raw context"]), falsification: Object.freeze(["no new candidate or source was introduced", "no value or unit was normalized", "no review decision was created for excluded blocked fields", "no evidence, promotion or production stage was invoked"]) }),
    exactNextTask: "Process only these 24 explicit BMW C 600 Sport Human Review Decisions through the separate Evidence Processing contract; preserve conditional rows and create no production state automatically."
  });
}

module.exports = Object.freeze({ REVIEWER_ID, buildExtractionResults, buildReview, buildReport });
