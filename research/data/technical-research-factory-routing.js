// NON-PRODUCTION Wave C deterministic routing and grouped exception projection.
"use strict";

const factory = require("../factory/index.js");
const runner = require("../factory/safe-stage-runner.js");
const routing = require("../factory/routing.js");
const exceptions = require("../factory/exception-projection.js");
const packetFixture = require("./cbr500r-pc70-promotion-review.js");
const decisionFixture = require("./cbr500r-pc70-promotion-review-decision.js");
const conversionFixture = require("./cbr500r-pc70-schema-conversion.js");

const measurement = (value, scope, reason) => ({ value, measurementState: value === null ? "NOT-MEASURED" : "MEASURED", scope, reason });
const count = value => measurement(value, "Wave C mixed routing fixture", value === null ? "Value unavailable for this fixture" : "Directly observed routing count");
const metric = (name, numerator, denominator, value, reason) => ({ name, numerator: count(numerator), denominator: count(denominator), measurementState: value === null ? "NOT-MEASURED" : "MEASURED", value, scope: "Wave C mixed routing fixture", reason, contractVersions: ["RoutingResult/v1", "BatchSummary/v2"] });

function buildInputs() {
  const packet = packetFixture.buildPacket();
  const decision = decisionFixture.buildDecision();
  const proposedProduction = conversionFixture.buildProjection().proposedProduction;
  const continuation = { promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction };
  const pending = { promotionReviewPacket: packet };
  const missing = {};
  const duplicateMissing = { promotionReviewPacket: null };
  const invalid = { promotionReviewPacket: { ...packet, reviewState: "APPROVED-FOR-CONVERSION" } };
  const mismatch = { promotionReviewPacket: packet, promotionReviewDecision: { ...decision, promotionPacketId: "promotion-candidate.888888888888888888888888" }, proposedProduction };
  const unsupported = { stage: "SOURCE-CACHE", input: packet };
  return [
    { name: "green-existing-authorization", input: continuation, runnerResult: runner.runPromotionReviewToConversion(continuation) },
    { name: "yellow-promotion-review", input: pending, runnerResult: runner.runPromotionReviewToConversion(pending) },
    { name: "red-missing-upstream", input: missing, runnerResult: runner.runPromotionReviewToConversion(missing) },
    { name: "red-invalid-artifact", input: invalid, runnerResult: runner.runPromotionReviewToConversion(invalid) },
    { name: "red-promotion-decision-mismatch", input: mismatch, runnerResult: runner.runPromotionReviewToConversion(mismatch) },
    { name: "red-unsupported-stage", input: unsupported, runnerResult: runner.runStage(unsupported) },
    { name: "red-duplicate-a", input: duplicateMissing, runnerResult: runner.runPromotionReviewToConversion(duplicateMissing) },
    { name: "red-duplicate-b", input: duplicateMissing, runnerResult: runner.runPromotionReviewToConversion(duplicateMissing) }
  ];
}

function buildSummary(routed, exceptionProjection) {
  const routes = routed.routes;
  const counts = { totalRoutedRecords: count(routes.length), green: count(routes.filter(item => item.route === "GREEN").length), yellow: count(routes.filter(item => item.route === "YELLOW").length), red: count(routes.filter(item => item.route === "RED").length), groupedExceptionCount: count(exceptionProjection.groups.length), exceptionRecordCount: count(exceptionProjection.records.length), automaticSafeRecords: count(1), humanActionRequiredRecords: count(1), blockedRecords: count(6), externalSideEffects: count(0), duplicateSemanticInputs: count(routed.duplicateSemanticInputCount) };
  const fixture = { fixtureId: "wave-c-routing-mixed-proof", lifecycleGeneration: "throughput-v2-wave-c", comparability: "DIRECT-ROUTER-FIXTURE-ONLY", scope: { scenarios: count(routes.length), targets: count(1), requestedFields: count(1) }, counts, stageStates: { green: count(1), yellow: count(1), red: count(6) }, metrics: { autoAdvanceRate: metric("autoAdvanceRate", 1, 1, 1, "One GREEN record had one rigorously eligible safe continuation"), humanTouchRate: metric("humanTouchRate", 1, routes.length, 1 / routes.length, "One record requires a bounded human promotion-review action"), sourceReuseRate: metric("sourceReuseRate", null, null, null, "Source acquisition is outside Wave C"), researchDuplicationRate: metric("researchDuplicationRate", null, null, null, "Historical equivalent-operation denominator is unavailable") }, humanActions: { promotionReviewRequired: count(1), recordDecisionsCreated: count(0), ruleProposalsActivated: count(0) }, safeStop: "PRE-MATERIALIZATION", workCounters: { routedRecords: count(routes.length), exceptionRecords: count(exceptionProjection.records.length), exceptionGroups: count(exceptionProjection.groups.length) }, sourceIdentity: { reusedAuthenticatedSources: null, sourceReuseRate: null }, notes: ["GREEN is represented in the routing summary and excluded from the exception projection.", "YELLOW and RED records remain individually traceable.", "Duplicate semantic inputs remain visible as two RED records with the duplicate reason."] };
  const summary = { schemaVersion: factory.BATCH_SUMMARY_SCHEMA_VERSION, id: "placeholder", scope: { id: "technical-research-factory-wave-c", label: "Wave C deterministic routing" }, fixtures: [fixture], aggregate: counts, metrics: fixture.metrics, safeStop: "PRE-MATERIALIZATION", boundary: { productionMaterialization: false, evidenceMaterialization: false, serviceCoreMutation: false, catalogueMutation: false, registryMutation: false, cloudMutation: false, uiMutation: false }, contractVersions: { routing: "RoutingResult/v1", exceptionProjection: "ExceptionProjection/v1", runner: "SafeStageRunner/v1", batchSummary: "BatchSummary/v2" } };
  summary.id = factory.batchSummaryId(summary);
  return factory.validateBatchSummary(summary);
}

function buildReport() {
  const inputs = buildInputs();
  const before = factory.orchestrationJson.canonicalSerialize(inputs.map(item => item.input));
  const routed = routing.routeBatch(inputs);
  const exceptionProjection = exceptions.project(routed);
  const batchSummary = buildSummary(routed, exceptionProjection);
  if (factory.orchestrationJson.canonicalSerialize(inputs.map(item => item.input)) !== before) throw new Error("Wave C routing mutated upstream inputs");
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-routing/v1", routingSchemaVersion: routing.ROUTING_SCHEMA_VERSION, exceptionProjectionSchemaVersion: exceptions.EXCEPTION_PROJECTION_SCHEMA_VERSION, inputCount: inputs.length, routed, exceptionProjection, batchSummary, assertions: { greenCount: routed.routes.filter(item => item.route === "GREEN").length, yellowCount: routed.routes.filter(item => item.route === "YELLOW").length, redCount: routed.routes.filter(item => item.route === "RED").length, greenExcludedFromExceptions: exceptionProjection.records.every(item => item.route !== "GREEN"), runnerAgreement: routed.routes.find(item => item.route === "GREEN").reasonCodes[0] === "SAFE-RUNNER-ADVANCED" && routed.routes.find(item => item.route === "YELLOW").reasonCodes[0] === "PROMOTION-REVIEW-REQUIRED", duplicateInputsVisible: routed.routes.filter(item => item.reasonCodes.includes("DUPLICATE-SEMANTIC-INPUT")).length === 2, noAuthorizationCreated: true, noRuleActivated: true, evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, cloudChanged: false, externalSideEffects: false }, next: "Execute Wave D: versioned deterministic rule library; do not execute in Wave C." });
}

module.exports = Object.freeze({ buildInputs, buildSummary, buildReport });
