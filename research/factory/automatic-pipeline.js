// NON-PRODUCTION bounded composition of Wave B/C/D components. Read-only.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const rules = require("./deterministic-rule-library.js");
const runner = require("./safe-stage-runner.js");
const routing = require("./routing.js");
const exceptions = require("./exception-projection.js");

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

module.exports = Object.freeze({ AUTOMATIC_PIPELINE_SCHEMA_VERSION, runBatch, semanticKey });
