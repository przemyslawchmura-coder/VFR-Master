"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const design = require("../research/data/technical-research-factory-architecture.js").buildReport();
const pipeline = require("../research/lib/batch-research-pipeline.js");
const registry = require("../data/technical/technical-profile-registry.js");

test("factory pipeline stages are explicit and externally distinct", () => {
  const ids = design.pipelineStages.map(stage => stage.id);
  ["source-discovery", "source-authentication", "acquisition", "extraction"].forEach(id => assert.ok(ids.includes(id)));
  assert.equal(new Set(ids).size, ids.length);
  assert.notEqual(ids.indexOf("source-discovery"), ids.indexOf("source-authentication"));
  assert.notEqual(ids.indexOf("source-authentication"), ids.indexOf("acquisition"));
  assert.notEqual(ids.indexOf("acquisition"), ids.indexOf("extraction"));
});

test("core contracts expose target, prospect, applicability and GapPlan", () => {
  ["ResearchTarget", "SourceProspect", "ApplicabilityScope", "GapPlan", "SourceWorkItem", "EvidenceCandidate", "ReviewItem"].forEach(name => assert.ok(design.contracts[name]));
  ["catalogVariantKey", "generation", "years", "markets", "transmission", "abs", "equipment"].forEach(field => assert.ok(design.contracts.ApplicabilityScope.dimensions.includes(field)));
  assert.ok(design.contracts.GapPlan.required.includes("remainingFields"));
  assert.equal(pipeline.serviceCoreFields.length, 44);
});

test("budgets, readiness, exhaustion, conflicts and review remain fail closed", () => {
  assert.ok(design.budgetEngine.configurableLimits.includes("maxPrimaryDocuments"));
  assert.ok(design.readinessGate.canonicalRequiredFields.includes("identifierRelationshipResolved"));
  assert.ok(design.readinessGate.canonicalRequiredFields.includes("absEquipmentSufficient"));
  assert.ok(design.exhaustion.stopReasons.includes("AUTHENTICATION-PATH-EXHAUSTED"));
  assert.ok(design.conflictEngine.canonicalStates.includes("UNRESOLVED-CONFLICT"));
  assert.ok(design.contracts.ReviewItem.reasons.includes("SAFETY-CRITICAL-CONFLICT"));
});

test("checkpointing and deterministic boundaries are designed", () => {
  ["batchId", "targetId", "prospectId", "workItemId", "attemptId", "candidateId", "reviewItemId", "eventId"].forEach(id => assert.ok(design.checkpointing.stableIds.includes(id)));
  assert.match(design.checkpointing.stateModel, /append-only events/);
  assert.equal(design.sourceDiscovery.nonGoal, "No crawler or autonomous browser in MVP.");
  assert.equal(design.adapterDecision.pattern, "GENERIC-CORE-PLUS-OPTIONAL-MANUFACTURER-ADAPTERS");
  assert.ok(design.adapterDecision.adaptersMustNot.includes("declare evidence verified"));
});

test("MVP and ordered implementation waves are bounded", () => {
  assert.ok(design.mvpComponents.includes("typed review queue"));
  assert.ok(design.mvpComponents.includes("hard manual production boundary"));
  assert.deepEqual(design.implementationWaves.map(wave => wave.order), [1, 2, 3, 4, 5]);
  assert.deepEqual(design.implementationWaves.map(wave => wave.name), ["FACTORY FOUNDATION", "FACTORY ORCHESTRATOR", "FACTORY WORK ITEMS", "FACTORY BATCH PILOT", "FACTORY SCALE-UP"]);
});

test("Ténéré is preserved as a factory pilot and exactly one NEXT exists", () => {
  assert.equal(design.tenerePilot.catalogVariantKey, "yamaha.tenere-700.gen1");
  assert.equal(design.tenerePilot.publicationCode, "BW3-F8197-E0");
  assert.equal(design.tenerePilot.role, "FACTORY-PILOT-CANDIDATE");
  assert.equal(design.tenerePilot.preservedState, "REGISTERED-NOT-REAUTHENTICATED");
  assert.equal(design.exactNextTasks.length, 1);
  assert.equal(design.exactNextTasks[0].id, "factory-foundation-contracts-and-gates");
});

test("architecture adds no evidence and preserves production isolation", () => {
  assert.equal(design.evidenceAdded, false);
  assert.equal(design.researchedNoEvidenceAdded, false);
  assert.equal(design.serviceCoreChanged, false);
  assert.equal(design.productionChanged, false);
  assert.equal(design.runtimeChanged, false);
  assert.equal(design.catalogueChanged, false);
  assert.equal(design.cloudBackendChanged, false);
  assert.equal(design.vfr800ProductionChanged, false);
  assert.equal(design.externalMotorcycleResearchPerformed, false);
  assert.deepEqual(registry.map(item => item.profileId), ["honda.vfr800.rc46-vtec-gen1.2002", "ducati.monster937.2021"]);
});
