"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");

const identity = Object.freeze({ batchId: "batch.fixture", targetId: "target.fixture", targetWorkId: "target-work.fixture", sourceWorkItemId: "source-work.fixture", attemptId: "attempt.fixture", prospectId: "prospect.fixture", artifactId: "artifact.fixture", adapterId: "adapter.fixture", adapterVersion: "1" });
function makePacket(overrides = {}) {
  const extractionResultId = factory.extractionResultId({ ...identity, operation: factory.EXTRACTION_OPERATION });
  const candidateBase = { schemaVersion: 1, ...identity, extractionResultId, fieldId: "lubrication.oil-specification", rawValue: "SAE 10W-40", rawUnit: null, sourceLocation: { page: 12, section: "Engine oil", locator: "line:4" }, extractionMethod: "SYNTHETIC-EXACT", applicability: { scope: "fixture" }, context: { condition: "explicit" }, ordinal: 1 };
  const candidate = { ...candidateBase, id: factory.candidateId({ extractionResultId, artifactId: identity.artifactId, targetId: identity.targetId, fieldId: candidateBase.fieldId, sourceLocation: candidateBase.sourceLocation, ordinal: candidateBase.ordinal, adapterId: identity.adapterId, adapterVersion: identity.adapterVersion }) };
  const queueEntryId = factory.reviewQueueEntryId({ extractionResultId, candidateId: candidate.id });
  const decisionId = factory.reviewDecisionId({ queueEntryId, decision: "ACCEPT", reviewerId: "reviewer.fixture" });
  const processingRecordId = factory.evidenceProcessingId({ decisionId, queueEntryId, state: "ACCEPTED-FOR-PROCESSING" });
  const packet = { schemaVersion: 1, id: "placeholder", targetIdentity: { state: "KNOWN", id: identity.targetId, catalogVariantKey: "fixture.variant", model: "Fixture", year: 2020, market: "EU", equipment: "standard" }, sourceIdentity: { sourceId: "source.fixture", prospectId: identity.prospectId, documentId: "document.fixture", authority: "Fixture Authority", tier: "A", officialPath: "https://official.example/fixture" }, reviewQueueEntryId: queueEntryId, humanReviewDecisionId: decisionId, evidenceProcessingRecordId: processingRecordId, canonicalFieldId: candidate.fieldId, rawValue: candidate.rawValue, rawUnit: candidate.rawUnit, provenance: { candidateId: candidate.id, extractionResultId, artifactId: identity.artifactId, sourceLocation: candidate.sourceLocation, extractionMethod: candidate.extractionMethod }, applicability: { modelYear: "KNOWN", market: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "SUFFICIENT" }, processingState: "ACCEPTED-FOR-PROCESSING", humanReviewDecision: "ACCEPT", unresolvedConflict: false, ...overrides };
  packet.id = factory.promotionCandidateId(packet);
  return packet;
}

test("clean accepted candidate is promotion-ready", () => {
  const result = factory.buildPromotionReadiness(makePacket());
  assert.equal(result.state, "PROMOTION-READY");
  assert.equal(result.passed, true);
  assert.deepEqual(result.reasons, []);
});

test("unresolved conflict and non-accepted processing states fail closed", () => {
  const conflict = factory.buildPromotionReadiness(makePacket({ unresolvedConflict: true }));
  assert.equal(conflict.state, "BLOCKED");
  assert.ok(conflict.reasons.includes("noUnresolvedConflict"));
  for (const processingState of ["CANNOT-ADVANCE", "REJECTED-CANDIDATE", "NEEDS-MORE-REVIEW", "INELIGIBLE"]) {
    const result = factory.buildPromotionReadiness(makePacket({ processingState }));
    assert.equal(result.state, "BLOCKED");
    assert.ok(result.reasons.includes("processingAccepted"));
  }
});

test("missing provenance and insufficient applicability fail closed", () => {
  const missing = makePacket({ provenance: { candidateId: null, extractionResultId: null, artifactId: null, sourceLocation: null, extractionMethod: null } });
  const missingResult = factory.buildPromotionReadiness(missing);
  assert.equal(missingResult.state, "BLOCKED");
  assert.ok(missingResult.reasons.includes("provenanceComplete"));
  const insufficient = makePacket({ applicability: { modelYear: "KNOWN", market: "UNKNOWN", equipment: "INSUFFICIENT", abs: "KNOWN", transmission: "KNOWN", context: "UNKNOWN" } });
  const insufficientResult = factory.buildPromotionReadiness(insufficient);
  assert.equal(insufficientResult.state, "BLOCKED");
  assert.ok(insufficientResult.reasons.includes("marketKnown"));
  assert.ok(insufficientResult.reasons.includes("equipmentSufficient"));
  assert.ok(insufficientResult.reasons.includes("rawContextSufficient"));
});

test("raw payload and inputs remain immutable and exact", () => {
  const packet = makePacket();
  const before = JSON.stringify(packet);
  const result = factory.buildPromotionReadiness(packet);
  assert.equal(JSON.stringify(packet), before);
  assert.equal(result.packet.rawValue, "SAE 10W-40");
  assert.equal(result.packet.rawUnit, null);
  assert.deepEqual(result.packet.provenance.sourceLocation, { page: 12, section: "Engine oil", locator: "line:4" });
  assert.equal(Object.isFrozen(result.packet), true);
});

test("promotion IDs, order and results are deterministic", () => {
  const first = makePacket();
  const second = makePacket();
  assert.equal(first.id, second.id);
  assert.deepEqual(factory.buildPromotionReadiness(first), factory.buildPromotionReadiness(second));
  assert.equal(factory.promotionCandidateId(first), first.id);
});
