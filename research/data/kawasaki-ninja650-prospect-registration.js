// NON-PRODUCTION Kawasaki prospect registration metadata. Contains no technical values.
"use strict";

const factory = require("../factory/index.js");

const target = Object.freeze({
  schemaVersion: 1,
  id: "target.kawasaki.ninja650.gen2.my20.eu",
  catalogVariantKey: "kawasaki.ninja-650.gen2",
  manufacturer: "Kawasaki",
  family: "Ninja 650 II",
  scope: Object.freeze({ schemaVersion: 1, model: { state: "KNOWN", values: ["Ninja 650"] }, generation: { state: "KNOWN", values: ["II"] }, years: { kind: "EXACT", from: 2020, to: 2020 }, markets: { state: "KNOWN", values: ["EU"] }, transmissions: { state: "KNOWN", values: ["manual"] }, abs: { state: "KNOWN", values: [true] }, equipment: { state: "KNOWN", values: ["standard road model"] } }),
  sourcePriorityPolicyId: "policy.tier-a-first",
  serviceCoreBaseline: { verified: 0, total: 44 },
  knownSourceRefs: [],
  knownProspectRefs: ["unknown.kawasaki.ninja650"],
  researchHistoryRefs: [],
  riskFlags: ["exact EU manual identity unavailable", "official manual portal redirect loop", "source applicability not fully proven"],
  state: "BLOCKED"
});

const prospect = Object.freeze({
  schemaVersion: 1,
  id: "prospect.kawasaki.ninja650.owner.my20.eu",
  targetId: target.id,
  documentClass: "owner manual",
  authority: { state: "KNOWN", name: "Kawasaki Motors Europe N.V." },
  documentIdentity: { state: "UNKNOWN", title: "" },
  publication: { relationship: "RELATIONSHIP-UNRESOLVED", identifiers: [{ value: "Ninja 650 MY2020 owner-manual route", namespace: "Kawasaki-EU-owner-manual-route", region: "EU", type: "route-reference", proofState: "CORROBORATED" }] },
  officialLocations: [{ host: "pws.ktivs.net", path: "/manuals", role: "Kawasaki EU-linked owner-manual delivery route" }, { host: "www.kawasaki.eu", path: "/en/service/Useful_links.html", role: "Kawasaki Europe official route index" }],
  sourceTier: "A",
  authenticationState: "PARTIAL",
  applicability: { schemaVersion: 1, model: { state: "KNOWN", values: ["Ninja 650"] }, generation: { state: "KNOWN", values: ["II"] }, years: { kind: "UNKNOWN", from: null, to: null }, markets: { state: "UNKNOWN", values: [] }, transmissions: { state: "KNOWN", values: ["manual"] }, abs: { state: "KNOWN", values: [true] }, equipment: { state: "KNOWN", values: ["standard road model"] } },
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL", fullContent: "ACCESS-BROKEN" },
  exhaustionState: "ACTIVE",
  expectedMarginalGapClass: "MEDIUM",
  priorAttemptRefs: [],
  blockers: ["exact Tier A/B document identity is not exposed by the official owner-manual route", "Kawasaki owner-manual portal returned a redirect loop", "source MY2020 applicability is unresolved", "source EU market applicability is unresolved", "full content accessibility is not feasible without resolving the official route"],
  readinessClassification: "ACCESS-BLOCKED",
  nextAction: "Do not acquire or inspect until Kawasaki exposes an exact EU MY2020 Ninja 650 owner-manual identity and a feasible official delivery path"
});

function buildReport() {
  const validatedTarget = factory.validateResearchTarget(target);
  const validatedProspect = factory.validateSourceProspect(prospect);
  const readiness = factory.evaluateReadiness(validatedTarget, validatedProspect);
  return Object.freeze({
    schemaVersion: "revlog-kawasaki-ninja650-prospect-registration/v1",
    date: "2026-09-03",
    startingProspectId: "unknown.kawasaki.ninja650",
    target: validatedTarget,
    prospect: validatedProspect,
    readiness,
    officialResearch: Object.freeze({ authoritySource: "https://www.kawasaki.eu/en/service/Useful_links.html", modelYearSource: "https://storage.kawasaki.eu/repository/be/nl-BE/Brochures_2020/Ninja_Supersport_brochure_2020_PDF_3.pdf", ownerManualRoute: "https://pws.ktivs.net/manuals", routeAccessResult: "redirect-loop", exactDocumentAuthenticated: false }),
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
    audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "Kawasaki Europe exposes an official owner-manual route and official 2020 Ninja 650 EU model context, but the exact EU MY2020 document identity and feasible content path could not be authenticated. The prospect remains fail-closed and not execution-ready.", risks: Object.freeze(["official owner-manual route currently redirects in a loop", "US Owner Center material was not used as EU evidence", "no exact source identity or content was inspected"]), falsification: Object.freeze(["no technical values were inspected", "no service/manual values were extracted", "no downstream research or production stage was invoked"]) }),
    exactNextTask: "Revisit only when a Kawasaki-controlled exact EU MY2020 Ninja 650 owner-manual identity and feasible official delivery path become available; otherwise keep this prospect blocked."
  });
}

module.exports = Object.freeze({ target, prospect, buildReport });
