// NON-PRODUCTION bounded FZ1 raw extraction pilot. Never promotes output.
"use strict";

const cp = require("node:child_process");
const fs = require("node:fs");
const factory = require("../factory/index.js");
const acquisition = require("./yamaha-fz1-2d1x-owner-manual-acquisition.js");
const planModule = require("./yamaha-fz1-2d1x-extraction-plan.js");

const EXPECTED_SHA256 = planModule.EXPECTED_SHA256;
const MAX_CANDIDATES = 24;
const TRANSFORMER_ID = "factory.local.pdf-page-text.pypdf";
const TRANSFORMER_VERSION = "1";
const target = acquisition.target;
const prospect = acquisition.prospect;
const artifact = acquisition.buildArtifact();
const playbook = factory.createPlaybook();
const modelPlan = factory.createModelPlan({
  playbook,
  targetIdentity: "yamaha.fz1.gen2",
  sourcePublication: "2D1X",
  artifact: { artifactId: artifact.id, contentDigest: EXPECTED_SHA256, mediaType: "application/pdf", byteLength: 5098486 },
  regions: planModule.allowedRegions.map(region => ({ id: region.id, pdfPages: region.pdfPages, sections: region.sections })),
  fieldTargets: planModule.targetAreas.map(item => item.fieldId),
  applicability: { required: { publicationCode: "2D1X", model: ["FZ1-N", "FZ1-NA"], generation: ["II"], modelYear: 2010, bodyStyle: ["naked"] }, unresolved: ["market", "abs", "transmission", "equipment", "emissions"] },
  budget: { maxRegions: 6, maxRawCandidates: MAX_CANDIDATES }
});
const adapterDeclaration = factory.validateExtractorAdapterDeclaration({ schemaVersion: factory.EXTRACTION_SCHEMA_VERSION, adapterId: planModule.adapter.adapterId, adapterVersion: planModule.adapter.adapterVersion, supportedMediaTypes: ["text/plain"], supportedOperations: [factory.EXTRACTION_OPERATION], deterministic: true, localOnly: true });

const transformScript = [
  "import json, sys",
  "from pypdf import PdfReader",
  "reader = PdfReader(sys.argv[1])",
  "pages = json.loads(sys.argv[2])",
  "print(json.dumps({str(p): (reader.pages[p-1].extract_text() or '') for p in pages}, ensure_ascii=False, sort_keys=True))"
].join("; ");

function readApprovedPages(pdfPath) {
  const output = cp.execFileSync("python3", ["-c", transformScript, pdfPath, JSON.stringify([...new Set(planModule.allowedRegions.flatMap(region => region.pdfPages))].sort((a, b) => a - b))], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  return JSON.parse(output);
}

function location(region, page, locator, tableOrSubsection, unitsContext = "preserve source units") {
  return { page, section: region.sections.join(" / "), locator, tableOrSubsection, applicabilityStatement: "2010 FZ1-N / FZ1-NA owner manual scope; unresolved dimensions retained", unitsContext };
}

function applicability(condition = null) {
  return { publicationCode: "2D1X", model: ["FZ1-N", "FZ1-NA"], generation: "II", modelYear: 2010, bodyStyle: "naked", market: "UNKNOWN", abs: "UNKNOWN", transmission: "UNKNOWN", equipment: "UNKNOWN", emissions: "UNKNOWN", ...(condition ? { condition } : {}) };
}

function candidate(fieldId, rawValue, rawUnit, sourceLocation, context, ordinal) {
  return { fieldId, rawValue, rawUnit, sourceLocation, extractionMethod: "LOCAL-PDF-TEXT-BOUND-RAW", applicability: applicability(context.condition || null), context, ordinal };
}

function extractRegion(region, text, derivedContentId) {
  const out = [];
  const ctx = extra => ({ derivedContentId, sourceEncoding: "utf8", ...(extra || {}) });
  const add = (fieldId, rawValue, unit, page, locator, table, extra) => out.push(candidate(fieldId, rawValue, unit, location(region, page, locator, table, extra?.unitsContext), ctx(extra), out.length + 1));
  if (region.id === "maintenance-oil-cooling" && text.includes("ヤマルーブプレミアム")) {
    add("lubrication.oil-specification", "ヤマルーブ プレミアム 10W–40 MA; ヤマルーブ スポーツ 10W–40 MA; ヤマルーブ ベーシック 20W–40 または 10W–30 MA", null, 41, "JAU30372 / 推奨エンジンオイル", "recommended oil table", { unitsContext: "viscosity and JASO designation preserved" });
  }
  if (region.id === "maintenance-oil-cooling" && text.includes("ヤマハ純正ロングライフクーラント") && text.includes("1 対 1")) {
    add("cooling.coolant-specification", "ヤマハ純正ロングライフクーラントと水道水を1対1で混合", null, 43, "JAU30801 / 冷却水のつくりかた", "coolant preparation subsection", { unitsContext: "ratio preserved" });
    add("cooling.capacity", "リザーブタンク FULL 0.25 L; 冷却水総容量 2.25 L", "L", 62, "製品仕様 / クーリングシステム", "cooling system specification", { unitsContext: "L; FULL-level reserve and total capacity kept separate" });
  }
  if (region.id === "maintenance-tires-clutch-brakes" && text.includes("タイヤサイズ")) {
    add("tires_wheels.front-size", "120/70 ZR17M/C (58W)", null, 47, "タイヤ / タイヤサイズ / 前輪", "front tire size", {});
    add("tires_wheels.rear-size", "190/50 ZR17M/C (73W)", null, 47, "タイヤ / タイヤサイズ / 後輪", "rear tire size", {});
    add("tires_wheels.solo-pressures", "前輪 250 kPa (2.50 kgf/cm²); 後輪 290 kPa (2.90 kgf/cm²)", "kPa", 46, "タイヤ / タイヤ空気圧（冷間時） / 1名乗車", "solo cold tire pressures", { condition: "1名乗車; cold tires" });
    add("tires_wheels.loaded-pressures", "前輪 250 kPa (2.50 kgf/cm²); 後輪 290 kPa (2.90 kgf/cm²)", "kPa", 46, "タイヤ / タイヤ空気圧（冷間時） / 2名乗車", "loaded cold tire pressures", { condition: "2名乗車; cold tires" });
  }
  if (region.id === "maintenance-chain-electrical" && text.includes("ドライブチェーンのたわみ量")) {
    add("final_drive.chain-slack", "20.0–30.0 mm", "mm", 51, "JAU22773 / ドライブチェーンの点検", "chain slack specification", { condition: "rear suspension fully extended; no seat load" });
    add("final_drive.chain-inspection", "チェーン中央部の上下たわみ、滑らかな回転、給油状態を点検", null, 51, "JAU22773 / ドライブチェーンの点検", "chain inspection procedure", { condition: "rear wheel slowly rotated for inspection" });
  }
  if (region.id === "maintenance-tires-clutch-brakes" && text.includes("指定ブレーキ液")) {
    add("brakes.brake-fluid", "BF-4 (DOT-4)", null, 50, "JAU31262 / 指定ブレーキ液", "brake fluid specification", {});
  }
  if (region.id === "maintenance-chain-electrical" && text.includes("YTZ14S") && text.includes("11.2 Ah")) {
    add("electrical.battery-specification", "YTZ14S", null, 63, "製品仕様 / バッテリー / バッテリー型式", "battery model", {});
    add("electrical.battery-capacity", "12 V, 11.2 Ah", "V/Ah", 63, "製品仕様 / バッテリー / バッテリー容量", "battery capacity", {});
  }
  if (region.id === "maintenance-chain-electrical" && text.includes("メイン") && text.includes("50.0 A")) {
    add("electrical.main-fuse", "50.0 A", "A", 63, "製品仕様 / ヒューズ容量 / メイン", "main fuse rating", {});
    add("electrical.fuse-ratings", "メイン 50.0 A; ヘッドライト 15.0 A; シグナル 10.0 A; イグニッション 15.0 A; ラジエターファン 10.0 A × 2; フューエルインジェクション 15.0 A; バックアップ 10.0 A", "A", 63, "製品仕様 / ヒューズ容量", "fuse rating table", { condition: "named fuse circuits; fan quantity retained" });
  }
  if (region.id === "maintenance-chain-electrical" && text.includes("指定されているワット数")) add("lighting.replaceability", "指定されているワット数・規格の電球を使用", null, 56, "JAU29442 / 灯火装置および方向指示灯の点検", "bulb replacement instruction", {});
  if (region.id === "specification-index" && text.includes("常時かみ合式６速") && text.includes("湿式多板")) {
    add("transmission_clutch.transmission-type", "常時かみ合式6速", null, 61, "製品仕様 / ミッション・チェンジ方式", "transmission specification", {});
    add("transmission_clutch.clutch-type", "湿式多板", null, 61, "製品仕様 / クラッチ形式", "clutch specification", {});
    add("tires_wheels.oem-tire-models", "DUNLOP/D221FA 前輪; DUNLOP/D221G 後輪", null, 62, "製品仕様 / メーカー・銘柄", "OEM tire model table", {});
  }
  return out;
}

function runPilot({ pdfPath = "/private/tmp/fz1-2d1x.pdf" } = {}) {
  if (!fs.existsSync(pdfPath)) throw new Error("FZ1 pilot requires the already acquired local PDF artifact");
  const bytes = fs.readFileSync(pdfPath);
  factory.validateParentBytes(artifact, bytes);
  const readiness = factory.evaluateRawExtractionReadiness({ playbook, modelPlan, sourceProspect: prospect, acquiredArtifact: artifact });
  if (!readiness.passed) throw new Error(`FZ1 raw extraction readiness blocked: ${readiness.blockers.join(",")}`);
  const pages = readApprovedPages(pdfPath);
  const regions = [];
  let candidates = [];
  planModule.allowedRegions.forEach(region => {
    const content = region.pdfPages.map(page => pages[String(page)] || "").join("\n");
    const derived = factory.createDerivedContent({ parentArtifact: artifact, parentBytes: bytes, transformerId: TRANSFORMER_ID, transformerVersion: TRANSFORMER_VERSION, region, approvedRegionIds: planModule.allowedRegions.map(item => item.id), content, mediaType: "text/plain" });
    const adapter = { ...adapterDeclaration, execute: input => { const regionCandidates = extractRegion(region, input.content, derived.id); return { disposition: regionCandidates.length > 0 ? "CANDIDATES-PRODUCED" : "NO-CANDIDATES", candidates: regionCandidates, observations: [{ type: regionCandidates.length > 0 ? "CANDIDATE-EXTRACTED" : "NO-CANDIDATES", detailCode: regionCandidates.length > 0 ? "FZ1_APPROVED_REGION_PARSED" : "FZ1_REGION_HAS_NO_MAPPED_TARGET", metadata: { regionId: region.id } }] }; } };
    const result = factory.extractRawCandidatesFromAcquiredSource({ context: { batchId: acquisition.batchSetup.batch.id, targetId: target.id, targetWorkId: acquisition.batchSetup.targetWork.id, sourceWorkItemId: acquisition.batchSetup.sourceWorkItem.id, attemptId: artifact.attemptId, prospectId: prospect.id }, researchTarget: target, sourceProspect: prospect, modelPlan, acquisitionArtifact: artifact, derivedContentEnvelope: derived, adapter, playbook });
    if (result.candidates.length > 0) candidates = candidates.concat(result.candidates);
    regions.push({ id: region.id, pages: region.pdfPages, derivedContentId: derived.id, extractionResultId: result.id, disposition: result.disposition, candidates: result.candidates.length });
  });
  if (candidates.length > MAX_CANDIDATES) throw new Error("FZ1 raw candidate budget exceeded");
  return Object.freeze({ schemaVersion: "revlog-yamaha-fz1-2d1x-extraction-pilot/v1", targetResearchIdentity: "yamaha.fz1.gen2", publicationCode: "2D1X", artifactId: artifact.id, artifactSha256: EXPECTED_SHA256, artifactByteLength: artifact.byteLength, artifactMediaType: artifact.mediaType, transformer: { id: TRANSFORMER_ID, version: TRANSFORMER_VERSION }, readiness, approvedRegions: regions, candidates, rawCandidatesCreated: candidates.length, reviewDecisionsCreated: 0, evidenceRowsCreated: 0, serviceCoreCoverageChanged: false, productionChanged: false, serviceManualLeadTouched: false, applicability: { required: modelPlan.applicability.required, unresolved: modelPlan.applicability.unresolved }, budget: { maxRegions: 6, regionsInspected: regions.length, maxRawCandidates: MAX_CANDIDATES, consumedRawCandidates: candidates.length, publications: 1 }, sourcePathPersisted: false, next: "Evaluate whether this raw-only pilot demonstrates sufficient genericity before any multi-model scaling." });
}

function buildReport(options) { return runPilot(options); }

module.exports = Object.freeze({ EXPECTED_SHA256, TRANSFORMER_ID, TRANSFORMER_VERSION, target, prospect, artifact, modelPlan, readApprovedPages, extractRegion, runPilot, buildReport });
