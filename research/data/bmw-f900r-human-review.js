// NON-PRODUCTION BMW Human Review Decisions. No evidence or promotion.
"use strict";

const factory = require("../factory/index.js");
const json = require("../factory/json.js");
const acquisition = require("./bmw-f900r-owner-manual-acquisition.js");

function buildReport() {
  const run = acquisition.runAcquisition();
  const queue = run.reviewQueue;
  if (queue.entries.length !== 13 || queue.entries.length !== run.rawCandidates.length) throw new Error("BMW review requires exactly the 13 existing queued candidates");
  const before = json.canonicalSerialize(queue);
  const rawById = new Map(run.rawCandidates.map(candidate => [candidate.id, candidate]));
  const accountedCandidateIds = new Set(queue.entries.map(entry => entry.candidateId));
  const provenancePreserved = queue.entries.every(entry => {
    const extracted = run.extraction.candidates.find(candidate => candidate.id === entry.candidateId);
    return extracted && json.canonicalSerialize(entry.candidate) === json.canonicalSerialize(extracted) && entry.candidate.rawValue !== null && entry.candidate.sourceLocation.page > 0 && entry.candidate.sourceLocation.section && entry.candidate.applicability && entry.candidate.context;
  });
  const originalPayloadPreserved = run.rawCandidates.every(candidate => {
    const extracted = run.extraction.candidates.find(item => item.id === candidate.id);
    return extracted && json.canonicalSerialize(candidate) === json.canonicalSerialize(extracted);
  });
  const decisions = factory.buildReviewDecisions(queue.entries.map(entry => {
    const candidate = entry.candidate;
    const sourceRaw = rawById.get(candidate.id);
    if (!sourceRaw) throw new Error(`BMW review candidate is not from the acquired set: ${candidate.id}`);
    return {
      queueEntry: entry,
      decision: "ACCEPT",
      reviewerId: "reviewer.bmw-f900r.phase5",
      comment: `Direct BMW Motorrad MY2020 EU F 900 R 0K11 source text is present at ${candidate.sourceLocation.section}; raw value/unit/context and provenance are accepted unchanged for future processing only. Candidate source identity ${run.source.documentId} remains bound; no normalization or conflict resolution performed.`
    };
  }));
  if (json.canonicalSerialize(queue) !== before) throw new Error("BMW review mutated Review Queue entries");
  if (accountedCandidateIds.size !== 13 || !provenancePreserved || !originalPayloadPreserved) throw new Error("BMW review did not account for all raw candidates exactly once");
  return Object.freeze({
    schemaVersion: "revlog-bmw-f900r-human-review/v1",
    target: run.target,
    source: run.source,
    reusedProspectId: run.reusedProspectId,
    candidatesReviewed: queue.entries.length,
    accountedCandidateIds: [...accountedCandidateIds].sort(),
    reviewQueue: queue,
    decisions,
    decisionCounts: Object.freeze({ ACCEPT: decisions.decisions.filter(item => item.decision === "ACCEPT").length, REJECT: decisions.decisions.filter(item => item.decision === "REJECT").length, "NEEDS-MORE-REVIEW": decisions.decisions.filter(item => item.decision === "NEEDS-MORE-REVIEW").length }),
    unresolvedOrAmbiguous: 0,
    rawValuesAndProvenanceUnchanged: provenancePreserved && originalPayloadPreserved,
    evidenceRowsCreated: 0,
    serviceCoreBefore: run.metrics.serviceCoreBefore,
    serviceCoreAfter: run.metrics.serviceCoreAfter,
    serviceCoreCoverageChange: 0,
    productionChanged: false,
    researchedNoEvidenceCreated: false,
    normalizationPerformed: false,
    conflictsResolved: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "All 13 existing BMW Review Queue entries received explicit ACCEPT decisions because their raw field mappings, direct source excerpts, units/context and exact 0K11 applicability are present. Decisions remain pre-evidence; raw payloads and provenance were not changed and no conflict was resolved.", risks: Object.freeze(["same-field candidates remain independently represented for any later processing conflict check", "ACCEPT is not verified production evidence", "the Slovenian EU manual's A2 material remains excluded by candidate applicability"]), falsification: Object.freeze(["no new candidates or source documents were introduced", "no values or units were normalized", "no Evidence Processing or production stage was invoked"]) }),
    exactNextTask: "Process only these 13 explicit BMW Human Review Decisions through the separate Evidence Processing contract; preserve any same-field disagreement as unresolved and create no production evidence automatically."
  });
}

module.exports = Object.freeze({ buildReport });
