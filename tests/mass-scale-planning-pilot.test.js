"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const pilot = require("../research/data/mass-scale-planning-pilot.js");

test("selects a deterministic approximately-ten target sample without production profiles", () => {
  const report = pilot.buildReport();
  assert.equal(report.selection.targetsConsidered, 5314);
  assert.equal(report.selection.targetsSelected, 10);
  assert.equal(new Set(report.targets.map(item => item.manufacturer)).size, 10);
  assert.ok(report.targets.every(item => item.production.state === "ABSENT"));
  assert.deepEqual(report.targets.map(item => item.catalogVariantKey), ["suzuki.sv650.gen3", "yamaha.mt-09.gen3", "aprilia.caponord.1200", "bmw.c-scooter.c600-sport", "ducati.desertx.gen1", "harley-davidson.revolution-max.nightster", "honda.africa-twin.crf1000l", "indian.chief.gen2", "kawasaki.electric.ninja-e1", "ktm.390-duke.gen1"]);
});

test("preserves source/readiness states and unknown applicability", () => {
  const report = pilot.buildReport();
  assert.deepEqual(report.readinessDistribution, { READY: 0, BLOCKED: 1, EXHAUSTED: 1, UNRESOLVED: 8 });
  assert.ok(report.targets.filter(item => item.source.state === "BLOCKED").every(item => item.source.prospect && item.source.prospect.officialHost));
  assert.ok(report.targets.filter(item => item.source.state === "UNRESOLVED").every(item => item.unresolvedApplicability.includes("market") && item.unresolvedApplicability.includes("abs")));
  assert.equal(report.safeToExecute, false);
});

test("planning has no downstream side effects and is deterministic", () => {
  const first = pilot.buildReport();
  assert.deepEqual(first, pilot.buildReport());
  assert.equal(first.acquisitionPerformed, false);
  assert.equal(first.extractionPerformed, false);
  assert.equal(first.evidenceCreated, false);
  assert.equal(first.productionChanged, false);
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/mass-scale-planning-pilot.json", "utf8")), first);
});
