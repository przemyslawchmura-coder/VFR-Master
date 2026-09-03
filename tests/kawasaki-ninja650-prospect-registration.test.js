"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/kawasaki-ninja650-prospect-registration.js").buildReport;

test("selects exactly one supported EU Ninja 650 II representative year", () => {
  const result = report();
  assert.equal(result.target.catalogVariantKey, "kawasaki.ninja-650.gen2");
  assert.deepEqual(result.target.scope.years, { kind: "EXACT", from: 2020, to: 2020 });
  assert.deepEqual(result.target.scope.markets.values, ["EU"]);
  assert.deepEqual(result.target.scope.equipment.values, ["standard road model"]);
  assert.deepEqual(result.target.scope.abs.values, [true]);
  assert.deepEqual(result.target.scope.transmissions.values, ["manual"]);
});

test("fails closed on unresolved exact document, source year/market and access", () => {
  const result = report();
  assert.equal(result.prospect.sourceTier, "A");
  assert.equal(result.prospect.documentClass, "owner manual");
  assert.equal(result.prospect.documentIdentity.state, "UNKNOWN");
  assert.equal(result.prospect.authenticationState, "PARTIAL");
  assert.equal(result.readiness.passed, false);
  assert.equal(result.readiness.classification, "ACCESS-BLOCKED");
  assert.ok(result.readiness.blockers.includes("year:UNKNOWN") || result.readiness.blockers.includes("market:UNKNOWN"));
  assert.equal(result.technicalValuesInspected, false);
  assert.equal(result.rawCandidatesCreated, 0);
  assert.equal(result.evidenceRowsAdded, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
  assert.equal(result.productionChanged, false);
});

test("registration report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/kawasaki-ninja650-prospect-registration.json"), "utf8")), first);
});
