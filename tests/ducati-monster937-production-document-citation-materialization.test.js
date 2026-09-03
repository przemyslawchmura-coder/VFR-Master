"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const validator = require("../js/technical/technical-profile-validator.js");
const fixture = require("./fixtures/technical-profile-v1.fixture.js");
const source = require("../data/technical/documents/ducati/monster937-2021-documents.js");
const report = require("../research/data/ducati-monster937-production-document-citation-materialization.js").buildReport;

test("Ducati materialization defines one exact document and six citations", () => {
  const result = report();
  assert.equal(result.documentCount, 1); assert.equal(result.citationCount, 45); assert.equal(Object.keys(source.documents).length, 1); assert.equal(Object.keys(source.citations).length, 45);
  assert.equal(source.documents[source.documentId].type, "oem-owners-manual"); assert.equal(source.documents[source.documentId].manufacturer, "Ducati Motor Holding S.p.A."); assert.deepEqual(source.documents[source.documentId].years, { from: 2021, to: 2021 }); assert.deepEqual(source.documents[source.documentId].regions, ["EU"]);
  assert.equal(new Set(Object.keys(source.documents)).size, 1); assert.equal(new Set(Object.keys(source.citations)).size, 45); assert.ok(Object.values(source.citations).every(item => item.documentId === source.documentId));
});

test("citations retain exact six fields and source locations", () => {
  const result = report(); assert.deepEqual(new Set(result.coveredFields), new Set(["ignition.spark-plug-oem", "lubrication.viscosity", "lubrication.api-jaso", "electrical.battery-capacity", "electrical.battery-specification", "brakes.brake-fluid"])); assert.equal(result.coolingExcluded, true); assert.equal(result.pendingDucatiExcluded, 20); assert.equal(result.bmwInvolvement, false);
  assert.deepEqual(source.citations["cite.ducati.monster937-2021.om.oil-api-jaso"].pages, ["195–196", "211"]); assert.deepEqual(source.citations["cite.ducati.monster937-2021.om.oil-viscosity"].pages, ["196", "211"]); assert.deepEqual(source.citations["cite.ducati.monster937-2021.om.brake-fluid"].pages, ["177", "212"]);
});

test("standalone document/citation maps pass existing production source validation", () => {
  const profile = structuredClone(fixture); profile.documents = structuredClone(source.documents); profile.citations = structuredClone(source.citations); profile.entries = []; const validation = validator.validate(profile); assert.equal(validation.valid, true, JSON.stringify(validation.errors));
});

test("materialization report is deterministic, isolated and immutable", () => {
  const first = report(); assert.deepEqual(report(), first); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-production-document-citation-materialization.json"), "utf8")), first); assert.equal(first.productionProfileCreated, false); assert.equal(first.registryChanged, false); assert.equal(first.evidenceChanged, false); assert.equal(first.coverageChanged, false);
});
