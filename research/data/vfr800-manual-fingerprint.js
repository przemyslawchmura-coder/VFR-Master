// NON-PRODUCTION RESEARCH DATA. Fingerprint of the publicly rendered VFR800 manual.
"use strict";

const sourceUrl = "https://www.manualslib.com/manual/3920066/Honda-Vfr800-2002.html";
const target = "honda.vfr800.rc46.vtec.gen1";

// The rendering exposes a table of contents and selected page text, but not the
// internal Honda cover/publication metadata. These rows are therefore discovery
// fingerprints only and cannot satisfy the evidence-found predicate.
const blockedFields = Object.freeze([
  ["engine.configuration", 7, "General Specifications", false],
  ["engine.displacement", 7, "General Specifications", false],
  ["lubrication.capacity-drain", 97, "Engine Oil/Oil Filter", false],
  ["lubrication.oil-filter", 97, "Engine Oil/Oil Filter", false],
  ["cooling.coolant-specification", 100, "Cooling System/Radiator Coolant", false],
  ["cooling.capacity", 100, "Cooling System/Radiator Coolant", false],
  ["valve_train.inspection-interval", 92, "Valve Clearance", true],
  ["final_drive.chain-size", 102, "Drive Chain", true],
  ["final_drive.chain-slack", 102, "Drive Chain", true],
  ["final_drive.chain-inspection", 102, "Drive Chain", true],
  ["final_drive.chain-lubrication-interval", 102, "Drive Chain", true],
  ["brakes.brake-fluid", 108, "Brake Fluid", false],
  ["brakes.fluid-interval", 108, "Brake Fluid", false],
  ["brakes.front-rear-configuration", 110, "Brake System", false],
  ["tires_wheels.front-size", 117, "Wheels/Tires", false],
  ["tires_wheels.rear-size", 117, "Wheels/Tires", false],
  ["electrical.battery-specification", 17, "Ignition System Specifications/Lights-Meters-Switches", false],
  ["electrical.main-fuse", 17, "Ignition System Specifications/Lights-Meters-Switches", false],
  ["fuel_intake.tank-capacity", 7, "General Specifications", false],
  ["torques.oil-drain-bolt", 97, "Engine Oil/Oil Filter", false],
  ["torques.oil-filter", 97, "Engine Oil/Oil Filter", false],
  ["torques.spark-plugs", 90, "Spark Plug", false],
  ["torques.front-axle", 12, "Front Wheel/Suspension/Steering Specifications", false],
  ["torques.rear-axle", 12, "Rear Wheel/Suspension Specifications", false]
].map(([canonicalFieldId, viewerPage, section, contentInspected]) => Object.freeze({
  target,
  canonicalFieldId,
  sourceUrl,
  viewerPage,
  printedPage: viewerPage,
  section,
  visibleValue: null,
  normalizedValue: null,
  unit: null,
  internalModelText: "VFR800 2002 manual rendering title only",
  internalYearText: null,
  vfr800Applicability: null,
  vfr800aApplicability: null,
  absApplicability: null,
  hondaOriginEvidence: "Honda brand/category and technical manual content visible; publisher metadata not internal",
  publicationFamilyMarkers: Object.freeze(["638-page rendering", "Honda VFR800 2002 title", "TOC section marker"]),
  publicationIdKnown: false,
  contentInspected,
  fieldMatch: false,
  applicabilityStatus: "not-proven",
  finalProofStatus: "SOURCE-IDENTITY-UNCERTAIN"
})));

module.exports = Object.freeze({ schemaVersion: "revlog-vfr800-manual-fingerprint/v1", sourceUrl, pageCount: 638, target, blockedFields });
