"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const rules = require("../research/factory/deterministic-rule-library.js");
const waveC = require("../research/data/technical-research-factory-routing.js");
const waveD = require("../research/data/technical-research-factory-rule-library.js");
const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/technical-research-factory-rule-library.json"), "utf8"));

test("Wave D fixture is deterministic and stored output regenerates exactly", () => {
  const first = waveD.buildReport();
  assert.deepEqual(first, stored);
  assert.deepEqual(waveD.buildReport(), first);
  assert.equal(first.assertions.appliedCount, 3);
  assert.equal(first.assertions.notApplicableCount, 1);
  assert.equal(first.assertions.needsHumanReviewCount, 1);
  assert.equal(first.assertions.rejectedCount, 3);
});
test("torque, capacity and conditional pressure rules apply losslessly", () => {
  const input = waveD.buildInputs();
  const torque = rules.evaluate(rules.TORQUE_RULE, input.torque);
  const capacity = rules.evaluate(rules.CAPACITY_RULE, input.capacity);
  const pressure = rules.evaluate(rules.PRESSURE_RULE, input.pressure);
  assert.equal(torque.state, "APPLIED");
  assert.deepEqual(torque.output, { value: 30, unit: "Nm", sourceRepresentation: "EXPLICIT-IMPERIAL-METRIC-PAIR", rawValuePreserved: true });
  assert.equal(capacity.output.unit, "L");
  assert.equal(capacity.output.value, 3.1);
  assert.equal(capacity.condition, "with filter change");
  assert.equal(pressure.output.value, 2.9);
  assert.equal(pressure.condition, "driver with passenger and/or load, with cold tire");
  assert.equal(pressure.rawValue, input.pressure.rawValue);
  assert.deepEqual(pressure.provenance, input.pressure.provenance);
  assert.deepEqual(pressure.applicability, input.pressure.applicability);
});

test("compound, missing, unsupported, incompatible and not-applicable inputs fail closed", () => {
  const input = waveD.buildInputs();
  assert.equal(rules.evaluate(rules.PRESSURE_RULE, input.ambiguousPressure).state, "NEEDS-HUMAN-REVIEW");
  assert.equal(rules.evaluate(rules.PRESSURE_RULE, input.ambiguousPressure).reasonCode, "AMBIGUOUS-COMPOUND-VALUE");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, input.missingRaw).reasonCode, "RAW-VALUE-MISSING");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, input.unsupportedUnit).reasonCode, "UNSUPPORTED-UNIT");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, input.incompatibleField).reasonCode, "INCOMPATIBLE-CANONICAL-FIELD");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, input.notApplicable).state, "NOT-APPLICABLE");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, { ...input.torque, rawValue: "30" }).reasonCode, "REQUIRED-UNIT-MISSING");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, { ...input.torque, rawValue: "thirty Nm" }).reasonCode, "MALFORMED-NUMERIC-VALUE");
  assert.equal(rules.evaluate(rules.TORQUE_RULE, { ...input.torque, provenance: null }).reasonCode, "PROVENANCE-MISSING");
  assert.throws(() => rules.evaluate(rules.TORQUE_RULE, { ...input.torque, rawValue: Infinity }), /finite JSON/);
});

test("rule and result identities are versioned and batch order-independent", () => {
  const input = waveD.buildInputs();
  const first = rules.evaluateBatch(rules.TORQUE_RULE, [input.torque, input.missingRaw]);
  const second = rules.evaluateBatch(rules.TORQUE_RULE, [input.missingRaw, input.torque]);
  assert.deepEqual(second, first);
  const old = rules.createRule({ ...rules.TORQUE_RULE, ruleVersion: "0.9.0" });
  const current = rules.evaluate(rules.TORQUE_RULE, input.torque);
  const prior = rules.evaluate(old, input.torque);
  assert.notEqual(old.id, rules.TORQUE_RULE.id);
  assert.notEqual(prior.id, current.id);
  assert.equal(prior.ruleVersion, "0.9.0");
  assert.equal(current.ruleVersion, "1.0.0");
  assert.equal(current.externalSideEffects, false);
});

test("Wave D does not alter Wave C routing or create authorization", () => {
  const report = waveD.buildReport();
  const routing = waveC.buildReport();
  assert.equal(report.assertions.noAuthorizationCreated, true);
  assert.equal(report.assertions.noRuleActivated, true);
  assert.equal(report.batchSummary.metrics.sourceReuseRate.value, null);
  assert.equal(routing.assertions.greenCount, 1);
  assert.equal(routing.assertions.yellowCount, 1);
  assert.equal(routing.assertions.redCount, 6);
  assert.equal(report.assertions.evidenceRowsCreated, 0);
  assert.equal(report.assertions.productionChanged, false);
});

test("rule contract rejects identity mutation and unsafe provenance behavior", () => {
  const rule = rules.TORQUE_RULE;
  assert.doesNotThrow(() => factory.validateRule(rule));
  assert.throws(() => factory.validateRule({ ...rule, id: "deterministic-rule.000000000000000000000000" }), /id is unstable/);
  assert.throws(() => factory.validateRule({ ...rule, rawValuePreserved: false }), /rawValuePreserved/);
});
