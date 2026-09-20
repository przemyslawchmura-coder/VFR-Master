"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const conversion = require("../research/data/mass-scale-bmw-c600-schema-conversion.js");
const decisions = require("../research/data/mass-scale-bmw-c600-promotion-review-decisions.js");
const packets = require("../research/data/mass-scale-bmw-c600-promotion-review.js");
const readiness = require("../research/data/mass-scale-bmw-c600-promotion-readiness.js");
const processing = require("../research/data/mass-scale-bmw-c600-evidence-processing.js");
const report = JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/mass-scale-bmw-c600-schema-conversion.json"), "utf8"));

test("BMW schema conversion consumes exactly 24 approved decisions", () => {
  const first = conversion.buildReport();
  assert.deepEqual(first, report);
  assert.equal(first.input.decisionsReceived, 24);
  assert.equal(first.input.eligible, 24);
  assert.equal(first.input.missing, 0);
  assert.equal(first.input.duplicates, 0);
  assert.equal(first.counts.total, 24);
  assert.equal(first.counts.conversionReady, 24);
  assert.equal(first.counts.conversionBlocked, 0);
  assert.equal(first.projections.length, 24);
  assert.equal(new Set(first.projections.map(item => item.promotionReviewDecisionId)).size, 24);
});

test("BMW projections are deterministic, generic and fully traceable", () => {
  const first = conversion.buildReport();
  assert.deepEqual(conversion.buildReport(), first);
  for (const item of first.projections) {
    assert.equal(item.conversionState, "CONVERSION-READY");
    assert.equal(item.promotionReviewDecisionState, "APPROVED-FOR-CONVERSION");
    assert.equal(item.id, factory.schemaConversionId(item));
    assert.equal(item.proposedProduction.value.type, "text");
    assert.equal(item.proposedProduction.value.text, item.sourceProvenance.packet.rawValue);
    assert.equal(item.sourceProvenance.packet.promotionReviewPacketId, item.promotionReviewPacketId);
    assert.equal(item.sourceProvenance.packet.promotionPacketId, item.promotionPacketId);
    assert.equal(item.sourceProvenance.packet.evidenceProcessingRecordId, item.evidenceProcessingRecordId);
    assert.equal(item.sourceProvenance.packet.canonicalFieldId, item.researchCanonicalFieldId);
    assert.ok(item.sourceProvenance.packet.provenance.candidateId);
    assert.ok(item.sourceProvenance.sourceLocation.locator);
    assert.equal(item.targetApplicability.modelYear, "KNOWN");
    assert.equal(item.targetApplicability.market, "KNOWN");
    assert.equal(item.targetApplicability.equipment, "SUFFICIENT");
  }
});

test("BMW raw, upstream and conditional state remain unchanged", () => {
  const first = conversion.buildReport();
  assert.equal(first.conditionalContexts.length, 9);
  assert.ok(first.assertions.conditionalContextsPreserved);
  assert.ok(first.assertions.upstreamUnchanged);
  assert.equal(first.assertions.noEvidenceRowsCreated, 0);
  assert.equal(first.assertions.productionChanged, false);
  assert.equal(first.assertions.serviceCoreChanged, false);
  assert.equal(first.assertions.catalogueChanged, false);
  assert.equal(first.assertions.registryChanged, false);
  assert.equal(first.assertions.cloudChanged, false);
  assert.equal(first.handling.numericNormalization, false);
  assert.equal(first.handling.unitConversion, false);
  assert.equal(first.handling.compoundDecomposition, false);
  assert.equal(decisions.buildReport().counts.approvedForConversion, 24);
  assert.equal(packets.buildReport().counts.pending, 24);
  assert.equal(readiness.buildReport().readiness.promotionReady, 24);
  assert.equal(processing.buildReport().records.length, 24);
});
