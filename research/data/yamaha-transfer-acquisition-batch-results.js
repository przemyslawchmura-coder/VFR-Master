// NON-PRODUCTION executed Yamaha transfer batch. Never imported by production runtime.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const pilotDesign = require("./high-value-source-acquisition-pilot.js");
const catalog = require("../../scripts/motorcycle-catalog-report.js").loadCatalog();

const researchDate = "2026-08-31";
const targetKeys = Object.freeze(["yamaha.mt-09.gen3", "yamaha.tenere-700.gen1"]);
const sources = Object.freeze([
  {
    id: "yamaha.transfer.mt09.b7n-28199-e0", documentId: "Yamaha|B7N-28199-E0", tier: "A", sourceClass: "official-owner-manual",
    publisher: "Yamaha Motor Co., Ltd.", title: "MTN890 (MT-09) Owner's Manual", publicationId: "B7N-28199-E0", edition: "1st edition, August 2020", publicationDate: 2020,
    url: "https://cdn2.yamaha-motor.eu/prod/owner-manuals/Motorcycles/PB7N28199E0E.PDF", officialHost: "cdn2.yamaha-motor.eu", disposition: "acquired-content", authenticationState: "official-yamaha-europe-host-and-internal-publication-identity",
    contentHashSha256: "44d573bd16e757ec587c14a19a33c1f4de945dc8e9b928df4844d332a67a2ce1", language: "English", pageCount: 108,
    models: ["MTN890 (MT-09)"], years: { from: 2021, to: 2021 }, markets: ["EU"], abs: true, transmission: "manual", equipment: "standard; MT-09 SP excluded",
    inspectedPages: ["7-3–7-6", "7-9–7-15", "7-20–7-24", "7-31", "9-1–9-2"], targets: ["yamaha.mt-09.gen3"], yieldedEvidence: true,
    stopCondition: "first authenticated primary document exhausted the bounded practical fields; no second document justified"
  },
  {
    id: "yamaha.transfer.tenere700.bw3-f8199-e0", documentId: "Yamaha|BW3-F8199-E0", tier: "A", sourceClass: "official-owner-manual",
    publisher: "MBK Industrie / Yamaha Motor Europe N.V.", title: "XTZ690 / XTZ690-U Owner's Manual", publicationId: "BW3-F8199-E0", edition: "1st edition, July 2019", publicationDate: 2019,
    url: "https://cdn2.yamaha-motor.eu/prod/owner-manuals/Motorcycles/PBW3F8199E0E.pdf", officialHost: "cdn2.yamaha-motor.eu", disposition: "acquired-content", authenticationState: "official-yamaha-europe-host-and-internal-publication-identity",
    contentHashSha256: "734700f970986ec394bcfb04242a668bbd10437b1b534cdf62a397238409b649", language: "English", pageCount: 102,
    models: ["XTZ690", "XTZ690-U"], years: { from: 2019, to: 2019 }, markets: ["EU"], abs: true, transmission: "manual", equipment: "standard; named special editions excluded",
    inspectedPages: ["6-3–6-6", "6-9–6-17", "6-22–6-25", "6-32", "8-1–8-2"], targets: ["yamaha.tenere-700.gen1"], yieldedEvidence: true,
    stopCondition: "first authenticated primary document exhausted the bounded practical fields; no second document justified"
  }
]);

const targetConfig = Object.freeze({
  "yamaha.mt-09.gen3": Object.freeze({ sourceId: "Yamaha|B7N-28199-E0", year: 2021, equipment: "standard-mt09", pdfOffset: { 7: 59, 9: 90 } }),
  "yamaha.tenere-700.gen1": Object.freeze({ sourceId: "Yamaha|BW3-F8199-E0", year: 2019, equipment: "standard-xtz690", pdfOffset: { 6: 51, 8: 85 } })
});

let sequence = 0;
function row(target, canonicalFieldId, rawValue, normalizedValue, unit, printedPage, section) {
  const config = targetConfig[target];
  const chapter = Number(printedPage.split("-")[0]);
  const pageInChapter = Number(printedPage.split("-")[1]);
  return Object.freeze({
    id: `yamaha.transfer.evidence.${String(++sequence).padStart(3, "0")}`,
    catalogVariantKey: target, canonicalFieldId, rawValue, normalizedValue, unit,
    sourceId: config.sourceId, sourceClass: "official-owner-manual", sourceTier: "A", section,
    printedPage, viewerPage: String(config.pdfOffset[chapter] + pageInChapter),
    yearApplicability: Object.freeze({ from: config.year, to: config.year }), marketApplicability: "EU",
    applicability: pipeline.validateApplicability({ abs: true, transmission: "manual", equipment: config.equipment }),
    proofStatus: "VERIFIED-DIRECT", verificationMethod: "manual and text-layer inspection of authenticated Yamaha-hosted owner manual", contentInspected: true, researchDate
  });
}

function commonRows(target, value) {
  return [
    row(target, "lubrication.oil-specification", value.oilSpecification, value.oilSpecificationNormalized, null, value.specPage, "Specifications — engine oil"),
    row(target, "lubrication.viscosity", "SAE 10W-40", "SAE 10W-40", null, value.specPage, "Specifications — engine oil"),
    row(target, "lubrication.api-jaso", "API service SG type or higher; JASO standard MA", "API SG+ / JASO MA", null, value.specPage, "Specifications — engine oil"),
    row(target, "lubrication.capacity-drain", value.oilDrain.raw, value.oilDrain.value, "L", value.oilPage, "Engine oil"),
    row(target, "lubrication.capacity-filter", value.oilFilter.raw, value.oilFilter.value, "L", value.oilPage, "Engine oil and oil filter"),
    row(target, "cooling.coolant-specification", "YAMALUBE coolant; otherwise ethylene-glycol antifreeze with aluminum corrosion inhibitors mixed 1:1 with distilled water", "YAMALUBE coolant / ethylene glycol 1:1", null, value.coolantPage, "Coolant"),
    row(target, "cooling.capacity", value.coolant.raw, value.coolant.value, "L", value.coolantPage, "Coolant / specifications"),
    row(target, "ignition.spark-plug-oem", value.sparkPlug, value.sparkPlug.replace("/", " "), null, value.sparkPage, "Checking the spark plugs"),
    row(target, "ignition.plug-gap", "0.8–0.9 mm", { min: 0.8, max: 0.9 }, "mm", value.sparkPage, "Checking the spark plugs"),
    row(target, "valve_train.inspection-interval", "Check and adjust every 40,000 km (24,000 mi)", 40000, "km", value.schedulePage, "Periodic maintenance chart"),
    row(target, "final_drive.chain-slack", value.chainSlack.raw, value.chainSlack.value, "mm", value.chainPage, "Drive chain slack"),
    row(target, "final_drive.chain-inspection", "Check chain slack, alignment and condition every 1,000 km and after washing, rain or wet riding", { distance: 1000, conditions: ["after-washing", "rain", "wet-riding"] }, "km", value.chainSchedulePage, "General maintenance and lubrication chart"),
    row(target, "final_drive.chain-lubrication-interval", "Adjust and lubricate with O-ring chain lubricant every 1,000 km and after washing, rain or wet riding", { distance: 1000, conditions: ["after-washing", "rain", "wet-riding"] }, "km", value.chainSchedulePage, "General maintenance and lubrication chart"),
    row(target, "brakes.brake-fluid", "DOT 4", "DOT 4", null, value.brakePage, "Checking the brake fluid level"),
    row(target, "brakes.fluid-interval", "Change brake fluid every 2 years", 24, "months", value.schedulePage2, "General maintenance and lubrication chart"),
    row(target, "tires_wheels.front-size", value.frontTire, value.frontTire, null, value.specPage, "Specifications — front tire"),
    row(target, "tires_wheels.rear-size", value.rearTire, value.rearTire, null, value.specPage2, "Specifications — rear tire"),
    row(target, "tires_wheels.solo-pressures", value.soloPressure.raw, value.soloPressure.value, "kPa", value.tirePage, "Tires — cold tire air pressure"),
    row(target, "tires_wheels.loaded-pressures", value.loadedPressure.raw, value.loadedPressure.value, "kPa", value.tirePage, "Tires — cold tire air pressure"),
    row(target, "electrical.battery-specification", "YTZ10S, 12 V", "YTZ10S / 12 V", null, value.specPage2, "Specifications — electrical system"),
    row(target, "electrical.battery-capacity", "8.6 Ah (10 HR)", 8.6, "Ah", value.specPage2, "Specifications — electrical system"),
    row(target, "electrical.main-fuse", value.mainFuse.raw, value.mainFuse.value, "A", value.fusePage, "Replacing the fuses"),
    row(target, "maintenance.periodic-schedule", "Yamaha periodic maintenance and general lubrication charts", "documented", null, value.schedulePage, "Periodic maintenance charts"),
    row(target, "maintenance.schedule-mileage-intervals", "1,000 km initial column; 10,000 km recurring schedule, repeated after 50,000 km", { initial: 1000, recurring: 10000, repeatAfter: 50000 }, "km", value.schedulePage, "Periodic maintenance charts"),
    row(target, "maintenance.schedule-time-intervals", "Annual checks; brake fluid every 2 years; brake hoses every 4 years", { annualCheck: 12, brakeFluid: 24, brakeHoses: 48 }, "months", value.schedulePage, "Periodic maintenance charts"),
    row(target, "torques.oil-drain-bolt", "43 N·m", 43, "N·m", value.oilTorquePage, "Engine oil"),
    row(target, "torques.oil-filter", "17 N·m", 17, "N·m", value.oilTorquePage, "Engine oil and oil filter"),
    row(target, "torques.spark-plugs", "13 N·m", 13, "N·m", value.sparkPage, "Checking the spark plugs"),
    row(target, "torques.rear-axle", "105 N·m", 105, "N·m", value.axlePage, "Drive chain slack adjustment")
  ];
}

const evidence = Object.freeze([
  ...commonRows("yamaha.mt-09.gen3", {
    oilSpecification: "Recommended engine oil: SAE 10W-40, API SG or higher, JASO MA", oilSpecificationNormalized: "API SG+ / JASO MA motorcycle engine oil", specPage: "9-1",
    oilDrain: { raw: "2.80 L oil change", value: 2.8 }, oilFilter: { raw: "3.20 L with oil filter removal", value: 3.2 }, oilPage: "7-10", oilTorquePage: "7-12",
    coolant: { raw: "0.28 L reservoir; 1.72 L radiator including all routes", value: { reservoir: 0.28, radiatorIncludingRoutes: 1.72 } }, coolantPage: "7-13",
    sparkPlug: "NGK/LMAR9A-9", sparkPage: "7-9", schedulePage: "7-3", schedulePage2: "7-5", chainSchedulePage: "7-6",
    chainSlack: { raw: "Distance A 36.0–41.0 mm, no weight on motorcycle", value: { min: 36, max: 41, condition: "unloaded-on-sidestand" } }, chainPage: "7-22",
    brakePage: "7-20", frontTire: "120/70ZR17M/C (58W)", rearTire: "180/55ZR17M/C (73W)", specPage2: "9-2",
    soloPressure: { raw: "Cold, 1 person: 250 kPa front / 290 kPa rear", value: { front: 250, rear: 290, condition: "cold", load: "solo" } },
    loadedPressure: { raw: "Cold, 2 persons: 250 kPa front / 290 kPa rear", value: { front: 250, rear: 290, condition: "cold", load: "two-person" } }, tirePage: "7-15",
    mainFuse: { raw: "Main fuse 50.0 A", value: 50 }, fusePage: "7-31", axlePage: "7-23"
  }),
  ...commonRows("yamaha.tenere-700.gen1", {
    oilSpecification: "Recommended engine oil: SAE 10W-40, API SG or higher, JASO MA", oilSpecificationNormalized: "API SG+ / JASO MA motorcycle engine oil", specPage: "8-1",
    oilDrain: { raw: "2.30 L without oil filter cartridge replacement", value: 2.3 }, oilFilter: { raw: "2.60 L with oil filter cartridge replacement", value: 2.6 }, oilPage: "6-13", oilTorquePage: "6-12",
    coolant: { raw: "0.25 L reservoir; 1.60 L radiator including all routes", value: { reservoir: 0.25, radiatorIncludingRoutes: 1.6 } }, coolantPage: "6-14",
    sparkPlug: "NGK/LMAR8A-9", sparkPage: "6-10", schedulePage: "6-3", schedulePage2: "6-5", chainSchedulePage: "6-6",
    chainSlack: { raw: "Distance A 43.0–48.0 mm, no weight on motorcycle", value: { min: 43, max: 48, condition: "unloaded-on-sidestand" } }, chainPage: "6-24",
    brakePage: "6-22", frontTire: "90/90-21 M/C 54V M+S", rearTire: "150/70 R18 M/C 70V M+S", specPage2: "8-2",
    soloPressure: { raw: "Cold, 1 person, road: 220 kPa front / 250 kPa rear", value: { front: 220, rear: 250, condition: "cold-road", load: "solo" } },
    loadedPressure: { raw: "Cold, 2 persons, road: 220 kPa front / 250 kPa rear; off-road is separately 200/200 kPa", value: { front: 220, rear: 250, condition: "cold-road", load: "two-person", excludedCondition: "off-road-200-kPa-front-rear" } }, tirePage: "6-18",
    mainFuse: { raw: "Main fuse 30.0 A", value: 30 }, fusePage: "6-32", axlePage: "6-25"
  })
]);

const researchedNoEvidence = Object.freeze(targetKeys.flatMap(catalogVariantKey => [
  "lubrication.oil-filter", "cooling.replacement-interval", "ignition.spark-plug-alternative", "ignition.replacement-interval",
  "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "final_drive.chain-size",
  "brakes.oem-pad-numbers", "torques.front-axle"
].map(canonicalFieldId => Object.freeze({ catalogVariantKey, canonicalFieldId, result: "authenticated owner manual inspected; no directly verified value for this Service Core field", sourceIds: [targetConfig[catalogVariantKey].sourceId] }))));

function runBatch() {
  const beforeTargets = pipeline.generateTargets(catalog, { catalogVariantKeys: targetKeys }, []);
  const afterTargets = pipeline.generateTargets(catalog, { catalogVariantKeys: targetKeys }, evidence);
  const documents = pipeline.buildDocumentRegistry(sources);
  const conflicts = pipeline.detectConflicts(evidence);
  const targetResults = targetKeys.map(catalogVariantKey => {
    const before = beforeTargets.find(target => target.catalogVariantKey === catalogVariantKey).evidenceCount;
    const after = afterTargets.find(target => target.catalogVariantKey === catalogVariantKey).evidenceCount;
    const rows = evidence.filter(item => item.catalogVariantKey === catalogVariantKey);
    const fields = new Set(rows.map(item => item.canonicalFieldId));
    return Object.freeze({
      catalogVariantKey, before, after, gain: after - before,
      practicalGain: [...fields].filter(field => pilotDesign.practicalServiceFields.includes(field)).length,
      genericGain: [...fields].filter(field => pilotDesign.genericSpecificationFields.includes(field)).length,
      documentsInspected: 1, documentsYieldingEvidence: 1, highestTier: "A", conflicts: 0,
      applicabilityBlockers: Object.freeze(["later catalogue-generation years are not covered by the selected manual edition"]),
      importantRemainingPracticalGaps: Object.freeze(researchedNoEvidence.filter(item => item.catalogVariantKey === catalogVariantKey).map(item => item.canonicalFieldId))
    });
  });
  const yielding = sources.filter(source => source.yieldedEvidence).length;
  const metrics = Object.freeze({
    targets: targetKeys.length, documentsInspected: sources.length, uniqueDocuments: documents.length,
    hostingLocations: documents.reduce((sum, document) => sum + document.locations.length, 0), duplicateHostingLocations: documents.reduce((sum, document) => sum + Math.max(0, document.locations.length - 1), 0),
    documentsYieldingEvidence: yielding, sourceTierDistribution: Object.freeze({ A: 2, B: 0, C: 0, D: 0 }), evidenceRowsProduced: evidence.length,
    verifiedSlotsBefore: targetResults.reduce((sum, target) => sum + target.before, 0), verifiedSlotsAfter: targetResults.reduce((sum, target) => sum + target.after, 0),
    netNewVerifiedSlots: targetResults.reduce((sum, target) => sum + target.gain, 0), practicalServiceFieldGain: targetResults.reduce((sum, target) => sum + target.practicalGain, 0), genericSpecificationGain: targetResults.reduce((sum, target) => sum + target.genericGain, 0),
    evidenceRowsPerYieldingDocument: Number((evidence.length / yielding).toFixed(2)), conflictsDiscovered: conflicts.length, unresolvedApplicabilityCases: 2,
    researchedNoEvidenceTargets: 0, primaryDocumentsUsed: 2, primaryDocumentBudget: 4, sourceBudgetExceeded: false
  });
  return Object.freeze({ schemaVersion: "revlog-yamaha-transfer-acquisition/v1", researchDate, classification: "ACCEPT-WITH-RISKS", targetKeys, sources, documents, evidence, researchedNoEvidence, conflicts, targetResults, metrics });
}

module.exports = Object.freeze({ researchDate, targetKeys, sources, evidence, researchedNoEvidence, runBatch });
