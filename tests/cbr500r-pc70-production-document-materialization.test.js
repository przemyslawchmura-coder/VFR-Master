"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const factory = require("../research/factory/index.js");
const execution = require("../research/data/cbr500r-pc70-production-document-materialization.js");

test("CBR500R production document materialization is exact and idempotent", () => {
  const report = execution.buildReport();
  assert.equal(report.action, "CREATED");
  assert.equal(report.productionDocumentId, "doc.97c1a14816208eaedcccd588");
  assert.equal(report.firstExecutionProductionCreated, true);
  assert.equal(report.secondExecutionAction, "REUSED");
  assert.equal(report.secondExecutionProductionCreated, false);
  assert.deepEqual([report.documentCountBefore, report.documentCountAfterFirst, report.documentCountAfterRepeat], [0, 1, 1]);
  assert.equal(report.citationMaterialized, false);
  assert.equal(report.technicalProfileMaterialized, false);
  assert.equal(report.registryInserted, false);
  assert.equal(report.targetIdentity.id, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(report.sourceProvenanceReferenceId, "source-provenance-ref.2d572d0d8cc403d5c386ed8e");
});

test("CBR500R production document and later citation are persisted in the document representation", () => {
  const registry = require("../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");
  assert.deepEqual(Object.keys(registry.documents), ["doc.97c1a14816208eaedcccd588"]);
  assert.deepEqual(Object.keys(registry.citations), ["cite.44cd7d15b9c97a991b87056f"]);
  assert.equal(registry.documents[registry.documentId].manufacturer, "American Honda Motor Co., Inc.");
  assert.equal(registry.documents[registry.documentId].publicationId, "31MLRB00 / 00X31-MLR-B000");
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-production-document-materialization.json", "utf8")).productionDocumentId, registry.documentId);
});

test("CBR500R materialization result is deterministic and the document remains compatible with generic contracts", () => {
  const first = execution.buildReport();
  assert.deepEqual(execution.buildReport(), first);
  const refs = execution.productionDocument().refs;
  assert.equal(factory.productionDocumentId(refs.document, refs.provenance), first.productionDocumentId);
  assert.equal(first.historicalAbsPreserved, true);
  assert.equal(first.rawValueChanged, false);
});
