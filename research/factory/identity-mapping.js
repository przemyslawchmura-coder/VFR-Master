// NON-PRODUCTION deterministic research-to-runtime identity mapping.
"use strict";

const crypto = require("node:crypto");
const contracts = require("./contracts.js");
const json = require("./json.js");

const IDENTITY_MAPPING_SCHEMA_VERSION = 1;
const MAPPING_STATUSES = Object.freeze(["RESOLVED", "UNRESOLVED", "MISMATCH"]);
const DIMENSIONS = Object.freeze(["model", "generation", "years", "markets", "transmissions", "abs", "equipment", "bodyStyles"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const isId = value => typeof value === "string" && /^[a-z0-9][a-z0-9._:/-]*$/i.test(value);
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);

function identityMappingId(identity) {
  return `identity-mapping.${digest({ kind: "research-to-runtime", ...identity })}`;
}

function validateIdentityMapping(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === IDENTITY_MAPPING_SCHEMA_VERSION, `identity mapping schemaVersion must equal ${IDENTITY_MAPPING_SCHEMA_VERSION}`);
  assert(input.researchIdentity && input.researchIdentity.role === "grouping" && isId(input.researchIdentity.key), "researchIdentity grouping key is invalid");
  assert(Array.isArray(input.runtimeIdentities) && input.runtimeIdentities.length > 0, "runtimeIdentities must not be empty");
  const runtimeIdentities = input.runtimeIdentities.map((entry, index) => {
    assert(entry && isId(entry.catalogVariantKey), `runtimeIdentities[${index}].catalogVariantKey is invalid`);
    return { catalogVariantKey: entry.catalogVariantKey, applicability: contracts.validateApplicabilityScope(entry.applicability) };
  }).sort((a, b) => a.catalogVariantKey.localeCompare(b.catalogVariantKey));
  assert(new Set(runtimeIdentities.map(entry => entry.catalogVariantKey)).size === runtimeIdentities.length, "runtimeIdentities must be unique");
  const canonical = { schemaVersion: IDENTITY_MAPPING_SCHEMA_VERSION, researchIdentity: { role: "grouping", key: input.researchIdentity.key }, runtimeIdentities };
  assert(input.id === identityMappingId(canonical), "identity mapping id is unstable");
  return json.immutableClone({ ...canonical, id: input.id });
}

function createIdentityMapping({ researchIdentity, runtimeIdentities }) {
  const canonicalInput = { schemaVersion: IDENTITY_MAPPING_SCHEMA_VERSION, researchIdentity: { role: "grouping", key: researchIdentity.key }, runtimeIdentities: runtimeIdentities.map(entry => ({ catalogVariantKey: entry.catalogVariantKey, applicability: entry.applicability })).sort((a, b) => a.catalogVariantKey.localeCompare(b.catalogVariantKey)) };
  return validateIdentityMapping({ ...canonicalInput, id: identityMappingId(canonicalInput) });
}

function knowledgeResult(mappingSet, evidenceSet) {
  if (mappingSet.state === "UNKNOWN") return "MATCH";
  if (mappingSet.state !== "KNOWN") return "UNRESOLVED";
  if (evidenceSet.state !== "KNOWN") return "UNRESOLVED";
  return mappingSet.values.some(value => evidenceSet.values.includes(value)) ? "MATCH" : "MISMATCH";
}

function yearResult(mappingYears, evidenceYears) {
  if (evidenceYears.kind === "UNKNOWN") return "UNRESOLVED";
  if (evidenceYears.to < mappingYears.from || evidenceYears.from > mappingYears.to) return "MISMATCH";
  return "MATCH";
}

function resolveIdentityMapping(mappingInput, evidenceApplicability) {
  const mapping = validateIdentityMapping(mappingInput);
  const evidence = contracts.validateApplicabilityScope(evidenceApplicability);
  const evidenceBodyStyles = evidence.bodyStyles || { state: "UNKNOWN", values: [] };
  const constrained = new Set(DIMENSIONS.filter(dimension => mapping.runtimeIdentities.some(entry => dimension === "years" ? entry.applicability.years.kind !== "UNKNOWN" : entry.applicability[dimension].state !== "UNKNOWN")));
  const evaluations = mapping.runtimeIdentities.map(entry => {
    const checks = DIMENSIONS.filter(dimension => constrained.has(dimension)).map(dimension => dimension === "years" ? yearResult(entry.applicability.years, evidence.years) : knowledgeResult(entry.applicability[dimension], dimension === "bodyStyles" ? evidenceBodyStyles : evidence[dimension]));
    return { catalogVariantKey: entry.catalogVariantKey, result: checks.includes("UNRESOLVED") ? "UNRESOLVED" : checks.includes("MISMATCH") ? "MISMATCH" : "MATCH" };
  });
  const unresolved = evaluations.some(entry => entry.result === "UNRESOLVED");
  const matched = evaluations.filter(entry => entry.result === "MATCH").map(entry => entry.catalogVariantKey);
  const status = unresolved ? "UNRESOLVED" : matched.length ? "RESOLVED" : "MISMATCH";
  return json.immutableClone({ schemaVersion: IDENTITY_MAPPING_SCHEMA_VERSION, id: mapping.id, researchIdentity: mapping.researchIdentity, status, runtimeIdentities: status === "RESOLVED" ? matched : [], evaluations });
}

module.exports = Object.freeze({ IDENTITY_MAPPING_SCHEMA_VERSION, MAPPING_STATUSES, DIMENSIONS, identityMappingId, createIdentityMapping, validateIdentityMapping, resolveIdentityMapping });
