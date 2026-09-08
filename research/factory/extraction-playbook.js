// NON-PRODUCTION generic extraction-planning policy. It creates no candidates.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const extraction = require("./extraction-contracts.js");

const PLAYBOOK_SCHEMA_VERSION = "revlog-extraction-playbook/v1";
const DEFAULT_RULES = Object.freeze({
  sourceBinding: Object.freeze({ requireArtifactId: true, requireContentDigest: true, requireMediaType: true, requireByteLength: true }),
  provenance: Object.freeze({ required: Object.freeze(["sourceLocation.page", "sourceLocation.section", "sourceLocation.locator", "applicability", "context"]), requireTableOrSubsection: true, requireUnitsContext: true }),
  applicability: Object.freeze({ failClosed: true, preserveConditionalRows: true, rejectFlattenedConditions: true, requireModelYearScope: true }),
  output: Object.freeze({ rawOnly: true, evidence: false, production: false, reviewQueue: false }),
  duplicates: Object.freeze({ semanticIds: "factory.extractionResultId and factory.candidateId", exactRepeat: "IDEMPOTENT", conflictingPayload: "REJECT" })
});
const DEFAULT_STOP_CONDITIONS = Object.freeze(["artifact identity mismatch", "source/document identity mismatch", "unresolved applicability", "missing precise provenance", "budget exhausted"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");

function validateRules(rules) {
  assert(rules && rules.sourceBinding?.requireArtifactId && rules.sourceBinding?.requireContentDigest, "playbook source binding is incomplete");
  assert(rules.applicability?.failClosed === true && rules.applicability.preserveConditionalRows === true && rules.applicability.rejectFlattenedConditions === true, "playbook applicability must fail closed");
  assert(rules.provenance?.requireTableOrSubsection === true && rules.provenance?.requireUnitsContext === true, "playbook provenance is incomplete");
  assert(rules.output?.rawOnly === true && rules.output.evidence === false && rules.output.production === false && rules.output.reviewQueue === false, "playbook output boundary is invalid");
}

function createPlaybook(overrides = {}) {
  const rules = json.immutableClone({ ...DEFAULT_RULES, ...overrides.rules, sourceBinding: { ...DEFAULT_RULES.sourceBinding, ...(overrides.rules?.sourceBinding || {}) }, provenance: { ...DEFAULT_RULES.provenance, ...(overrides.rules?.provenance || {}) }, applicability: { ...DEFAULT_RULES.applicability, ...(overrides.rules?.applicability || {}) }, output: { ...DEFAULT_RULES.output, ...(overrides.rules?.output || {}) }, duplicates: { ...DEFAULT_RULES.duplicates, ...(overrides.rules?.duplicates || {}) } });
  validateRules(rules);
  const playbook = { schemaVersion: PLAYBOOK_SCHEMA_VERSION, policyId: overrides.policyId || "generic-extraction-policy-v1", rules, stopConditions: [...(overrides.stopConditions || DEFAULT_STOP_CONDITIONS)], generic: true };
  assert(playbook.stopConditions.length > 0, "playbook stop conditions are required");
  json.assertJsonSafe(playbook);
  return Object.freeze(playbook);
}

function validateArtifactBinding(binding) {
  assert(binding && typeof binding.artifactId === "string" && binding.artifactId.startsWith("artifact."), "artifact binding requires artifactId");
  assert(typeof binding.contentDigest === "string" && /^[a-f0-9]{64}$/.test(binding.contentDigest), "artifact binding requires contentDigest");
  assert(typeof binding.mediaType === "string" && binding.mediaType.length > 0, "artifact binding requires mediaType");
  assert(Number.isInteger(binding.byteLength) && binding.byteLength > 0, "artifact binding requires byteLength");
  return Object.freeze(json.immutableClone(binding));
}

function validateRegion(region) {
  assert(region && typeof region.id === "string" && region.id.length > 0, "extraction region id is required");
  assert(Array.isArray(region.pdfPages) && region.pdfPages.length > 0 && region.pdfPages.every(page => Number.isInteger(page) && page > 0), "extraction region pages are invalid");
  assert(Array.isArray(region.sections) && region.sections.length > 0 && region.sections.every(section => typeof section === "string" && section.length > 0), "extraction region sections are invalid");
  return Object.freeze(json.immutableClone(region));
}

function createModelPlan({ playbook, targetIdentity, artifact, regions, fieldTargets, applicability, budget, sourcePublication }) {
  assert(playbook?.schemaVersion === PLAYBOOK_SCHEMA_VERSION, "generic extraction playbook is required");
  const boundArtifact = validateArtifactBinding(artifact);
  assert(typeof targetIdentity === "string" && targetIdentity.length > 0, "model extraction target identity is required");
  assert(typeof sourcePublication === "string" && sourcePublication.length > 0, "source publication identity is required");
  assert(Array.isArray(regions) && regions.length > 0, "model extraction regions are required");
  const validatedRegions = regions.map(validateRegion);
  assert(Array.isArray(fieldTargets) && fieldTargets.length > 0 && fieldTargets.every(item => typeof item === "string" && item.length > 0), "model field targets are required");
  assert(applicability && applicability.required && Array.isArray(applicability.unresolved), "model applicability boundary is required");
  assert(budget && Number.isInteger(budget.maxRegions) && budget.maxRegions > 0 && Number.isInteger(budget.maxRawCandidates) && budget.maxRawCandidates > 0, "model extraction budget is required");
  assert(validatedRegions.length <= budget.maxRegions, "model regions exceed budget");
  const plan = {
    schemaVersion: "revlog-model-extraction-plan/v1",
    playbookPolicyId: playbook.policyId,
    targetIdentity,
    sourcePublication,
    artifact: boundArtifact,
    regions: validatedRegions,
    fieldTargets: [...fieldTargets].sort(),
    applicability: json.immutableClone(applicability),
    budget: json.immutableClone(budget),
    provenance: json.immutableClone(playbook.rules.provenance),
    transition: Object.freeze({ operation: extraction.EXTRACTION_OPERATION, plannedToRawCandidate: "ALLOW ONLY AFTER all applicability/provenance/hash gates pass", rawCandidateToEvidence: "OUTSIDE-PLAYBOOK" }),
    execution: false,
    rawCandidatesCreated: 0,
    evidenceCreated: false,
    productionChanged: false
  };
  json.assertJsonSafe(plan);
  return Object.freeze({ ...plan, planId: `extraction-plan.${digest(plan).slice(0, 24)}` });
}

function validatePlanArtifact(plan, artifact) {
  validateArtifactBinding(plan.artifact);
  assertArtifactEqual(plan.artifact, artifact);
  return true;
}

function assertArtifactEqual(expected, actual) {
  assert(actual && expected.artifactId === actual.id && expected.contentDigest === actual.contentDigest && expected.mediaType === actual.mediaType && expected.byteLength === actual.byteLength, "extraction playbook artifact identity mismatch");
  return true;
}

function validateFutureSourceLocation(location) {
  assert(location && Number.isInteger(location.page) && location.page > 0, "future provenance requires page");
  assert(typeof location.section === "string" && location.section.length > 0, "future provenance requires section");
  assert(typeof location.locator === "string" && location.locator.length > 0, "future provenance requires locator");
  assert(typeof location.tableOrSubsection === "string" && location.tableOrSubsection.length > 0, "future provenance requires tableOrSubsection");
  return true;
}

module.exports = Object.freeze({ PLAYBOOK_SCHEMA_VERSION, DEFAULT_RULES, DEFAULT_STOP_CONDITIONS, createPlaybook, validateArtifactBinding, validateRegion, createModelPlan, validatePlanArtifact, assertArtifactEqual, validateFutureSourceLocation });
