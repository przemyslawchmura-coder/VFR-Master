"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const data = require("../research/data/honda-service-wave1.js");
const report = require("../scripts/honda-service-data-report.js");
const catalog = require("../scripts/motorcycle-catalog-report.js").loadCatalog();
const canonical = new Set(Object.entries(require("../research/schema/research-coverage-standard.js").CATEGORIES).flatMap(([category, fields]) => fields.map(field => `${category}.${field}`)));

test("Honda Service Core is a canonical, deterministic subset", () => {
  assert.ok(data.serviceCore.length >= 30 && data.serviceCore.length <= 45);
  assert.equal(new Set(data.serviceCore).size, data.serviceCore.length);
  assert.ok(data.serviceCore.every(field => canonical.has(field)));
  assert.equal(data.canonicalFieldCount, 183);
  assert.deepEqual(report.buildReport(), report.buildReport());
});

test("Honda service targets resolve to catalogue identities and valid years", () => {
  const keys = new Set(catalog.find(item => item.id === "honda").models.flatMap(model => model.variants.map(v => v.key)));
  assert.equal(new Set(data.targets.map(target => target.catalogVariantKey)).size, data.targets.length);
  data.targets.forEach(target => { assert.ok(keys.has(target.catalogVariantKey)); assert.ok(target.years.from >= 1990 && target.years.to <= 2025); assert.equal(target.abs, null); });
});

test("evidence has provenance, valid applicability and no duplicate identity", () => {
  assert.equal(report.validate().length, 0);
  const pairs = data.evidence.map(item => `${item.catalogVariantKey}|${item.field}`);
  assert.equal(new Set(pairs).size, pairs.length);
  data.evidence.forEach(item => { assert.ok(canonical.has(item.field)); assert.ok(item.rawValue); assert.ok(item.sourceId); assert.ok(item.sourceSection); assert.ok(item.sourcePage); assert.equal(item.applicability.abs, null); });
});

test("coverage metrics reconcile and research remains non-production", () => {
  const result = report.buildReport();
  assert.equal(result.serviceCoreEvidence + result.researchedNoEvidence + result.notResearched, result.serviceCoreSlots);
  assert.equal(result.conflicting, 0);
  assert.equal(result.readiness.ready + result.readiness.partial + result.readiness.more, data.targets.length);
  const source = fs.readFileSync(path.join(__dirname, "../research/data/honda-service-wave1.js"), "utf8");
  assert.match(source, /NON-PRODUCTION RESEARCH DATA/);
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, "../data/technical/technical-profile-registry.js"), "utf8"), /honda\.service/);
});

test("existing CBR500R deep baseline remains unchanged", () => {
  const dataset = require("../research/data/research-dataset.js");
  const metrics = require("../js/research/research-report-generator.js").buildDeepProfileMetrics(dataset, ["honda.cbr500r.gen4"])["honda.cbr500r.gen4"];
  assert.deepEqual(metrics.fieldAudit.counts, { "not-researched": 30, "researched-no-evidence": 100, partial: 0, "evidence-found": 53, conflicting: 0 });
});
