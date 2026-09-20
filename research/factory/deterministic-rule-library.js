// NON-PRODUCTION small versioned deterministic rule library. No authorization or writes.
"use strict";

const contracts = require("./deterministic-rule-contracts.js");
const json = require("./json.js");

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => require("node:crypto").createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const conditionFor = input => typeof input.condition === "string" ? input.condition : input.provenance && input.provenance.sourceLocation && input.provenance.sourceLocation.tableOrSubsection;

function createRule(definition) {
  const rule = { schemaVersion: contracts.DETERMINISTIC_RULE_SCHEMA_VERSION, id: "placeholder", ...definition };
  rule.id = contracts.ruleId(rule);
  return contracts.validateRule(rule);
}

const TORQUE_RULE = createRule({ ruleKey: "torque.explicit-metric-pair", ruleVersion: "1.0.0", family: "TORQUE", supportedCanonicalFieldIds: ["tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque", "torques.brake-calipers"], inputRepresentation: { rawValue: "single explicit Nm value or one lb/ft plus Nm pair", rawUnit: "null; units must be explicit in rawValue" }, applicabilityRequirements: { modelYear: "KNOWN|SUFFICIENT", market: "KNOWN|SUFFICIENT", equipment: "SUFFICIENT|KNOWN", context: "SUFFICIENT" }, preconditions: ["one scalar torque value", "metric Nm value is explicit when imperial pair is present", "no compound value"], outputSemantics: { normalizedUnit: "Nm", preservesRawWording: true }, failureReasons: ["RAW-VALUE-MISSING", "REQUIRED-UNIT-MISSING", "UNSUPPORTED-UNIT", "MALFORMED-NUMERIC-VALUE", "AMBIGUOUS-COMPOUND-VALUE", "INCOMPATIBLE-CANONICAL-FIELD", "PROVENANCE-MISSING", "SOURCE-IDENTITY-MISSING", "APPLICABILITY-INSUFFICIENT", "DUPLICATE-SEMANTIC-INPUT"], provenanceBehavior: { preserveRawValue: true, preserveSourceIdentity: true, preserveSourceLocation: true }, rawValuePreserved: true });
const CAPACITY_RULE = createRule({ ruleKey: "capacity.explicit-metric-pair", ruleVersion: "1.0.0", family: "CAPACITY", supportedCanonicalFieldIds: ["fuel_intake.tank-capacity", "lubrication.capacity-filter"], inputRepresentation: { rawValue: "one explicit imperial plus litre pair", rawUnit: "null; units must be explicit in rawValue" }, applicabilityRequirements: { modelYear: "KNOWN|SUFFICIENT", market: "KNOWN|SUFFICIENT", equipment: "SUFFICIENT|KNOWN", context: "SUFFICIENT" }, preconditions: ["one scalar capacity value", "metric litre value is explicit", "field condition is retained where required"], outputSemantics: { normalizedUnit: "L", preservesRawWording: true }, failureReasons: ["RAW-VALUE-MISSING", "REQUIRED-UNIT-MISSING", "UNSUPPORTED-UNIT", "MALFORMED-NUMERIC-VALUE", "AMBIGUOUS-COMPOUND-VALUE", "CONDITION-REQUIRED", "CONDITION-LOSS", "INCOMPATIBLE-CANONICAL-FIELD", "PROVENANCE-MISSING", "SOURCE-IDENTITY-MISSING", "APPLICABILITY-INSUFFICIENT", "DUPLICATE-SEMANTIC-INPUT"], provenanceBehavior: { preserveRawValue: true, preserveSourceIdentity: true, preserveSourceLocation: true }, rawValuePreserved: true });
const BATTERY_CAPACITY_RULE = createRule({ ruleKey: "battery-capacity.explicit-ah-scalar", ruleVersion: "1.0.0", family: "BATTERY-CAPACITY", supportedCanonicalFieldIds: ["electrical.battery-capacity"], inputRepresentation: { rawValue: "one explicit Ah scalar, optionally prefixed by battery-capacity wording", rawUnit: "null; Ah must be explicit in rawValue" }, applicabilityRequirements: { modelYear: "KNOWN|SUFFICIENT", market: "KNOWN|SUFFICIENT", equipment: "SUFFICIENT|KNOWN", context: "SUFFICIENT" }, preconditions: ["one scalar battery-capacity value", "Ah unit is explicit", "no compound voltage/capacity value", "condition is absent or preserved"], outputSemantics: { normalizedUnit: "Ah", preservesRawWording: true }, failureReasons: ["RAW-VALUE-MISSING", "REQUIRED-UNIT-MISSING", "UNSUPPORTED-UNIT", "MALFORMED-NUMERIC-VALUE", "AMBIGUOUS-COMPOUND-VALUE", "CONDITION-LOSS", "INCOMPATIBLE-CANONICAL-FIELD", "PROVENANCE-MISSING", "SOURCE-IDENTITY-MISSING", "APPLICABILITY-INSUFFICIENT", "DUPLICATE-SEMANTIC-INPUT"], provenanceBehavior: { preserveRawValue: true, preserveSourceIdentity: true, preserveSourceLocation: true }, rawValuePreserved: true });
const PRESSURE_RULE = createRule({ ruleKey: "pressure.explicit-metric-pair", ruleVersion: "1.0.0", family: "PRESSURE", supportedCanonicalFieldIds: ["tires_wheels.solo-pressures", "tires_wheels.loaded-pressures"], inputRepresentation: { rawValue: "one explicit psi plus bar pair and explicit condition", rawUnit: "null; units must be explicit in rawValue" }, applicabilityRequirements: { modelYear: "KNOWN|SUFFICIENT", market: "KNOWN|SUFFICIENT", equipment: "SUFFICIENT|KNOWN", context: "SUFFICIENT" }, preconditions: ["one scalar pressure value", "metric bar value is explicit", "condition is preserved exactly", "no front/rear compound value"], outputSemantics: { normalizedUnit: "bar", preservesRawWording: true }, failureReasons: ["RAW-VALUE-MISSING", "REQUIRED-UNIT-MISSING", "UNSUPPORTED-UNIT", "MALFORMED-NUMERIC-VALUE", "AMBIGUOUS-COMPOUND-VALUE", "CONDITION-REQUIRED", "CONDITION-LOSS", "INCOMPATIBLE-CANONICAL-FIELD", "PROVENANCE-MISSING", "SOURCE-IDENTITY-MISSING", "APPLICABILITY-INSUFFICIENT", "DUPLICATE-SEMANTIC-INPUT"], provenanceBehavior: { preserveRawValue: true, preserveSourceIdentity: true, preserveSourceLocation: true }, rawValuePreserved: true });
const RULES = Object.freeze({ [TORQUE_RULE.ruleKey]: TORQUE_RULE, [CAPACITY_RULE.ruleKey]: CAPACITY_RULE, [BATTERY_CAPACITY_RULE.ruleKey]: BATTERY_CAPACITY_RULE, [PRESSURE_RULE.ruleKey]: PRESSURE_RULE });

function baseResult(rule, input, state, reasonCode, passed, failed, output = null, nextLegalAction = "NO-AUTOMATIC-ACTION", duplicateCount = 1) {
  const record = input && typeof input === "object" ? input : {};
  const result = { schemaVersion: contracts.RULE_EVALUATION_SCHEMA_VERSION, id: "placeholder", ruleId: rule.id, ruleKey: rule.ruleKey, ruleVersion: rule.ruleVersion, state, reasonCode, upstreamIdentity: { id: typeof record.id === "string" ? record.id : null, digest: digest(record) }, upstreamDigest: digest(record), canonicalFieldId: typeof record.canonicalFieldId === "string" ? record.canonicalFieldId : "unknown.field", rawValue: Object.prototype.hasOwnProperty.call(record, "rawValue") ? record.rawValue : null, rawUnit: Object.prototype.hasOwnProperty.call(record, "rawUnit") ? record.rawUnit : null, sourceIdentity: record.sourceIdentity || null, provenance: record.provenance || null, applicability: record.applicability || null, condition: Object.prototype.hasOwnProperty.call(record, "condition") ? record.condition : null, invariants: { passed, failed }, output, nextLegalAction, externalSideEffects: false, duplicateCount };
  result.id = contracts.ruleEvaluationId(result);
  return contracts.validateRuleEvaluationResult(result);
}

function rejected(rule, input, reasonCode, failed, nextLegalAction = "REPAIR-OR-RESEARCH-RULE-INPUT") { return baseResult(rule, input, "REJECTED", reasonCode, [], failed, null, nextLegalAction); }
function human(rule, input, reasonCode, failed) { return baseResult(rule, input, "NEEDS-HUMAN-REVIEW", reasonCode, ["rule identity and source lineage are present"], failed, null, "SUPPLY-RECORD-LOCAL-HUMAN-INTERPRETATION"); }

function parseInput(rule, input) {
  if (!input || typeof input !== "object") return { result: rejected(rule, {}, "RAW-VALUE-MISSING", ["input record is missing"]) };
  if (input.applicability && input.applicability.ruleApplicable === false) return { result: baseResult(rule, input, "NOT-APPLICABLE", "RULE-NOT-APPLICABLE", ["rule applicability explicitly false"], [], null, "NO-RULE-ACTION") };
  if (!rule.supportedCanonicalFieldIds.includes(input.canonicalFieldId)) return { result: rejected(rule, input, "INCOMPATIBLE-CANONICAL-FIELD", ["canonical field is not supported by this rule"]) };
  if (input.rawValue === null || input.rawValue === undefined || input.rawValue === "") return { result: rejected(rule, input, "RAW-VALUE-MISSING", ["raw value is missing"]) };
  if (typeof input.rawValue !== "string") return { result: rejected(rule, input, "MALFORMED-NUMERIC-VALUE", ["raw value must remain source text"]) };
  if (!input.sourceIdentity) return { result: rejected(rule, input, "SOURCE-IDENTITY-MISSING", ["source identity is missing"]) };
  if (!input.provenance || !input.provenance.sourceLocation) return { result: rejected(rule, input, "PROVENANCE-MISSING", ["source location provenance is missing"]) };
  if (!input.applicability || !["KNOWN", "SUFFICIENT"].includes(input.applicability.modelYear) || !["KNOWN", "SUFFICIENT"].includes(input.applicability.market) || !["KNOWN", "SUFFICIENT"].includes(input.applicability.equipment) || input.applicability.context !== "SUFFICIENT") return { result: rejected(rule, input, "APPLICABILITY-INSUFFICIENT", ["required target applicability is not proven"]) };
  if (input.rawUnit !== null && input.rawUnit !== undefined) return { result: rejected(rule, input, "UNSUPPORTED-UNIT", ["this rule requires units to remain explicit in rawValue"]) };
  return { input };
}

function evaluate(rule, input) {
  const validRule = contracts.validateRule(rule);
  const parsed = parseInput(validRule, input);
  if (parsed.result) return parsed.result;
  const record = parsed.input;
  const raw = record.rawValue.trim();
  if (validRule.family === "TORQUE") {
    const pair = raw.match(/^(\d+(?:\.\d+)?)\s*lb\s*[\/-]\s*ft\s*\(\s*(\d+(?:\.\d+)?)\s*Nm\s*\)$/i);
    const metric = raw.match(/^(\d+(?:\.\d+)?)\s*Nm$/i);
    if (!pair && !metric && /(?:lb|Nm|torque)/i.test(raw)) return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["torque numeric representation is not a supported scalar form"]);
    if (!pair && !metric && /^\d+(?:\.\d+)?$/.test(raw)) return rejected(validRule, record, "REQUIRED-UNIT-MISSING", ["torque unit is absent"]);
    if (!pair && !metric) return rejected(validRule, record, "UNSUPPORTED-UNIT", ["torque unit is not supported"]);
    const value = Number(pair ? pair[2] : metric[1]);
    if (!Number.isFinite(value)) return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["torque value is not finite"]);
    return baseResult(validRule, record, "APPLIED", "RULE-APPLIED", ["canonical field supported", "source identity present", "provenance present", "applicability sufficient", "single scalar value", "explicit metric Nm value"], [], { value, unit: "Nm", sourceRepresentation: pair ? "EXPLICIT-IMPERIAL-METRIC-PAIR" : "EXPLICIT-METRIC-VALUE", rawValuePreserved: true }, "CONTINUE-TO-EXISTING-SAFE-STAGE-RUNNER");
  }
  if (validRule.family === "CAPACITY") {
    const pair = raw.match(/^Approx\.\s*(\d+(?:\.\d+)?)\s*(quarts?|gal(?:lons)?)\s*\(Approx\.\s*(\d+(?:\.\d+)?)\s*l\)(.*)$/i);
    if (!pair) {
      if (/\d/.test(raw) && !/(?:l|litre|liter|quart|gal)/i.test(raw)) return rejected(validRule, record, "REQUIRED-UNIT-MISSING", ["capacity unit is absent"]);
      if (/(?:\b(?:oz|ml|cc|gallon|quart)\b)/i.test(raw)) return rejected(validRule, record, "UNSUPPORTED-UNIT", ["capacity unit representation is unsupported"]);
      return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["capacity numeric representation is not a supported scalar pair"]);
    }
    const condition = conditionFor(record);
    if (validRule.supportedCanonicalFieldIds.includes("lubrication.capacity-filter") && record.canonicalFieldId === "lubrication.capacity-filter" && !/with filter change/i.test(condition || "")) return human(validRule, record, "CONDITION-REQUIRED", ["with-filter-change condition is required"]);
    if (condition && !raw.toLowerCase().includes(condition.toLowerCase().replace(/^engine oil capacity;?\s*/i, "")) && record.canonicalFieldId === "lubrication.capacity-filter") return human(validRule, record, "CONDITION-LOSS", ["capacity condition is not retained by raw source wording"]);
    const value = Number(pair[3]);
    if (!Number.isFinite(value)) return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["capacity value is not finite"]);
    return baseResult(validRule, record, "APPLIED", "RULE-APPLIED", ["canonical field supported", "source identity present", "provenance present", "applicability sufficient", "single scalar value", "explicit metric litre value", "condition retained"], [], { value, unit: "L", sourceRepresentation: "EXPLICIT-IMPERIAL-METRIC-PAIR", rawValuePreserved: true, condition: record.condition || condition || null }, "CONTINUE-TO-EXISTING-SAFE-STAGE-RUNNER");
  }
  if (validRule.family === "BATTERY-CAPACITY") {
    const scalar = raw.match(/^(?:battery\s+capacity\s*)?(\d+(?:\.\d+)?)\s*Ah$/i);
    if (!scalar) {
      if (/\d/.test(raw) && !/Ah/i.test(raw)) return rejected(validRule, record, "REQUIRED-UNIT-MISSING", ["battery-capacity unit is absent"]);
      if (/\b(?:V|mAh|Wh)\b/i.test(raw) || /[;,/]/.test(raw)) return rejected(validRule, record, "UNSUPPORTED-UNIT", ["battery-capacity representation is unsupported or compound"]);
      return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["battery-capacity numeric representation is not a supported scalar"]);
    }
    if (record.condition) return human(validRule, record, "CONDITION-LOSS", ["battery-capacity condition is not represented in the scalar source wording"]);
    const value = Number(scalar[1]);
    if (!Number.isFinite(value)) return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["battery-capacity value is not finite"]);
    return baseResult(validRule, record, "APPLIED", "RULE-APPLIED", ["canonical field supported", "source identity present", "provenance present", "applicability sufficient", "single scalar value", "explicit Ah unit", "condition absent"], [], { value, unit: "Ah", sourceRepresentation: "EXPLICIT-SCALAR", rawValuePreserved: true, condition: null }, "CONTINUE-TO-EXISTING-SAFE-STAGE-RUNNER");
  }
  if (validRule.family === "PRESSURE") {
    const pair = raw.match(/^(\d+(?:\.\d+)?)\s*psi\s*\(\s*(\d+(?:\.\d+)?)\s*bar\s*\),\s*(.+)$/i);
    if (!pair) {
      if ((raw.match(/psi/gi) || []).length > 1 || (raw.match(/bar/gi) || []).length > 1) return human(validRule, record, "AMBIGUOUS-COMPOUND-VALUE", ["front/rear or multiple pressure values are compound"]);
      if (/\d/.test(raw) && !/(?:psi|bar|kPa)/i.test(raw)) return rejected(validRule, record, "REQUIRED-UNIT-MISSING", ["pressure unit is absent"]);
      return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["pressure numeric representation is not a supported scalar pair"]);
    }
    const sourceCondition = pair[3].trim();
    const condition = conditionFor(record);
    if (!condition) return human(validRule, record, "CONDITION-REQUIRED", ["pressure condition is required"]);
    if (condition.toLowerCase() !== sourceCondition.toLowerCase() && !sourceCondition.toLowerCase().includes(condition.toLowerCase())) return human(validRule, record, "CONDITION-LOSS", ["pressure condition would be changed or broadened"]);
    const value = Number(pair[2]);
    if (!Number.isFinite(value)) return rejected(validRule, record, "MALFORMED-NUMERIC-VALUE", ["pressure value is not finite"]);
    return baseResult(validRule, record, "APPLIED", "RULE-APPLIED", ["canonical field supported", "source identity present", "provenance present", "applicability sufficient", "single scalar value", "explicit metric bar value", "condition retained"], [], { value, unit: "bar", sourceRepresentation: "EXPLICIT-IMPERIAL-METRIC-PAIR", rawValuePreserved: true, condition }, "CONTINUE-TO-EXISTING-SAFE-STAGE-RUNNER");
  }
  return rejected(validRule, record, "INCOMPATIBLE-CANONICAL-FIELD", ["no deterministic evaluator exists for this rule family"]);
}

function evaluateBatch(rule, inputs) {
  assert(Array.isArray(inputs) && inputs.length > 0, "Rule evaluation batch is required");
  const keyed = inputs.map(input => ({ input, key: digest(input) })).sort((a, b) => a.key.localeCompare(b.key));
  const counts = new Map(); keyed.forEach(item => counts.set(item.key, (counts.get(item.key) || 0) + 1));
  return json.immutableClone(keyed.map(item => counts.get(item.key) > 1 ? rejected(contracts.validateRule(rule), item.input, "DUPLICATE-SEMANTIC-INPUT", ["semantic input occurs more than once"]) : evaluate(rule, item.input)));
}

module.exports = Object.freeze({ RULES, TORQUE_RULE, CAPACITY_RULE, BATTERY_CAPACITY_RULE, PRESSURE_RULE, createRule, evaluate, evaluateBatch });
