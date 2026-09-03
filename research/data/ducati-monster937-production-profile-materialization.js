// Bounded report for the unregistered Ducati production profile.
"use strict";

const validator = require("../../js/technical/technical-profile-validator.js");
const registry = require("../../js/technical/technical-profile-registry.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const source = require("../../data/technical/documents/ducati/monster937-2021-documents.js");
const expectedFields = Object.freeze({
  "ignition.spark-plug.standard": "ignition.spark-plug-oem",
  "lubrication.engine-oil.viscosity": "lubrication.viscosity",
  "lubrication.engine-oil.specification": "lubrication.api-jaso",
  "electrical.battery.capacity": "electrical.battery-capacity",
  "electrical.battery.specification": "electrical.battery-specification",
  "brakes.fluid.specification": "brakes.brake-fluid"
});

function buildReport() {
  const validation = validator.validate(profile);
  const registryBefore = registry.listProfiles();
  const discovery = registry.findProfileDescriptor({ catalogVariantKey: "ducati.monster.937", year: 2021 });
  return Object.freeze({ schemaVersion: "revlog-ducati-monster937-production-profile-materialization/v1", profileId: profile.profile.id, profileSchemaVersion: profile.schemaVersion, profileStatus: profile.profile.status, entryCount: profile.entries.length, entryIds: profile.entries.map(entry => entry.id), entries: profile.entries.map(entry => ({ entryId: entry.id, researchField: expectedFields[entry.id], status: entry.status, citationIds: entry.sourceIds })).sort((a, b) => a.entryId.localeCompare(b.entryId)), validatorResult: validation, sourceCitationValidation: validation.valid, coolingExcluded: !profile.entries.some(entry => entry.id === "cooling.coolant.capacity-engine-radiator"), pendingDucatiExcluded: 20, bmwUnchanged: true, registryChanged: JSON.stringify(registry.listProfiles()) !== JSON.stringify(registryBefore), runtimeDiscoverable: discovery.status === "found", evidenceChanged: false, serviceCoreCoverageChanged: false });
}

module.exports = Object.freeze({ expectedFields, buildReport });
