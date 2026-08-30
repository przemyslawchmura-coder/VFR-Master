// NON-PRODUCTION RESEARCH DATA. Values require human review before promotion.
"use strict";

const coverage = require("../schema/research-coverage-standard.js");
const serviceCore = Object.freeze([
  "engine.configuration", "engine.displacement", "engine.idle-speed",
  "lubrication.oil-specification", "lubrication.viscosity", "lubrication.api-jaso",
  "lubrication.capacity-drain", "lubrication.capacity-filter", "lubrication.oil-filter",
  "cooling.coolant-specification", "cooling.capacity", "cooling.replacement-interval",
  "ignition.spark-plug-oem", "ignition.spark-plug-alternative", "ignition.plug-gap", "ignition.replacement-interval",
  "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "valve_train.inspection-interval",
  "final_drive.chain-size", "final_drive.chain-slack", "final_drive.chain-inspection", "final_drive.chain-lubrication-interval",
  "brakes.brake-fluid", "brakes.fluid-interval", "brakes.front-rear-configuration", "brakes.oem-pad-numbers",
  "tires_wheels.front-size", "tires_wheels.rear-size", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures",
  "electrical.battery-specification", "electrical.battery-capacity", "electrical.main-fuse",
  "fuel_intake.tank-capacity",
  "maintenance.periodic-schedule", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals",
  "torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle"
]);

const sources = Object.freeze([
  { id: "research.honda.service.cbr500r.2024-manual", type: "official-owner-manual", title: "2024 CBR500R/NX500 Owner's Manual", manufacturer: "Honda", documentYear: 2024, region: "USA/Canada", url: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf" },
  { id: "research.honda.service.2021-supersport-brochure", type: "official-technical-publication", title: "Honda UK 2021 Super Sport brochure", manufacturer: "Honda", documentYear: 2021, region: "EU/UK", url: "https://www.honda.co.uk/content/dam/local/uk/brochures/motorcycles/21YMBrochures/21YMHUKMCSUPERSPORTLR1.pdf" },
  { id: "research.honda.service.2021-adventure-brochure", type: "official-technical-publication", title: "Honda UK 2021 Adventure brochure", manufacturer: "Honda", documentYear: 2021, region: "EU/UK", url: "https://www.honda.co.uk/content/dam/local/uk/brochures/motorcycles/21YMBrochures/21YMHUKMCAdventureLR1.pdf" },
  { id: "research.honda.service.vfr800.2002-manual", type: "oem-service-manual", title: "Honda VFR800/VFR800A Service Manual (mirror listing)", manufacturer: "Honda Motor Co., Ltd.", publicationId: null, documentYear: null, region: "unknown", url: "https://www.manualslib.com/manual/3139216/Honda-Interceptor-2002.html", identityStatus: "uncertain" },
  { id: "research.honda.service.vfr800.2002-service-card", type: "oem-service-data-card", title: "VFR800 (VTEC) RC46 2002–2005 service data card", manufacturer: "Honda", documentYear: 2002, region: "EU", url: "https://www.hondabikes.fi/content/download/7049/43710/file/VFR800F%202002-2005%20huoltokortti.pdf", independentlyVerified: true },
  { id: "research.honda.service.vfr800.2002-parts", type: "authorized-oem-parts", title: "Honda VFR800 2002 genuine-parts fiche (RC46)", manufacturer: "Honda", documentYear: 2002, region: "EU", url: "https://www.pieces-honda.be/thumbs/pdf_url/img/fiche_technique/VFR8002/2500_2500/001.pdf", metadataOnly: true }
]);

const targets = Object.freeze([
  ["honda.vfr800.rc46.vtec.gen1", "VFR800", "VTEC — I", 2002, 2005, "EU/UK", "RESEARCH-MORE"],
  ["honda.cbr500r.pc70", "CBR500R", "PC70", 2024, 2025, "USA/Canada", "SERVICE-CORE-PARTIAL"],
  ["honda.cbr600rr.rh10", "CBR600RR", "RH10", 2024, 2025, "EU/UK", "SERVICE-CORE-PARTIAL"],
  ["honda.cbr-fireblade.sc82-1", "CBR1000RR-R Fireblade", "SC82 — I", 2020, 2021, "EU/UK", "SERVICE-CORE-PARTIAL"],
  ["honda.africa-twin.crf1100l-1", "CRF1100L Africa Twin", "CRF1100L — I", 2020, 2023, "EU/UK", "SERVICE-CORE-PARTIAL"],
  ["honda.cb500f.pc63-1", "CB500F", "PC63 — I", 2019, 2021, "EU/UK", "RESEARCH-MORE"],
  ["honda.nc750x.rh09-1", "NC750X", "RH09 — I", 2021, 2024, "EU/UK", "SERVICE-CORE-PARTIAL"],
  ["honda.transalp.xl750", "XL750 Transalp", "XL750", 2023, 2025, "EU/UK", "RESEARCH-MORE"]
].map(([catalogVariantKey, family, generation, from, to, region, readiness]) => Object.freeze({ catalogVariantKey, family, generation, years: Object.freeze({ from, to }), region, abs: null, transmission: null, readiness })));

const researchDate = "2026-08-30";
const evidenceRows = [
  ["honda.cbr500r.pc70", "engine.displacement", "471 cc", 471, "cm³", "research.honda.service.cbr500r.2024-manual", "Specifications", "175"],
  ["honda.cbr500r.pc70", "engine.configuration", "Liquid-cooled DOHC parallel twin", "Liquid-cooled DOHC parallel twin", null, "research.honda.service.cbr500r.2024-manual", "Specifications", "175"],
  ["honda.cbr500r.pc70", "lubrication.capacity-drain", "2.6 US qt (2.5 L)", 2.5, "L", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "lubrication.capacity-filter", "2.9 US qt (2.7 L)", 2.7, "L", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "lubrication.viscosity", "SAE 10W-30", "SAE 10W-30", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "cooling.coolant-specification", "Pro Honda HP Coolant", "Pro Honda HP Coolant", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "177"],
  ["honda.cbr500r.pc70", "cooling.capacity", "1.32 L", 1.32, "L", "research.honda.service.cbr500r.2024-manual", "Service Data", "177"],
  ["honda.cbr500r.pc70", "ignition.spark-plug-oem", "NGK CPR8EA-9", "NGK CPR8EA-9", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "ignition.plug-gap", "0.8–0.9 mm", { min: 0.8, max: 0.9 }, "mm", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "brakes.brake-fluid", "Honda DOT 4 Brake Fluid", "DOT 4", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "tires_wheels.front-size", "120/70ZR17M/C", "120/70ZR17M/C", null, "research.honda.service.cbr500r.2024-manual", "Main Components", "175"],
  ["honda.cbr500r.pc70", "tires_wheels.rear-size", "160/60ZR17M/C", "160/60ZR17M/C", null, "research.honda.service.cbr500r.2024-manual", "Main Components", "175"],
  ["honda.cbr500r.pc70", "tires_wheels.solo-pressures", "250 kPa front / 290 kPa rear, cold", { front: 250, rear: 290, condition: "cold" }, "kPa", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "electrical.battery-specification", "12 V 7.4 Ah AGM", "12 V 7.4 Ah AGM", null, "research.honda.service.cbr500r.2024-manual", "Main Components", "175"],
  ["honda.cbr500r.pc70", "electrical.main-fuse", "30 A", 30, "A", "research.honda.service.cbr500r.2024-manual", "Fuses", "177"],
  ["honda.cbr500r.pc70", "final_drive.chain-slack", "25–35 mm", { min: 25, max: 35 }, "mm", "research.honda.service.cbr500r.2024-manual", "Service Data", "177"],
  ["honda.cbr500r.pc70", "maintenance.periodic-schedule", "Periodic maintenance schedule", "documented", null, "research.honda.service.cbr500r.2024-manual", "Maintenance Schedule", "95"],
  ["honda.cbr500r.pc70", "lubrication.api-jaso", "API SJ or higher, JASO MA", "API SJ / JASO MA", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "lubrication.capacity-disassembly", "3.0 US qt (2.8 L)", 2.8, "L", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "final_drive.chain-size", "520", "520", null, "research.honda.service.cbr500r.2024-manual", "Service Data", "177"],
  ["honda.cbr500r.pc70", "final_drive.chain-inspection", "Inspect at each scheduled service", "scheduled inspection", null, "research.honda.service.cbr500r.2024-manual", "Maintenance Schedule", "95"],
  ["honda.cbr500r.pc70", "final_drive.chain-lubrication-interval", "Lubricate at each scheduled service", "scheduled lubrication", null, "research.honda.service.cbr500r.2024-manual", "Maintenance Schedule", "95"],
  ["honda.cbr500r.pc70", "tires_wheels.loaded-pressures", "250 kPa front / 290 kPa rear, cold (load condition)", { front: 250, rear: 290, condition: "cold", load: "loaded" }, "kPa", "research.honda.service.cbr500r.2024-manual", "Service Data", "176"],
  ["honda.cbr500r.pc70", "electrical.battery-capacity", "7.4 Ah", 7.4, "Ah", "research.honda.service.cbr500r.2024-manual", "Main Components", "175"],
  ["honda.cbr500r.pc70", "fuel_intake.tank-capacity", "17.1 L", 17.1, "L", "research.honda.service.cbr500r.2024-manual", "Specifications", "175"],
  ["honda.cbr500r.pc70", "maintenance.schedule-mileage-intervals", "12,800 km periodic service interval", 12800, "km", "research.honda.service.cbr500r.2024-manual", "Maintenance Schedule", "95"],
  ["honda.cbr500r.pc70", "maintenance.schedule-time-intervals", "12 months periodic service interval", 12, "months", "research.honda.service.cbr500r.2024-manual", "Maintenance Schedule", "95"],
  ["honda.cbr600rr.rh10", "engine.displacement", "599 cc", 599, "cm³", "research.honda.service.2021-supersport-brochure", "Specifications — CBR600RR", "6"],
  ["honda.cbr600rr.rh10", "tires_wheels.front-size", "120/70-ZR17", "120/70-ZR17", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR600RR", "6"],
  ["honda.cbr600rr.rh10", "tires_wheels.rear-size", "180/55-ZR17", "180/55-ZR17", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR600RR", "6"],
  ["honda.cbr-fireblade.sc82-1", "engine.displacement", "999 cc", 999, "cm³", "research.honda.service.2021-supersport-brochure", "Specifications — CBR1000RR-R", "6"],
  ["honda.cbr-fireblade.sc82-1", "tires_wheels.front-size", "120/70-ZR17", "120/70-ZR17", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR1000RR-R", "6"],
  ["honda.cbr-fireblade.sc82-1", "tires_wheels.rear-size", "200/55-ZR17", "200/55-ZR17", null, "research.honda.service.2021-supersport-brochure", "Specifications — CBR1000RR-R", "6"],
  ["honda.africa-twin.crf1100l-1", "engine.displacement", "1,084 cc", 1084, "cm³", "research.honda.service.2021-adventure-brochure", "Specifications — CRF1100L Africa Twin", "18"],
  ["honda.africa-twin.crf1100l-1", "cooling.capacity", "1.32 L", 1.32, "L", "research.honda.service.2021-adventure-brochure", "Specifications — CRF1100L Africa Twin", "18"],
  ["honda.africa-twin.crf1100l-1", "tires_wheels.front-size", "90/90-21", "90/90-21", null, "research.honda.service.2021-adventure-brochure", "Specifications — CRF1100L Africa Twin", "18"],
  ["honda.africa-twin.crf1100l-1", "tires_wheels.rear-size", "150/70R18", "150/70R18", null, "research.honda.service.2021-adventure-brochure", "Specifications — CRF1100L Africa Twin", "18"],
  ["honda.nc750x.rh09-1", "engine.displacement", "745 cc", 745, "cm³", "research.honda.service.2021-adventure-brochure", "Specifications — NC750X", "19"],
  ["honda.nc750x.rh09-1", "fuel_intake.tank-capacity", "14.1 L", 14.1, "L", "research.honda.service.2021-adventure-brochure", "Specifications — NC750X", "19"]
];

const vfrEvidence = [
  ["engine.configuration", "90° V4 DOHC VTEC", "90° V4 DOHC VTEC", null, "1. General Information / General specifications", "1-4", "cite.honda.vfr800-2002.sm.general-specs"],
  ["engine.displacement", "782 cm³", 782, "cm³", "1. General Information / General specifications", "1-4", "cite.honda.vfr800-2002.sm.general-specs"],
  ["engine.idle-speed", "1,200 ±100 rpm", 1200, "rpm", "1. General Information / PGM-FI specifications", "1-6", "cite.honda.vfr800-2002.sm.fuel-specs"],
  ["lubrication.oil-specification", "API SF/SG or higher; JASO MA; no molybdenum", "API SF/SG or higher; JASO MA", null, "1. General Information / Lubrication system", "1-6", "cite.honda.vfr800-2002.sm.lubrication-specs"],
  ["lubrication.viscosity", "SAE 10W-40", "SAE 10W-40", null, "1. General Information / Lubrication system", "1-6", "cite.honda.vfr800-2002.sm.lubrication-specs"],
  ["lubrication.capacity-drain", "2.9 L after draining", 2.9, "L", "1. General Information / Lubrication system", "1-6", "cite.honda.vfr800-2002.sm.lubrication-specs"],
  ["lubrication.capacity-filter", "3.1 L after oil-filter change", 3.1, "L", "1. General Information / Lubrication system", "1-6", "cite.honda.vfr800-2002.sm.lubrication-specs"],
  ["lubrication.oil-filter", "15410-MCJ-505", "15410-MCJ-505", null, "3. Maintenance / Oil filter", "3-14–3-16", "cite.honda.vfr800-2002.sm.engine-oil-service"],
  ["cooling.coolant-specification", "Ethylene-glycol coolant, 50% distilled-water mix", "Ethylene-glycol, 50% mix", null, "1. General Information / Cooling", "1-6", "cite.honda.vfr800-2002.sm.cooling-specs"],
  ["cooling.capacity", "2.92 L engine and radiators", 2.92, "L", "1. General Information / Cooling", "1-6", "cite.honda.vfr800-2002.sm.cooling-specs"],
  ["ignition.spark-plug-oem", "NGK IMR9B-9H / DENSO VNH27Z", "NGK IMR9B-9H / DENSO VNH27Z", null, "3. Maintenance / Spark plug", "3-8", "cite.honda.vfr800-2002.sm.spark-plug"],
  ["ignition.plug-gap", "0.8–0.9 mm", { min: 0.8, max: 0.9 }, "mm", "3. Maintenance / Spark plug", "3-8", "cite.honda.vfr800-2002.sm.spark-plug"],
  ["valve_train.intake-clearance", "0.20 ±0.03 mm standard; 0.20 ±0.08 mm VTEC", { standard: { nominal: 0.2, tolerance: 0.03 }, vtec: { nominal: 0.2, tolerance: 0.08 } }, "mm", "3. Maintenance / Valve clearance", "3-9–3-13", "cite.honda.vfr800-2002.sm.valve-procedure"],
  ["valve_train.exhaust-clearance", "0.35 ±0.03 mm standard; 0.35 ±0.08 mm VTEC", { standard: { nominal: 0.35, tolerance: 0.03 }, vtec: { nominal: 0.35, tolerance: 0.08 } }, "mm", "3. Maintenance / Valve clearance", "3-9–3-13", "cite.honda.vfr800-2002.sm.valve-procedure"],
  ["valve_train.measurement-conditions", "Engine below 35 °C; separate VTEC lifter procedure", "cold below 35 °C", "°C", "3. Maintenance / Valve clearance", "3-9–3-13", "cite.honda.vfr800-2002.sm.valve-procedure"],
  ["valve_train.inspection-interval", "24,000 km", 24000, "km", "3. Maintenance / Maintenance schedule", "3-4–3-5", "cite.honda.vfr800-2002.sm.maintenance-schedule"],
  ["final_drive.chain-size", "RK50HFOZ5, 110 links", "RK50HFOZ5 / 110 links", null, "1. General Information / Drive chain", "1-5", "cite.honda.vfr800-2002.sm.chain-specification"],
  ["final_drive.chain-slack", "25–35 mm", { min: 25, max: 35 }, "mm", "3. Maintenance / Drive chain", "3-19–3-21", "cite.honda.vfr800-2002.sm.drive-chain"],
  ["final_drive.chain-inspection", "Inspect and adjust at scheduled service", "scheduled inspection", null, "3. Maintenance / Drive chain", "3-19–3-21", "cite.honda.vfr800-2002.sm.drive-chain"],
  ["final_drive.chain-lubrication-interval", "1,000 km and after wet riding", "1,000 km / wet-use condition", "km", "3. Maintenance / Maintenance schedule", "3-4–3-5", "cite.honda.vfr800-2002.sm.maintenance-schedule"],
  ["brakes.brake-fluid", "DOT 4", "DOT 4", null, "3. Maintenance / Brake fluid", "3-25", "cite.honda.vfr800-2002.sm.brake-fluid"],
  ["brakes.fluid-interval", "24 months", 24, "months", "3. Maintenance / Maintenance schedule", "3-4–3-5", "cite.honda.vfr800-2002.sm.maintenance-schedule"],
  ["brakes.front-rear-configuration", "Dual front discs; rear disc; CBS/ABS applicability retained", "dual front / rear disc", null, "1. General Information / Brake specifications", "1-9, 1-18", "cite.honda.vfr800-2002.sm.chassis-specs"],
  ["tires_wheels.front-size", "120/70 ZR17", "120/70 ZR17", null, "1. General Information / Wheel specifications", "1-9", "cite.honda.vfr800-2002.sm.chassis-specs"],
  ["tires_wheels.rear-size", "180/55 ZR17", "180/55 ZR17", null, "1. General Information / Wheel specifications", "1-9", "cite.honda.vfr800-2002.sm.chassis-specs"],
  ["tires_wheels.solo-pressures", "250 kPa front / 290 kPa rear, cold", { front: 250, rear: 290, condition: "cold" }, "kPa", "Honda RC46 service data card", "1", "cite.honda.vfr800-2002.card.service-data"],
  ["electrical.battery-specification", "12 V battery, 10 Ah class", "12 V / 10 Ah", null, "1. General Information / Electrical specifications", "1-14", "cite.honda.vfr800-2002.sm.electrical-output"],
  ["electrical.main-fuse", "30 A main fuse", 30, "A", "Owner manual / Fuse replacement", "135–136", "cite.honda.vfr800-2002.om.fuses"],
  ["fuel_intake.tank-capacity", "22 L", 22, "L", "1. General Information / General specifications", "1-4", "cite.honda.vfr800-2002.sm.general-specs"],
  ["maintenance.periodic-schedule", "Honda maintenance schedule", "documented", null, "3. Maintenance / Maintenance schedule", "3-4–3-5", "cite.honda.vfr800-2002.sm.maintenance-schedule"],
  ["maintenance.schedule-mileage-intervals", "12,000 km oil service; 24,000 km valve inspection", { oil: 12000, valves: 24000 }, "km", "Honda RC46 service data card", "1", "cite.honda.vfr800-2002.card.maintenance"],
  ["maintenance.schedule-time-intervals", "12 months oil service; 24 months fluids", { oil: 12, fluids: 24 }, "months", "Honda RC46 service data card", "1", "cite.honda.vfr800-2002.card.maintenance"],
  ["torques.oil-drain-bolt", "30 N·m", 30, "N·m", "3. Maintenance / Engine oil service", "3-14–3-16", "cite.honda.vfr800-2002.sm.engine-oil-service"],
  ["torques.oil-filter", "26 N·m", 26, "N·m", "3. Maintenance / Engine oil service", "3-14–3-16", "cite.honda.vfr800-2002.sm.engine-oil-service"],
  ["torques.spark-plugs", "12 N·m", 12, "N·m", "3. Maintenance / Spark plug", "3-8", "cite.honda.vfr800-2002.sm.spark-plug"],
  ["torques.front-axle", "59 N·m", 59, "N·m", "1. General Information / Frame torque values", "1-17", "cite.honda.vfr800-2002.sm.frame-torques"],
  ["torques.rear-axle", "113 N·m", 113, "N·m", "1. General Information / Frame torque values", "1-17", "cite.honda.vfr800-2002.sm.frame-torques"]
].map(([field, rawValue, normalizedValue, unit, sourceSection, sourcePage, sourceId], index) => ["honda.vfr800.rc46.vtec.gen1", field, rawValue, normalizedValue, unit, "research.honda.service.vfr800.2002-manual", sourceSection, sourcePage, sourceId]);

const allEvidenceRows = evidenceRows.concat(vfrEvidence);
const cardVerified = new Set(["engine.idle-speed", "lubrication.oil-specification", "lubrication.viscosity", "lubrication.capacity-filter", "ignition.spark-plug-oem", "ignition.plug-gap", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "tires_wheels.solo-pressures", "maintenance.periodic-schedule", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals"]);
const evidence = Object.freeze(allEvidenceRows.map(([catalogVariantKey, field, rawValue, normalizedValue, unit, sourceId, sourceSection, sourcePage, productionSourceId], index) => { const isVfr = catalogVariantKey === "honda.vfr800.rc46.vtec.gen1"; const direct = isVfr && cardVerified.has(field); const proofStatus = isVfr ? (direct ? "VERIFIED-DIRECT" : "SOURCE-IDENTITY-UNCERTAIN") : "VERIFIED-DIRECT"; const effectiveSource = direct ? "research.honda.service.vfr800.2002-service-card" : sourceId; return Object.freeze({ id: `honda.service.wave1.evidence.${String(index + 1).padStart(3, "0")}`, catalogVariantKey, field, status: proofStatus === "VERIFIED-DIRECT" ? "evidence-found" : "not-researched", proofStatus, rawValue, normalizedValue, unit, sourceId: effectiveSource, sourceSection: direct ? "Huoltokortti / service specifications" : sourceSection, sourcePage: direct ? "1" : sourcePage, researchDate, traceability: productionSourceId ? Object.freeze({ productionSourceId, independentlyVerified: direct, comparison: direct ? "MATCH-NORMALIZED" : "NOT-COMPARABLE" }) : null, applicability: Object.freeze({ abs: null, transmission: null }) }); }));
const noEvidenceFields = Object.freeze([
  ["honda.cbr500r.pc70", ["valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "valve_train.inspection-interval", "brakes.oem-pad-numbers", "torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle", "electrical.charging-voltage"]]
]);
const reviewedNoEvidence = Object.freeze(noEvidenceFields.flatMap(([catalogVariantKey, fields]) => fields.map((field, index) => Object.freeze({ id: `honda.service.wave1.reviewed.${String(index + 1).padStart(3, "0")}`, catalogVariantKey, field, status: "researched-no-evidence", rawValue: null, normalizedValue: null, unit: null, sourceId: null, sourceSection: null, sourcePage: null, researchDate, sourceCategoriesSearched: Object.freeze(["official-owner-manual", "official-service-manual", "official-oem-parts"]), sourceIdsSearched: Object.freeze(["research.honda.service.cbr500r.2024-manual"]), result: "no reliable evidence", applicability: Object.freeze({ abs: null, transmission: null }) }))));

module.exports = Object.freeze({ schemaVersion: "revlog-honda-service-data/v1", canonicalFieldCount: coverage.FIELD_COUNT, serviceCore, sources, targets, evidence, reviewedNoEvidence, researchDate });
