// NON-PRODUCTION executed research pilot. Nothing here is imported by production.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const design = require("./high-value-source-acquisition-pilot.js");
const service = require("./honda-service-wave1.js");
const wave2 = require("./honda-batch-wave2.js");
const catalog = require("../../scripts/motorcycle-catalog-report.js").loadCatalog();

const researchDate = "2026-08-31";
const selectedTargetKeys = Object.freeze(design.targets.map(target => target.catalogVariantKey));
const sources = Object.freeze([
  { id: "pilot.cbr500r.31mlrb00", documentId: "research.honda.service.cbr500r.2024-manual", tier: "A", sourceClass: "official-owner-manual", publisher: "American Honda Motor Co., Inc.", title: "2024 CB500F / CBR500R / NX500 Owner's Manual", publicationId: "31MLRB00 / 00X31-MLR-B000", publicationDate: 2024, url: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf", disposition: "acquired-content", authenticationState: "official-honda-host", models: ["CBR500R PC70", "CB500F", "NX500"], years: { from: 2024, to: 2024 }, markets: ["USA", "Canada"], inspectedPages: [95, 175, 176, 177], targets: ["honda.cbr500r.pc70"], yieldedEvidence: false, stopCondition: "duplicate source adds no new evidence", notes: "Existing 26 verified slots were reused; already verified fields were not re-extracted." },
  { id: "pilot.vfr800.service-card", documentId: "research.honda.service.vfr800.2002-service-card", tier: "A", sourceClass: "official-service-data-publication", publisher: "Honda", title: "VFR800 (VTEC) RC46 2002–2005 service data card", publicationId: "VFR800F 2002-2005 huoltokortti", publicationDate: 2002, url: "https://www.hondabikes.fi/content/download/7049/43710/file/VFR800F%202002-2005%20huoltokortti.pdf", disposition: "acquired-content", authenticationState: "official-honda-distributor-host", models: ["VFR800 RC46 VTEC"], years: { from: 2002, to: 2005 }, markets: ["EU"], inspectedPages: [1], targets: ["honda.vfr800.rc46.vtec.gen1"], yieldedEvidence: false, stopCondition: "duplicate source adds no new evidence", notes: "All authenticated fields from this card were already represented in the 13-slot baseline; uncertain workshop-manual rows remained unverified." },
  { id: "pilot.nc750x.34mkw600", documentId: "Honda|34MKW600", tier: "A", sourceClass: "official-owner-manual", publisher: "Honda Motor Co., Ltd.", title: "NC750XA/XD Fahrerhandbuch", publicationId: "34MKW600 / 00X34-MKW-6000", publicationDate: 2021, url: "https://2rom-prd-data.hondamotopub.com/om/HMEG/NC750X/2021-2022-2023/34MKW600%20OM%20NC750XA%20XD%2021%20ger_WEB.pdf", disposition: "acquired-content", authenticationState: "official-honda-motopub-host", models: ["NC750XA", "NC750XD"], years: { from: 2021, to: 2023 }, markets: ["EU", "UK"], inspectedPages: [9, 104, 105, 106, 113, 114, 115, 116, 136, 173, 174, 175], targets: ["honda.nc750x.rh09-1"], yieldedEvidence: true, stopCondition: "primary source yielded the bounded practical fields; no further document required", notes: "Shared values cover manual and DCT; oil capacities are separately scoped to NC750XA manual and NC750XD DCT." },
  { id: "pilot.africa-twin.31mks800", documentId: "Honda|31MKS800", tier: "A", sourceClass: "official-owner-manual", publisher: "American Honda Motor Co., Inc.", title: "2020 CRF1100A/D/A4/D4 Africa Twin Owner's Manual", publicationId: "31MKS800", publicationDate: 2020, url: "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.2020_31mks800_crf1100_africa_twin.pdf", disposition: "wrong-applicability", authenticationState: "official-honda-host", models: ["CRF1100A", "CRF1100D", "CRF1100A4", "CRF1100D4"], years: { from: 2020, to: 2020 }, markets: ["USA"], inspectedPages: [1, 367, 368, 369], targets: ["honda.africa-twin.crf1100l-1"], yieldedEvidence: false, stopCondition: "applicability remains unresolved", notes: "The pilot target is EU/UK and standard-model data must not be inherited from Adventure Sports or a USA publication." },
  { id: "pilot.cbr600rr.32mkz700", documentId: "Honda|32MKZ700", tier: "A", sourceClass: "official-owner-manual", publisher: "Honda Motor Co., Ltd.", title: "CBR600R3 Owner's Manual", publicationId: "32MKZ700", publicationDate: 2023, url: "https://2rom-prd-data.hondamotopub.com/om/HMEE/CBR600R3/2024/CBR600R3_32MKZ7000_eng_WEB.pdf", alternateUrl: "https://webom.hondamotopub.com/webom/HMEE/MKZ241/html/", disposition: "acquired-content", authenticationState: "official-honda-motopub-host", models: ["CBR600R3 / CBR600RR"], years: { from: 2024, to: 2024 }, markets: ["EU", "UK"], inspectedPages: [11, 110, 111, 112, 119, 120, 121, 122, 141, 181, 182, 183], targets: ["honda.cbr600rr.rh10"], yieldedEvidence: true, stopCondition: "primary source yielded the bounded practical fields; no further document required", notes: "ED/II ED road-owner data only; GS schedule rows and race/track material were excluded." },
]);

let nextEvidenceId = 1;
function row(target, field, rawValue, normalizedValue, unit, sourceId, section, page, applicability = {}) {
  return Object.freeze({ id: `pilot.evidence.${String(nextEvidenceId++).padStart(3, "0")}`, catalogVariantKey: target, canonicalFieldId: field, rawValue, normalizedValue, unit, sourceId, sourceClass: "official-owner-manual", sourceTier: "A", section, printedPage: String(page), viewerPage: String(Number(page) + 4), yearApplicability: target === "honda.nc750x.rh09-1" ? { from: 2021, to: 2023 } : { from: 2024, to: 2024 }, marketApplicability: target === "honda.nc750x.rh09-1" ? "EU" : "EU/UK", applicability: pipeline.validateApplicability({ abs: null, transmission: null, equipment: "standard-road", ...applicability }), proofStatus: "VERIFIED-DIRECT", verificationMethod: "manual inspection of authenticated Honda-hosted owner manual", contentInspected: true, researchDate });
}

const nc = "honda.nc750x.rh09-1";
const ns = "Honda|34MKW600";
const cbr = "honda.cbr600rr.rh10";
const cs = "Honda|32MKZ700";
const evidence = Object.freeze([
  row(nc, "engine.idle-speed", "1,200 ± 100 rpm", { value: 1200, tolerance: 100 }, "rpm", ns, "Service data", 174),
  row(nc, "lubrication.oil-specification", "Honda 4-stroke motorcycle oil", "Honda 4-stroke motorcycle oil", null, ns, "Service data", 174),
  row(nc, "lubrication.viscosity", "SAE 10W-30", "SAE 10W-30", null, ns, "Service data", 174),
  row(nc, "lubrication.api-jaso", "API SG or higher; JASO T 903 MA", "API SG+ / JASO MA", null, ns, "Service data", 174),
  row(nc, "lubrication.capacity-drain", "3.4 L after draining (NC750XA manual)", 3.4, "L", ns, "Service data", 174, { transmission: "manual" }),
  row(nc, "lubrication.capacity-drain", "3.1 L after draining (NC750XD DCT)", 3.1, "L", ns, "Service data", 174, { transmission: "dct" }),
  row(nc, "lubrication.capacity-filter", "3.6 L after draining and oil-filter change (NC750XA manual)", 3.6, "L", ns, "Service data", 174, { transmission: "manual" }),
  row(nc, "lubrication.capacity-filter", "3.4 L after draining and oil-filter change (NC750XD DCT)", 3.4, "L", ns, "Service data", 174, { transmission: "dct" }),
  row(nc, "cooling.coolant-specification", "Pro Honda HP Coolant, premixed 50/50", "Pro Honda HP Coolant / 50:50", null, ns, "Recommended coolant", 116),
  row(nc, "cooling.capacity", "Cooling system capacity 1.69 L", 1.69, "L", ns, "Service data", 174),
  row(nc, "cooling.replacement-interval", "Replace radiator coolant every 3 years", 36, "months", ns, "Maintenance schedule", 105),
  row(nc, "ignition.spark-plug-oem", "NGK IFR6G-11K", "NGK IFR6G-11K", null, ns, "Service data", 174),
  row(nc, "ignition.plug-gap", "1.00–1.10 mm; not adjustable", { min: 1.0, max: 1.1, adjustable: false }, "mm", ns, "Service data", 174),
  row(nc, "final_drive.chain-size", "DID 520V0 or RK 520KHO, 114 links", "DID 520V0 / RK 520KHO; 114 links", null, ns, "Service data", 175),
  row(nc, "final_drive.chain-slack", "25–35 mm", { min: 25, max: 35 }, "mm", ns, "Drive chain / vehicle label", 136),
  row(nc, "final_drive.chain-inspection", "Inspect condition and slack every 1,000 km", 1000, "km", ns, "Maintenance schedule", 106),
  row(nc, "final_drive.chain-lubrication-interval", "Lubricate every 1,000 km and after inspection", 1000, "km", ns, "Maintenance schedule", 106),
  row(nc, "brakes.brake-fluid", "Honda DOT 4 Brake Fluid or equivalent", "DOT 4", null, ns, "Maintenance fundamentals", 114),
  row(nc, "brakes.fluid-interval", "Replace brake fluid every 2 years", 24, "months", ns, "Maintenance schedule", 106),
  row(nc, "tires_wheels.solo-pressures", "250 kPa front / 290 kPa rear, cold, rider only", { front: 250, rear: 290, condition: "cold", load: "solo" }, "kPa", ns, "Tyre information label", 9),
  row(nc, "tires_wheels.loaded-pressures", "250 kPa front / 290 kPa rear, cold, rider and passenger", { front: 250, rear: 290, condition: "cold", load: "loaded" }, "kPa", ns, "Tyre information label", 9),
  row(nc, "electrical.battery-specification", "YTZ12S, 12 V", "YTZ12S / 12 V", null, ns, "Main data", 173),
  row(nc, "electrical.battery-capacity", "11.0 Ah (10 HR) / 11.6 Ah (20 HR)", { ah10hr: 11.0, ah20hr: 11.6 }, "Ah", ns, "Main data", 173),
  row(nc, "electrical.main-fuse", "30 A", 30, "A", ns, "Fuses", 175),
  row(nc, "maintenance.periodic-schedule", "Honda ED/II ED periodic maintenance schedule", "documented", null, ns, "Maintenance schedule", 104),
  row(nc, "maintenance.schedule-mileage-intervals", "Repeat ED/II ED schedule at 12,000 km intervals after initial service", 12000, "km", ns, "Maintenance schedule", 105),
  row(nc, "maintenance.schedule-time-intervals", "Annual check; brake fluid 2 years; coolant 3 years", { annualCheck: 12, brakeFluid: 24, coolant: 36 }, "months", ns, "Maintenance schedule", 105),
  row(cbr, "engine.idle-speed", "1,400 ± 100 rpm", { value: 1400, tolerance: 100 }, "rpm", cs, "Service data", 182),
  row(cbr, "lubrication.oil-specification", "Honda 4-stroke motorcycle oil", "Honda 4-stroke motorcycle oil", null, cs, "Service data", 182),
  row(cbr, "lubrication.viscosity", "SAE 10W-30", "SAE 10W-30", null, cs, "Service data", 182),
  row(cbr, "lubrication.api-jaso", "API SJ or higher; JASO T 903 MA", "API SJ+ / JASO MA", null, cs, "Service data", 182),
  row(cbr, "lubrication.capacity-drain", "2.6 L after draining", 2.6, "L", cs, "Service data", 182),
  row(cbr, "lubrication.capacity-filter", "2.7 L after draining and oil-filter change", 2.7, "L", cs, "Service data", 182),
  row(cbr, "cooling.coolant-specification", "Pro Honda HP Coolant, premixed 50/50", "Pro Honda HP Coolant / 50:50", null, cs, "Recommended coolant / service data", 122),
  row(cbr, "cooling.capacity", "Cooling system capacity 2.76 L", 2.76, "L", cs, "Service data", 182),
  row(cbr, "cooling.replacement-interval", "Replace radiator coolant every 3 years", 36, "months", cs, "ED/II ED maintenance schedule", 111),
  row(cbr, "ignition.spark-plug-oem", "NGK SILMAR9C9", "NGK SILMAR9C9", null, cs, "Service data", 182),
  row(cbr, "ignition.plug-gap", "0.8–0.9 mm", { min: 0.8, max: 0.9 }, "mm", cs, "Service data", 182),
  row(cbr, "final_drive.chain-size", "DID525HV3, 112 links", "DID525HV3 / 112 links", null, cs, "Service data", 182),
  row(cbr, "final_drive.chain-slack", "30–40 mm", { min: 30, max: 40 }, "mm", cs, "Drive chain / vehicle label", 141),
  row(cbr, "final_drive.chain-inspection", "Inspect condition and slack every 1,000 km", 1000, "km", cs, "ED/II ED maintenance schedule", 112),
  row(cbr, "final_drive.chain-lubrication-interval", "Lubricate every 1,000 km and after inspection", 1000, "km", cs, "ED/II ED maintenance schedule", 112),
  row(cbr, "brakes.brake-fluid", "Honda DOT 4 Brake Fluid or equivalent", "DOT 4", null, cs, "Maintenance fundamentals / service data", 120),
  row(cbr, "brakes.fluid-interval", "Replace brake fluid every 2 years", 24, "months", cs, "ED/II ED maintenance schedule", 112),
  row(cbr, "tires_wheels.solo-pressures", "250 kPa front / 290 kPa rear, cold, rider only", { front: 250, rear: 290, condition: "cold", load: "solo" }, "kPa", cs, "Tyre information label", 11),
  row(cbr, "tires_wheels.loaded-pressures", "250 kPa front / 290 kPa rear, cold, rider and passenger", { front: 250, rear: 290, condition: "cold", load: "loaded" }, "kPa", cs, "Tyre information label", 11),
  row(cbr, "electrical.battery-specification", "YTZ10S, 12 V", "YTZ10S / 12 V", null, cs, "Main data", 181),
  row(cbr, "electrical.battery-capacity", "8.6 Ah (10 HR) / 9.1 Ah (20 HR)", { ah10hr: 8.6, ah20hr: 9.1 }, "Ah", cs, "Main data", 181),
  row(cbr, "electrical.main-fuse", "30 A", 30, "A", cs, "Fuses", 183),
  row(cbr, "maintenance.periodic-schedule", "Honda ED/II ED periodic maintenance schedule", "documented", null, cs, "Maintenance schedule", 110),
  row(cbr, "maintenance.schedule-mileage-intervals", "Repeat ED/II ED schedule at 12,000 km intervals after initial service", 12000, "km", cs, "Maintenance schedule", 111),
  row(cbr, "maintenance.schedule-time-intervals", "Annual check; brake fluid 2 years; coolant 3 years", { annualCheck: 12, brakeFluid: 24, coolant: 36 }, "months", cs, "Maintenance schedule", 111),
]);

const researchedNoEvidence = Object.freeze([
  { catalogVariantKey: "honda.cbr500r.pc70", result: "existing authenticated owner manual exhausted without a net-new practical slot", sourceIds: ["research.honda.service.cbr500r.2024-manual"] },
  { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", result: "authenticated service card exhausted; workshop-manual identity remains uncertain", sourceIds: ["research.honda.service.vfr800.2002-service-card"] },
  { catalogVariantKey: "honda.africa-twin.crf1100l-1", result: "official USA manual rejected for EU/UK and standard/Adventure Sports applicability", sourceIds: ["Honda|31MKS800"] },
]);

function runPilot() {
  const beforeEvidence = service.evidence.map(item => ({ ...item, canonicalFieldId: item.field })).concat(wave2.evidence);
  const beforeTargets = pipeline.generateTargets(catalog, { catalogVariantKeys: selectedTargetKeys }, beforeEvidence);
  const afterTargets = pipeline.generateTargets(catalog, { catalogVariantKeys: selectedTargetKeys }, beforeEvidence.concat(evidence));
  const documents = pipeline.buildDocumentRegistry(sources.flatMap(source => source.alternateUrl ? [source, { ...source, id: `${source.id}.alternate`, url: source.alternateUrl }] : [source]));
  const targetResults = design.targets.map(target => {
    const before = beforeTargets.find(item => item.catalogVariantKey === target.catalogVariantKey).evidenceCount;
    const after = afterTargets.find(item => item.catalogVariantKey === target.catalogVariantKey).evidenceCount;
    const rows = evidence.filter(item => item.catalogVariantKey === target.catalogVariantKey);
    const fields = new Set(rows.map(item => item.canonicalFieldId));
    const targetSources = sources.filter(source => source.targets.includes(target.catalogVariantKey));
    return Object.freeze({ catalogVariantKey: target.catalogVariantKey, before, after, gain: after - before, practicalGain: [...fields].filter(field => design.practicalServiceFields.includes(field)).length, genericGain: [...fields].filter(field => design.genericSpecificationFields.includes(field)).length, documentsInspected: targetSources.length, documentsYieldingEvidence: targetSources.filter(source => source.yieldedEvidence).length, highestTier: targetSources.map(source => source.tier).sort()[0] || null, conflicts: 0, applicabilityBlockers: researchedNoEvidence.filter(item => item.catalogVariantKey === target.catalogVariantKey).map(item => item.result), importantRemainingPracticalGaps: target.practicalGaps.filter(field => !fields.has(field)) });
  });
  const yielding = sources.filter(source => source.yieldedEvidence).length;
  const conflicts = pipeline.detectConflicts(evidence);
  return Object.freeze({ schemaVersion: "revlog-high-value-source-pilot-results/v1", researchDate, selectedTargetKeys, sources, documents, evidence, researchedNoEvidence, beforeTargets, afterTargets, targetResults, conflicts, metrics: Object.freeze({ documentsInspected: sources.length, uniqueDocuments: documents.length, hostingLocations: documents.reduce((sum, doc) => sum + doc.locations.length, 0), duplicateHostingLocations: documents.reduce((sum, doc) => sum + Math.max(0, doc.locations.length - 1), 0), documentsYieldingEvidence: yielding, evidenceRowsProduced: evidence.length, verifiedTargetSlotGain: targetResults.reduce((sum, item) => sum + item.gain, 0), practicalServiceFieldGain: targetResults.reduce((sum, item) => sum + item.practicalGain, 0), genericSpecificationGain: targetResults.reduce((sum, item) => sum + item.genericGain, 0), serviceCoreBefore: targetResults.reduce((sum, item) => sum + item.before, 0), serviceCoreAfter: targetResults.reduce((sum, item) => sum + item.after, 0), evidenceRowsPerYieldingDocument: Number((evidence.length / yielding).toFixed(2)), sourceTierDistribution: Object.freeze({ A: sources.filter(source => source.tier === "A").length, B: 0, C: 0, D: 0 }), conflictsDiscovered: conflicts.length, unresolvedApplicabilityCases: researchedNoEvidence.length, researchedNoEvidenceOutcomes: researchedNoEvidence.length, sourceBudgetExceeded: false }) });
}

module.exports = Object.freeze({ researchDate, selectedTargetKeys, sources, evidence, researchedNoEvidence, runPilot });
