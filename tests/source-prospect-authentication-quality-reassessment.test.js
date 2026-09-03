"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const design = require("../research/data/source-prospect-authentication-quality-reassessment.js");
const report = design.buildReport();

const readyFixture = () => ({ classification: "EXECUTION-READY", gate: Object.fromEntries(design.requiredGateFields.map(field => [field, true])) });

test("Harley 94001064 is rejected for selected MY2022", () => {
  const harley = report.prospects.find(item => item.id === "harley.sportster-rh.94001064");
  assert.equal(harley.classification, "REJECTED-MISMATCH");
  assert.equal(harley.yearStatus, "REJECTED: MY2023 does not cover selected MY2022");
  assert.equal(harley.access, "ACCESS-BLOCKED-403");
  assert.equal(harley.readinessGate.rankingEligible, false);
});

test("execution-ready gate passes only a complete ready prospect", () => {
  assert.deepEqual(design.evaluateReadinessGate(readyFixture()), { passed: true, failed: [], rankingEligible: true });
});

test("execution-ready gate fails on unknown year", () => {
  const prospect = readyFixture(); prospect.gate.yearKnown = false;
  assert.ok(design.evaluateReadinessGate(prospect).failed.includes("yearKnown"));
});

test("execution-ready gate fails on unknown market", () => {
  const prospect = readyFixture(); prospect.gate.marketKnown = false;
  assert.ok(design.evaluateReadinessGate(prospect).failed.includes("marketKnown"));
});

test("execution-ready gate fails on blocked accessibility", () => {
  const prospect = readyFixture(); prospect.gate.accessibilityFeasible = false;
  assert.ok(design.evaluateReadinessGate(prospect).failed.includes("accessibilityFeasible"));
});

test("UNKNOWN and PARTIAL prospects are unranked", () => {
  assert.ok(report.prospects.filter(item => item.classification === "UNKNOWN" || item.classification.includes("PARTIAL")).every(item => item.rank === null && !item.readinessGate.rankingEligible));
});

test("only execution-ready prospects may enter ranking", () => {
  assert.equal(report.readyProspects.length, 1);
  assert.equal(report.rankedReadyProspects.length, 1);
  assert.ok(report.prospects.every(item => item.readinessGate.rankingEligible === (item.classification === "EXECUTION-READY" && item.readinessGate.failed.length === 0)));
});

test("prior exhausted and no-yield sources cannot pass the gate", () => {
  const exhausted = report.prospects.filter(item => item.classification === "EXHAUSTED / LOW-MARGINAL-YIELD");
  assert.equal(exhausted.length, 6);
  assert.ok(exhausted.every(item => item.gate.notExhausted === false && item.rank === null));
});

test("inventory is bounded and exact NEXT is metadata-only", () => {
  assert.equal(report.prospects.length, 18);
  assert.equal(new Set(report.prospects.map(item => item.manufacturer)).size, 8);
  assert.equal(report.thirdManufacturerAnswer, "NO");
  assert.match(report.exactNextTask, /Ducati Monster 937/);
  assert.match(report.exactNextTask, /inspect technical values only in that later task/);
});

test("reassessment changes no evidence, coverage or production", () => {
  assert.equal(report.externalTechnicalEvidenceAcquired, false);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
  assert.deepEqual(report.harleyFailure, { catalogVariantKey: "harley-davidson.revolution-max.sportster-s", selectedYear: 2022, publicationId: "94001064", authenticatedYear: 2023, access: "ACCESS-BLOCKED-403", before: 0, after: 0, verifiedGain: 0, practicalGain: 0, genericGain: 0, classification: "REJECT" });
});

test("machine-readable report is reproducible", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/source-prospect-authentication-quality-reassessment.json"), "utf8"));
  assert.deepEqual(stored, report);
});
