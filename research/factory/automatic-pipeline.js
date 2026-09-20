// NON-PRODUCTION bounded composition of Wave B/C/D components. Read-only.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const rules = require("./deterministic-rule-library.js");
const runner = require("./safe-stage-runner.js");
const routing = require("./routing.js");
const exceptions = require("./exception-projection.js");
const hygiene = require("./input-hygiene.js");

const AUTOMATIC_PIPELINE_SCHEMA_VERSION = 1;
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const recordId = value => `automatic-pipeline-record.${digest(value).slice(0, 24)}`;
const pipelineId = value => `automatic-pipeline.${digest(value).slice(0, 24)}`;
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function semanticKey(item) { return digest({ input: item.input, ruleId: item.rule.id, promotionReviewDecision: item.promotionReviewDecision || null, proposedProduction: item.proposedProduction || null }); }

function processOne(item, duplicateCount = 1, duplicateEvaluation = null) {
  const evaluation = duplicateEvaluation || rules.evaluate(item.rule, item.input);
  let runnerResult = null;
  let routingResult;
  if (evaluation.state === "APPLIED" && duplicateCount === 1) {
    runnerResult = runner.runPromotionReviewToConversion({ promotionReviewPacket: item.promotionReviewPacket, promotionReviewDecision: item.promotionReviewDecision || null, proposedProduction: item.proposedProduction || null });
    routingResult = routing.classify({ input: { promotionReviewPacket: item.promotionReviewPacket, promotionReviewDecision: item.promotionReviewDecision || null, proposedProduction: item.proposedProduction || null }, runnerResult });
  } else {
    routingResult = routing.classifyRuleEvaluation({ input: item.input, evaluation, duplicateCount });
  }
  const result = { schemaVersion: AUTOMATIC_PIPELINE_SCHEMA_VERSION, id: "placeholder", inputIdentity: { id: typeof item.input.id === "string" ? item.input.id : null, digest: digest(item.input) }, ruleEvaluation: evaluation, runnerResult, routingResult, externalSideEffects: false, duplicateCount };
  result.id = recordId({ inputIdentity: result.inputIdentity, ruleEvaluationId: evaluation.id, runnerResultId: runnerResult && runnerResult.id, routingResultId: routingResult.id, duplicateCount });
  return json.immutableClone(result);
}

function runBatch(items) {
  assert(Array.isArray(items) && items.length > 0, "Automatic pipeline inputs are required");
  const keyed = items.map(item => { assert(item && item.input && item.rule, "Automatic pipeline input is incomplete"); return { item, key: semanticKey(item) }; }).sort((a, b) => a.key.localeCompare(b.key));
  const multiplicity = new Map(); keyed.forEach(entry => multiplicity.set(entry.key, (multiplicity.get(entry.key) || 0) + 1));
  const results = [];
  keyed.forEach(entry => {
    const duplicateCount = multiplicity.get(entry.key);
    if (duplicateCount > 1) {
      const duplicateEvaluations = rules.evaluateBatch(entry.item.rule, keyed.filter(other => other.key === entry.key).map(other => other.item.input));
      const duplicateIndex = keyed.filter(other => other.key === entry.key).findIndex(other => other === entry);
      results.push(processOne(entry.item, duplicateCount, duplicateEvaluations[duplicateIndex]));
    } else results.push(processOne(entry.item));
  });
  const routingResults = results.map(result => result.routingResult);
  const routed = { routes: routingResults, duplicateSemanticInputCount: [...multiplicity.values()].filter(count => count > 1).reduce((sum, count) => sum + count, 0) };
  return json.immutableClone({ schemaVersion: AUTOMATIC_PIPELINE_SCHEMA_VERSION, id: pipelineId({ records: results.map(result => result.id), routes: routingResults.map(result => result.id) }), records: results, routed, exceptionProjection: exceptions.project(routed), externalSideEffects: false });
}

function runAutonomousBatch(items) {
  const hygieneBatch = hygiene.analyzeBatch(items);
  const sourceBySemantic = new Map(items.map(item => [hygiene.semanticKey(item), item]));
  const processableStatuses = new Set(["VALID-UNIQUE-RECORD", "DISTINCT-CONDITIONAL-RECORD", "DISTINCT-APPLICABILITY-RECORD"]);
  const processed = new Map();
  hygieneBatch.records.filter(record => processableStatuses.has(record.status)).forEach(record => {
    const source = sourceBySemantic.get(record.semanticKey);
    if (source.rule) processed.set(record.semanticKey, runBatch([source]).records[0]);
  });
  hygieneBatch.records.filter(record => record.status === "EXACT-DUPLICATE" && record.occurrence === 1).forEach(record => {
    const source = sourceBySemantic.get(record.semanticKey);
    if (source && record.reason !== "raw value is missing") processed.set(record.semanticKey, runBatch([source]).records[0]);
  });
  const records = hygieneBatch.records.map(hygieneRecord => {
    const source = sourceBySemantic.get(hygieneRecord.semanticKey);
    const pipelineRecord = processed.get(hygieneRecord.semanticKey) && (hygieneRecord.status !== "EXACT-DUPLICATE" || hygieneRecord.occurrence === 1) ? processed.get(hygieneRecord.semanticKey) : null;
    const routingResult = pipelineRecord ? pipelineRecord.routingResult : hygieneRecord.status === "VALID-UNIQUE-RECORD" && !source.rule ? routing.classifyCapabilityGap({ input: source }) : routing.classifyInputHygiene({ input: source, hygiene: hygieneRecord });
    return { schemaVersion: 1, id: `autonomous-pipeline-record.${digest({ hygiene: hygieneRecord.id, pipeline: pipelineRecord && pipelineRecord.id, route: routingResult.id }).slice(0, 24)}`, inputIdentity: hygieneRecord.inputIdentity, hygiene: hygieneRecord, pipelineRecord, routingResult, downstreamWorkSuppressed: hygieneRecord.status === "EXACT-DUPLICATE" && hygieneRecord.occurrence > 1, externalSideEffects: false };
  }).sort((a, b) => a.id.localeCompare(b.id));
  const routed = { routes: records.map(record => record.routingResult), duplicateSemanticInputCount: records.filter(record => record.hygiene.status === "EXACT-DUPLICATE").length };
  return json.immutableClone({ schemaVersion: 1, id: pipelineId({ hygiene: hygieneBatch.id, records: records.map(record => record.id) }), inputHygiene: hygieneBatch, records, routed, exceptionProjection: exceptions.project(routed), metrics: { batchCompletedWithoutOperatorInterruption: true, newHumanAuthorizationsCreated: 0, externalSideEffects: false }, externalSideEffects: false });
}

module.exports = Object.freeze({ AUTOMATIC_PIPELINE_SCHEMA_VERSION, runBatch, runAutonomousBatch, semanticKey });
