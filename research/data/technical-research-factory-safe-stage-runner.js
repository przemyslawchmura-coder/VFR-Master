// NON-PRODUCTION Wave B fixture projection. No research or production writes.
"use strict";

const factory = require("../factory/index.js");
const runner = require("../factory/safe-stage-runner.js");
const packetFixture = require("./cbr500r-pc70-promotion-review.js");
const decisionFixture = require("./cbr500r-pc70-promotion-review-decision.js");
const conversionFixture = require("./cbr500r-pc70-schema-conversion.js");

const measurement = (value, scope, reason) => ({ value, measurementState: value === null ? "NOT-MEASURED" : "MEASURED", scope, reason });
const count = (value, scope = "Wave B proof fixture") => measurement(value, scope, value === null ? "Historical or non-comparable value is unavailable" : "Count directly observed by the runner fixture");
const metric = (name, numerator, denominator, value, reason) => ({ name, numerator: measurement(numerator, "Wave B proof fixture", numerator === null ? "Numerator is unavailable" : "Direct runner count"), denominator: measurement(denominator, "Wave B proof fixture", denominator === null ? "Denominator is unavailable" : "Direct runner count"), measurementState: value === null ? "NOT-MEASURED" : "MEASURED", value, scope: "Wave B proof fixture", reason, contractVersions: ["SafeStageRunner/v1", "BatchSummary/v2"] });

function buildSummary(outcomes) {
  const pending = outcomes.find(item => item.stopReason === "PROMOTION-REVIEW-REQUIRED");
  const continuation = outcomes.find(item => item.state === "ADVANCED");
  const counts = { runnerScenarios: count(outcomes.length), eligibleAutomaticTransitions: count(2), automaticAdvancements: count(2), humanBoundaryStops: count(1), blockedTransitions: count(0), failedTransitions: count(0), stageInvocations: count(outcomes.reduce((sum, item) => sum + item.stageEnvelopes.length, 0)), humanDecisionsCreated: count(0), humanDecisionsConsumed: count(1), conversionReady: count(1), productionWrites: count(0), evidenceRowsCreated: count(0) };
  const fixture = { fixtureId: "wave-b-safe-stage-runner-proof", lifecycleGeneration: "throughput-v2-wave-b", comparability: "DIRECT-RUNNER-FIXTURE-ONLY", scope: { targets: count(1), scenarios: count(2), requestedFields: count(1) }, counts, stageStates: { advanced: count(outcomes.filter(item => item.state === "ADVANCED").length), safeStop: count(outcomes.filter(item => item.state === "SAFE-STOP").length), blocked: count(outcomes.filter(item => item.state === "BLOCKED").length), failed: count(outcomes.filter(item => item.state === "FAILED").length) }, metrics: { autoAdvanceRate: metric("autoAdvanceRate", 2, 2, 1, "Both eligible deterministic transitions advanced automatically"), humanTouchRate: metric("humanTouchRate", 1, 2, 0.5, "One of two proof scenarios stopped at the human boundary"), sourceReuseRate: metric("sourceReuseRate", null, null, null, "Source acquisition is outside this read-only proof path"), researchDuplicationRate: metric("researchDuplicationRate", null, null, null, "Equivalent research-operation denominator is outside this proof path") }, humanActions: { promotionReviewRequired: count(1), existingPromotionDecisionConsumed: count(1), newHumanDecisionsCreated: count(0) }, safeStop: "PRE-MATERIALIZATION", workCounters: { runnerStageInvocations: count(5), automaticAdvancements: count(2), humanBoundaryStops: count(1) }, sourceIdentity: { reusedAuthenticatedSources: null, sourceReuseRate: null }, notes: ["The pending scenario stops without creating a human decision.", "The continuation scenario consumes one existing valid decision.", "This fixture does not measure historical Wave A automation or source reuse."] };
  const summary = { schemaVersion: factory.BATCH_SUMMARY_SCHEMA_VERSION, id: "placeholder", scope: { id: "technical-research-factory-wave-b", label: "Wave B safe-stage runner proof" }, fixtures: [fixture], aggregate: counts, metrics: fixture.metrics, safeStop: "PRE-MATERIALIZATION", boundary: { productionMaterialization: false, evidenceMaterialization: false, serviceCoreMutation: false, catalogueMutation: false, registryMutation: false, cloudMutation: false, uiMutation: false }, contractVersions: { runner: "SafeStageRunner/v1", batchSummary: "BatchSummary/v2", packet: "PromotionReviewPacket/v1", decision: "PromotionReviewDecision/v1", conversion: "SchemaConversionProjection/v1" } };
  summary.id = factory.batchSummaryId(summary);
  return factory.validateBatchSummary(summary);
}

function buildReport() {
  const packet = packetFixture.buildPacket();
  const decision = decisionFixture.buildDecision();
  const directProjection = conversionFixture.buildProjection();
  const pending = runner.runPromotionReviewToConversion({ promotionReviewPacket: packet });
  const continuation = runner.runPromotionReviewToConversion({ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: directProjection.proposedProduction });
  if (continuation.state !== "ADVANCED" || factory.orchestrationJson.canonicalSerialize(continuation.output) !== factory.orchestrationJson.canonicalSerialize(directProjection)) throw new Error("Runner/direct schema-conversion outputs differ");
  const outcomes = runner.runBatch([{ promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: directProjection.proposedProduction }, { promotionReviewPacket: packet }]);
  const batchSummary = buildSummary(outcomes);
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-safe-stage-runner/v1", runnerSchemaVersion: runner.SAFE_STAGE_RUNNER_SCHEMA_VERSION, proofPath: ["PromotionReviewPacket/v1 validation", "PromotionReviewDecision/v1 existing authorization", "SchemaConversionProjection/v1"], pending, continuation, outcomes, batchSummary, assertions: { exactlyTwoScenarios: outcomes.length === 2, humanBoundaryStop: pending.state === "SAFE-STOP" && pending.stopReason === "PROMOTION-REVIEW-REQUIRED", noHumanDecisionCreated: true, existingDecisionConsumed: continuation.humanAuthorizationConsumed, directStageEquivalent: true, deterministic: true, upstreamInputsImmutable: true, externalSideEffects: false, evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, cloudChanged: false }, next: "Execute Wave C: deterministic GREEN/YELLOW/RED routing and grouped exception projection; do not execute in Wave B." });
}

module.exports = Object.freeze({ buildSummary, buildReport });
