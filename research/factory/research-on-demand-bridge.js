// NON-PRODUCTION deterministic Active Motorcycle -> Research Factory bridge.
"use strict";

const crypto = require("node:crypto");
const technicalContext = require("../../js/technical/motorcycle-technical-context.js");
const pipeline = require("../lib/batch-research-pipeline.js");
const json = require("./json.js");
const reusable = require("./reusable-knowledge-contracts.js");
const persistence = require("./reusable-knowledge-persistence.js");
const foundation = require("./contracts.js");
const plannerContracts = require("./planner-contracts.js");
const planner = require("./execution-planner.js");
const readiness = require("./readiness.js");
const gapPlan = require("./gap-plan.js");
const orchestrator = require("./orchestrator.js");
const executionAgent = require("./execution-agent.js");
const acquisitionAdapters = require("./source-acquisition-adapters.js");

const BRIDGE_SCHEMA_VERSION = 1;
const OPERATION = "attempt-existing-source";
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);
const clone = value => json.immutableClone(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const known = values => ({ state: "KNOWN", values });
const unknown = () => ({ state: "UNKNOWN", values: [] });

function catalogueEntry(catalogue, key) {
  if (catalogue && typeof catalogue.resolveByKey === "function") return catalogue.resolveByKey(key);
  if (typeof catalogue === "function") return catalogue(key);
  if (catalogue && typeof catalogue.getVariantByKey === "function") return catalogue.getVariantByKey(key);
  return null;
}

function buildResearchContext(motorcycle, catalogue) {
  const technical = technicalContext.buildTechnicalContext(motorcycle);
  const entry = catalogueEntry(catalogue, technical.context.catalogVariantKey);
  const variant = entry && entry.variant;
  const model = entry && entry.model;
  const brand = entry && entry.brand;
  const requiredContext = [...technical.requiredContext];
  if (!entry || !variant || !model) requiredContext.push("catalogueVariant");
  if (entry && technical.context.year !== null && (technical.context.year < variant.yearFrom || technical.context.year > variant.yearTo)) requiredContext.push("yearApplicability");
  const context = {
    catalogVariantKey: technical.context.catalogVariantKey,
    model: model ? model.id : null,
    generation: variant ? variant.id : null,
    year: technical.context.year,
    market: technical.context.region,
    abs: technical.context.abs,
    transmission: technical.context.transmission,
    equipment: technical.context.equipment,
    bodyStyle: null,
    manufacturer: brand ? brand.name : null,
    family: model ? model.name : null
  };
  return Object.freeze({
    schemaVersion: BRIDGE_SCHEMA_VERSION,
    status: requiredContext.length ? "insufficient-context" : "ready",
    requiredContext: Object.freeze([...new Set(requiredContext)].sort()),
    context: clone(context)
  });
}

function applicabilityFromContext(context) {
  const value = context.context;
  return {
    schemaVersion: 1,
    model: value.model ? known([value.model]) : unknown(),
    generation: value.generation ? known([value.generation]) : unknown(),
    years: Number.isInteger(value.year) ? { kind: "EXACT", from: value.year, to: value.year } : { kind: "UNKNOWN", from: null, to: null },
    markets: value.market ? known([value.market]) : unknown(),
    transmissions: value.transmission ? known([value.transmission]) : unknown(),
    abs: typeof value.abs === "boolean" ? known([value.abs]) : unknown(),
    equipment: Array.isArray(value.equipment) && value.equipment.length ? known(value.equipment) : unknown()
  };
}

function demandFor(context, fieldId, extra = {}) {
  const applicability = applicabilityFromContext(context);
  return reusable.validateReusableDemand({
    catalogVariantKey: context.context.catalogVariantKey,
    canonicalFieldId: fieldId,
    operation: extra.operation || "read-synthetic-technical-value",
    applicability,
    conditions: extra.conditions || { bridge: "active-motorcycle-wave3" },
    requiredApplicabilityDimensions: ["model", "generation", "year", "market", "abs", "transmission", "equipment"]
  });
}

function targetFor(context, demand) {
  const scope = applicabilityFromContext(context);
  return foundation.validateResearchTarget({
    schemaVersion: 1,
    id: `target.${demand.id.slice("reusable-demand.".length)}`,
    catalogVariantKey: context.context.catalogVariantKey,
    manufacturer: context.context.manufacturer || "Unknown",
    family: context.context.family || context.context.catalogVariantKey,
    scope,
    sourcePriorityPolicyId: "wave3-local-synthetic-v1",
    serviceCoreBaseline: { verified: 0, total: 44 },
    gapPlanRef: null,
    knownSourceRefs: [],
    knownProspectRefs: [],
    researchHistoryRefs: [],
    riskFlags: [],
    state: "RESEARCH-MORE"
  });
}

function prospectFor(target, demand) {
  return foundation.validateSourceProspect({
    schemaVersion: 1,
    id: `prospect.${digest({ demandId: demand.id, fixture: "wave3-local" })}`,
    targetId: target.id,
    documentClass: "synthetic-local-fixture",
    authority: { name: "RevLog synthetic fixture", state: "KNOWN" },
    documentIdentity: { title: "Wave 3 synthetic local result", state: "KNOWN" },
    publication: { relationship: "SINGLE", identifiers: [{ value: `wave3-${demand.id}`, namespace: "RevLog-synthetic", region: "LOCAL", proofState: "AUTHENTICATED" }] },
    officialLocations: [{ host: "synthetic.invalid", path: `/wave3/${demand.id}` }],
    sourceTier: "A",
    authenticationState: "AUTHENTICATED",
    accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL-HTML" },
    applicability: target.scope,
    exhaustionState: "ACTIVE",
    priorAttemptRefs: [],
    expectedMarginalGapClass: "HIGH",
    readinessClassification: "EXECUTION-READY",
    blockers: [],
    nextAction: "local synthetic fixture only"
  });
}

function planningPolicy(fieldId) {
  return plannerContracts.validatePlanningPolicy({
    schemaVersion: 1,
    batchPurpose: "research-on-demand-wave3-local",
    maxAttemptsPerSourceWorkItem: 1,
    maxSourceWorkItemsPerTarget: 1,
    maxWorkItemsPerBatch: 1,
    maxTargetsPerBatch: 1,
    maxTotalAttemptsPerBatch: 1,
    sourceClassPriority: ["synthetic-local-fixture"],
    sourceTierPriority: ["A"],
    practicalFieldIds: [fieldId]
  });
}

function executeFactoryBridge({ context, demand }) {
  const target = targetFor(context, demand);
  const prospect = prospectFor(target, demand);
  const generatedGapPlan = gapPlan.generateGapPlan(target, [], { expectedMarginalOpportunity: "HIGH" });
  const capability = { schemaVersion: 1, prospectId: prospect.id, operation: OPERATION, state: "KNOWN", fieldIds: [demand.canonicalFieldId] };
  const sourceReadiness = readiness.evaluateReadiness(target, prospect);
  const plan = planner.planExecution({
    targets: [target],
    gapPlans: [foundation.validateGapPlan({ ...generatedGapPlan, remainingFields: [demand.canonicalFieldId], safetyCriticalRemainingFields: [], startingCoverage: { verified: 43, total: 44 } }, pipeline.serviceCoreFields)],
    candidates: [{ prospect, readiness: sourceReadiness, capability, maxAttempts: 1 }],
    policy: planningPolicy(demand.canonicalFieldId)
  });
  assert(plan.summary.workItemsProduced === 1, "Wave 3 demand did not produce exactly one Factory work item");
  const batch = plan.batches[0];
  let events = executionAgent.bootstrap(batch);
  const work = batch.sourceWorkItems[0];
  const execution = executionAgent.executeAttempt(events, work, acquisitionAdapters.syntheticAdapters.acquired, { networkAvailable: false });
  assert(execution.snapshot.sourceWorkItems[0].state === "COMPLETED", "synthetic Factory execution did not complete");
  return Object.freeze({ target, prospect, plan, events: execution.events, execution });
}

function statusRecords(repository) {
  const snapshot = repository.snapshot();
  const knowledgeKeys = new Set(snapshot.knowledge.map(item => item.knowledgeKey));
  return snapshot.demands
    .filter(item => item.status !== "REUSABLE" || !knowledgeKeys.has(item.knowledgeKey))
    .map(item => reusable.createReusableKnowledge({ demand: item, status: item.status, value: null, rawValue: null, provenance: null }));
}

function lookup(repository, demand) {
  const knowledge = persistence.lookupDurableKnowledge(repository, demand);
  if (knowledge.classification !== "MISSING") return knowledge;
  return reusable.lookupReusableKnowledge({ demand, repository: [...repository.snapshot().knowledge, ...statusRecords(repository)] });
}

function requestResearch({ motorcycle, catalogue, fields, repository, syntheticValues = {} }) {
  assert(repository && typeof repository.claim === "function", "Wave 3 durable repository is required");
  assert(Array.isArray(fields) && fields.length > 0, "Wave 3 fields are required");
  const context = buildResearchContext(motorcycle, catalogue);
  const demands = fields.map(field => demandFor(context, field));
  const before = reusable.projectReusableKnowledge({ requests: demands, repository: [...repository.snapshot().knowledge, ...statusRecords(repository)] });
  const work = [];
  demands.forEach(demand => {
    const result = lookup(repository, demand);
    if (result.classification !== "MISSING") return;
    const claim = repository.claim({ demand, status: "IN_PROGRESS", lifecycle: { bridge: "wave3", canonicalDemandId: demand.id } });
    if (claim.outcome !== "CREATED") return;
    const factoryRun = executeFactoryBridge({ context, demand });
    const synthetic = syntheticValues[demand.canonicalFieldId] === undefined ? `SYNTHETIC-${demand.canonicalFieldId}` : syntheticValues[demand.canonicalFieldId];
    const stored = repository.putKnowledge({
      demand,
      status: "REUSABLE",
      value: synthetic.value === undefined ? synthetic : synthetic.value,
      rawValue: synthetic.rawValue === undefined ? `raw:${synthetic.value === undefined ? synthetic : synthetic.value}` : synthetic.rawValue,
      provenance: { sourceId: factoryRun.prospect.id, sourceType: "synthetic-local-fixture", locator: `fixture://wave3/${demand.id}` },
      lineage: { factoryBatchId: factoryRun.execution.snapshot.batch.id, sourceWorkItemId: factoryRun.execution.snapshot.sourceWorkItems[0].id, acquisitionResultId: factoryRun.execution.result.attemptId, reviewDecisionId: `synthetic-review.${demand.id.slice("reusable-demand.".length)}`, evidenceId: `synthetic-pre-evidence.${demand.id.slice("reusable-demand.".length)}`, boundary: "accepted-pre-evidence" }
    });
    assert(["CREATED", "REUSED"].includes(stored.outcome), "synthetic reusable knowledge persistence failed");
    repository.setStatus({ demandId: demand.id, status: "REUSABLE" });
    work.push({ demand, factoryRun, stored });
  });
  const after = reusable.projectReusableKnowledge({ requests: demands, repository: [...repository.snapshot().knowledge, ...statusRecords(repository)] });
  return Object.freeze({ schemaVersion: BRIDGE_SCHEMA_VERSION, context, demands, before, work: Object.freeze(work), after, productionMaterialized: false, externalAcquisition: false });
}

module.exports = Object.freeze({ BRIDGE_SCHEMA_VERSION, buildResearchContext, demandFor, executeFactoryBridge, requestResearch });
