// NON-PRODUCTION deterministic Service Core GapPlan generator.
"use strict";

const pipeline = require("../lib/batch-research-pipeline.js");
const contracts = require("./contracts.js");

const SAFETY_CRITICAL = new Set([
  "lubrication.capacity-drain", "lubrication.capacity-filter", "cooling.capacity",
  "ignition.plug-gap", "valve_train.intake-clearance", "valve_train.exhaust-clearance",
  "final_drive.chain-slack", "brakes.brake-fluid", "tires_wheels.solo-pressures",
  "tires_wheels.loaded-pressures", "torques.front-axle", "torques.rear-axle"
]);

function generateGapPlan(target, evidence = [], history = {}) {
  const canonicalTarget = contracts.validateResearchTarget(target);
  const gaps = pipeline.calculateGaps({ catalogVariantKey: canonicalTarget.catalogVariantKey }, evidence);
  const fields = status => gaps.filter(row => row.status === status).map(row => row.canonicalFieldId);
  const remainingFields = gaps.filter(row => row.status !== "evidence-found").map(row => row.canonicalFieldId);
  return contracts.validateGapPlan({
    schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
    id: `${canonicalTarget.id}.gap-plan`,
    targetId: canonicalTarget.id,
    startingCoverage: { verified: gaps.filter(row => row.status === "evidence-found").length, total: pipeline.serviceCoreFields.length },
    remainingFields,
    safetyCriticalRemainingFields: remainingFields.filter(field => SAFETY_CRITICAL.has(field)),
    researchedNoEvidenceFields: fields("researched-no-evidence"),
    conflictedFields: fields("conflicting"),
    attemptedSourceClasses: history.attemptedSourceClasses || [],
    sourceClassRelevance: history.sourceClassRelevance || {},
    expectedMarginalOpportunity: history.expectedMarginalOpportunity || "UNKNOWN"
  }, pipeline.serviceCoreFields);
}

module.exports = Object.freeze({ SAFETY_CRITICAL, generateGapPlan });
