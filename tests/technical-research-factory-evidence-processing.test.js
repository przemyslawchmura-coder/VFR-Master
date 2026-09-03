"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const queueData = require("../research/data/technical-research-factory-review-queue.js");

const fixture = () => queueData.buildFixture();
const decision = (entry, value = "ACCEPT", overrides = {}) => ({ ...factory.buildReviewDecisions([{ queueEntry: entry, decision: value, reviewerId: "reviewer.synthetic" }]).decisions[0], ...overrides });
const process = (entries, decisions) => factory.buildEvidenceProcessing({ queueEntries: entries, decisions });
const alteredEntry = (entry, candidatePatch) => {
  const candidate = { ...entry.candidate, ...candidatePatch };
  candidate.id = factory.candidateId({ extractionResultId: candidate.extractionResultId, artifactId: candidate.artifactId, targetId: candidate.targetId, fieldId: candidate.fieldId, sourceLocation: candidate.sourceLocation, ordinal: candidate.ordinal, adapterId: candidate.adapterId, adapterVersion: candidate.adapterVersion });
  return factory.validateReviewQueueEntry({ ...entry, id: factory.reviewQueueEntryId({ extractionResultId: candidate.extractionResultId, candidateId: candidate.id }), candidateId: candidate.id, candidate });
};

test("Evidence Processing contracts are versioned with a closed boundary", () => {
  assert.equal(factory.EVIDENCE_PROCESSING_SCHEMA_VERSION, 1);
  assert.deepEqual(factory.EVIDENCE_PROCESSING_STATES, ["ACCEPTED-FOR-PROCESSING", "REJECTED-CANDIDATE", "NEEDS-MORE-REVIEW", "INELIGIBLE", "CANNOT-ADVANCE"]);
  assert.equal(typeof factory.buildEvidenceProcessing, "function");
  assert.throws(() => factory.validateEvidenceProcessingSet({ schemaVersion: 99 }), /schemaVersion/);
});

test("ACCEPT enters only the explicit pre-promotion processing boundary", () => {
  const built = fixture(); const record = process(built.queue.entries, [decision(built.queue.entries[0])]).records[0];
  assert.equal(record.state, "ACCEPTED-FOR-PROCESSING");
  assert.equal(record.reasonCode, "ACCEPTED-DECISION");
  assert.equal(/EvidenceRecord|verified|normalizedValue|production-ready|researched-no-evidence/i.test(JSON.stringify(record)), false);
});

test("REJECT and NEEDS-MORE-REVIEW remain non-advancing", () => {
  const built = fixture();
  assert.equal(process(built.queue.entries, [decision(built.queue.entries[0], "REJECT")]).records[0].state, "REJECTED-CANDIDATE");
  assert.equal(process(built.queue.entries, [decision(built.queue.entries[0], "NEEDS-MORE-REVIEW")]).records[0].state, "NEEDS-MORE-REVIEW");
});

test("malformed or mismatched decisions fail closed while missing queue input is explicit ineligibility", () => {
  const built = fixture(); const accepted = decision(built.queue.entries[0]);
  assert.throws(() => process(built.queue.entries, [{ ...accepted, decision: "PROMOTE" }]), /ReviewDecision.decision/);
  assert.throws(() => process(built.queue.entries, [{ ...accepted, targetId: "target.forged" }]), /does not match/);
  const missing = process([], [accepted]).records[0];
  assert.equal(missing.state, "INELIGIBLE"); assert.equal(missing.reasonCode, "MISSING-QUEUE-ENTRY"); assert.equal(missing.candidate, null);
});

test("canonical provenance and raw candidate fields are preserved exactly", () => {
  const built = fixture(); const entry = built.queue.entries[0]; const record = process(built.queue.entries, [decision(entry)]).records[0];
  assert.equal(record.queueEntryId, entry.id);
  ["extractionResultId", "candidateId", "batchId", "targetId", "targetWorkId", "sourceWorkItemId", "attemptId", "prospectId", "artifactId", "adapterId", "adapterVersion"].forEach(field => assert.equal(record[field], entry[field]));
  assert.deepEqual(record.candidate, entry.candidate);
  assert.equal(record.candidate.rawValue, "3.1"); assert.equal(record.candidate.rawUnit, "L");
  assert.deepEqual(record.candidate.sourceLocation, { locator: "line:2", page: 7, section: "Lubrication" });
  assert.deepEqual(record.candidate.applicability, { note: "explicit fixture scope" });
  assert.deepEqual(record.candidate.context, { condition: "with filter" });
});

test("distinct provenance remains distinct and equal visible values are not collapsed", () => {
  const built = fixture(); const first = built.queue.entries[0]; const second = alteredEntry(built.queue.entries[1], { rawValue: first.candidate.rawValue, rawUnit: first.candidate.rawUnit });
  const result = process([first, second], [decision(first), decision(second)]);
  assert.equal(result.records.length, 2); assert.notEqual(result.records[0].queueEntryId, result.records[1].queueEntryId);
});

test("accepted disagreement remains independently represented as unable to advance", () => {
  const built = fixture(); const first = built.queue.entries[0]; const second = alteredEntry(built.queue.entries[1], { fieldId: first.candidate.fieldId, rawValue: "9.9", rawUnit: first.candidate.rawUnit });
  const result = process([first, second], [decision(first), decision(second)]);
  assert.equal(result.records.length, 2); assert.ok(result.records.every(record => record.state === "CANNOT-ADVANCE"));
  assert.ok(result.records.every(record => record.reasonCode === "UNRESOLVED-CANDIDATE-CONFLICT"));
});

test("IDs, ordering, repeated processing and input order are deterministic", () => {
  const built = fixture(); const inputs = [decision(built.queue.entries[0]), decision(built.queue.entries[1], "REJECT")];
  const first = process(built.queue.entries, inputs); const second = process([...built.queue.entries].reverse(), [...inputs].reverse());
  assert.deepEqual(second, first); assert.deepEqual(first.records.map(record => record.id), [...first.records.map(record => record.id)].sort());
  assert.equal(first.records.length, process(built.queue.entries, [inputs[0], inputs[0], inputs[1]]).records.length);
});

test("identity collisions and forward-layer fields fail closed", () => {
  const built = fixture(); const record = process(built.queue.entries, [decision(built.queue.entries[0])]).records[0];
  assert.throws(() => process([built.queue.entries[0], { ...built.queue.entries[0], candidate: { ...built.queue.entries[0].candidate, rawValue: "forged" } }], [decision(built.queue.entries[0])]), /conflicting duplicate queue entry identity/);
  assert.throws(() => process(built.queue.entries, [{ ...decision(built.queue.entries[0]), normalizedValue: "3.1" }]), /unsupported/);
});

test("outputs and all upstream inputs remain immutable and no orchestration changes occur", () => {
  const built = fixture(); const before = JSON.stringify(built); const result = process(built.queue.entries, [decision(built.queue.entries[0])]);
  assert.equal(JSON.stringify(built), before); assert.equal(Object.isFrozen(result), true); assert.equal(Object.isFrozen(result.records[0]), true); assert.throws(() => { result.records[0].state = "ACCEPT"; }, TypeError);
  assert.equal(built.fixture.acquired.snapshot.attempts[0].attemptsUsed, undefined); assert.equal(built.fixture.acquired.snapshot.sourceWorkItems[0].attemptsUsed, 1);
  assert.equal(factory.EVENT_TYPES.some(type => type.includes("evidence")), false);
});

test("no researched-no-evidence, promotion, normalization or production runtime integration exists", () => {
  const root = path.resolve(__dirname, ".."); const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /evidence-processing/));
  assert.equal(JSON.stringify(process(fixture().queue.entries, [decision(fixture().queue.entries[0])])).includes("RESEARCHED-NO-EVIDENCE"), false);
});

test("evidence-processing report is reproducible and preserves boundaries", () => {
  const report = require("../research/data/technical-research-factory-evidence-processing.js").buildReport;
  assert.deepEqual(report(), report()); assert.equal(report().safety.productionChanged, false); assert.equal(report().safety.evidenceCreated, false); assert.equal(report().safety.researchedNoEvidenceAdded, false);
});
