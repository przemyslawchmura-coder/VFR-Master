"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const fz1 = require("../research/data/identity-mappings/fz1.js");

const unknown = () => ({ state: "UNKNOWN", values: [] });
const known = values => ({ state: "KNOWN", values });
const evidenceScope = (overrides = {}) => ({
  schemaVersion: 1,
  model: unknown(), generation: unknown(), years: { kind: "UNKNOWN", from: null, to: null },
  markets: unknown(), transmissions: unknown(), abs: unknown(), equipment: unknown(), bodyStyles: unknown(), ...overrides
});

test("FZS1000 mapping is isolated from later FZ1 identities", () => {
  const result = factory.resolveIdentityMapping(fz1.fz1Gen1, evidenceScope({ years: { kind: "EXACT", from: 2003, to: 2003 } }));
  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.runtimeIdentities, ["yamaha.fz-fazer.fzs1000"]);
  assert.ok(result.evaluations.every(entry => !entry.catalogVariantKey.startsWith("yamaha.fz1.gen2")));
});

test("FZ1 gen2 mapping keeps N and S as separate runtime identities", () => {
  const result = factory.resolveIdentityMapping(fz1.fz1Gen2, evidenceScope({
    years: { kind: "EXACT", from: 2010, to: 2010 }, bodyStyles: known(["naked", "faired"])
  }));
  assert.equal(result.status, "RESOLVED");
  assert.deepEqual(result.runtimeIdentities, ["yamaha.fz1.gen2.n", "yamaha.fz1.gen2.s"]);
  assert.notEqual(result.runtimeIdentities[0], result.runtimeIdentities[1]);
});

test("N-only, S-only and unresolved body-style applicability fail closed", () => {
  const nOnly = factory.resolveIdentityMapping(fz1.fz1Gen2, evidenceScope({ years: { kind: "EXACT", from: 2010, to: 2010 }, bodyStyles: known(["naked"]) }));
  const sOnly = factory.resolveIdentityMapping(fz1.fz1Gen2, evidenceScope({ years: { kind: "EXACT", from: 2010, to: 2010 }, bodyStyles: known(["faired"]) }));
  const unknownBody = factory.resolveIdentityMapping(fz1.fz1Gen2, evidenceScope({ years: { kind: "EXACT", from: 2010, to: 2010 } }));
  assert.deepEqual(nOnly.runtimeIdentities, ["yamaha.fz1.gen2.n"]);
  assert.deepEqual(sOnly.runtimeIdentities, ["yamaha.fz1.gen2.s"]);
  assert.equal(unknownBody.status, "UNRESOLVED");
  assert.deepEqual(unknownBody.runtimeIdentities, []);
});

test("ABS and model-year constraints remain explicit", () => {
  const mapping = factory.createIdentityMapping({
    researchIdentity: { role: "grouping", key: "fixture.abs-group" },
    runtimeIdentities: [
      { catalogVariantKey: "fixture.abs", applicability: { ...evidenceScope({ years: { kind: "RANGE", from: 2020, to: 2022 }, abs: known([true]) }) } },
      { catalogVariantKey: "fixture.non-abs", applicability: { ...evidenceScope({ years: { kind: "RANGE", from: 2020, to: 2022 }, abs: known([false]) }) } }
    ]
  });
  const abs = factory.resolveIdentityMapping(mapping, evidenceScope({ years: { kind: "EXACT", from: 2021, to: 2021 }, abs: known([true]) }));
  const unknownAbs = factory.resolveIdentityMapping(mapping, evidenceScope({ years: { kind: "EXACT", from: 2021, to: 2021 } }));
  const outsideYears = factory.resolveIdentityMapping(mapping, evidenceScope({ years: { kind: "EXACT", from: 2023, to: 2023 }, abs: known([true, false]) }));
  assert.deepEqual(abs.runtimeIdentities, ["fixture.abs"]);
  assert.equal(unknownAbs.status, "UNRESOLVED");
  assert.equal(outsideYears.status, "MISMATCH");
});

test("mapping ordering, IDs and JSON replay are deterministic", () => {
  const reversed = factory.createIdentityMapping({ researchIdentity: { role: "grouping", key: "yamaha.fz1.gen2" }, runtimeIdentities: [...fz1.fz1Gen2.runtimeIdentities].reverse() });
  assert.equal(reversed.id, fz1.fz1Gen2.id);
  assert.deepEqual(reversed, fz1.fz1Gen2);
  assert.deepEqual(factory.validateIdentityMapping(JSON.parse(JSON.stringify(fz1.fz1Gen2))), fz1.fz1Gen2);
});

test("existing single-runtime targets remain compatible and optional mappings stay explicit", () => {
  const target = factory.validateResearchTarget({
    schemaVersion: 1, id: "target.fixture.model.2021.eu", catalogVariantKey: "fixture.model", manufacturer: "Fixture", family: "Fixture Model",
    scope: { ...evidenceScope({ model: known(["fixture.model"]), generation: known(["gen1"]), years: { kind: "EXACT", from: 2021, to: 2021 }, markets: known(["EU"]), transmissions: known(["manual"]), abs: known([false]), equipment: known(["standard"]) }) },
    sourcePriorityPolicyId: "tier-ab-practical-marginal-v1", serviceCoreBaseline: { verified: 0, total: 44 }, gapPlanRef: null,
    knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE"
  });
  assert.equal(target.catalogVariantKey, "fixture.model");
  assert.equal(target.identityMapping, undefined);
  const mapped = factory.validateResearchTarget({ ...target, identityMapping: factory.createIdentityMapping({ researchIdentity: { role: "grouping", key: "fixture.model" }, runtimeIdentities: [{ catalogVariantKey: "fixture.model", applicability: target.scope }] }) });
  assert.equal(mapped.identityMapping.researchIdentity.role, "grouping");
});
