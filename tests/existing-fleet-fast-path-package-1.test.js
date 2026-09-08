const assert = require("node:assert/strict");
const test = require("node:test");
const report = require("../research/reports/existing-fleet-fast-path-package-1.json");

test("package 1 report is bounded, scoped and raw-only", () => {
  assert.deepEqual(report.scope.targets, [
    "honda.nc750x.rh09-1",
    "honda.cbr600rr.rh10",
    "honda.cbr500r.pc70"
  ]);
  assert.equal(report.scope.fields.length, 6);
  assert.equal(report.budget.packageUsage.discoveryAttempts, 4);
  assert.equal(report.budget.packageUsage.rawCandidates, 0);
  assert.deepEqual(report.retained.rawCandidates, []);
  assert.equal(report.assertions.reviewDecisionsCreated, false);
  assert.equal(report.assertions.evidenceCreated, false);
  assert.equal(report.assertions.productionChanged, false);
  assert.equal(report.assertions.supabaseChanged, false);
});

test("package 1 report reproduces byte-for-byte from committed JSON", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const text = fs.readFileSync(path.join(__dirname, "../research/reports/existing-fleet-fast-path-package-1.json"), "utf8");
  assert.deepEqual(JSON.parse(text), report);
});
