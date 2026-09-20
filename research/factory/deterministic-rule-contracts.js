// NON-PRODUCTION versioned deterministic rule contracts.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const DETERMINISTIC_RULE_SCHEMA_VERSION = 1;
const RULE_EVALUATION_SCHEMA_VERSION = 1;
const RULE_EVALUATION_STATES = Object.freeze(["APPLIED", "NOT-APPLICABLE", "NEEDS-HUMAN-REVIEW", "REJECTED"]);
const RULE_REASONS = Object.freeze(["RULE-APPLIED", "RULE-NOT-APPLICABLE", "RAW-VALUE-MISSING", "REQUIRED-UNIT-MISSING", "UNSUPPORTED-UNIT", "MALFORMED-NUMERIC-VALUE", "AMBIGUOUS-COMPOUND-VALUE", "CONDITION-REQUIRED", "CONDITION-LOSS", "INCOMPATIBLE-CANONICAL-FIELD", "PROVENANCE-MISSING", "SOURCE-IDENTITY-MISSING", "APPLICABILITY-INSUFFICIENT", "RULE-VERSION-MISMATCH", "DUPLICATE-SEMANTIC-INPUT"]);
const ruleFields = new Set(["schemaVersion", "id", "ruleKey", "ruleVersion", "family", "supportedCanonicalFieldIds", "inputRepresentation", "applicabilityRequirements", "preconditions", "outputSemantics", "failureReasons", "provenanceBehavior", "rawValuePreserved"]);
const resultFields = new Set(["schemaVersion", "id", "ruleId", "ruleKey", "ruleVersion", "state", "reasonCode", "upstreamIdentity", "upstreamDigest", "canonicalFieldId", "rawValue", "rawUnit", "sourceIdentity", "provenance", "applicability", "condition", "invariants", "output", "nextLegalAction", "externalSideEffects", "duplicateCount"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const withoutId = value => { const { id, ...rest } = value; return rest; };
const ruleId = value => `deterministic-rule.${digest(withoutId(value)).slice(0, 24)}`;
const ruleEvaluationId = value => `rule-evaluation.${digest(withoutId(value)).slice(0, 24)}`;

function validateRule(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === DETERMINISTIC_RULE_SCHEMA_VERSION, "DeterministicRule schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(ruleFields.has(field), `DeterministicRule.${field} is unsupported`));
  assert(typeof input.id === "string" && /^deterministic-rule\.[a-f0-9]{24}$/.test(input.id), "DeterministicRule.id is invalid");
  assert(typeof input.ruleKey === "string" && input.ruleKey.length > 0, "DeterministicRule.ruleKey is required");
  assert(typeof input.ruleVersion === "string" && /^\d+\.\d+\.\d+$/.test(input.ruleVersion), "DeterministicRule.ruleVersion is invalid");
  assert(typeof input.family === "string" && input.family.length > 0, "DeterministicRule.family is required");
  assert(Array.isArray(input.supportedCanonicalFieldIds) && input.supportedCanonicalFieldIds.length > 0, "DeterministicRule.supportedCanonicalFieldIds are required");
  assert(input.inputRepresentation && typeof input.inputRepresentation === "object", "DeterministicRule.inputRepresentation is required");
  assert(input.applicabilityRequirements && typeof input.applicabilityRequirements === "object", "DeterministicRule.applicabilityRequirements are required");
  assert(Array.isArray(input.preconditions) && input.preconditions.length > 0, "DeterministicRule.preconditions are required");
  assert(input.outputSemantics && typeof input.outputSemantics === "object", "DeterministicRule.outputSemantics are required");
  assert(Array.isArray(input.failureReasons) && input.failureReasons.every(reason => RULE_REASONS.includes(reason)), "DeterministicRule.failureReasons are invalid");
  assert(input.provenanceBehavior && input.provenanceBehavior.preserveRawValue === true && input.provenanceBehavior.preserveSourceIdentity === true && input.provenanceBehavior.preserveSourceLocation === true, "DeterministicRule.provenanceBehavior is unsafe");
  assert(input.rawValuePreserved === true, "DeterministicRule.rawValuePreserved is required");
  assert(input.id === ruleId(input), "DeterministicRule.id is unstable");
  return json.immutableClone(input);
}

function validateRuleEvaluationResult(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === RULE_EVALUATION_SCHEMA_VERSION, "RuleEvaluationResult schemaVersion is incompatible");
  Object.keys(input).forEach(field => assert(resultFields.has(field), `RuleEvaluationResult.${field} is unsupported`));
  assert(typeof input.id === "string" && /^rule-evaluation\.[a-f0-9]{24}$/.test(input.id), "RuleEvaluationResult.id is invalid");
  assert(typeof input.ruleId === "string" && /^deterministic-rule\.[a-f0-9]{24}$/.test(input.ruleId), "RuleEvaluationResult.ruleId is invalid");
  assert(typeof input.ruleKey === "string" && input.ruleKey.length > 0, "RuleEvaluationResult.ruleKey is required");
  assert(typeof input.ruleVersion === "string" && /^\d+\.\d+\.\d+$/.test(input.ruleVersion), "RuleEvaluationResult.ruleVersion is invalid");
  assert(RULE_EVALUATION_STATES.includes(input.state), "RuleEvaluationResult.state is invalid");
  assert(RULE_REASONS.includes(input.reasonCode), "RuleEvaluationResult.reasonCode is invalid");
  assert(input.upstreamIdentity && (input.upstreamIdentity.id === null || typeof input.upstreamIdentity.id === "string") && /^[a-f0-9]{64}$/.test(input.upstreamIdentity.digest), "RuleEvaluationResult.upstreamIdentity is invalid");
  assert(/^[a-f0-9]{64}$/.test(input.upstreamDigest), "RuleEvaluationResult.upstreamDigest is invalid");
  assert(typeof input.canonicalFieldId === "string" && input.canonicalFieldId.length > 0, "RuleEvaluationResult.canonicalFieldId is required");
  assert(input.invariants && Array.isArray(input.invariants.passed) && Array.isArray(input.invariants.failed), "RuleEvaluationResult.invariants are required");
  assert(typeof input.nextLegalAction === "string" && input.nextLegalAction.length > 0, "RuleEvaluationResult.nextLegalAction is required");
  assert(input.externalSideEffects === false, "RuleEvaluationResult external side effects are forbidden");
  assert(Number.isInteger(input.duplicateCount) && input.duplicateCount >= 1, "RuleEvaluationResult.duplicateCount is invalid");
  assert(input.id === ruleEvaluationId(input), "RuleEvaluationResult.id is unstable");
  return json.immutableClone(input);
}

module.exports = Object.freeze({ DETERMINISTIC_RULE_SCHEMA_VERSION, RULE_EVALUATION_SCHEMA_VERSION, RULE_EVALUATION_STATES, RULE_REASONS, ruleId, ruleEvaluationId, validateRule, validateRuleEvaluationResult });
