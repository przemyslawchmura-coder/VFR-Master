"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/bmw-f900r-prospect-registration.js").buildReport;

test("selects exactly one supported EU F 900 R I representative year", () => {
  const result = report();
  assert.equal(result.target.catalogVariantKey, "bmw.f-roadster-xr.f900r-1");
  assert.deepEqual(result.target.scope.years, { kind: "EXACT", from: 2020, to: 2020 });
  assert.deepEqual(result.target.scope.markets.values, ["EU"]);
  assert.deepEqual(result.target.scope.equipment.values, ["standard road model"]);
  assert.deepEqual(result.target.scope.abs.values, [true]);
  assert.deepEqual(result.target.scope.transmissions.values, ["manual"]);
});

test("authenticates the exact BMW Tier A rider manual and passes readiness", () => {
  const result = report();
  assert.equal(result.startingProspectId, "unknown.bmw.f900r");
  assert.equal(result.prospect.sourceTier, "A");
  assert.equal(result.prospect.documentClass, "rider manual");
  assert.match(result.officialResearch.exactManualSource, /F_0K11_RM_0520_76\.pdf$/);
  assert.equal(result.prospect.authenticationState, "AUTHENTICATED");
  assert.equal(result.readiness.passed, true);
  assert.equal(result.readiness.classification, "EXECUTION-READY");
  assert.equal(result.prospect.blockers.length, 0);
  assert.equal(result.technicalValuesInspected, false);
  assert.equal(result.evidenceRowsAdded, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
  assert.equal(result.productionChanged, false);
});

test("registration report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/bmw-f900r-prospect-registration.json"), "utf8")), first);
});
