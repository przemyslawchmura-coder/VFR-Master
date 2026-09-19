// NON-PRODUCTION deterministic planning artifact. It creates no work items or research state.
"use strict";

const queue = require("./catalogue-coverage-queue.js").buildReport();
const readiness = require("./source-prospect-authentication-quality-reassessment.js");

const prospectsByKey = new Map();
readiness.prospects.forEach(item => {
  const list = prospectsByKey.get(item.catalogVariantKey) || [];
  list.push(item);
  prospectsByKey.set(item.catalogVariantKey, list);
});
const absent = queue.targets.filter(item => item.production.state === "ABSENT");

function matchingKnownProspect(target) {
  return (prospectsByKey.get(target.catalogVariantKey) || []).filter(item => item.officialHost && ["AUTHENTICATED-BUT-APPLICABILITY-PARTIAL", "ACCESS-BLOCKED", "SOURCE-IDENTITY-PARTIAL"].includes(item.classification) && item.years && Number.isInteger(item.years.from) && target.year >= item.years.from && target.year <= item.years.to).sort((a, b) => a.id.localeCompare(b.id))[0] || null;
}

function selectTargets() {
  const selected = [];
  const usedManufacturers = new Set();
  absent.forEach(target => {
    const prospect = matchingKnownProspect(target);
    if (prospect && !usedManufacturers.has(target.manufacturer)) {
      selected.push({ target, prospect });
      usedManufacturers.add(target.manufacturer);
    }
  });
  absent.filter(target => target.source.state === "UNRESOLVED" && !usedManufacturers.has(target.manufacturer)).forEach(target => {
    if (selected.length < 10 && !usedManufacturers.has(target.manufacturer)) {
      selected.push({ target, prospect: null });
      usedManufacturers.add(target.manufacturer);
    }
  });
  return Object.freeze(selected.slice(0, 10));
}

function planRow({ target, prospect }) {
  const sourceProspect = prospect ? {
    id: prospect.id, classification: prospect.classification, sourceTier: prospect.sourceTier, documentClass: prospect.documentClass,
    officialHost: prospect.officialHost, publicationId: prospect.documentCode, authenticationState: prospect.gate.authorityKnown && prospect.gate.documentIdentityKnown ? "AUTHENTICATED-METADATA" : "PARTIAL",
    expectedMarginalPracticalGapClass: prospect.expectedMarginalPracticalGapClass, blockers: prospect.blockers
  } : null;
  const nextAction = target.source.state === "BLOCKED"
    ? "resolve the exact official route, access boundary and applicability before acquisition"
    : "register an exact Tier A/B official source prospect with publication and applicability proof; do not acquire yet";
  return Object.freeze({
    targetId: target.targetId, manufacturer: target.manufacturer, family: target.family, generation: target.generation,
    year: target.year, catalogVariantKey: target.catalogVariantKey,
    selectionReason: prospect ? "non-production target with an existing official-source prospect; tests real blocked/readiness handling" : "first unresolved non-production target for a manufacturer not otherwise represented in the sample; tests identity discovery gap",
    production: target.production, research: target.research, source: { state: target.source.state, prospect: sourceProspect },
    targetApplicability: target.applicability, unresolvedApplicability: target.applicability.unresolvedDimensions,
    expectedPracticalCoreValue: sourceProspect?.expectedMarginalPracticalGapClass || "UNKNOWN",
    expectedNextDiscoveryResearchAction: nextAction,
    blockers: sourceProspect?.blockers || ["SOURCE-IDENTITY-NOT-REGISTERED", "MARKET-ABS-TRANSMISSION-EQUIPMENT-UNKNOWN"]
  });
}

function buildReport() {
  const rows = selectTargets().map(planRow);
  const readinessDistribution = Object.freeze(Object.fromEntries(["READY", "BLOCKED", "EXHAUSTED", "UNRESOLVED"].map(state => [state, rows.filter(row => row.source.state === state).length])));
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-planning-pilot/v1", date: "2026-09-19", planningOnly: true,
    pipeline: ["catalogue", "catalogue-coverage-queue", "source-discovery-prospect"],
    selection: Object.freeze({ targetsConsidered: absent.length, targetsSelected: rows.length, method: "one deterministic non-production official-prospect target per available prospect-bearing manufacturer, then first unresolved target per new manufacturer, catalogue/projection order preserved", avoidedProductionProfiles: true, diversityManufacturers: [...new Set(rows.map(row => row.manufacturer))].sort() }),
    readinessDistribution, targets: rows,
    metrics: Object.freeze({ officialRouteLeads: rows.filter(row => row.source.prospect?.officialHost).length, authenticatedPublications: rows.filter(row => row.source.prospect?.authenticationState === "AUTHENTICATED-METADATA").length, exactReadySources: rows.filter(row => row.source.state === "READY").length, blockedSources: rows.filter(row => row.source.state === "BLOCKED").length, exhaustedSources: rows.filter(row => row.source.state === "EXHAUSTED").length, unresolvedSources: rows.filter(row => row.source.state === "UNRESOLVED").length, productionEntriesCreated: 0, acquisitionAttempts: 0 }),
    safeToExecute: false, safeToExecuteReason: "Planning is deterministic and read-only, but no selected source is EXECUTION-READY; discovery/applicability gates must be resolved in a later bounded wave.",
    externalResearchPerformed: false, acquisitionPerformed: false, extractionPerformed: false, evidenceCreated: false, reviewCreated: false, promotionPerformed: false, productionChanged: false, catalogueChanged: false, runtimeChanged: false, cloudChanged: false,
    next: "Execute only the bounded approximately-10-motorcycle source-discovery/research planning batch after explicit authorization; this artifact is not an execution command."
  });
}

module.exports = Object.freeze({ buildReport, selectTargets });
