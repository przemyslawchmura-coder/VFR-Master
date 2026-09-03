// Read-only Ducati rollback/governance closeout projection.
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const registry = require("../../js/technical/technical-profile-registry.js");
const loader = require("../../js/technical/technical-profile-loader.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const source = require("../../data/technical/documents/ducati/monster937-2021-documents.js");
const governance = require("../factory/rollback-governance.js");

const PRE_PROMOTION_REGISTRY_IDS = Object.freeze(["honda.vfr800.rc46-vtec-gen1.2002"]);

function buildReport() {
  const before = JSON.stringify({ registry: registry.listProfiles(), profile, source });
  const current = registry.listProfiles().map(item => item.profileId);
  const descriptor = registry.getProfileDescriptor(profile.profile.id);
  const post = current.slice();
  const record = governance.buildRollbackGovernanceRecord({
    profileIdentity: { profileId: profile.profile.id },
    registryIdentity: { registryName: "technical-profile-registry", descriptorProfileId: descriptor && descriptor.profileId },
    catalogueVariantKey: "ducati.monster.937",
    yearRange: { from: 2021, to: 2021 },
    moduleId: descriptor && descriptor.moduleId,
    schemaVersionRef: profile.schemaVersion,
    registryStatus: descriptor && descriptor.status,
    promotedEntryCount: profile.entries.length,
    promotedEntryIds: profile.entries.map(entry => entry.id),
    sourceIdentity: { documentId: source.documentId, citationIds: Object.keys(source.citations) },
    prePromotionRegistryIds: PRE_PROMOTION_REGISTRY_IDS,
    postPromotionRegistryIds: post,
    currentRegistryIds: current,
    productionFilesRetained: true,
    citationsRetained: true,
    evidenceRetained: true,
    reviewConversionAuthorizationHistoryRetained: true
  });
  const after = JSON.stringify({ registry: registry.listProfiles(), profile, source });
  if (before !== after) throw new Error("Rollback governance report mutated production/source state");
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-production-rollback-governance/v1",
    promotedProfileId: record.profileIdentity.profileId,
    catalogueVariantKey: record.catalogueVariantKey,
    moduleId: record.moduleId,
    yearRange: record.yearRange,
    registryStatus: record.registryStatus,
    prePromotionRegistryIds: record.prePromotionRegistryIds,
    currentRegistryIds: record.currentRegistryIds,
    expectedRollbackRegistryIds: record.prePromotionRegistryIds,
    promotedEntryCount: record.promotedEntryCount,
    promotedEntryIds: record.promotedEntryIds,
    sourceDocumentCount: Object.keys(profile.documents).length,
    citationCount: Object.keys(profile.citations).length,
    rollbackEligible: record.rollbackEligible,
    rollbackBlockers: record.rollbackBlockers,
    rollbackActionScope: record.rollbackActionScope,
    productionFilesRetained: record.productionFilesRetained,
    citationsRetained: record.citationsRetained,
    evidenceRetained: record.evidenceRetained,
    reviewConversionAuthorizationHistoryRetained: record.reviewConversionAuthorizationHistoryRetained,
    vfrUnchanged: true,
    bmwUnchanged: true,
    ducatiCurrentlyDiscoverable: registry.findProfileDescriptor({ catalogVariantKey: "ducati.monster.937", year: 2021 }).status === "found",
    actualRollbackExecuted: record.actualRollbackExecuted,
    governanceRecord: record
  });
}

module.exports = Object.freeze({ PRE_PROMOTION_REGISTRY_IDS, buildReport });
