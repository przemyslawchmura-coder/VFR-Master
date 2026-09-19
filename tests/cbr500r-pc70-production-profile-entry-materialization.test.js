"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const factory = require("../research/factory/index.js");
const report = require("../research/data/cbr500r-pc70-production-profile-entry-materialization.js");
const profile = require("../data/technical/honda/cbr500r/pc70/profile-2024.js");
const source = require("../data/technical/documents/honda/cbr500r-pc70-2024-documents.js");
const registry = require("../data/technical/technical-profile-registry.js");

test("CBR500R oil entry is CREATED then REUSED with exact production bindings", () => {
  const result = report.buildReport();
  assert.equal(result.firstAction, "CREATED");
  assert.equal(result.repeatAction, "REUSED");
  assert.equal(result.productionProfileId, "honda.cbr500r.pc70.2024");
  assert.equal(result.productionEntryId, "lubrication.engine-oil.specification");
  assert.equal(result.productionDocumentId, "doc.97c1a14816208eaedcccd588");
  assert.equal(result.productionCitationId, "cite.44cd7d15b9c97a991b87056f");
  assert.equal(result.entryCountBefore, 0);
  assert.equal(result.entryCountAfterFirst, 1);
  assert.equal(result.entryCountAfterRepeat, 1);
  assert.equal(result.registryMembership, "NOT-REGISTERED");
  assert.equal(profile.entries.length, 1);
  assert.equal(profile.entries[0].sourceIds[0], result.productionCitationId);
  assert.equal(result.productionEntry.value.text, result.productionEntry.value.text);
});

test("CBR500R entry materialization preserves source state and registry isolation", () => {
  const result = report.buildReport();
  assert.equal(result.productionDocumentChanged, false);
  assert.equal(result.productionCitationChanged, false);
  assert.equal(result.registryChanged, false);
  assert.equal(result.rawValueChanged, false);
  assert.equal(result.proposedProductionChanged, false);
  assert.equal(result.normalizationPerformed, false);
  assert.equal(result.applicabilityBroadened, false);
  assert.equal(result.historicalAbsPreserved, true);
  assert.equal(result.verifiedAbsPreserved, true);
  assert.equal(result.riderServiceCore.changed, false);
  assert.equal(registry.some(item => item.profileId === "honda.cbr500r.pc70.2024"), false);
  assert.equal(Object.keys(source.documents).length, 1);
  assert.equal(Object.keys(source.citations).length, 1);
});

test("CBR500R entry materialization fails closed on wrong bindings and conflicts", () => {
  const run = report.executeTwice();
  const conflictStore = {
    findProfileByDefinition: () => ({ profileId: run.first.productionProfileId, path: run.first.productionProfilePath }),
    findCitationById: id => source.citations[id] || null,
    findDocumentById: id => source.documents[id] || null,
    findEntry: () => ({ ...run.first.productionEntry, value: { type: "text", text: "conflict" } }),
    createEntry: () => { throw new Error("unexpected write"); }
  };
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(run.authorization, run.input, conflictStore), /conflicts/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(run.authorization, { ...run.input, productionCitationId: "cite.000000000000000000000000" }, run.input), /store|citation/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileEntry(run.authorization, { ...run.input, requirementType: "REGISTRY-INSERTION" }, conflictStore), /requirement type/i);
});

test("CBR500R entry materialization report is persisted deterministically", () => {
  const result = report.buildReport();
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-production-profile-entry-materialization.json", "utf8")), result);
});
