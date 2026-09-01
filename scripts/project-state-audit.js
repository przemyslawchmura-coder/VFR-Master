#!/usr/bin/env node
// Deterministic repository stocktake; research-only, never imported by production.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const catalogReport = require("./motorcycle-catalog-report.js");
const serviceReport = require("./honda-service-data-report.js").buildReport();
const batch = require("../research/data/honda-batch-wave2.js").runBatch();
const registry = require("../data/technical/technical-profile-registry.js");
const standard = require("../research/schema/research-coverage-standard.js");
const pilot = require("../research/data/high-value-source-acquisition-pilot.js");
const pilotResults = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const reassessment = require("../research/data/post-pilot-scaling-reassessment.js").buildReport();
const yamahaTransfer = require("../research/data/yamaha-transfer-acquisition-batch-results.js").runBatch();
const postYamahaDesign = require("../research/data/post-yamaha-transfer-batch-design.js").buildReport();
const harleyTransfer = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js").runBatch();

const root = path.join(__dirname, "..");
const git = (...args) => cp.execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const files = (dir = ".") => fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap(entry => entry.isDirectory() && ![".git", "node_modules"].includes(entry.name) ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const allFiles = files();
const countBy = predicate => allFiles.filter(predicate).length;
const report = catalogReport.loadCatalog();
const profileDetails = registry.map(descriptor => {
  const profile = require(path.join(root, descriptor.moduleId));
  return { profileId: descriptor.profileId, catalogVariantKeys: descriptor.catalogVariantKeys, years: descriptor.years, requiredContext: profile.requiredContext || null, status: descriptor.status, entries: profile.entries.length, verified: profile.entries.filter(entry => entry.status === "verified").length, unresolved: profile.entries.filter(entry => entry.status !== "verified").length, sourceCount: new Set(profile.entries.flatMap(entry => entry.sourceIds || [])).size };
});
const perManufacturer = report.find(item => item.id === "honda") ? report : [];
const snapshot = {
  schemaVersion: "revlog-project-state/v1",
  snapshotDate: "2026-09-01",
  snapshotBasis: "post-harley-transfer-acquisition-working-tree",
  baseCommit: git("rev-parse", "HEAD"),
  containingCommit: "self (resolve from git history)",
  originMain: git("rev-parse", "origin/main"),
  aheadAfterContainingCommit: Number(git("rev-list", "--count", "origin/main..HEAD")) + 1,
  behind: Number(git("rev-list", "--count", "HEAD..origin/main")),
  repository: { files: allFiles.length, javascriptFiles: countBy(file => file.endsWith(".js")), testFiles: countBy(file => file.startsWith("tests/") && file.endsWith(".test.js")), documentationFiles: countBy(file => file.startsWith("docs/") && /\.(md|html|json)$/.test(file)), researchAndToolingFiles: countBy(file => file.startsWith("research/") || file.startsWith("scripts/")) },
  catalogue: { manufacturers: report.length, modelFamilies: report.reduce((sum, item) => sum + item.models.length, 0), variants: report.reduce((sum, item) => sum + item.models.reduce((s, model) => s + model.variants.length, 0), 0), variantYears: report.reduce((sum, item) => sum + item.models.reduce((s, model) => s + model.variants.reduce((n, variant) => n + variant.yearTo - variant.yearFrom + 1, 0), 0), 0), earliestYear: 1990, latestYear: 2025, manufacturersPresent: report.map(item => item.id), contentCompleteness: "incomplete", infrastructureMaturity: "mature-for-tested-scope", latestCompletedExpansion: "Triumph Wave 2" },
  technicalProfiles: { productionCount: registry.length, details: profileDetails },
  research: { canonicalFieldCount: standard.FIELD_COUNT, serviceCoreFieldCount: 44, hondaServiceWave1: { targets: serviceReport.targetVariants, serviceCoreEvidence: serviceReport.serviceCoreEvidence, serviceCoreSlots: serviceReport.serviceCoreSlots }, vfr800: { verified: serviceReport.byTarget.find(item => item.catalogVariantKey === "honda.vfr800.rc46.vtec.gen1").post.serviceCore.evidenceFound, total: 44, uncertainRows: serviceReport.vfrProofSummary["SOURCE-IDENTITY-UNCERTAIN"] }, cbr500r: { verified: serviceReport.byTarget.find(item => item.catalogVariantKey === "honda.cbr500r.pc70").post.serviceCore.evidenceFound, total: 44 }, batchWave2: { selectedTargets: batch.targets.length, targetFieldSlots: batch.targets.length * 44, documents: batch.documents.length, hostingLocations: batch.documents.reduce((sum, doc) => sum + doc.locations.length, 0), evidenceRows: batch.evidence.length, verifiedBefore: 51, verifiedAfter: 57, netNewVerifiedSlots: 6, practicalServiceFieldGain: 0 }, highValuePilot: { selectedTargets: pilot.targets.length, minimumPracticalServiceFields: pilot.success.minimumPracticalServiceFields, minimumVerifiedTargetSlots: pilot.success.minimumVerifiedTargetSlots, classification: "ACCEPT-WITH-RISKS", ...pilotResults.metrics, targets: pilotResults.targetResults }, postPilotScalingReassessment: { classification: reassessment.audit.classification, candidatePool: reassessment.candidates.length, manufacturersEvaluated: new Set(reassessment.candidates.map(candidate => candidate.manufacturer)).size, strategy: reassessment.strategy, selectedTargets: reassessment.selectedBatch.map(target => ({ catalogVariantKey: target.catalogVariantKey, years: target.years, markets: target.markets, startingCoverage: target.startingCoverage, expectedPracticalGain: target.expectedPracticalGain })), acceptance: reassessment.acceptance, exactNextTask: reassessment.exactNextTask }, yamahaTransferAcquisition: { classification: yamahaTransfer.classification, ...yamahaTransfer.metrics, targets: yamahaTransfer.targetResults, productionChanged: false, vfrProductionChanged: false }, postYamahaTransferDesign: { classification: postYamahaDesign.audit.classification, candidatePool: postYamahaDesign.candidates.length, manufacturersEvaluated: new Set(postYamahaDesign.candidates.map(candidate => candidate.manufacturer)).size, unknownUnranked: postYamahaDesign.candidates.filter(candidate => candidate.sourceProspect.certainty === "UNKNOWN" && candidate.score === null).length, selectedTargets: postYamahaDesign.selectedBatch, acceptance: postYamahaDesign.acceptance, exactNextTask: postYamahaDesign.exactNextTask, evidenceAcquired: false, serviceCoreCoverageChanged: false }, harleyTransferAcquisition: { classification: harleyTransfer.classification, transferInterpretation: harleyTransfer.transferInterpretation, target: harleyTransfer.target, source: harleyTransfer.source, metrics: harleyTransfer.metrics, thresholdResult: harleyTransfer.thresholdResult, falsificationTriggered: harleyTransfer.falsificationTriggered, exactNextTask: harleyTransfer.exactNextTask } },
  tests: { fullSuiteCommand: "node --test tests/*.test.js", lastKnownTotal: 414, lastKnownPassed: 414, failed: 0, skipped: 0, todo: 0 },
  productionBoundary: { researchImportedByIndex: false, runtimeEntry: "index.html", productionProfileCount: registry.length, batchPipelineNonProduction: true },
  release: { currentVersion: require("../js/app-release.js").currentVersion, latestRelease: require("../js/app-release.js").releases[0].version }
};
if (process.argv.includes("--write")) fs.writeFileSync(path.join(root, "research/reports/project-state-audit.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(snapshot, null, 2)}\n`);
