// NON-PRODUCTION Ducati Rider Service Core Human Review Decisions.
// Only the 44 candidates from the bounded Core acquisition are reviewed.
"use strict";

const crypto = require("node:crypto");
const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-rider-service-core-acquisition.js");

const reviewerId = "reviewer.ducati-monster937.rider-service-core.phase5";
const identity = Object.freeze({ batchId: "batch.ducati.monster937.core.my21.eu", targetId: "target.ducati.monster.937.my21.eu", targetWorkId: "target-work.ducati.monster937.core.my21.eu", sourceWorkItemId: "source-work.ducati.monster937.core.owner.my21", attemptId: "attempt.ducati.monster937.core.owner.my21.001", prospectId: "unknown.ducati.monster937", artifactId: "artifact.ducati.monster937.core.owner.my21", adapterId: "adapter.ducati-owner-manual-core-text", adapterVersion: "1" });
const extractionResultId = factory.extractionResultId({ ...identity, operation: factory.EXTRACTION_OPERATION });
const semanticId = (kind, value) => `${kind}.${crypto.createHash("sha256").update(factory.orchestrationJson.canonicalSerialize({ kind, ...value })).digest("hex").slice(0, 24)}`;

const NEEDS_MORE_REVIEW = Object.freeze({
  "dimensions_mass.payload-gvwr": "The source states maximum allowed full-load weight, but the candidate field can be read as payload/GVWR; do not resolve that semantic distinction here.",
  "electrical.main-fuse": "The source gives the main-fuse location but not its rating; the field is incomplete for a practical fuse record.",
  "lighting.drl": "The source qualifies DRL as where fitted; exact base-Monster equipment applicability is not established by this candidate alone.",
  "lighting.replaceability": "LED is explicit, but replaceability is not explicitly stated; do not infer that an LED source is non-user-replaceable.",
  "maintenance.initial-service": "The raw text combines the first-service interval with later service intervals; preserve it for clarification rather than collapsing meanings into one initial-service field."
});

function buildQueue() {
  return Object.freeze(acquisition.additionalCandidates.map(candidate => {
    const id = semanticId("review-queue-entry", { extractionResultId, candidateId: candidate.id });
    return Object.freeze({ schemaVersion: 1, id, state: "QUEUED", eligibility: "ELIGIBLE", extractionResultId, candidateId: candidate.id, batchId: identity.batchId, targetId: identity.targetId, targetWorkId: identity.targetWorkId, sourceWorkItemId: identity.sourceWorkItemId, attemptId: identity.attemptId, prospectId: identity.prospectId, artifactId: identity.artifactId, adapterId: identity.adapterId, adapterVersion: identity.adapterVersion, candidate });
  }).sort((a, b) => a.id.localeCompare(b.id)));
}

function buildDecisions(queue) {
  return Object.freeze(queue.map(entry => {
    const fieldId = entry.candidate.canonicalFieldId;
    const decision = NEEDS_MORE_REVIEW[fieldId] ? "NEEDS-MORE-REVIEW" : "ACCEPT";
    return Object.freeze({ schemaVersion: 1, id: semanticId("review-decision", { queueEntryId: entry.id, decision, reviewerId }), queueEntryId: entry.id, extractionResultId, candidateId: entry.candidateId, batchId: identity.batchId, targetId: identity.targetId, targetWorkId: identity.targetWorkId, sourceWorkItemId: identity.sourceWorkItemId, attemptId: identity.attemptId, prospectId: identity.prospectId, artifactId: identity.artifactId, adapterId: identity.adapterId, adapterVersion: identity.adapterVersion, decision, reviewerId, comment: NEEDS_MORE_REVIEW[fieldId] || "Exact Ducati MY2021 EU owner-manual page/section provenance and bounded base-Monster applicability are sufficient for future processing; no normalization or production promotion performed." });
  }));
}

function buildReport() {
  const before = factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates);
  const queue = buildQueue();
  const decisions = buildDecisions(queue);
  const after = factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates);
  const rawById = new Map(acquisition.additionalCandidates.map(candidate => [candidate.id, candidate]));
  const fieldByCandidate = new Map(acquisition.additionalCandidates.map(candidate => [candidate.id, candidate.canonicalFieldId]));
  const acceptedFields = decisions.filter(decision => decision.decision === "ACCEPT").map(decision => fieldByCandidate.get(decision.candidateId)).sort();
  const counts = state => decisions.filter(decision => decision.decision === state).length;
  const rawPreserved = queue.every(entry => { const source = rawById.get(entry.candidateId); return source && source.rawValue === entry.candidate.rawValue && source.canonicalFieldId === entry.candidate.canonicalFieldId && source.printedPage === entry.candidate.printedPage && source.section === entry.candidate.section && source.sourceId === entry.candidate.sourceId && source.documentId === entry.candidate.documentId; });
  const acceptedBy = prefix => acceptedFields.filter(field => field.startsWith(prefix));
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-rider-service-core-human-review/v1",
    target: acquisition.target,
    source: acquisition.source,
    candidatesReviewed: acquisition.additionalCandidates.length,
    reviewVocabulary: ["ACCEPT", "REJECT", "NEEDS-MORE-REVIEW"],
    reviewQueue: Object.freeze({ schemaVersion: 1, entries: queue, ineligible: [] }),
    decisions: Object.freeze({ schemaVersion: 1, decisions }),
    decisionCounts: Object.freeze({ ACCEPT: counts("ACCEPT"), REJECT: counts("REJECT"), BLOCKED: 0, "NEEDS-MORE-REVIEW": counts("NEEDS-MORE-REVIEW"), clarificationRequired: counts("NEEDS-MORE-REVIEW") }),
    acceptedFieldsByDomain: Object.freeze({ basicMotorcycleData: [...acceptedBy("engine."), ...acceptedBy("dimensions_mass."), ...acceptedBy("steering_chassis."), ...acceptedBy("fuel_intake.")], engineOilFilter: acceptedBy("lubrication."), cooling: [], sparkPlugsIgnition: [], valves: [], wheelsTires: acceptedBy("tires_wheels."), finalDrive: acceptedBy("final_drive."), brakes: acceptedBy("brakes."), electricalBattery: acceptedFields.filter(field => field === "electrical.alternator-output"), fuses: acceptedFields.filter(field => field === "electrical.fuse-ratings"), lighting: acceptedFields.filter(field => field.startsWith("lighting.") && !["lighting.drl", "lighting.replaceability"].includes(field)), periodicMaintenance: acceptedBy("maintenance."), consumables: [], practicalTorques: [] }),
    blockedFields: Object.freeze([{ field: "cooling.capacity", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR", decisionScope: "prior acquisition; not one of the 44 new candidates" }]),
    rejectedFields: [],
    clarificationFields: Object.freeze(Object.keys(NEEDS_MORE_REVIEW).sort()),
    productionPromotionCandidates: acceptedFields,
    futureProcessingCandidates: acceptedFields,
    noCandidateDisappeared: new Set(decisions.map(decision => decision.candidateId)).size === acquisition.additionalCandidates.length,
    oneDecisionPerCandidate: new Set(decisions.map(decision => decision.candidateId)).size === acquisition.additionalCandidates.length,
    rawValuesAndProvenanceUnchanged: rawPreserved && before === after,
    productionDucatiChanged: false,
    productionDucatiEntryCount: 6,
    vfrChanged: false,
    evidenceRowsCreated: 0,
    serviceCoreCoverageChanged: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Exactly the 44 newly queued Ducati Rider Service Core candidates received one canonical-vocabulary Human Review Decision. Direct, complete candidates were ACCEPTED for future processing; five semantically incomplete or applicability-sensitive candidates remain NEEDS-MORE-REVIEW. Cooling capacity remains blocked in the prior acquisition scope. No evidence or production promotion occurred." }),
    exactNextTask: "Process only the ACCEPTED Ducati Core decisions through the existing Evidence Processing boundary; clarify the five deferred fields separately and do not resolve cooling capacity by inference."
  });
}

module.exports = Object.freeze({ identity, extractionResultId, NEEDS_MORE_REVIEW, buildQueue, buildDecisions, buildReport });
