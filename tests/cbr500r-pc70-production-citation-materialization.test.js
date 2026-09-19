"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const factory = require("../research/factory/index.js");
const report = require("../research/data/cbr500r-pc70-production-citation-materialization.js");
const source = require("../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");

test("CBR500R materializes exactly one authenticated production citation", () => {
  const result = report.buildReport();
  assert.equal(result.firstAction, "CREATED");
  assert.equal(result.secondAction, "REUSED");
  assert.equal(result.productionDocumentId, "doc.97c1a14816208eaedcccd588");
  assert.equal(result.productionCitationId, "cite.44cd7d15b9c97a991b87056f");
  assert.equal(result.citationCountBefore, 0);
  assert.equal(result.citationCountAfterFirst, 1);
  assert.equal(result.citationCountAfterRepeat, 1);
  assert.equal(result.citationLocator.page, null);
  assert.equal(result.technicalProfileChanged, false);
  assert.equal(result.registryChanged, false);
  assert.equal(Object.keys(source.citations).length, 1);
});

test("CBR500R citation report is deterministic and persisted", () => {
  const first = report.buildReport();
  const second = report.buildReport();
  assert.deepEqual(second, first);
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-production-citation-materialization.json", "utf8")), first);
  assert.equal(factory.validateCitationDefinitionRef(report.productionInputs(report.executeTwice().authorization).citationDefinitionRef).id, "citation-definition-ref.2a37207884a04eae3ec5f684");
});

test("CBR500R citation execution remains fail-closed for wrong document and requirement", () => {
  const run = report.executeTwice();
  const store = { findByDocumentId: id => source.documents[id] || null, findByCitationId: id => source.citations[id] || null, createCitation: () => { throw new Error("unexpected write"); } };
  assert.throws(() => factory.materializeProductionCitation(run.authorization, { ...run.input, requirementType: "PRODUCTION-DOCUMENT-MATERIALIZATION" }, store), /requirement type/i);
  assert.throws(() => factory.materializeProductionCitation(run.authorization, { ...run.input, productionDocumentId: "doc.000000000000000000000000" }, store), /document identity|missing/i);
});
