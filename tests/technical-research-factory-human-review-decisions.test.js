"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const queueData = require("../research/data/technical-research-factory-review-queue.js");

const fixture = () => queueData.buildFixture();
const input = (entry, decision = "ACCEPT", overrides = {}) => ({ queueEntry: entry, decision, reviewerId: "reviewer.explicit-01", comment: "  Raw NOTE: 3.1 L  ", ...overrides });
function competingEntry(entry) {
  const adapterVersion = "competing-2";
  const extractionResultId = factory.extractionResultId({ batchId: entry.batchId, targetId: entry.targetId, targetWorkId: entry.targetWorkId, sourceWorkItemId: entry.sourceWorkItemId, attemptId: entry.attemptId, prospectId: entry.prospectId, artifactId: entry.artifactId, adapterId: entry.adapterId, adapterVersion, operation: factory.EXTRACTION_OPERATION });
  const candidate = { ...entry.candidate, extractionResultId, adapterVersion, rawValue: "9.9" };
  candidate.id = factory.candidateId({ extractionResultId, artifactId: candidate.artifactId, targetId: candidate.targetId, fieldId: candidate.fieldId, sourceLocation: candidate.sourceLocation, ordinal: candidate.ordinal, adapterId: candidate.adapterId, adapterVersion });
  const identity = { extractionResultId, candidateId: candidate.id };
  return factory.validateReviewQueueEntry({ ...entry, id: factory.reviewQueueEntryId(identity), extractionResultId, candidateId: candidate.id, adapterVersion, candidate });
}

test("Human Review Decision contracts are versioned and vocabulary is closed", () => {
  assert.equal(factory.REVIEW_DECISION_SCHEMA_VERSION, 1);
  assert.deepEqual(factory.REVIEW_DECISIONS, ["ACCEPT", "REJECT", "NEEDS-MORE-REVIEW"]);
  assert.equal(typeof factory.buildReviewDecisions, "function");
  assert.throws(() => factory.validateReviewDecisionSet({ schemaVersion: 99 }), /schemaVersion/);
  assert.throws(() => factory.buildReviewDecisions([input(fixture().queue.entries[0], "PROMOTE")]), /invalid/);
});

for (const decision of ["ACCEPT", "REJECT", "NEEDS-MORE-REVIEW"]) {
  test(`valid queue entry can receive ${decision}`, () => {
    const entry = fixture().queue.entries[0];
    const record = factory.buildReviewDecisions([input(entry, decision)]).decisions[0];
    assert.equal(record.decision, decision);
    assert.equal(record.queueEntryId, entry.id);
  });
}

test("decision IDs and repeated execution are deterministic", () => {
  const entry = fixture().queue.entries[0];
  const first = factory.buildReviewDecisions([input(entry)]);
  const second = factory.buildReviewDecisions([input(entry)]);
  assert.deepEqual(second, first);
  assert.equal(first.decisions[0].id, factory.reviewDecisionId({ queueEntryId: entry.id, decision: "ACCEPT", reviewerId: "reviewer.explicit-01" }));
});

test("reviewer identity and comment are preserved exactly while comment is identity-neutral", () => {
  const entry = fixture().queue.entries[0];
  const withComment = factory.buildReviewDecisions([input(entry)]).decisions[0];
  const withoutComment = factory.buildReviewDecisions([input(entry, "ACCEPT", { comment: null })]).decisions[0];
  assert.equal(withComment.reviewerId, "reviewer.explicit-01");
  assert.equal(withComment.comment, "  Raw NOTE: 3.1 L  ");
  assert.equal(withComment.id, withoutComment.id);
});

test("exact duplicate decisions are idempotent", () => {
  const entry = fixture().queue.entries[0];
  assert.equal(factory.buildReviewDecisions([input(entry), input(entry)]).decisions.length, 1);
});

test("permuted input order produces identical deterministic output", () => {
  const entries = fixture().queue.entries;
  const inputs = [input(entries[0], "ACCEPT"), input(entries[1], "REJECT", { reviewerId: "reviewer.explicit-02", comment: null })];
  const first = factory.buildReviewDecisions(inputs);
  const second = factory.buildReviewDecisions([...inputs].reverse());
  assert.deepEqual(second, first);
  assert.deepEqual(first.decisions.map(item => item.id), [...first.decisions.map(item => item.id)].sort());
});

test("conflicting decisions for one queue entry fail closed", () => {
  const entry = fixture().queue.entries[0];
  assert.throws(() => factory.buildReviewDecisions([input(entry, "ACCEPT"), input(entry, "REJECT")]), /conflicting/);
});

test("same decision with inconsistent reviewer metadata fails closed", () => {
  const entry = fixture().queue.entries[0];
  assert.throws(() => factory.buildReviewDecisions([input(entry), input(entry, "ACCEPT", { comment: "different" })]), /inconsistent/);
  assert.throws(() => factory.buildReviewDecisions([input(entry), input(entry, "ACCEPT", { reviewerId: "other" })]), /inconsistent/);
});

test("malformed queue entries and NOT-ELIGIBLE records cannot receive decisions", () => {
  const built = fixture();
  const entry = built.queue.entries[0];
  assert.throws(() => factory.buildReviewDecisions([input({ ...entry, id: "review-queue-entry.000000000000000000000000" })]), /unstable/);
  const ineligible = factory.buildReviewQueue([factory.validateExtractionResult({ ...built.produced, disposition: "NO-CANDIDATES", candidates: [] })]).ineligible[0];
  assert.throws(() => factory.buildReviewDecisions([input(ineligible)]), /schemaVersion|ReviewQueueEntry/);
});

test("missing or mismatched queue provenance is rejected rather than manufactured", () => {
  const entry = fixture().queue.entries[0];
  const { artifactId, ...missing } = entry;
  assert.throws(() => factory.buildReviewDecisions([input(missing)]), /artifactId/);
  assert.throws(() => factory.buildReviewDecisions([input({ ...entry, candidateId: "extraction-candidate.000000000000000000000000" })]), /candidate identity/);
  assert.throws(() => factory.buildReviewDecisions([input({ ...entry, targetId: "target.forged" })]), /provenance/);
});

test("decision records retain exact queue candidate extraction and acquisition references", () => {
  const entry = fixture().queue.entries[0];
  const record = factory.buildReviewDecisions([input(entry)]).decisions[0];
  ["extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert.equal(record[field], entry[field]));
});

test("raw candidate queue entry and upstream extraction remain unchanged", () => {
  const built = fixture();
  const entry = built.queue.entries[0];
  const queueBefore = factory.orchestrationJson.canonicalSerialize(built.queue);
  const extractionBefore = factory.orchestrationJson.canonicalSerialize(built.produced);
  const candidateBefore = factory.orchestrationJson.canonicalSerialize(entry.candidate);
  factory.buildReviewDecisions([input(entry)]);
  assert.equal(factory.orchestrationJson.canonicalSerialize(built.queue), queueBefore);
  assert.equal(factory.orchestrationJson.canonicalSerialize(built.produced), extractionBefore);
  assert.equal(factory.orchestrationJson.canonicalSerialize(entry.candidate), candidateBefore);
});

test("decision records and sets are deeply immutable", () => {
  const result = factory.buildReviewDecisions([input(fixture().queue.entries[0])]);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.decisions[0]), true);
  assert.throws(() => { result.decisions[0].decision = "REJECT"; }, TypeError);
});

test("ACCEPT remains pre-evidence and REJECT remains candidate-local", () => {
  const entries = fixture().queue.entries;
  const result = factory.buildReviewDecisions([input(entries[0], "ACCEPT"), input(entries[1], "REJECT")]);
  const serialized = JSON.stringify(result);
  assert.equal(/EvidenceRecord|verified|production-ready|researched-no-evidence/i.test(serialized), false);
  assert.equal(entries[1].state, "QUEUED");
});

test("NEEDS-MORE-REVIEW triggers no routing scheduling extraction or retry", () => {
  const built = fixture();
  const before = factory.orchestrationJson.canonicalSerialize(built.fixture.acquired.snapshot);
  const result = factory.buildReviewDecisions([input(built.queue.entries[0], "NEEDS-MORE-REVIEW")]);
  assert.equal(result.decisions[0].decision, "NEEDS-MORE-REVIEW");
  assert.equal(factory.orchestrationJson.canonicalSerialize(built.fixture.acquired.snapshot), before);
  assert.equal(built.fixture.acquired.snapshot.sourceWorkItems[0].attemptsUsed, 1);
});

test("multiple accepted conflicting raw candidates coexist without resolution", () => {
  const first = fixture().queue.entries[0];
  const competing = competingEntry(first);
  const result = factory.buildReviewDecisions([input(first, "ACCEPT"), input(competing, "ACCEPT")]);
  assert.equal(result.decisions.length, 2);
  assert.equal(first.candidate.fieldId, competing.candidate.fieldId);
  assert.notEqual(first.candidate.rawValue, competing.candidate.rawValue);
  assert.equal(Object.prototype.hasOwnProperty.call(result, "resolvedValue"), false);
});

test("forward-layer fields and APIs are rejected or absent", () => {
  const entry = fixture().queue.entries[0];
  assert.throws(() => factory.buildReviewDecisions([{ ...input(entry), normalizedValue: "3.1 l" }]), /unsupported/);
  const result = factory.buildReviewDecisions([input(entry)]);
  assert.throws(() => factory.validateReviewDecision({ ...result.decisions[0], evidence: {} }), /unsupported/);
  ["promoteDecision", "decisionToEvidence", "acceptIntoProfile", "verifyCandidate", "changeDecision", "editDecision", "resolveConflict", "persistDecisions"].forEach(name => assert.equal(Object.prototype.hasOwnProperty.call(factory, name), false));
});

test("decision construction adds no Orchestrator events and consumes no retry", () => {
  const built = fixture();
  const eventsBefore = factory.orchestrationJson.canonicalSerialize(built.fixture.acquired.events);
  factory.buildReviewDecisions([input(built.queue.entries[0], "REJECT")]);
  assert.equal(factory.orchestrationJson.canonicalSerialize(built.fixture.acquired.events), eventsBefore);
  assert.equal(factory.EVENT_TYPES.some(type => type.includes("review") || type.includes("decision")), false);
  assert.equal(built.fixture.acquired.snapshot.sourceWorkItems[0].attemptsUsed, 1);
});

test("Human Review Decision modules remain outside production runtime", () => {
  const root = path.resolve(__dirname, "..");
  const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /review-decision|review-decisions/));
  assert.equal(require("../js/app-release.js").currentVersion, "0.3.0");
});

test("Human Review Decisions report is deterministic and preserves boundaries", () => {
  const report = require("../research/data/technical-research-factory-human-review-decisions.js").buildReport;
  assert.deepEqual(report(), report());
  assert.equal(report().safety.evidenceAdded, false);
  assert.equal(report().safety.researchedNoEvidenceAdded, false);
  assert.equal(report().safety.persistenceImplemented, false);
  assert.equal(report().safety.orchestratorEventsAdded, 0);
});
