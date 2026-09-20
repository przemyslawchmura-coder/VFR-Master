"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const report = require("../research/data/research-on-demand-reuse-architecture-audit.js");
const json = require("../research/factory/json.js");

test("research-on-demand architecture audit is deterministic and design-only", () => {
  const first = report.buildReport();
  const second = report.buildReport();
  assert.equal(json.canonicalSerialize(first), json.canonicalSerialize(second));
  assert.equal(first.startingCheckpoint, "b8b1c3d7cdb7f94b7255dc7bdf2cce21cd2d54eb");
  assert.equal(first.implementationPerformed, false);
  assert.equal(first.externalApisCalled, false);
  assert.equal(first.productionChanged, false);
  assert.equal(first.auditVerdict, "ACCEPT");
  assert.equal(first.historicalBoundaries.waveK.routingAfter.red, 23);
  assert.equal(first.historicalBoundaries.waveK.routingAfter.green, 8);
  assert.equal(first.historicalBoundaries.waveK.routingAfter.yellow, 1);
});

test("architecture audit distinguishes reusable Factory primitives from missing cross-request persistence", () => {
  const result = report.buildReport();
  assert.equal(result.targetTransitions.find(item => item.id === "factory").status, "EXISTS");
  assert.equal(result.targetTransitions.find(item => item.id === "lookup").status, "MISSING");
  assert.equal(result.targetTransitions.find(item => item.id === "dedup").status, "MISSING");
  assert.equal(result.componentReuseMatrix.find(item => item.component === "existing Factory as a whole").classification, "POTENTIALLY-OBSOLETE: NONE");
  assert.match(result.next, /local fixture proof/);
});

test("persisted architecture audit matches the deterministic generator", () => {
  const generated = report.buildReport();
  const stored = JSON.parse(fs.readFileSync("research/reports/research-on-demand-reuse-architecture-audit.json", "utf8"));
  assert.deepEqual(stored, generated);
});
