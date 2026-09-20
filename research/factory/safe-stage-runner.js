// NON-PRODUCTION deterministic orchestration around existing Factory contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const packetContracts = require("./promotion-review-contracts.js");
const decisionContracts = require("./promotion-review-decision-contracts.js");
const schemaConversion = require("./schema-conversion.js");

const SAFE_STAGE_RUNNER_SCHEMA_VERSION = 1;
const RUNNER_STATES = Object.freeze(["ADVANCED", "SAFE-STOP", "BLOCKED", "FAILED"]);
const STOP_REASONS = Object.freeze([
  "HUMAN-REVIEW-REQUIRED",
  "PROMOTION-REVIEW-REQUIRED",
  "DOWNSTREAM-CONTRACT-REJECTED",
  "MISSING-UPSTREAM-ARTIFACT",
  "INCOMPATIBLE-STATE",
  "UNSUPPORTED-STAGE",
  "EXTERNAL-WORK-NOT-AUTHORIZED",
  "DUPLICATE-SEMANTIC-INPUT",
  "PROMOTION-DECISION-MISMATCH"
]);
const STAGES = Object.freeze(["PROMOTION-REVIEW-PACKET", "PROMOTION-REVIEW", "SCHEMA-CONVERSION"]);
const ENVELOPE_FIELDS = new Set(["schemaVersion", "id", "stage", "inputIdentity", "contractVersion", "executionState", "outputIdentity", "stopReason", "lineage", "humanAuthorizationConsumed", "externalSideEffects"]);
const RESULT_FIELDS = new Set(["schemaVersion", "id", "state", "stageEnvelopes", "output", "stopReason", "humanAuthorizationConsumed", "externalSideEffects"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const identity = value => ({ id: typeof value.id === "string" ? value.id : null, digest: digest(value) });
const withoutId = value => { const { id, ...rest } = value; return rest; };
const envelopeId = envelope => `safe-stage-envelope.${digest(withoutId(envelope)).slice(0, 24)}`;
const resultId = result => `safe-stage-runner.${digest(withoutId(result)).slice(0, 24)}`;

function validateIdentity(value, label) {
  assert(value && (value.id === null || typeof value.id === "string") && /^[a-f0-9]{64}$/.test(value.digest), `${label} is invalid`);
  return value;
}

function validateStageEnvelope(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SAFE_STAGE_RUNNER_SCHEMA_VERSION, "Safe-stage envelope schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(ENVELOPE_FIELDS.has(field), `Safe-stage envelope.${field} is unsupported`));
  assert(typeof input.id === "string" && /^safe-stage-envelope\.[a-f0-9]{24}$/.test(input.id), "Safe-stage envelope.id is invalid");
  assert(STAGES.includes(input.stage), "Safe-stage envelope.stage is unsupported");
  validateIdentity(input.inputIdentity, "Safe-stage envelope.inputIdentity");
  assert(typeof input.contractVersion === "string" && input.contractVersion.length > 0, "Safe-stage envelope.contractVersion is required");
  assert(RUNNER_STATES.includes(input.executionState), "Safe-stage envelope.executionState is invalid");
  assert(input.outputIdentity === null || (input.outputIdentity && typeof input.outputIdentity.id === "string" && /^[a-f0-9]{64}$/.test(input.outputIdentity.digest)), "Safe-stage envelope.outputIdentity is invalid");
  assert(input.stopReason === null || STOP_REASONS.includes(input.stopReason), "Safe-stage envelope.stopReason is invalid");
  assert(input.lineage && (input.lineage.previousEnvelopeId === null || /^safe-stage-envelope\.[a-f0-9]{24}$/.test(input.lineage.previousEnvelopeId)), "Safe-stage envelope.lineage is invalid");
  assert(typeof input.humanAuthorizationConsumed === "boolean", "Safe-stage envelope.humanAuthorizationConsumed is invalid");
  assert(input.externalSideEffects === false, "Safe-stage runner external side effects are forbidden");
  assert(input.id === envelopeId(input), "Safe-stage envelope.id is unstable");
  return json.immutableClone(input);
}

function validateRunnerResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SAFE_STAGE_RUNNER_SCHEMA_VERSION, "Safe-stage runner schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(RESULT_FIELDS.has(field), `Safe-stage runner.${field} is unsupported`));
  assert(typeof input.id === "string" && /^safe-stage-runner\.[a-f0-9]{24}$/.test(input.id), "Safe-stage runner.id is invalid");
  assert(RUNNER_STATES.includes(input.state), "Safe-stage runner.state is invalid");
  assert(Array.isArray(input.stageEnvelopes) && input.stageEnvelopes.length > 0, "Safe-stage runner.stageEnvelopes are required");
  input.stageEnvelopes.forEach(validateStageEnvelope);
  assert(input.stopReason === null || STOP_REASONS.includes(input.stopReason), "Safe-stage runner.stopReason is invalid");
  assert(typeof input.humanAuthorizationConsumed === "boolean", "Safe-stage runner.humanAuthorizationConsumed is invalid");
  assert(input.externalSideEffects === false, "Safe-stage runner external side effects are forbidden");
  assert(input.id === resultId(input), "Safe-stage runner.id is unstable");
  return json.immutableClone(input);
}

function makeEnvelope({ stage, input, contractVersion, executionState, output = null, stopReason = null, previousEnvelopeId = null, humanAuthorizationConsumed = false }) {
  const envelope = { schemaVersion: SAFE_STAGE_RUNNER_SCHEMA_VERSION, id: "placeholder", stage, inputIdentity: identity(input), contractVersion, executionState, outputIdentity: output === null ? null : identity(output), stopReason, lineage: { previousEnvelopeId }, humanAuthorizationConsumed, externalSideEffects: false };
  envelope.id = envelopeId(envelope);
  return validateStageEnvelope(envelope);
}

function stoppedResult(envelopes, stopReason, humanAuthorizationConsumed = false) {
  const result = { schemaVersion: SAFE_STAGE_RUNNER_SCHEMA_VERSION, id: "placeholder", state: envelopes.at(-1).executionState, stageEnvelopes: envelopes, output: null, stopReason, humanAuthorizationConsumed, externalSideEffects: false };
  result.id = resultId(result);
  return validateRunnerResult(result);
}

function runPromotionReviewToConversion({ promotionReviewPacket, promotionReviewDecision = null, proposedProduction = null, blockedReasons = [] }) {
  if (!promotionReviewPacket) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW-PACKET", input: { missing: true }, contractVersion: "PromotionReviewPacket/v1", executionState: "BLOCKED", stopReason: "MISSING-UPSTREAM-ARTIFACT" });
    return stoppedResult([envelope], "MISSING-UPSTREAM-ARTIFACT");
  }
  let packet;
  try { packet = packetContracts.validatePromotionReviewPacket(promotionReviewPacket); } catch (error) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW-PACKET", input: promotionReviewPacket, contractVersion: "PromotionReviewPacket/v1", executionState: "BLOCKED", stopReason: "DOWNSTREAM-CONTRACT-REJECTED" });
    return stoppedResult([envelope], "DOWNSTREAM-CONTRACT-REJECTED");
  }
  const envelopes = [makeEnvelope({ stage: "PROMOTION-REVIEW-PACKET", input: packet, contractVersion: "PromotionReviewPacket/v1", executionState: "ADVANCED", output: packet })];
  if (!promotionReviewDecision) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW", input: packet, contractVersion: "PromotionReviewDecision/v1", executionState: "SAFE-STOP", stopReason: "PROMOTION-REVIEW-REQUIRED", previousEnvelopeId: envelopes[0].id });
    return stoppedResult([...envelopes, envelope], "PROMOTION-REVIEW-REQUIRED");
  }
  let decision;
  try { decision = decisionContracts.validatePromotionReviewDecision(promotionReviewDecision); } catch (error) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW", input: promotionReviewDecision, contractVersion: "PromotionReviewDecision/v1", executionState: "BLOCKED", stopReason: "DOWNSTREAM-CONTRACT-REJECTED", previousEnvelopeId: envelopes[0].id });
    return stoppedResult([...envelopes, envelope], "DOWNSTREAM-CONTRACT-REJECTED");
  }
  if (decision.promotionReviewPacketId !== packet.id || decision.promotionPacketId !== packet.promotionPacketId || decision.evidenceProcessingRecordId !== packet.evidenceProcessingRecordId || decision.canonicalFieldId !== packet.canonicalFieldId || decision.decision !== "APPROVED-FOR-CONVERSION") {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW", input: decision, contractVersion: "PromotionReviewDecision/v1", executionState: "BLOCKED", stopReason: "PROMOTION-DECISION-MISMATCH", previousEnvelopeId: envelopes[0].id });
    return stoppedResult([...envelopes, envelope], "PROMOTION-DECISION-MISMATCH");
  }
  const reviewEnvelope = makeEnvelope({ stage: "PROMOTION-REVIEW", input: packet, contractVersion: "PromotionReviewDecision/v1", executionState: "ADVANCED", output: decision, previousEnvelopeId: envelopes[0].id, humanAuthorizationConsumed: true });
  envelopes.push(reviewEnvelope);
  try {
    if (!proposedProduction) throw new TypeError("missing proposed production projection");
    const projection = schemaConversion.projectSchemaConversion({ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction, blockedReasons });
    envelopes.push(makeEnvelope({ stage: "SCHEMA-CONVERSION", input: decision, contractVersion: "SchemaConversionProjection/v1", executionState: "ADVANCED", output: projection, previousEnvelopeId: reviewEnvelope.id, humanAuthorizationConsumed: true }));
    const result = { schemaVersion: SAFE_STAGE_RUNNER_SCHEMA_VERSION, id: "placeholder", state: "ADVANCED", stageEnvelopes: envelopes, output: projection, stopReason: null, humanAuthorizationConsumed: true, externalSideEffects: false };
    result.id = resultId(result);
    return validateRunnerResult(result);
  } catch (error) {
    const envelope = makeEnvelope({ stage: "SCHEMA-CONVERSION", input: decision, contractVersion: "SchemaConversionProjection/v1", executionState: "BLOCKED", stopReason: "DOWNSTREAM-CONTRACT-REJECTED", previousEnvelopeId: reviewEnvelope.id, humanAuthorizationConsumed: true });
    return stoppedResult([...envelopes, envelope], "DOWNSTREAM-CONTRACT-REJECTED", true);
  }
}

function semanticScenarioDigest(input) { return digest({ promotionReviewPacket: input.promotionReviewPacket || null, promotionReviewDecision: input.promotionReviewDecision || null, proposedProduction: input.proposedProduction || null, blockedReasons: [...(input.blockedReasons || [])].sort() }); }

function runBatch(inputs) {
  assert(Array.isArray(inputs) && inputs.length > 0, "Safe-stage runner batch inputs are required");
  const keyed = inputs.map(input => ({ input, key: semanticScenarioDigest(input) })).sort((a, b) => a.key.localeCompare(b.key));
  if (keyed.some((item, index) => index > 0 && item.key === keyed[index - 1].key)) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW-PACKET", input: { duplicateSemanticInput: keyed[0].key }, contractVersion: "SafeStageRunnerBatch/v1", executionState: "FAILED", stopReason: "DUPLICATE-SEMANTIC-INPUT" });
    return [stoppedResult([envelope], "DUPLICATE-SEMANTIC-INPUT")];
  }
  return json.immutableClone(keyed.map(item => runPromotionReviewToConversion(item.input)));
}

function runStage({ stage, input }) {
  if (!STAGES.includes(stage)) {
    const envelope = makeEnvelope({ stage: "PROMOTION-REVIEW-PACKET", input: { requestedStage: stage, input: input || null }, contractVersion: "SafeStageRunner/v1", executionState: "FAILED", stopReason: "UNSUPPORTED-STAGE" });
    return stoppedResult([envelope], "UNSUPPORTED-STAGE");
  }
  throw new TypeError("Only the bounded promotion-review to schema-conversion proof path is executable in Wave B");
}

module.exports = Object.freeze({ SAFE_STAGE_RUNNER_SCHEMA_VERSION, RUNNER_STATES, STOP_REASONS, STAGES, validateStageEnvelope, validateRunnerResult, runPromotionReviewToConversion, runBatch, runStage, semanticScenarioDigest });
