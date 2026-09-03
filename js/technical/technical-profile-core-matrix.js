(function attachRiderServiceCoreMatrix(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogRiderServiceCoreMatrix = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createMatrix() {
  "use strict";
  const domains = Object.freeze([
    ["basic-motorcycle-data", ["engine.configuration", "engine.displacement", "engine.power", "engine.bore", "engine.stroke", "engine.compression-ratio", "engine.service-limits", "dimensions_mass.wet-kerb-mass", "dimensions_mass.dry-mass", "dimensions_mass.payload-gvwr", "dimensions_mass.seat-height", "dimensions_mass.wheelbase", "steering_chassis.rake", "steering_chassis.trail", "fuel_intake.tank-capacity", "fuel_intake.fuel-type-octane", "transmission_clutch.transmission-type", "transmission_clutch.clutch-type"]],
    ["engine-oil-filter", ["lubrication.oil-specification", "lubrication.viscosity", "lubrication.api-jaso", "lubrication.capacity-drain", "lubrication.capacity-filter", "lubrication.capacity-disassembly", "lubrication.oil-filter", "lubrication.drain-plug-torque", "lubrication.filter-torque"]],
    ["cooling", ["cooling.coolant-specification", "cooling.capacity", "cooling.replacement-interval", "cooling.thermostat", "cooling.fan-switch"]],
    ["spark-plugs-ignition", ["ignition.spark-plug-oem", "ignition.spark-plug-alternative", "ignition.plug-gap", "ignition.plug-torque", "ignition.replacement-interval"]],
    ["valves", ["valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "valve_train.inspection-interval"]],
    ["wheels-tires", ["tires_wheels.front-size", "tires_wheels.rear-size", "tires_wheels.oem-tire-models", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures", "tires_wheels.rim-sizes", "tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque"]],
    ["final-drive", ["final_drive.chain-size", "final_drive.front-sprocket", "final_drive.rear-sprocket", "final_drive.final-ratio", "final_drive.chain-slack", "final_drive.chain-inspection", "final_drive.chain-lubrication-interval", "final_drive.oem-chain-sprocket"]],
    ["brakes", ["brakes.front-rear-configuration", "brakes.disc-diameter", "brakes.disc-thickness", "brakes.disc-service-limit", "brakes.pad-thickness-limit", "brakes.oem-pad-numbers", "brakes.brake-fluid", "brakes.fluid-interval", "brakes.caliper-torque"]],
    ["electrical-battery", ["electrical.battery-specification", "electrical.battery-capacity", "electrical.alternator-output", "electrical.charging-voltage", "electrical.charging-test-values"]],
    ["fuses", ["electrical.fuse-ratings", "electrical.main-fuse"]],
    ["lighting", ["lighting.combined-high-low", "lighting.low-beam", "lighting.high-beam", "lighting.front-position", "lighting.rear-tail", "lighting.brake-light", "lighting.front-indicators", "lighting.rear-indicators", "lighting.license-plate", "lighting.drl", "lighting.replaceability"]],
    ["periodic-maintenance", ["maintenance.periodic-schedule", "maintenance.inspect", "maintenance.replace", "maintenance.adjust", "maintenance.lubricate", "maintenance.clean", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals", "maintenance.initial-service", "maintenance.severe-use"]],
    ["consumables", ["oem_parts.oil-filter", "oem_parts.air-filter", "oem_parts.spark-plugs", "oem_parts.front-brake-pads", "oem_parts.rear-brake-pads", "oem_parts.chain", "oem_parts.front-sprocket", "oem_parts.rear-sprocket", "oem_parts.service-washers"]],
    ["practical-torques", ["torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle", "torques.axle-pinch-bolts", "torques.brake-calipers", "torques.sprockets", "torques.chain-adjusters", "torques.routine-service-fasteners"]]
  ].map(([id, fieldIds]) => Object.freeze({ id, fieldIds: Object.freeze(fieldIds) })));
  const fieldIds = Object.freeze(domains.flatMap(domain => domain.fieldIds));
  return Object.freeze({ schemaVersion: "revlog-rider-service-core-presentation/v1", domains, fieldIds });
});
