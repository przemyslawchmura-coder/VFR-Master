"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const pilot = require("../research/data/source-discovery-pilot.js");

test("selects the deterministic smallest real sample without production profiles", () => {
  const report = pilot.buildReport();
  assert.equal(report.selection.targetsConsidered, 5314);
  assert.deepEqual(report.selection.selected.map(item => item.targetId), ["suzuki.sv650.gen3.2019", "aprilia.caponord.1200.2013"]);
  assert.ok(report.candidates.every(item => item.catalogVariantKey !== "honda.cbr500r.pc70"));
});

test("known official lead remains blocked and unresolved target remains unresolved", () => {
  const report = pilot.buildReport();
  const suzuki = report.candidates.find(item => item.catalogVariantKey === "suzuki.sv650.gen3");
  const aprilia = report.candidates.find(item => item.catalogVariantKey === "aprilia.caponord.1200");
  assert.equal(suzuki.state, "BLOCKED");
  assert.equal(suzuki.authenticationState, "AUTHENTICATED");
  assert.equal(suzuki.sourceRoute.state, "PARTIAL");
  assert.equal(aprilia.state, "UNRESOLVED");
  assert.equal(aprilia.authenticationState, "UNKNOWN");
  assert.deepEqual(aprilia.applicability.unresolvedDimensions, ["abs", "equipment", "market", "transmission"]);
});

test("pilot creates no downstream research or production state", () => {
  const report = pilot.buildReport();
  assert.deepEqual(report.existingProspectsReusedAsEvidence, ["unknown.suzuki.sv650"]);
  assert.deepEqual(report.sourceProspectsCreated, []);
  assert.equal(report.acquisitionPerformed, false);
  assert.equal(report.evidenceCreated, false);
  assert.equal(report.reviewCreated, false);
  assert.equal(report.promotionPerformed, false);
  assert.equal(report.productionChanged, false);
});

test("pilot report is deterministic and persisted", () => {
  const first = pilot.buildReport();
  assert.deepEqual(first, pilot.buildReport());
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/source-discovery-pilot.json", "utf8")), first);
});
