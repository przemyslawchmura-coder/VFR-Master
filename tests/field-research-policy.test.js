"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const riderCoreMatrix = require("../js/technical/technical-profile-core-matrix.js");
const fixture = require("../research/data/field-research-policy-fixture.js");

const known = values => ({ state: "KNOWN", values });
const applicability = (overrides = {}) => ({ model: known(["synthetic.model"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), abs: known([false]), transmissions: known(["manual"]), equipment: known(["standard"]), emissions: known(["EURO"]), bodyStyle: known(["standard"]), variant: known(["base"]), ...overrides });
const provenance = () => ({ sourceIdentity: "source.synthetic", sourceLocation: { page: 1, section: "Synthetic", locator: "table:1" }, acquisitionArtifact: "artifact.synthetic" });
const base = { fieldGroup: "ROUTINE_OWNER_SERVICE", allowedSourceClasses: ["TIER_A_OEM"], preferredSourceClasses: ["TIER_A_OEM"], forbiddenSourceClasses: ["DISCOVERY_ONLY"], minimumAuthority: "TIER_A_OEM", tierAMandatory: true, specialistDomain: null, corroboration: { mode: "ONE_EXACT_AUTHORITATIVE", minimumIndependentSources: 0, exactOemAccepted: false }, requiredApplicability: ["model", "modelYear"], requiredProvenance: ["sourceIdentity", "sourceLocation"], fastPathAllowed: true, deepPathRequired: false, searchBudget: { maxDiscoveryAttempts: 1, maxAuthenticatedSources: 1, maxSourceClasses: 1, maxRawCandidates: 1 } };
const policy = overrides => factory.validateFieldResearchPolicy({ schemaVersion: 1, groupDefaults: [{ ...base, ...overrides }], fieldOverrides: [] });

test("source classes, domains and applicability vocabulary are closed", () => {
  assert.throws(() => policy({ allowedSourceClasses: ["TIER_X"] }), /unknown value/);
  assert.throws(() => policy({ specialistDomain: "NGK" }), /specialistDomain/);
  assert.throws(() => policy({ requiredApplicability: ["country"] }), /unknown value/);
});

test("policy identity is deterministic, immutable and supports group defaults plus field overrides", () => {
  const one = factory.validateFieldResearchPolicy(fixture); const two = factory.validateFieldResearchPolicy({ ...fixture, groupDefaults: [...fixture.groupDefaults].reverse() });
  assert.equal(one.id, two.id); assert.equal(Object.isFrozen(one), true); assert.equal(Object.isFrozen(one.groupDefaults[0]), true);
  assert.throws(() => { one.groupDefaults[0].fieldGroup = "X"; }, TypeError);
  const override = factory.validateFieldResearchPolicy({ ...fixture, fieldOverrides: [{ ...base, fieldId: "lubrication.oil-specification" }] });
  assert.equal(factory.resolveFieldResearchPolicy(override, { fieldId: "lubrication.oil-specification" }).fieldId, "lubrication.oil-specification");
});

test("discovery-only, tier-A mandatory and specialist-domain rules fail closed", () => {
  const p = policy();
  assert.equal(factory.evaluateSourceAuthority({ policy: p.groupDefaults[0], sourceClass: "DISCOVERY_ONLY", applicability: applicability(), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "BLOCKED");
  assert.equal(factory.evaluateSourceAuthority({ policy: p.groupDefaults[0], sourceClass: "TIER_B_AUTHORIZED", applicability: applicability(), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "BLOCKED");
  const specialist = factory.validateFieldResearchPolicy({ ...fixture, groupDefaults: [{ ...fixture.groupDefaults[0], fieldGroup: "BASIC_FITMENT" }] }).groupDefaults[0];
  assert.equal(factory.evaluateSourceAuthority({ policy: specialist, sourceClass: "TIER_C_SPECIALIST", specialistDomain: "BATTERIES", applicability: applicability(), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "BLOCKED");
});

test("fast-path authority requires applicability, provenance and corroboration", () => {
  const p = policy().groupDefaults[0];
  assert.equal(factory.evaluateSourceAuthority({ policy: p, sourceClass: "TIER_A_OEM", applicability: applicability(), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "ALLOWED");
  assert.equal(factory.evaluateSourceAuthority({ policy: p, sourceClass: "TIER_A_OEM", applicability: applicability({ markets: { state: "UNKNOWN", values: [] } }), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "ALLOWED");
  assert.equal(factory.evaluateSourceAuthority({ policy: p, sourceClass: "TIER_A_OEM", applicability: applicability({ years: { kind: "UNKNOWN", from: null, to: null } }), provenance: provenance(), corroborationState: { exactAuthoritativeSource: true } }).state, "DEEP_PATH_REQUIRED");
  assert.equal(factory.evaluateSourceAuthority({ policy: p, sourceClass: "TIER_A_OEM", applicability: applicability(), provenance: {}, corroborationState: { exactAuthoritativeSource: true } }).state, "BLOCKED");
  assert.equal(factory.evaluateSourceAuthority({ policy: p, sourceClass: "TIER_A_OEM", applicability: applicability(), provenance: provenance(), corroborationState: {} }).state, "NEEDS_CORROBORATION");
});

test("corroboration and deep-only policies use closed result states", () => {
  const multiple = policy({ allowedSourceClasses: ["TIER_A_OEM", "TIER_D_SECONDARY"], preferredSourceClasses: ["TIER_A_OEM"], forbiddenSourceClasses: ["DISCOVERY_ONLY"], minimumAuthority: "TIER_D_SECONDARY", tierAMandatory: false, corroboration: { mode: "MULTIPLE_INDEPENDENT", minimumIndependentSources: 2, exactOemAccepted: false } }).groupDefaults[0];
  const input = { policy: multiple, sourceClass: "TIER_D_SECONDARY", applicability: applicability(), provenance: provenance(), corroborationState: { independentSourceCount: 1 } };
  assert.equal(factory.evaluateSourceAuthority(input).state, "NEEDS_CORROBORATION");
  assert.equal(factory.evaluateSourceAuthority({ ...input, corroborationState: { independentSourceCount: 2 } }).state, "ALLOWED");
  assert.equal(factory.evaluateSourceAuthority({ ...input, corroborationState: { independentSourceCount: 2, conflict: true } }).state, "BLOCKED");
  assert.throws(() => policy({ fastPathAllowed: false, deepPathRequired: false, corroboration: { mode: "TIER_A_DEEP_ONLY", minimumIndependentSources: 0, exactOemAccepted: true } }), /Tier-A-only/);
  assert.throws(() => policy({ fastPathAllowed: true, deepPathRequired: true }), /cannot allow fast path/);
});

test("budgets, executable configuration and unknown fields are rejected", () => {
  assert.throws(() => policy({ searchBudget: { maxDiscoveryAttempts: 0, maxAuthenticatedSources: 1, maxSourceClasses: 1, maxRawCandidates: 1 } }), /bounded positive/);
  assert.throws(() => policy({ searchBudget: { maxDiscoveryAttempts: Infinity, maxAuthenticatedSources: 1, maxSourceClasses: 1, maxRawCandidates: 1 } }), /finite JSON/);
  assert.throws(() => policy({ match: () => true }), /JSON-safe/);
  assert.throws(() => factory.validateFieldResearchPolicy({ ...fixture, fieldOverrides: [{ ...base, fieldId: "synthetic.unknown" }] }), /canonical Service Core/);
});

test("representative fixture has no manufacturer values and core invariants remain frozen", () => {
  const p = factory.validateFieldResearchPolicy(fixture);
  assert.equal(p.groupDefaults.length, 3);
  assert.equal(riderCoreMatrix.fieldIds.length, 95);
  assert.equal(riderCoreMatrix.domains.length, 14);
  assert.equal(factory.LEGACY_SERVICE_CORE_FIELDS.length, 44);
  assert.equal(JSON.stringify(p).includes("Yamaha"), false);
  assert.equal(JSON.stringify(p).includes("Honda"), false);
  assert.equal(JSON.stringify(p).includes("Ducati"), false);
});
