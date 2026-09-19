"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const factory = require("../research/factory/catalogue-coverage-queue-contracts.js");
const report = require("../research/data/catalogue-coverage-queue.js");

function input(overrides = {}) {
  return { catalogue: [{ id: "fixture", name: "Fixture", models: [{ id: "model", name: "Model", variants: [{ id: "v", key: "fixture.model", name: "I", yearFrom: 2024, yearTo: 2024 }] }] }], coreFieldIds: Array.from({ length: 95 }, (_, i) => `core.${i}`), productionProfiles: [], researchCoverage: [], sourceProspects: [], ...overrides };
}

test("catalogue projection preserves unknown applicability and deterministic identity", () => {
  const first = factory.projectCatalogueCoverageQueue(input());
  const second = factory.projectCatalogueCoverageQueue(input());
  assert.deepEqual(first, second);
  assert.equal(first.targets[0].applicability.state, "UNKNOWN");
  assert.deepEqual(first.targets[0].applicability.unresolvedDimensions, ["market", "abs", "transmission", "equipment"]);
  assert.equal(first.targets[0].queueDisposition, "UNRESOLVED");
});

test("production presence, source readiness and planning candidate are distinct", () => {
  const first = factory.projectCatalogueCoverageQueue(input({ sourceProspects: [{ id: "prospect.ready", catalogVariantKey: "fixture.model", classification: "EXECUTION-READY" }] }));
  assert.equal(first.counts.productionProfileAbsent, 1);
  assert.equal(first.counts.sourceReady, 1);
  assert.equal(first.counts.queueCandidates, 1);
  const withProfile = factory.projectCatalogueCoverageQueue(input({ productionProfiles: [{ descriptor: { profileId: "fixture.profile.2024", catalogVariantKeys: ["fixture.model"], years: { from: 2024, to: 2024 } }, coreFieldIds: ["core.0"] }], sourceProspects: [{ id: "prospect.ready", catalogVariantKey: "fixture.model", classification: "EXECUTION-READY" }] }));
  assert.equal(withProfile.targets[0].production.state, "PRESENT");
  assert.equal(withProfile.targets[0].queueDisposition, "NOT-NEEDED");
  assert.equal(withProfile.counts.queueCandidates, 0);
});

test("blocked, exhausted and unresolved sources fail closed into explicit states", () => {
  const blocked = factory.projectCatalogueCoverageQueue(input({ sourceProspects: [{ id: "p", catalogVariantKey: "fixture.model", classification: "ACCESS-BLOCKED" }] }));
  assert.equal(blocked.targets[0].source.state, "BLOCKED");
  const exhausted = factory.projectCatalogueCoverageQueue(input({ sourceProspects: [{ id: "p", catalogVariantKey: "fixture.model", classification: "EXHAUSTED / LOW-MARGINAL-YIELD" }] }));
  assert.equal(exhausted.targets[0].source.state, "EXHAUSTED");
  assert.throws(() => factory.projectCatalogueCoverageQueue(input({ catalogue: [{ id: "x", name: "X", models: [{ id: "m", name: "M", variants: [{ id: "a", key: "duplicate", name: "A", yearFrom: 2024, yearTo: 2024 }, { id: "b", key: "duplicate", name: "B", yearFrom: 2024, yearTo: 2024 }] }] }] })), /ambiguous duplicate/);
});

test("repository projection is persisted and deterministic", () => {
  const first = report.buildReport();
  const second = report.buildReport();
  assert.deepEqual(first, second);
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/catalogue-coverage-queue.json", "utf8")), first);
  assert.equal(first.coreFieldCount, 95);
  assert.equal(first.counts.catalogueTargets, 5317);
});
