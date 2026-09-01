// NON-PRODUCTION Technical Research Factory contracts.
"use strict";

const FACTORY_CONTRACT_VERSION = 1;
const APPLICABILITY_STATES = Object.freeze(["MATCH", "MISMATCH", "UNKNOWN", "PARTIAL"]);
const KNOWLEDGE_STATES = Object.freeze(["KNOWN", "UNKNOWN", "PARTIAL"]);
const TRANSMISSIONS = Object.freeze(["manual", "dct", "automatic", "cvt", "other"]);
const ACCESSIBILITY = Object.freeze(["ACCESSIBLE-OFFICIAL", "ACCESSIBLE-OFFICIAL-REDIRECT", "ACCESSIBLE-OFFICIAL-HTML", "ACCESS-BLOCKED-AUTH", "ACCESS-BLOCKED-403", "ACCESS-BROKEN", "MIRROR-ONLY", "UNKNOWN"]);
const READINESS = Object.freeze(["EXECUTION-READY", "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL", "REGISTERED-NOT-REAUTHENTICATED", "ACCESS-BLOCKED", "SOURCE-IDENTITY-PARTIAL", "EXHAUSTED / LOW-MARGINAL-YIELD", "REJECTED-MISMATCH"]);
const IDENTIFIER_RELATIONSHIPS = Object.freeze(["SINGLE", "SAME-UNDERLYING-PUBLICATION-PROVEN", "REGIONAL-ALIASES-PROVEN", "REGIONAL-EDITIONS-RELATED-BUT-NOT-IDENTICAL", "DISTINCT-PUBLICATIONS-PROVEN", "RELATIONSHIP-UNRESOLVED"]);
const AUTHENTICATION_STATES = Object.freeze(["AUTHENTICATED", "REGISTERED-NOT-REAUTHENTICATED", "PARTIAL", "UNKNOWN", "REJECTED-MISMATCH"]);
const EXHAUSTION_STATES = Object.freeze(["ACTIVE", "EXHAUSTED", "LOW-MARGINAL-YIELD", "UNKNOWN"]);
const MARGINAL_GAP_CLASSES = Object.freeze(["HIGH", "MEDIUM", "LOW", "UNKNOWN"]);
const TARGET_STATES = Object.freeze(["PLANNED", "RESEARCH-MORE", "BLOCKED", "EXHAUSTED", "REVIEW-REQUIRED", "SERVICE-CORE-PARTIAL", "SERVICE-CORE-READY"]);
const YEAR_KINDS = Object.freeze(["EXACT", "RANGE", "UNKNOWN"]);

const plainClone = value => JSON.parse(JSON.stringify(value));
const stableUnique = values => [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b)));
const isId = value => typeof value === "string" && /^[a-z0-9][a-z0-9._:/-]*$/i.test(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const assertVersion = record => assert(record && record.schemaVersion === FACTORY_CONTRACT_VERSION, `factory schemaVersion must equal ${FACTORY_CONTRACT_VERSION}`);
const assertEnum = (value, allowed, label) => assert(allowed.includes(value), `${label} must be one of: ${allowed.join(", ")}`);
const assertStringArray = (value, label, allowEmpty = false) => {
  assert(Array.isArray(value) && (allowEmpty || value.length > 0) && value.every(item => typeof item === "string" && item.length), `${label} must be ${allowEmpty ? "a" : "a non-empty"} string array`);
};

function normalizeKnowledgeSet(input, label, valueValidator = value => typeof value === "string" && value.length > 0) {
  assert(input && typeof input === "object", `${label} is required`);
  assertEnum(input.state, KNOWLEDGE_STATES, `${label}.state`);
  const values = input.values === undefined ? [] : input.values;
  assert(Array.isArray(values) && values.every(valueValidator), `${label}.values are invalid`);
  if (input.state === "KNOWN") assert(values.length > 0, `${label}.values must not be empty when KNOWN`);
  if (input.state === "UNKNOWN") assert(values.length === 0, `${label}.values must be empty when UNKNOWN`);
  return Object.freeze({ state: input.state, values: Object.freeze(stableUnique(values)) });
}

function validateApplicabilityScope(scope) {
  assertVersion(scope);
  assert(scope.model && typeof scope.model === "object", "scope.model is required");
  const model = normalizeKnowledgeSet(scope.model, "scope.model");
  const generation = normalizeKnowledgeSet(scope.generation, "scope.generation");
  assert(scope.years && typeof scope.years === "object", "scope.years is required");
  assertEnum(scope.years.kind, YEAR_KINDS, "scope.years.kind");
  if (scope.years.kind === "UNKNOWN") assert(scope.years.from === null && scope.years.to === null, "unknown years require null bounds");
  else {
    assert(Number.isInteger(scope.years.from) && Number.isInteger(scope.years.to), "known years require integer bounds");
    assert(scope.years.from <= scope.years.to, "year range is reversed");
    if (scope.years.kind === "EXACT") assert(scope.years.from === scope.years.to, "exact year requires equal bounds");
  }
  const markets = normalizeKnowledgeSet(scope.markets, "scope.markets");
  const transmissions = normalizeKnowledgeSet(scope.transmissions, "scope.transmissions", value => TRANSMISSIONS.includes(value));
  const abs = normalizeKnowledgeSet(scope.abs, "scope.abs", value => value === true || value === false);
  const equipment = normalizeKnowledgeSet(scope.equipment, "scope.equipment");
  return Object.freeze({ schemaVersion: FACTORY_CONTRACT_VERSION, model, generation, years: Object.freeze({ kind: scope.years.kind, from: scope.years.from, to: scope.years.to }), markets, transmissions, abs, equipment });
}

function validateResearchTarget(record) {
  assertVersion(record);
  assert(isId(record.id), "ResearchTarget.id is invalid");
  assert(isId(record.catalogVariantKey), "ResearchTarget.catalogVariantKey is invalid");
  assert(typeof record.manufacturer === "string" && record.manufacturer.length, "ResearchTarget.manufacturer is required");
  assert(typeof record.family === "string" && record.family.length, "ResearchTarget.family is required");
  const scope = validateApplicabilityScope(record.scope);
  assert(typeof record.sourcePriorityPolicyId === "string" && record.sourcePriorityPolicyId.length, "ResearchTarget.sourcePriorityPolicyId is required");
  assert(record.serviceCoreBaseline && Number.isInteger(record.serviceCoreBaseline.verified) && Number.isInteger(record.serviceCoreBaseline.total), "ResearchTarget.serviceCoreBaseline is invalid");
  assert(record.serviceCoreBaseline.total === 44 && record.serviceCoreBaseline.verified >= 0 && record.serviceCoreBaseline.verified <= 44, "ResearchTarget Service Core baseline must be within 0..44");
  ["knownSourceRefs", "knownProspectRefs", "researchHistoryRefs", "riskFlags"].forEach(field => assertStringArray(record[field], `ResearchTarget.${field}`, true));
  assertEnum(record.state, TARGET_STATES, "ResearchTarget.state");
  return Object.freeze({ ...plainClone(record), schemaVersion: FACTORY_CONTRACT_VERSION, scope, knownSourceRefs: Object.freeze(stableUnique(record.knownSourceRefs)), knownProspectRefs: Object.freeze(stableUnique(record.knownProspectRefs)), researchHistoryRefs: Object.freeze(stableUnique(record.researchHistoryRefs)), riskFlags: Object.freeze(stableUnique(record.riskFlags)), serviceCoreBaseline: Object.freeze(plainClone(record.serviceCoreBaseline)), gapPlanRef: record.gapPlanRef || null });
}

function validatePublicationIdentifiers(publication) {
  assert(publication && typeof publication === "object", "SourceProspect.publication is required");
  assertEnum(publication.relationship, IDENTIFIER_RELATIONSHIPS, "publication.relationship");
  assert(Array.isArray(publication.identifiers) && publication.identifiers.length > 0, "publication.identifiers must not be empty");
  const identifiers = publication.identifiers.map(item => {
    assert(item && typeof item === "object" && typeof item.value === "string" && item.value.length, "publication identifier value is required");
    assert(typeof item.namespace === "string" && item.namespace.length, "publication identifier namespace is required");
    assertEnum(item.proofState, ["AUTHENTICATED", "CORROBORATED", "UNKNOWN"], "publication identifier proofState");
    return Object.freeze({ value: item.value, namespace: item.namespace, region: item.region || "UNKNOWN", type: item.type || "publication-code", proofState: item.proofState });
  }).sort((a, b) => `${a.namespace}|${a.value}`.localeCompare(`${b.namespace}|${b.value}`));
  if (publication.relationship === "SINGLE") assert(identifiers.length === 1, "SINGLE publication relationship requires exactly one identifier");
  return Object.freeze({ relationship: publication.relationship, identifiers: Object.freeze(identifiers) });
}

function validateSourceProspect(record) {
  assertVersion(record);
  assert(isId(record.id) && isId(record.targetId), "SourceProspect IDs are invalid");
  assert(typeof record.documentClass === "string" && record.documentClass.length, "SourceProspect.documentClass is required");
  assert(record.authority && typeof record.authority.name === "string" && record.authority.name.length, "SourceProspect.authority is required");
  assertEnum(record.authority.state, KNOWLEDGE_STATES, "SourceProspect.authority.state");
  assert(record.documentIdentity && typeof record.documentIdentity.title === "string", "SourceProspect.documentIdentity is required");
  assertEnum(record.documentIdentity.state, KNOWLEDGE_STATES, "SourceProspect.documentIdentity.state");
  if (record.documentIdentity.state === "KNOWN") assert(record.documentIdentity.title.length > 0, "known document identity requires a title");
  const publication = validatePublicationIdentifiers(record.publication);
  assert(Array.isArray(record.officialLocations), "SourceProspect.officialLocations must be an array");
  record.officialLocations.forEach(location => assert(location && typeof location.host === "string" && location.host.length > 0 && typeof location.path === "string" && location.path.length > 0, "official location is invalid"));
  assert(["A", "B", "C", "D"].includes(record.sourceTier), "SourceProspect.sourceTier is invalid");
  assertEnum(record.authenticationState, AUTHENTICATION_STATES, "SourceProspect.authenticationState");
  assert(record.accessibility && typeof record.accessibility === "object", "SourceProspect.accessibility is required");
  assertEnum(record.accessibility.metadata, ACCESSIBILITY, "metadata accessibility");
  assertEnum(record.accessibility.fullContent, ACCESSIBILITY, "full-content accessibility");
  const applicability = validateApplicabilityScope(record.applicability);
  assertEnum(record.exhaustionState, EXHAUSTION_STATES, "SourceProspect.exhaustionState");
  assertEnum(record.expectedMarginalGapClass, MARGINAL_GAP_CLASSES, "SourceProspect.expectedMarginalGapClass");
  assertEnum(record.readinessClassification, READINESS, "SourceProspect.readinessClassification");
  ["priorAttemptRefs", "blockers"].forEach(field => assertStringArray(record[field], `SourceProspect.${field}`, true));
  assert(typeof record.nextAction === "string", "SourceProspect.nextAction is required");
  return Object.freeze({ ...plainClone(record), schemaVersion: FACTORY_CONTRACT_VERSION, publication, applicability, officialLocations: Object.freeze(record.officialLocations.map(plainClone).sort((a, b) => `${a.host}${a.path}`.localeCompare(`${b.host}${b.path}`))), priorAttemptRefs: Object.freeze(stableUnique(record.priorAttemptRefs)), blockers: Object.freeze(stableUnique(record.blockers)) });
}

function validateGapPlan(record, serviceCoreFields) {
  assertVersion(record);
  assert(isId(record.id) && isId(record.targetId), "GapPlan IDs are invalid");
  assert(Array.isArray(serviceCoreFields) && serviceCoreFields.length === 44, "canonical Service Core must contain 44 fields");
  const allowed = new Set(serviceCoreFields);
  ["remainingFields", "safetyCriticalRemainingFields", "researchedNoEvidenceFields", "conflictedFields"].forEach(field => {
    assertStringArray(record[field], `GapPlan.${field}`, true);
    assert(record[field].every(value => allowed.has(value)), `GapPlan.${field} contains a non-Service-Core field`);
  });
  assert(record.startingCoverage && Number.isInteger(record.startingCoverage.verified) && record.startingCoverage.verified >= 0 && record.startingCoverage.verified <= 44 && record.startingCoverage.total === 44, "GapPlan.startingCoverage is invalid");
  assertStringArray(record.attemptedSourceClasses, "GapPlan.attemptedSourceClasses", true);
  assert(record.sourceClassRelevance && typeof record.sourceClassRelevance === "object" && !Array.isArray(record.sourceClassRelevance), "GapPlan.sourceClassRelevance is invalid");
  assertEnum(record.expectedMarginalOpportunity, MARGINAL_GAP_CLASSES, "GapPlan.expectedMarginalOpportunity");
  return Object.freeze({ ...plainClone(record), remainingFields: Object.freeze(stableUnique(record.remainingFields)), safetyCriticalRemainingFields: Object.freeze(stableUnique(record.safetyCriticalRemainingFields)), researchedNoEvidenceFields: Object.freeze(stableUnique(record.researchedNoEvidenceFields)), conflictedFields: Object.freeze(stableUnique(record.conflictedFields)), attemptedSourceClasses: Object.freeze(stableUnique(record.attemptedSourceClasses)) });
}

const stableSerialize = record => JSON.stringify(record);

module.exports = Object.freeze({ FACTORY_CONTRACT_VERSION, APPLICABILITY_STATES, KNOWLEDGE_STATES, TRANSMISSIONS, ACCESSIBILITY, READINESS, IDENTIFIER_RELATIONSHIPS, AUTHENTICATION_STATES, EXHAUSTION_STATES, MARGINAL_GAP_CLASSES, TARGET_STATES, YEAR_KINDS, validateApplicabilityScope, validateResearchTarget, validateSourceProspect, validateGapPlan, stableSerialize });
