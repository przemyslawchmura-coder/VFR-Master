"use strict";

const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const vfr = require("../../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const acquisition = require("./ducati-monster937-owner-manual-acquisition.js");
const conversion = require("./ducati-monster937-schema-conversion-projection.js");

const VFR_CATEGORY_IDS = vfr.categories.map(category => category.id);
const PROMOTED_FIELD_IDS = Object.freeze(profile.entries.map(entry => entry.id));
const AUTHORIZED_FIELD_IDS = Object.freeze([
  "ignition.spark-plug-oem",
  "lubrication.viscosity",
  "lubrication.api-jaso",
  "electrical.battery-specification",
  "electrical.battery-capacity",
  "brakes.brake-fluid"
]);

function buildReport() {
  const categoryIdsWithEntries = new Set(profile.entries.map(entry => entry.categoryId));
  const productionByCategory = Object.fromEntries(VFR_CATEGORY_IDS.map(categoryId => [
    categoryId,
    profile.entries.filter(entry => entry.categoryId === categoryId).map(entry => entry.id)
  ]));
  const blockedApplicability = Object.entries(conversion.mappings)
    .filter(([, mapping]) => mapping.blockedReasons.some(reason => reason.startsWith("COOLING-") || reason.includes("APPLICABILITY")))
    .map(([fieldId, mapping]) => ({ fieldId, reasons: [...mapping.blockedReasons] }));
  const evidenceFieldIds = acquisition.rawCandidates.map(candidate => candidate.canonicalFieldId);
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-coverage-expansion/v1",
    target: Object.freeze({ profileId: profile.profile.id, catalogVariantKey: profile.motorcycle.applicability.catalogVariantKeys[0], year: 2021, market: "EU" }),
    productionEntriesBefore: 6,
    productionEntriesAfter: profile.entries.length,
    netNewEntries: profile.entries.length - 6,
    categoriesWithEntries: VFR_CATEGORY_IDS.filter(categoryId => categoryIdsWithEntries.has(categoryId)),
    categoriesWithoutEvidence: VFR_CATEGORY_IDS.filter(categoryId => !categoryIdsWithEntries.has(categoryId)),
    vfrTaxonomyCategories: [...VFR_CATEGORY_IDS],
    productionByCategory,
    fieldsPromotedInThisWave: profile.entries.filter(entry => entry.riderServiceCore).map(entry => entry.riderServiceCore.canonicalFieldId).sort(),
    fieldsBlockedByConflict: [],
    fieldsBlockedByApplicability: blockedApplicability,
    fieldsStillMissing: evidenceFieldIds.filter(fieldId => !AUTHORIZED_FIELD_IDS.includes(fieldId) && fieldId !== "cooling.capacity"),
    sourceDocumentsUsed: ["doc.ducati.monster937-2021.owners-manual"],
    currentlyPromotedFields: [...PROMOTED_FIELD_IDS].sort(),
    sourceEvidenceFieldCount: 39,
    canonicalDataInferred: false,
    vfrProfileChanged: false
  });
}

module.exports = Object.freeze({ VFR_CATEGORY_IDS, buildReport });
