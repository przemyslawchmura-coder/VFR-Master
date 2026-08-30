"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const batch = require("../research/data/honda-batch-wave2.js").runBatch();
const pipeline = require("../research/lib/batch-research-pipeline.js");
const service = require("../research/data/honda-service-wave1.js");

test("Honda batch Wave 2 selects catalogue-backed targets across families", () => {
  assert.equal(batch.targets.length, 12);
  assert.equal(new Set(batch.targets.map(row => row.catalogVariantKey)).size, 12);
  assert.ok(batch.targets.every(row => row.total === 44));
});

test("high-leverage Honda brochure evidence is reused without double counting", () => {
  assert.equal(batch.documents.length, 6);
  assert.ok(batch.documents.some(doc => doc.mirrorCount === 2));
  assert.equal(new Set(batch.evidence.map(row => `${row.catalogVariantKey}|${row.canonicalFieldId}`)).size, batch.evidence.length);
  assert.ok(batch.evidence.every(row => pipeline.validProof(row.proofStatus)));
  assert.ok(batch.targets.find(row => row.catalogVariantKey === "honda.cbr650.cbr650r-2").evidenceCount >= 2);
});

test("Honda batch preserves applicability and research-only boundaries", () => {
  assert.ok(batch.evidence.every(row => row.yearApplicability.from === 2021 && row.yearApplicability.to === 2021));
  assert.ok(batch.evidence.every(row => row.marketApplicability === "EU/UK"));
  const vfr = batch.targets.find(row => row.catalogVariantKey === "honda.vfr800.rc46.vtec.gen1");
  const cbr = batch.targets.find(row => row.catalogVariantKey === "honda.cbr500r.pc70");
  assert.equal(vfr.evidenceCount, 13);
  assert.equal(vfr.gaps.filter(row => row.status !== "evidence-found").length, 31);
  assert.equal(cbr.evidenceCount, 26);
  assert.equal(service.targets.length, 8);
});

test("batch report and review queue are deterministic", () => {
  const again = require("../research/data/honda-batch-wave2.js").runBatch();
  assert.equal(batch.report.deterministicHash, again.report.deterministicHash);
  assert.deepEqual(batch.reviewQueue, again.reviewQueue);
  assert.ok(batch.reviewQueue.every(item => item.reason && item.blocker));
});
