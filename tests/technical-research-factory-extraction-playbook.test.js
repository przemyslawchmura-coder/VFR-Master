"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const fz1 = require("../research/data/yamaha-fz1-2d1x-extraction-plan.js");
const vfr = require("../research/data/vfr800-manual-fingerprint.js");

const playbook = factory.createPlaybook();
const artifact = { artifactId: fz1.artifact.id, contentDigest: fz1.EXPECTED_SHA256, mediaType: "application/pdf", byteLength: 5098486 };
const fz1Plan = factory.createModelPlan({ playbook, targetIdentity: "yamaha.fz1.gen2", sourcePublication: "2D1X", artifact, regions: fz1.allowedRegions.map(region => ({ id: region.id, pdfPages: region.pdfPages, sections: region.sections })), fieldTargets: fz1.targetAreas.map(item => item.fieldId), applicability: { required: { model: ["FZ1-N", "FZ1-NA"], modelYear: 2010 }, unresolved: ["market", "abs", "transmission", "equipment", "emissions"] }, budget: { maxRegions: 6, maxRawCandidates: 24 } });
const vfrPlan = factory.createModelPlan({ playbook, targetIdentity: vfr.target, sourcePublication: "VFR800-2002-manual-fingerprint", artifact: { artifactId: "artifact." + "a".repeat(24), contentDigest: "a".repeat(64), mediaType: "application/pdf", byteLength: 638000 }, regions: [...new Map(vfr.blockedFields.map(item => [item.section, { id: item.section.toLowerCase().replace(/[^a-z0-9]+/g, "-"), pdfPages: [item.viewerPage], sections: [item.section] }])).values()], fieldTargets: vfr.blockedFields.map(item => item.canonicalFieldId), applicability: { required: { model: "VFR800 RC46 VTEC", modelYear: 2002 }, unresolved: ["market", "abs", "publicationIdentity"] }, budget: { maxRegions: 12, maxRawCandidates: 48 } });

test("generic playbook contains no motorcycle values and describes VFR and FZ1 plans", () => {
  const serialized = JSON.stringify(playbook);
  assert.equal(serialized.includes("FZ1"), false);
  assert.equal(serialized.includes("VFR"), false);
  assert.equal(fz1Plan.generic, undefined);
  assert.equal(fz1Plan.playbookPolicyId, vfrPlan.playbookPolicyId);
  assert.notEqual(fz1Plan.planId, vfrPlan.planId);
});

test("artifact identity and hash binding are mandatory and fail closed", () => {
  assert.doesNotThrow(() => factory.validatePlanArtifact(fz1Plan, { ...fz1.artifact, id: fz1.artifact.id }));
  assert.throws(() => factory.validatePlanArtifact(fz1Plan, { ...fz1.artifact, id: fz1.artifact.id, contentDigest: "b".repeat(64) }), /identity mismatch/);
  assert.throws(() => factory.createModelPlan({ playbook, targetIdentity: "x", sourcePublication: "x", artifact: { artifactId: "artifact.x" }, regions: [{ id: "r", pdfPages: [1], sections: ["s"] }], fieldTargets: ["f"], applicability: { required: {}, unresolved: [] }, budget: { maxRegions: 1, maxRawCandidates: 1 } }), /contentDigest/);
});

test("applicability, conditional rows and precise provenance remain fail closed", () => {
  assert.equal(playbook.rules.applicability.rejectFlattenedConditions, true);
  assert.equal(playbook.rules.applicability.preserveConditionalRows, true);
  assert.throws(() => factory.validateFutureSourceLocation({ page: 4, section: "TOC", locator: "x" }), /tableOrSubsection/);
  assert.doesNotThrow(() => factory.validateFutureSourceLocation({ page: 4, section: "TOC", locator: "x", tableOrSubsection: "heading", applicabilityStatement: "explicit", unitsContext: "preserve" }));
});

test("model budgets are bounded independently while generic rules remain shared", () => {
  assert.equal(fz1Plan.budget.maxRegions, 6);
  assert.equal(fz1Plan.budget.maxRawCandidates, 24);
  assert.equal(vfrPlan.budget.maxRegions, 12);
  assert.equal(playbook.rules.output.rawOnly, true);
  assert.throws(() => factory.createModelPlan({ playbook, targetIdentity: "x", sourcePublication: "x", artifact, regions: fz1.allowedRegions.map(region => ({ id: region.id, pdfPages: region.pdfPages, sections: region.sections })), fieldTargets: ["f"], applicability: { required: {}, unresolved: [] }, budget: { maxRegions: 2, maxRawCandidates: 2 } }), /exceed budget/);
});

test("existing FZ1 plan remains compatible and this wave creates no downstream records", () => {
  assert.equal(fz1Plan.artifact.contentDigest, fz1.EXPECTED_SHA256);
  assert.deepEqual(fz1Plan.regions.map(item => item.id), fz1.allowedRegions.map(item => item.id));
  assert.equal(fz1Plan.execution, false);
  assert.equal(fz1Plan.rawCandidatesCreated, 0);
  assert.equal(fz1Plan.evidenceCreated, false);
  assert.equal(fz1Plan.productionChanged, false);
  assert.equal(vfr.pageCount, 638);
  assert.equal(vfr.blockedFields.every(item => typeof item.contentInspected === "boolean"), true);
});

test("playbook transition is raw-candidate-only and duplicate handling is deterministic", () => {
  assert.equal(fz1Plan.transition.rawCandidateToEvidence, "OUTSIDE-PLAYBOOK");
  assert.match(playbook.rules.duplicates.semanticIds, /extractionResultId.*candidateId/);
  assert.equal(playbook.rules.duplicates.exactRepeat, "IDEMPOTENT");
  assert.deepEqual(factory.createModelPlan({ playbook, targetIdentity: "same", sourcePublication: "same", artifact, regions: [{ id: "region", pdfPages: [1], sections: ["section"] }], fieldTargets: ["field"], applicability: { required: {}, unresolved: [] }, budget: { maxRegions: 1, maxRawCandidates: 1 } }).planId, factory.createModelPlan({ playbook, targetIdentity: "same", sourcePublication: "same", artifact, regions: [{ id: "region", pdfPages: [1], sections: ["section"] }], fieldTargets: ["field"], applicability: { required: {}, unresolved: [] }, budget: { maxRegions: 1, maxRawCandidates: 1 } }).planId);
});
