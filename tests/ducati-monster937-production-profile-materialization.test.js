"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const validator = require("../js/technical/technical-profile-validator.js");
const registry = require("../js/technical/technical-profile-registry.js");
const profile = require("../data/technical/ducati/monster937/profile-2021.js");
const source = require("../data/technical/documents/ducati/monster937-2021-documents.js");
const report = require("../research/data/ducati-monster937-production-profile-materialization.js").buildReport;

const entryIds = ["ignition.spark-plug.standard", "lubrication.engine-oil.viscosity", "lubrication.engine-oil.specification", "electrical.battery.capacity", "electrical.battery.specification", "brakes.fluid.specification"];
const citationByEntry = { "ignition.spark-plug.standard": "cite.ducati.monster937-2021.om.spark-plug", "lubrication.engine-oil.viscosity": "cite.ducati.monster937-2021.om.oil-viscosity", "lubrication.engine-oil.specification": "cite.ducati.monster937-2021.om.oil-api-jaso", "electrical.battery.capacity": "cite.ducati.monster937-2021.om.battery-capacity", "electrical.battery.specification": "cite.ducati.monster937-2021.om.battery-specification", "brakes.fluid.specification": "cite.ducati.monster937-2021.om.brake-fluid" };

test("Ducati profile is exact, valid and citation-backed", () => {
  assert.equal(profile.schemaVersion, "revlog-technical-profile/v1"); assert.equal(profile.profile.id, "ducati.monster937.2021"); assert.equal(profile.profile.status, "review"); assert.equal(profile.entries.length, 6); assert.deepEqual(profile.entries.map(entry => entry.id), entryIds); assert.equal(new Set(profile.entries.map(entry => entry.id)).size, 6);
  const validation = validator.validate(profile); assert.equal(validation.valid, true, JSON.stringify(validation.errors));
  profile.entries.forEach(entry => assert.deepEqual(entry.sourceIds, [citationByEntry[entry.id]])); assert.ok(profile.entries.every(entry => profile.citations[entry.sourceIds[0]].documentId === "doc.ducati.monster937-2021.owners-manual"));
});

test("profile applicability and exclusions remain bounded", () => {
  assert.deepEqual(profile.motorcycle.applicability, { catalogVariantKeys: ["ducati.monster.937"], years: { from: 2021, to: 2021 }, regions: ["EU"], abs: true, equipment: ["base Monster 937"] }); assert.equal(profile.entries.some(entry => entry.id.startsWith("cooling.")), false); assert.equal(profile.entries.some(entry => entry.id.includes("bmw")), false); assert.equal(Object.keys(profile.documents).length, 1); assert.equal(Object.keys(profile.citations).length, 6); assert.equal(new Set(Object.keys(profile.citations)).size, 6);
});

test("Ducati remains registered exactly once and source/registry inputs are not mutated", () => {
  const sourceBefore = structuredClone(source); const registryBefore = registry.listProfiles(); assert.equal(registry.findProfileDescriptor({ catalogVariantKey: "ducati.monster.937", year: 2021 }).status, "found"); assert.deepEqual(source, sourceBefore); assert.deepEqual(registry.listProfiles(), registryBefore); assert.equal(registryBefore.filter(item => item.profileId === profile.profile.id).length, 1);
});

test("materialization report is deterministic and production-isolated", () => {
  const first = report(); assert.deepEqual(report(), first); assert.equal(first.validatorResult.valid, true); assert.equal(first.entryCount, 6); assert.equal(first.registryChanged, false); assert.equal(first.runtimeDiscoverable, true); assert.equal(first.evidenceChanged, false); assert.equal(first.serviceCoreCoverageChanged, false); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-production-profile-materialization.json"), "utf8")), first);
});
