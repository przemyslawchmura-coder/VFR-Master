"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const factory = require("../research/factory/index.js");
const mapping = require("../research/data/identity-mappings/fz1.js");
const report = require("../research/data/yamaha-fz1-source-authentication.js").buildReport();

const browserContext = { window: {} };
browserContext.window = browserContext;
vm.createContext(browserContext);
for (const file of ["data/motorcycle-catalog.js", "js/motorcycle-catalog.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), browserContext, { filename: file });
}
const catalog = browserContext.MotorcycleCatalog;

test("selected FZ1 identity maps deterministically without merging generations or body styles", () => {
  const model = catalog.getModel("yamaha", "fz1");
  assert.deepEqual(JSON.parse(JSON.stringify(model.variants.map(item => item.key))), ["yamaha.fz1.gen2.n", "yamaha.fz1.gen2.s"]);
  assert.deepEqual(JSON.parse(JSON.stringify(report.identityMapping.runtimeIdentities)), ["yamaha.fz1.gen2.n", "yamaha.fz1.gen2.s"]);
  assert.equal(report.target.identityMapping.researchIdentity.key, "yamaha.fz1.gen2");
  assert.equal(factory.resolveIdentityMapping(mapping.fz1Gen1, { schemaVersion: 1, model: { state: "UNKNOWN", values: [] }, generation: { state: "UNKNOWN", values: [] }, years: { kind: "EXACT", from: 2010, to: 2010 }, markets: { state: "UNKNOWN", values: [] }, transmissions: { state: "UNKNOWN", values: [] }, abs: { state: "UNKNOWN", values: [] }, equipment: { state: "UNKNOWN", values: [] } }).status, "MISMATCH");
});

test("unknown applicability remains unknown and source applicability stays partial", () => {
  assert.deepEqual(report.target.scope.markets, { state: "UNKNOWN", values: [] });
  assert.deepEqual(report.target.scope.abs, { state: "UNKNOWN", values: [] });
  assert.deepEqual(report.target.scope.transmissions, { state: "UNKNOWN", values: [] });
  assert.deepEqual(report.target.scope.equipment, { state: "UNKNOWN", values: [] });
  assert.ok(report.prospects.every(item => item.readinessClassification === "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL"));
  assert.deepEqual(report.prospects[1].applicability.markets, { state: "UNKNOWN", values: [] });
  assert.deepEqual(report.prospects[1].applicability.abs, { state: "UNKNOWN", values: [] });
});

test("publication identity is deterministic and duplicate locations do not duplicate prospects", () => {
  const again = require("../research/data/yamaha-fz1-source-authentication.js").buildReport();
  assert.deepEqual(again, report);
  assert.equal(new Set(report.prospects.map(item => item.publication.identifiers[0].value)).size, report.prospects.length);
  assert.equal(new Set(report.prospects.flatMap(item => item.officialLocations.map(location => `${location.host}${location.path}`))).size, report.prospects.reduce((sum, item) => sum + item.officialLocations.length, 0));
  assert.equal(report.prospects.find(item => item.id.includes("service"))?.authenticationState, "PARTIAL");
  assert.equal(report.prospects.find(item => item.id.includes("owner"))?.authenticationState, "AUTHENTICATED");
  assert.deepEqual(report.authenticatedPublicationIds, ["2D1X"]);
  assert.deepEqual(report.authenticationLeads, ["2D1-28197-E0"]);
});

test("planning wave creates no technical values or production changes", () => {
  assert.equal(report.technicalValuesInspected, false);
  assert.equal(report.rawCandidatesCreated, 0);
  assert.equal(report.reviewQueueEntriesCreated, 0);
  assert.equal(report.humanReviewDecisionsCreated, 0);
  assert.equal(report.evidenceRowsAdded, 0);
  assert.equal(report.productionChanged, false);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.catalogueChanged, false);
  assert.match(report.exactNextTask, /2D1X extraction-planning wave/);
});

test("future source budget is bounded and report is reproducible", () => {
  assert.deepEqual(report.sourceBudget, { maxPrimaryServicePublications: 1, maxOwnerManualPublications: 1, maxPartsPublications: 0, maxSupplements: 0, rationale: "One service publication plus one narrowly scoped owner-manual lead; stop before a broader Yamaha document catalogue." });
  assert.deepEqual(require("../research/data/yamaha-fz1-source-authentication.js").buildReport(), report);
});
