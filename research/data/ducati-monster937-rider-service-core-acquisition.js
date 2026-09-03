// NON-PRODUCTION Ducati Rider Service Core acquisition projection.
// Extends the already acquired exact owner manual without changing prior review state.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const previous = require("./ducati-monster937-owner-manual-acquisition.js");

const target = Object.freeze({ ...previous.target, profileId: "ducati.monster937.2021", scope: "common base Monster 937; Monster+ only where common; Monster SP excluded" });
const source = previous.source;
const documentVerification = Object.freeze({
  result: "DOCUMENT-IDENTITY-VERIFIED",
  primaryUrl: source.url,
  verificationUrl: "https://www.ducati.com/ww/en/service-maintenance/owner-manuals",
  verificationKind: "same-publication official Ducati owner-manual library route",
  independentTechnicalSource: null,
  independentTechnicalCrossCheck: "NOT-FOUND-WITHIN-BOUNDED-DUCATI-CONTROLLED-SEARCH",
  note: "The official library route verifies the publication identity and applicability path; it is not an independent technical claim."
});

const applicability = pipeline.validateApplicability({ abs: true, transmission: "manual", equipment: "base-monster-common", market: "EU", modelYear: 2021 });
const makeCandidate = (canonicalFieldId, rawValue, printedPage, section, context = null) => Object.freeze({
  ...pipeline.validateExtractionCandidate({
    documentId: source.documentId,
    page: printedPage,
    candidateField: canonicalFieldId,
    rawValue,
    applicability,
    extractionConfidence: "direct-page-text",
    extractionMethod: "Ducati-controlled PDF text-layer inspection"
  }),
  section,
  context
});

const ADDITIONAL = [
  ["engine.configuration", "Testastretta 11°, V2 90°, 4 valves per cylinder, desmodromic timing system, liquid cooling.", "214", "Engine"],
  ["engine.displacement", "Total displacement: 937 cu. cm (57.18 cu in)", "214", "Engine"],
  ["engine.bore", "Bore: 94 mm (3.70 in)", "214", "Engine"],
  ["engine.stroke", "Stroke: 67.5 mm (2.66 in)", "214", "Engine"],
  ["engine.compression-ratio", "Compression ratio: 13.3±0.5:1", "214", "Engine"],
  ["engine.service-limits", "Max. rotation speed: 10200 rpm.", "214", "Engine"],
  ["dimensions_mass.wet-kerb-mass", "Overall weight (in running order with 90% of fuel - 44/2014/EU Annex XI): 166 kg (365.97 lb).", "208", "Technical data; Weights"],
  ["dimensions_mass.dry-mass", "Dry weight (without fluids and battery): 188 kg (414.47 lb).", "208", "Technical data; Weights"],
  ["dimensions_mass.payload-gvwr", "Maximum allowed weight (carrying full load): 414 kg (912.71 lb).", "208", "Technical data; Weights"],
  ["dimensions_mass.seat-height", "Seat height: 820 mm (32.28 in), lowered seat (Performance) 800 mm (31.50 in).", "209", "Technical data; Dimensions; Monster 937"],
  ["dimensions_mass.wheelbase", "Wheelbase: 1474 mm (58.03 in).", "209", "Technical data; Dimensions; Monster 937"],
  ["steering_chassis.rake", "Steering head angle: 24°", "219", "Technical data; Frame"],
  ["steering_chassis.trail", "Trail in mm: 93 (3.66 in).", "219", "Technical data; Frame"],
  ["fuel_intake.fuel-type-octane", "Fuel supply: 95-98 RON.", "216", "Performance data; Fuel system"],
  ["transmission_clutch.transmission-type", "6-speed gearbox with constant mesh gears, and gear change pedal on left side of motorcycle.", "218", "Technical data; Transmission"],
  ["transmission_clutch.clutch-type", "Wet clutch controlled by the lever on left-hand side of the handlebar.", "218", "Technical data; Transmission"],
  ["final_drive.chain-size", "Drive chain from gearbox to rear wheel. Make: Regina; Type: 520 ZRDK; Links: 106.", "218", "Technical data; Transmission"],
  ["final_drive.front-sprocket", "Gearbox output sprocket: 15 teeth.", "218", "Technical data; Transmission"],
  ["final_drive.rear-sprocket", "Rear chain sprocket: 43 teeth.", "218", "Technical data; Transmission"],
  ["final_drive.final-ratio", "Gearbox output sprocket/rear chain sprocket ratio: 15/43.", "218", "Technical data; Transmission"],
  ["final_drive.oem-chain-sprocket", "Drive chain: Regina 520 ZRDK, 106 links; gearbox output sprocket/rear chain sprocket ratio 15/43.", "218", "Technical data; Transmission"],
  ["tires_wheels.oem-tire-models", "Front and rear: Pirelli Diablo Rosso III, tubeless radial type.", "219", "Technical data; Tyres"],
  ["tires_wheels.rim-sizes", "Front rim MT3.50x17; rear rim MT5.50x17.", "219", "Technical data; Wheels"],
  ["brakes.disc-diameter", "Front: 2 drilled stainless steel discs, 320 mm; rear: fixed drilled steel disk, 245 mm.", "217", "Technical data; Brakes"],
  ["brakes.disc-thickness", "Front disc thickness: 4.5 mm; rear disc thickness: 4.2 mm.", "217", "Technical data; Brakes"],
  ["brakes.disc-service-limit", "Front disc maximum wear: 4.0 mm; rear disc maximum wear: 3.6 mm.", "217", "Technical data; Brakes"],
  ["electrical.alternator-output", "Generator Denso 14V - 490W.", "221", "Technical data; Electric system"],
  ["electrical.fuse-ratings", "Fuse box A: Key 1 ECU/ABS/IMU 5 A; Key 2 Dashboard/BBS 15 A; Key 3 Accessories 10 A; Diagnostics 7.5 A; Fuel pump relay 10 A. Fuse box B: El. loads relay 25 A; Starter relay 7.5 A; Dashboard 20 A; BBS 10 A; ABS 20 A; ABS 25 A. Positions and ratings are marked on the box cover.", "222-224", "Technical data; Fuses", { structure: "function-amperage-location", location: "RH central side under RH side cover; box A LH, box B RH" }],
  ["electrical.main-fuse", "The main fuses C (an active and a spare one) are located on the solenoid starter D.", "225", "Technical data; Fuses", { rating: "not printed in the inspected table; do not infer" }],
  ["lighting.combined-high-low", "Headlight: LED low beam no. 1; LED high beam no. 4.", "221", "Technical data; Electric system", { replaceability: "LED module; no bulb/socket claimed" }],
  ["lighting.drl", "LED parking light/DRL (where fitted): no. 20.", "221", "Technical data; Electric system", { replaceability: "LED module; where fitted" }],
  ["lighting.front-indicators", "LED front turn indicators: no. 6; LED front turn indicators (USA-ROK): no. 3.", "221", "Technical data; Electric system", { replaceability: "LED module; market-specific USA-ROK alternative retained" }],
  ["lighting.rear-indicators", "LED rear turn indicators: no. 7.", "221", "Technical data; Electric system", { replaceability: "LED module; no bulb/socket claimed" }],
  ["lighting.rear-tail", "Tail light: LED parking light no. 4.", "221", "Technical data; Electric system", { replaceability: "LED module; no bulb/socket claimed" }],
  ["lighting.brake-light", "Tail light: LED rear stop light no. 9.", "221", "Technical data; Electric system", { replaceability: "LED module; no bulb/socket claimed" }],
  ["lighting.license-plate", "Tail light: LED number plate light no. 3.", "221", "Technical data; Electric system", { replaceability: "LED module; no bulb/socket claimed" }],
  ["lighting.replaceability", "The documented headlight, indicators, tail light and number plate light sources are LED; the manual does not present owner-replaceable bulb/socket specifications for these entries.", "221", "Technical data; Electric system", { modelScope: "Monster 937 common scope" }],
  ["maintenance.inspect", "Customer operations: check engine oil level; brake fluid level; tyre pressure and wear; drive chain tension and lubrication; brake pads. Dealer operations include checks of air filter, brake/clutch fluid, discs/pads, wheel fasteners, bearings and other listed items.", "204-207", "Scheduled maintenance chart"],
  ["maintenance.replace", "Dealer operations include changing engine oil and filter, air filter, timing belts, spark plugs, coolant, front fork fluid and brake/clutch fluid at the listed schedule points.", "203-205", "Scheduled maintenance chart"],
  ["maintenance.adjust", "Dealer operations include checking and/or adjusting valve clearance; customer operation includes checking drive-chain tension.", "204, 207", "Scheduled maintenance chart"],
  ["maintenance.lubricate", "Customer operation: check the drive chain tension and lubrication; chain lubrication procedure is described separately.", "185-187, 207", "Lubricating the drive chain; Scheduled maintenance chart"],
  ["maintenance.clean", "Dealer operations include checking and cleaning the air filter; chain cleaning guidance is provided in the drive-chain maintenance section.", "185, 204", "Checking drive chain tension; Scheduled maintenance chart"],
  ["maintenance.initial-service", "First Service 1000 after 1,000 km; Oil Service every 15,000 km; Desmo Service every 30,000 km.", "152", "Setting menu - Service"],
  ["maintenance.severe-use", "Extreme damp/muddy or dusty/dry conditions can cause above-average wear of the drive system, brakes or air filter and may require earlier service or replacement.", "30, 203, 207", "Intended use; Scheduled maintenance chart"],
];

const additionalCandidates = Object.freeze(ADDITIONAL.map((item, index) => {
  const [field, value, page, section, context] = item;
  const candidate = makeCandidate(field, value, page, section, context || null);
  return Object.freeze({
    ...candidate,
    id: `ducati.monster937.core.raw.${String(index + 1).padStart(3, "0")}`,
    catalogVariantKey: target.catalogVariantKey,
    canonicalFieldId: candidate.candidateField,
    sourceId: source.id,
    printedPage: candidate.page,
    sourceSection: candidate.section,
    normalizationState: "UNNORMALIZED",
    reviewState: "QUEUED",
    proofStatus: "PRE-EVIDENCE-CANDIDATE"
  });
}));

const reviewQueue = Object.freeze(additionalCandidates.map(candidate => Object.freeze({ candidateId: candidate.id, catalogVariantKey: target.catalogVariantKey, state: "QUEUED", eligibility: "ELIGIBLE", decision: null })));

const CORE_DOMAINS = Object.freeze([
  "basic-motorcycle-data", "engine-oil-filter", "cooling", "spark-plugs-ignition", "valves",
  "wheels-tires", "final-drive", "brakes", "electrical-battery", "fuses", "lighting",
  "periodic-maintenance", "consumables", "practical-torques"
]);

const MISSING_FIELDS = Object.freeze([
  "power", "oil-filter-oem", "drain-plug-torque", "filter-torque", "coolant-complete-circuit-quantity",
  "spark-plug-gap", "spark-plug-torque", "intake-clearance", "exhaust-clearance", "valve-measurement-conditions",
  "front/rear-axle-torque", "chain-adjuster-torque", "brake-caliper-torque", "front/rear-pad-reference",
  "charging-specification", "owner-replaceable-bulb/socket", "OEM-consumable-part-numbers"
]);

function buildReport() {
  const priorFields = previous.rawCandidates.map(candidate => candidate.canonicalFieldId);
  const allFields = [...new Set([...priorFields, ...additionalCandidates.map(candidate => candidate.canonicalFieldId)])].sort();
  const cooling = previous.rawCandidates.find(candidate => candidate.canonicalFieldId === "cooling.capacity");
  const sourceDocuments = pipeline.buildDocumentRegistry([source]);
  const report = {
    schemaVersion: "revlog-ducati-monster937-rider-service-core-acquisition/v1",
    target,
    principalManual: Object.freeze({ documentId: source.documentId, publicationId: source.publicationId, title: source.title, sourceClass: source.sourceClass, tier: source.tier, publisher: source.publisher, edition: source.edition, publicationDate: source.publicationDate, language: source.language, applicability: { model: "Monster 937", modelYear: 2021, market: "EU", equipment: "base Monster common scope", abs: true, transmission: "manual", excluded: "Monster SP 937" }, url: source.url, host: source.officialHost, acquisitionStatus: source.disposition, completeness: "text-layer inspection complete for Core-relevant pages 152, 176-187, 193-207, 208-225" }),
    documentVerification,
    sourceDocuments,
    coreDomains: CORE_DOMAINS,
    fieldsInvestigated: allFields,
    priorRawCandidates: previous.rawCandidates.length,
    additionalRawCandidates: additionalCandidates.length,
    totalRawCandidatesInInventory: previous.rawCandidates.length + additionalCandidates.length,
    queuedAdditionalCandidates: reviewQueue.length,
    authoritativeFieldsFound: allFields.filter(field => field !== "cooling.capacity"),
    independentlyCrossCheckedFields: [],
    primaryManualOnlyFields: allFields.filter(field => field !== "cooling.capacity"),
    conflicts: [],
    applicabilityBlockers: cooling ? [{ field: cooling.canonicalFieldId, reason: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR", rawValue: cooling.rawValue, provenance: { page: cooling.printedPage, section: cooling.section } }] : [],
    missingFields: MISSING_FIELDS,
    maintenanceCoverage: Object.freeze({ exactIntervals: ["First Service 1000: 1,000 km", "Oil Service: 15,000 km", "Desmo Service: 30,000 km", "Annual Service: 12 months", "brake/clutch fluid: 24 months", "coolant: 48 months", "front fork fluid: 45,000 km"], mileageTimeSemantics: "whichever occurs first is explicit for customer operations", inspectReplaceAdjustLubricateCleanSeparated: true, sourcePages: ["152", "203-207"] }),
    fuseCoverage: Object.freeze({ structuredFunctionAmperage: true, fuseBoxes: ["A", "B"], mainFuse: "location documented; rating not printed in inspected text", sourcePages: ["222-225"] }),
    lightingCoverage: Object.freeze({ documentedSources: ["low beam", "high beam", "parking light/DRL", "front indicators", "rear indicators", "rear parking light", "rear stop light", "number plate light"], ledModulesExplicit: true, bulbSocketValues: false, sourcePage: "221" }),
    coolingReaudit: Object.freeze({ specificationSupported: true, replacementIntervalSupported: true, capacitySupported: false, blocker: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" }),
    principalManualUrlAvailable: true,
    productionDucatiEntriesChanged: false,
    productionDucatiEntryCount: 6,
    vfrChanged: false,
    evidenceRowsCreated: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The exact official Ducati MY2021 EU Monster 937 / 937 Plus owner manual was re-inspected for Rider Service Core fields. Existing 27 candidates remain unchanged; additional direct-page candidates are queued in a separate research-only inventory. Cooling capacity remains blocked because the source circuit scope is not proven equivalent to the production engine-and-radiator scope. No technical value was inferred and no production state changed." }),
    exactNextTask: "Run the new queued Ducati Rider Service Core candidates through the existing Human Review Decisions contract; do not promote automatically."
  };
  return Object.freeze(report);
}

module.exports = Object.freeze({ target, source, documentVerification, additionalCandidates, reviewQueue, CORE_DOMAINS, buildReport });
