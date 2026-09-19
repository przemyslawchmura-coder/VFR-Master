"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const report = require("../research/data/cbr500r-pc70-materialization-requirements.js");

test("CBR500R evaluates exactly the existing authorization through the generic gate", () => {
  const result = report.buildResult();
  assert.equal(result.productionAuthorizationId, "production-authorization.42dfc09d17938fb18e6dc92d");
  assert.equal(result.productionAuthorizationState, "AUTHORIZATION-READY");
  assert.deepEqual(result.productionAuthorizationReasons, []);
  assert.equal(result.productionCreated, false);
  assert.deepEqual(result.declaredRequirements, factory.FUTURE_MATERIALIZATION_REQUIREMENTS.slice().sort());
  assert.equal(result.requirements.length, 4);
  assert.equal(result.aggregateState, "REQUIREMENTS-PENDING");
  assert.deepEqual(result.aggregateReasons, ["MATERIALIZATION-INPUTS-PENDING"]);
  assert.equal(result.humanAuthorizationRequired, true);
  assert.equal(result.materializationAllowed, false);
  assert.ok(result.requirements.every(item => item.state === "PENDING"));
  assert.ok(result.requirements.every(item => item.reasons.includes("REQUIRED-MATERIALIZATION-INPUTS-MISSING")));
});

test("CBR500R result is deterministic, persisted and production-isolated", () => {
  const first = report.buildReport();
  assert.deepEqual(report.buildReport(), first);
  const persisted = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/cbr500r-pc70-materialization-requirements.json"), "utf8"));
  assert.equal(factory.orchestrationJson.canonicalSerialize(persisted), factory.orchestrationJson.canonicalSerialize(first));
  assert.equal(first.id, "materialization-authorization.75f4749897a97f42f0cfe4a9");
  assert.equal(first.proposedProduction.entryId, "lubrication.engine-oil.specification");
  assert.equal(first.rawSource.rawValue, first.proposedProduction.value.text);
  assert.equal(first.targetApplicability.abs, "KNOWN");
  assert.equal(first.productionCreated, false);
  assert.equal(first.materializationAllowed, false);
});
