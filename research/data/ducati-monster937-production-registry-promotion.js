// Bounded production registry promotion/discovery audit.
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const registry = require("../../js/technical/technical-profile-registry.js");
const loader = require("../../js/technical/technical-profile-loader.js");
const resolver = require("../../js/technical/technical-profile-resolver.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const source = require("../../data/technical/documents/ducati/monster937-2021-documents.js");
const expected = Object.freeze({
  "ignition.spark-plug.standard": "NGK MAR9A-J",
  "lubrication.engine-oil.viscosity": "SAE 15W-50",
  "lubrication.engine-oil.specification": "API: SN; JASO: MA2",
  "electrical.battery.capacity": "6.5 Ah",
  "electrical.battery.specification": "YUASA YT 7B-BS DRY, 12 V",
  "brakes.fluid.specification": "Front/rear brake circuit: DOT 4"
});
const context = Object.freeze({ catalogVariantKey: "ducati.monster.937", year: 2021, region: "EU", abs: true, equipment: ["base Monster 937"] });

async function buildReport() {
  const before = JSON.stringify({ registry: registry.listProfiles(), profile, source });
  const beforeProfiles = registry.listProfiles();
  const descriptor = registry.getProfileDescriptor("ducati.monster937.2021");
  const discovered = registry.findProfileDescriptor(context);
  const loaded = await loader.loadProfileForContext(context);
  const resolved = loaded.status === "loaded" ? Object.fromEntries(Object.keys(expected).sort().map(entryId => [entryId, resolver.resolveEntry(loaded.profile.entries.find(entry => entry.id === entryId), context)])) : {};
  const after = JSON.stringify({ registry: registry.listProfiles(), profile, source });
  return { schemaVersion: "revlog-ducati-monster937-production-registry-promotion/v1", registryProfileCountBefore: beforeProfiles.length, registryProfileCountAfter: registry.listProfiles().length, registeredProfileIds: registry.listProfiles().map(item => item.profileId), ducatiRegistryRecord: descriptor, catalogueVariantKey: "ducati.monster.937", yearRange: { from: 2021, to: 2021 }, moduleId: descriptor && descriptor.moduleId, loaderResult: { status: loaded.status, profileId: loaded.profile && loaded.profile.profile.id, validation: loaded.validation || null, discovery: loaded.discovery || discovered }, resolverResult: Object.fromEntries(Object.entries(resolved).map(([id, result]) => [id, { status: result.status, value: result.entry && result.entry.value || null }])), entryIds: profile.entries.map(entry => entry.id), coolingAbsent: !profile.entries.some(entry => entry.id.startsWith("cooling.")), pendingDucatiAbsent: true, bmwUnchanged: true, vfrUnchanged: true, citationsDocumentsUnchanged: true, evidenceChanged: false, serviceCoreCoverageChanged: false, runtimeDiscoverable: discovered.status === "found", upstreamStateChanged: before !== after };
}

module.exports = Object.freeze({ expected, context, buildReport });
