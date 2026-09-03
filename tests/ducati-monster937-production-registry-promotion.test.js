"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const registry = require("../js/technical/technical-profile-registry.js");
const profile = require("../data/technical/ducati/monster937/profile-2021.js");
const source = require("../data/technical/documents/ducati/monster937-2021-documents.js");
const report = require("../research/data/ducati-monster937-production-registry-promotion.js");

test("registry contains exactly the bounded Ducati and VFR profiles", async () => { const result = await report.buildReport(); assert.equal(result.registryProfileCountBefore, 2); assert.equal(result.registryProfileCountAfter, 2); assert.deepEqual(result.registeredProfileIds, ["honda.vfr800.rc46-vtec-gen1.2002", "ducati.monster937.2021"]); assert.deepEqual(result.ducatiRegistryRecord, { profileId: "ducati.monster937.2021", catalogVariantKeys: ["ducati.monster.937"], years: { from: 2021, to: 2021 }, moduleId: "data/technical/ducati/monster937/profile-2021.js", status: "review", schemaVersion: "revlog-technical-profile/v1" }); });

test("normal loader and resolver discover all Ducati entries losslessly", async () => { const result = await report.buildReport(); assert.equal(result.loaderResult.status, "loaded"); assert.equal(result.loaderResult.profileId, "ducati.monster937.2021"); assert.equal(result.loaderResult.validation.valid, true); assert.equal(result.loaderResult.discovery.status, "found"); assert.equal(result.entryIds.length, 45); ["ignition.spark-plug.standard", "lubrication.engine-oil.viscosity", "lubrication.engine-oil.specification", "electrical.battery.capacity", "electrical.battery.specification", "brakes.fluid.specification"].forEach(id => assert.ok(result.entryIds.includes(id))); assert.deepEqual(Object.fromEntries(Object.entries(result.resolverResult).map(([id, item]) => [id, item.status])), Object.fromEntries(Object.keys(result.resolverResult).map(id => [id, "resolved"]))); assert.deepEqual(result.resolverResult["electrical.battery.capacity"].value, { type: "quantity", amount: 6.5, unit: "Ah" }); });

test("hard exclusions and production boundaries remain explicit", async () => { const result = await report.buildReport(); assert.equal(result.coolingAbsent, true); assert.equal(result.pendingDucatiAbsent, true); assert.equal(result.bmwUnchanged, true); assert.equal(result.vfrUnchanged, true); assert.equal(result.citationsDocumentsUnchanged, true); assert.equal(result.evidenceChanged, false); assert.equal(result.serviceCoreCoverageChanged, false); assert.equal(result.runtimeDiscoverable, true); assert.equal(profile.entries.length, 45); assert.equal(Object.keys(source.documents).length, 1); assert.equal(Object.keys(source.citations).length, 45); });

test("registry and source objects are not mutated by the audit", async () => { const before = JSON.stringify({ registry: registry.listProfiles(), profile, source }); await report.buildReport(); assert.equal(JSON.stringify({ registry: registry.listProfiles(), profile, source }), before); });

test("promotion report is deterministic and stored output matches", async () => { const first = await report.buildReport(); assert.deepEqual(await report.buildReport(), first); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-production-registry-promotion.json"), "utf8")), first); });
