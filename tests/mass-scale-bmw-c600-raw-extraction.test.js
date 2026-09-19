"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-raw-extraction.json", "utf8"));
const extraction = require("../research/data/mass-scale-bmw-c600-raw-extraction.js");

test("BMW raw extraction is bound to the exact acquired artifact and applicability", () => {
  assert.equal(report.artifact.id, extraction.EXPECTED_ARTIFACT_ID);
  assert.equal(report.artifact.contentDigest, extraction.EXPECTED_SHA256);
  assert.equal(report.artifact.parentVerified, true);
  assert.deepEqual(report.plan.unresolvedApplicability, []);
  assert.equal(report.readiness.classification, "RAW-EXTRACTION-READY");
});

test("BMW raw extraction retains a bounded practical package without downstream state", () => {
  assert.equal(report.rawCandidateCount, report.rawCandidates.length);
  assert.ok(report.rawCandidateCount >= 15);
  assert.equal(new Set(report.rawCandidates.map(item => item.id)).size, report.rawCandidateCount);
  assert.equal(report.reviewDecisionsCreated, 0);
  assert.equal(report.evidenceRowsCreated, 0);
  assert.equal(report.promotionPerformed, false);
  assert.equal(report.productionChanged, false);
  assert.equal(report.serviceCoreCoverageChanged, false);
  assert.equal(report.contentPersisted, false);
  assert.ok(report.rawCandidates.every(item => item.artifactId.startsWith("artifact.")));
  assert.ok(report.rawCandidates.every(item => item.sourceLocation.page > 0 && item.sourceLocation.locator.includes("C_0132_RM_0912_C600Sport_07.pdf")));
});

test("BMW raw report is deterministic and preserves conditional rows", async () => {
  const again = await extraction.run();
  assert.deepEqual(again, report);
  const conditional = report.rawCandidates.filter(item => item.context?.condition);
  assert.ok(conditional.length >= 3);
  assert.ok(conditional.some(item => item.fieldId === "tires_wheels.loaded-pressures"));
  assert.deepEqual([...report.rejectedOrBlockedFields].sort(), ["cooling.capacity", "cooling.coolant-specification", "final_drive.chain-size", "maintenance.periodic-schedule"].sort());
});
