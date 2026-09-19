"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const acquisition = require("../research/data/mass-scale-bmw-c600-source-acquisition.js");
const factory = require("../research/factory/index.js");

test("BMW C 600 Sport acquisition plan consumes the exact ready prospect", () => {
  const plan = acquisition.buildPlan();
  assert.equal(plan.target.id, acquisition.TARGET_ID);
  assert.equal(plan.prospect.id, "prospect.source-discovery-prospect.6a66a2fb8190733a8e58c20b");
  assert.equal(plan.sourceWorkItem.readiness.classification, "EXECUTION-READY");
  assert.deepEqual(plan.target.scope.markets.values, ["USA"]);
  assert.deepEqual(plan.target.scope.abs.values, [true]);
  assert.deepEqual(plan.target.scope.transmissions.values, ["cvt"]);
  assert.deepEqual(plan.target.scope.equipment.values, ["standard C 600 Sport"]);
});

test("network capability and PDF media type are explicit and fail closed", async () => {
  assert.equal(factory.acquisitionAdapters.createHttpAdapter().networkRequired, true);
  assert.ok(factory.acquisitionAdapters.HTTP_SUPPORTED_MEDIA_TYPES.includes("application/pdf"));
  const plan = acquisition.buildPlan();
  await assert.rejects(acquisition.executeOnce(plan, {}), /required adapter capability is unavailable/);
});

test("acquisition report is deterministic and stores no source bytes", () => {
  const report = JSON.parse(fs.readFileSync("research/reports/mass-scale-bmw-c600-source-acquisition.json", "utf8"));
  assert.equal(report.firstExecution.action, "CREATED");
  assert.equal(report.repeatExecution.action, "REUSED");
  assert.equal(report.firstExecution.artifact.id, report.repeatExecution.artifact.id);
  assert.equal(report.firstExecution.artifact.mediaType, "application/pdf");
  assert.equal(report.firstExecution.artifact.metadata.contentBase64, undefined);
  assert.equal(report.extractionPerformed, false);
  assert.equal(report.productionChanged, false);
});
