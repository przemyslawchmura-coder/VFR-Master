(function attachRiderServiceCoreMatrix(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogRiderServiceCoreMatrix = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createMatrix() {
  "use strict";
  const definitions = [
    ["basic-motorcycle-data", ["engine.displacement", "engine.power", "mass.wet-kerb", "fuel-tank.capacity"]],
    ["engine-oil-filter", ["oil.specification", "oil.viscosity", "oil.quantity-drain", "oil.quantity-filter", "oil-filter.reference", "oil.drain-plug-torque", "oil.filter-torque", "oil.replacement-interval", "oil-filter.replacement-interval"]],
    ["cooling", ["coolant.specification", "coolant.capacity", "coolant.replacement-interval", "coolant.fan-on-temperature"]],
    ["spark-plugs-ignition", ["spark-plug.model", "spark-plug.gap", "spark-plug.torque", "spark-plug.inspection-interval", "spark-plug.replacement-interval"]],
    ["valves", ["valves.intake-clearance", "valves.exhaust-clearance", "valves.measurement-conditions", "valves.inspection-interval", "valves.adjustment-interval", "valves.system-notes"]],
    ["wheels-tires", ["tires.front-size", "tires.rear-size", "tires.front-pressure-solo", "tires.rear-pressure-solo", "tires.front-pressure-loaded", "tires.rear-pressure-loaded", "rims.front-size", "rims.rear-size", "axles.front-torque", "axles.rear-torque"]],
    ["final-drive", ["final-drive.type", "sprocket.front-teeth", "sprocket.rear-teeth", "chain.slack", "chain-sprocket.replacement-interval", "belt.specification", "belt.tension", "final-drive-oil.specification", "final-drive-oil.quantity", "final-drive-oil.replacement-interval"]],
    ["brakes", ["brake-fluid.specification", "brake-fluid.replacement-interval", "brake-pads.front-minimum-thickness", "brake-pads.rear-minimum-thickness", "brake-discs.front-minimum-thickness", "brake-discs.rear-minimum-thickness", "brake-pads.front-reference", "brake-pads.rear-reference", "brakes.abs-system"]],
    ["electrical-battery", ["battery.model", "battery.voltage", "battery.capacity", "battery.cca", "charging.voltage"]],
    ["fuses", ["fuse.main-rating", "fuse.main-location", "fuse.table", "fuse.spares"]],
    ["lighting", ["lighting.headlight", "lighting.position", "lighting.rear-stop", "lighting.turn-signals", "lighting.license-plate", "lighting.instruments", "lighting.other-sources", "lighting.led-replaceability"]],
    ["periodic-maintenance", ["maintenance.air-filter-interval", "maintenance.fuel-filter-interval", "maintenance.final-drive-interval"]],
    ["consumables", ["oem.oil-filter", "oem.air-filter", "oem.spark-plug", "oem.front-brake-pads", "oem.rear-brake-pads", "oem.chain", "oem.front-sprocket", "oem.rear-sprocket", "oem.fuel-filter", "oem.oil-drain-seal", "oem.front-suspension-seals", "oem.wheel-bearings-seals"]],
    ["practical-torques", ["torque.rear-axle-chain-adjustment", "torque.front-sprocket", "torque.rear-sprocket", "torque.final-drive-oil-plug", "torque.wheel-nuts", "torque.handlebar-clamps"]]
  ];
  const domains = Object.freeze(definitions.map(([id, fieldIds]) => Object.freeze({ id, fieldIds: Object.freeze(fieldIds) })));
  const fieldIds = Object.freeze(domains.flatMap(domain => domain.fieldIds));
  if (fieldIds.length !== 95 || new Set(fieldIds).size !== fieldIds.length) throw new Error("Rider Service Core v1 must contain 95 unique fields");
  return Object.freeze({ schemaVersion: "revlog-rider-service-core-presentation/v1", domains, fieldIds });
});
