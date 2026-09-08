// NON-PRODUCTION bounded declarative extraction from derived text.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const derived = require("./derived-content-contracts.js");
const extraction = require("./extraction-contracts.js");

const SCHEMA_VERSION = 1;
const RULE_KINDS = Object.freeze(["TEXT_PATTERN", "LABEL_VALUE"]);
const AMBIGUITY_POLICIES = Object.freeze(["REJECT", "ALLOW"]);
const ALLOWED_FLAGS = Object.freeze(["i", "m"]);
const DEFAULTS = Object.freeze({ maxInputBytes: 5 * 1024 * 1024, maxPatternLength: 512, maxMatches: 32, maxCapturedValueLength: 512, maxLineDistance: 3 });
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const matchId = input => `declarative-match.${digest(input).slice(0, 24)}`;
const sourceLines = text => { const lines = []; let start = 0; text.split("\n").forEach((value, index) => { lines.push({ number: index + 1, value, start }); start += value.length + 1; }); return lines; };

function validatePattern(pattern, label) {
  assert(typeof pattern === "string" && pattern.length > 0 && pattern.length <= DEFAULTS.maxPatternLength, `${label} is invalid or exceeds the pattern bound`);
  return pattern;
}

function validateFlags(flags, label) {
  assert(typeof flags === "string" && [...flags].every(flag => ALLOWED_FLAGS.includes(flag)) && new Set(flags).size === flags.length, `${label} contains unsupported flags`);
  return flags;
}

function safeRegExp(pattern, flags, label) {
  try { return new RegExp(pattern, flags); } catch { throw new TypeError(`${label} is not a valid regular expression`); }
}

function validateRule(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_VERSION, "extraction rule schemaVersion is incompatible");
  assert(typeof input.fieldId === "string" && input.fieldId.length > 0, "extraction rule fieldId is required");
  assert(RULE_KINDS.includes(input.ruleKind), "extraction rule kind is invalid");
  const pattern = validatePattern(input.pattern || input.valuePattern, "extraction rule pattern");
  const flags = validateFlags(input.flags === undefined ? "" : input.flags, "extraction rule flags");
  assert(input.captureGroup === undefined || (Number.isInteger(input.captureGroup) && input.captureGroup >= 0 && input.captureGroup <= 10), "extraction rule captureGroup is invalid");
  const maxMatches = input.maxMatches === undefined ? 1 : input.maxMatches;
  assert(Number.isInteger(maxMatches) && maxMatches > 0 && maxMatches <= DEFAULTS.maxMatches, "extraction rule maxMatches is invalid");
  const ambiguityPolicy = input.ambiguityPolicy === undefined ? "REJECT" : input.ambiguityPolicy;
  assert(AMBIGUITY_POLICIES.includes(ambiguityPolicy), "extraction rule ambiguityPolicy is invalid");
  const base = { schemaVersion: SCHEMA_VERSION, fieldId: input.fieldId, ruleKind: input.ruleKind, pattern, flags, captureGroup: input.captureGroup === undefined ? 0 : input.captureGroup, maxMatches, ambiguityPolicy };
  if (input.ruleKind === "LABEL_VALUE") {
    const labelPattern = validatePattern(input.labelPattern, "extraction rule labelPattern");
    const valuePattern = validatePattern(input.valuePattern, "extraction rule valuePattern");
    const valueFlags = validateFlags(input.valueFlags === undefined ? flags : input.valueFlags, "extraction rule valueFlags");
    const maxLineDistance = input.maxLineDistance === undefined ? 1 : input.maxLineDistance;
    assert(Number.isInteger(maxLineDistance) && maxLineDistance >= 0 && maxLineDistance <= DEFAULTS.maxLineDistance, "extraction rule maxLineDistance is invalid");
    return canonicalRule({ ...base, labelPattern, valuePattern, valueFlags, maxLineDistance });
  }
  return canonicalRule(base);
}

function canonicalRule(rule) {
  const identity = { schemaVersion: SCHEMA_VERSION, fieldId: rule.fieldId, ruleKind: rule.ruleKind, pattern: rule.pattern, flags: rule.flags, captureGroup: rule.captureGroup, maxMatches: rule.maxMatches, ambiguityPolicy: rule.ambiguityPolicy, ...(rule.ruleKind === "LABEL_VALUE" ? { labelPattern: rule.labelPattern, valuePattern: rule.valuePattern, valueFlags: rule.valueFlags, maxLineDistance: rule.maxLineDistance } : {}) };
  return json.immutableClone({ ...identity, id: `extraction-rule.${digest(identity).slice(0, 24)}` });
}

function captureMatch(match, captureGroup, label) {
  assert(match && match[captureGroup] !== undefined, `${label} capture group is absent`);
  const capturedValue = match[captureGroup];
  assert(typeof capturedValue === "string" && capturedValue.length > 0 && capturedValue.length <= DEFAULTS.maxCapturedValueLength, `${label} capture is invalid or exceeds the value bound`);
  return capturedValue;
}

function locatorFor(text, start, end) {
  const before = text.slice(0, start); const endBefore = text.slice(0, end);
  return { startLine: before.split("\n").length, endLine: endBefore.split("\n").length, startOffset: start, endOffset: end };
}

function createMatch({ rule, derivedContent, matchedText, capturedValue, start, end, ordinal, applicability = null, sourceAuthority = null }) {
  const sourceLocator = locatorFor(derivedContent.content, start, end);
  const identity = { fieldId: rule.fieldId, ruleId: rule.id, derivedContentId: derivedContent.id, derivedContentDigest: derivedContent.contentDigest, sourceLocator, capturedValue };
  return json.immutableClone({ schemaVersion: SCHEMA_VERSION, id: matchId(identity), fieldId: rule.fieldId, ruleId: rule.id, derivedContentId: derivedContent.id, derivedContentDigest: derivedContent.contentDigest, parentArtifactId: derivedContent.parentArtifactId, matchedText, capturedValue, sourceLocator, ordinal, ambiguityStatus: "UNAMBIGUOUS", applicability, sourceAuthority });
}

function executeTextPattern(rule, content, derivedContent, context) {
  const regex = safeRegExp(rule.pattern, `${rule.flags}g`, "extraction rule pattern"); const matches = []; let match;
  while ((match = regex.exec(content)) !== null) {
    const start = match.index; const matchedText = match[0]; const capturedValue = captureMatch(match, rule.captureGroup, "extraction rule");
    matches.push(createMatch({ rule, derivedContent, matchedText, capturedValue, start, end: start + matchedText.length, ordinal: matches.length + 1, ...context }));
    if (matches.length > rule.maxMatches) return { status: "AMBIGUOUS", matches: [] };
    if (matchedText.length === 0) break;
  }
  return { status: matches.length === 0 ? "NO_MATCH" : "MATCHED", matches };
}

function executeLabelValue(rule, content, derivedContent, context) {
  const lines = sourceLines(content); const labelRegex = safeRegExp(rule.labelPattern, rule.flags, "extraction rule labelPattern"); const valueRegex = safeRegExp(rule.valuePattern, rule.valueFlags, "extraction rule valuePattern"); const matches = [];
  lines.forEach((line, index) => {
    if (!labelRegex.test(line.value)) return;
    for (let offset = 0; offset <= rule.maxLineDistance && index + offset < lines.length; offset += 1) {
      const candidate = lines[index + offset]; const valueMatch = valueRegex.exec(candidate.value); if (!valueMatch) continue;
      const start = candidate.start + valueMatch.index; const matchedText = valueMatch[0]; const capturedValue = captureMatch(valueMatch, rule.captureGroup, "extraction rule value");
      matches.push(createMatch({ rule, derivedContent, matchedText, capturedValue, start, end: start + matchedText.length, ordinal: matches.length + 1, ...context }));
      if (matches.length > rule.maxMatches) return;
      break;
    }
  });
  return { status: matches.length === 0 ? "NO_MATCH" : matches.length > rule.maxMatches ? "AMBIGUOUS" : "MATCHED", matches: matches.length > rule.maxMatches ? [] : matches };
}

function executeDeclarativeTextExtraction({ derivedContent: input, rule: ruleInput, applicability = null, sourceAuthority = null }) {
  const record = derived.validateDerivedContent(input); const rule = validateRule(ruleInput); const contentBytes = Buffer.from(record.content, "utf8");
  assert(contentBytes.length === record.byteLength && derived.digestBytes(contentBytes) === record.contentDigest, "derived content digest mismatch");
  assert(contentBytes.length <= DEFAULTS.maxInputBytes, "derived input exceeds extraction bound");
  const context = { applicability: applicability === undefined ? null : json.immutableClone(applicability), sourceAuthority: sourceAuthority === undefined ? null : json.immutableClone(sourceAuthority) };
  const result = rule.ruleKind === "TEXT_PATTERN" ? executeTextPattern(rule, record.content, record, context) : executeLabelValue(rule, record.content, record, context);
  return json.immutableClone({ schemaVersion: SCHEMA_VERSION, ruleId: rule.id, derivedContentId: record.id, status: result.status, matches: result.matches });
}

function createDeclarativeExtractorAdapter({ derivedContent: input, rule: ruleInput, applicability = null, sourceAuthority = null }) {
  const record = derived.validateDerivedContent(input); const rule = validateRule(ruleInput);
  const declaration = { schemaVersion: extraction.EXTRACTION_SCHEMA_VERSION, adapterId: "declarative-text-extractor", adapterVersion: String(SCHEMA_VERSION), supportedMediaTypes: ["text/plain"], supportedOperations: [extraction.EXTRACTION_OPERATION], deterministic: true, localOnly: true };
  return Object.freeze({ ...declaration, execute(request) {
    assert(request && request.artifact?.id === record.id && request.artifact.contentDigest === record.contentDigest, "declarative extractor artifact binding failed");
    assert(typeof request.content === "string" && extraction.sha256(request.content) === record.contentDigest, "declarative extractor content binding failed");
    const result = executeDeclarativeTextExtraction({ derivedContent: record, rule, applicability, sourceAuthority });
    const candidates = result.matches.map(match => ({ fieldId: match.fieldId, rawValue: match.capturedValue, rawUnit: null, sourceLocation: { page: null, section: "derived text", locator: `lines:${match.sourceLocator.startLine}-${match.sourceLocator.endLine};chars:${match.sourceLocator.startOffset}-${match.sourceLocator.endOffset}`, tableOrSubsection: "document:full" }, extractionMethod: `${declaration.adapterId}/${declaration.adapterVersion}`, applicability: match.applicability, context: { derivedContentId: match.derivedContentId, derivedContentDigest: match.derivedContentDigest, parentArtifactId: match.parentArtifactId, ruleId: match.ruleId, matchedText: match.matchedText, sourceLocator: match.sourceLocator, sourceAuthority: match.sourceAuthority }, ordinal: match.ordinal }));
    return { disposition: result.status === "MATCHED" ? "CANDIDATES-PRODUCED" : result.status === "NO_MATCH" ? "NO-CANDIDATES" : "PERMANENT-EXTRACTION-FAILURE", candidates, observations: [{ type: result.status === "MATCHED" ? "CANDIDATE-EXTRACTED" : "NO-CANDIDATES", detailCode: `DECLARATIVE_${result.status}`, metadata: { ruleId: result.ruleId, count: candidates.length } }] };
  } });
}

module.exports = Object.freeze({ SCHEMA_VERSION, RULE_KINDS, AMBIGUITY_POLICIES, ALLOWED_FLAGS, DEFAULTS, validateRule, validateDeclarativeExtractionRule: validateRule, executeDeclarativeTextExtraction, createDeclarativeExtractorAdapter });
