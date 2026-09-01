"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const dataset = require("../research/data/research-dataset.js");
const statuses = require("../research/data/source-acquisition-status.js");
const generator = require("../js/research/research-report-generator.js");

const keys = ["honda.cbr500r.gen4", "yamaha.mt09.gen3", "yamaha.tenere700.gen1"];

test("source acquisition states remain independent", () => {
  const honda = statuses.profiles[keys[0]].serviceManual;
  assert.equal(honda.publicationIdentified, true);
  assert.equal(honda.contentAccessible, false);
  assert.equal(honda.fieldEvidenceExtracted, false);
  const mt = statuses.profiles[keys[1]].serviceManual;
  assert.equal(mt.contentAccessible, false);
  assert.equal(mt.authenticityVerified, false);
  assert.equal(mt.codeRelationship, "RELATIONSHIP-UNRESOLVED");
  assert.equal(mt.relevantSectionInspected, false);
  assert.equal(mt.fieldEvidenceExtracted, false);
});

test("pipeline status is deterministic and deep profiles are not eligible", () => {
  const first = generator.buildDeepProfilePipelineStatus(dataset, keys);
  assert.deepEqual(first, generator.buildDeepProfilePipelineStatus(dataset, keys));
  keys.forEach(key => {
    assert.equal(first[key].eligibleForHumanProfileReview, false);
    assert.equal(first[key].recommendation, "research-more");
    assert.ok(first[key].nextRequiredSourceClasses.includes("service/workshop manual"));
    assert.ok(first[key].applicabilityBlockers.length > 0);
  });
});

test("pipeline report is generated deterministically", () => {
  const report = generator.renderDeepProfilePipelineStatusReport(dataset, keys);
  assert.equal(report, generator.renderDeepProfilePipelineStatusReport(dataset, keys));
  assert.equal(report, fs.readFileSync(path.join(__dirname, "../research/reports/deep-profile-pipeline-status.md"), "utf8"));
  assert.match(report, /eligible-for-human-profile-review|Eligible/);
});

test("service-manual publication without extracted values does not satisfy readiness", () => {
  const metrics = generator.buildDeepProfileMetrics(dataset, keys);
  assert.ok(keys.every(key => metrics[key].serviceManualValues === 0));
  assert.ok(keys.every(key => metrics[key].readinessReasons.includes("insufficient service-manual evidence")));
});
