// NON-PRODUCTION reproducible report for Technical Research Factory Foundation #1.
"use strict";

const factory = require("../factory/index.js");
const pipeline = require("../lib/batch-research-pipeline.js");
const readinessInventory = require("./source-prospect-authentication-quality-reassessment.js");
const yamaha = require("./yamaha-transfer-acquisition-batch-results.js").runBatch();
const honda = require("./high-value-source-acquisition-pilot-results.js").runPilot();
const harley = require("./harley-davidson-transfer-acquisition-batch-results.js").runBatch();
const architecture = require("./technical-research-factory-architecture.js");

function target(record, options) { return factory.adapters.fromLegacyResearchTarget(record, options); }
function findProspect(id) { return readinessInventory.prospects.find(item => item.id === id); }

function buildReport() {
  const mtTarget = target({ catalogVariantKey: "yamaha.mt-09.gen3", manufacturer: "Yamaha", family: "MT-09", generation: "III", year: 2021, market: "EU", transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const mtLegacy = findProspect("yamaha.mt09.service.b7n-28197-e0");
  const mtProspect = factory.adapters.fromLegacySourceProspect(mtLegacy, mtTarget, { identifierRelationship: "RELATIONSHIP-UNRESOLVED" });
  const tenereLegacy = findProspect("yamaha.tenere700.service.bw3-f8197-e0");
  const tenereTarget = target({ catalogVariantKey: tenereLegacy.catalogVariantKey, manufacturer: "Yamaha", family: "Ténéré 700", generation: "I", years: tenereLegacy.years, markets: tenereLegacy.markets, transmission: "manual", abs: true, equipment: "standard" }, { verified: 29 });
  const tenereProspect = factory.adapters.fromLegacySourceProspect(tenereLegacy, tenereTarget);
  const harleyTarget = target(harley.target, { manufacturer: "Harley-Davidson", family: "Sportster S", generation: "RH1250S", verified: 0 });
  const harleyProspect = factory.adapters.fromLegacyAcquiredSource(harley.source, harleyTarget);
  const yamahaSource = yamaha.sources[0];
  const yamahaProspect = factory.adapters.fromLegacyAcquiredSource(yamahaSource, mtTarget);
  const hondaSource = honda.sources.find(source => source.id === "pilot.cbr500r.31mlrb00");
  const hondaTarget = target({ catalogVariantKey: "honda.cbr500r.pc70", manufacturer: "Honda", family: "CBR500R", generation: "PC70", year: 2024, markets: ["USA", "Canada"], transmission: "manual", abs: null, equipment: "standard" }, { verified: 26 });
  const hondaProspect = factory.adapters.fromLegacyAcquiredSource(hondaSource, hondaTarget);
  const gapEvidence = [...yamaha.evidence.filter(row => row.catalogVariantKey === mtTarget.catalogVariantKey), ...yamaha.researchedNoEvidence.filter(row => row.catalogVariantKey === mtTarget.catalogVariantKey).map(row => ({ ...row, proofStatus: "RESEARCHED-NO-EVIDENCE" }))];
  const gapPlan = factory.generateGapPlan(mtTarget, gapEvidence, { attemptedSourceClasses: ["official-owner-manual"], sourceClassRelevance: { "official-service-manual": "remaining-specialist-gaps" }, expectedMarginalOpportunity: "MEDIUM" });
  const fixtures = Object.freeze([
    fixture("yamaha-mt09-service-blocked", "Yamaha", mtTarget, mtProspect, factory.evaluateReadiness(mtTarget, mtProspect)),
    fixture("harley-94001064-year-mismatch", "Harley-Davidson", harleyTarget, harleyProspect, factory.evaluateReadiness(harleyTarget, harleyProspect)),
    fixture("yamaha-mt09-owner-exhausted", "Yamaha", mtTarget, yamahaProspect, factory.evaluateReadiness(mtTarget, yamahaProspect)),
    fixture("honda-cbr500r-owner-partial", "Honda", hondaTarget, hondaProspect, factory.evaluateReadiness(hondaTarget, hondaProspect)),
    fixture("yamaha-tenere-service-pilot", "Yamaha", tenereTarget, tenereProspect, factory.evaluateReadiness(tenereTarget, tenereProspect))
  ]);
  return Object.freeze({
    schemaVersion: "revlog-technical-research-factory-foundation/v1",
    factoryContractVersion: factory.FACTORY_CONTRACT_VERSION,
    date: "2026-09-01",
    modules: Object.freeze(["research/factory/contracts.js", "research/factory/applicability.js", "research/factory/readiness.js", "research/factory/gap-plan.js", "research/factory/adapters.js", "research/factory/index.js"]),
    contracts: Object.freeze(["ResearchTarget", "SourceProspect", "ApplicabilityScope", "GapPlan"]),
    applicabilityStates: factory.APPLICABILITY_STATES,
    readinessClassifications: factory.READINESS,
    accessibilityClassifications: factory.ACCESSIBILITY,
    applicabilityDimensions: Object.freeze(["model", "generation", "year", "market", "transmission", "abs", "equipment"]),
    adapters: Object.freeze(["fromLegacyResearchTarget", "fromLegacySourceProspect", "fromLegacyAcquiredSource"]),
    fixtures,
    gapPlan: Object.freeze({ targetId: gapPlan.targetId, startingCoverage: gapPlan.startingCoverage, remaining: gapPlan.remainingFields.length, researchedNoEvidence: gapPlan.researchedNoEvidenceFields.length, conflicts: gapPlan.conflictedFields.length, expectedMarginalOpportunity: gapPlan.expectedMarginalOpportunity }),
    canonicalGate: Object.freeze({ failClosed: true, scoringCannotOverride: true, unknownBlocks: true, partialBlocks: true, blockedAccessBlocks: true, mirrorOnlyBlocks: true, mismatchClassification: "REJECTED-MISMATCH" }),
    duplicatedLogic: Object.freeze({ readiness: Object.freeze(["source-prospect-authentication-quality-reassessment.evaluateReadinessGate", "target-specific authentication/reconciliation gate objects"]), applicability: Object.freeze(["batch-research-pipeline.validateApplicability", "technical-research-pipeline.scopeMatches", "target-specific applicability booleans"]), migratedNow: "selected real fixture shapes route through canonical adapters/evaluator/gate", deferred: "historical modules retain their original output until a bounded compatibility migration" }),
    truthinessAudit: Object.freeze({ defectFound: false, defectFixed: false, result: "Existing batch ABS validator already uses explicit equality; foundation set comparison preserves false and rejects null/undefined as canonical values. Legacy scopeMatches has more permissive omitted-dimension semantics, recorded as deferred representation divergence rather than a truthiness fix." }),
    migrationDeferred: true,
    orchestrationImplemented: false,
    serviceCoreFieldCount: pipeline.serviceCoreFields.length,
    tenerePilot: Object.freeze({ publicationId: "BW3-F8197-E0", state: tenereProspect.authenticationState, role: architecture.tenerePilot.role, authenticated: false }),
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", risks: Object.freeze(["historical gates and applicability representations remain behind compatibility boundaries", "legacy text fields require explicit adapter options when their scope is ambiguous", "no live-data migration proves all historical shapes yet"]), conclusion: "The foundation is exercised by real Honda, Yamaha, Harley and Ténéré states and is not an unused parallel schema; bounded historical migration remains future work." }),
    exactNextTasks: Object.freeze([{ id: "factory-orchestrator-foundation", task: "Implement the bounded Technical Research Factory Orchestrator Foundation: add stable Batch, TargetWork, SourceWorkItem, Attempt and Event identities; an append-only JSON-safe event model; deterministic reducer/snapshot transitions; configured budget and terminal-state enforcement; and checkpoint/resume tests using only synthetic and existing adapted fixtures, with no external research, acquisition, extraction, live-data migration or production change.", leverage: "The canonical contracts and gates now exist; every later work-item, scheduler, review and interrupted batch pilot depends on reproducible state transitions and resumability." }]),
    evidenceAdded: false,
    researchedNoEvidenceAdded: false,
    serviceCoreChanged: false,
    coverageChanged: false,
    productionChanged: false,
    runtimeChanged: false,
    catalogueChanged: false,
    cloudBackendChanged: false,
    vfr800ProductionChanged: false,
    tenereAuthenticationExecuted: false,
    externalResearchPerformed: false
  });
}

function fixture(id, manufacturer, targetRecord, prospectRecord, result) {
  return Object.freeze({ id, manufacturer, targetId: targetRecord.id, prospectId: prospectRecord.id, inputReadiness: prospectRecord.readinessClassification, canonicalReadiness: result.classification, passed: result.passed, applicability: result.applicability.overall, blockers: result.blockers });
}

module.exports = Object.freeze({ buildReport });
