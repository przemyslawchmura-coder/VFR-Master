// NON-PRODUCTION reproducible report for the Research Factory Execution Planner.
"use strict";

const factory = require("../factory/index.js");
const pipeline = require("../lib/batch-research-pipeline.js");
const inventory = require("./source-prospect-authentication-quality-reassessment.js");
const yamaha = require("./yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("./high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("./harley-davidson-transfer-acquisition-batch-results.js").runBatch();

const known = values => ({ state: "KNOWN", values });
const syntheticTarget = () => factory.validateResearchTarget({ schemaVersion: 1, id: "target.planner.synthetic.2021.eu", catalogVariantKey: "planner.synthetic", manufacturer: "Synthetic", family: "Planner Fixture", scope: { schemaVersion: 1, model: known(["planner.synthetic"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]) }, sourcePriorityPolicyId: "planner-report-v1", serviceCoreBaseline: { verified: 41, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE" });
const syntheticProspect = (target, id) => factory.validateSourceProspect({ schemaVersion: 1, id, targetId: target.id, documentClass: "official-service-manual", authority: { name: "Synthetic Authority", state: "KNOWN" }, documentIdentity: { title: "Local Planner Fixture", state: "KNOWN" }, publication: { relationship: "SINGLE", identifiers: [{ value: id, namespace: "Synthetic", region: "EU", proofState: "AUTHENTICATED" }] }, officialLocations: [{ host: "fixture.invalid", path: `/${id}` }], sourceTier: "A", authenticationState: "AUTHENTICATED", accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: target.scope, exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "HIGH", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "local fixture only" });
const capability = (prospect, fields, state = "KNOWN") => ({ schemaVersion: 1, prospectId: prospect.id, operation: "attempt-existing-source", state, fieldIds: fields });
const candidate = (target, prospect, fields, state) => ({ prospect, readiness: factory.evaluateReadiness(target, prospect), capability: capability(prospect, fields, state), maxAttempts: 1 });

function existing() {
  const results = [];
  const add = (name, target, prospect) => results.push({ name, target, gapPlan: factory.generateGapPlan(target), candidate: candidate(target, prospect, ["cooling.capacity"]) });
  const mt = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  add("yamaha-mt09", mt, factory.adapters.fromLegacyAcquiredSource(yamaha.sources[0], mt));
  const cb = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  add("honda-cbr500r", cb, factory.adapters.fromLegacyAcquiredSource(honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00"), cb));
  const hd = factory.adapters.fromLegacyResearchTarget(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  add("harley-sportster", hd, factory.adapters.fromLegacyAcquiredSource(harley.source, hd));
  for (const [name, id, family, verified] of [["tenere-service", "yamaha.tenere700.service.bw3-f8197-e0", "Ténéré 700", 29], ["vfr800-mirror", "honda.vfr800.service-mirror.61mcw07", "VFR800", 13]]) {
    const legacy = inventory.prospects.find(item => item.id === id);
    const target = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: legacy.catalogVariantKey, manufacturer: legacy.manufacturer, family, generation: name.startsWith("tenere") ? "I" : "RC46 VTEC", years: legacy.years, markets: legacy.markets, transmission: "manual", abs: name.startsWith("tenere") ? true : null, equipment: "standard" }, { verified });
    add(name, target, factory.adapters.fromLegacySourceProspect(legacy, target));
  }
  return results;
}

function buildReport() {
  const target = syntheticTarget();
  const gapPlan = factory.validateGapPlan({ schemaVersion: 1, id: `${target.id}.gap-plan`, targetId: target.id, startingCoverage: { verified: 41, total: 44 }, remainingFields: ["cooling.capacity", "lubrication.capacity-drain", "torques.front-axle"], safetyCriticalRemainingFields: ["cooling.capacity", "lubrication.capacity-drain", "torques.front-axle"], researchedNoEvidenceFields: ["cooling.capacity"], conflictedFields: ["torques.front-axle"], attemptedSourceClasses: [], sourceClassRelevance: {}, expectedMarginalOpportunity: "HIGH" }, pipeline.serviceCoreFields);
  const planned = syntheticProspect(target, "prospect.planner.synthetic.planned");
  const notNeeded = syntheticProspect(target, "prospect.planner.synthetic.not-needed");
  const opaque = syntheticProspect(target, "prospect.planner.synthetic.opaque");
  const real = existing();
  const policy = factory.validatePlanningPolicy({ schemaVersion: 1, batchPurpose: "execution-planner-foundation", maxAttemptsPerSourceWorkItem: 2, maxSourceWorkItemsPerTarget: 2, maxWorkItemsPerBatch: 3, maxTargetsPerBatch: 2, maxTotalAttemptsPerBatch: 4, sourceClassPriority: ["official-service-manual", "service manual", "owner manual", "official service-data publication"], sourceTierPriority: ["A", "B"], practicalFieldIds: ["cooling.capacity", "lubrication.capacity-drain", "torques.front-axle"] });
  const plan = factory.planExecution({ targets: [target, ...real.map(item => item.target)], gapPlans: [gapPlan, ...real.map(item => item.gapPlan)], candidates: [candidate(target, planned, ["cooling.capacity", "torques.front-axle"]), candidate(target, notNeeded, ["ignition.plug-gap"]), candidate(target, opaque, [], "UNKNOWN"), ...real.map(item => item.candidate)], policy });
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-execution-planner/v1", plannerSchemaVersion: factory.PLANNER_SCHEMA_VERSION, foundationContractVersion: factory.FACTORY_CONTRACT_VERSION, orchestratorSchemaVersion: factory.ORCHESTRATOR_SCHEMA_VERSION, date: "2026-09-01", policy, summary: plan.summary, decisions: plan.decisions, batches: plan.batches, fixtureResults: Object.freeze(Object.fromEntries(real.map(item => { const decision = plan.decisions.find(row => row.prospectId === item.candidate.prospect.id); return [item.name, { decision: decision.decision, reasonCode: decision.reasonCode }]; }))), serviceCoreFieldCount: pipeline.serviceCoreFields.length, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", risks: Object.freeze(["source capability declarations are explicit trusted local inputs and still require later typed acquisition-result validation", "planner uses configured field coverage rather than measured future yield", "no existing prospect is execution-ready, so PLANNED compatibility uses a synthetic local fixture"]), conclusion: "The planner is deterministic, gap-driven and fail-closed, but capability provenance and execution-result ingestion remain later bounded layers." }), exactNextTasks: Object.freeze([{ id: "factory-execution-agent-adapter-foundation", task: "Implement the bounded Technical Research Factory Execution Agent / Source Acquisition Adapter Foundation: define a typed interface for attempting already-planned SourceWorkItems and recording immutable attempt outcomes/events under existing readiness, attempt-budget and checkpoint limits, using synthetic/local fixtures only and performing no uncontrolled multi-target research or production change." }]), externalResearchPerformed: false, evidenceAdded: false, researchedNoEvidenceAdded: false, serviceCoreChanged: false, coverageChanged: false, productionChanged: false, runtimeChanged: false, catalogueChanged: false, cloudBackendChanged: false, vfr800ProductionChanged: false, tenereAuthenticationExecuted: false, historicalDataMigrated: false });
}

module.exports = Object.freeze({ buildReport });
