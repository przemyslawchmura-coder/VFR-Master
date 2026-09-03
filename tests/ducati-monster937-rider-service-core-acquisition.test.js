"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const previous = require("../research/data/ducati-monster937-owner-manual-acquisition.js");
const wave = require("../research/data/ducati-monster937-rider-service-core-acquisition.js");
const report = wave.buildReport();

test("the principal manual remains exact and officially controlled", () => {
  assert.equal(report.target.catalogVariantKey, "ducati.monster.937");
  assert.equal(report.target.year, 2021);
  assert.equal(report.target.market, "EU");
  assert.equal(report.target.transmission, "manual");
  assert.equal(report.target.abs, true);
  assert.equal(report.principalManual.sourceClass, "official-owner-manual");
  assert.equal(report.principalManual.tier, "A");
  assert.equal(report.principalManual.publisher, "Ducati Motor Holding S.p.A.");
  assert.match(report.principalManual.url, /^https:\/\/downloads\.ctfassets\.net\/.*MY21\.pdf$/);
  assert.equal(report.documentVerification.result, "DOCUMENT-IDENTITY-VERIFIED");
  assert.equal(report.documentVerification.independentTechnicalCrossCheck, "NOT-FOUND-WITHIN-BOUNDED-DUCATI-CONTROLLED-SEARCH");
});

test("Core extraction is additive, direct, queued and provenance-bound", () => {
  assert.equal(report.priorRawCandidates, 27);
  assert.equal(report.additionalRawCandidates, 44);
  assert.equal(report.totalRawCandidatesInInventory, 71);
  assert.equal(report.queuedAdditionalCandidates, 44);
  assert.equal(wave.additionalCandidates.length, 44);
  assert.ok(wave.additionalCandidates.every(candidate => candidate.sourceId === previous.source.id));
  assert.ok(wave.additionalCandidates.every(candidate => candidate.printedPage && candidate.section && candidate.extractionMethod));
  assert.ok(wave.additionalCandidates.every(candidate => candidate.applicability.abs === true && candidate.applicability.transmission === "manual"));
  assert.ok(wave.additionalCandidates.every(candidate => candidate.normalizationState === "UNNORMALIZED" && candidate.proofStatus === "PRE-EVIDENCE-CANDIDATE"));
  assert.equal(new Set(wave.additionalCandidates.map(candidate => candidate.id)).size, wave.additionalCandidates.length);
});

test("Core inventory covers practical domains and preserves fail-closed findings", () => {
  assert.equal(report.coreDomains.length, 14);
  assert.ok(report.fieldsInvestigated.includes("maintenance.initial-service"));
  assert.ok(report.fieldsInvestigated.includes("electrical.fuse-ratings"));
  assert.ok(report.fieldsInvestigated.includes("lighting.combined-high-low"));
  assert.ok(report.fieldsInvestigated.includes("transmission_clutch.transmission-type"));
  assert.deepEqual(report.conflicts, []);
  assert.deepEqual(report.coolingReaudit, { specificationSupported: true, replacementIntervalSupported: true, capacitySupported: false, blocker: "COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR" });
  assert.equal(report.maintenanceCoverage.inspectReplaceAdjustLubricateCleanSeparated, true);
  assert.equal(report.fuseCoverage.structuredFunctionAmperage, true);
  assert.equal(report.lightingCoverage.ledModulesExplicit, true);
  assert.equal(report.lightingCoverage.bulbSocketValues, false);
});

test("production and prior research boundaries remain unchanged", () => {
  assert.equal(report.productionDucatiEntriesChanged, false);
  assert.equal(report.productionDucatiEntryCount, 6);
  assert.equal(report.vfrChanged, false);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.productionChanged, false);
  assert.equal(previous.rawCandidates.length, 27);
  assert.equal(previous.rawCandidates.every(candidate => candidate.reviewState === "QUEUED"), true);
});

test("report is deterministic", () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-rider-service-core-acquisition.json"), "utf8"));
  assert.deepEqual(wave.buildReport(), report);
  assert.deepEqual(stored, report);
});
