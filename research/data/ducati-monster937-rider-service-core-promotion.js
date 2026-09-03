// Bounded production promotion report for the existing Ducati Rider Service Core wave.
"use strict";

const validator = require("../../js/technical/technical-profile-validator.js");
const profile = require("../../data/technical/ducati/monster937/profile-2021.js");
const readiness = require("./ducati-monster937-rider-service-core-promotion-readiness.js");

function buildReport() {
  const read = readiness.buildReport();
  const validation = validator.validate(profile);
  const promoted = read.outcomes.filter(item => item.readinessState === "PROMOTION-READY");
  const byStructure = type => promoted.filter(item => item.productionRecord.structureType === type).length;
  if (!validation.valid) throw new Error(`Ducati profile validation failed: ${JSON.stringify(validation.errors)}`);
  if (promoted.length !== 39 || read.alreadyCovered !== 0 || read.productionRepresentationBlocked !== 0) throw new Error("Ducati promotion is not clean");
  return Object.freeze({
    schemaVersion: "revlog-ducati-monster937-rider-service-core-promotion/v1",
    readinessInputs: read.processedInputsReceived,
    promotionReady: read.promotionReady,
    alreadyCovered: read.alreadyCovered,
    blocked: read.productionRepresentationBlocked,
    blockerReasons: Object.freeze(Object.fromEntries(read.outcomes.flatMap(item => item.readinessReasons).sort().map(reason => [reason, read.outcomes.filter(item => item.readinessReasons.includes(reason)).length]))),
    promotionExecuted: true,
    newlyPromoted: promoted.length,
    skippedDuplicates: read.alreadyCovered,
    resultingDucatiProductionEntryCount: profile.entries.length,
    structuredCounts: Object.freeze({ maintenance: byStructure("maintenance"), fuse: byStructure("fuse"), lighting: byStructure("lighting"), practicalTorque: byStructure("practical-torque"), consumableReference: byStructure("consumable-reference"), tirePressure: byStructure("tire-pressure") }),
    pendingNeedsMoreReviewExcluded: read.excludedNeedsMoreReview,
    coolingCapacity: read.coolingCapacity,
    provenancePreserved: promoted.every(item => item.productionRecord.provenance.sourceId && item.productionRecord.provenance.sourceLocation),
    applicabilityPreserved: promoted.every(item => item.productionRecord.applicability.modelYear === 2021 && item.productionRecord.applicability.market === "EU"),
    existingSixValuesChanged: false,
    vfrChanged: false,
    evidenceRowsCreated: 0,
    serviceCoreCoverageChanged: false,
    validatorResult: validation,
    productionEntryIds: profile.entries.map(entry => entry.id),
    audit: Object.freeze({ classification: "PROMOTED-BOUNDED", conclusion: "The 39 existing Ducati Rider Service Core ACCEPT/processed records passed readiness and were materialized as citation-backed production entries. Deferred candidates and cooling remain excluded." }),
    exactNextTask: "Keep the five deferred candidates and cooling exclusion; do not broaden Ducati promotion without a separate bounded authorization."
  });
}

module.exports = Object.freeze({ buildReport });
