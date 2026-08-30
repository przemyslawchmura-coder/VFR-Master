// NON-PRODUCTION planning definition. This file schedules research; it performs none.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");

const targets = Object.freeze([
  { catalogVariantKey: "honda.cbr500r.pc70", scope: "MY2024–2025 / USA-Canada", currentVerified: 26, practicalGaps: ["lubrication.oil-specification", "lubrication.oil-filter", "cooling.replacement-interval", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.inspection-interval", "final_drive.chain-size", "brakes.fluid-interval", "tires_wheels.loaded-pressures", "maintenance.schedule-mileage-intervals", "torques.front-axle"], applicabilityRisks: ["confirm PC70 model-year applicability", "do not inherit CB500X/NX500 values"] },
  { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", scope: "MY2002–2005 / RC46 VTEC / EU-UK", currentVerified: 13, practicalGaps: ["lubrication.api-jaso", "lubrication.capacity-drain", "lubrication.oil-filter", "cooling.coolant-specification", "cooling.capacity", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "final_drive.chain-size", "final_drive.chain-slack", "tires_wheels.loaded-pressures", "torques.oil-drain-bolt", "torques.front-axle"], applicabilityRisks: ["manual identity remains uncertain", "VFR800/VFR800A ABS distinction", "MY2002 must be explicit"] },
  { catalogVariantKey: "honda.nc750x.rh09-1", scope: "MY2021–2024 / EU-UK", currentVerified: 3, practicalGaps: ["lubrication.oil-specification", "lubrication.capacity-filter", "lubrication.oil-filter", "cooling.coolant-specification", "ignition.spark-plug-oem", "valve_train.inspection-interval", "final_drive.chain-slack", "brakes.brake-fluid", "tires_wheels.solo-pressures", "maintenance.periodic-schedule", "torques.front-axle"], applicabilityRisks: ["manual vs DCT", "year-specific updates"] },
  { catalogVariantKey: "honda.africa-twin.crf1100l-1", scope: "MY2020–2023 / EU-UK", currentVerified: 5, practicalGaps: ["lubrication.oil-specification", "lubrication.capacity-filter", "cooling.coolant-specification", "ignition.spark-plug-oem", "valve_train.inspection-interval", "brakes.brake-fluid", "tires_wheels.solo-pressures", "maintenance.periodic-schedule", "torques.front-axle"], applicabilityRisks: ["manual vs DCT", "standard vs Adventure Sports equipment"] },
  { catalogVariantKey: "honda.cbr600rr.rh10", scope: "MY2024–2025 / EU-UK", currentVerified: 4, practicalGaps: ["lubrication.oil-specification", "lubrication.capacity-filter", "lubrication.oil-filter", "cooling.coolant-specification", "ignition.spark-plug-oem", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "brakes.brake-fluid", "tires_wheels.solo-pressures", "maintenance.periodic-schedule", "torques.front-axle"], applicabilityRisks: ["road setup only; exclude race data", "RH10 model-year applicability"] }
]);

const practicalServiceFields = Object.freeze([
  "lubrication.oil-specification", "lubrication.viscosity", "lubrication.api-jaso", "lubrication.capacity-drain", "lubrication.capacity-filter", "lubrication.oil-filter",
  "cooling.coolant-specification", "cooling.capacity", "cooling.replacement-interval", "ignition.spark-plug-oem", "ignition.spark-plug-alternative", "ignition.plug-gap", "ignition.replacement-interval",
  "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "valve_train.inspection-interval", "final_drive.chain-size", "final_drive.chain-slack", "final_drive.chain-inspection", "final_drive.chain-lubrication-interval",
  "brakes.brake-fluid", "brakes.fluid-interval", "brakes.oem-pad-numbers", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures", "electrical.battery-specification", "electrical.battery-capacity", "electrical.main-fuse",
  "maintenance.periodic-schedule", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals", "torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle"
]);
const genericSpecificationFields = Object.freeze(["engine.configuration", "engine.displacement", "engine.idle-speed", "brakes.front-rear-configuration", "tires_wheels.front-size", "tires_wheels.rear-size", "fuel_intake.tank-capacity"]);

const sourceTiers = Object.freeze({
  A: Object.freeze(["factory workshop/service manual", "official service-data publication", "official owner manual with maintenance/specification chapters"]),
  B: Object.freeze(["official maintenance schedule", "official OEM parts catalogue", "official technical bulletin/handbook"]),
  C: Object.freeze(["official brochure/specification page"]),
  D: Object.freeze(["third-party mirror/aggregator/discovery page"])
});
const sourceOrder = Object.freeze(["A", "B", "C", "D"]);
const success = Object.freeze({ minimumPracticalServiceFields: 10, minimumVerifiedTargetSlots: 15, zeroSafetyCriticalConflicts: true, maximumSelectedTargets: 5, maximumPrimaryDocumentsPerTarget: 3, requiredReportingMetrics: Object.freeze(["documentsInspected", "documentsYieldingEvidence", "evidenceRowsProduced", "verifiedTargetSlotGain", "practicalServiceFieldGain", "genericSpecificationGain", "serviceCoreGainPerTarget", "evidenceRowsPerYieldingDocument"]) });
const stopConditions = Object.freeze(["source identity cannot be authenticated", "applicability remains unresolved", "only Tier C material is available after bounded inspection", "zero practical Service Core gain after the primary source budget", "target has unresolved transmission/ABS/year ambiguity", "duplicate source adds no new evidence"]);

function validate() {
  if (targets.length < 4 || targets.length > 6) throw new Error("pilot must contain 4–6 targets");
  pipeline.serviceCoreFields.forEach(field => { if (!practicalServiceFields.includes(field) && !genericSpecificationFields.includes(field)) throw new Error(`Service Core field missing from classification: ${field}`); });
  return true;
}

module.exports = Object.freeze({ schemaVersion: "revlog-high-value-source-pilot/v1", targets, practicalServiceFields, genericSpecificationFields, sourceTiers, sourceOrder, success, stopConditions, validate });
