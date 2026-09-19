"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const reevaluation = require("../research/data/cbr500r-pc70-document-requirement-reevaluation.js");

test("CBR500R document requirement is ready only from compatible typed references", () => {
  const report = reevaluation.buildReport();
  const result = reevaluation.buildResult().materializationAuthorization;
  const document = report.documentRequirement;
  assert.equal(report.priorResultId, "materialization-authorization.75f4749897a97f42f0cfe4a9");
  assert.equal(result.productionAuthorizationId, "production-authorization.42dfc09d17938fb18e6dc92d");
  assert.equal(document.state, "READY");
  assert.deepEqual(document.missingInputs, []);
  assert.deepEqual(document.reasons, []);
  assert.equal(result.aggregateState, "REQUIREMENTS-PENDING");
  assert.equal(result.materializationAllowed, false);
  assert.equal(result.productionCreated, false);
  assert.equal(report.documentDefinitionRef.nonProduction, true);
  assert.equal(report.sourceProvenanceRef.nonProduction, true);
  assert.equal(report.documentDefinitionRef.documentIdentity.documentId, "31MLRB00 / 00X31-MLR-B000");
  assert.equal(report.documentDefinitionRef.documentIdentity.officialPath.startsWith("https://"), true);
  assert.equal(report.sourceProvenanceRef.lineage.candidateId, "extraction-candidate.87fcea8600978eff75d9f8d6");
  assert.deepEqual(report.sourceProvenanceRef.sourceLocation, { locator: "lines:55-64;chars:731-1026", page: null, section: "derived text", tableOrSubsection: "document:full" });
  for (const item of result.requirements.filter(item => item.type !== "PRODUCTION-DOCUMENT-MATERIALIZATION")) assert.equal(item.state, "PENDING");
});

test("CBR500R reevaluation is deterministic and preserves the bounded lineage", () => {
  const first = reevaluation.buildReport();
  const second = reevaluation.buildReport();
  assert.deepEqual(second, first);
  assert.equal(first.rawValue.includes("SAE 10W-30"), true);
  assert.equal(first.proposedProduction.entryId, "lubrication.engine-oil.specification");
  assert.equal(first.targetApplicability.abs, "KNOWN");
  assert.equal(first.lineage.productionAuthorizationId, "production-authorization.42dfc09d17938fb18e6dc92d");
  assert.equal(factory.validateDocumentDefinitionRef(first.documentDefinitionRef).id, first.documentDefinitionRef.id);
  assert.equal(factory.validateSourceProvenanceRef(first.sourceProvenanceRef).id, first.sourceProvenanceRef.id);
  const persisted = JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-document-requirement-reevaluation.json", "utf8"));
  assert.deepEqual(persisted, first);
});
