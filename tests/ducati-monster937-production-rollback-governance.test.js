"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const registry = require("../js/technical/technical-profile-registry.js");
const profile = require("../data/technical/ducati/monster937/profile-2021.js");
const source = require("../data/technical/documents/ducati/monster937-2021-documents.js");
const report = require("../research/data/ducati-monster937-production-rollback-governance.js");
const factory = require("../research/factory");

test("rollback governance contract is immutable, deterministic and fail-closed", () => {
  const input = { profileIdentity: { profileId: "synthetic.profile" }, registryIdentity: { registryName: "technical-profile-registry", descriptorProfileId: "synthetic.profile" }, catalogueVariantKey: "synthetic.variant", yearRange: { from: 2024, to: 2024 }, moduleId: "data/synthetic.js", schemaVersionRef: "revlog-technical-profile/v1", registryStatus: "review", promotedEntryCount: 0, promotedEntryIds: [], sourceIdentity: { documentId: "doc.synthetic", citationIds: [] }, prePromotionRegistryIds: ["existing.profile"], postPromotionRegistryIds: ["existing.profile", "synthetic.profile"], currentRegistryIds: ["existing.profile", "synthetic.profile"], productionFilesRetained: true, citationsRetained: true, evidenceRetained: true, reviewConversionAuthorizationHistoryRetained: true };
  const before = structuredClone(input); const first = factory.buildRollbackGovernanceRecord(input); const second = factory.buildRollbackGovernanceRecord(input);
  assert.deepEqual(first, second); assert.deepEqual(input, before); assert.equal(first.rollbackEligible, true); assert.equal(first.actualRollbackExecuted, false); assert.throws(() => factory.validateRollbackGovernanceRecord({ ...first, currentRegistryIds: ["synthetic.profile"] }), /current registry/i);
});

test("Ducati rollback target and retained production boundary are exact", () => {
  const first = report.buildReport();
  assert.equal(first.promotedProfileId, "ducati.monster937.2021"); assert.equal(first.catalogueVariantKey, "ducati.monster.937"); assert.equal(first.moduleId, "data/technical/ducati/monster937/profile-2021.js"); assert.deepEqual(first.yearRange, { from: 2021, to: 2021 }); assert.deepEqual(first.prePromotionRegistryIds, ["honda.vfr800.rc46-vtec-gen1.2002"]); assert.deepEqual(first.currentRegistryIds, ["honda.vfr800.rc46-vtec-gen1.2002", "ducati.monster937.2021"]); assert.deepEqual(first.expectedRollbackRegistryIds, ["honda.vfr800.rc46-vtec-gen1.2002"]); assert.equal(first.rollbackEligible, true); assert.deepEqual(first.rollbackBlockers, []); assert.deepEqual(first.promotedEntryIds, ["ignition.spark-plug.standard", "lubrication.engine-oil.viscosity", "lubrication.engine-oil.specification", "electrical.battery.capacity", "electrical.battery.specification", "brakes.fluid.specification"]); assert.equal(first.promotedEntryCount, 6); assert.equal(first.sourceDocumentCount, 1); assert.equal(first.citationCount, 6); assert.equal(first.actualRollbackExecuted, false); assert.equal(first.productionFilesRetained, true); assert.equal(first.citationsRetained, true); assert.equal(first.evidenceRetained, true); assert.equal(first.reviewConversionAuthorizationHistoryRetained, true); assert.equal(first.ducatiCurrentlyDiscoverable, true); assert.equal(first.vfrUnchanged, true); assert.equal(first.bmwUnchanged, true); assert.deepEqual(registry.listProfiles().map(item => item.profileId), first.currentRegistryIds); assert.equal(profile.entries.length, 6); assert.equal(fs.existsSync(path.join(__dirname, "../data/technical/ducati/monster937/profile-2021.js")), true); assert.equal(Object.keys(source.documents).length, 1); assert.equal(Object.keys(source.citations).length, 6);
});

test("rollback report is deterministic and does not mutate upstream state", () => {
  const before = JSON.stringify({ registry: registry.listProfiles(), profile, source }); const first = report.buildReport(); const second = report.buildReport();
  assert.deepEqual(first, second); assert.equal(JSON.stringify({ registry: registry.listProfiles(), profile, source }), before); assert.deepEqual(JSON.parse(fs.readFileSync(path.join(__dirname, "../research/reports/ducati-monster937-production-rollback-governance.json"), "utf8")), first);
});
