"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const ui = require("../js/technical/technical-profile-ui.js");
const presentation = require("../js/technical/technical-profile-presentation.js");
const matrix = require("../js/technical/technical-profile-core-matrix.js");
const vfr = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const ducati = require("../data/technical/ducati/monster937/profile-2021.js");

const VFR_BIKE = { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", year: 2002 };
const DUCATI_BIKE = { catalogVariantKey: "ducati.monster.937", year: 2021, region: "EU", abs: true, equipment: ["base Monster 937"] };
const VFR_RESOLVED = new Set([
  "engine.displacement", "fuel-tank.capacity", "oil.specification", "oil.viscosity", "oil.quantity-drain", "oil.quantity-filter", "oil-filter.reference", "oil.drain-plug-torque", "oil.filter-torque", "coolant.specification", "coolant.capacity", "spark-plug.model", "spark-plug.gap", "spark-plug.torque", "valves.intake-clearance", "valves.exhaust-clearance", "tires.front-size", "tires.rear-size", "tires.front-pressure-solo", "tires.rear-pressure-solo", "rims.front-size", "rims.rear-size", "axles.front-torque", "axles.rear-torque", "final-drive.type", "sprocket.front-teeth", "sprocket.rear-teeth", "chain.slack", "brake-fluid.specification", "brake-discs.front-minimum-thickness", "brake-discs.rear-minimum-thickness", "battery.model", "charging.voltage", "fuse.main-rating", "fuse.main-location", "lighting.rear-stop", "maintenance.final-drive-interval", "oem.oil-filter"
]);
const DUCATI_RESOLVED = new Set([
  "engine.displacement", "mass.wet-kerb", "oil.specification", "oil.viscosity", "spark-plug.model", "rims.front-size", "rims.rear-size", "final-drive.type", "sprocket.front-teeth", "sprocket.rear-teeth", "brake-fluid.specification", "brake-discs.front-minimum-thickness", "brake-discs.rear-minimum-thickness", "battery.model", "battery.capacity", "fuse.table", "lighting.headlight", "lighting.rear-stop", "lighting.turn-signals", "lighting.license-plate", "oem.chain"
]);
const DUCATI_RELEVANT = {
  "ignition.spark-plug.standard": ["spark-plug.model"],
  "lubrication.engine-oil.viscosity": ["oil.viscosity"],
  "lubrication.engine-oil.specification": ["oil.specification"],
  "electrical.battery.capacity": ["battery.capacity"],
  "electrical.battery.specification": ["battery.model"],
  "brakes.fluid.specification": ["brake-fluid.specification"],
  "rider-service-core.dimensions-mass-wet-kerb-mass": ["mass.wet-kerb"],
  "rider-service-core.brakes-disc-service-limit": ["brake-discs.front-minimum-thickness", "brake-discs.rear-minimum-thickness"],
  "rider-service-core.lighting-rear-indicators": ["lighting.turn-signals"],
  "rider-service-core.lighting-combined-high-low": ["lighting.headlight"],
  "rider-service-core.lighting-brake-light": ["lighting.rear-stop"],
  "rider-service-core.tires-wheels-rim-sizes": ["rims.front-size", "rims.rear-size"],
  "rider-service-core.final-drive-oem-chain-sprocket": ["oem.chain"],
  "rider-service-core.final-drive-chain-size": ["final-drive.type"],
  "rider-service-core.final-drive-front-sprocket": ["sprocket.front-teeth"],
  "rider-service-core.final-drive-rear-sprocket": ["sprocket.rear-teeth"],
  "rider-service-core.electrical-fuse-ratings": ["fuse.table"],
  "rider-service-core.engine-displacement": ["engine.displacement"],
  "rider-service-core.lighting-front-indicators": ["lighting.turn-signals"],
  "rider-service-core.lighting-license-plate": ["lighting.license-plate"],
  "rider-service-core.lighting-rear-tail": ["lighting.rear-stop"]
};

async function audit(profile, motorcycle) {
  const before = JSON.stringify(profile);
  const view = await ui.prepareTechnicalProfileView(motorcycle);
  assert.equal(JSON.stringify(profile), before);
  assert.equal(Object.keys(view.entriesById).length, 95);
  assert.equal(view.categories.length, 14);
  for (const fieldId of matrix.fieldIds) assert.ok(view.entriesById[`rider-core.${fieldId}`], fieldId);
  return view;
}

test("VFR production projection audits all 95 fields and preserves canonical profile", async () => {
  const view = await audit(vfr, VFR_BIKE);
  const counts = Object.values(view.entriesById).reduce((result, entry) => { result[entry.resolutionStatus] = (result[entry.resolutionStatus] || 0) + 1; return result; }, {});
  assert.deepEqual(counts, { resolved: 38, missing: 54, "blocked-applicability": 3 });
  for (const fieldId of VFR_RESOLVED) assert.equal(view.entriesById[`rider-core.${fieldId}`].resolutionStatus, "resolved", fieldId);
  assert.equal(view.entriesById["rider-core.engine.power"].resolutionStatus, "missing");
  assert.equal(vfr.entries.some(entry => entry.id === "general.engine.power"), false);
  assert.equal(view.entriesById["rider-core.fuse.table"].resolutionStatus, "blocked-applicability");
  assert.equal(view.entriesById["rider-core.lighting.headlight"].resolutionStatus, "blocked-applicability");
  assert.equal(view.entriesById["rider-core.brakes.abs-system"].resolutionStatus, "blocked-applicability");
});

test("Ducati production projection audits all 45 verified entries without forcing extended data into Core", async () => {
  const view = await audit(ducati, DUCATI_BIKE);
  const counts = Object.values(view.entriesById).reduce((result, entry) => { result[entry.resolutionStatus] = (result[entry.resolutionStatus] || 0) + 1; return result; }, {});
  assert.deepEqual(counts, { resolved: 21, missing: 74 });
  assert.equal(Object.keys(DUCATI_RELEVANT).length, 21);
  for (const [entryId, fields] of Object.entries(DUCATI_RELEVANT)) {
    const entry = ducati.entries.find(item => item.id === entryId);
    assert.ok(entry, entryId);
    for (const fieldId of fields) assert.ok(presentation.matrixEntryMatches([entry], fieldId).length, `${entryId} -> ${fieldId}`);
  }
  assert.equal(ducati.entries.filter(entry => entry.status === "verified").length, 45);
  assert.equal(view.entriesById["rider-core.brake-discs.front-minimum-thickness"].formattedValue, "4.0 mm");
  assert.equal(view.entriesById["rider-core.brake-discs.rear-minimum-thickness"].formattedValue, "3.6 mm.");
});
