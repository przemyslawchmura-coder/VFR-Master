// NON-PRODUCTION Harley-Davidson transfer execution. Never imported by production runtime.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const design = require("./post-yamaha-transfer-batch-design.js").buildReport();
const catalog = require("../../scripts/motorcycle-catalog-report.js").loadCatalog();

const researchDate = "2026-09-01";
const targetKey = "harley-davidson.revolution-max.sportster-s";
const source = Object.freeze({
  id: "harley.transfer.sportster-rh.94001064",
  documentId: "Harley-Davidson|94001064",
  tier: "A",
  sourceClass: "official-owner-manual",
  publisher: "Harley-Davidson Motor Company, Service Communications",
  title: "2023 Harley-Davidson Owner's Manual — Sportster RH Models",
  publicationId: "94001064",
  edition: "English (United States), 2023 model year",
  publicationDate: 2023,
  url: "https://serviceinfo.harley-davidson.com/sip/service/document/original/1802738810358052210/2022-08-23%2094001064%20English%20%28United%20States%29%208%20DOM%20HARLEY-DAVIDSON%20OWNERS%20MANUAL.pdf",
  officialHost: "serviceinfo.harley-davidson.com",
  disposition: "wrong-applicability",
  accessResult: "official document endpoint returned HTTP 403; indexed official metadata was inspectable",
  authenticationState: "OFFICIAL-PUBLICATION-REAUTHENTICATED-YEAR-MISMATCH",
  language: "English",
  pageCount: null,
  models: Object.freeze(["Sportster RH Models", "RH1250S (official parts-catalogue mapping to publication 94001064)"]),
  years: Object.freeze({ from: 2023, to: 2023 }),
  markets: Object.freeze(["USA"]),
  abs: null,
  transmission: null,
  equipment: null,
  inspectedPages: Object.freeze([]),
  targets: Object.freeze([targetKey]),
  yieldedEvidence: false,
  authenticationProof: Object.freeze({
    authority: "official Harley-Davidson Service Information Portal host and indexed document metadata",
    publication: "official content identifies 94001064",
    titleAndYear: "official content identifies 2023 Harley-Davidson Owner's Manual — Sportster RH Models",
    model: "official Harley-Davidson parts-catalogue index maps owner manual 94001064 to RH1250S",
    market: "registered official filename says English (United States); document states Printed in the USA",
    targetYear: "FAILED: authenticated publication is MY2023, not selected MY2022"
  }),
  stopCondition: "MY2022 applicability failed authentication and document content was inaccessible; extraction stopped before evidence creation"
});

const evidence = Object.freeze([]);
const researchedNoEvidence = Object.freeze([]);
const applicabilityBlockers = Object.freeze([
  "publication 94001064 authenticates as a 2023 Sportster RH Models owner manual, not MY2022",
  "official document content endpoint returned HTTP 403",
  "ABS, transmission and standard-equipment applicability could not be verified from authenticated content"
]);
const falsificationTriggered = Object.freeze([
  "MY2022 USA applicability cannot be proven because publication 94001064 is a 2023 model-year manual",
  "document content is inaccessible",
  "practical gain is below 6"
]);

function runBatch() {
  const beforeTarget = pipeline.generateTargets(catalog, { catalogVariantKeys: [targetKey] }, [])[0];
  const afterTarget = pipeline.generateTargets(catalog, { catalogVariantKeys: [targetKey] }, evidence)[0];
  const documents = pipeline.buildDocumentRegistry([source]);
  const conflicts = pipeline.detectConflicts(evidence);
  const metrics = Object.freeze({
    targets: 1,
    documentsInspected: 1,
    uniquePrimaryDocuments: documents.length,
    hostingLocations: documents.reduce((sum, document) => sum + document.locations.length, 0),
    duplicateHostingLocations: 0,
    documentsYieldingEvidence: 0,
    sourceTierDistribution: Object.freeze({ A: 1, B: 0, C: 0, D: 0 }),
    documentAuthenticationStatus: source.authenticationState,
    evidenceRows: evidence.length,
    verifiedSlotsBefore: beforeTarget.evidenceCount,
    verifiedSlotsAfter: afterTarget.evidenceCount,
    netNewVerifiedGain: afterTarget.evidenceCount - beforeTarget.evidenceCount,
    practicalGain: 0,
    genericGain: 0,
    researchedNoEvidenceFields: researchedNoEvidence.length,
    conflicts: conflicts.length,
    unresolvedSafetyCriticalConflicts: 0,
    applicabilityBlockers: applicabilityBlockers.length,
    primaryDocumentsUsed: 1,
    primaryDocumentBudget: design.acceptance.maximumPrimaryDocumentsOverall,
    documentBudgetExceeded: false,
    practicalGainPerPrimaryDocument: 0,
    tierCDPracticalContribution: 0
  });
  const thresholdResult = Object.freeze({
    verifiedGainPassed: metrics.netNewVerifiedGain >= design.acceptance.minimumVerifiedGain,
    practicalGainPassed: metrics.practicalGain >= design.acceptance.minimumPracticalGain,
    perTargetPracticalPassed: metrics.practicalGain >= design.acceptance.minimumPerYieldingTargetPracticalGain,
    tierCDPassed: metrics.tierCDPracticalContribution === design.acceptance.maximumTierCDPracticalContribution,
    conflictsPassed: metrics.unresolvedSafetyCriticalConflicts === design.acceptance.unresolvedSafetyCriticalConflicts,
    budgetPassed: !metrics.documentBudgetExceeded,
    allPassed: false
  });
  return Object.freeze({
    schemaVersion: "revlog-harley-transfer-acquisition/v1",
    researchDate,
    classification: "REJECT",
    transferInterpretation: "failed transfer",
    target: Object.freeze({ catalogVariantKey: targetKey, model: "Sportster S", designation: "RH1250S", year: 2022, market: "USA", abs: null, transmission: "manual", equipment: "standard", before: 0, after: 0 }),
    source,
    documents,
    evidence,
    researchedNoEvidence,
    conflicts,
    applicabilityBlockers,
    falsificationTriggered,
    metrics,
    thresholdResult,
    comparison: Object.freeze({ hondaPracticalPerYieldingDocument: 24, yamahaPracticalPerYieldingDocument: 27, harleyExpectedRange: Object.freeze({ min: 6, max: 18 }), harleyObserved: 0 }),
    productionChanged: false,
    runtimeBrowserChanged: false,
    catalogueChanged: false,
    cloudBackendChanged: false,
    vfrProductionChanged: false,
    exactNextTask: "Perform a bounded source-prospect authentication-quality reassessment: audit every immediate-batch registered Tier A/B prospect for exact publication, model-year, market, model/equipment inclusion and content accessibility before selecting another manufacturer acquisition; acquire no motorcycle evidence during that reassessment."
  });
}

module.exports = Object.freeze({ researchDate, targetKey, source, evidence, researchedNoEvidence, applicabilityBlockers, falsificationTriggered, runBatch });
