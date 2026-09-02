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
  const acquisitionAdapter = Object.freeze({ adapterId: "synthetic.extraction-source", adapterVersion: "1", supportedOperations: [work.operation], supportedSourceClasses: ["*"], authenticationRequired: false, networkRequired: false, execute(request) {
    const artifact = { prospectId: request.prospectId, attemptId: request.attemptId, mediaType: "text/plain", byteLength: Buffer.byteLength(content, "utf8"), contentDigest: digest, originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://extraction-source", metadata: {} };
    artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator });
    return factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_ARTIFACT_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_EXTRACTION_FIXTURE" }], artifact });
  } });
  const initialEvents = factory.bootstrap(planBatch);
  const acquired = factory.executeAttempt(initialEvents, work, acquisitionAdapter);
  const artifact = acquired.result.outcome.artifact;
  const envelope = factory.validateArtifactContentEnvelope({ schemaVersion: 1, artifactId: artifact.id, mediaType: artifact.mediaType, byteLength: artifact.byteLength, contentDigest: artifact.contentDigest, contentEncoding: "utf8", content });
  return { planBatch, work, initialEvents, acquired, artifact, envelope, target: target() };
}
const extract = (overrides = {}) => {
  const value = fixture();
  return { value, result: factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates, ...overrides }) };
};

test("extraction contracts and Factory exports are versioned and closed", () => {
  assert.equal(factory.EXTRACTION_SCHEMA_VERSION, 1);
  assert.equal(factory.EXTRACTION_OPERATION, "extract-raw-candidates");
  assert.equal(factory.EXTRACTION_DISPOSITIONS.length, 8);
  assert.equal(typeof factory.extractRawCandidates, "function");
  assert.equal(factory.extractionAdapters.syntheticExtractorAdapters.candidates.localOnly, true);
  assert.throws(() => factory.validateArtifactContentEnvelope({ schemaVersion: 99 }), /schemaVersion/);
});

test("valid acquired local content produces raw candidates with canonical ownership", () => {
  const { value, result } = extract();
  assert.equal(result.disposition, "CANDIDATES-PRODUCED");
  assert.equal(result.candidates.length, 2);
  assert.equal(result.batchId, value.planBatch.targetWorks[0].batchId);
  assert.equal(result.targetId, value.target.id);
  assert.equal(result.targetWorkId, value.work.targetWorkId);
  assert.equal(result.sourceWorkItemId, value.work.id);
  assert.equal(result.attemptId, value.artifact.attemptId);
  assert.equal(result.prospectId, value.work.prospectId);
  assert.equal(Object.prototype.hasOwnProperty.call(value.work, "batchId"), false);
});

test("raw value unit location applicability and context are preserved without normalization", () => {
  const { result } = extract();
  const capacity = result.candidates.find(item => item.fieldId === "lubrication.capacity-filter");
  assert.equal(capacity.rawValue, "3.1");
  assert.equal(capacity.rawUnit, "L");
  assert.deepEqual(capacity.sourceLocation, { locator: "line:2", page: 7, section: "Lubrication" });
  assert.deepEqual(capacity.applicability, { note: "explicit fixture scope" });
  assert.deepEqual(capacity.context, { condition: "with filter" });
  assert.equal(Object.prototype.hasOwnProperty.call(capacity, "normalizedValue"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(capacity, "proofStatus"), false);
});

test("candidate provenance reaches target work source attempt artifact and adapter", () => {
  const { value, result } = extract();
  result.candidates.forEach(candidate => {
    assert.equal(candidate.targetId, value.target.id);
    assert.equal(candidate.targetWorkId, value.work.targetWorkId);
    assert.equal(candidate.sourceWorkItemId, value.work.id);
    assert.equal(candidate.attemptId, value.artifact.attemptId);
    assert.equal(candidate.artifactId, value.artifact.id);
    assert.equal(candidate.prospectId, value.work.prospectId);
    assert.equal(candidate.extractionResultId, result.id);
    assert.equal(candidate.adapterId, "synthetic-extractor.candidates");
    assert.equal(candidate.adapterVersion, "1");
  });
});

test("candidate identity ordering and serialization are deterministic", () => {
  const first = extract().result;
  const second = extract().result;
  assert.equal(factory.orchestrationJson.canonicalSerialize(first), factory.orchestrationJson.canonicalSerialize(second));
  assert.deepEqual(first.candidates.map(item => item.id), [...first.candidates.map(item => item.id)].sort());
});

test("candidate and result validators recompute IDs and enforce enclosing provenance", () => {
  const { result } = extract();
  assert.throws(() => factory.validateExtractionResult({ ...result, id: "extraction-result.000000000000000000000000" }), /unstable/);
  assert.throws(() => factory.validateExtractionCandidate({ ...result.candidates[0], id: "extraction-candidate.000000000000000000000000" }), /unstable/);
  const forgedCandidate = { ...result.candidates[0], sourceWorkItemId: "source-work.000000000000000000000000" };
  forgedCandidate.id = factory.candidateId({ extractionResultId: forgedCandidate.extractionResultId, artifactId: forgedCandidate.artifactId, targetId: forgedCandidate.targetId, fieldId: forgedCandidate.fieldId, sourceLocation: forgedCandidate.sourceLocation, ordinal: forgedCandidate.ordinal, adapterId: forgedCandidate.adapterId, adapterVersion: forgedCandidate.adapterVersion });
  assert.throws(() => factory.validateExtractionResult({ ...result, candidates: [forgedCandidate, result.candidates[1]] }), /does not match/);
});

test("non-acquired execution results are ineligible rather than extraction failures", () => {
  const value = fixture();
  const rejected = { ...value.acquired.result, outcome: factory.acquisitionAdapters.syntheticAdapters.noEvidence.execute({ schemaVersion: 1, batchId: value.acquired.result.batchId, targetWorkId: value.work.targetWorkId, sourceWorkItemId: value.work.id, attemptId: value.acquired.result.attemptId, prospectId: value.work.prospectId, operation: value.work.operation, adapterId: "synthetic.noEvidence" }) };
  assert.throws(() => factory.extractRawCandidates({ executionResult: rejected, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates }), /not an acquired artifact/);
});

test("forged execution target batch source and attempt relationships are rejected", () => {
  const value = fixture();
  assert.throws(() => factory.extractRawCandidates({ executionResult: { ...value.acquired.result, batchId: "batch.000000000000000000000000" }, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates }), /result mismatch|batch identity/);
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: { ...value.target, id: "target.forged" }, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates }), /identity mismatch/);
});

test("artifact identity and media type mismatches fail before adapter invocation", () => {
  const value = fixture();
  let calls = 0;
  const adapter = { ...factory.extractionAdapters.syntheticExtractorAdapters.candidates, execute(request) { calls += 1; return factory.extractionAdapters.syntheticExtractorAdapters.candidates.execute(request); } };
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: { ...value.envelope, artifactId: "artifact.000000000000000000000000" }, adapter }), /does not match/);
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: { ...value.envelope, mediaType: "application/json" }, adapter }), /does not match/);
  assert.equal(calls, 0);
});

test("digest and byte-length mismatches return integrity failure without invoking extractor", () => {
  for (const envelopePatch of [{ content: `${content}!` }, { byteLength: Buffer.byteLength(content, "utf8") + 1 }, { contentDigest: "b".repeat(64) }]) {
    const value = fixture(); let calls = 0;
    const adapter = { ...factory.extractionAdapters.syntheticExtractorAdapters.candidates, execute() { calls += 1; throw new Error("must not execute"); } };
    const result = factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: { ...value.envelope, ...envelopePatch }, adapter });
    assert.equal(result.disposition, "CONTENT-DIGEST-MISMATCH");
    assert.equal(calls, 0);
  }
});

test("missing acquisition content provenance is distinct and adapters cannot forge boundary failures", () => {
  const value = fixture();
  const artifact = { ...value.artifact, byteLength: null, contentDigest: null };
  artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: null, locator: artifact.locator });
  const outcome = factory.validateOutcome({ ...value.acquired.result.outcome, artifact });
  const executionResult = factory.validateExecutionResult({ ...value.acquired.result, outcome });
  const events = value.acquired.events.map(event => event.type === "attempt-completed" ? factory.events.createEvent({ batchId: event.batchId, sequence: event.sequence, type: event.type, payload: { attemptId: event.payload.attemptId, result: executionResult } }) : event);
  const envelope = factory.validateArtifactContentEnvelope({ ...value.envelope, artifactId: artifact.id });
  let calls = 0;
  const adapter = { ...factory.extractionAdapters.syntheticExtractorAdapters.candidates, execute() { calls += 1; throw new Error("must not execute"); } };
  const result = factory.extractRawCandidates({ executionResult, events, researchTarget: value.target, contentEnvelope: envelope, adapter });
  assert.equal(result.disposition, "PROVENANCE-INCOMPLETE");
  assert.equal(calls, 0);

  const forged = { ...factory.extractionAdapters.syntheticExtractorAdapters.none, execute: () => ({ disposition: "CONTENT-DIGEST-MISMATCH", candidates: [], observations: [] }) };
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: forged }), /malformed/);
});

test("unsupported media is typed and does not invoke the adapter", () => {
  const value = fixture();
  const result = factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.unsupportedMedia });
  assert.equal(result.disposition, "UNSUPPORTED-MEDIA");
  assert.deepEqual(result.candidates, []);
});

for (const [name, disposition] of [["none", "NO-CANDIDATES"], ["unmapped", "FIELD-UNMAPPED"], ["parseFailure", "PARSE-FAILURE"], ["permanent", "PERMANENT-EXTRACTION-FAILURE"]]) {
  test(`synthetic ${name} extractor returns ${disposition}`, () => {
    const value = fixture();
    const result = factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters[name] });
    assert.equal(result.disposition, disposition);
    assert.deepEqual(result.candidates, []);
  });
}

test("unmapped candidate malformed and forged adapter output is rejected", () => {
  const value = fixture();
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.malformed }), /unmapped field/);
  const forged = { ...factory.extractionAdapters.syntheticExtractorAdapters.candidates, execute: () => ({ disposition: "CANDIDATES-PRODUCED", observations: [], candidates: [{ targetId: value.target.id, fieldId: "lubrication.capacity-filter", rawValue: "3.1", rawUnit: "L", sourceLocation: { page: 1, section: null, locator: null }, extractionMethod: "FORGED", applicability: null, context: null, ordinal: 1 }] }) };
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: forged }), /cannot supply canonical/);
  const extra = { ...factory.extractionAdapters.syntheticExtractorAdapters.none, execute: () => ({ disposition: "NO-CANDIDATES", candidates: [], observations: [], unexpected: true }) };
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: extra }), /unsupported/);
});

test("JSON safety and secret-shaped content or adapter output fail closed", () => {
  const value = fixture();
  assert.throws(() => factory.validateArtifactContentEnvelope({ ...value.envelope, content: "api_key=unsafe" }), /secret-shaped/);
  const unsafe = { ...factory.extractionAdapters.syntheticExtractorAdapters.candidates, execute: () => ({ disposition: "NO-CANDIDATES", candidates: [], observations: [{ type: "NO-CANDIDATES", detailCode: "x", metadata: { token: "unsafe" } }] }) };
  assert.throws(() => factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: unsafe }), /secret-shaped/);
  assert.throws(() => factory.validateArtifactContentEnvelope({ ...value.envelope, extra: undefined }), /undefined/);
});

test("results are deeply immutable and all inputs remain unchanged", () => {
  const value = fixture();
  const before = JSON.stringify(value);
  const result = factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.candidates[0].sourceLocation), true);
  assert.throws(() => { result.candidates[0].rawValue = "changed"; }, TypeError);
  assert.equal(JSON.stringify(value), before);
});

test("extraction does not alter acquisition events state attempts or retry budget", () => {
  const { value } = extract();
  const beforeEvents = JSON.stringify(value.acquired.events);
  const beforeSnapshot = JSON.stringify(value.acquired.snapshot);
  factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  assert.equal(JSON.stringify(value.acquired.events), beforeEvents);
  assert.equal(JSON.stringify(value.acquired.snapshot), beforeSnapshot);
  assert.equal(value.acquired.snapshot.attempts.length, 1);
  assert.equal(value.acquired.snapshot.sourceWorkItems[0].attemptsUsed, 1);
});

test("checkpoint-resumed acquisition context yields identical extraction", () => {
  const value = fixture();
  const checkpoint = factory.createCheckpoint(value.acquired.events);
  const resumed = factory.resumeFromCheckpoint(checkpoint, value.acquired.events);
  assert.deepEqual(resumed, value.acquired.snapshot);
  const first = factory.extractRawCandidates({ executionResult: value.acquired.result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  const second = factory.extractRawCandidates({ executionResult: resumed.attempts[0].result, events: value.acquired.events, researchTarget: value.target, contentEnvelope: value.envelope, adapter: factory.extractionAdapters.syntheticExtractorAdapters.candidates });
  assert.deepEqual(second, first);
});

test("new extraction modules remain outside production runtime imports", () => {
  const root = path.resolve(__dirname, "..");
  const productionFiles = ["index.html", ...fs.readdirSync(path.join(root, "js")).filter(name => name.endsWith(".js")).map(name => `js/${name}`), ...fs.readdirSync(path.join(root, "js/technical")).filter(name => name.endsWith(".js")).map(name => `js/technical/${name}`)];
  productionFiles.forEach(file => assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /extraction-(?:agent|contracts|adapters)/));
});

test("extraction report is reproducible and records no review or production change", () => {
  const buildReport = require("../research/data/technical-research-factory-extraction-agent.js").buildReport;
  const first = buildReport(); const second = buildReport();
  assert.deepEqual(second, first);
  assert.equal(first.examples.candidates, "CANDIDATES-PRODUCED");
  assert.equal(first.safety.reviewQueueStarted, false);
  assert.equal(first.safety.productionChanged, false);
  assert.equal(first.provenance.sourceWorkHasNoBatchId, true);
});
