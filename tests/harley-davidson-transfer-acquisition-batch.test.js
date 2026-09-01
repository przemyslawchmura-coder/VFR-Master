"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const execution = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js");
const staging = require("../research/data/research-dataset.js");
const result = execution.runBatch();

test("execution is fixed to the designed MY2022 USA Sportster S target", () => {
  assert.equal(result.target.catalogVariantKey, "harley-davidson.revolution-max.sportster-s");
  assert.equal(result.target.designation, "RH1250S");
  assert.equal(result.target.year, 2022);
  assert.equal(result.target.market, "USA");
  assert.equal(result.target.before, 0);
});

test("publication 94001064 reauthenticates as an inapplicable 2023 manual", () => {
  assert.equal(result.source.publicationId, "94001064");
  assert.equal(result.source.officialHost, "serviceinfo.harley-davidson.com");
  assert.equal(result.source.publicationDate, 2023);
  assert.match(result.source.title, /2023.*Sportster RH Models/);
  assert.equal(result.source.authenticationState, "OFFICIAL-PUBLICATION-REAUTHENTICATED-YEAR-MISMATCH");
  assert.match(result.source.authenticationProof.model, /RH1250S/);
  assert.match(result.source.authenticationProof.targetYear, /FAILED/);
});

test("authentication failure prevents extraction and preserves coverage", () => {
  assert.equal(result.evidence.length, 0);
  assert.equal(result.metrics.verifiedSlotsBefore, 0);
  assert.equal(result.metrics.verifiedSlotsAfter, 0);
  assert.equal(result.metrics.netNewVerifiedGain, 0);
  assert.equal(result.metrics.practicalGain, 0);
  assert.equal(result.metrics.genericGain, 0);
  assert.equal(result.researchedNoEvidence.length, 0);
});

test("stale MY2022 staging candidates are rejected after source reauthentication", () => {
  const rows = staging.candidates.filter(row => row.sourceIds.includes("research.harley.2023.owner-manual.94001064"));
  assert.equal(rows.length, 3);
  assert.ok(rows.every(row => row.status === "rejected" && /MY2023/.test(row.evidenceNote)));
  assert.equal(staging.sources.find(item => item.id === "research.harley.2023.owner-manual.94001064").title, "2023 Harley-Davidson Owner's Manual — Sportster RH Models (94001064)");
});

test("one-document budget, Tier C/D exclusion and fail-closed applicability hold", () => {
  assert.equal(result.metrics.uniquePrimaryDocuments, 1);
  assert.equal(result.metrics.primaryDocumentsUsed, 1);
  assert.equal(result.metrics.primaryDocumentBudget, 1);
  assert.equal(result.metrics.documentBudgetExceeded, false);
  assert.equal(result.metrics.tierCDPracticalContribution, 0);
  assert.equal(result.target.abs, null);
  assert.ok(result.applicabilityBlockers.some(blocker => /ABS, transmission and standard-equipment/.test(blocker)));
});

test("belt semantics are not forced into chain evidence", () => {
  assert.ok(result.evidence.every(row => !String(row.canonicalFieldId).startsWith("final_drive.chain-")));
});

test("fixed thresholds fail and audit classification is REJECT", () => {
  assert.equal(result.thresholdResult.verifiedGainPassed, false);
  assert.equal(result.thresholdResult.practicalGainPassed, false);
  assert.equal(result.thresholdResult.allPassed, false);
  assert.equal(result.classification, "REJECT");
  assert.equal(result.transferInterpretation, "failed transfer");
});

test("execution remains non-production and report is reproducible", () => {
  assert.equal(result.productionChanged, false);
  assert.equal(result.runtimeBrowserChanged, false);
  assert.equal(result.catalogueChanged, false);
  assert.equal(result.cloudBackendChanged, false);
  assert.equal(result.vfrProductionChanged, false);
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "research/reports/harley-davidson-transfer-acquisition-batch.json"), "utf8"));
  assert.deepEqual(stored, result);
});
