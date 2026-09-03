// NON-PRODUCTION deterministic design fixture for the future Ténéré pilot.
"use strict";

const factory = require("../factory/index.js");
const inventory = require("./source-prospect-authentication-quality-reassessment.js");
const extractionData = require("./technical-research-factory-extraction-agent.js");

const CONTENT = "oil specification=SAE 10W-30\ncapacity filter=3.1 L";
const realProspect = inventory.prospects.find(item => item.id === "yamaha.tenere700.service.bw3-f8197-e0");
const target = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.tenere-700.gen1", manufacturer: "Yamaha", family: "Ténéré 700", generation: "I", years: { from: 2019, to: 2019 }, markets: ["EU"], transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
const canonicalTarget = factory.validateResearchTarget(target);
const blockedProspect = factory.adapters.fromLegacySourceProspect(realProspect, canonicalTarget);
const syntheticProspect = factory.validateSourceProspect({ schemaVersion: 1, id: "prospect.synthetic.tenere-pilot-ready", targetId: canonicalTarget.id, documentClass: "official-service-manual", authority: { name: "Synthetic local fixture", state: "KNOWN" }, documentIdentity: { title: "Synthetic Ténéré service fixture", state: "KNOWN" }, publication: { relationship: "SINGLE", identifiers: [{ value: "synthetic-tenere-pilot", namespace: "fixture", region: "EU", proofState: "AUTHENTICATED" }] }, officialLocations: [{ host: "fixture.invalid", path: "/tenere" }], sourceTier: "A", authenticationState: "AUTHENTICATED", accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: canonicalTarget.scope, exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "MEDIUM", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "synthetic design fixture only" });

function buildDesign() {
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-tenere-batch-pilot/v1",
    target: { id: canonicalTarget.id, catalogVariantKey: canonicalTarget.catalogVariantKey, manufacturer: canonicalTarget.manufacturer, family: canonicalTarget.family, generation: canonicalTarget.generation, years: canonicalTarget.scope.years, markets: canonicalTarget.scope.markets, transmission: canonicalTarget.scope.transmissions, abs: canonicalTarget.scope.abs, equipment: canonicalTarget.scope.equipment },
    prospect: { id: blockedProspect.id, publication: "BW3-F8197-E0", state: blockedProspect.authenticationState, role: "FACTORY-PILOT-CANDIDATE", executionReady: false },
    preconditions: Object.freeze(["official Yamaha identity and delivery/access path authenticated", "BW3-F8197-E0 applicability explicitly covers MY2019 EU standard Ténéré 700", "standard versus Rally/World Raid/Explore/Extreme scope resolved", "ABS, transmission and safety-field applicability resolved", "source content acquired with immutable artifact digest and byte length", "all downstream records remain research-only and caller-persisted"]),
    budgets: Object.freeze({ targets: 1, sourceWorkItems: 1, maxAttemptsPerWorkItem: 1, totalAttempts: 1, primaryDocuments: 1 }),
    interruption: Object.freeze({ point: "after the single acquisition attempt completes and before downstream processing is consumed", requiredState: "PAUSED", checkpoint: "validated event-count/event-digest/snapshot-digest checkpoint", resume: "verify checkpoint prefix, replay canonical snapshot, append one batch-resumed event, reject any second attempt for completed work" }),
    downstream: Object.freeze(["ACQUIRED artifact", "raw extraction result", "Review Queue entry", "Human Review Decision", "Evidence Processing pre-promotion record"]),
    stopConditions: Object.freeze(["real prospect remains not execution-ready", "identity, access, year, market, equipment or ABS applicability unresolved", "artifact provenance or digest mismatch", "checkpoint prefix/snapshot verification failure", "attempt/work identity duplication", "any adapter attempts to add canonical state or evidence", "any downstream stage requests normalization, conflict resolution or production promotion"]),
    acceptance: Object.freeze(["one target and one bounded work item only", "one attempt maximum with no duplicate after resume", "uninterrupted and resumed snapshots are byte-equivalent", "real BW3-F8197-E0 readiness remains REGISTERED-NOT-REAUTHENTICATED", "synthetic path reaches every completed research-only layer exactly once", "no evidence, coverage, production, retry-budget or Orchestrator redesign changes"])
  });
}

function buildSyntheticRun() {
  const built = factory.createResearchBatch({ purpose: "tenere-interrupted-resumed-pilot-design", policyId: "tenere-pilot-design-v1", targets: [canonicalTarget], maxAttemptsPerWorkItem: 1 });
  const targetWork = factory.createTargetWork(built.batch, canonicalTarget);
  const sourceWork = factory.createSourceWorkItem({ batch: built.batch, targetWork, target: canonicalTarget, prospect: syntheticProspect, operation: "attempt-existing-source", maxAttempts: 1 });
  const planBatch = { batch: built.batch, targetWorks: [targetWork], sourceWorkItems: [sourceWork] };
  const acquisitionAdapter = { adapterId: "synthetic.tenere-pilot-acquisition", supportedOperations: [sourceWork.operation], supportedSourceClasses: ["official-service-manual"], authenticationRequired: false, networkRequired: false, execute(request) { const artifact = { prospectId: request.prospectId, attemptId: request.attemptId, mediaType: "text/plain", byteLength: Buffer.byteLength(CONTENT, "utf8"), contentDigest: factory.sha256(CONTENT), originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://tenere-pilot", metadata: {} }; artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator }); return factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_PILOT_FIXTURE_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_PILOT_FIXTURE" }], artifact }); } };
  const initialEvents = factory.bootstrap(planBatch);
  const acquired = factory.executeAttempt(initialEvents, sourceWork, acquisitionAdapter);
  const pausedEvents = factory.events.appendEvent(acquired.events, { batchId: built.batch.id, type: "batch-paused", payload: {} });
  const checkpoint = factory.createCheckpoint(pausedEvents);
  const resumedSnapshot = factory.resumeFromCheckpoint(checkpoint, pausedEvents);
  const uninterrupted = factory.events.appendEvent(pausedEvents, { batchId: built.batch.id, type: "batch-resumed", payload: {} });
  const resumed = factory.events.appendEvent(pausedEvents, { batchId: built.batch.id, type: "batch-resumed", payload: {} });
  const envelope = factory.validateArtifactContentEnvelope({ schemaVersion: 1, artifactId: acquired.result.outcome.artifact.id, mediaType: "text/plain", byteLength: Buffer.byteLength(CONTENT, "utf8"), contentDigest: factory.sha256(CONTENT), contentEncoding: "utf8", content: CONTENT });
  const extracted = factory.extractRawCandidates({ executionResult: acquired.result, events: acquired.events, researchTarget: canonicalTarget, contentEnvelope: envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  const queue = factory.buildReviewQueue([extracted]);
  const decisions = factory.buildReviewDecisions([{ queueEntry: queue.entries[0], decision: "ACCEPT", reviewerId: "reviewer.synthetic" }]);
  const processing = factory.buildEvidenceProcessing({ queueEntries: queue.entries, decisions: decisions.decisions });
  return Object.freeze({ initialEvents, acquired, pausedEvents, checkpoint, resumedEvents: resumed, resumedSnapshot, uninterruptedSnapshot: factory.reduceEvents(uninterrupted), resumedAfterResumeSnapshot: factory.reduceEvents(resumed), extracted, queue, decisions, processing });
}

module.exports = Object.freeze({ CONTENT, target: canonicalTarget, blockedProspect, syntheticProspect, buildDesign, buildSyntheticRun });
