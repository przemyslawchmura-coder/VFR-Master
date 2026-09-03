// NON-PRODUCTION BMW prospect registration metadata. Contains no technical values.
"use strict";

const factory = require("../factory/index.js");

const target = Object.freeze({
  schemaVersion: 1,
  id: "target.bmw.f900r.gen1.my20.eu",
  catalogVariantKey: "bmw.f-roadster-xr.f900r-1",
  manufacturer: "BMW",
  family: "F 900 R I",
  scope: Object.freeze({
    schemaVersion: 1,
    model: { state: "KNOWN", values: ["F 900 R"] },
    generation: { state: "KNOWN", values: ["I"] },
    years: { kind: "EXACT", from: 2020, to: 2020 },
    markets: { state: "KNOWN", values: ["EU"] },
    transmissions: { state: "KNOWN", values: ["manual"] },
    abs: { state: "KNOWN", values: [true] },
    equipment: { state: "KNOWN", values: ["standard road model"] }
  }),
  sourcePriorityPolicyId: "policy.tier-a-first",
  serviceCoreBaseline: { verified: 0, total: 44 },
  knownSourceRefs: [],
  knownProspectRefs: ["unknown.bmw.f900r"],
  researchHistoryRefs: [],
  riskFlags: ["official manual also identifies F 900 R A2 (0K31); only base F 900 R (0K11) is in scope", "country-specific equipment variations remain outside this metadata registration"],
  state: "PLANNED"
});

const prospect = Object.freeze({
  schemaVersion: 1,
  id: "prospect.bmw.f900r.owner.my20.eu",
  targetId: target.id,
  documentClass: "rider manual",
  authority: { state: "KNOWN", name: "BMW Motorrad / BMW AG" },
  documentIdentity: { state: "KNOWN", title: "Rider's Manual F 900 R (0K11), May 2020, 2nd edition" },
  publication: { relationship: "SINGLE", identifiers: [{ value: "F_0K11_RM_0520_76.pdf", namespace: "BMW Motorrad manual publication", region: "EU", type: "official-PDF-publication", proofState: "AUTHENTICATED" }] },
  officialLocations: [{ host: "manuals.bmw-motorrad.com", path: "/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/F_0K11_RM_0520_76.pdf", role: "official BMW Motorrad rider manual" }],
  sourceTier: "A",
  authenticationState: "AUTHENTICATED",
  applicability: Object.freeze({
    schemaVersion: 1,
    model: { state: "KNOWN", values: ["F 900 R"] },
    generation: { state: "KNOWN", values: ["I"] },
    years: { kind: "EXACT", from: 2020, to: 2020 },
    markets: { state: "KNOWN", values: ["EU"] },
    transmissions: { state: "KNOWN", values: ["manual"] },
    abs: { state: "KNOWN", values: [true] },
    equipment: { state: "KNOWN", values: ["standard road model"] }
  }),
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL", fullContent: "ACCESSIBLE-OFFICIAL" },
  exhaustionState: "ACTIVE",
  expectedMarginalGapClass: "HIGH",
  priorAttemptRefs: [],
  blockers: [],
  readinessClassification: "EXECUTION-READY",
  nextAction: "Execute one bounded acquisition under the authenticated MY2020 EU base F 900 R (0K11) scope"
});

function buildReport() {
  const validatedTarget = factory.validateResearchTarget(target);
  const validatedProspect = factory.validateSourceProspect(prospect);
  const readiness = factory.evaluateReadiness(validatedTarget, validatedProspect);
  return Object.freeze({
    schemaVersion: "revlog-bmw-f900r-prospect-registration/v1",
    date: "2026-09-03",
    startingProspectId: "unknown.bmw.f900r",
    target: validatedTarget,
    prospect: validatedProspect,
    readiness,
    officialResearch: Object.freeze({ authoritySource: "https://www.bmw-motorrad.com/", exactManualSource: "https://manuals.bmw-motorrad.com/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/F_0K11_RM_0520_76.pdf", sourceClass: "official BMW Motorrad rider manual", exactDocumentAuthenticated: true, metadataOnly: true }),
    externalResearchPerformed: true,
    technicalValuesInspected: false,
    rawCandidatesCreated: 0,
    reviewQueueEntriesCreated: 0,
    humanReviewDecisionsCreated: 0,
    evidenceProcessingRecordsCreated: 0,
    evidenceRowsAdded: 0,
    researchedNoEvidenceAdded: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    runtimeChanged: false,
    catalogueChanged: false,
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "One exact Tier A BMW Motorrad rider-manual prospect is authenticated for the representative EU MY2020 base F 900 R 0K11 scope. Canonical readiness passes at metadata level; no technical values were inspected.", risks: Object.freeze(["the manual also names the separately excluded F 900 R A2 0K31 variant", "country-specific equipment variations remain outside this registration"]), falsification: Object.freeze(["no technical values were inspected", "F 900 XR and unrelated BMW models were not used", "no downstream research or production stage was invoked"]) }),
    exactNextTask: "Execute one bounded BMW F 900 R I MY2020 EU base-road owner/rider-manual acquisition under the authenticated 0K11 scope; inspect technical values only in that later task and do not auto-promote evidence."
  });
}

module.exports = Object.freeze({ target, prospect, buildReport });
