"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const waveE = require("../research/data/technical-research-factory-automatic-pipeline.js");
const analysis = require("../research/data/technical-research-factory-exception-analysis.js");
const json = require("../research/factory/json.js");

const stored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-exception-analysis.json", "utf8"));
const waveEStored = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-automatic-pipeline.json", "utf8"));

test("Wave F analyzes exactly the six stored Wave E exceptions", () => {
  const report = analysis.buildReport();
  assert.equal(report.exceptions.length, 6);
  assert.equal(new Set(report.exceptions.map(item => item.analysisId)).size, 6);
  assert.deepEqual(report.exceptions.map(item => item.route).sort(), ["RED", "RED", "RED", "RED", "YELLOW", "YELLOW"]);
  assert.equal(report.exactWaveE.exceptionRecords.value, 6);
  assert.equal(report.exactWaveE.exceptionGroups.value, 5);
});

test("classification is backed by the exact rule/routing states and keeps duplicate occurrences visible", () => {
  const report = analysis.buildReport();
  const causes = report.exceptions.map(item => item.rootCause);
  assert.deepEqual(causes.sort(), ["APPLICABILITY-BOUNDARY", "DUPLICATE-INPUT-HYGIENE", "DUPLICATE-INPUT-HYGIENE", "GENUINE-HUMAN-SEMANTIC-BOUNDARY", "SYNTHETIC-NEGATIVE-TEST-CASE", "SYNTHETIC-NEGATIVE-TEST-CASE"]);
  const duplicates = report.exceptions.filter(item => item.duplicate.isDuplicate);
  assert.equal(duplicates.length, 2);
  assert.deepEqual(duplicates.map(item => item.occurrence).sort(), [1, 2]);
  assert.ok(report.exceptions.every(item => item.route === "YELLOW" ? item.evaluationState === "NEEDS-HUMAN-REVIEW" || item.evaluationState === "NOT-APPLICABLE" : item.evaluationState === "REJECTED"));
});

test("legitimate metrics exclude only proven fixture variants and do not claim a catalogue result", () => {
  const report = analysis.buildReport();
  assert.equal(report.legitimateRecordAnalysis.denominator.value, 4);
  assert.equal(report.legitimateRecordAnalysis.fixtureOnlyNegativeRecordsExcluded.value, 5);
  assert.equal(report.legitimateRecordAnalysis.automaticSafeRate.value, 3 / 4);
  assert.equal(report.deterministicCounterfactual.value, 3 / 4);
  assert.equal(report.legitimateRecordAnalysis.comparability, "BOUNDED-INSPECTED-SUBSET-ONLY");
  assert.ok(report.unknowns.length > 0);
});

test("Wave F is deterministic, source-linked and read-only", () => {
  const first = analysis.buildReport();
  const second = analysis.buildReport();
  assert.deepEqual(first, second);
  assert.deepEqual(first, stored);
  assert.equal(first.externalSideEffects, false);
  assert.deepEqual(waveE.buildReport(), waveEStored);
  assert.equal(json.canonicalSerialize(first), json.canonicalSerialize(second));
  assert.ok(first.exceptions.every(item => item.identity.upstreamIdentity && item.provenanceAvailable && item.sourceIdentity));
});
