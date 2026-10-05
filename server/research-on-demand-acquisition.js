// TRUSTED NON-PRODUCTION source acquisition only. No extraction/reusable writes.
"use strict";
const factory = require("../research/factory/index.js");
const asyncExecution = require("../research/factory/async-execution-contracts.js");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const json = require("../research/factory/json.js");
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const canonical = json.canonicalSerialize;

function validateRoute(input) {
  const route = json.immutableClone(input);
  const target = factory.validateResearchTarget(route.target);
  const prospect = factory.validateSourceProspect(route.prospect);
  assert(prospect.targetId === target.id, "source route target/prospect identity mismatch");
  assert(factory.evaluateReadiness(target, prospect).passed, "source route readiness must pass");
  assert(typeof route.id === "string" && route.id.length && typeof route.sourceId === "string" && route.sourceId.length, "source route identity is required");
  assert(Array.isArray(route.fieldIds) && route.fieldIds.length > 0 && route.fieldIds.every(id => typeof id === "string" && id.length), "source route fields are required");
  assert(typeof route.operation === "string" && route.operation.length, "source route demand operation is required");
  assert(Object.hasOwn(route, "conditions"), "source route conditions must be explicit");
  const url = new URL(route.url);
  assert(url.protocol === "https:" && !url.username && !url.password && !url.search && !url.hash && !url.port, "source route must use an exact public HTTPS URL");
  assert(prospect.officialLocations.some(location => location.host === url.host && location.path === url.pathname), "source route URL is not an authenticated official location");
  assert(/^[a-f0-9]{64}$/.test(route.expectedDigest), "authenticated source digest is required");
  assert(route.mediaType === "application/pdf", "this acquisition layer supports authenticated PDF routes only");
  assert(Number.isInteger(route.maxResponseBytes) && route.maxResponseBytes > 0 && route.maxResponseBytes <= 50 * 1024 * 1024, "source route byte budget is invalid");
  assert(route.proof && typeof route.proof.authenticatedArtifactId === "string" && typeof route.proof.applicabilityVerificationId === "string", "source route provenance proof is required");
  return json.immutableClone({ ...route, target, prospect, url: url.toString() });
}

function createSourceAcquisitionExecutor({ routes, artifactStore, clock = () => Date.now() }) {
  assert(Array.isArray(routes) && routes.length > 0, "trusted source routes are required");
  assert(artifactStore && typeof artifactStore.put === "function", "trusted acquired artifact custody is required");
  assert(typeof clock === "function", "trusted acquisition clock is required");
  const configured = routes.map(validateRoute);
  assert(new Set(configured.map(route => route.id)).size === configured.length, "duplicate source route identities are not allowed");
  return Object.freeze(async ({ demand: input, execution, checkpoint }) => {
    const demand = reusable.validateReusableDemand(input);
    const canonicalIdentity = asyncExecution.executionIdentity(demand);
    let canonicalExecution;
    try { canonicalExecution = asyncExecution.validateExecutionJob(execution); } catch { throw new TypeError("source acquisition execution identity binding is invalid"); }
    assert(canonicalExecution.executionId === canonicalIdentity.executionId && canonicalExecution.jobKey === canonicalIdentity.jobKey && canonicalExecution.demandId === canonicalIdentity.demandId, "source acquisition execution identity binding mismatch");
    assert(canonicalExecution.status === "RUNNING" && typeof canonicalExecution.workerId === "string" && canonicalExecution.workerId.length > 0, "source acquisition requires a claimed running execution");
    assert(Number.isFinite(Date.parse(canonicalExecution.claimedAt)) && Number.isFinite(Date.parse(canonicalExecution.leaseExpiresAt)) && Date.parse(canonicalExecution.leaseExpiresAt) > Date.parse(canonicalExecution.claimedAt), "source acquisition execution claim is invalid");
    const now = clock();
    assert(Number.isFinite(now) && Date.parse(canonicalExecution.leaseExpiresAt) > now, "source acquisition execution lease is expired");
    assert(checkpoint && checkpoint.executionId === canonicalIdentity.executionId && checkpoint.demandId === canonicalIdentity.demandId && checkpoint.attempt === canonicalExecution.attemptCount, "source acquisition checkpoint identity binding mismatch");
    assert(checkpoint.phase === "FACTORY-HANDOFF" && checkpoint.claimedAt === canonicalExecution.claimedAt && canonicalExecution.checkpoint && canonical(checkpoint) === canonical(canonicalExecution.checkpoint), "source acquisition checkpoint binding mismatch");
    const stop = (outcome, reason, details = {}) => ({ outcome, failure: { reason }, checkpoint: { ...checkpoint, phase: "SOURCE-ACQUISITION-STOPPED", ...details, productionMaterialized: false, reusableKnowledgeCreated: false } });
    if (!reusable.contextIsKnown(demand).complete) return stop("BLOCKED", "SOURCE-CONTEXT-UNKNOWN");
    const candidates = configured.filter(route => route.fieldIds.includes(demand.canonicalFieldId));
    if (!candidates.length) return stop("UNSUPPORTED", "NO-EXACT-SOURCE-ROUTE");
    const matches = candidates.filter(route => route.target.catalogVariantKey === demand.catalogVariantKey && route.operation === demand.operation && canonical(route.conditions) === canonical(demand.conditions) && factory.evaluateApplicability(demand.applicability, route.prospect.applicability).overall === "MATCH");
    if (matches.length !== 1) return stop("BLOCKED", "EXACT-SOURCE-ROUTE-AMBIGUOUS-OR-INCOMPATIBLE");
    const route = matches[0];
    const target = factory.validateResearchTarget({ ...route.target, scope: demand.applicability });
    const batchSetup = factory.createResearchBatch({ purpose: `Research on Demand acquisition ${canonicalIdentity.executionId} attempt ${canonicalExecution.attemptCount}`, policyId: route.id, targets: [target], maxAttemptsPerWorkItem: 1 });
    const targetWork = factory.createTargetWork(batchSetup.batch, target);
    const work = factory.createSourceWorkItem({ batch: batchSetup.batch, targetWork, target, prospect: route.prospect, operation: "attempt-existing-source", maxAttempts: 1 });
    const history = factory.bootstrap({ batch: batchSetup.batch, targetWorks: [targetWork], sourceWorkItems: [work] });
    const adapter = factory.acquisitionAdapters.createHttpAdapter({ allowedUrls: [route.url] });
    const acquired = await factory.executeAttemptAsync(history, work, adapter, { networkAvailable: true, request: { url: route.url, allowedMediaTypes: [route.mediaType], maxResponseBytes: route.maxResponseBytes, timeoutMs: 10000, sourceMetadata: { sourceId: route.sourceId, routeId: route.id } } });
    const outcome = acquired.result.outcome;
    const lineage = { routeId: route.id, sourceId: route.sourceId, factoryBatchId: batchSetup.batch.id, sourceWorkItemId: work.id, acquisitionResultId: acquired.result.attemptId };
    if (outcome.outcome !== "ACQUIRED") {
      const classification = outcome.retryClass === "RETRYABLE" ? "RETRYABLE" : outcome.retryClass === "BLOCKED" ? "BLOCKED" : "PERMANENT";
      return stop(classification, outcome.reasonCode, lineage);
    }
    const artifact = outcome.artifact;
    if (artifact.contentDigest !== route.expectedDigest || artifact.locator !== route.url) return stop("BLOCKED", "SOURCE-IDENTITY-MISMATCH", lineage);
    let custody;
    try { custody = await artifactStore.put(artifact); } catch (error) {
      if (error && error.code === "CUSTODY_INTEGRITY_FAILURE") return stop("BLOCKED", "CUSTODY-INTEGRITY-FAILURE", lineage);
      throw error;
    }
    if (!(custody && custody.contentDigest === artifact.contentDigest && custody.byteLength === artifact.byteLength && custody.storageKey === `sha256:${artifact.contentDigest}`)) return stop("BLOCKED", "CUSTODY-INTEGRITY-FAILURE", lineage);
    const { contentBase64, ...metadata } = artifact.metadata;
    return json.immutableClone({ outcome: "BLOCKED", failure: { reason: "EXTRACTION-REQUIRED" }, checkpoint: { ...checkpoint, ...lineage, phase: "SOURCE-ACQUIRED", artifact: { ...artifact, metadata }, custody, provenance: { sourceId: route.sourceId, sourceType: route.prospect.documentClass, locator: route.url, publication: route.prospect.publication, proof: route.proof }, applicability: demand.applicability, conditions: demand.conditions, productionMaterialized: false, reusableKnowledgeCreated: false } });
  });
}
module.exports = Object.freeze({ createSourceAcquisitionExecutor });
