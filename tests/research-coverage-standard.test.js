"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dataset = require("../research/data/research-dataset.js");
const standard = require("../research/schema/research-coverage-standard.js");
const auditor = require("../js/research/research-coverage-auditor.js");
const reports = require("../js/research/research-report-generator.js");

const keys = ["honda.cbr500r.gen4", "yamaha.mt09.gen3", "yamaha.tenere700.gen1"];

test("canonical coverage standard is durable and lighting is field-level", () => {
  assert.equal(standard.schemaVersion, "revlog-research-coverage/v1");
  assert.ok(standard.FIELD_COUNT > 150);
  assert.deepEqual(standard.CATEGORIES.lighting.slice(0, 9), ["low-beam", "high-beam", "combined-high-low", "front-position", "rear-tail", "brake-light", "front-indicators", "rear-indicators", "license-plate"]);
});

test("audit distinguishes absent research from reviewed no-evidence", () => {
  const audit = auditor.auditProfile(dataset, "honda.cbr500r.gen4");
  assert.equal(audit.categories.lighting["low-beam"].status, "researched-no-evidence");
  assert.equal(audit.categories.lighting["drl"].status, "researched-no-evidence");
  assert.equal(audit.categories.lighting["rear-tail"].status, "evidence-found");
});

test("all deep profiles audit against the same deterministic standard", () => {
  const first = auditor.auditProfiles(dataset, keys);
  assert.deepEqual(first, auditor.auditProfiles(dataset, keys));
  keys.forEach(key => assert.equal(first[key].fieldCount, standard.FIELD_COUNT));
  assert.ok(Object.values(first).every(item => item.categories.lighting._status.status === "evidence-found"));
});

test("field-based readiness is lower than category-presence optimism", () => {
  const metrics = reports.buildDeepProfileMetrics(dataset, keys);
  assert.ok(Object.values(metrics).every(item => item.completenessPercent < 50));
  assert.ok(Object.values(metrics).every(item => item.fieldCoverage["evidence-found"] < standard.FIELD_COUNT));
  assert.ok(Object.values(metrics).every(item => item.recommendation === "research-more"));
  assert.ok(Object.values(metrics).every(item => item.readinessReasons.length > 0 && item.readinessBlockers.length > 0));
});

test("readiness policy is deterministic and conflicts cannot be ready", () => {
  const metrics = reports.buildDeepProfileMetrics(dataset, keys);
  assert.deepEqual(metrics, reports.buildDeepProfileMetrics(dataset, keys));
  const audit = require("../js/research/research-coverage-auditor.js").auditProfile(dataset, keys[0]);
  const conflicted = { ...audit, counts: { ...audit.counts, conflicting: 1 } };
  const evaluated = reports.evaluateReadiness(conflicted, metrics[keys[0]]);
  assert.equal(evaluated.recommendation, "research-more");
  assert.match(evaluated.reasons.join(" "), /conflicting/);
});

test("field-level report is deterministic and exposes every canonical field", () => {
  const report = auditor.renderFieldGapReport(dataset, keys);
  assert.equal(report, auditor.renderFieldGapReport(dataset, keys));
  assert.match(report, /lighting — evidence-found/);
  assert.match(report, /`low-beam`/);
  assert.match(report, /`market-applicability`/);
});

test("generated field-gap report is present and non-production", () => {
  const report = fs.readFileSync(path.join(__dirname, "../research/reports/deep-profile-field-gaps.md"), "utf8");
  assert.match(report, /NON-PRODUCTION RESEARCH DATA/);
  keys.forEach(key => assert.match(report, new RegExp(`## ${key.replaceAll(".", "\\.")}`)));
});
