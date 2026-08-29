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

test("owner-manual exhaustion audit is deterministic and source-aware", () => {
  const report = auditor.renderOwnerManualExhaustionReport(dataset, keys);
  assert.equal(report, auditor.renderOwnerManualExhaustionReport(dataset, keys));
  assert.match(report, /Owner-manual evidence exhaustion audit/);
  assert.match(report, /Periodic schedule rows are represented/);
  assert.match(report, /service\/workshop manual/);
  assert.match(report, /Lighting is audited per function/);
});

test("workshop-dependent fields are not falsely closed by owner-manual evidence", () => {
  const audit = auditor.auditProfile(dataset, "honda.cbr500r.gen4");
  assert.equal(audit.categories.service_limits.engine.status, "researched-no-evidence");
  assert.equal(audit.categories.torques["oil-filter"].status, "not-researched");
});

test("targeted OEM publication identities remain distinct from inspected evidence", () => {
  const report = fs.readFileSync(path.join(__dirname, "../research/reports/service-source-acquisition.md"), "utf8");
  assert.match(report, /B7N-28197-E0/);
  assert.match(report, /LIT-11616-34-61/);
  assert.match(report, /BW3-F8197-E0/);
  assert.match(report, /2024 CB500F \/ CBR500R \/ NX500 Service Manual/);
  assert.match(report, /technical field evidence extracted/);
});

test("maintenance coverage uses plural schedule intervals, not a fake scalar", () => {
  assert.ok(standard.CATEGORIES.maintenance.includes("schedule-mileage-intervals"));
  assert.ok(standard.CATEGORIES.maintenance.includes("schedule-time-intervals"));
  assert.equal(standard.CATEGORIES.maintenance.includes("mileage-interval"), false);
  const report = auditor.renderOwnerManualExhaustionReport(dataset, keys);
  assert.match(report, /schedule-mileage-intervals/);
  assert.match(report, /Time intervals and initial service remain separate/);
});
