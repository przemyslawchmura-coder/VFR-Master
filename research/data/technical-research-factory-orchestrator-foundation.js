// NON-PRODUCTION reproducible report for the Research Factory Orchestrator Foundation.
"use strict";

const factory = require("../factory/index.js");
const pipeline = require("../lib/batch-research-pipeline.js");
const readinessInventory = require("./source-prospect-authentication-quality-reassessment.js");
const yamaha = require("./yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("./high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("./harley-davidson-transfer-acquisition-batch-results.js").runBatch();

function orchestrationResult(name, target, prospect) {
  const built = factory.createResearchBatch({ purpose: `existing-fixture-${name}`, policyId: "orchestrator-foundation-v1", targets: [target], maxAttemptsPerWorkItem: 2 });
  const targetWork = factory.createTargetWork(built.batch, target);
  const sourceWork = factory.createSourceWorkItem({ batch: built.batch, targetWork, target, prospect, operation: "track-existing-prospect", maxAttempts: 2 });
  let events = [];
  events = factory.events.appendEvent(events, { batchId: built.batch.id, type: "batch-created", payload: { batch: built.batch } });
  events = factory.events.appendEvent(events, { batchId: built.batch.id, type: "target-added", payload: { targetWork } });
  events = factory.events.appendEvent(events, { batchId: built.batch.id, type: "source-work-created", payload: { sourceWork } });
  events = factory.events.appendEvent(events, { batchId: built.batch.id, type: "batch-resumed" });
  const snapshot = factory.reduceEvents(events);
  const checkpoint = factory.createCheckpoint(events);
  return Object.freeze({ name, manufacturer: target.manufacturer, batchId: built.batch.id, targetWorkId: targetWork.id, sourceWorkId: sourceWork.id, readiness: sourceWork.readiness.classification, applicability: sourceWork.readiness.applicability.overall, workState: snapshot.sourceWorkItems[0].state, attemptsUsed: 0, remainingAttempts: 2, checkpointId: checkpoint.id, replayVerified: factory.orchestrationJson.canonicalSerialize(snapshot) === factory.orchestrationJson.canonicalSerialize(factory.resumeFromCheckpoint(checkpoint, events)) });
}

function fixtures() {
  const mtTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const hondaTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  const harleyTarget = factory.adapters.fromLegacyResearchTarget(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  const tenereLegacy = readinessInventory.prospects.find(item => item.id === "yamaha.tenere700.service.bw3-f8197-e0");
  const tenereTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: tenereLegacy.catalogVariantKey, manufacturer: "Yamaha", family: "Ténéré 700", generation: "I", years: tenereLegacy.years, markets: tenereLegacy.markets, transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  return Object.freeze([
    orchestrationResult("honda-cbr500r-existing-owner", hondaTarget, factory.adapters.fromLegacyAcquiredSource(honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00"), hondaTarget)),
    orchestrationResult("yamaha-mt09-existing-owner", mtTarget, factory.adapters.fromLegacyAcquiredSource(yamaha.sources[0], mtTarget)),
    orchestrationResult("harley-existing-mismatch", harleyTarget, factory.adapters.fromLegacyAcquiredSource(harley.source, harleyTarget)),
    orchestrationResult("tenere-existing-service-prospect", tenereTarget, factory.adapters.fromLegacySourceProspect(tenereLegacy, tenereTarget))
  ]);
}

function buildReport() {
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-orchestrator-foundation/v1",
    orchestratorSchemaVersion: factory.ORCHESTRATOR_SCHEMA_VERSION,
    foundationContractVersion: factory.FACTORY_CONTRACT_VERSION,
    date: "2026-09-01",
    contracts: Object.freeze(["ResearchBatch", "TargetWork", "SourceWorkItem", "ResearchAttempt", "ResearchEvent", "ResearchSnapshot", "Checkpoint"]),
    identifiers: Object.freeze({ algorithm: "SHA-256 over canonical JSON; first 24 hex characters with a type prefix", clockDependent: false, random: false, batch: "purpose + policyId + maximum attempts per work item + sorted unique ResearchTarget IDs", targetWork: "batchId + ResearchTarget ID", sourceWork: "TargetWork ID + SourceProspect ID + operation", attempt: "SourceWorkItem ID + one-based ordinal", event: "batchId + contiguous sequence + type + canonical payload" }),
    eventTypes: factory.EVENT_TYPES,
    stateMachines: Object.freeze({ batch: factory.BATCH_STATES, work: factory.WORK_STATES, attempt: factory.ATTEMPT_STATES }),
    guarantees: Object.freeze({ appendOnlyEvents: true, pureReducer: true, oneActiveAttemptPerWorkItem: true, boundedAttempts: true, canonicalSnapshots: true, checkpointReplayVerification: true, incompatibleResumeFailsClosed: true, foundationReadinessAuthoritative: true, jsonSafe: true, immutableInputs: true, singleProcessOnly: true }),
    fixtures: fixtures(),
    serviceCoreFieldCount: pipeline.serviceCoreFields.length,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", risks: Object.freeze(["event storage remains caller-owned; no durable filesystem/database log is introduced", "planner/scheduler and typed external-result ingestion are deferred", "historical research records are adapted at the boundary rather than migrated"]), conclusion: "The deterministic single-process state foundation is safe for a bounded planner wave; persistence ownership and execution work remain explicitly out of scope." }),
    exactNextTasks: Object.freeze([{ id: "factory-execution-planner", task: "Implement the bounded Technical Research Factory Execution Planner: translate canonical GapPlans and SourceProspects into deterministic ResearchBatch, TargetWork and SourceWorkItem plans under explicit source-class, readiness and attempt budgets, using only synthetic and existing local fixtures and performing no external research, authentication, acquisition, extraction, production change or historical migration." }]),
    externalResearchPerformed: false, evidenceAdded: false, researchedNoEvidenceAdded: false, serviceCoreChanged: false, coverageChanged: false, productionChanged: false, runtimeChanged: false, catalogueChanged: false, cloudBackendChanged: false, vfr800ProductionChanged: false, tenereAuthenticationExecuted: false, historicalDataMigrated: false
  });
}

module.exports = Object.freeze({ buildReport });
