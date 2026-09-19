// NON-PRODUCTION bounded real-source acquisition for the approved BMW pilot target.
"use strict";

const factory = require("../factory/index.js");
const blocker = require("./mass-scale-blocker-resolution-pilot.js");

const TARGET_ID = "bmw.c-scooter.c600-sport.2012";
const SOURCE_URL = "https://manuals.bmw-motorrad.com/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/C_0132_RM_0912_C600Sport_07.pdf";
const PURPOSE = "mass-scale-bmw-c600-sport-my12-source-acquisition";
const POLICY_ID = "mass-scale-bmw-c600-official-source-v1";
const SOURCE_METADATA = Object.freeze({
  sourceAuthority: "BMW Motorrad",
  sourceTier: "A",
  publicationId: "C_0132_RM_0912_C600Sport_07.pdf",
  documentClass: "official rider manual",
  targetId: TARGET_ID,
  catalogVariantKey: "bmw.c-scooter.c600-sport",
  modelYear: 2012,
  market: "USA",
  abs: true,
  transmission: "cvt",
  equipment: "standard C 600 Sport"
});

function createTarget(candidate, prospect) {
  return factory.validateResearchTarget({
    schemaVersion: factory.FACTORY_CONTRACT_VERSION,
    id: candidate.targetId,
    catalogVariantKey: candidate.catalogVariantKey,
    manufacturer: "BMW",
    family: "C 600 / C 650",
    scope: {
      schemaVersion: factory.FACTORY_CONTRACT_VERSION,
      model: { state: "KNOWN", values: [candidate.catalogVariantKey] },
      generation: { state: "KNOWN", values: [candidate.identity.generation] },
      years: { kind: "EXACT", from: candidate.year, to: candidate.year },
      markets: { state: "KNOWN", values: [candidate.applicability.market.value] },
      transmissions: { state: "KNOWN", values: [candidate.applicability.transmission.value] },
      abs: { state: "KNOWN", values: [candidate.applicability.abs.value] },
      equipment: { state: "KNOWN", values: [candidate.applicability.equipment.value] }
    },
    sourcePriorityPolicyId: POLICY_ID,
    serviceCoreBaseline: { verified: 0, total: 44 },
    gapPlanRef: null,
    knownSourceRefs: [],
    knownProspectRefs: [prospect.id],
    researchHistoryRefs: [],
    riskFlags: [],
    state: "PLANNED"
  });
}

function buildPlan() {
  const projection = blocker.buildReport().targets.find(item => item.targetId === TARGET_ID);
  if (!projection || projection.after !== "EXECUTION-READY") throw new Error("BMW C 600 Sport projection is not execution-ready");
  const prospect = factory.toExistingSourceProspect(projection.candidate);
  const target = createTarget(projection.candidate, prospect);
  const readiness = factory.evaluateReadiness(target, prospect);
  if (!readiness.passed) throw new Error(`BMW source readiness is not executable: ${readiness.classification}`);
  const { batch } = factory.createResearchBatch({ purpose: PURPOSE, policyId: POLICY_ID, targets: [target], maxAttemptsPerWorkItem: 1 });
  const targetWork = factory.createTargetWork(batch, target, true);
  const sourceWorkItem = factory.createSourceWorkItem({ batch, targetWork, target, prospect, operation: "attempt-existing-source", maxAttempts: 1 });
  return Object.freeze({ projection, prospect, target, batch, targetWork, sourceWorkItem, planBatch: { batch, targetWorks: [targetWork], sourceWorkItems: [sourceWorkItem] } });
}

function artifactAudit(artifact) {
  if (!artifact) return null;
  const { contentBase64, ...metadata } = artifact.metadata || {};
  return {
    id: artifact.id,
    prospectId: artifact.prospectId,
    attemptId: artifact.attemptId,
    mediaType: artifact.mediaType,
    byteLength: artifact.byteLength,
    contentDigest: artifact.contentDigest,
    originClassification: artifact.originClassification,
    acquisitionMethod: artifact.acquisitionMethod,
    locator: artifact.locator,
    metadata
  };
}

async function executeOnce(plan, context = { networkAvailable: true }) {
  const history = factory.bootstrap(plan.planBatch);
  const adapter = factory.acquisitionAdapters.createHttpAdapter({ adapterId: "http.public-bounded" });
  return factory.executeAttemptAsync(history, plan.sourceWorkItem, adapter, {
    ...context,
    request: { url: SOURCE_URL, allowedMediaTypes: ["application/pdf"], sourceMetadata: SOURCE_METADATA }
  });
}

async function run() {
  const plan = buildPlan();
  const first = await executeOnce(plan);
  const second = await executeOnce(plan);
  const firstArtifact = first.result.outcome.artifact;
  const secondArtifact = second.result.outcome.artifact;
  if (!firstArtifact || !secondArtifact || firstArtifact.id !== secondArtifact.id || firstArtifact.contentDigest !== secondArtifact.contentDigest) throw new Error("BMW acquisition was not deterministic across repeat execution");
  if (firstArtifact.metadata.finalUrl !== SOURCE_URL || firstArtifact.metadata.redirectCount !== 0 || firstArtifact.mediaType !== "application/pdf") throw new Error("BMW acquisition did not preserve exact official PDF provenance");
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-bmw-c600-source-acquisition/v1",
    planningOnly: false,
    acquisitionOnly: true,
    targetId: TARGET_ID,
    catalogVariantKey: plan.target.catalogVariantKey,
    year: 2012,
    sourceProspectId: plan.prospect.id,
    sourceRoute: SOURCE_URL,
    source: SOURCE_METADATA,
    readiness: plan.sourceWorkItem.readiness,
    firstExecution: { outcome: first.result.outcome.outcome, reasonCode: first.result.outcome.reasonCode, action: "CREATED", artifact: artifactAudit(firstArtifact) },
    repeatExecution: { outcome: second.result.outcome.outcome, reasonCode: second.result.outcome.reasonCode, action: "REUSED", artifact: artifactAudit(secondArtifact) },
    idempotent: true,
    contentPersisted: false,
    extractionPerformed: false,
    evidenceCreated: false,
    reviewCreated: false,
    promotionPerformed: false,
    productionChanged: false,
    catalogueChanged: false,
    runtimeChanged: false,
    cloudChanged: false,
    next: "Extract only from the authenticated BMW C 600 Sport artifact under a separate bounded wave."
  });
}

module.exports = Object.freeze({ TARGET_ID, SOURCE_URL, SOURCE_METADATA, buildPlan, executeOnce, run });
