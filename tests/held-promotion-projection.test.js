"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const report = require("../research/data/held-promotion-projection.js").buildReport;

test("projects held Ducati and BMW records exactly once through the readiness gate", () => {
  const result = report();
  assert.equal(result.ducati.total, 27);
  assert.equal(result.ducati.promotionReady, 27);
  assert.equal(result.ducati.blocked, 0);
  assert.equal(result.bmw.total, 13);
  assert.equal(result.bmw.promotionReady, 11);
  assert.equal(result.bmw.blocked, 2);
  assert.equal(result.ducati.exactOnce, true);
  assert.equal(result.bmw.exactOnce, true);
});

test("keeps BMW conflicts blocked and preserves all upstream payload boundaries", () => {
  const result = report();
  assert.equal(result.bmw.blockedReasons.noUnresolvedConflict, 2);
  assert.equal(result.bmw.blockedReasons.processingAccepted, 2);
  assert.equal(result.ducati.upstreamUnchanged, true);
  assert.equal(result.bmw.upstreamUnchanged, true);
  assert.equal(result.ducati.rawValuesUnitsProvenanceApplicabilityUnchanged, true);
  assert.equal(result.bmw.rawValuesUnitsProvenanceApplicabilityUnchanged, true);
  assert.equal(result.upstreamResearchStateChanged, false);
  assert.equal(result.productionStateChanged, false);
});

test("projection is deterministic and stored report matches", () => {
  const first = report();
  assert.deepEqual(report(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/held-promotion-projection.json"), "utf8")), first);
});
