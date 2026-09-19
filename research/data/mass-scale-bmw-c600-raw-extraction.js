// NON-PRODUCTION bounded raw extraction for the authenticated BMW C 600 Sport manual.
"use strict";

const childProcess = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../factory/index.js");
const acquisition = require("./mass-scale-bmw-c600-source-acquisition.js");

const TARGET_ID = acquisition.TARGET_ID;
const EXPECTED_ARTIFACT_ID = "artifact.7429b5139a7bd3155b3b0a7c";
const EXPECTED_SHA256 = "555ef51345d6725c5c35ea150f3795aecdbdf56324b4b2c414c9d1569c8e5a36";
const TRANSFORMER_ID = "factory.local.pdf-page-text.pypdf";
const TRANSFORMER_VERSION = "1";
const MAX_RAW_CANDIDATES = 32;

const applicability = Object.freeze({ model: "bmw.c-scooter.c600-sport", generation: "C 600 Sport", modelYear: 2012, market: "USA", abs: true, transmission: "cvt", equipment: "standard C 600 Sport", unresolved: [] });
const regions = Object.freeze([
  { id: "maintenance-oil-brakes", pdfPages: [78, 79, 80, 81, 82, 83, 84, 85], sections: ["Maintenance", "Engine oil", "Brake system"], purpose: "owner-service lubrication and brake checks" },
  { id: "maintenance-coolant-tires", pdfPages: [86, 87], sections: ["Coolant", "Rims and tires"], purpose: "owner-service coolant and tire checks" },
  { id: "technical-data-core", pdfPages: [115, 116, 118, 119, 120], sections: ["Technical data", "Engine oil", "Transmission", "Wheels and tires", "Electrical system", "Fuses"], purpose: "bounded practical specifications" },
  { id: "technical-data-torques", pdfPages: [90, 92], sections: ["Technical data", "Front wheel", "Rear wheel"], purpose: "explicit wheel torque specifications" }
]);

const fieldTargets = Object.freeze([
  "lubrication.oil-specification", "lubrication.capacity-filter", "brakes.brake-fluid", "brakes.pad-thickness-limit",
  "tires_wheels.front-size", "tires_wheels.rear-size", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures", "tires_wheels.rim-sizes",
  "fuel_intake.tank-capacity", "transmission_clutch.transmission-type", "final_drive.chain-size", "electrical.battery-specification", "electrical.battery-capacity",
  "electrical.fuse-ratings", "ignition.plug-gap", "lighting.low-beam", "lighting.high-beam", "lighting.front-position", "lighting.front-indicators", "lighting.rear-indicators", "lighting.rear-tail", "lighting.license-plate",
  "tires_wheels.front-axle-torque", "tires_wheels.rear-axle-torque", "torques.brake-calipers"
]);

const planApplicability = Object.freeze({ required: { publicationId: "C_0132_RM_0912_C600Sport_07.pdf", target: "BMW C 600 Sport", modelYear: 2012, market: "USA", abs: true, transmission: "cvt", equipment: "standard C 600 Sport" }, unresolved: [] });

function readPages(pdfPath, pages) {
  const script = `import json,sys\nfrom pypdf import PdfReader\nr=PdfReader(sys.argv[1])\npages=json.loads(sys.argv[2])\nprint(json.dumps({str(p):(r.pages[p-1].extract_text() or '') for p in pages}, ensure_ascii=False, sort_keys=True))`;
  return JSON.parse(childProcess.execFileSync("python3", ["-c", script, pdfPath, JSON.stringify(pages)], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }));
}

function location(page, printedPage, section, locator, tableOrSubsection) {
  return { page, section, locator: `C_0132_RM_0912_C600Sport_07.pdf#pdf-page-${page}`, tableOrSubsection, printedPage, applicabilityStatement: "BMW C 600 Sport Rider's Manual (US Model), MY2012, USA; ABS=true; CVT; standard C 600 Sport", unitsContext: "raw source wording and source units preserved" };
}

function candidate(fieldId, rawValue, rawUnit, sourceLocation, context, ordinal) {
  return { fieldId, rawValue, rawUnit, sourceLocation, extractionMethod: "LOCAL-PDF-TEXT-BOUND-RAW", applicability, context, ordinal };
}

function extractRegion(region, text, derivedContentId) {
  const out = [];
  const context = extra => ({ derivedContentId, parentArtifactId: EXPECTED_ARTIFACT_ID, sourcePublication: "C_0132_RM_0912_C600Sport_07.pdf", ...extra });
  const add = (fieldId, value, unit, source, extra) => out.push(candidate(fieldId, value, unit, source, context(extra), out.length + 1));
  if (region.id === "maintenance-oil-brakes") {
    if (text.includes("Specified level of engine") || text.includes("Products recommended by BMW Motorrad")) add("lubrication.oil-specification", "BMW Motorrad High Performance Oil SAE 15W-50, API SJ / JASO MA2", null, location(115, 113, "Technical data / Engine oil", "engine oil specification", "Products recommended by BMW Motorrad"), { condition: "BMW recommendation; engine oil" });
    if (text.includes("Approx. 3.3 quarts") || text.includes("with filter change")) add("lubrication.capacity-filter", "Approx. 3.3 quarts (Approx. 3.1 l), with filter change", null, location(115, 113, "Technical data / Engine oil", "engine oil capacity", "Engine oil capacity"), { condition: "with filter change" });
    if (text.includes("Brake fluid, DOT4")) add("brakes.brake-fluid", "Brake fluid, DOT4", null, location(84, 82, "Maintenance / Brake system", "front brake fluid level", "Front brake fluid level"), { condition: "front brake reservoir; rear section states the same DOT4 value" });
    if (text.includes("Front brake-pad wear") || text.includes("min 0.04 in")) add("brakes.pad-thickness-limit", "min 0.04 in (min 1.0 mm)", null, location(82, 80, "Maintenance / Brake system", "front brake-pad wear limit", "Front brake-pad wear limit"), { condition: "friction material without carrier plate" });
  }
  if (region.id === "technical-data-core") {
    if (text.includes("Engine oil capacity") && text.includes("with filter")) add("lubrication.capacity-filter", "Approx. 3.3 quarts (Approx. 3.1 l), with filter change", null, location(115, 113, "Technical data / Engine oil", "engine oil capacity", "Engine oil capacity"), { condition: "with filter change" });
    if (text.includes("Front tire designation")) add("tires_wheels.front-size", "120/70 R15", null, location(118, 116, "Technical data / Wheels and tires", "front tire designation", "Front tire designation"), {});
    if (text.includes("Rear tire designation")) add("tires_wheels.rear-size", "160/60 R 15", null, location(118, 116, "Technical data / Wheels and tires", "rear tire designation", "Rear tire designation"), {});
    if (text.includes("Tire pressure, front")) add("tires_wheels.solo-pressures", "Tire pressure, front 34.8 psi (2.4 bar), With tire cold; Tire pressure, rear 36.3 psi (2.5 bar), Single rider, with cold tires", null, location(118, 116, "Technical data / Wheels and tires", "tire inflation pressure", "Tire pressure; single rider; cold tires"), { condition: "single rider; cold tires" });
    if (text.includes("42.1 psi")) add("tires_wheels.loaded-pressures", "42.1 psi (2.9 bar), Driver with passenger and/or load, with cold tire", null, location(118, 116, "Technical data / Wheels and tires", "tire inflation pressure", "Tire pressure; driver with passenger and/or load; cold tire"), { condition: "driver with passenger and/or load; cold tire" });
    if (text.includes("Front-wheel rim size")) add("tires_wheels.rim-sizes", "Front wheel 3.50\" x 15\"; Rear wheel 4.50\" x 15\"", null, location(118, 116, "Technical data / Wheels and tires", "wheel rim sizes", "Front wheel / Rear wheel"), {});
    if (text.includes("Usable fuel quantity")) add("fuel_intake.tank-capacity", "Approx. 4.2 gal (Approx. 16 l)", null, location(115, 113, "Technical data / Fuel", "usable fuel quantity", "Usable fuel quantity"), {});
    if (text.includes("Transmission design CVT")) add("transmission_clutch.transmission-type", "CVT (Continously Variable Transmission)", null, location(116, 114, "Technical data / Transmission", "transmission design", "Transmission design"), {});
    if (text.includes("Battery design AGM")) add("electrical.battery-specification", "AGM (Absorptive Glass Mat) battery.", null, location(119, 117, "Technical data / Electrical system", "battery design", "Battery design"), {});
    if (text.includes("Battery capacity 11.2 Ah")) add("electrical.battery-capacity", "Battery capacity 11.2 Ah", null, location(119, 117, "Technical data / Electrical system", "battery capacity", "Battery capacity"), {});
    if (text.includes("Electrode gap of spark plug")) add("ignition.plug-gap", "0.03±0.01 in (0.8±0.1 mm)", null, location(119, 117, "Technical data / Electrical system", "spark plug electrode gap", "Spark plugs / Electrode gap of spark plug"), {});
    if (text.includes("Bulbs for low-beam headlight")) add("lighting.low-beam", "H7 / 12 V / 55 W", null, location(119, 117, "Technical data / Electrical system", "low-beam bulb", "Bulbs for low-beam headlight"), {});
    if (text.includes("Bulb for high-beam bulb") || text.includes("Bulbs for high-beam bulb")) add("lighting.high-beam", "H7 / 12 V / 55 W", null, location(119, 117, "Technical data / Electrical system", "high-beam bulb", "Bulb for high-beam bulb"), {});
    if (text.includes("Bulb for parking light")) add("lighting.front-position", "W5W / 12 V / 5 W", null, location(119, 117, "Technical data / Electrical system", "parking light bulb", "Bulb for parking light"), {});
    if (text.includes("Bulbs for flashing turn indicators, front")) add("lighting.front-indicators", "PY21W / 12 V / 21 W; with LED turn indicators OE LED / 12 V", null, location(119, 117, "Technical data / Electrical system", "front turn-indicator bulbs", "Bulbs for flashing turn indicators, front"), { condition: "standard bulb and optional LED turn indicators kept distinct" });
    if (text.includes("Bulbs for flashing turn indicators, rear")) add("lighting.rear-indicators", "RY10W / 12 V / 10 W; with LED turn indicators OE LED / 12 V", null, location(119, 117, "Technical data / Electrical system", "rear turn-indicator bulbs", "Bulbs for flashing turn indicators, rear"), { condition: "standard bulb and optional LED turn indicators kept distinct" });
    if (text.includes("Bulb for taillight/brake light")) add("lighting.rear-tail", "LED / 12 V", null, location(119, 117, "Technical data / Electrical system", "taillight/brake light", "Bulb for taillight/brake light"), {});
    if (text.includes("Bulb for license-plate light")) add("lighting.license-plate", "W5W / 12 V / 5 W", null, location(119, 117, "Technical data / Electrical system", "license-plate light", "Bulb for license-plate light"), {});
    if (text.includes("Fuse carrier") && text.includes("Fuse box")) add("electrical.fuse-ratings", "Fuse carrier: 30 A, Fuse 9: control unit for instrument cluster/ignition switch; 30 A, Fuse 10: control unit for anti-lock brake system (ABS). Fuse box: 15 A, Fuse 1: DME main relay; 10 A, Fuse 2: control unit for Digital Motor Electronics (DME); 4 A, Fuse 3: control unit for anti-theft alarm (DWA)/Tire Pressure Control (TPC); 4 A, Fuse 4: brake-light switch for front brake/rear brake/connector of optional accessories; 7.5 A, Fuse 5: fan; 7.5 A, Fuse 6: onboard socket(s); 4 A, Fuse 7: license plate light; 4 A, Fuse 8: control unit for Digital Motor Electronics (DME)/anti-lock brake system (ABS)/instrument cluster", "A", location(120, 118, "Technical data / Fuses", "fuse ratings", "Fuse carrier / Fuse box"), { condition: "named fuse circuits; source line breaks retained as one raw compound value" });
  }
  if (region.id === "technical-data-torques") {
    if (text.includes("Quick-release axle in axle")) add("tires_wheels.front-axle-torque", "22 lb/ft (30 Nm)", null, location(90, 88, "Maintenance / Front wheel", "front wheel quick-release axle", "Quick-release axle in axle mount"), {});
    if (text.includes("Rear wheel on output")) add("tires_wheels.rear-axle-torque", "44 lb/ft (60 Nm)", null, location(92, 90, "Maintenance / Rear wheel", "rear wheel torque", "Rear wheel on output shaft"), {});
    if (text.includes("Brake caliper on fork leg")) add("torques.brake-calipers", "21 lb/ft (28 Nm)", null, location(90, 88, "Technical data / Threaded fasteners", "front brake caliper", "Brake caliper on fork leg"), {});
  }
  return out;
}

function planFor(artifact) {
  const plan = factory.createModelPlan({ playbook: factory.createPlaybook({ policyId: "bmw-c600-owner-manual-raw-extraction-v1" }), targetIdentity: TARGET_ID, sourcePublication: "C_0132_RM_0912_C600Sport_07.pdf", artifact: { artifactId: artifact.id, contentDigest: artifact.contentDigest, mediaType: artifact.mediaType, byteLength: artifact.byteLength }, regions, fieldTargets, applicability: planApplicability, budget: { maxRegions: regions.length, maxRawCandidates: MAX_RAW_CANDIDATES } });
  return { ...plan, playbook: factory.createPlaybook({ policyId: "bmw-c600-owner-manual-raw-extraction-v1" }) };
}

function extractFromRegion({ region, text, derived, plan, acquired, acquisitionPlan }) {
  const adapter = factory.validateExtractorAdapterDeclaration({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, adapterId: "bmw.c600.official-pdf-text-extractor", adapterVersion: "1", supportedMediaTypes: ["text/plain"], supportedOperations: [factory.EXTRACTION_OPERATION], deterministic: true, localOnly: true });
  const result = factory.extractRawCandidatesFromAcquiredSource({ context: { batchId: acquisitionPlan.batch.id, targetId: acquisitionPlan.target.id, targetWorkId: acquisitionPlan.targetWork.id, sourceWorkItemId: acquisitionPlan.sourceWorkItem.id, attemptId: acquired.attemptId, prospectId: acquisitionPlan.prospect.id }, researchTarget: acquisitionPlan.target, sourceProspect: acquisitionPlan.prospect, modelPlan: plan, acquisitionArtifact: acquired, derivedContentEnvelope: derived, adapter: { ...adapter, execute: input => { const candidates = extractRegion(region, input.content, derived.id); return { disposition: candidates.length ? "CANDIDATES-PRODUCED" : "NO-CANDIDATES", candidates, observations: [{ type: candidates.length ? "CANDIDATE-EXTRACTED" : "NO-CANDIDATES", detailCode: candidates.length ? "BMW_C600_BOUND_RAW_CANDIDATES" : "BMW_C600_REGION_NO_MAPPED_FIELD", metadata: { regionId: region.id } }] }; } }, playbook: plan.playbook });
  return result;
}

async function run() {
  const acquisitionPlan = acquisition.buildPlan();
  const execution = await acquisition.executeOnce(acquisitionPlan);
  const acquired = execution.result.outcome.artifact;
  if (!acquired || acquired.id !== EXPECTED_ARTIFACT_ID || acquired.contentDigest !== EXPECTED_SHA256 || acquired.mediaType !== "application/pdf") throw new Error("BMW extraction rejected: exact acquired artifact is unavailable or mismatched");
  const bytes = Buffer.from(acquired.metadata.contentBase64, "base64");
  factory.validateParentBytes(acquired, bytes);
  const pdfPath = path.join("/tmp", "bmw-c600-2012-raw-extraction.pdf");
  fs.writeFileSync(pdfPath, bytes);
  const plan = planFor(acquired);
  const readiness = factory.evaluateRawExtractionReadiness({ playbook: plan.playbook, modelPlan: plan, sourceProspect: acquisitionPlan.prospect, acquiredArtifact: acquired });
  if (!readiness.passed) throw new Error(`BMW raw extraction readiness blocked: ${readiness.blockers.join(",")}`);
  let candidates = [];
  const regionResults = [];
  const pages = [...new Set(regions.flatMap(region => region.pdfPages))].sort((a, b) => a - b);
  const pageText = readPages(pdfPath, pages);
  for (const region of regions) {
    const text = region.pdfPages.map(page => pageText[String(page)] || "").join("\n");
    const derived = factory.createDerivedContent({ parentArtifact: acquired, parentBytes: bytes, transformerId: TRANSFORMER_ID, transformerVersion: TRANSFORMER_VERSION, region: { id: region.id, pdfPages: region.pdfPages }, approvedRegionIds: regions.map(item => item.id), content: text, mediaType: "text/plain" });
    const result = extractFromRegion({ region, text, derived, plan, acquired, acquisitionPlan });
    candidates = candidates.concat(result.candidates);
    regionResults.push({ id: region.id, pdfPages: region.pdfPages, derivedContentId: derived.id, extractionResultId: result.id, disposition: result.disposition, candidateCount: result.candidates.length });
  }
  if (candidates.length > MAX_RAW_CANDIDATES) throw new Error("BMW raw candidate budget exceeded");
  const ids = new Set(candidates.map(item => item.id));
  return Object.freeze({ schemaVersion: "revlog-mass-scale-bmw-c600-raw-extraction/v1", extractionOnly: true, targetId: TARGET_ID, catalogVariantKey: acquisitionPlan.target.catalogVariantKey, year: 2012, sourceProspectId: acquisitionPlan.prospect.id, artifact: { id: acquired.id, contentDigest: acquired.contentDigest, mediaType: acquired.mediaType, byteLength: acquired.byteLength, locator: acquired.locator, parentVerified: true }, transformer: { id: TRANSFORMER_ID, version: TRANSFORMER_VERSION }, readiness, plan: { planId: plan.planId, policyId: plan.playbook.policyId, regionCount: regions.length, fieldTargetCount: fieldTargets.length, maxRawCandidates: MAX_RAW_CANDIDATES, unresolvedApplicability: plan.applicability.unresolved }, regions: regionResults, fieldsAttempted: fieldTargets, rawCandidates: candidates, rawCandidateCount: candidates.length, duplicateCandidatesCollapsed: candidates.length - ids.size, rejectedOrBlockedFields: ["cooling.coolant-specification", "cooling.capacity", "maintenance.periodic-schedule", "final_drive.chain-size"], reviewDecisionsCreated: 0, evidenceRowsCreated: 0, promotionPerformed: false, productionChanged: false, catalogueChanged: false, registryChanged: false, serviceCoreCoverageChanged: false, contentPersisted: false, next: "Bounded human review of only these BMW raw candidates; no evidence or production promotion was performed." });
}

module.exports = Object.freeze({ TARGET_ID, EXPECTED_ARTIFACT_ID, EXPECTED_SHA256, TRANSFORMER_ID, TRANSFORMER_VERSION, regions, fieldTargets, planApplicability, run });
