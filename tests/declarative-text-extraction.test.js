"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const factory = require("../research/factory/index.js");

const text = "Name: Example\nCode: ABC-123\nCode: DEF-456\nPressure: 42 units";
function parentArtifact(content = "<p>unused</p>", mediaType = "text/html") {
  const bytes = Buffer.from(content, "utf8"); const contentDigest = crypto.createHash("sha256").update(bytes).digest("hex");
  const artifact = { prospectId: "prospect.declarative-fixture", attemptId: "attempt.declarative-fixture", mediaType, byteLength: bytes.length, contentDigest, originClassification: "REMOTE_HTTP_SOURCE", acquisitionMethod: "http.public-bounded", locator: "https://fixture.invalid/declarative", metadata: { contentBase64: bytes.toString("base64") } };
  artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType, contentDigest, locator: artifact.locator });
  return factory.validateArtifact(artifact);
}
function derivedText() { return factory.createDerivedContent({ parentArtifact: parentArtifact(), parentBytes: Buffer.from("<p>unused</p>"), transformerId: "fixture.text", transformerVersion: "1", region: { id: "text-region", pdfPages: [1], sections: ["Fixture"] }, approvedRegionIds: ["text-region"], content: text }); }
const baseRule = overrides => ({ schemaVersion: 1, fieldId: "fixture.alpha", ruleKind: "TEXT_PATTERN", pattern: "Code: ([A-Z]+-[0-9]+)", flags: "", captureGroup: 1, maxMatches: 1, ambiguityPolicy: "REJECT", ...overrides });

test("declarative rules are closed, deterministic and JSON-safe", () => {
  const one = factory.validateDeclarativeExtractionRule(baseRule()); const two = factory.validateDeclarativeExtractionRule(baseRule());
  assert.equal(one.id, two.id); assert.equal(Object.isFrozen(one), true);
  assert.throws(() => factory.validateDeclarativeExtractionRule({ ...baseRule(), ruleKind: "DOM_SELECTOR" }), /kind/);
  assert.throws(() => factory.validateDeclarativeExtractionRule({ ...baseRule(), pattern: "x".repeat(513) }), /pattern bound/);
  assert.throws(() => factory.validateDeclarativeExtractionRule({ ...baseRule(), flags: "g" }), /unsupported flags/);
  assert.throws(() => factory.validateDeclarativeExtractionRule({ ...baseRule(), execute: () => true }), /JSON-safe/);
  assert.notEqual(one.id, factory.validateDeclarativeExtractionRule({ ...baseRule(), pattern: "Pressure: ([0-9]+)" }).id);
});

test("text and bounded label/value extraction preserve exact text and locators", () => {
  const record = derivedText();
  const textResult = factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: baseRule({ pattern: "Code: (ABC-[0-9]+)" }) });
  assert.equal(textResult.status, "MATCHED"); assert.equal(textResult.matches[0].matchedText, "Code: ABC-123"); assert.equal(textResult.matches[0].capturedValue, "ABC-123");
  assert.deepEqual(textResult.matches[0].sourceLocator, { startLine: 2, endLine: 2, startOffset: 14, endOffset: 27 });
  const labelRule = factory.validateDeclarativeExtractionRule({ schemaVersion: 1, fieldId: "fixture.beta", ruleKind: "LABEL_VALUE", labelPattern: "^Pressure:", valuePattern: "([0-9]+) units", valueFlags: "", captureGroup: 1, maxLineDistance: 0, maxMatches: 1, ambiguityPolicy: "REJECT" });
  const labelResult = factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: labelRule, applicability: { scope: "fixture" }, sourceAuthority: { state: "UNRESOLVED" } });
  assert.equal(labelResult.matches[0].capturedValue, "42"); assert.deepEqual(labelResult.matches[0].applicability, { scope: "fixture" }); assert.deepEqual(labelResult.matches[0].sourceAuthority, { state: "UNRESOLVED" });
});

test("custody, bounds, no-match and ambiguity fail closed", () => {
  const record = derivedText();
  assert.deepEqual(factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: { ...baseRule(), pattern: "Missing: (.+)" } }).matches, []);
  assert.equal(factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: baseRule() }).status, "AMBIGUOUS");
  assert.throws(() => factory.executeDeclarativeTextExtraction({ derivedContent: { ...record, content: "tampered" }, rule: baseRule() }), /digest|identity/);
  assert.throws(() => factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: { ...baseRule(), maxMatches: 33 } }), /maxMatches/);
  assert.throws(() => factory.executeDeclarativeTextExtraction({ derivedContent: record, rule: { ...baseRule(), captureGroup: 2 } }), /capture/);
});

test("HTML derivative, declarative extraction and existing Extraction Agent preserve custody", () => {
  const html = "<p>Name: Example</p>"; const parent = parentArtifact(html); const htmlRecord = factory.createHtmlDerivedContent({ parentArtifact: parent });
  const target = factory.validateResearchTarget({ schemaVersion: 1, id: "target.declarative-fixture", catalogVariantKey: "fixture.model", manufacturer: "Synthetic", family: "Fixture", scope: { schemaVersion: 1, model: { state: "KNOWN", values: ["fixture.model"] }, generation: { state: "KNOWN", values: ["gen1"] }, years: { kind: "EXACT", from: 2024, to: 2024 }, markets: { state: "KNOWN", values: ["TEST"] }, transmissions: { state: "KNOWN", values: ["manual"] }, abs: { state: "KNOWN", values: [false] }, equipment: { state: "KNOWN", values: ["standard"] } }, sourcePriorityPolicyId: "fixture", serviceCoreBaseline: { verified: 0, total: 44 }, gapPlanRef: null, knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE" });
  const prospect = factory.validateSourceProspect({ schemaVersion: 1, id: parent.prospectId, targetId: target.id, documentClass: "fixture", authority: { name: "Fixture", state: "KNOWN" }, documentIdentity: { title: "Fixture", state: "KNOWN" }, publication: { relationship: "SINGLE", identifiers: [{ value: "fixture", namespace: "fixture", region: "TEST", proofState: "AUTHENTICATED" }] }, officialLocations: [{ host: "fixture.invalid", path: "/fixture" }], sourceTier: "A", authenticationState: "AUTHENTICATED", accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: target.scope, exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "HIGH", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "fixture" });
  const playbook = factory.createPlaybook(); const modelPlan = factory.createModelPlan({ playbook, targetIdentity: "fixture.model", sourcePublication: "fixture", artifact: { artifactId: parent.id, contentDigest: parent.contentDigest, mediaType: parent.mediaType, byteLength: parent.byteLength }, regions: [{ id: "fixture-region", pdfPages: [1], sections: ["Fixture"] }], fieldTargets: [factory.SERVICE_CORE_FIELDS[0]], applicability: { required: { model: ["fixture.model"], modelYear: 2024 }, unresolved: [] }, budget: { maxRegions: 1, maxRawCandidates: 1 } });
  const rule = { schemaVersion: 1, fieldId: factory.SERVICE_CORE_FIELDS[0], ruleKind: "TEXT_PATTERN", pattern: "Name: (Example)", flags: "", captureGroup: 1, maxMatches: 1, ambiguityPolicy: "REJECT" };
  const adapter = factory.createDeclarativeExtractorAdapter({ derivedContent: htmlRecord, rule, applicability: { model: "fixture.model", modelYear: 2024 }, sourceAuthority: { state: "UNRESOLVED" } });
  const result = factory.extractRawCandidatesFromAcquiredSource({ context: { batchId: "batch.declarative-fixture", targetId: target.id, targetWorkId: "target-work.declarative-fixture", sourceWorkItemId: "source-work.declarative-fixture", attemptId: parent.attemptId, prospectId: prospect.id }, researchTarget: target, sourceProspect: prospect, modelPlan, acquisitionArtifact: parent, derivedContentEnvelope: htmlRecord, adapter, playbook });
  assert.equal(result.disposition, "CANDIDATES-PRODUCED"); assert.equal(result.candidates.length, 1); assert.equal(result.candidates[0].rawValue, "Example"); assert.equal(result.candidates[0].artifactId, htmlRecord.id); assert.equal(result.candidates[0].context.derivedContentId, htmlRecord.id); assert.equal(result.candidates[0].context.parentArtifactId, parent.id); assert.deepEqual(result.candidates[0].applicability, { model: "fixture.model", modelYear: 2024 });
});
