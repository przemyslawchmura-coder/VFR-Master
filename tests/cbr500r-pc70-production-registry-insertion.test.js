"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const factory = require("../research/factory/index.js");
const report = require("../research/data/cbr500r-pc70-production-registry-insertion.js");
const registry = require("../data/technical/technical-profile-registry.js");
const profile = require("../data/technical/honda/cbr500r/pc70/profile-2024.js");

test("CBR500R registry insertion is CREATED then REUSED exactly once", () => {
  const result = report.buildReport();
  assert.equal(result.firstAction, "CREATED");
  assert.equal(result.repeatAction, "REUSED");
  assert.equal(result.registryCountBefore, 2);
  assert.equal(result.registryCountAfterFirst, 3);
  assert.equal(result.registryCountAfterRepeat, 3);
  assert.equal(registry.filter(item => item.profileId === result.profileId).length, 1);
  assert.equal(result.registryDescriptor.moduleId, result.profilePath);
  assert.equal(result.registryDescriptor.years.from, 2024);
});

test("CBR500R registry insertion preserves profile contents and prior production boundaries", () => {
  const result = report.buildReport();
  assert.equal(result.oilEntryPreserved, true);
  assert.equal(result.productionProfileChanged, false);
  assert.equal(result.productionDocumentChanged, false);
  assert.equal(result.productionCitationChanged, false);
  assert.equal(result.vfrChanged, false);
  assert.equal(result.ducatiChanged, false);
  assert.equal(result.registryMembership, "REGISTERED");
  assert.equal(profile.entries.length, 1);
});

test("CBR500R registry report is deterministic and persisted", () => {
  const result = report.buildReport();
  assert.deepEqual(JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-production-registry-insertion.json", "utf8")), result);
  const run = report.executeTwice();
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(run.authorization, { ...run.input, productionProfilePath: "wrong/path.js" }, { findProfile: () => ({ id: run.input.productionProfileId, path: run.input.productionProfilePath, profile }), findRegistryEntry: () => null, createRegistryEntry: () => {} }), /profile identity|profile container/i);
  assert.throws(() => factory.materializeProductionTechnicalProfileRegistryInsertion(run.authorization, { ...run.input, requirementType: "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION" }, {}), /requirement/i);
});
