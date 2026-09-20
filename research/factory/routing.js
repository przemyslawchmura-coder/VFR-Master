// NON-PRODUCTION deterministic GREEN/YELLOW/RED routing over existing runner results.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const runner = require("./safe-stage-runner.js");

const ROUTING_SCHEMA_VERSION = 1;
const ROUTES = Object.freeze(["GREEN", "YELLOW", "RED"]);
const ROUTING_REASONS = Object.freeze([
  "SAFE-RUNNER-ADVANCED",
  "HUMAN-REVIEW-REQUIRED",
  "PROMOTION-REVIEW-REQUIRED",
  "MISSING-UPSTREAM-ARTIFACT",
  "DOWNSTREAM-CONTRACT-REJECTED",
  "PROMOTION-DECISION-MISMATCH",
  "UNSUPPORTED-STAGE",
  "DUPLICATE-SEMANTIC-INPUT",
  "INCOMPATIBLE-STATE",
  "EXTERNAL-WORK-NOT-AUTHORIZED",
  "RULE-NOT-APPLICABLE",
  "RULE-EVALUATION-REJECTED",
  "EXACT-DUPLICATE",
  "CONFLICTING-DUPLICATE",
  "MALFORMED-INPUT"
]);
const fields = new Set(["schemaVersion", "id", "inputIdentity", "route", "reasonCodes", "invariants", "currentStage", "nextLegalAction", "targetIdentity", "canonicalFieldId", "sourceIdentity", "sourceProvenance", "rawValue", "rawUnit", "applicability", "condition", "upstreamIdentity", "upstreamDigest", "contractVersions", "externalSideEffects", "duplicateCount"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const withoutId = value => { const { id, ...rest } = value; return rest; };
const routeId = value => `routing-result.${digest(withoutId(value)).slice(0, 24)}`;
const recordFromInput = input => input && (input.promotionReviewPacket || input.promotionReviewDecision || input.record || input);
const identity = (record, input) => ({ id: record && typeof record.id === "string" ? record.id : null, digest: digest(input) });

function validateRoutingResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === ROUTING_SCHEMA_VERSION, "RoutingResult schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(fields.has(field), `RoutingResult.${field} is unsupported`));
  assert(typeof input.id === "string" && /^routing-result\.[a-f0-9]{24}$/.test(input.id), "RoutingResult.id is invalid");
  assert(input.inputIdentity && (input.inputIdentity.id === null || typeof input.inputIdentity.id === "string") && /^[a-f0-9]{64}$/.test(input.inputIdentity.digest), "RoutingResult.inputIdentity is invalid");
  assert(ROUTES.includes(input.route), "RoutingResult.route is invalid");
  assert(Array.isArray(input.reasonCodes) && input.reasonCodes.length > 0 && input.reasonCodes.every(reason => ROUTING_REASONS.includes(reason)), "RoutingResult.reasonCodes are invalid");
  assert(input.reasonCodes.every((reason, index) => index === 0 || input.reasonCodes[index - 1].localeCompare(reason) < 0), "RoutingResult.reasonCodes must be unique and ordered");
  assert(input.invariants && Array.isArray(input.invariants.satisfied) && Array.isArray(input.invariants.failed), "RoutingResult.invariants are required");
  assert(typeof input.currentStage === "string" && input.currentStage.length > 0, "RoutingResult.currentStage is required");
  assert(typeof input.nextLegalAction === "string" && input.nextLegalAction.length > 0, "RoutingResult.nextLegalAction is required");
  assert(input.upstreamIdentity && (input.upstreamIdentity.id === null || typeof input.upstreamIdentity.id === "string") && /^[a-f0-9]{64}$/.test(input.upstreamIdentity.digest), "RoutingResult.upstreamIdentity is invalid");
  assert(/^[a-f0-9]{64}$/.test(input.upstreamDigest), "RoutingResult.upstreamDigest is invalid");
  assert(input.contractVersions && typeof input.contractVersions === "object", "RoutingResult.contractVersions are required");
  assert(input.externalSideEffects === false, "RoutingResult external side effects are forbidden");
  assert(Number.isInteger(input.duplicateCount) && input.duplicateCount >= 1, "RoutingResult.duplicateCount is invalid");
  assert(input.id === routeId(input), "RoutingResult.id is unstable");
  return json.immutableClone(input);
}

function classify({ input, runnerResult, duplicateCount = 1, duplicateOverride = false }) {
  runner.validateRunnerResult(runnerResult);
  const record = recordFromInput(input);
  const last = runnerResult.stageEnvelopes.at(-1);
  const reason = duplicateOverride ? "DUPLICATE-SEMANTIC-INPUT" : runnerResult.stopReason;
  let route;
  let nextLegalAction;
  let satisfied;
  let failed;
  if (duplicateOverride) {
    route = "RED";
    nextLegalAction = "REJECT-DUPLICATE-AND-RETAIN-EACH-FAILURE";
    satisfied = [];
    failed = ["semantic input uniqueness"];
  } else if (runnerResult.state === "ADVANCED" && runnerResult.stopReason === null) {
    route = "GREEN";
    nextLegalAction = "STOP-BEFORE-PRODUCTION-MATERIALIZATION";
    satisfied = ["runner result is ADVANCED", "authoritative downstream contracts accepted", "existing authorization was supplied where required", "external side effects are false"];
    failed = [];
  } else if (runnerResult.state === "SAFE-STOP" && ["HUMAN-REVIEW-REQUIRED", "PROMOTION-REVIEW-REQUIRED"].includes(reason)) {
    route = "YELLOW";
    nextLegalAction = reason === "PROMOTION-REVIEW-REQUIRED" ? "SUPPLY-EXISTING-PROMOTION-REVIEW-DECISION" : "SUPPLY-EXISTING-HUMAN-REVIEW-DECISION";
    satisfied = ["upstream artifact validated", "runner stopped at an explicit human boundary"];
    failed = [reason];
  } else {
    route = "RED";
    nextLegalAction = "REPAIR-OR-RESEARCH-INVALID-INPUT";
    satisfied = [];
    failed = [reason || "INCOMPATIBLE-STATE"];
  }
  const classificationReason = route === "GREEN" ? "SAFE-RUNNER-ADVANCED" : (reason || "INCOMPATIBLE-STATE");
  const packet = input && input.promotionReviewPacket;
  const targetIdentity = record && record.targetIdentity ? record.targetIdentity : null;
  const result = { schemaVersion: ROUTING_SCHEMA_VERSION, id: "placeholder", inputIdentity: identity(record, input), route, reasonCodes: [classificationReason].sort(), invariants: { satisfied, failed }, currentStage: last.stage, nextLegalAction, targetIdentity, canonicalFieldId: record && typeof record.canonicalFieldId === "string" ? record.canonicalFieldId : null, sourceIdentity: packet && packet.sourceIdentity ? packet.sourceIdentity : null, sourceProvenance: packet && packet.provenance ? packet.provenance : null, rawValue: record && Object.prototype.hasOwnProperty.call(record, "rawValue") ? record.rawValue : null, rawUnit: record && Object.prototype.hasOwnProperty.call(record, "rawUnit") ? record.rawUnit : null, applicability: packet && packet.applicability ? packet.applicability : null, condition: record && Object.prototype.hasOwnProperty.call(record, "condition") ? record.condition : null, upstreamIdentity: identity(record, input), upstreamDigest: digest(input), contractVersions: { runner: "SafeStageRunner/v1", routing: "RoutingResult/v1", packet: packet ? "PromotionReviewPacket/v1" : null, decision: input && input.promotionReviewDecision ? "PromotionReviewDecision/v1" : null, conversion: runnerResult.output ? "SchemaConversionProjection/v1" : null }, externalSideEffects: false, duplicateCount };
  result.id = routeId(result);
  return validateRoutingResult(result);
}

function routeBatch(records) {
  assert(Array.isArray(records) && records.length > 0, "Routing batch records are required");
  const keyed = records.map(item => { assert(item && item.input && item.runnerResult, "Routing batch record is incomplete"); return { ...item, key: digest(item.input) }; }).sort((a, b) => a.key.localeCompare(b.key));
  const multiplicity = new Map();
  keyed.forEach(item => multiplicity.set(item.key, (multiplicity.get(item.key) || 0) + 1));
  const routes = keyed.map(item => classify({ input: item.input, runnerResult: item.runnerResult, duplicateCount: multiplicity.get(item.key), duplicateOverride: multiplicity.get(item.key) > 1 }));
  return json.immutableClone({ routes, duplicateSemanticInputCount: [...multiplicity.values()].filter(count => count > 1).reduce((sum, count) => sum + count, 0) });
}

function classifyRuleEvaluation({ input, evaluation, duplicateCount = 1 }) {
  const ruleContracts = require("./deterministic-rule-contracts.js");
  ruleContracts.validateRuleEvaluationResult(evaluation);
  assert(input && typeof input === "object", "Rule-routing input is required");
  const record = recordFromInput(input);
  const route = evaluation.state === "NEEDS-HUMAN-REVIEW" || evaluation.state === "NOT-APPLICABLE" ? "YELLOW" : "RED";
  const reasonCode = evaluation.reasonCode === "DUPLICATE-SEMANTIC-INPUT" ? "DUPLICATE-SEMANTIC-INPUT" : evaluation.state === "NEEDS-HUMAN-REVIEW" ? "HUMAN-REVIEW-REQUIRED" : evaluation.state === "NOT-APPLICABLE" ? "RULE-NOT-APPLICABLE" : "RULE-EVALUATION-REJECTED";
  const result = { schemaVersion: ROUTING_SCHEMA_VERSION, id: "placeholder", inputIdentity: identity(record, input), route, reasonCodes: [reasonCode], invariants: { satisfied: evaluation.invariants.passed, failed: [...evaluation.invariants.failed, evaluation.reasonCode] }, currentStage: "DETERMINISTIC-RULE", nextLegalAction: route === "YELLOW" ? "SUPPLY-RECORD-LOCAL-HUMAN-INTERPRETATION" : reasonCode === "DUPLICATE-SEMANTIC-INPUT" ? "REJECT-DUPLICATE-AND-RETAIN-EACH-FAILURE" : "REPAIR-OR-RESEARCH-RULE-INPUT", targetIdentity: record && record.targetIdentity ? record.targetIdentity : null, canonicalFieldId: record && typeof record.canonicalFieldId === "string" ? record.canonicalFieldId : evaluation.canonicalFieldId, sourceIdentity: record && record.sourceIdentity ? record.sourceIdentity : null, sourceProvenance: record && record.provenance ? record.provenance : null, rawValue: record && Object.prototype.hasOwnProperty.call(record, "rawValue") ? record.rawValue : null, rawUnit: record && Object.prototype.hasOwnProperty.call(record, "rawUnit") ? record.rawUnit : null, applicability: record && record.applicability ? record.applicability : null, condition: record && Object.prototype.hasOwnProperty.call(record, "condition") ? record.condition : null, upstreamIdentity: identity(record, input), upstreamDigest: evaluation.upstreamDigest, contractVersions: { routing: "RoutingResult/v1", rule: "DeterministicRule/v1", evaluation: "RuleEvaluationResult/v1" }, externalSideEffects: false, duplicateCount };
  result.id = routeId(result);
  return validateRoutingResult(result);
}

function classifyInputHygiene({ input, hygiene }) {
  assert(input && typeof input === "object", "Input-hygiene routing input is required");
  assert(hygiene && ["EXACT-DUPLICATE", "CONFLICTING-DUPLICATE", "MALFORMED-INPUT"].includes(hygiene.status), "Input-hygiene status is not blocking");
  const record = recordFromInput(input);
  const reason = hygiene.status;
  const result = { schemaVersion: ROUTING_SCHEMA_VERSION, id: "placeholder", inputIdentity: identity(record, input), route: "RED", reasonCodes: [reason], invariants: { satisfied: [], failed: [hygiene.reason] }, currentStage: "INPUT-HYGIENE", nextLegalAction: reason === "EXACT-DUPLICATE" ? "RETAIN-TRACE-AND-SUPPRESS-DUPLICATE-WORK" : reason === "CONFLICTING-DUPLICATE" ? "REVIEW-CONFLICTING-DUPLICATE" : "REPAIR-INPUT-HYGIENE", targetIdentity: record && record.targetIdentity ? record.targetIdentity : null, canonicalFieldId: record && typeof record.canonicalFieldId === "string" ? record.canonicalFieldId : null, sourceIdentity: record && record.sourceIdentity ? record.sourceIdentity : null, sourceProvenance: record && record.provenance ? record.provenance : null, rawValue: record && Object.prototype.hasOwnProperty.call(record, "rawValue") ? record.rawValue : null, rawUnit: record && Object.prototype.hasOwnProperty.call(record, "rawUnit") ? record.rawUnit : null, applicability: record && record.applicability ? record.applicability : null, condition: record && Object.prototype.hasOwnProperty.call(record, "condition") ? record.condition : null, upstreamIdentity: identity(record, input), upstreamDigest: hygiene.inputIdentity.digest, contractVersions: { routing: "RoutingResult/v1", hygiene: "InputHygiene/v1" }, externalSideEffects: false, duplicateCount: hygiene.duplicateCount };
  result.id = routeId(result);
  return validateRoutingResult(result);
}

module.exports = Object.freeze({ ROUTING_SCHEMA_VERSION, ROUTES, ROUTING_REASONS, validateRoutingResult, classify, classifyRuleEvaluation, classifyInputHygiene, routeBatch });
