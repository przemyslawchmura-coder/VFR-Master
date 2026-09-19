"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const reevaluation = require("../research/data/cbr500r-pc70-citation-requirement-reevaluation.js");

test("CBR500R citation requirement is ready from reused document and typed location references", () => {
  const report = reevaluation.buildReport();
  const citation = report.citationRequirement;
  assert.equal(report.priorResultId, "materialization-authorization.5020e2d7cd615e55733be824");
  assert.equal(report.documentRequirement.state, "READY");
  assert.equal(citation.state, "READY");
  assert.deepEqual(citation.requiredInputs, ["citation-definition-ref", "document-definition-ref", "source-location-ref"]);
  assert.deepEqual(citation.missingInputs, []);
  assert.deepEqual(citation.reasons, []);
  assert.equal(report.citationDefinitionRef.nonProduction, true);
  assert.equal(report.sourceLocationRef.nonProduction, true);
  assert.equal(report.documentDefinitionRef.id, "document-definition-ref.14e426a4de8c87bea90b0236");
  assert.equal(report.sourceLocationRef.sourceLocation.locator, "lines:55-64;chars:731-1026");
  assert.equal(report.sourceLocationRef.sourceLocation.page, null);
  assert.equal(report.aggregateState, "REQUIREMENTS-PENDING");
  assert.equal(report.materializationAllowed, false);
  assert.equal(report.productionCreated, false);
  assert.ok(report.otherRequirements.every(item => item.state === "PENDING"));
});

test("CBR500R citation reevaluation is deterministic and persisted without production side effects", () => {
  const first = reevaluation.buildReport();
  assert.deepEqual(reevaluation.buildReport(), first);
  assert.equal(factory.validateCitationDefinitionRef(first.citationDefinitionRef).id, first.citationDefinitionRef.id);
  assert.equal(factory.validateSourceLocationRef(first.sourceLocationRef).id, first.sourceLocationRef.id);
  assert.equal(first.sourceProvenanceRef.id, "source-provenance-ref.2d572d0d8cc403d5c386ed8e");
  assert.equal(first.rawValue.includes("SAE 10W-30"), true);
  assert.equal(first.proposedProduction.entryId, "lubrication.engine-oil.specification");
  assert.equal(first.targetApplicability.abs, "KNOWN");
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-citation-requirement-reevaluation.json", "utf8")), first);
});
