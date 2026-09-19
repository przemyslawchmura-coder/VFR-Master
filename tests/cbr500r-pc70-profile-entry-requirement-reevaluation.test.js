"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const reevaluation = require("../research/data/cbr500r-pc70-profile-entry-requirement-reevaluation.js");

test("CBR500R profile entry requirement is ready without enabling materialization", () => {
  const result = reevaluation.buildResult();
  const generic = result.materializationAuthorization;
  assert.equal(result.priorResultId, "materialization-authorization.c502d73aa436d3605af55040");
  assert.equal(generic.productionAuthorizationId, "production-authorization.42dfc09d17938fb18e6dc92d");
  assert.equal(generic.requirements.find(item => item.type === "PRODUCTION-DOCUMENT-MATERIALIZATION").state, "READY");
  assert.equal(generic.requirements.find(item => item.type === "PRODUCTION-CITATION-MATERIALIZATION").state, "READY");
  const profile = generic.requirements.find(item => item.type === "TECHNICAL-PROFILE-ENTRY-MATERIALIZATION");
  assert.deepEqual(profile.requiredInputs, ["citation-definition-ref", "profile-entry-definition-ref", "profile-definition-ref"]);
  assert.equal(profile.state, "READY");
  assert.deepEqual(profile.missingInputs, []);
  assert.deepEqual(profile.reasons, []);
  assert.equal(generic.requirements.find(item => item.type === "REGISTRY-INSERTION").state, "PENDING");
  assert.equal(generic.aggregateState, "REQUIREMENTS-PENDING");
  assert.equal(generic.materializationAllowed, false);
  assert.equal(generic.productionCreated, false);
});

test("CBR500R profile entry reference preserves bounded identity and value", () => {
  const result = reevaluation.buildResult();
  const profile = result.profileDefinitionRef;
  const entry = result.profileEntryDefinitionRef;
  factory.validateTechnicalProfileDefinitionRef(profile);
  factory.validateTechnicalProfileEntryDefinitionRef(entry);
  assert.equal(profile.id, "technical-profile-definition-ref.591043e27bf2c2519dbf4529");
  assert.equal(entry.targetIdentity.targetId, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(entry.targetIdentity.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(entry.categoryId, "lubrication");
  assert.equal(entry.entryId, "lubrication.engine-oil.specification");
  assert.equal(entry.entryType, "fluid");
  assert.equal(entry.value.text, result.materializationAuthorization.proposedProduction.value.text);
  assert.equal(entry.citationDefinitionRefId, "citation-definition-ref.2a37207884a04eae3ec5f684");
  assert.equal(entry.nonProduction, true);
  assert.equal(profile.nonProduction, true);
  assert.equal(profile.productionProfileId, null);
  assert.equal(profile.registryMembership, "NOT-REGISTERED");
  assert.equal(result.materializationAuthorization.targetApplicability.abs, "KNOWN");
});

test("CBR500R profile entry reevaluation is deterministic and input-safe", () => {
  const first = reevaluation.buildResult();
  const second = reevaluation.buildResult();
  assert.deepEqual(first, second);
  assert.equal(first.materializationAuthorization.id, "materialization-authorization.1ecd058954cf8f9084d5b6ec");
  assert.equal(first.profileEntryDefinitionRef.id, "technical-profile-entry-definition-ref.5e01b17a3e241767d46750b3");
  assert.equal(factory.orchestrationJson.canonicalSerialize(first), factory.orchestrationJson.canonicalSerialize(second));
  assert.equal(first.assertions.noMaterialization, true);
  assert.equal(first.assertions.noNormalization, true);
  assert.equal(first.assertions.historicalAbsUnchanged, true);
});

test("profile entry compatibility rejects mismatched references and arbitrary strings", () => {
  const result = reevaluation.buildResult();
  assert.throws(() => factory.assertCompatibleTechnicalProfileEntry(result.profileDefinitionRef, "foo", result.citationDefinitionRef, result.materializationAuthorization.productionAuthorizationId), /schemaVersion|profile/i);
  const forged = { ...result.profileEntryDefinitionRef, targetIdentity: { ...result.profileEntryDefinitionRef.targetIdentity, catalogVariantKey: "honda.other.model" } };
  assert.throws(() => factory.assertCompatibleTechnicalProfileEntry(result.profileDefinitionRef, forged, result.citationDefinitionRef, result.materializationAuthorization.productionAuthorizationId), /id is unstable|target identity/i);
});
