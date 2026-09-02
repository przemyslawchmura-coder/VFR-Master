// NON-PRODUCTION deterministic report for the raw Extraction Agent boundary.
"use strict";

const factory = require("../factory/index.js");
const planner = require("./technical-research-factory-execution-planner.js").buildReport();

const CONTENT = "oil specification=SAE 10W-30\ncapacity filter=3.1 L";
const known = values => ({ state: "KNOWN", values });
function syntheticTarget() {
  return factory.validateResearchTarget({ schemaVersion: 1, id: "target.planner.synthetic.2021.eu", catalogVariantKey: "planner.synthetic", manufacturer: "Synthetic", family: "Planner Fixture", scope: { schemaVersion: 1, model: known(["planner.synthetic"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]) }, sourcePriorityPolicyId: "planner-report-v1", serviceCoreBaseline: { verified: 41, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE" });
}

function buildFixture() {
  const planBatch = planner.batches[0];
  const work = planBatch.sourceWorkItems[0];
  const digest = factory.sha256(CONTENT);
  const adapter = Object.freeze({ adapterId: "synthetic.extraction-report-source", adapterVersion: "1", supportedOperations: [work.operation], supportedSourceClasses: ["*"], authenticationRequired: false, networkRequired: false, execute(request) {
    const artifact = { prospectId: request.prospectId, attemptId: request.attemptId, mediaType: "text/plain", byteLength: Buffer.byteLength(CONTENT, "utf8"), contentDigest: digest, originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://extraction-report", metadata: {} };
    artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator });
    return factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_ARTIFACT_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_EXTRACTION_REPORT_FIXTURE" }], artifact });
  } });
  const acquired = factory.executeAttempt(factory.bootstrap(planBatch), work, adapter);
  const artifact = acquired.result.outcome.artifact;
  const envelope = factory.validateArtifactContentEnvelope({ schemaVersion: 1, artifactId: artifact.id, mediaType: artifact.mediaType, byteLength: artifact.byteLength, contentDigest: artifact.contentDigest, contentEncoding: "utf8", content: CONTENT });
  return { planBatch, work, acquired, artifact, envelope, target: syntheticTarget() };
}

function run(fixture, name) {
  return factory.extractRawCandidates({ executionResult: fixture.acquired.result, events: fixture.acquired.events, researchTarget: fixture.target, contentEnvelope: fixture.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters[name] });
}

function buildReport() {
  const fixture = buildFixture();
  const produced = run(fixture, "candidates");
  const dispositions = Object.fromEntries(["candidates", "none", "unsupportedMedia", "unmapped", "parseFailure", "permanent"].map(name => [name, run(fixture, name).disposition]));
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-extraction-agent/v1", extractionSchemaVersion: factory.EXTRACTION_SCHEMA_VERSION, executionSchemaVersion: factory.EXECUTION_SCHEMA_VERSION, operation: factory.EXTRACTION_OPERATION, dispositions: factory.EXTRACTION_DISPOSITIONS, syntheticAdapters: Object.keys(factory.extractionAdapters.syntheticExtractorAdapters).sort(), examples: dispositions, successfulCandidateFields: produced.candidates.map(item => item.fieldId), provenance: { batchViaTargetWork: produced.batchId === fixture.planBatch.targetWorks[0].batchId, targetViaTargetWork: produced.targetId === fixture.planBatch.targetWorks[0].targetId, sourceWorkHasNoBatchId: !Object.prototype.hasOwnProperty.call(fixture.work, "batchId"), artifactBound: produced.candidates.every(item => item.artifactId === fixture.artifact.id), attemptBound: produced.candidates.every(item => item.attemptId === fixture.artifact.attemptId), prospectBound: produced.candidates.every(item => item.prospectId === fixture.work.prospectId) }, safety: { rawOnly: produced.candidates.every(item => !Object.prototype.hasOwnProperty.call(item, "normalizedValue") && !Object.prototype.hasOwnProperty.call(item, "proofStatus")), acquisitionEventsAdded: 0, acquisitionAttemptsConsumed: 0, reviewQueueStarted: false, evidenceAdded: false, researchedNoEvidenceAdded: false, productionChanged: false, networkUsed: false }, audit: { classification: "ACCEPT-WITH-RISKS", risks: ["only deterministic utf8 local content is materialized", "normalization and review remain separate future layers", "extraction output persistence remains caller-owned"] } });
}

module.exports = Object.freeze({ buildReport });
