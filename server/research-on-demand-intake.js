// TRUSTED SERVER-SIDE FOUNDATION. Do not import from browser/runtime code.
"use strict";

const technicalContext = require("../js/technical/motorcycle-technical-context.js");
const bridge = require("../research/factory/research-on-demand-bridge.js");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const persistence = require("../research/factory/reusable-knowledge-persistence.js");

const DECISIONS = Object.freeze(["REUSED", "RESEARCH-REQUIRED", "CONFLICT-AMBIGUOUS"]);
const REUSABLE_CLASSIFICATIONS = new Set([
  "REUSED",
  "JOIN-IN-PROGRESS",
  "JOIN-HUMAN-REVIEW",
  "PRESERVE-UNSUPPORTED",
  "PRESERVE-BLOCKED"
]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const clone = value => JSON.parse(JSON.stringify(value));

function requestContextConditions(context, conditions) {
  const value = context.context;
  const identityContext = Object.fromEntries([
    ["modelCode", value.modelCode],
    ["emissionsVariant", value.emissionsVariant]
  ].filter(([, item]) => item !== null && item !== undefined));
  if (!Object.keys(identityContext).length) return conditions === undefined ? undefined : clone(conditions);
  return {
    ...(conditions === undefined ? {} : clone(conditions)),
    requestContext: identityContext
  };
}

function durableState(repository, demand) {
  const knowledge = persistence.lookupDurableKnowledge(repository, demand);
  if (knowledge.classification !== "MISSING") return knowledge;
  if (typeof repository.snapshot === "function") {
    const snapshot = repository.snapshot();
    const related = reusable.lookupReusableKnowledge({ demand, repository: snapshot.knowledge || [] });
    if (related.classification !== "MISSING") return related;
  }
  if (typeof repository.readDemand !== "function") return knowledge;
  const existing = repository.readDemand(demand.id);
  if (!existing) return knowledge;
  if (existing.status === "IN_PROGRESS") return Object.freeze({ ...knowledge, classification: "JOIN-IN-PROGRESS", status: existing.status, record: clone(existing) });
  if (existing.status === "AWAITING_HUMAN_REVIEW") return Object.freeze({ ...knowledge, classification: "JOIN-HUMAN-REVIEW", status: existing.status, record: clone(existing) });
  if (["BLOCKED", "UNSUPPORTED"].includes(existing.status)) return Object.freeze({ ...knowledge, classification: existing.status === "BLOCKED" ? "PRESERVE-BLOCKED" : "PRESERVE-UNSUPPORTED", status: existing.status, record: clone(existing) });
  return knowledge;
}

function makeDemands({ context, fields, conditions }) {
  return fields.map(field => bridge.demandFor(context, field, {
    conditions: requestContextConditions(context, conditions)
  }));
}

function decideForDemand({ demand, state, trustedBoundary }) {
  if (state.classification === "REUSED") return { decision: "REUSED", classification: state.classification, demand, state };
  if (REUSABLE_CLASSIFICATIONS.has(state.classification)) return { decision: "RESEARCH-REQUIRED", classification: state.classification, demand, state };
  if (state.classification === "CONTEXT-UNKNOWN" || state.classification === "INCOMPATIBLE") return { decision: "CONFLICT-AMBIGUOUS", classification: state.classification, demand, state };
  assert(state.classification === "MISSING", `unsupported reusable-knowledge classification: ${state.classification}`);
  const durableInput = { ...demand };
  delete durableInput.id;
  delete durableInput.knowledgeKey;
  delete durableInput.schemaVersion;
  const durable = trustedBoundary ? trustedBoundary.request(durableInput) : null;
  return { decision: "RESEARCH-REQUIRED", classification: "MISSING", demand, state, durable };
}

function createUserDemandIntake({ repository, trustedBoundary = null }) {
  assert(repository && typeof repository.readKnowledge === "function", "trusted knowledge repository is required");
  if (trustedBoundary !== null) assert(typeof trustedBoundary.request === "function", "trusted demand boundary is invalid");

  function inspect({ motorcycle, catalogue, fields, conditions }) {
    assert(Array.isArray(fields) && fields.length > 0, "technical research fields are required");
    const context = bridge.buildResearchContext(motorcycle, catalogue);
    const technical = technicalContext.buildTechnicalContext(motorcycle);
    if (context.status !== "ready") {
      return Object.freeze({ schemaVersion: 1, decision: "CONFLICT-AMBIGUOUS", context: clone(context), technicalContext: clone(technical), requiredContext: Object.freeze([...context.requiredContext]), results: Object.freeze([]), productionMaterialized: false, externalAcquisition: false });
    }
    const demands = makeDemands({ context, fields, conditions });
    const results = demands.map(demand => decideForDemand({ demand, state: durableState(repository, demand), trustedBoundary }));
    const decisions = new Set(results.map(result => result.decision));
    const decision = decisions.has("CONFLICT-AMBIGUOUS") ? "CONFLICT-AMBIGUOUS" : decisions.has("RESEARCH-REQUIRED") ? "RESEARCH-REQUIRED" : "REUSED";
    return Object.freeze({ schemaVersion: 1, decision, context: clone(context), technicalContext: clone(technical), requiredContext: Object.freeze([]), results: Object.freeze(results.map(clone)), productionMaterialized: false, externalAcquisition: false });
  }

  return Object.freeze({ inspect });
}

module.exports = Object.freeze({ DECISIONS, createUserDemandIntake, requestContextConditions });
