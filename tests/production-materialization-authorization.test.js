"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const cbr = require("../research/data/cbr500r-pc70-production-materialization-authorization.js");

function readyFixture() {
  const result = {
    schemaVersion: 1,
    id: "placeholder",
    productionAuthorizationId: "production-authorization.fixture000000001",
    productionAuthorizationState: "AUTHORIZATION-READY",
    productionAuthorizationReasons: [],
    declaredRequirements: [...factory.REQUIREMENT_TYPES].sort(),
    requirements: [...factory.REQUIREMENT_TYPES].sort().map(type => ({ type, state: "READY", requiredInputs: [...factory.REQUIRED_INPUTS[type]], missingInputs: [], reasons: [] })),
    aggregateState: "REQUIREMENTS-READY",
    aggregateReasons: [],
    humanAuthorizationRequired: true,
    materializationAllowed: false,
    lineage: { productionAuthorizationId: "production-authorization.fixture000000001", materializationRequirementsAuthorizationId: "materialization-authorization.fixture000000001" },
    sourceIdentity: { sourceId: "source.fixture", prospectId: "prospect.fixture", documentId: "document.fixture", authority: "OEM", tier: "A" },
    rawSource: { rawValue: "raw", provenance: { sourceLocation: { locator: "page:1" } } },
    targetIdentity: { id: "target.fixture.model", catalogVariantKey: "fixture.model" },
    targetApplicability: { modelYear: "KNOWN", market: "KNOWN", transmission: "KNOWN", equipment: "SUFFICIENT", abs: "KNOWN" },
    proposedProduction: { categoryId: "lubrication", entryId: "lubrication.engine-oil.specification", type: "fluid", value: { type: "text", text: "raw" } },
    productionCreated: false
  };
  result.id = factory.materializationRequirementsAuthorizationId(result);
  result.lineage.materializationRequirementsAuthorizationId = result.id;
  return result;
}

test("requirements-ready without a human decision remains unauthorized", () => {
  const result = factory.authorizeProductionMaterialization(readyFixture());
  assert.equal(result.authorizationState, "PENDING-MATERIALIZATION-AUTHORIZATION");
  assert.equal(result.materializationAllowed, false);
  assert.equal(result.productionCreated, false);
  assert.deepEqual(result.reasons, ["HUMAN-AUTHORIZATION-PENDING"]);
});

test("explicit approval authorizes only a future materialization boundary", () => {
  const input = readyFixture();
  const decision = factory.createProductionMaterializationDecision(input.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "All four generic requirements are ready and the bounded production target is explicitly approved for the next materialization boundary." });
  const result = factory.authorizeProductionMaterialization(input, decision);
  assert.equal(result.authorizationState, "AUTHORIZED-FOR-MATERIALIZATION");
  assert.equal(result.materializationAllowed, true);
  assert.equal(result.productionCreated, false);
});

test("rejection remains unauthorized", () => {
  const input = readyFixture();
  const decision = factory.createProductionMaterializationDecision(input.id, { decision: "REJECT-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Do not proceed." });
  const result = factory.authorizeProductionMaterialization(input, decision);
  assert.equal(result.authorizationState, "REJECTED-FOR-MATERIALIZATION");
  assert.equal(result.materializationAllowed, false);
  assert.ok(result.reasons.includes("HUMAN-MATERIALIZATION-REJECTED"));
});

test("non-ready, malformed, stale and mismatched inputs fail closed", () => {
  const input = readyFixture();
  const blocked = { ...input, aggregateState: "REQUIREMENTS-PENDING", aggregateReasons: ["X"] };
  blocked.id = factory.materializationRequirementsAuthorizationId(blocked);
  assert.equal(factory.authorizeProductionMaterialization(blocked).authorizationState, "BLOCKED-MATERIALIZATION-AUTHORIZATION");
  assert.throws(() => factory.authorizeProductionMaterialization({ ...input, declaredRequirements: ["UNKNOWN"] }), /unknown requirement|declared requirements|id is unstable/i);
  const decision = factory.createProductionMaterializationDecision(input.id, { decision: "APPROVE-FOR-MATERIALIZATION", reviewerId: "reviewer.fixture", rationale: "Approve." });
  const stale = factory.createProductionMaterializationDecision("materialization-authorization.other000000000001", { decision: decision.decision, reviewerId: decision.reviewerId, rationale: decision.rationale });
  assert.equal(factory.authorizeProductionMaterialization(input, stale).authorizationState, "BLOCKED-MATERIALIZATION-AUTHORIZATION");
  assert.throws(() => factory.authorizeProductionMaterialization(input, "APPROVE"), /schemaVersion|Decision/i);
});

test("authorization identity is deterministic and input remains unchanged", () => {
  const input = readyFixture();
  const before = factory.orchestrationJson.canonicalSerialize(input);
  const first = factory.authorizeProductionMaterialization(input);
  const second = factory.authorizeProductionMaterialization(input);
  assert.deepEqual(first, second);
  assert.equal(first.id, factory.productionMaterializationAuthorizationId(first));
  assert.equal(factory.orchestrationJson.canonicalSerialize(input), before);
  assert.deepEqual(first.declaredRequirements, [...first.declaredRequirements].sort());
});

test("CBR500R explicit human authorization enables only the future materialization boundary", () => {
  const result = cbr.buildResult();
  assert.equal(result.authorization.authorizationState, "AUTHORIZED-FOR-MATERIALIZATION");
  assert.equal(result.authorization.humanDecision.decision, "APPROVE-FOR-MATERIALIZATION");
  assert.equal(result.authorization.humanDecision.reviewerId, "reviewer.revlog.operator");
  assert.match(result.authorization.humanDecision.rationale, /^The exact CBR500R PC70 MY2024 USA\/Canada/);
  assert.equal(result.authorization.materializationAllowed, true);
  assert.equal(result.authorization.productionCreated, false);
  assert.equal(result.authorization.targetIdentity.id, "target.honda.cbr500r.pc70.2024.usa-canada");
  assert.equal(result.authorization.proposedProduction.entryId, "lubrication.engine-oil.specification");
  assert.equal(result.assertions.humanDecisionPreserved, true);
  assert.equal(result.assertions.materializationAuthorizedForFutureOnly, true);
  assert.equal(result.assertions.noProductionMutation, true);
});
