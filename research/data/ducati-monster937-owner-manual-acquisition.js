// NON-PRODUCTION Ducati owner-manual acquisition. Raw candidates only; no evidence promotion.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const catalog = require("../../scripts/motorcycle-catalog-report.js").loadCatalog();
const registration = require("./ducati-monster937-owner-manual-prospect-registration.js");

const researchDate = "2026-09-03";
const target = Object.freeze({ catalogVariantKey: "ducati.monster.937", model: "Monster 937", year: 2021, market: "EU", equipment: "base Monster 937", excludedEquipment: "Monster SP 937", transmission: "manual", abs: true });
const sourceUrl = "https://downloads.ctfassets.net/oifkva25gsx4/5QuxXJmK68Pe7ueYLU75eP/6f6770f7782edcbbd23ff8fcd68e4d8c/OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf";
const source = Object.freeze({
  id: "ducati.acquisition.monster937.owner.my21",
  documentId: "Ducati|OM-Monster-937-937-Plus-EN-MY21",
  tier: "A",
  sourceClass: "official-owner-manual",
  publisher: "Ducati Motor Holding S.p.A.",
  title: "Monster 937 / 937 Plus Owner's Manual",
  publicationId: "OM_-_Monster_937_-_937_Plus_-_EN_-_MY21.pdf",
  edition: "English, MY2021",
  publicationDate: 2021,
  url: sourceUrl,
  officialHost: "downloads.ctfassets.net",
  disposition: "acquired-content",
  accessResult: "Ducati-controlled PDF content acquired for bounded text inspection",
  authenticationState: "OFFICIAL-DUCATI-MY2021-EU-BASE-MONSTER-CONFIRMED",
  language: "English",
  pageCount: null,
  models: ["Monster 937", "Monster 937 Plus"],
  years: { from: 2021, to: 2021 },
  markets: ["EU"],
  abs: true,
  transmission: "manual",
  equipment: "base Monster common content; Monster SP excluded",
  inspectedPages: ["152", "176–179", "182–187", "193–196", "203–207", "211–212", "216", "218", "220–224"],
  targets: [target.catalogVariantKey],
  yieldedEvidence: false,
  applicabilityProof: Object.freeze({
    exactSource: "filename/title identifies Monster 937 / 937 Plus EN MY21",
    targetYear: "MY2021",
    market: "EU English owner-manual route",
    baseScope: "common Monster 937 content retained; Plus-only and SP content excluded",
    abs: "Cornering ABS is part of the manual/model scope",
    transmission: "manual six-speed Monster 937 scope",
    preExtractionCheckPassed: true
  }),
  stopCondition: "raw extraction stops before evidence conversion; human review and any later promotion remain separate"
});

const applicability = pipeline.validateApplicability({ abs: true, transmission: "manual", equipment: "base-monster-common" });
const raw = (canonicalFieldId, rawValue, printedPage, section) => Object.freeze({ ...pipeline.validateExtractionCandidate({
  documentId: source.documentId,
  page: printedPage,
  candidateField: canonicalFieldId,
  rawValue,
  applicability,
  extractionConfidence: "direct-page-text",
  extractionMethod: "Ducati-controlled PDF text-layer inspection"
}), section });

const rawCandidates = Object.freeze([
  raw("lubrication.oil-specification", "Ducati prescribes SAE 15W-50/JASO MA2 oil and recommends Shell Advance 4T Ultra 15W-50; UK version: Shell Advance DUCATI 15W-50 Fully Synthetic Oil.", "195–196", "Check engine oil level; Recommendations concerning oil"),
  raw("lubrication.viscosity", "SAE 15W-50", "196, 211", "Recommendations concerning oil; Fuel, lubricants and other fluids"),
  raw("lubrication.api-jaso", "API: SN; JASO: MA2", "195–196, 211", "Check engine oil level; Fuel, lubricants and other fluids"),
  raw("lubrication.capacity-drain", "Oil sump and filter: 3.1 litres", "211", "Fuel, lubricants and other fluids"),
  raw("lubrication.capacity-filter", "Oil sump and filter: 3.1 litres", "211", "Fuel, lubricants and other fluids"),
  raw("cooling.coolant-specification", "ENI Agip Permanent Spezial antifreeze; do not dilute, use pure", "176, 212", "Checking coolant level and topping up; Fuel, lubricants and other fluids"),
  raw("cooling.capacity", "Cooling circuit: 2.25 litres", "212", "Fuel, lubricants and other fluids"),
  raw("cooling.replacement-interval", "Change coolant at 48 months", "203–204", "Scheduled maintenance chart: dealer operations"),
  raw("ignition.spark-plug-oem", "NGK MAR9A-J", "216", "Spark plugs"),
  raw("ignition.replacement-interval", "Change spark plugs at Desmo Service", "203–204", "Scheduled maintenance chart: dealer operations"),
  raw("valve_train.inspection-interval", "Desmo Service (Valve Clearance Check Service) every 30,000 km/18,000 mi", "152", "Setting menu – Service"),
  raw("final_drive.chain-slack", "Chain tension A = 51–53 mm (2.00–2.09 in), measured on the side stand at the tightest position", "182", "Checking drive chain tension"),
  raw("final_drive.chain-inspection", "Inspect chain for stiff joints, missing/damaged O-rings and worn components; check wear and tension in scheduled service", "182, 204–205", "Checking drive chain tension; Scheduled maintenance chart"),
  raw("final_drive.chain-lubrication-interval", "Lubricate at least every 1,000 km; more frequently, about every 400 km, in 40°C conditions or after long travels", "185–187", "Lubricating the drive chain"),
  raw("brakes.brake-fluid", "Front/rear brake circuit: DOT 4", "177, 212", "Check clutch and brake fluid level; Fuel, lubricants and other fluids"),
  raw("brakes.fluid-interval", "Change brake and clutch fluid every 24 months", "203–204", "Scheduled maintenance chart: dealer operations"),
  raw("brakes.front-rear-configuration", "Cornering ABS as standard; separate-action anti-lock brake system operated by wheel sensors", "216", "Brakes"),
  raw("tires_wheels.front-size", "Pirelli Diablo Rosso III tubeless radial; 120/70 ZR17 M/C 58W", "219", "Technical data – Tyres"),
  raw("tires_wheels.rear-size", "Pirelli Diablo Rosso III tubeless radial; 180/55 ZR17 M/C 73W", "219", "Technical data – Tyres"),
  raw("tires_wheels.solo-pressures", "Cold pressure, rider only: front 2.3 bar (33.35 psi); rear 2.5 bar (36.26 psi)", "219", "Technical data – Tyres"),
  raw("tires_wheels.loaded-pressures", "Cold pressure, rider and passenger: front 2.5 bar (36.26 psi); rear 2.9 bar (40.06 psi)", "219", "Technical data – Tyres"),
  raw("electrical.battery-specification", "YUASA YT 7B-BS DRY, 12 V", "220", "Electric system"),
  raw("electrical.battery-capacity", "6.5 Ah", "220", "Electric system"),
  raw("maintenance.periodic-schedule", "Scheduled maintenance chart includes dealer operations and customer operations", "203–207", "Scheduled maintenance chart"),
  raw("maintenance.schedule-mileage-intervals", "First Service 1000 after 1,000 km; Oil Service every 15,000 km; Desmo Service every 30,000 km", "152", "Setting menu – Service"),
  raw("maintenance.schedule-time-intervals", "Annual Service every 12 months; brake and clutch fluid change every 24 months; coolant change every 48 months", "152, 203–204", "Setting menu – Service; Scheduled maintenance chart"),
  raw("fuel_intake.tank-capacity", "Fuel tank, including reserve of 3.5 litres: 14 litres", "211", "Fuel, lubricants and other fluids")
].map((candidate, index) => Object.freeze({
  id: `ducati.monster937.raw.${String(index + 1).padStart(3, "0")}`,
  catalogVariantKey: target.catalogVariantKey,
  canonicalFieldId: candidate.candidateField,
  rawValue: candidate.rawValue,
  sourceId: source.id,
  documentId: candidate.documentId,
  printedPage: candidate.page,
  section: candidate.section,
  sourceSection: candidate.section,
  applicability: candidate.applicability,
  extractionConfidence: candidate.extractionConfidence,
  extractionMethod: candidate.extractionMethod,
  normalizationState: "UNNORMALIZED",
  reviewState: "QUEUED",
  proofStatus: "PRE-EVIDENCE-CANDIDATE"
})));

function runAcquisition() {
  const before = pipeline.generateTargets(catalog, { catalogVariantKeys: [target.catalogVariantKey] }, [])[0];
  const after = pipeline.generateTargets(catalog, { catalogVariantKeys: [target.catalogVariantKey] }, [])[0];
  const documents = pipeline.buildDocumentRegistry([source]);
  const reviewQueue = Object.freeze(rawCandidates.map(candidate => Object.freeze({ candidateId: candidate.id, catalogVariantKey: candidate.catalogVariantKey, state: "QUEUED", eligibility: "ELIGIBLE", decision: null })));
  return Object.freeze({
    schemaVersion: "revlog-ducati-owner-manual-acquisition/v1",
    researchDate,
    target,
    reusedProspectId: registration.prospect.id,
    source,
    documents,
    preExtractionIdentityCheck: source.applicabilityProof,
    rawCandidates,
    reviewQueue,
    reviewDecisionCounts: Object.freeze({ accepted: 0, rejected: 0, needsMoreReview: 0, queued: reviewQueue.length }),
    evidence: Object.freeze([]),
    conflicts: Object.freeze([]),
    metrics: Object.freeze({
      rawCandidates: rawCandidates.length,
      acceptedItems: 0,
      rejectedItems: 0,
      needsReviewItems: 0,
      queuedItems: reviewQueue.length,
      evidenceRowsCreated: 0,
      serviceCoreBefore: before.evidenceCount,
      serviceCoreAfter: after.evidenceCount,
      practicalGain: 0,
      genericGain: 0,
      conflicts: 0,
      ambiguousFields: 0,
      tierCDContribution: 0,
      primaryDocumentsUsed: 1,
      primaryDocumentBudget: 1
    }),
    classification: "ACCEPT-WITH-RISKS",
    technicalValuesInspected: true,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    runtimeChanged: false,
    catalogueChanged: false,
    cloudBackendChanged: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The exact Ducati-controlled MY2021 owner manual was acquired and inspected for common base Monster 937 fields. Extraction produced immutable raw candidates with page/section provenance; repository review/evidence boundaries prevent automatic evidence creation or coverage change.", risks: Object.freeze(["the official PDF combines Monster 937 and Monster 937 Plus; only common base-Monster scope was retained", "all candidates remain queued because no human review decision was created", "no direct source hash was persisted"]), falsification: Object.freeze(["SP-specific content was excluded", "no second primary document was used", "no Tier C/D source was used", "no values were inferred across years or models"]) }),
    exactNextTask: "Perform the bounded human review of the queued Ducati Monster 937 MY2021 EU base-Monster raw candidates; preserve raw values and provenance, create no production evidence or profile promotion automatically."
  });
}

module.exports = Object.freeze({ target, source, rawCandidates, runAcquisition });
