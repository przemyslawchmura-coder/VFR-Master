"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const reevaluation = require("../research/data/cbr500r-pc70-registry-requirement-reevaluation.js");

test("CBR500R registry requirement becomes ready from typed non-production refs", () => {
  const result = reevaluation.buildResult();
  const generic = result.materializationAuthorization;
  const registry = generic.requirements.find(item => item.type === "REGISTRY-INSERTION");
  assert.equal(result.priorResultId, "materialization-authorization.1ecd058954cf8f9084d5b6ec");
  assert.deepEqual(registry.requiredInputs, ["applicability-ref", "catalogue-identity-ref", "profile-definition-ref"]);
  assert.equal(registry.state, "READY");
  assert.deepEqual(registry.missingInputs, []);
  assert.deepEqual(registry.reasons, []);
  assert.ok(generic.requirements.every(item => item.state === "READY"));
  assert.equal(generic.aggregateState, "REQUIREMENTS-READY");
  assert.deepEqual(generic.aggregateReasons, []);
  assert.equal(generic.humanAuthorizationRequired, true);
  assert.equal(generic.materializationAllowed, false);
  assert.equal(generic.productionCreated, false);
});

test("CBR500R registry refs preserve bounded identity and non-production state", () => {
  const result = reevaluation.buildResult();
  const { applicabilityRef, catalogueIdentityRef, profileDefinitionRef } = result;
  factory.validateApplicabilityRef(applicabilityRef);
  factory.validateCatalogueIdentityRef(catalogueIdentityRef);
  factory.validateTechnicalProfileDefinitionRef(profileDefinitionRef);
  assert.equal(applicabilityRef.targetIdentity.targetId, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(applicabilityRef.targetIdentity.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(applicabilityRef.applicability.abs, true);
  assert.deepEqual(applicabilityRef.applicability.market, ["USA", "Canada"]);
  assert.equal(applicabilityRef.verificationId, "applicability-verification.08059a67abc9eb226cb3fc82");
  assert.deepEqual(catalogueIdentityRef.targetIdentity, applicabilityRef.targetIdentity);
  assert.equal(catalogueIdentityRef.productionProfileId, null);
  assert.equal(catalogueIdentityRef.registryMembership, "NOT-REGISTERED");
  assert.equal(applicabilityRef.nonProduction, true);
  assert.equal(catalogueIdentityRef.nonProduction, true);
  assert.equal(profileDefinitionRef.id, "technical-profile-definition-ref.591043e27bf2c2519dbf4529");
});

test("CBR500R registry reevaluation is deterministic and rejects forged refs", () => {
  const first = reevaluation.buildResult();
  const second = reevaluation.buildResult();
  assert.deepEqual(first, second);
  assert.equal(first.materializationAuthorization.id, "materialization-authorization.bf37694c61c2dad9c3b77c45");
  assert.equal(first.applicabilityRef.id, "applicability-ref.9e0a4e330fafd980f75b93ea");
  assert.equal(first.catalogueIdentityRef.id, "catalogue-identity-ref.706be3eccbd2db998f0264ac");
  assert.throws(() => factory.assertCompatibleRegistryInputs("foo", first.catalogueIdentityRef, first.profileDefinitionRef, first.materializationAuthorization.productionAuthorizationId), /schemaVersion|Applicability/i);
  const forged = { ...first.catalogueIdentityRef, targetIdentity: { ...first.catalogueIdentityRef.targetIdentity, catalogVariantKey: "honda.other.model" } };
  assert.throws(() => factory.assertCompatibleRegistryInputs(first.applicabilityRef, forged, first.profileDefinitionRef, first.materializationAuthorization.productionAuthorizationId), /id is unstable|target\/catalog identity mismatch|target identity/i);
});
