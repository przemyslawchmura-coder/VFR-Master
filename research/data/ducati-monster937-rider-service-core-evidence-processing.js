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
    return factory.validateExtractionCandidate({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, id: factory.candidateId(candidateIdentity), ...identity, extractionResultId, fieldId: raw.canonicalFieldId, rawValue: raw.rawValue, rawUnit: null, sourceLocation, extractionMethod: raw.extractionMethod, applicability: raw.applicability, context: { printedPage: raw.printedPage, sourceId: raw.sourceId, documentId: raw.documentId, originalCandidateId: raw.id, sourceContext: raw.context }, ordinal: index + 1 });
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
    riderServiceCoreMatrix: Object.freeze({ schemaVersion: factory.RIDER_SERVICE_CORE_MATRIX.schemaVersion, domains: factory.RIDER_SERVICE_CORE_MATRIX.domains, fieldIds: factory.RIDER_SERVICE_CORE_MATRIX.fieldIds, fieldMap: factory.RIDER_SERVICE_CORE_MATRIX.fieldMap }),
    riderServiceCoreDomainCount: factory.RIDER_SERVICE_CORE_MATRIX.domains.length,
    legacyServiceCoreFieldCount: factory.LEGACY_SERVICE_CORE_FIELDS.length,
    canonicalServiceCoreFieldCount: factory.SERVICE_CORE_FIELDS.length,
    acceptedCandidatesReceived: acceptedCandidateIds.length,
    successfullyProcessed: processedOutcomes.length,
    processingContractBlocked: contractBlockedCandidateIds.length,
    validationFailures: 0,
    duplicatesOrCollisions: 0,
    processingReadyOutputs: processedOutcomes.filter(outcome => outcome.processingState === "ACCEPTED-FOR-PROCESSING").length,
    evidenceProcessingRecords: processed.records,
    outcomes,
    outputsByRiderServiceCoreDomain: Object.freeze({ basicMotorcycleData: countByPrefix("engine.") + countByPrefix("dimensions_mass.") + countByPrefix("steering_chassis.") + countByPrefix("fuel_intake.") + countByPrefix("transmission_clutch."), engineOilFilter: countByPrefix("lubrication."), cooling: 0, sparkPlugsIgnition: 0, valves: 0, wheelsTires: countByPrefix("tires_wheels."), finalDrive: countByPrefix("final_drive."), brakes: countByPrefix("brakes."), electricalBattery: outcomes.filter(outcome => outcome.canonicalFieldId === "electrical.alternator-output").length, fuses: outcomes.filter(outcome => outcome.canonicalFieldId.startsWith("electrical.") && outcome.canonicalFieldId.includes("fuse")).length, lighting: countByPrefix("lighting."), periodicMaintenance: countByPrefix("maintenance."), consumables: 0, practicalTorques: 0 }),
    maintenanceProcessing: Object.freeze({ acceptedInputs: countByPrefix("maintenance."), processingReady: countByPrefix("maintenance."), contractGap: null, structuredRepresentation: "repeating/structured raw candidates retain source action and interval text" }),
    fuseProcessing: Object.freeze({ acceptedInputs: countByPrefix("electrical.fuse"), processingReady: countByPrefix("electrical.fuse"), contractGap: null, associationRepresentation: "raw candidate retains amperage, protected function and box/location association" }),
    lightingProcessing: Object.freeze({ acceptedInputs: countByPrefix("lighting."), processingReady: countByPrefix("lighting."), contractGap: null, ledRepresentation: "raw candidate retains explicit LED/module wording without inferred socket or wattage" }),
    coolingCapacity: Object.freeze({ enteredProcessing: false, state: "BLOCKED", reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" }),
    excludedNeedsMoreReview: 5,
    productionDucatiChanged: false,
    productionDucatiEntryCount: 6,
    vfrChanged: false,
    evidenceRowsCreated: 0,
    serviceCoreCoverageChanged: false,
    rawValuesProvenanceApplicabilityPreserved: rawPreserved && rawSnapshot === factory.orchestrationJson.canonicalSerialize(acquisition.additionalCandidates),
    upstreamReviewStateChanged: false,
    newlyDiscoveredContractGaps: [],
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The shared factory now derives its accepted extraction field contract from the manufacturer-neutral 14-domain Rider Service Core matrix while retaining the legacy field set. All 39 existing Ducati ACCEPT decisions were derived exactly once and produced ACCEPTED-FOR-PROCESSING records; no schema-specific Ducati shortcut, evidence or production change was introduced." }),
    exactNextTask: "Keep the 39 Ducati processing records pre-promotion; separately authorize evidence/review progression and clarify the five deferred candidates without resolving cooling by inference."
  });
}

module.exports = Object.freeze({ identity, buildCanonicalInput, buildReport });
