"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const factory = require("../research/factory/index.js");
const acquisition = require("../research/data/yamaha-fz1-2d1x-owner-manual-acquisition.js");
const fz1 = require("../research/data/yamaha-fz1-2d1x-extraction-plan.js");

const playbook = factory.createPlaybook();
const fz1ModelPlan = factory.createModelPlan({
  playbook,
  targetIdentity: "yamaha.fz1.gen2",
  sourcePublication: "2D1X",
  artifact: { artifactId: fz1.artifact.id, contentDigest: fz1.EXPECTED_SHA256, mediaType: "application/pdf", byteLength: 5098486 },
  regions: fz1.allowedRegions.map(region => ({ id: region.id, pdfPages: region.pdfPages, sections: region.sections })),
  fieldTargets: fz1.targetAreas.map(item => item.fieldId),
  applicability: { required: { model: ["FZ1-N", "FZ1-NA"], modelYear: 2010, bodyStyle: "naked" }, unresolved: ["market", "abs", "transmission", "equipment", "emissions"] },
  budget: { maxRegions: 6, maxRawCandidates: 24 }
});

function syntheticArtifact(bytes = Buffer.from("%PDF-synthetic-bridge\n", "utf8")) {
  const contentDigest = crypto.createHash("sha256").update(bytes).digest("hex");
  const identity = { prospectId: "prospect.synthetic.owner", attemptId: "attempt.synthetic.000000000000000000", mediaType: "application/pdf", contentDigest, locator: "https://official.example/manual.pdf" };
  return { bytes, artifact: factory.validateArtifact({ id: factory.artifactId(identity), ...identity, byteLength: bytes.length, originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "LOCAL-FIXTURE", metadata: { fixture: true } }) };
}

function derivedFixture() {
  const parent = syntheticArtifact();
  return { ...parent, derived: factory.createDerivedContent({ parentArtifact: parent.artifact, parentBytes: parent.bytes, transformerId: "factory.synthetic.pdf-text", transformerVersion: "1", region: { id: "region-1", pdfPages: [2] }, approvedRegionIds: ["region-1"], content: "structural fixture", mediaType: "text/plain" }) };
}

test("raw extraction readiness is separate from strict downstream readiness", () => {
  const result = factory.evaluateRawExtractionReadiness({ playbook, modelPlan: fz1ModelPlan, sourceProspect: acquisition.prospect, acquiredArtifact: fz1.artifact });
  assert.equal(result.passed, true);
  assert.equal(result.classification, "RAW-EXTRACTION-READY");
  assert.equal(factory.evaluateReadiness(acquisition.target, acquisition.prospect).passed, false);
  assert.deepEqual(result.unresolvedApplicability, ["market", "abs", "transmission", "equipment", "emissions"]);
  assert.deepEqual(result.downstream, { evidenceReady: false, promotionReady: false, productionReady: false });
});

test("raw readiness blocks when unresolved applicability cannot be carried forward", () => {
  const broken = { ...fz1ModelPlan, applicability: { required: fz1ModelPlan.applicability.required, unresolved: null } };
  const malformed = factory.evaluateRawExtractionReadiness({ playbook, modelPlan: broken, sourceProspect: acquisition.prospect, acquiredArtifact: fz1.artifact });
  assert.equal(malformed.passed, false);
  const blocked = factory.evaluateRawExtractionReadiness({ playbook, modelPlan: { ...fz1ModelPlan, applicability: { required: fz1ModelPlan.applicability.required, unresolved: [null] } }, sourceProspect: acquisition.prospect, acquiredArtifact: fz1.artifact });
  assert.equal(blocked.passed, false);
});

test("FZ1 plan is compatible without widening scope or executing", () => {
  const result = factory.evaluateRawExtractionReadiness({ playbook, modelPlan: fz1ModelPlan, sourceProspect: acquisition.prospect, acquiredArtifact: fz1.artifact });
  assert.equal(result.passed, true);
  assert.equal(fz1ModelPlan.regions.length, 6);
  assert.equal(fz1ModelPlan.budget.maxRawCandidates, 24);
  assert.equal(fz1PlanHasNoExecution(fz1), true);
  assert.equal(fz1.buildPlan().serviceManualLeadTouched, false);
  assert.equal(fz1ModelPlan.applicability.required.model.includes("FZ1-S"), false);
  assert.equal(fz1ModelPlan.applicability.required.modelYear, 2010);
});

function fz1PlanHasNoExecution(planModule) { return planModule.buildPlan().execution === false && planModule.buildPlan().technicalValuesExtracted === false; }

test("binary parent produces a deterministic, parent-bound derived content envelope", () => {
  const first = derivedFixture();
  const second = derivedFixture();
  assert.equal(first.derived.id, second.derived.id);
  assert.equal(first.derived.parentArtifactId, first.artifact.id);
  assert.equal(first.derived.parentContentDigest, first.artifact.contentDigest);
  assert.equal(first.derived.parentMediaType, "application/pdf");
  assert.equal(first.derived.parentByteLength, first.bytes.length);
  assert.equal(factory.toExtractionEnvelope(first.derived).content, "structural fixture");
  assert.doesNotThrow(() => factory.assertBoundToParent(first.derived, first.artifact));
});

test("parent and derived integrity changes fail closed", () => {
  const fixture = derivedFixture();
  assert.throws(() => factory.validateParentBytes(fixture.artifact, Buffer.from("%PDF-changed", "utf8")), /digest mismatch/);
  assert.throws(() => factory.assertBoundToParent({ ...fixture.derived, parentContentDigest: "a".repeat(64) }, fixture.artifact), /parent binding mismatch/);
  assert.throws(() => factory.validateDerivedContent({ ...fixture.derived, content: "changed" }), /content identity mismatch/);
  assert.throws(() => factory.validateDerivedContent({ ...fixture.derived, id: "artifact." + "a".repeat(24) }), /id is unstable/);
  assert.throws(() => factory.createDerivedContent({ parentArtifact: fixture.artifact, parentBytes: fixture.bytes, transformerId: "factory.synthetic.pdf-text", transformerVersion: "1", region: { id: "other", pdfPages: [2] }, approvedRegionIds: ["region-1"], content: "x" }), /not approved/);
});

test("detached UTF-8 content cannot impersonate a PDF-derived envelope", () => {
  assert.throws(() => factory.validateDerivedContent({ schemaVersion: 1, id: "artifact." + "a".repeat(24), mediaType: "text/plain", byteLength: 1, contentDigest: "a".repeat(64), contentEncoding: "utf8", content: "x" }), /prospectId is undefined/);
});

test("transformer and region identity participate in deterministic derived identity", () => {
  const fixture = derivedFixture();
  const otherVersion = factory.createDerivedContent({ parentArtifact: fixture.artifact, parentBytes: fixture.bytes, transformerId: "factory.synthetic.pdf-text", transformerVersion: "2", region: { id: "region-1", pdfPages: [2] }, approvedRegionIds: ["region-1"], content: "structural fixture" });
  assert.notEqual(fixture.derived.id, otherVersion.id);
  assert.equal(fixture.derived.region.pdfPages[0], 2);
  assert.equal(fixture.derived.metadata.parentArtifactId, fixture.artifact.id);
});

test("bridge is usable by the extraction agent without creating records", () => {
  const fixture = derivedFixture();
  const adapter = { schemaVersion: 1, adapterId: "factory.synthetic.no-op", adapterVersion: "1", supportedMediaTypes: ["text/plain"], supportedOperations: [factory.EXTRACTION_OPERATION], deterministic: true, localOnly: true, execute: input => ({ disposition: "NO-CANDIDATES", candidates: [], observations: [{ type: "NO-CANDIDATES", detailCode: "STRUCTURAL-ONLY-FIXTURE", metadata: { region: input.artifact.id } }] }) };
  const researchTarget = acquisition.target;
  const sourceProspect = factory.validateSourceProspect({ ...acquisition.prospect, id: fixture.artifact.prospectId, targetId: researchTarget.id });
  const modelPlan = factory.createModelPlan({ playbook, targetIdentity: "yamaha.fz1.gen2", sourcePublication: "2D1X", artifact: { artifactId: fixture.artifact.id, contentDigest: fixture.artifact.contentDigest, mediaType: fixture.artifact.mediaType, byteLength: fixture.artifact.byteLength }, regions: [{ id: "region-1", pdfPages: [2], sections: ["structure"] }], fieldTargets: ["engine-oil-grade"], applicability: { required: { modelYear: "fixture" }, unresolved: ["modelYear"] }, budget: { maxRegions: 1, maxRawCandidates: 1 } });
  const result = factory.extractRawCandidatesFromAcquiredSource({
    context: { batchId: "batch.synthetic", targetId: researchTarget.id, targetWorkId: "target-work.synthetic", sourceWorkItemId: "source-work.synthetic", attemptId: fixture.artifact.attemptId, prospectId: fixture.artifact.prospectId },
    researchTarget,
    sourceProspect,
    modelPlan,
    acquisitionArtifact: fixture.artifact,
    derivedContentEnvelope: fixture.derived,
    adapter
  });
  assert.equal(result.disposition, "NO-CANDIDATES");
  assert.equal(result.candidates.length, 0);
  assert.equal(result.artifactId, fixture.derived.id);
});
