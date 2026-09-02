"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const plannerReport = require("../research/data/technical-research-factory-execution-planner.js").buildReport();

const content = "oil specification=SAE 10W-30\ncapacity filter=3.1 L";
const known = values => ({ state: "KNOWN", values });
function target() {
  return factory.validateResearchTarget({ schemaVersion: 1, id: "target.planner.synthetic.2021.eu", catalogVariantKey: "planner.synthetic", manufacturer: "Synthetic", family: "Planner Fixture", scope: { schemaVersion: 1, model: known(["planner.synthetic"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]) }, sourcePriorityPolicyId: "planner-report-v1", serviceCoreBaseline: { verified: 41, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE" });
}
function fixture() {
  const planBatch = plannerReport.batches[0];
  const work = planBatch.sourceWorkItems[0];
  const digest = factory.sha256(content);
  const acquisitionAdapter = Object.freeze({ adapterId: "synthetic.review-source", adapterVersion: "1", supportedOperations: [work.operation], supportedSourceClasses: ["*"], authenticationRequired: false, networkRequired: false, execute(request) {
    const artifact = { prospectId: request.prospectId, attemptId: request.attemptId, mediaType: "text/plain", byteLength: Buffer.byteLength(content, "utf8"), contentDigest: digest, originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://review-source", metadata: {} };
    artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator });
    return factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_ARTIFACT_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_REVIEW_FIXTURE" }], artifact });
  } });
  const acquired = factory.executeAttempt(factory.bootstrap(planBatch), work, acquisitionAdapter);
  const artifact = acquired.result.outcome.artifact;
  const envelope = factory.validateArtifactContentEnvelope({ schemaVersion: 1, artifactId: artifact.id, mediaType: artifact.mediaType, byteLength: artifact.byteLength, contentDigest: artifact.contentDigest, contentEncoding: "utf8", content });
  const extractionResult = factory.extractRawCandidates({ executionResult: acquired.result, events: acquired.events, researchTarget: target(), contentEnvelope: envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  return { acquired, extractionResult };
}
const withDisposition = (result, disposition) => factory.validateExtractionResult({ ...result, disposition, candidates: [] });

test("Review Queue contracts expose one pre-decision state", () => {
  assert.equal(factory.REVIEW_QUEUE_SCHEMA_VERSION, 1);
  assert.deepEqual(factory.REVIEW_QUEUE_STATES, ["QUEUED"]);
  assert.deepEqual(factory.REVIEW_ELIGIBILITY, ["ELIGIBLE", "NOT-ELIGIBLE"]);
  assert.equal(typeof factory.buildReviewQueue, "function");
  assert.throws(() => factory.validateReviewQueue({ schemaVersion: 99 }), /schemaVersion/);
});

test("a candidate-producing extraction creates one queue entry per raw candidate", () => {
  const { extractionResult } = fixture();
  const queue = factory.buildReviewQueue([extractionResult]);
  assert.equal(queue.entries.length, 2);
  assert.equal(queue.ineligible.length, 0);
  assert.ok(queue.entries.every(entry => entry.state === "QUEUED"));
});

test("queue entry identity and repeated construction are deterministic", () => {
  const { extractionResult } = fixture();
  const first = factory.buildReviewQueue([extractionResult]);
  const second = factory.buildReviewQueue([extractionResult]);
  assert.deepEqual(second, first);
  first.entries.forEach(entry => assert.equal(entry.id, factory.reviewQueueEntryId({ extractionResultId: entry.extractionResultId, candidateId: entry.candidateId })));
});

test("input order cannot change deterministic queue ordering", () => {
  const { extractionResult } = fixture();
  const reversed = { ...extractionResult, candidates: [...extractionResult.candidates].reverse() };
  const first = factory.buildReviewQueue([extractionResult]);
  const second = factory.buildReviewQueue([reversed]);
  assert.deepEqual(second, first);
  assert.deepEqual(first.entries.map(entry => entry.id), [...first.entries.map(entry => entry.id)].sort());
});

test("entries retain exact canonical provenance to result and candidate", () => {
  const { extractionResult } = fixture();
  factory.buildReviewQueue([extractionResult]).entries.forEach(entry => {
    const candidate = extractionResult.candidates.find(item => item.id === entry.candidateId);
    assert.equal(entry.batchId, extractionResult.batchId);
    assert.equal(entry.targetId, candidate.targetId);
    assert.equal(entry.targetWorkId, candidate.targetWorkId);
    assert.equal(entry.sourceWorkItemId, candidate.sourceWorkItemId);
    assert.equal(entry.attemptId, candidate.attemptId);
    assert.equal(entry.prospectId, candidate.prospectId);
    assert.equal(entry.artifactId, candidate.artifactId);
    assert.equal(entry.extractionResultId, extractionResult.id);
    assert.equal(entry.adapterId, candidate.adapterId);
    assert.equal(entry.adapterVersion, candidate.adapterVersion);
  });
});

test("raw values units locations applicability and context are preserved exactly", () => {
  const { extractionResult } = fixture();
  const queue = factory.buildReviewQueue([extractionResult]);
  queue.entries.forEach(entry => assert.deepEqual(entry.candidate, extractionResult.candidates.find(candidate => candidate.id === entry.candidateId)));
  const capacity = queue.entries.find(entry => entry.candidate.fieldId === "lubrication.capacity-filter").candidate;
  assert.equal(capacity.rawValue, "3.1");
  assert.equal(capacity.rawUnit, "L");
  assert.deepEqual(capacity.sourceLocation, { locator: "line:2", page: 7, section: "Lubrication" });
  assert.deepEqual(capacity.applicability, { note: "explicit fixture scope" });
  assert.deepEqual(capacity.context, { condition: "with filter" });
  assert.equal(Object.prototype.hasOwnProperty.call(capacity, "normalizedValue"), false);
});

test("exact duplicate extraction inputs collapse deterministically", () => {
  const { extractionResult } = fixture();
  const reordered = { ...extractionResult, candidates: [...extractionResult.candidates].reverse(), observations: [...extractionResult.observations].reverse() };
  const queue = factory.buildReviewQueue([extractionResult, extractionResult, reordered]);
  assert.equal(queue.entries.length, extractionResult.candidates.length);
});

test("same visible value from different canonical provenance remains distinct", () => {
  const { extractionResult } = fixture();
  const original = extractionResult.candidates[0];
  const adapterVersion = "2";
  const resultIdentity = { batchId: extractionResult.batchId, targetId: extractionResult.targetId, targetWorkId: extractionResult.targetWorkId, sourceWorkItemId: extractionResult.sourceWorkItemId, attemptId: extractionResult.attemptId, prospectId: extractionResult.prospectId, artifactId: extractionResult.artifactId, adapterId: extractionResult.adapterId, adapterVersion, operation: factory.EXTRACTION_OPERATION };
  const resultId = factory.extractionResultId(resultIdentity);
  const changedCandidates = extractionResult.candidates.map(candidate => {
    const changed = { ...candidate, extractionResultId: resultId, adapterVersion };
    changed.id = factory.candidateId({ extractionResultId: resultId, artifactId: changed.artifactId, targetId: changed.targetId, fieldId: changed.fieldId, sourceLocation: changed.sourceLocation, ordinal: changed.ordinal, adapterId: changed.adapterId, adapterVersion });
    return changed;
  });
  const variant = factory.validateExtractionResult({ ...extractionResult, id: resultId, adapterVersion, candidates: changedCandidates });
  const queue = factory.buildReviewQueue([extractionResult, variant]);
  assert.equal(queue.entries.filter(entry => entry.candidate.rawValue === original.rawValue).length, 2);
});

test("identity collision with different raw content fails closed", () => {
  const { extractionResult } = fixture();
  const changedCandidate = { ...extractionResult.candidates[0], rawValue: "DIFFERENT RAW VALUE" };
  const variant = factory.validateExtractionResult({ ...extractionResult, candidates: [changedCandidate, extractionResult.candidates[1]] });
  assert.throws(() => factory.buildReviewQueue([extractionResult, variant]), /identity collision/);
});

test("same extraction result identity with a different candidate set fails closed", () => {
  const { extractionResult } = fixture();
  const variant = factory.validateExtractionResult({ ...extractionResult, candidates: [extractionResult.candidates[0]] });
  assert.throws(() => factory.buildReviewQueue([extractionResult, variant]), /extraction result identity collision/);
});

test("zero candidates remain ineligible and never become researched-no-evidence", () => {
  const { extractionResult } = fixture();
  const queue = factory.buildReviewQueue([withDisposition(extractionResult, "NO-CANDIDATES")]);
  assert.equal(queue.entries.length, 0);
  assert.deepEqual(queue.ineligible.map(item => [item.disposition, item.reasonCode]), [["NO-CANDIDATES", "ZERO-CANDIDATES"]]);
  assert.equal(JSON.stringify(queue).includes("researched-no-evidence"), false);
});

for (const [disposition, reasonCode] of [["UNSUPPORTED-MEDIA", "UNSUPPORTED-EXTRACTION"], ["PROVENANCE-INCOMPLETE", "EXTRACTION-PROVENANCE-INCOMPLETE"], ["CONTENT-DIGEST-MISMATCH", "CONTENT-INTEGRITY-FAILED"], ["FIELD-UNMAPPED", "FIELD-UNMAPPED"], ["PARSE-FAILURE", "EXTRACTION-PARSE-FAILED"], ["PERMANENT-EXTRACTION-FAILURE", "EXTRACTION-PERMANENTLY-FAILED"]]) {
  test(`${disposition} is ineligible without becoming a review decision`, () => {
    const { extractionResult } = fixture();
    const queue = factory.buildReviewQueue([withDisposition(extractionResult, disposition)]);
    assert.equal(queue.entries.length, 0);
    assert.equal(queue.ineligible[0].reasonCode, reasonCode);
    assert.equal(JSON.stringify(queue).match(/accepted|rejected|approved|denied/gi), null);
  });
}

test("malformed extraction identity provenance and forward-layer fields fail closed", () => {
  const { extractionResult } = fixture();
  assert.throws(() => factory.buildReviewQueue([{ ...extractionResult, id: "extraction-result.000000000000000000000000" }]), /unstable/);
  assert.throws(() => factory.buildReviewQueue([{ ...extractionResult, candidates: [{ ...extractionResult.candidates[0], batchId: "batch.forged" }, extractionResult.candidates[1]] }]), /batchId/);
  assert.throws(() => factory.buildReviewQueue([{ ...extractionResult, reviewDecision: "ACCEPT" }]), /unsupported/);
  assert.throws(() => factory.buildReviewQueue([{ ...extractionResult, candidates: [{ ...extractionResult.candidates[0], normalizedValue: 3.1 }, extractionResult.candidates[1]] }]), /unsupported/);
  const queue = factory.buildReviewQueue([extractionResult]);
  assert.throws(() => factory.validateReviewQueueEntry({ ...queue.entries[0], decision: "ACCEPT" }), /unsupported/);
});

test("queue output is immutable and input extraction results are not mutated", () => {
  const { extractionResult } = fixture();
  const before = factory.orchestrationJson.canonicalSerialize(extractionResult);
  const queue = factory.buildReviewQueue([extractionResult]);
  assert.equal(factory.orchestrationJson.canonicalSerialize(extractionResult), before);
  assert.equal(Object.isFrozen(queue), true);
  assert.equal(Object.isFrozen(queue.entries[0].candidate.sourceLocation), true);
  assert.throws(() => { queue.entries[0].state = "changed"; }, TypeError);
});

test("queue construction does not change acquisition state events attempts or retries", () => {
  const { acquired, extractionResult } = fixture();
  const events = factory.orchestrationJson.canonicalSerialize(acquired.events);
  const snapshot = factory.orchestrationJson.canonicalSerialize(acquired.snapshot);
  factory.buildReviewQueue([extractionResult]);
  assert.equal(factory.orchestrationJson.canonicalSerialize(acquired.events), events);
  assert.equal(factory.orchestrationJson.canonicalSerialize(acquired.snapshot), snapshot);
  assert.equal(acquired.snapshot.attempts.length, 1);
  assert.equal(acquired.snapshot.sourceWorkItems[0].attemptsUsed, 1);
});

test("Review Queue adds no decision API or Orchestrator lifecycle event", () => {
  ["accept", "reject", "approve", "deny", "edit", "override", "merge", "normalize", "suppress", "resolveConflict", "promote"].forEach(name => assert.equal(Object.prototype.hasOwnProperty.call(factory, name), false));
  assert.equal(factory.EVENT_TYPES.some(type => type.includes("review") || type.includes("queue")), false);
});

test("Review Queue modules remain outside production runtime imports", () => {
  const root = path.resolve(__dirname, "..");
  const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /review-queue/));
  assert.equal(require("../js/app-release.js").currentVersion, "0.3.0");
});

test("Review Queue report is deterministic and records strict boundaries", () => {
  const buildReport = require("../research/data/technical-research-factory-review-queue.js").buildReport;
  assert.deepEqual(buildReport(), buildReport());
  assert.equal(buildReport().safety.humanDecisionsImplemented, false);
  assert.equal(buildReport().safety.researchedNoEvidenceAdded, false);
  assert.equal(buildReport().safety.orchestratorEventsAdded, 0);
});
