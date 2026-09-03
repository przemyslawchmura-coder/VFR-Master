// NON-PRODUCTION canonical owner-first Rider Service Core machine matrix.
"use strict";

const DOMAINS = Object.freeze([
  ["basic-motorcycle-data", [
    ["engine.configuration", "scalar"], ["engine.displacement", "scalar"], ["engine.power", "scalar"], ["engine.bore", "scalar"],
    ["engine.stroke", "scalar"], ["engine.compression-ratio", "scalar"], ["engine.service-limits", "scalar"],
    ["dimensions_mass.wet-kerb-mass", "scalar"], ["dimensions_mass.dry-mass", "scalar"], ["dimensions_mass.payload-gvwr", "scalar"],
    ["dimensions_mass.seat-height", "scalar"], ["dimensions_mass.wheelbase", "scalar"], ["steering_chassis.rake", "scalar"],
    ["steering_chassis.trail", "scalar"], ["fuel_intake.tank-capacity", "scalar"], ["fuel_intake.fuel-type-octane", "scalar"],
    ["transmission_clutch.transmission-type", "scalar"], ["transmission_clutch.clutch-type", "scalar"]
  ]],
  ["engine-oil-filter", [
    ["lubrication.oil-specification", "scalar"], ["lubrication.viscosity", "scalar"], ["lubrication.api-jaso", "scalar"],
    ["lubrication.capacity-drain", "scalar"], ["lubrication.capacity-filter", "scalar"], ["lubrication.capacity-disassembly", "scalar"],
    ["lubrication.oil-filter", "scalar"], ["lubrication.drain-plug-torque", "scalar"], ["lubrication.filter-torque", "scalar"]
  ]],
  ["cooling", [["cooling.coolant-specification", "scalar"], ["cooling.capacity", "scalar"], ["cooling.replacement-interval", "scalar"], ["cooling.thermostat", "scalar"], ["cooling.fan-switch", "scalar"]]],
  ["spark-plugs-ignition", [["ignition.spark-plug-oem", "scalar"], ["ignition.spark-plug-alternative", "scalar"], ["ignition.plug-gap", "scalar"], ["ignition.plug-torque", "scalar"], ["ignition.replacement-interval", "scalar"]]],
  ["valves", [["valve_train.intake-clearance", "structured"], ["valve_train.exhaust-clearance", "structured"], ["valve_train.measurement-conditions", "structured"], ["valve_train.inspection-interval", "scalar"]]],
  ["wheels-tires", [["tires_wheels.front-size", "scalar"], ["tires_wheels.rear-size", "scalar"], ["tires_wheels.oem-tire-models", "scalar"], ["tires_wheels.solo-pressures", "structured"], ["tires_wheels.loaded-pressures", "structured"], ["tires_wheels.rim-sizes", "structured"], ["tires_wheels.front-axle-torque", "scalar"], ["tires_wheels.rear-axle-torque", "scalar"]]],
  ["final-drive", [["final_drive.chain-size", "scalar"], ["final_drive.front-sprocket", "scalar"], ["final_drive.rear-sprocket", "scalar"], ["final_drive.final-ratio", "scalar"], ["final_drive.chain-slack", "structured"], ["final_drive.chain-inspection", "structured"], ["final_drive.chain-lubrication-interval", "structured"], ["final_drive.oem-chain-sprocket", "structured"]]],
  ["brakes", [["brakes.front-rear-configuration", "structured"], ["brakes.disc-diameter", "structured"], ["brakes.disc-thickness", "structured"], ["brakes.disc-service-limit", "structured"], ["brakes.pad-thickness-limit", "structured"], ["brakes.oem-pad-numbers", "structured"], ["brakes.brake-fluid", "scalar"], ["brakes.fluid-interval", "scalar"], ["brakes.caliper-torque", "structured"]]],
  ["electrical-battery", [["electrical.battery-specification", "scalar"], ["electrical.battery-capacity", "scalar"], ["electrical.alternator-output", "scalar"], ["electrical.charging-voltage", "scalar"], ["electrical.charging-test-values", "structured"]]],
  ["fuses", [["electrical.fuse-ratings", "repeating"], ["electrical.main-fuse", "structured"]]],
  ["lighting", [["lighting.combined-high-low", "repeating"], ["lighting.low-beam", "structured"], ["lighting.high-beam", "structured"], ["lighting.front-position", "structured"], ["lighting.rear-tail", "structured"], ["lighting.brake-light", "structured"], ["lighting.front-indicators", "structured"], ["lighting.rear-indicators", "structured"], ["lighting.license-plate", "structured"], ["lighting.drl", "structured"], ["lighting.replaceability", "structured"]]],
  ["periodic-maintenance", [["maintenance.periodic-schedule", "repeating"], ["maintenance.inspect", "repeating"], ["maintenance.replace", "repeating"], ["maintenance.adjust", "repeating"], ["maintenance.lubricate", "repeating"], ["maintenance.clean", "repeating"], ["maintenance.schedule-mileage-intervals", "repeating"], ["maintenance.schedule-time-intervals", "repeating"], ["maintenance.initial-service", "structured"], ["maintenance.severe-use", "structured"]]],
  ["consumables", [["oem_parts.oil-filter", "scalar"], ["oem_parts.air-filter", "scalar"], ["oem_parts.spark-plugs", "scalar"], ["oem_parts.front-brake-pads", "scalar"], ["oem_parts.rear-brake-pads", "scalar"], ["oem_parts.chain", "scalar"], ["oem_parts.front-sprocket", "scalar"], ["oem_parts.rear-sprocket", "scalar"], ["oem_parts.service-washers", "scalar"]]],
  ["practical-torques", [["torques.oil-drain-bolt", "scalar"], ["torques.oil-filter", "scalar"], ["torques.spark-plugs", "scalar"], ["torques.front-axle", "scalar"], ["torques.rear-axle", "scalar"], ["torques.axle-pinch-bolts", "scalar"], ["torques.brake-calipers", "scalar"], ["torques.sprockets", "scalar"], ["torques.chain-adjusters", "scalar"], ["torques.routine-service-fasteners", "scalar"]]]
].map(([id, fields]) => Object.freeze({ id, fields: Object.freeze(fields.map(([fieldId, representation]) => Object.freeze({ fieldId, representation, associationKeys: representation === "repeating" ? Object.freeze(["item", "sourceLocation", "applicability"]) : Object.freeze([]) }))) })));

const fieldIds = Object.freeze(DOMAINS.flatMap(domain => domain.fields.map(field => field.fieldId)));
if (new Set(fieldIds).size !== fieldIds.length) throw new Error("Rider Service Core field identities must be unique");
const fieldMap = Object.freeze(Object.fromEntries(DOMAINS.flatMap(domain => domain.fields.map(field => [field.fieldId, Object.freeze({ ...field, domainId: domain.id })]))));

function validateFieldIdentity(fieldId) {
  if (typeof fieldId !== "string" || !fieldMap[fieldId]) throw new TypeError("unknown Rider Service Core field identity");
  return fieldMap[fieldId];
}

module.exports = Object.freeze({ schemaVersion: "revlog-rider-service-core/v1", domains: DOMAINS, fieldIds, fieldMap, validateFieldIdentity });
