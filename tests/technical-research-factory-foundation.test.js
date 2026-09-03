"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const factory = require("../research/factory/index.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const readinessInventory = require("../research/data/source-prospect-authentication-quality-reassessment.js");
const yamaha = require("../research/data/yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("../research/data/high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("../research/data/harley-davidson-transfer-acquisition-batch-results.js").runBatch();
const productionRegistry = require("../data/technical/technical-profile-registry.js");
const foundationReport = require("../research/data/technical-research-factory-foundation.js");
const storedFoundationReport = require("../research/reports/technical-research-factory-foundation.json");

const known = values => ({ state: "KNOWN", values });
const unknown = () => ({ state: "UNKNOWN", values: [] });
const scope = (overrides = {}) => ({
  schemaVersion: 1,
  model: known(["fixture.model"]),
  generation: known(["gen1"]),
  years: { kind: "EXACT", from: 2021, to: 2021 },
  markets: known(["EU"]),
  transmissions: known(["manual"]),
  abs: known([false]),
  equipment: known(["standard"]),
  ...overrides
});
const target = (overrides = {}) => factory.validateResearchTarget({
  schemaVersion: 1, id: "target.fixture.model.2021.eu", catalogVariantKey: "fixture.model", manufacturer: "Fixture", family: "Fixture Model",
  scope: scope(), sourcePriorityPolicyId: "tier-ab-practical-marginal-v1", serviceCoreBaseline: { verified: 0, total: 44 }, gapPlanRef: null,
  knownSourceRefs: [], knownProspectRefs: [], researchHistoryRefs: [], riskFlags: [], state: "RESEARCH-MORE", ...overrides
});
const prospect = (targetRecord, overrides = {}) => factory.validateSourceProspect({
  schemaVersion: 1, id: "prospect.fixture.manual", targetId: targetRecord.id, documentClass: "official-owner-manual",
  authority: { name: "Fixture Motor", state: "KNOWN" }, documentIdentity: { title: "Fixture Manual", state: "KNOWN" },
  publication: { relationship: "SINGLE", identifiers: [{ value: "FIX-1", namespace: "Fixture", region: "EU", type: "publication-code", proofState: "AUTHENTICATED" }] },
  officialLocations: [{ host: "manuals.fixture.invalid", path: "/FIX-1.pdf" }], sourceTier: "A", authenticationState: "AUTHENTICATED",
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: targetRecord.scope,
  exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "HIGH", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "bounded extraction", ...overrides
});

test("factory contract version is explicit and unknown versions fail", () => {
  assert.equal(factory.FACTORY_CONTRACT_VERSION, 1);
  assert.throws(() => factory.validateApplicabilityScope({ ...scope(), schemaVersion: 2 }), /schemaVersion/);
});

test("canonical contracts validate and remain deterministic JSON", () => {
  const original = JSON.parse(JSON.stringify(target()));
  const first = factory.validateResearchTarget(original);
  const second = factory.validateResearchTarget(original);
  assert.equal(factory.stableSerialize(first), factory.stableSerialize(second));
  assert.deepEqual(original, JSON.parse(JSON.stringify(target())));
  assert.doesNotThrow(() => factory.validateSourceProspect(prospect(first)));
  assert.equal(JSON.parse(JSON.stringify(first)).scope.abs.values[0], false);
});

test("malformed target, prospect, scope and GapPlan records are rejected", () => {
  assert.throws(() => factory.validateResearchTarget({}), /schemaVersion/);
  assert.throws(() => factory.validateSourceProspect({ schemaVersion: 1 }), /IDs/);
  assert.throws(() => factory.validateApplicabilityScope({ ...scope(), abs: { state: "KNOWN", values: [null] } }), /abs.values/);
  assert.throws(() => factory.validateGapPlan({ schemaVersion: 1 }, pipeline.serviceCoreFields), /GapPlan IDs/);
  const t = target();
  assert.throws(() => factory.validateSourceProspect({ ...prospect(t), officialLocations: [{ host: "", path: "" }] }), /official location/);
  assert.throws(() => factory.validateSourceProspect({ ...prospect(t), publication: { relationship: "SINGLE", identifiers: [{ value: "A", namespace: "X", proofState: "AUTHENTICATED" }, { value: "B", namespace: "X", proofState: "AUTHENTICATED" }] } }), /exactly one/);
});

test("ABS tri-state is explicit and fail closed", () => {
  const result = (targetAbs, sourceAbs) => factory.evaluateApplicability(scope({ abs: targetAbs }), scope({ abs: sourceAbs })).dimensions.abs;
  assert.equal(result(known([false]), known([false])), "MATCH");
  assert.equal(result(known([true]), known([true])), "MATCH");
  assert.equal(result(known([false]), known([true])), "MISMATCH");
  assert.equal(result(known([true]), known([false])), "MISMATCH");
  assert.equal(result(known([false]), unknown()), "UNKNOWN");
  assert.equal(result(unknown(), known([false])), "UNKNOWN");
});

test("transmission, market, year and equipment comparisons preserve boundaries", () => {
  const result = (key, targetValue, sourceValue) => factory.evaluateApplicability(scope({ [key]: targetValue }), scope({ [key]: sourceValue })).dimensions[key === "years" ? "year" : key === "markets" ? "market" : key === "transmissions" ? "transmission" : "equipment"];
  assert.equal(result("transmissions", known(["manual"]), known(["manual"])), "MATCH");
  assert.equal(result("transmissions", known(["manual"]), known(["dct"])), "MISMATCH");
  assert.equal(result("transmissions", known(["dct"]), known(["dct"])), "MATCH");
  assert.equal(result("transmissions", known(["manual"]), unknown()), "UNKNOWN");
  assert.equal(result("markets", known(["EU"]), known(["EU", "UK"])), "MATCH");
  assert.equal(result("markets", known(["EU"]), known(["US"])), "MISMATCH");
  assert.equal(result("markets", known(["EU"]), unknown()), "UNKNOWN");
  assert.throws(() => factory.validateApplicabilityScope(scope({ markets: { state: "KNOWN", values: [] } })), /must not be empty/);
  assert.equal(result("years", { kind: "EXACT", from: 2021, to: 2021 }, { kind: "RANGE", from: 2020, to: 2022 }), "MATCH");
  assert.equal(result("years", { kind: "EXACT", from: 2021, to: 2021 }, { kind: "EXACT", from: 2022, to: 2022 }), "MISMATCH");
  assert.equal(result("years", { kind: "EXACT", from: 2021, to: 2021 }, { kind: "UNKNOWN", from: null, to: null }), "UNKNOWN");
  assert.equal(result("equipment", known(["standard"]), known(["SP"])), "MISMATCH");
  assert.equal(result("equipment", known(["standard"]), unknown()), "UNKNOWN");
  assert.equal(result("equipment", known(["standard", "SP"]), known(["standard"])), "PARTIAL");
});

test("overall applicability and readiness are fail closed", () => {
  const t = target();
  assert.equal(factory.evaluateReadiness(t, prospect(t)).classification, "EXECUTION-READY");
  const unknownMarket = prospect(t, { applicability: scope({ markets: unknown() }), readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" });
  assert.equal(factory.evaluateReadiness(t, unknownMarket).passed, false);
  assert.equal(factory.evaluateReadiness(t, unknownMarket).classification, "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL");
  const partialEquipment = prospect(t, { applicability: scope({ equipment: { state: "PARTIAL", values: ["standard"] } }), readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL" });
  assert.equal(factory.evaluateReadiness(t, partialEquipment).passed, false);
  const blocked = prospect(t, { accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESS-BLOCKED-AUTH" }, readinessClassification: "ACCESS-BLOCKED" });
  assert.equal(factory.evaluateReadiness(t, blocked).classification, "ACCESS-BLOCKED");
  const mirror = prospect(t, { accessibility: { metadata: "MIRROR-ONLY", fullContent: "MIRROR-ONLY" }, readinessClassification: "SOURCE-IDENTITY-PARTIAL" });
  assert.equal(factory.evaluateReadiness(t, mirror).classification, "SOURCE-IDENTITY-PARTIAL");
  assert.equal(factory.evaluateReadiness(t, mirror).rankingEligible, false);
});

test("publication identifier relationships and access channels remain separate", () => {
  const t = target();
  const p = prospect(t, { publication: { relationship: "RELATIONSHIP-UNRESOLVED", identifiers: [
    { value: "B7N-28197-E0", namespace: "Yamaha-Europe", region: "EU", proofState: "CORROBORATED" },
    { value: "LIT-11616-34-61", namespace: "Yamaha-USA", region: "US", proofState: "AUTHENTICATED" }
  ] }, accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESS-BLOCKED-AUTH" }, readinessClassification: "ACCESS-BLOCKED" });
  assert.equal(p.publication.relationship, "RELATIONSHIP-UNRESOLVED");
  assert.equal(p.accessibility.metadata, "ACCESSIBLE-OFFICIAL-HTML");
  assert.equal(p.accessibility.fullContent, "ACCESS-BLOCKED-AUTH");
  assert.equal(factory.evaluateReadiness(t, p).passed, false);
});

test("GapPlan derives canonical gaps without inventing no-evidence or resolving conflicts", () => {
  const t = target();
  const evidence = [
    { catalogVariantKey: t.catalogVariantKey, canonicalFieldId: "lubrication.oil-specification", proofStatus: "VERIFIED-DIRECT", sourceId: "source.one" },
    { catalogVariantKey: t.catalogVariantKey, canonicalFieldId: "cooling.capacity", proofStatus: "RESEARCHED-NO-EVIDENCE" },
    { catalogVariantKey: t.catalogVariantKey, canonicalFieldId: "torques.front-axle", proofStatus: "CONFLICT" }
  ];
  const plan = factory.generateGapPlan(t, evidence, { attemptedSourceClasses: ["official-owner-manual"], expectedMarginalOpportunity: "MEDIUM" });
  assert.equal(plan.startingCoverage.verified, 1);
  assert.equal(plan.startingCoverage.total, 44);
  assert.ok(plan.researchedNoEvidenceFields.includes("cooling.capacity"));
  assert.ok(plan.conflictedFields.includes("torques.front-axle"));
  assert.ok(!plan.researchedNoEvidenceFields.includes("ignition.plug-gap"));
  assert.equal(plan.remainingFields.length, 43);
});

test("real Yamaha and Honda acquired-source shapes adapt without mutation", () => {
  const yamahaSource = yamaha.sources[0];
  const yamahaBefore = JSON.stringify(yamahaSource);
  const yt = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const yp = factory.adapters.fromLegacyAcquiredSource(yamahaSource, yt);
  assert.equal(yp.applicability.abs.values[0], true);
  assert.equal(yp.applicability.transmissions.values[0], "manual");
  assert.equal(JSON.stringify(yamahaSource), yamahaBefore);
  const hondaSource = honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00");
  const ht = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", years: { from: 2024, to: 2024 }, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  const hp = factory.adapters.fromLegacyAcquiredSource(hondaSource, ht);
  assert.equal(hp.authority.state, "KNOWN");
  assert.equal(hp.applicability.abs.state, "UNKNOWN");
});

test("real MT-09 blocked and Harley mismatch shapes reach canonical outcomes", () => {
  const mtRecord = readinessInventory.prospects.find(item => item.id === "yamaha.mt09.service.b7n-28197-e0");
  const mtTarget = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: mtRecord.catalogVariantKey, manufacturer: "Yamaha", family: "MT-09", generation: "III", years: mtRecord.years, markets: mtRecord.markets, transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const mtProspect = factory.adapters.fromLegacySourceProspect(mtRecord, mtTarget, { identifierRelationship: "RELATIONSHIP-UNRESOLVED" });
  assert.equal(factory.evaluateReadiness(mtTarget, mtProspect).classification, "ACCESS-BLOCKED");
  const harleyTarget = factory.adapters.fromLegacyResearchTarget(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  const harleyProspect = factory.adapters.fromLegacyAcquiredSource(harley.source, harleyTarget);
  const result = factory.evaluateReadiness(harleyTarget, harleyProspect);
  assert.equal(harleyProspect.accessibility.fullContent, "ACCESS-BLOCKED-403");
  assert.equal(result.applicability.dimensions.year, "MISMATCH");
  assert.equal(result.classification, "REJECTED-MISMATCH");
});

test("Ténéré prospect remains applicability-partial and a factory pilot candidate", () => {
  const tenere = readinessInventory.prospects.find(item => item.id === "yamaha.tenere700.service.bw3-f8197-e0");
  const before = JSON.stringify(tenere);
  const t = factory.adapters.fromLegacyResearchTarget({ catalogVariantKey: tenere.catalogVariantKey, manufacturer: "Yamaha", family: "Ténéré 700", generation: "I", years: tenere.years, markets: tenere.markets, transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const p = factory.adapters.fromLegacySourceProspect(tenere, t);
  assert.equal(p.authenticationState, "PARTIAL");
  assert.equal(factory.evaluateReadiness(t, p).classification, "ACCESS-BLOCKED");
  assert.equal(JSON.stringify(tenere), before);
  assert.equal(require("../research/data/technical-research-factory-architecture.js").tenerePilot.role, "FACTORY-PILOT-CANDIDATE");
});

test("Service Core and production boundary remain unchanged", () => {
  assert.equal(pipeline.serviceCoreFields.length, 44);
  assert.equal(productionRegistry.length, 1);
  assert.equal(productionRegistry[0].profileId, "honda.vfr800.rc46-vtec-gen1.2002");
  assert.equal(yamaha.evidence.length, 58);
  assert.equal(harley.evidence.length, 0);
});

test("foundation implementation report is reproducible and selects one orchestrator NEXT", () => {
  const report = foundationReport.buildReport();
  assert.deepEqual(report, storedFoundationReport);
  assert.equal(report.factoryContractVersion, 1);
  assert.equal(report.fixtures.length, 5);
  assert.equal(report.exactNextTasks.length, 1);
  assert.match(report.exactNextTasks[0].task, /Orchestrator Foundation/);
  assert.equal(report.externalResearchPerformed, false);
  assert.equal(report.tenereAuthenticationExecuted, false);
});
