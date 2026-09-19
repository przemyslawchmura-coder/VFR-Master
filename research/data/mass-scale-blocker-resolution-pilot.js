// NON-PRODUCTION blocker-resolution projection for the approved ten-target plan.
// It consumes discovery metadata only; no source content is acquired or extracted.
"use strict";

const discovery = require("./mass-scale-source-discovery-pilot.js").buildReport();
const contracts = require("../factory/source-discovery-prospect-contracts.js");

const officialEvidence = Object.freeze({
  "bmw.c-scooter.c600-sport.2012": [
    "https://manuals.bmw-motorrad.com/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/C_0132_RM_0912_C600Sport_07.pdf"
  ],
  "ktm.390-duke.gen1.2013": [
    "https://sparepartsfinder.ktm.com/ComponentGroupTemplate/PrintComponentGroupTemplate/14012?culture=en&modelidentifier=1000264893&tenantId=1",
    "https://sparepartsfinder.ktm.com/ComponentGroupTemplate/PrintComponentGroupTemplate/14019?culture=en&modelidentifier=1000264893&tenantId=1"
  ]
});

function withoutIdentity(candidate) {
  const { id, state, ...input } = candidate;
  return input;
}

function resolvedCandidate(row) {
  const base = withoutIdentity(row.candidate);
  if (row.catalogVariantKey === "bmw.c-scooter.c600-sport") {
    return contracts.validateCandidate({
      ...base,
      documentClass: "official rider manual",
      applicability: {
        model: { state: "KNOWN", value: "C 600 Sport" }, year: { state: "KNOWN", value: 2012 },
        market: { state: "KNOWN", value: "USA" }, abs: { state: "KNOWN", value: true },
        transmission: { state: "KNOWN", value: "cvt" }, equipment: { state: "KNOWN", value: "standard C 600 Sport" }
      },
      blockers: []
    });
  }
  if (row.catalogVariantKey === "ktm.390-duke.gen1") {
    return contracts.validateCandidate({
      ...base,
      applicability: {
        model: base.applicability.model, year: base.applicability.year,
        market: { state: "KNOWN", value: "EU" },
        abs: { state: "KNOWN", value: true }, transmission: base.applicability.transmission,
        equipment: base.applicability.equipment
      },
      blockers: ["TRANSMISSION-UNKNOWN", "EQUIPMENT-UNKNOWN", "PARTS-ROUTE-IDENTIFIES-MANUAL-BUT-DOES-NOT-SUPPLY-CONTENT"]
    });
  }
  return contracts.validateCandidate(base);
}

function buildReport() {
  const targets = discovery.targets.map(row => {
    const candidate = resolvedCandidate(row);
    const readyProjection = candidate.state === "EXECUTION-READY" ? contracts.toExistingSourceProspect(candidate) : null;
    return Object.freeze({
      targetId: row.targetId, catalogVariantKey: row.catalogVariantKey, year: row.year,
      before: row.after, after: candidate.state, candidate,
      evidenceUrls: officialEvidence[row.catalogVariantKey] || (row.candidate.sourceRoute.officialUrl ? [row.candidate.sourceRoute.officialUrl] : []),
      sourceProspectCreated: false,
      readyProspectProjectionId: readyProjection ? readyProjection.id : null,
      acquisitionAllowed: false,
      blockers: candidate.blockers
    });
  });
  const counts = Object.fromEntries(["EXECUTION-READY", "APPLICABILITY-PARTIAL", "BLOCKED", "EXHAUSTED", "DISCOVERED", "UNRESOLVED"].map(state => [state, targets.filter(item => item.after === state).length]));
  return Object.freeze({
    schemaVersion: "revlog-mass-scale-blocker-resolution-pilot/v1", date: "2026-09-19", planningOnly: true,
    inputReport: "mass-scale-source-discovery-pilot/v1", targetsConsidered: 10, targets,
    beforeStates: Object.freeze(Object.fromEntries(targets.map(item => [item.targetId, item.before]))),
    afterStates: counts,
    newlyExecutionReady: targets.filter(item => item.after === "EXECUTION-READY").map(item => ({ targetId: item.targetId, catalogVariantKey: item.catalogVariantKey, prospectProjectionId: item.readyProspectProjectionId })),
    metrics: Object.freeze({ officialEvidenceRoutes: targets.reduce((sum, item) => sum + item.evidenceUrls.length, 0), executionReady: counts["EXECUTION-READY"], acquisitionAllowed: 0, sourceContentAcquired: 0, extractionPerformed: 0 }),
    sourceProspectsCreated: [], acquisitionPerformed: false, extractionPerformed: false, evidenceCreated: false, reviewCreated: false, promotionPerformed: false, productionChanged: false, catalogueChanged: false, runtimeChanged: false, cloudChanged: false,
    safeForAcquisition: false,
    safeForAcquisitionReason: "The wave resolves metadata blockers only; even the one EXECUTION-READY projection is not an acquisition command and requires a separate bounded authorization.",
    next: "Execute acquisition only for the separately authorized BMW C 600 Sport 2012 prospect projection, preserving the remaining nine targets as blocked or unresolved."
  });
}

module.exports = Object.freeze({ buildReport });
