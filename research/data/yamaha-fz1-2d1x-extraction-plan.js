// NON-PRODUCTION planning record only. No PDF text, technical value or candidate is stored.
"use strict";

const factory = require("../factory/index.js");
const acquisition = require("./yamaha-fz1-2d1x-owner-manual-acquisition.js");

const EXPECTED_SHA256 = "bbaa777d8d0184f231573fdf6116d73b7770930d4bdf19b1f0d7386d6b7e2a93";
const artifact = acquisition.buildArtifact();
const adapter = factory.validateExtractorAdapterDeclaration({
  schemaVersion: factory.EXTRACTION_SCHEMA_VERSION,
  adapterId: "yamaha.fz1.2d1x.owner-manual-structural-extractor",
  adapterVersion: "1",
  supportedMediaTypes: ["text/plain"],
  supportedOperations: [factory.EXTRACTION_OPERATION],
  deterministic: true,
  localOnly: true
});

const region = (id, pdfPages, sections, purpose) => Object.freeze({ id, pdfPages, sections, purpose });
const allowedRegions = Object.freeze([
  region("toc-and-applicability", [4], ["もくじ"], "Confirm section/page routing and retain only explicit model or variant applicability notes."),
  region("daily-inspection", [36], ["日常点検"], "Future owner-service checks for tires, brakes, chain and visible controls."),
  region("maintenance-oil-cooling", [39, 41, 43], ["点検整備", "エンジンオイル", "冷却水"], "Future lubrication and cooling fields only when section/table applicability is sufficient."),
  region("maintenance-tires-clutch-brakes", [46, 47, 48, 49, 50], ["タイヤ", "クラッチ", "ブレーキ"], "Future tires, brake fluid/guidance and clutch-adjustment fields, preserving conditions."),
  region("maintenance-chain-electrical", [51, 52, 53, 54, 56], ["ドライブチェーン", "バッテリー", "ヒューズ交換", "灯火装置および方向指示灯"], "Future chain, battery, fuse and lighting fields, without workshop-level inference."),
  region("specification-index", [61, 62, 63], ["製品仕様"], "Future owner-facing specification fields only if the table identifies the exact target and applicability." )
]);

const targetAreas = Object.freeze([
  ["lubrication.oil-specification", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["lubrication.capacity-drain", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["lubrication.capacity-filter", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["lubrication.oil-filter", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["cooling.coolant-specification", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["cooling.capacity", "STRUCTURALLY-LOCATED", "maintenance-oil-cooling"],
  ["tires_wheels.front-size", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["tires_wheels.rear-size", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["tires_wheels.solo-pressures", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["tires_wheels.loaded-pressures", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["final_drive.chain-slack", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["final_drive.chain-inspection", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["final_drive.chain-lubrication-interval", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["brakes.brake-fluid", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["brakes.front-rear-configuration", "STRUCTURALLY-LOCATED", "maintenance-tires-clutch-brakes"],
  ["electrical.battery-specification", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["electrical.battery-capacity", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["electrical.main-fuse", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["electrical.fuse-ratings", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["lighting.replaceability", "STRUCTURALLY-LOCATED", "maintenance-chain-electrical"],
  ["maintenance.periodic-schedule", "LOCATE-THEN-VERIFY", "maintenance-oil-cooling"],
  ["transmission_clutch.clutch-type", "LOCATE-THEN-VERIFY", "maintenance-tires-clutch-brakes"]
].map(([fieldId, status, regionId]) => Object.freeze({ fieldId, status, regionId })));

const excludedRegions = Object.freeze([
  { subject: "internal engine assembly torques", reason: "owner manual does not establish workshop service scope" },
  { subject: "valve clearances and valve-train procedures", reason: "not structurally located in the inspected outline" },
  { subject: "internal brake/suspension service limits", reason: "must not be inferred from owner-service guidance" },
  { subject: "ECU/EFI diagnostic specifications", reason: "workshop-only scope" },
  { subject: "spark-plug service values", reason: "not structurally located in the inspected outline" },
  { subject: "2D1-28197-E0 service-manual content", reason: "explicitly outside this plan and not acquired" }
]);

const applicabilityGate = Object.freeze({
  required: {
    publicationCode: "2D1X",
    model: ["FZ1-N", "FZ1-NA"],
    generation: ["II"],
    modelYear: 2010,
    bodyStyle: ["naked"]
  },
  mustRemainUnknownUnlessExplicitlyProven: ["market", "abs", "transmission", "equipment", "emissions"],
  rules: Object.freeze([
    "A section/table applicability statement is required before a raw candidate is created.",
    "FZ1-S and every year other than 2010 are rejected, not merged or inherited.",
    "JP-index provenance is not converted into universal, EU, UK or US applicability.",
    "ABS/non-ABS, equipment, load, regional-unit and other conditional rows remain separate; unresolved rows are blocked.",
    "A value without sufficient model/year/market/variant context is not a candidate."
  ])
});

const provenanceContract = Object.freeze({
  existingCandidateFields: ["sourceLocation.page", "sourceLocation.section", "sourceLocation.locator", "applicability", "context"],
  requiredFutureDetails: ["publicationCode", "artifactId", "artifactSha256", "pdfPage", "printedPageOrUnknown", "section", "tableOrSubsection", "sourceLocator", "nearbyApplicabilityStatement", "unitsContext", "adapterId", "adapterVersion"],
  rawTextFragment: "allowed only during a later authorized extraction execution; absent from this plan"
});

const extractionIdentity = Object.freeze({
  operation: factory.EXTRACTION_OPERATION,
  artifactId: artifact.id,
  artifactSha256: EXPECTED_SHA256,
  targetId: acquisition.batchSetup.targetWork.targetId,
  batchId: acquisition.batchSetup.batch.id,
  targetWorkId: acquisition.batchSetup.targetWork.id,
  sourceWorkItemId: acquisition.batchSetup.sourceWorkItem.id,
  prospectId: acquisition.prospect.id,
  adapterId: adapter.adapterId,
  adapterVersion: adapter.adapterVersion,
  resultIdRecipe: "factory.extractionResultId(all listed identity fields + operation)",
  candidateIdRecipe: "factory.candidateId(extractionResultId, artifactId, targetId, fieldId, sourceLocation, ordinal, adapterId, adapterVersion)"
});

function assertArtifactMatches(candidate) {
  if (!candidate || candidate.id !== artifact.id || candidate.mediaType !== artifact.mediaType || candidate.contentDigest !== EXPECTED_SHA256 || candidate.byteLength !== artifact.byteLength) throw new Error("2D1X extraction plan rejected: acquired artifact identity mismatch");
  return true;
}

function validatePlan(plan) {
  if (!plan || plan.schemaVersion !== "revlog-yamaha-fz1-2d1x-extraction-plan/v1") throw new TypeError("2D1X extraction plan schema is invalid");
  if (plan.publicationCode !== "2D1X" || plan.sourceProspectId !== acquisition.prospect.id || plan.artifactSha256 !== EXPECTED_SHA256) throw new TypeError("2D1X extraction plan source binding is invalid");
  if (plan.execution !== false || plan.technicalValuesRecorded !== false || plan.rawCandidatesCreated !== 0) throw new TypeError("2D1X extraction plan cannot contain executed extraction");
  if (!Array.isArray(plan.allowedRegions) || plan.allowedRegions.length !== 6 || plan.budget.maxRegions !== 6 || plan.budget.maxRawCandidates !== 24) throw new TypeError("2D1X extraction plan budget is invalid");
  return Object.freeze(plan);
}

function buildPlan() {
  return validatePlan(Object.freeze({
    schemaVersion: "revlog-yamaha-fz1-2d1x-extraction-plan/v1",
    date: "2026-09-08",
    publicationCode: "2D1X",
    publicationIdentity: "FZ1-N / FZ1-NA Owner's Manual",
    sourceProspectId: acquisition.prospect.id,
    targetResearchIdentity: "yamaha.fz1.gen2",
    runtimeIdentitiesExcluded: ["yamaha.fz1.gen2.s"],
    acquisitionArtifactId: artifact.id,
    artifactSha256: EXPECTED_SHA256,
    documentStructure: { pdfPages: 68, inspected: ["PDF metadata", "page count", "bookmarks/table of contents"], textInspected: false, valuesRecorded: false },
    allowedRegions,
    targetAreas,
    excludedRegions,
    plannedRiderServiceCoreAreas: targetAreas.filter(item => item.status === "STRUCTURALLY-LOCATED").map(item => item.fieldId),
    applicabilityGate,
    provenanceContract,
    conditionalValueHandling: "Preserve one raw candidate per materially distinct conditional row; retain condition in applicability/context; block when condition cannot be mapped.",
    extractionAdapter: adapter,
    extractionIdentity,
    duplicateHandling: "Use existing Factory semantic IDs; exact repeats are idempotent, while same semantic identity with different raw/provenance content fails closed.",
    budget: { publications: 1, maxRegions: 6, maxRawCandidates: 24, adapters: 1, attempts: 1, fallbackPublications: 0 },
    stopConditions: ["artifact hash/media type/length mismatch", "publication or model mismatch", "FZ1-S or non-2010 scope", "unresolved market/ABS/equipment/transmission/emissions condition", "missing page/section/table provenance", "workshop-only field", "budget exhausted"],
    execution: false,
    technicalValuesRecorded: false,
    technicalValuesExtracted: false,
    rawCandidatesCreated: 0,
    reviewQueueEntriesCreated: 0,
    evidenceRowsAdded: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    serviceManualLeadTouched: false,
    exactNext: "Execute one bounded FZ1 2D1X extraction wave using only the approved regions and the exact acquired artifact hash; create raw candidates only."
  }));
}

module.exports = Object.freeze({ EXPECTED_SHA256, artifact, adapter, allowedRegions, targetAreas, excludedRegions, applicabilityGate, provenanceContract, extractionIdentity, assertArtifactMatches, validatePlan, buildPlan });
