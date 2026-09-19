"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const cbr = require("../research/data/cbr500r-pc70-technical-profile-identity.js");

const input = { profileIdentity: { targetId: "target.synthetic.model.2024.eu", catalogVariantKey: "synthetic.model", manufacturer: "Synthetic", model: "Model", generation: "I", modelYear: 2024, market: "EU", transmission: "manual", equipment: "standard", abs: true }, catalogueIdentityProof: { source: "repository-catalogue-and-research-target", targetId: "target.synthetic.model.2024.eu", catalogVariantKey: "synthetic.model" } };

test("intended Technical Profile identity reference is generic, deterministic and non-production", () => {
  const first = factory.createTechnicalProfileDefinitionRef(input);
  assert.deepEqual(factory.createTechnicalProfileDefinitionRef(input), first);
  assert.equal(first.id, factory.technicalProfileDefinitionRefId(first));
  assert.equal(first.nonProduction, true);
  assert.equal(first.productionProfileId, null);
  assert.equal(first.registryMembership, "NOT-REGISTERED");
  assert.deepEqual(factory.validateTechnicalProfileDefinitionRef(first), first);
  assert.throws(() => factory.validateTechnicalProfileDefinitionRef("foo"));
  assert.throws(() => factory.createTechnicalProfileDefinitionRef({ ...input, profileIdentity: { ...input.profileIdentity, catalogVariantKey: "unknown" } }));
  assert.throws(() => factory.createTechnicalProfileDefinitionRef({ ...input, profileIdentity: { ...input.profileIdentity, targetId: "target.other.2024.eu" } }));
  assert.throws(() => factory.createTechnicalProfileDefinitionRef({ ...input, catalogueIdentityProof: { ...input.catalogueIdentityProof, source: "unverified" } }));
});

test("CBR500R identity is derived from repository-proven target facts without profile or registry creation", () => {
  const report = cbr.buildReport();
  assert.equal(report.reference.profileIdentity.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(report.reference.profileIdentity.modelYear, 2024);
  assert.equal(report.reference.profileIdentity.abs, true);
  assert.equal(report.reference.nonProduction, true);
  assert.equal(report.productionProfileExists, false);
  assert.equal(report.registryMembership, "NOT-REGISTERED");
  assert.equal(report.productionCreated, false);
});
