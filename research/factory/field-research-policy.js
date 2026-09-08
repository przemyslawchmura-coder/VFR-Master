// NON-PRODUCTION manufacturer-neutral field/source authority policy contract.
"use strict";

const crypto = require("node:crypto");
const extraction = require("./extraction-contracts.js");
const json = require("./json.js");

const FIELD_RESEARCH_POLICY_SCHEMA_VERSION = 1;
const SOURCE_CLASSES = Object.freeze(["TIER_A_OEM", "TIER_B_AUTHORIZED", "TIER_C_SPECIALIST", "TIER_D_SECONDARY", "DISCOVERY_ONLY"]);
const SPECIALIST_DOMAINS = Object.freeze(["TIRES", "SPARK_PLUGS", "BATTERIES", "BRAKES", "CHAIN_SPROCKETS", "LUBRICANTS"]);
const FIELD_GROUPS = Object.freeze(["BASIC_FITMENT", "ROUTINE_OWNER_SERVICE", "MAINTENANCE_INTERVALS", "SAFETY_CRITICAL", "INTERNAL_WORKSHOP", "DIAGNOSTICS_ECU_EFI", "OEM_PART_IDENTITY"]);
const AUTHORITY_LEVELS = Object.freeze(["TIER_A_OEM", "TIER_B_AUTHORIZED", "TIER_C_SPECIALIST", "TIER_D_SECONDARY"]);
const CORROBORATION_MODES = Object.freeze(["ONE_EXACT_AUTHORITATIVE", "OEM_CORROBORATION_REQUIRED", "MULTIPLE_INDEPENDENT", "TIER_A_DEEP_ONLY"]);
const APPLICABILITY_DIMENSIONS = Object.freeze(["model", "generation", "modelYear", "market", "abs", "transmission", "equipment", "emissions", "bodyStyle", "variant"]);
const PROVENANCE_REQUIREMENTS = Object.freeze(["sourceIdentity", "sourceLocation", "acquisitionArtifact", "publicationIdentity"]);
const RESULT_STATES = Object.freeze(["ALLOWED", "BLOCKED", "NEEDS_CORROBORATION", "DEEP_PATH_REQUIRED"]);
const SOURCE_STRENGTH = Object.freeze({ TIER_A_OEM: 4, TIER_B_AUTHORIZED: 3, TIER_C_SPECIALIST: 2, TIER_D_SECONDARY: 1, DISCOVERY_ONLY: 0 });
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const uniqueSorted = values => [...new Set(values)].sort();
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex").slice(0, 24);
const isPlainRecord = value => value && typeof value === "object" && !Array.isArray(value);
const POLICY_KEYS = new Set(["fieldId", "fieldGroup", "allowedSourceClasses", "preferredSourceClasses", "forbiddenSourceClasses", "minimumAuthority", "tierAMandatory", "specialistDomain", "corroboration", "requiredApplicability", "requiredProvenance", "fastPathAllowed", "deepPathRequired", "searchBudget"]);

function validateStringList(value, label, allowed) {
  assert(Array.isArray(value) && value.length > 0 && value.every(item => typeof item === "string" && allowed.includes(item)), `${label} contains an unknown value`);
  return uniqueSorted(value);
}

function validateBudget(input) {
  assert(isPlainRecord(input), "searchBudget is required");
  const budget = {};
  ["maxDiscoveryAttempts", "maxAuthenticatedSources", "maxSourceClasses", "maxRawCandidates"].forEach(key => {
    assert(Number.isInteger(input[key]) && input[key] > 0 && input[key] <= 1000, `searchBudget.${key} must be a bounded positive integer`);
    budget[key] = input[key];
  });
  return budget;
}

function validateCorroboration(input) {
  assert(isPlainRecord(input), "corroboration is required");
  assert(CORROBORATION_MODES.includes(input.mode), "corroboration.mode is invalid");
  const output = { mode: input.mode, minimumIndependentSources: input.minimumIndependentSources === undefined ? 0 : input.minimumIndependentSources, exactOemAccepted: input.exactOemAccepted === undefined ? false : input.exactOemAccepted };
  assert(Number.isInteger(output.minimumIndependentSources) && output.minimumIndependentSources >= 0 && output.minimumIndependentSources <= 1000, "corroboration.minimumIndependentSources is invalid");
  assert(typeof output.exactOemAccepted === "boolean", "corroboration.exactOemAccepted is invalid");
  if (input.mode === "ONE_EXACT_AUTHORITATIVE") assert(output.minimumIndependentSources === 0, "one-source corroboration cannot require independent sources");
  if (input.mode === "OEM_CORROBORATION_REQUIRED") assert(output.exactOemAccepted === true, "OEM corroboration must accept an exact OEM source");
  if (input.mode === "MULTIPLE_INDEPENDENT") assert(output.minimumIndependentSources >= 2, "multiple-source corroboration requires at least two independent sources");
  if (input.mode === "TIER_A_DEEP_ONLY") assert(output.minimumIndependentSources === 0 && output.exactOemAccepted === true, "Tier-A-only corroboration has incompatible options");
  return output;
}

function validatePolicyRecord(input, label, fieldOverride = false) {
  assert(isPlainRecord(input), `${label} is required`);
  Object.keys(input).forEach(key => assert(POLICY_KEYS.has(key), `${label}.${key} is not supported`));
  if (fieldOverride) {
    assert(typeof input.fieldId === "string" && extraction.SERVICE_CORE_FIELDS.includes(input.fieldId), `${label}.fieldId is not a canonical Service Core field`);
  } else assert(typeof input.fieldGroup === "string" && FIELD_GROUPS.includes(input.fieldGroup), `${label}.fieldGroup is invalid`);
  if (input.fieldGroup !== undefined) assert(FIELD_GROUPS.includes(input.fieldGroup), `${label}.fieldGroup is invalid`);
  const allowed = validateStringList(input.allowedSourceClasses, `${label}.allowedSourceClasses`, SOURCE_CLASSES);
  const preferred = validateStringList(input.preferredSourceClasses, `${label}.preferredSourceClasses`, SOURCE_CLASSES);
  const forbidden = validateStringList(input.forbiddenSourceClasses, `${label}.forbiddenSourceClasses`, SOURCE_CLASSES);
  assert(preferred.every(item => allowed.includes(item)), `${label}.preferredSourceClasses must be allowed`);
  assert(forbidden.every(item => !allowed.includes(item)), `${label}.forbiddenSourceClasses must not be allowed`);
  assert(!preferred.includes("DISCOVERY_ONLY"), `${label}.DISCOVERY_ONLY cannot be preferred`);
  assert(AUTHORITY_LEVELS.includes(input.minimumAuthority), `${label}.minimumAuthority is invalid`);
  assert(typeof input.tierAMandatory === "boolean", `${label}.tierAMandatory is required`);
  if (input.tierAMandatory) assert(allowed.includes("TIER_A_OEM") && !forbidden.includes("TIER_A_OEM"), `${label}.tierAMandatory requires allowed Tier A`);
  if (input.specialistDomain !== undefined && input.specialistDomain !== null) assert(SPECIALIST_DOMAINS.includes(input.specialistDomain) && allowed.includes("TIER_C_SPECIALIST"), `${label}.specialistDomain requires allowed Tier C`);
  const corroboration = validateCorroboration(input.corroboration);
  const requiredApplicability = validateStringList(input.requiredApplicability, `${label}.requiredApplicability`, APPLICABILITY_DIMENSIONS);
  const requiredProvenance = validateStringList(input.requiredProvenance, `${label}.requiredProvenance`, PROVENANCE_REQUIREMENTS);
  assert(typeof input.fastPathAllowed === "boolean" && typeof input.deepPathRequired === "boolean", `${label}.path flags are required`);
  assert(!(input.fastPathAllowed && input.deepPathRequired), `${label} cannot allow fast path and require deep path together`);
  if (corroboration.mode === "TIER_A_DEEP_ONLY") assert(input.tierAMandatory && input.deepPathRequired && !input.fastPathAllowed, `${label}.Tier-A-only policy is incompatible with path flags`);
  if (input.deepPathRequired) assert(!input.fastPathAllowed, `${label}.deepPathRequired cannot allow fast path`);
  return { ...(input.fieldId ? { fieldId: input.fieldId } : {}), ...(input.fieldGroup ? { fieldGroup: input.fieldGroup } : {}), allowedSourceClasses: allowed, preferredSourceClasses: preferred, forbiddenSourceClasses: forbidden, minimumAuthority: input.minimumAuthority, tierAMandatory: input.tierAMandatory, specialistDomain: input.specialistDomain || null, corroboration, requiredApplicability, requiredProvenance, fastPathAllowed: input.fastPathAllowed, deepPathRequired: input.deepPathRequired, searchBudget: validateBudget(input.searchBudget) };
}

function validateFieldResearchPolicy(input) {
  assert(isPlainRecord(input) && input.schemaVersion === FIELD_RESEARCH_POLICY_SCHEMA_VERSION, `field policy schemaVersion must equal ${FIELD_RESEARCH_POLICY_SCHEMA_VERSION}`);
  json.assertJsonSafe(input);
  assert(Array.isArray(input.groupDefaults) && input.groupDefaults.length > 0, "field policy groupDefaults are required");
  assert(Array.isArray(input.fieldOverrides), "field policy fieldOverrides are required");
  const groups = input.groupDefaults.map((item, index) => validatePolicyRecord(item, `groupDefaults[${index}]`));
  const overrides = input.fieldOverrides.map((item, index) => validatePolicyRecord(item, `fieldOverrides[${index}]`, true));
  assert(new Set(groups.map(item => item.fieldGroup)).size === groups.length, "duplicate field-group policy");
  assert(new Set(overrides.map(item => item.fieldId)).size === overrides.length, "duplicate field override");
  const identity = { schemaVersion: FIELD_RESEARCH_POLICY_SCHEMA_VERSION, groupDefaults: [...groups].sort((a, b) => a.fieldGroup.localeCompare(b.fieldGroup)), fieldOverrides: [...overrides].sort((a, b) => a.fieldId.localeCompare(b.fieldId)) };
  const id = `field-policy.${digest(identity)}`;
  if (input.id !== undefined) assert(input.id === id, "field policy id does not match policy semantics");
  return json.immutableClone({ schemaVersion: FIELD_RESEARCH_POLICY_SCHEMA_VERSION, id, groupDefaults: groups, fieldOverrides: overrides });
}

function resolveFieldResearchPolicy(policyInput, { fieldId = null, fieldGroup = null } = {}) {
  const policy = validateFieldResearchPolicy(policyInput);
  const override = fieldId ? policy.fieldOverrides.find(item => item.fieldId === fieldId) : null;
  const group = fieldGroup ? policy.groupDefaults.find(item => item.fieldGroup === fieldGroup) : null;
  assert(override || group, "no field/group policy exists");
  return json.immutableClone(override || group);
}

function hasApplicability(applicability, dimension) {
  if (!isPlainRecord(applicability)) return false;
  if (dimension === "modelYear") {
    if (applicability.modelYear !== undefined) return applicability.modelYear !== null && (typeof applicability.modelYear === "number" || applicability.modelYear.state === "KNOWN");
    return applicability.years && applicability.years.kind === "EXACT";
  }
  const value = applicability[dimension];
  if (value && typeof value === "object" && "state" in value) return value.state === "KNOWN" && Array.isArray(value.values) && value.values.length > 0;
  return value !== undefined && value !== null;
}

function hasProvenance(provenance, requirements) {
  return isPlainRecord(provenance) && requirements.every(key => {
    const value = provenance[key];
    if (key === "sourceLocation") return isPlainRecord(value) && Object.keys(value).length > 0;
    return value !== undefined && value !== null && value !== "";
  });
}

function evaluateSourceAuthority({ policy: policyInput, sourceClass, specialistDomain = null, applicability, provenance, corroborationState = {} }) {
  const policy = validatePolicyRecord(policyInput, "policy", Boolean(policyInput.fieldId));
  const reasons = [];
  if (!SOURCE_CLASSES.includes(sourceClass)) return Object.freeze({ state: "BLOCKED", reasons: ["UNKNOWN_SOURCE_CLASS"] });
  if (sourceClass === "DISCOVERY_ONLY") return Object.freeze({ state: "BLOCKED", reasons: ["DISCOVERY_ONLY_IS_NOT_AUTHORITY"] });
  if (!policy.allowedSourceClasses.includes(sourceClass) || policy.forbiddenSourceClasses.includes(sourceClass)) return Object.freeze({ state: "BLOCKED", reasons: ["SOURCE_CLASS_NOT_ALLOWED"] });
  if (SOURCE_STRENGTH[sourceClass] < SOURCE_STRENGTH[policy.minimumAuthority]) return Object.freeze({ state: "DEEP_PATH_REQUIRED", reasons: ["MINIMUM_AUTHORITY_NOT_MET"] });
  if (policy.tierAMandatory && sourceClass !== "TIER_A_OEM") return Object.freeze({ state: "DEEP_PATH_REQUIRED", reasons: ["TIER_A_REQUIRED"] });
  if (sourceClass === "TIER_C_SPECIALIST" && policy.specialistDomain && specialistDomain !== policy.specialistDomain) return Object.freeze({ state: "BLOCKED", reasons: ["SPECIALIST_DOMAIN_MISMATCH"] });
  const missingApplicability = policy.requiredApplicability.filter(dimension => !hasApplicability(applicability, dimension));
  if (missingApplicability.length) return Object.freeze({ state: "DEEP_PATH_REQUIRED", reasons: ["REQUIRED_APPLICABILITY_UNRESOLVED"], missingApplicability: Object.freeze(missingApplicability) });
  if (!hasProvenance(provenance, policy.requiredProvenance)) return Object.freeze({ state: "BLOCKED", reasons: ["PROVENANCE_INCOMPLETE"] });
  if (corroborationState.conflict === true) return Object.freeze({ state: "BLOCKED", reasons: ["CONFLICT_REQUIRES_REVIEW"] });
  const independent = Number.isInteger(corroborationState.independentSourceCount) ? corroborationState.independentSourceCount : 0;
  if (policy.corroboration.mode === "TIER_A_DEEP_ONLY") return Object.freeze({ state: sourceClass === "TIER_A_OEM" ? "ALLOWED" : "DEEP_PATH_REQUIRED", reasons: sourceClass === "TIER_A_OEM" ? [] : ["TIER_A_DEEP_ONLY"] });
  if (policy.corroboration.mode === "OEM_CORROBORATION_REQUIRED" && sourceClass !== "TIER_A_OEM" && corroborationState.oemSourcePresent !== true) return Object.freeze({ state: "NEEDS_CORROBORATION", reasons: ["OEM_CORROBORATION_REQUIRED"] });
  if (policy.corroboration.mode === "MULTIPLE_INDEPENDENT" && independent < policy.corroboration.minimumIndependentSources) return Object.freeze({ state: "NEEDS_CORROBORATION", reasons: ["INDEPENDENT_SOURCE_COUNT_INSUFFICIENT"] });
  if (policy.corroboration.mode === "ONE_EXACT_AUTHORITATIVE" && corroborationState.exactAuthoritativeSource !== true) return Object.freeze({ state: "NEEDS_CORROBORATION", reasons: ["EXACT_AUTHORITY_NOT_ESTABLISHED"] });
  if (!policy.fastPathAllowed) return Object.freeze({ state: "DEEP_PATH_REQUIRED", reasons: ["FAST_PATH_NOT_ALLOWED"] });
  return Object.freeze({ state: "ALLOWED", reasons });
}

module.exports = Object.freeze({ FIELD_RESEARCH_POLICY_SCHEMA_VERSION, SOURCE_CLASSES, SPECIALIST_DOMAINS, FIELD_GROUPS, AUTHORITY_LEVELS, CORROBORATION_MODES, APPLICABILITY_DIMENSIONS, PROVENANCE_REQUIREMENTS, RESULT_STATES, validateFieldResearchPolicy, resolveFieldResearchPolicy, evaluateSourceAuthority });
