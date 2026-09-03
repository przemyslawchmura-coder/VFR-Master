"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/triumph-streettriple765-prospect-registration.js").buildReport;

test("selects exactly one supported EU Street Triple 765 III representative year", () => {
  const result = report();
  assert.equal(result.target.catalogVariantKey, "triumph.street-triple.765-3");
  assert.deepEqual(result.target.scope.years, { kind: "EXACT", from: 2023, to: 2023 });
  assert.deepEqual(result.target.scope.markets.values, ["EU"]);
  assert.deepEqual(result.target.scope.equipment.values, ["standard/base road model"]);
  assert.deepEqual(result.target.scope.abs.values, [true]);
  assert.deepEqual(result.target.scope.transmissions.values, ["manual"]);
});

test("authenticates the official Triumph handbook but fails closed on EU and equipment scope", () => {
  const result = report();
  assert.equal(result.startingProspectId, "unknown.triumph.streettriple765");
  assert.equal(result.prospect.sourceTier, "A");
  assert.equal(result.prospect.documentClass, "owner handbook");
  assert.equal(result.prospect.authenticationState, "AUTHENTICATED");
  assert.equal(result.prospect.documentIdentity.state, "KNOWN");
  assert.equal(result.readiness.passed, false);
  assert.equal(result.readiness.classification, "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL");
  assert.ok(result.readiness.blockers.includes("market:UNKNOWN"));
  assert.ok(result.readiness.blockers.includes("equipment:UNKNOWN"));
  assert.equal(result.technicalValuesInspected, false);
  assert.equal(result.evidenceRowsAdded, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
  assert.equal(result.productionChanged, false);
});

test("registration report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/triumph-streettriple765-prospect-registration.json"), "utf8")), first);
});
