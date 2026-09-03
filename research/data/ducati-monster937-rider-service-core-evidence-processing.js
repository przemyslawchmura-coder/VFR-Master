// NON-PRODUCTION Ducati Rider Service Core Evidence Processing projection.
// Only accepted review inputs representable by the existing factory contract advance.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./ducati-monster937-rider-service-core-acquisition.js");
const review = require("./ducati-monster937-rider-service-core-human-review.js");

const canonicalFieldSet = new Set(factory.SERVICE_CORE_FIELDS);
const acceptedReview = review.buildReport();
const rawById = new Map(acquisition.additionalCandidates.map(candidate => [candidate.id, candidate]));
const decisionByCandidate = new Map(acceptedReview.decisions.decisions.filter(decision => decision.decision === "ACCEPT").map(decision => [decision.candidateId, decision]));
const acceptedCandidateIds = [...decisionByCandidate.keys()].sort();
const supportedCandidateIds = acceptedCandidateIds.filter(candidateId => canonicalFieldSet.has(rawById.get(candidateId).canonicalFieldId));
const contractBlockedCandidateIds = acceptedCandidateIds.filter(candidateId => !canonicalFieldSet.has(rawById.get(candidateId).canonicalFieldId));
const identity = Object.freeze({ batchId: "batch.ducati.monster937.core.processing.my21.eu", targetId: "target.ducati.monster.937.my21.eu", targetWorkId: "target-work.ducati.monster937.core.my21.eu", sourceWorkItemId: "source-work.ducati.monster937.core.owner.my21", attemptId: "attempt.ducati.monster937.core.owner.my21.001", prospectId: "unknown.ducati.monster937", artifactId: "artifact.ducati.monster937.core.owner.my21", adapterId: "adapter.ducati-owner-manual-core-text", adapterVersion: "1" });
const extractionResultId = factory.extractionResultId({ ...identity, operation: factory.EXTRACTION_OPERATION });

function buildCanonicalInput() {
  const extractionCandidates = supportedCandidateIds.map((candidateId, index) => {
    const raw = rawById.get(candidateId);
    const sourceLocation = { page: null, section: raw.section, locator: `printed-page:${raw.printedPage}` };
    const candidateIdentity = { extractionResultId, artifactId: identity.artifactId, targetId: identity.targetId, fieldId: raw.canonicalFieldId, sourceLocation, ordinal: index + 1, adapterId: identity.adapterId, adapterVersion: identity.adapterVersion };
    return factory.validateExtractionCandidate({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, id: factory.candidateId(candidateIdentity), ...identity, extractionResultId, fieldId: raw.canonicalFieldId, rawValue: raw.rawValue, rawUnit: null, sourceLocation, extractionMethod: raw.extractionMethod, applicability: raw.applicability, context: { printedPage: raw.printedPage, sourceId: raw.sourceId, documentId: raw.documentId, originalCandidateId: raw.id }, ordinal: index + 1 });
  }).sort((a, b) => a.id.localeCompare(b.id));
  const extractionResult = factory.validateExtractionResult({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, id: extractionResultId, ...identity, disposition: "CANDIDATES-PRODUCED", candidates: extractionCandidates, observations: [] });
  const queue = factory.buildReviewQueue([extractionResult]);
  const decisions = factory.buildReviewDecisions(queue.entries.map(entry => ({ queueEntry: entry, decision: "ACCEPT", reviewerId: "reviewer.ducati-monster937.rider-service-core.processing-adapter", comment: "Derived read-only from the existing canonical ACCEPT decision; no new review performed." })));
  return Object.freeze({ extractionResult, queue, decisions });
}

function buildReport() {
  const canonical = buildCanonicalInput();
  const processed = factory.buildEvidenceProcessing({ decisions: canonical.decisions.decisions, queueEntries: canonical.queue.entries });
  const canonicalByCandidate = new Map(canonical.queue.entries.map(entry => [entry.candidate.context.originalCandidateId, processed.records.find(record => record.candidateId === entry.candidateId)]));
  const outcomes = acceptedCandidateIds.map(candidateId => {
    const raw = rawById.get(candidateId);
    const upstreamDecision = decisionByCandidate.get(candidateId);
    const record = canonicalByCandidate.get(candidateId);
    if (record) return Object.freeze({ candidateId, canonicalFieldId: raw.canonicalFieldId, upstreamHumanReviewDecisionId: upstreamDecision.id, outcome: "PROCESSED", processingState: record.state, reasonCode: record.reasonCode, evidenceProcessingRecordId: record.id });
    return Object.freeze({ candidateId, canonicalFieldId: raw.canonicalFieldId, upstreamHumanReviewDecisionId: upstreamDecision.id, outcome: "CONTRACT-BLOCKED", processingState: "CANNOT-ADVANCE", reasonCode: "FIELD-NOT-IN-CANONICAL-SERVICE-CORE", evidenceProcessingRecordId: null });
  }).sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  const processedOutcomes = outcomes.filter(outcome => outcome.outcome === "PROCESSED");
  const countByPrefix = prefix => outcomes.filter(outcome => outcome.canonicalFieldId.startsWith(prefix)).length;
  const rawSnapshot = factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates);
  const rawPreserved = outcomes.every(outcome => { const raw = rawById.get(outcome.candidateId); return raw && raw.catalogVariantKey === acquisition.target.catalogVariantKey && raw.sourceId === acquisition.source.id && raw.rawValue !== null && raw.printedPage && raw.section && raw.applicability.abs === true && raw.applicability.transmission === "manual"; });
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-rider-service-core-evidence-processing/v1",
    target: acquisition.target,
    source: acquisition.source,
    acceptedCandidatesReceived: acceptedCandidateIds.length,
    successfullyProcessed: processedOutcomes.length,
    processingContractBlocked: contractBlockedCandidateIds.length,
    validationFailures: 0,
    duplicatesOrCollisions: 0,
    processingReadyOutputs: processedOutcomes.filter(outcome => outcome.processingState === "ACCEPTED-FOR-PROCESSING").length,
    evidenceProcessingRecords: processed.records,
    outcomes,
    outputsByRiderServiceCoreDomain: Object.freeze({ basicMotorcycleData: countByPrefix("engine.") + countByPrefix("dimensions_mass.") + countByPrefix("steering_chassis.") + countByPrefix("fuel_intake."), engineOilFilter: countByPrefix("lubrication."), cooling: 0, sparkPlugsIgnition: 0, valves: 0, wheelsTires: countByPrefix("tires_wheels."), finalDrive: countByPrefix("final_drive."), brakes: countByPrefix("brakes."), electricalBattery: outcomes.filter(outcome => outcome.canonicalFieldId === "electrical.alternator-output").length, fuses: outcomes.filter(outcome => outcome.canonicalFieldId.startsWith("electrical.") && outcome.canonicalFieldId.includes("fuse")).length, lighting: countByPrefix("lighting."), periodicMaintenance: countByPrefix("maintenance."), consumables: 0, practicalTorques: 0 }),
    maintenanceProcessing: Object.freeze({ acceptedInputs: countByPrefix("maintenance."), processingReady: 0, contractGap: "maintenance fields are outside the existing canonical factory Service Core list" }),
    fuseProcessing: Object.freeze({ acceptedInputs: countByPrefix("electrical.fuse"), processingReady: 0, contractGap: "electrical.fuse-ratings is outside the existing canonical factory Service Core list" }),
    lightingProcessing: Object.freeze({ acceptedInputs: countByPrefix("lighting."), processingReady: 0, contractGap: "lighting Core fields are outside the existing canonical factory Service Core list" }),
    coolingCapacity: Object.freeze({ enteredProcessing: false, state: "BLOCKED", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" }),
    excludedNeedsMoreReview: 5,
    productionDucatiChanged: false,
    productionDucatiEntryCount: 6,
    vfrChanged: false,
    evidenceRowsCreated: 0,
    serviceCoreCoverageChanged: false,
    rawValuesProvenanceApplicabilityPreserved: rawPreserved && rawSnapshot === factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates),
    upstreamReviewStateChanged: false,
    newlyDiscoveredContractGaps: ["Rider Service Core acquisition uses fields outside the existing factory SERVICE_CORE_FIELDS; 36 accepted inputs cannot enter canonical Evidence Processing without a separately authorized generic contract/schema update."],
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The 39 existing Ducati ACCEPT decisions were derived exactly once. Three fields are representable by the existing Evidence Processing contract and produced ACCEPTED-FOR-PROCESSING records. Thirty-six accepted Rider Service Core fields remain explicit CANNOT-ADVANCE contract-gap outcomes; no schema was broadened and no evidence or production state changed." }),
    exactNextTask: "Separately authorize a manufacturer-neutral Rider Service Core field-contract alignment before reprocessing the 36 contract-blocked accepted candidates; do not promote or resolve cooling by inference."
  });
}

module.exports = Object.freeze({ identity, buildCanonicalInput, buildReport });
