"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const report = require("../research/data/cbr500r-pc70-production-profile-container-materialization.js");
const profile = require("../data/technical/honda/cbr500r/pc70/profile-2024.js");

test("CBR500R production Technical Profile container is empty, deterministic and unregistered", () => {
  const result = report.buildReport();
  assert.equal(result.profileId, "honda.cbr500r.pc70.2024");
  assert.equal(result.profilePath, "data/technical/honda/cbr500r/pc70/profile-2024.js");
  assert.equal(result.profileSchema, "revlog-technical-profile/v1");
  assert.equal(result.profileIdentity.targetId, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(result.profileIdentity.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(result.action, "CREATED");
  assert.equal(result.repeatAction, "REUSED");
  assert.equal(result.containerCountBefore, 0);
  assert.equal(result.containerCountAfter, 1);
  assert.equal(result.containerCountAfterRepeat, 1);
  assert.deepEqual(result.entriesBefore, []);
  assert.deepEqual(result.entriesAfter, []);
  assert.equal(result.registryMembership, "NOT-REGISTERED");
  assert.equal(result.productionCreated, true);
  assert.equal(profile.entries.length, 0);
  assert.equal(result.assertions.noOilEntry, true);
});

test("CBR500R container remains bounded to the authorized target and provenance", () => {
  const result = report.buildResult();
  assert.equal(result.sourceDocumentId, "doc.97c1a14816208eaedcccd588");
  assert.deepEqual(result.citationIds, ["cite.44cd7d15b9c97a991b87056f"]);
  assert.equal(result.targetApplicability.abs, "KNOWN");
  assert.equal(result.historicalAbsPreserved, true);
  assert.equal(result.verifiedAbsPreserved, true);
  assert.equal(result.assertions.noRegistryInsertion, true);
});

test("CBR500R container report is persisted deterministically", () => {
  const expected = report.buildReport();
  const stored = JSON.parse(fs.readFileSync("research/reports/cbr500r-pc70-production-profile-container-materialization.json", "utf8"));
  assert.deepEqual(stored, expected);
});
