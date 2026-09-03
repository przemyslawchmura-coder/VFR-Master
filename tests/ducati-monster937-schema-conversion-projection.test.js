"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/ducati-monster937-schema-conversion-projection.js").buildReport;

test("projects exactly the seven approved Ducati decisions", () => {
  const result = report();
  assert.deepEqual(result.approvedSourceFields, [
    ["ignition.spark-plug-oem", "NGK MAR9A-J"], ["lubrication.viscosity", "SAE 15W-50"], ["lubrication.api-jaso", "API: SN; JASO: MA2"], ["electrical.battery-capacity", "6.5 Ah"], ["electrical.battery-specification", "YUASA YT 7B-BS DRY, 12 V"], ["cooling.capacity", "Cooling circuit: 2.25 litres"], ["brakes.brake-fluid", "Front/rear brake circuit: DOT 4"]
  ]);
  assert.equal(result.counts.total, 7);
  assert.equal(result.counts.conversionReady, 4);
  assert.equal(result.counts.conversionBlocked, 3);
  assert.ok(result.projections.every(item => item.sourceProvenance.packet.rawValue));
});

test("battery and cooling mappings fail closed without altering upstream state", () => {
  const result = report();
  assert.equal(result.batteryLossless, false);
  assert.equal(result.coolingCapacityExact, false);
  assert.equal(result.blockedReasons["BATTERY-PAIR-REQUIRES-LOSSY-MERGE"], 2);
  assert.equal(result.blockedReasons["COOLING-CIRCUIT-SCOPE-NOT-PROVEN-ENGINE-AND-RADIATOR"], 1);
  assert.equal(result.upstreamStateChanged, false);
  assert.equal(result.productionProfileCreated, false);
  assert.equal(result.registryChanged, false);
  assert.equal(result.evidenceRowsCreated, 0);
  assert.equal(result.serviceCoreCoverageChanged, false);
});

test("conversion projection report is deterministic and stored output matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-schema-conversion-projection.json"), "utf8")), first);
});
