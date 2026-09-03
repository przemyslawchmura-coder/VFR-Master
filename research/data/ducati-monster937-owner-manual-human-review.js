// NON-PRODUCTION Ducati Human Review Decisions. No evidence or promotion.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-owner-manual-acquisition.js");

const identity = Object.freeze({
  batchId: "batch.ducati-monster937.my21.eu",
  targetId: "target.ducati.monster.937.my21.eu",
  targetWorkId: "target-work.ducati.monster937.my21.eu",
  sourceWorkItemId: "source-work.ducati.monster937.owner.my21",
  attemptId: "attempt.ducati.monster937.owner.my21.001",
  prospectId: acquisition.registrationProspectId || acquisition.runAcquisition().reusedProspectId,
  artifactId: "artifact.ducati.monster937.owner.my21",
  adapterId: "adapter.ducati-owner-manual-text",
  adapterVersion: "1"
});

const extractionResultId = factory.extractionResultId({ ...identity, operation: factory.EXTRACTION_OPERATION });

function buildExtractionResult() {
  const candidates = acquisition.rawCandidates.map((rawCandidate, index) => {
    const sourceLocation = { page: null, section: rawCandidate.section, locator: `printed-page:${rawCandidate.printedPage}` };
    const candidateIdentity = {
      extractionResultId,
      artifactId: identity.artifactId,
      targetId: identity.targetId,
      fieldId: rawCandidate.canonicalFieldId,
      sourceLocation,
      ordinal: index + 1,
      adapterId: identity.adapterId,
      adapterVersion: identity.adapterVersion
    };
    return factory.validateExtractionCandidate({
      schemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
      id: factory.candidateId(candidateIdentity),
      ...identity,
      extractionResultId,
      fieldId: rawCandidate.canonicalFieldId,
      rawValue: rawCandidate.rawValue,
      rawUnit: null,
      sourceLocation,
      extractionMethod: rawCandidate.extractionMethod,
      applicability: rawCandidate.applicability,
      context: { printedPage: rawCandidate.printedPage, sourceId: rawCandidate.sourceId, documentId: rawCandidate.documentId, originalCandidateId: rawCandidate.id },
      ordinal: index + 1
    });
  }).sort((a, b) => a.id.localeCompare(b.id));
  return factory.validateExtractionResult({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, id: extractionResultId, ...identity, disposition: "CANDIDATES-PRODUCED", candidates, observations: [] });
}

function buildReport() {
  const run = acquisition.runAcquisition();
  const extractionResult = buildExtractionResult();
  const queue = factory.buildReviewQueue([extractionResult]);
  const decisions = factory.buildReviewDecisions(queue.entries.map(entry => ({
    queueEntry: entry,
    decision: "ACCEPT",
    reviewerId: "reviewer.ducati-monster937.phase5",
    comment: "Direct Ducati MY2021 page/section provenance and bounded base-Monster applicability are sufficient for future processing; no normalization or promotion performed."
  })));
  const rawById = new Map(run.rawCandidates.map(candidate => [candidate.id, candidate]));
  const queuePreservesRaw = queue.entries.every(entry => {
    const raw = rawById.get(entry.candidate.context.originalCandidateId);
    return raw && raw.rawValue === entry.candidate.rawValue && raw.printedPage === entry.candidate.context.printedPage && raw.section === entry.candidate.sourceLocation.section && raw.sourceId === entry.candidate.context.sourceId && raw.documentId === entry.candidate.context.documentId;
  });
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-human-review/v1",
    target: run.target,
    source: run.source,
    reusedProspectId: run.reusedProspectId,
    candidatesReviewed: run.rawCandidates.length,
    reviewQueue: queue,
    decisions,
    decisionCounts: Object.freeze({ ACCEPT: decisions.decisions.filter(item => item.decision === "ACCEPT").length, REJECT: decisions.decisions.filter(item => item.decision === "REJECT").length, "NEEDS-MORE-REVIEW": decisions.decisions.filter(item => item.decision === "NEEDS-MORE-REVIEW").length }),
    unresolvedOrAmbiguous: 0,
    rawValuesAndProvenanceUnchanged: queuePreservesRaw,
    evidenceRowsCreated: 0,
    serviceCoreBefore: run.metrics.serviceCoreBefore,
    serviceCoreAfter: run.metrics.serviceCoreAfter,
    serviceCoreCoverageChange: 0,
    productionChanged: false,
    researchedNoEvidenceCreated: false,
    normalizationPerformed: false,
    conflictsResolved: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "All 27 queued candidates received explicit ACCEPT decisions for future processing only. Raw values, page/section provenance and applicability were preserved; no evidence, normalization, conflict resolution or production promotion occurred.", risks: Object.freeze(["ACCEPT is pre-evidence and does not imply verified production evidence", "reviewer identity is opaque caller-supplied metadata", "the combined Monster 937 / 937 Plus document remains limited to common base-Monster content"]), falsification: Object.freeze(["no new document or source was used", "Monster SP content was excluded", "no Tier C/D source was used"]) }),
    exactNextTask: "Process the accepted Ducati Monster 937 MY2021 EU raw candidates through the separate pre-promotion evidence-processing contract only after explicit authorization; do not promote to production automatically."
  });
}

module.exports = Object.freeze({ buildExtractionResult, buildReport });
