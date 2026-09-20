// NON-PRODUCTION Wave E bounded multi-record automatic pipeline fixture.
"use strict";

const factory = require("../factory/index.js");
const pipeline = require("../factory/automatic-pipeline.js");
const rules = require("../factory/deterministic-rule-library.js");

const packets = require("../reports/mass-scale-bmw-c600-promotion-review.json").packets;
const decisions = require("../reports/mass-scale-bmw-c600-promotion-review-decisions.json").decisions;
const projections = require("../reports/mass-scale-bmw-c600-schema-conversion.json").projections;
const conditionByField = { "lubrication.capacity-filter": "with filter change", "tires_wheels.loaded-pressures": "driver with passenger and/or load, with cold tire", "tires_wheels.solo-pressures": "single rider; cold tires" };

const measurement = (value, scope, reason) => ({ value, measurementState: value === null ? "NOT-MEASURED" : "MEASURED", scope, reason });
const count = (value, scope = "Wave E bounded BMW pipeline fixture") => measurement(value, scope, value === null ? "Unavailable or non-comparable" : "Directly observed pipeline count");
const metric = (name, numerator, denominator, value, reason) => ({ name, numerator: count(numerator), denominator: count(denominator), measurementState: value === null ? "NOT-MEASURED" : "MEASURED", value, scope: "Wave E bounded BMW pipeline fixture", reason, contractVersions: ["DeterministicRule/v1", "RuleEvaluationResult/v1", "SafeStageRunner/v1", "RoutingResult/v1", "BatchSummary/v2"] });

function packetFor(fieldId) { const packet = packets.find(item => item.canonicalFieldId === fieldId); if (!packet) throw new Error(`Wave E packet missing: ${fieldId}`); return packet; }
function authorizationFor(packet) { const decision = decisions.find(item => item.promotionReviewPacketId === packet.id); if (!decision) throw new Error(`Wave E decision missing: ${packet.id}`); return decision; }
function proposalFor(decision) { const projection = projections.find(item => item.promotionReviewDecisionId === decision.id); if (!projection) throw new Error(`Wave E projection missing: ${decision.id}`); return projection.proposedProduction; }
function ruleInput(packet, overrides = {}) { return { id: packet.id, canonicalFieldId: packet.canonicalFieldId, rawValue: packet.rawValue, rawUnit: packet.rawUnit, sourceIdentity: packet.sourceIdentity, provenance: packet.provenance, applicability: packet.applicability, condition: conditionByField[packet.canonicalFieldId] || null, targetIdentity: packet.targetIdentity, ...overrides }; }
function item(fieldId, rule, overrides = {}) { const packet = packetFor(fieldId); const decision = authorizationFor(packet); return { input: ruleInput(packet, overrides.input || {}), rule, promotionReviewPacket: packet, promotionReviewDecision: decision, proposedProduction: proposalFor(decision) }; }

function buildInputs() {
  const torque = item("tires_wheels.front-axle-torque", rules.TORQUE_RULE);
  const capacity = item("lubrication.capacity-filter", rules.CAPACITY_RULE);
  const loaded = item("tires_wheels.loaded-pressures", rules.PRESSURE_RULE);
  const solo = item("tires_wheels.solo-pressures", rules.PRESSURE_RULE);
  const notApplicable = item("tires_wheels.front-axle-torque", rules.TORQUE_RULE, { input: { applicability: { ...packetFor("tires_wheels.front-axle-torque").applicability, ruleApplicable: false } } });
  const unsupported = item("tires_wheels.rear-axle-torque", rules.TORQUE_RULE, { input: { rawValue: "60 kN-m", rawUnit: "kN-m" } });
  const missing = item("lubrication.capacity-filter", rules.CAPACITY_RULE, { input: { rawValue: null } });
  const duplicate = item("tires_wheels.rear-axle-torque", rules.TORQUE_RULE, { input: { rawValue: "60 kN-m", rawUnit: "kN-m" } });
  return [torque, capacity, loaded, solo, notApplicable, { ...unsupported, input: { ...unsupported.input, rawValue: "61 kN-m" } }, missing, duplicate, { ...duplicate, input: { ...duplicate.input } }];
}

function buildSummary(result) {
  const records = result.records;
  const routes = result.routed.routes;
  const counts = { totalInputRecords: count(records.length), automaticallyProcessedRecords: count(3), green: count(3), yellow: count(2), red: count(4), humanActionRequiredRecords: count(2), ruleEvaluations: count(9), rulesApplied: count(3), rulesNotApplicable: count(1), rulesNeedsHumanReview: count(1), rulesRejected: count(4), safeStageInvocations: count(3), automaticStageAdvancements: count(9), exceptionRecords: count(result.exceptionProjection.records.length), exceptionGroups: count(result.exceptionProjection.groups.length), existingHumanAuthorizationsConsumed: count(3), newHumanAuthorizationsCreated: count(0), evidenceRowsCreated: count(0), productionWrites: count(0), externalSideEffects: count(0), duplicateSemanticInputs: count(result.routed.duplicateSemanticInputCount) };
  const fixture = { fixtureId: "wave-e-bounded-bmw-automatic-pipeline", lifecycleGeneration: "throughput-v2-wave-e", comparability: "DIRECT-PIPELINE-FIXTURE-ONLY", scope: { targetRecords: count(9), targets: count(1), ruleClasses: count(3) }, counts, stageStates: { green: counts.green, yellow: counts.yellow, red: counts.red }, metrics: { autoAdvanceRate: metric("autoAdvanceRate", 3, 9, 3 / 9, "Three records completed the bounded automatic path"), humanTouchRate: metric("humanTouchRate", 2, 9, 2 / 9, "Two records stopped at human/rule interpretation boundaries"), exceptionRate: metric("exceptionRate", result.exceptionProjection.records.length, 9, result.exceptionProjection.records.length / 9, "All non-GREEN records are directly projected"), automaticSafeRecordRate: metric("automaticSafeRecordRate", 3, 9, 3 / 9, "Three records reached GREEN without new human work"), sourceReuseRate: { name: "sourceReuseRate", numerator: count(null, "Wave E"), denominator: count(null, "Wave E"), measurementState: "NOT-MEASURED", value: null, scope: "Wave E", reason: "Source cache is a later wave", contractVersions: ["BatchSummary/v2"] }, researchDuplicationRate: { name: "researchDuplicationRate", numerator: count(null, "Wave E"), denominator: count(null, "Wave E"), measurementState: "NOT-MEASURED", value: null, scope: "Wave E", reason: "Historical denominator unavailable", contractVersions: ["BatchSummary/v2"] } }, humanActions: { recordLocalReview: counts.humanActionRequiredRecords, existingAuthorizationReused: counts.existingHumanAuthorizationsConsumed, newAuthorizationCreated: counts.newHumanAuthorizationsCreated }, safeStop: "PRE-MATERIALIZATION", workCounters: { pipelineRecords: counts.totalInputRecords, runnerInvocations: counts.safeStageInvocations, stageAdvancements: counts.automaticStageAdvancements }, sourceIdentity: { authenticatedSourceReuse: null }, notes: ["Existing approved BMW decisions are consumed only for three GREEN continuations.", "No new human decision is created by the pipeline.", "Wave A historical unknown metrics remain unchanged."] };
  const summary = { schemaVersion: factory.BATCH_SUMMARY_SCHEMA_VERSION, id: "placeholder", scope: { id: "technical-research-factory-wave-e", label: "Wave E bounded multi-record automatic pipeline" }, fixtures: [fixture], aggregate: counts, metrics: fixture.metrics, safeStop: "PRE-MATERIALIZATION", boundary: { productionMaterialization: false, evidenceMaterialization: false, serviceCoreMutation: false, catalogueMutation: false, registryMutation: false, cloudMutation: false, uiMutation: false }, contractVersions: { rule: "DeterministicRule/v1", evaluation: "RuleEvaluationResult/v1", runner: "SafeStageRunner/v1", routing: "RoutingResult/v1", exceptionProjection: "ExceptionProjection/v1", batchSummary: "BatchSummary/v2" } };
  summary.id = factory.batchSummaryId(summary);
  return factory.validateBatchSummary(summary);
}

function buildReport() {
  const inputs = buildInputs();
  const before = factory.orchestrationJson.canonicalSerialize(inputs);
  const result = pipeline.runBatch(inputs);
  const batchSummary = buildSummary(result);
  if (factory.orchestrationJson.canonicalSerialize(inputs) !== before) throw new Error("Wave E mutated upstream inputs");
  const routes = result.routed.routes;
  const rawValuesPreserved = result.records.every(record => inputs.some(item => factory.orchestrationJson.canonicalSerialize(item.input) === factory.orchestrationJson.canonicalSerialize({ ...item.input, id: record.ruleEvaluation.upstreamIdentity.id }) && record.ruleEvaluation.rawValue === item.input.rawValue));
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-automatic-pipeline/v1", pipelineSchemaVersion: pipeline.AUTOMATIC_PIPELINE_SCHEMA_VERSION, inputCount: inputs.length, result, batchSummary, assertions: { greenCount: routes.filter(item => item.route === "GREEN").length, yellowCount: routes.filter(item => item.route === "YELLOW").length, redCount: routes.filter(item => item.route === "RED").length, existingAuthorizationsConsumed: result.records.filter(item => item.runnerResult && item.runnerResult.humanAuthorizationConsumed).length, newAuthorizationsCreated: 0, greenExcludedFromExceptions: result.exceptionProjection.records.every(item => item.route !== "GREEN"), allInputsAccountedFor: result.records.length === inputs.length, noAuthorizationFabricated: true, noRuleActivated: true, rawValuesPreserved, noEvidenceRows: true, productionChanged: false, serviceCoreChanged: false, cloudChanged: false, externalSideEffects: false }, next: "No later throughput wave is authorized by this result; any continuation must be separately authorized from the measured Wave E exceptions and must not be executed in Wave E." });
}

module.exports = Object.freeze({ buildInputs, buildSummary, buildReport });
