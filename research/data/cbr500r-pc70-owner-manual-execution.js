// NON-PRODUCTION bounded CBR500R owner-manual execution. Raw candidates only.
"use strict";

const cp = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const factory = require("../factory/index.js");
const honda = require("./honda-service-wave1.js");

const SOURCE_URL = "https://cdn.powersports.honda.com/documentum/MWOM/ml.remawmom.amlr2424omen.pdf";
const SOURCE_ID = "honda.official.owner-manual.31MLRB000.2024";
const TARGET_KEY = "honda.cbr500r.pc70";
const OIL_RULE = Object.freeze({ schemaVersion: 1, fieldId: "lubrication.oil-specification", ruleKind: "TEXT_PATTERN", pattern: "Recommended\\s+engine oil([\\s\\S]{1,480}?)(?=Engine oil\\s+capacity)", flags: "i", captureGroup: 1, maxMatches: 1, ambiguityPolicy: "REJECT" });
const LOADED_RULE = Object.freeze({ schemaVersion: 1, fieldId: "tires_wheels.loaded-pressures", ruleKind: "TEXT_PATTERN", pattern: "Tire air pressure[\\s\\S]{0,240}(?:loaded|passenger|two[- ]?up)", flags: "i", captureGroup: 0, maxMatches: 1, ambiguityPolicy: "REJECT" });
const TRANSFORMER_ID = "factory.local.pdf-page-text.pypdf";
const TRANSFORMER_VERSION = "1";

const target = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: TARGET_KEY, manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
const source = Object.freeze({ id: SOURCE_ID, title: "2024 CB500F / CBR500R / NX500 Owner's Manual", publisher: "American Honda Motor Co., Inc.", publicationId: "31MLRB00 / 00X31-MLR-B000", tier: "A", sourceClass: "official-owner-manual", url: SOURCE_URL, officialHost: "cdn.powersports.honda.com", disposition: "acquired-content", authenticationState: "official-honda-host", models: ["CBR500R PC70", "CB500F", "NX500"], years: { from: 2024, to: 2024 }, markets: ["USA", "Canada"], transmission: "manual", targets: [TARGET_KEY] });
const prospect = factory.adapters.fromLegacyAcquiredSource(source, target, { expectedMarginalGapClass: "HIGH" });
const playbook = factory.createPlaybook({ policyId: "cbr500r-pc70-owner-manual-execution-v1" });
const artifactBinding = { artifactId: "pending", contentDigest: "0".repeat(64), mediaType: "application/pdf", byteLength: 1 };

const transformScript = ["import json, sys", "from pypdf import PdfReader", "reader = PdfReader(sys.argv[1])", "pages = json.loads(sys.argv[2])", "print(json.dumps({str(p): (reader.pages[p-1].extract_text() or '') for p in pages}, ensure_ascii=False, sort_keys=True))"].join("; ");
function readPage(pdfPath, page) {
  const output = cp.execFileSync("python3", ["-c", transformScript, pdfPath, JSON.stringify([page])], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  return JSON.parse(output)[String(page)];
}
function makeArtifact(pdfPath, attemptId) {
  const bytes = fs.readFileSync(pdfPath);
  if (bytes.subarray(0, 5).toString() !== "%PDF-") throw new Error("Honda route did not produce a PDF");
  const contentDigest = crypto.createHash("sha256").update(bytes).digest("hex");
  const identity = { prospectId: prospect.id, attemptId, mediaType: "application/pdf", contentDigest, locator: SOURCE_URL };
  return { bytes, artifact: factory.validateArtifact({ id: factory.artifactId(identity), ...identity, byteLength: bytes.length, originClassification: "OFFICIAL-HONDA-DIRECT", acquisitionMethod: "OFFICIAL-HTTP-GET-RECORDED", metadata: { sourceId: SOURCE_ID, documentId: source.publicationId, httpStatus: 200, contentType: "application/pdf" } }) };
}
function execute(pdfPath = "/private/tmp/honda-cbr500r-31mlrb000.pdf") {
  if (!fs.existsSync(pdfPath)) throw new Error("Honda PDF must be acquired through the approved route before execution");
  const batchSetup = (() => {
    const batch = factory.createResearchBatch({ purpose: "CBR500R PC70 2024 owner manual execution", policyId: "cbr500r-pc70-owner-manual-execution-v1", targets: [target], maxAttemptsPerWorkItem: 1 });
    const targetWork = factory.createTargetWork(batch.batch, target);
    const sourceWorkItem = factory.createSourceWorkItem({ batch: batch.batch, targetWork, target, prospect, operation: "attempt-existing-source", maxAttempts: 1 });
    return { batch: batch.batch, targetWork, sourceWorkItem };
  })();
  const attemptId = factory.createResearchAttempt(batchSetup.sourceWorkItem, 1).id;
  const { bytes, artifact } = makeArtifact(pdfPath, attemptId);
  const acquired = factory.validateExecutionResult({ schemaVersion: 1, batchId: batchSetup.batch.id, sourceWorkItemId: batchSetup.sourceWorkItem.id, attemptId, adapterId: "honda.official-pdf.acquisition", outcome: { schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "OFFICIAL_HONDA_PDF_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "HONDA_31MLRB00_PDF_200" }], artifact } });
  const pages = readPage(pdfPath, 180);
  const derived = factory.createDerivedContent({ parentArtifact: artifact, parentBytes: bytes, transformerId: TRANSFORMER_ID, transformerVersion: TRANSFORMER_VERSION, region: { id: "specifications-service-data", pdfPages: [180], sections: ["Specifications / Service Data"] }, approvedRegionIds: ["specifications-service-data"], content: pages, mediaType: "text/plain" });
  const applicability = { model: "CBR500R", modelCode: "PC70", generation: "PC70", modelYear: 2024, market: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard road model", condition: "manual scope explicitly includes CBR500R; shared Except NX500 rows retained" };
  const context = { batchId: batchSetup.batch.id, targetId: target.id, targetWorkId: batchSetup.targetWork.id, sourceWorkItemId: batchSetup.sourceWorkItem.id, attemptId, prospectId: prospect.id };
  const extract = rule => { const adapter = factory.createDeclarativeExtractorAdapter({ derivedContent: derived, rule, applicability, sourceAuthority: { sourceClass: "TIER_A_OEM", sourceIdentity: SOURCE_ID, sourceUrl: SOURCE_URL } }); return factory.extractRawCandidatesFromAcquiredSource({ context, researchTarget: target, sourceProspect: prospect, modelPlan: factory.createModelPlan({ playbook, targetIdentity: TARGET_KEY, sourcePublication: source.publicationId, artifact: { artifactId: artifact.id, contentDigest: artifact.contentDigest, mediaType: artifact.mediaType, byteLength: artifact.byteLength }, regions: [{ id: "specifications-service-data", pdfPages: [180], sections: ["Specifications / Service Data"] }], fieldTargets: [rule.fieldId], applicability: { required: { model: "CBR500R", modelCode: "PC70", modelYear: 2024 }, unresolved: ["abs"] }, budget: { maxRegions: 1, maxRawCandidates: 4 } }), acquisitionArtifact: artifact, derivedContentEnvelope: derived, adapter, playbook }); };
  const oil = extract(OIL_RULE); const loaded = extract(LOADED_RULE);
  const existingLoaded = honda.evidence.some(item => item.catalogVariantKey === TARGET_KEY && item.field === "tires_wheels.loaded-pressures" && item.proofStatus === "VERIFIED-DIRECT");
  return Object.freeze({ schemaVersion: "revlog-cbr500r-pc70-owner-manual-execution/v1", researchDate: "2026-09-08", target: { catalogVariantKey: TARGET_KEY, model: "CBR500R", generation: "PC70", modelYear: 2024, markets: ["USA", "Canada"], transmission: "manual", equipment: "standard road model" }, source: { id: SOURCE_ID, sourceClass: "TIER_A_OEM", title: source.title, publicationId: source.publicationId, url: SOURCE_URL, authenticationReused: true }, execution: { sourceRoutesUsed: 1, fieldsAttempted: ["lubrication.oil-specification", "tires_wheels.loaded-pressures"], noNewDiscoveryAttempts: true, noOtherSourceUsed: true }, acquisition: { result: "ACQUIRED", artifactId: artifact.id, artifactSha256: artifact.contentDigest, artifactByteLength: artifact.byteLength, mediaType: artifact.mediaType, locator: artifact.locator }, derivation: { derivedContentId: derived.id, derivedDigest: derived.contentDigest, transformerId: TRANSFORMER_ID, transformerVersion: TRANSFORMER_VERSION, pdfPages: [180] }, extraction: { oil: { rule: factory.validateRule(OIL_RULE), resultId: oil.id, disposition: oil.disposition, candidateIds: oil.candidates.map(item => item.id), ambiguityPolicy: "REJECT" }, loaded: { rule: factory.validateRule(LOADED_RULE), resultId: loaded.id, disposition: loaded.disposition, candidateIds: [], ambiguityPolicy: "REJECT" } }, fields: { "lubrication.oil-specification": { status: oil.candidates.length ? "RAW-CANDIDATE" : "STOPPED", candidates: oil.candidates, stopReason: oil.candidates.length ? null : "NO_MATCH" }, "tires_wheels.loaded-pressures": { status: "STOPPED", candidates: [], stopReason: "NO_EXPLICIT_LOADED_CONDITION", standardPressureObserved: true, loadedConditionProven: false, duplicateCoverageObserved: existingLoaded, sourceTextDoesNotLabelPressureAsLoaded: true, extractionResultDisposition: loaded.disposition } }, totals: { rawCandidates: oil.candidates.length, maxRawCandidates: 4, conflicts: 0, reviewDecisionsCreated: 0, evidenceCreated: 0, serviceCoreChanged: false, productionChanged: false, catalogueChanged: false, infrastructureChanged: false }, applicability: { required: { model: "CBR500R", modelCode: "PC70", modelYear: 2024, market: ["USA", "Canada"], transmission: "manual", equipment: "standard road model" }, unresolved: ["abs"] }, next: "Separate bounded human review of the single queued oil-specification raw candidate only; the loaded-pressure slot remains stopped until an exact applicable manual explicitly labels a loaded/passenger pressure condition." });
}
module.exports = Object.freeze({ target, source, prospect, playbook, OIL_RULE, LOADED_RULE, execute });
