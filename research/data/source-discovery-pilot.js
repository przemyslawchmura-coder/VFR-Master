// NON-PRODUCTION bounded real source-discovery pilot. No acquisition or research.
"use strict";

const queueReport = require("./catalogue-coverage-queue.js").buildReport();
const sourceReadiness = require("./source-prospect-authentication-quality-reassessment.js");
const contracts = require("../factory/source-discovery-prospect-contracts.js");

function targetFor(key, year) {
  const target = queueReport.targets.find(item => item.catalogVariantKey === key && item.year === year);
  if (!target) throw new Error(`pilot target is absent from catalogue projection: ${key}/${year}`);
  if (target.production.state !== "ABSENT") throw new Error(`pilot target is already represented in production: ${key}/${year}`);
  return target;
}

function selectTargets() {
  const productionAbsent = queueReport.targets.filter(item => item.production.state === "ABSENT");
  const knownProspects = sourceReadiness.prospects
    .filter(prospect => prospect.officialHost && ["AUTHENTICATED-BUT-APPLICABILITY-PARTIAL", "ACCESS-BLOCKED", "SOURCE-IDENTITY-PARTIAL"].includes(prospect.classification))
    .map(prospect => {
      const years = prospect.years && Number.isInteger(prospect.years.from) && Number.isInteger(prospect.years.to) ? prospect.years : null;
      const target = productionAbsent.find(item => item.catalogVariantKey === prospect.catalogVariantKey && (!years || (item.year >= years.from && item.year <= years.to)));
      return target ? { target, prospect } : null;
    }).filter(Boolean).sort((a, b) => a.target.targetId.localeCompare(b.target.targetId) || a.prospect.id.localeCompare(b.prospect.id));
  const known = knownProspects[0];
  const unresolvedTarget = productionAbsent.find(item => !sourceReadiness.prospects.some(prospect => prospect.catalogVariantKey === item.catalogVariantKey));
  if (!known || !unresolvedTarget) throw new Error("pilot cannot select its deterministic two-target sample");
  return Object.freeze({ known, unresolvedTarget });
}

function knownCandidate(target, prospect) {
  const applicability = {
    model: { state: "PARTIAL", value: null }, year: { state: "PARTIAL", value: null }, market: { state: "PARTIAL", value: null },
    abs: { state: "UNKNOWN", value: null }, transmission: { state: "UNKNOWN", value: null }, equipment: { state: "PARTIAL", value: null }
  };
  const candidate = contracts.validateCandidate({
    schemaVersion: contracts.SCHEMA_VERSION, targetId: target.targetId, catalogVariantKey: target.catalogVariantKey, year: target.year,
    identity: { manufacturer: target.manufacturer, model: target.family, generation: target.generation },
    sourceRoute: { state: "PARTIAL", officialUrl: null },
    authority: { state: "KNOWN", value: prospect.publisher }, publication: { state: "KNOWN", value: prospect.documentCode }, documentClass: prospect.documentClass,
    authenticationState: "AUTHENTICATED", accessState: "ACCESS-BLOCKED", exhaustionState: "ACTIVE", applicability,
    provenance: ["catalogue-coverage-queue", "source-prospect-authentication-quality-reassessment"],
    blockers: [...prospect.blockers, "EXACT-OFFICIAL-HTTPS-ROUTE-INCOMPLETE", "APPLICABILITY-DIMENSIONS-UNRESOLVED"]
  });
  return Object.freeze({ candidate, routeEvidence: { officialHost: prospect.officialHost, exactOfficialUrl: null, routeState: "PARTIAL" }, sourceProspectId: prospect.id });
}

function buildReport() {
  const selected = selectTargets();
  const known = knownCandidate(selected.known.target, selected.known.prospect);
  const unresolved = contracts.candidateFromQueueTarget(selected.unresolvedTarget);
  const candidates = [known.candidate, unresolved].sort((a, b) => a.targetId.localeCompare(b.targetId));
  return Object.freeze({
    schemaVersion: "revlog-source-discovery-pilot/v1", syntheticOnly: false, acquisitionPerformed: false, technicalValuesInspected: false,
    selection: { method: "first non-production target with a non-ready official-host prospect, plus first non-production target with no registered prospect", targetsConsidered: queueReport.counts.productionProfileAbsent, selected: [{ targetId: selected.known.target.targetId, reason: "existing official-host prospect tests discovered-but-not-ready handling" }, { targetId: selected.unresolvedTarget.targetId, reason: "no registered prospect tests unresolved identity handling" }] },
    metrics: { targetsConsidered: queueReport.counts.productionProfileAbsent, targetsSelected: candidates.length, officialRoutesFound: candidates.filter(item => item.sourceRoute.state === "KNOWN").length, officialRouteLeads: 1, authenticatedPublications: candidates.filter(item => item.authenticationState === "AUTHENTICATED").length, applicabilityResolved: candidates.filter(item => item.applicability.unresolvedDimensions.length === 0).length, applicabilityUnresolved: candidates.filter(item => item.applicability.unresolvedDimensions.length > 0).length, outcomes: Object.fromEntries(contracts.STATES.filter(state => ["EXECUTION-READY", "APPLICABILITY-PARTIAL", "BLOCKED", "UNRESOLVED"].includes(state)).map(state => [state, candidates.filter(item => item.state === state).length])) },
    existingProspectsReusedAsEvidence: [known.sourceProspectId], sourceProspectsCreated: [], candidates, routeEvidence: [known.routeEvidence], productionChanged: false, catalogueChanged: false, acquisitionPerformed: false, evidenceCreated: false, reviewCreated: false, promotionPerformed: false,
    bottlenecks: ["exact official HTTPS route not recorded for the known lead", "source access/authentication gate remains blocked", "market/year/ABS/transmission/equipment applicability remains unresolved", "no exact source identity exists for the unresolved target"]
  });
}

module.exports = Object.freeze({ buildReport, selectTargets });
