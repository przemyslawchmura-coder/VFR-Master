"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const processing = require("../research/data/cbr500r-pc70-evidence-processing.js");

test("CBR500R processing consumes exactly one accepted decision and preserves lineage", () => {
  const result = processing.buildProcessed();
  assert.equal(result.records.length, 1);
  const record = result.records[0];
  assert.equal(record.state, "ACCEPTED-FOR-PROCESSING");
  assert.equal(record.reasonCode, "ACCEPTED-DECISION");
  assert.equal(record.decisionId, "review-decision.3d8c7cebfd3c3c4f34b1f163");
  assert.equal(record.queueEntryId, "review-queue-entry.7b8d56af51c808e15dd558ac");
  assert.equal(record.candidateId, "extraction-candidate.87fcea8600978eff75d9f8d6");
  assert.equal(record.candidate.applicability.abs, null);
  assert.equal(Object.prototype.hasOwnProperty.call(record, "normalizedValue"), false);
  assert.equal(factory.evidenceProcessingId({ decisionId: record.decisionId, queueEntryId: record.queueEntryId, state: record.state }), record.id);
});

test("CBR500R processing is idempotent and persisted report preserves the pre-promotion boundary", () => {
  const first = processing.buildReport();
  assert.deepEqual(processing.buildReport(), first);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/cbr500r-pc70-evidence-processing.json"), "utf8")), first);
  assert.equal(first.metrics.normalizationPerformed, false);
  assert.equal(first.metrics.conflictsDetected, 0);
  assert.equal(first.metrics.evidenceRowsCreated, 0);
  assert.equal(first.metrics.productionChanged, false);
  assert.equal(first.assertions.promotionOccurred, false);
});
