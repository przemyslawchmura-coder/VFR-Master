// NON-PRODUCTION Triumph prospect registration metadata. Contains no technical values.
"use strict";

const factory = require("../factory/index.js");

const target = Object.freeze({
  schemaVersion: 1,
  id: "target.triumph.streettriple765.gen3.my23.eu",
  catalogVariantKey: "triumph.street-triple.765-3",
  manufacturer: "Triumph",
  family: "Street Triple 765 III",
  scope: Object.freeze({ schemaVersion: 1, model: { state: "KNOWN", values: ["Street Triple 765"] }, generation: { state: "KNOWN", values: ["III"] }, years: { kind: "EXACT", from: 2023, to: 2023 }, markets: { state: "KNOWN", values: ["EU"] }, transmissions: { state: "KNOWN", values: ["manual"] }, abs: { state: "KNOWN", values: [true] }, equipment: { state: "KNOWN", values: ["standard/base road model"] } }),
  sourcePriorityPolicyId: "policy.tier-a-first",
  serviceCoreBaseline: { verified: 0, total: 44 },
  knownSourceRefs: [],
  knownProspectRefs: ["unknown.triumph.streettriple765"],
  researchHistoryRefs: [],
  riskFlags: ["official handbook combines Street Triple S 660, R, R LRH and RS", "EU market applicability is not explicit in the authenticated global EN delivery record", "base/R/RS equipment boundary is unresolved"],
  state: "RESEARCH-MORE"
});

const prospect = Object.freeze({
  schemaVersion: 1,
  id: "prospect.triumph.streettriple765.owner.my23.eu",
  targetId: target.id,
  documentClass: "owner handbook",
  authority: { state: "KNOWN", name: "Triumph Motorcycles Limited" },
  documentIdentity: { state: "KNOWN", title: "Owner's Handbook — Street Triple S (660cc), Street Triple R, Street Triple R (LRH) and Street Triple RS, 3850186_2-EN issue 2" },
  publication: { relationship: "SINGLE", identifiers: [{ value: "3850186_2-EN", namespace: "Triumph handbook publication", region: "global EN", type: "official-PDF-publication", proofState: "AUTHENTICATED" }] },
  officialLocations: [{ host: "api.triumphtechnicalinformation.com", path: "/handbooks/documents/6493f9eab74cf69ba9a7301d/pdf", role: "official Triumph Technical Information owner-handbook delivery" }, { host: "www.triumphmotorcycles.com", path: "/owners/manuals", role: "official Triumph owner-handbook library" }],
  sourceTier: "A",
  authenticationState: "AUTHENTICATED",
  applicability: Object.freeze({ schemaVersion: 1, model: { state: "KNOWN", values: ["Street Triple 765"] }, generation: { state: "KNOWN", values: ["III"] }, years: { kind: "EXACT", from: 2023, to: 2023 }, markets: { state: "UNKNOWN", values: [] }, transmissions: { state: "KNOWN", values: ["manual"] }, abs: { state: "KNOWN", values: [true] }, equipment: { state: "UNKNOWN", values: [] } }),
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL", fullContent: "ACCESSIBLE-OFFICIAL" },
  exhaustionState: "ACTIVE",
  expectedMarginalGapClass: "UNKNOWN",
  priorAttemptRefs: [],
  blockers: ["official document identity is a combined S/R/R LRH/RS handbook rather than a base-only identity", "EU market applicability is unresolved for the global EN publication record", "base versus R versus RS equipment applicability is unresolved"],
  readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL",
  nextAction: "Do not acquire or inspect until Triumph-controlled metadata resolves EU market and base/R/RS applicability for an exact MY2023 Street Triple 765 scope"
});

function buildReport() {
  const validatedTarget = factory.validateResearchTarget(target);
  const validatedProspect = factory.validateSourceProspect(prospect);
  const readiness = factory.evaluateReadiness(validatedTarget, validatedProspect);
  return Object.freeze({ schemaVersion: "revlog-triumph-streettriple765-prospect-registration/v1", date: "2026-09-03", startingProspectId: "unknown.triumph.streettriple765", target: validatedTarget, prospect: validatedProspect, readiness, officialResearch: Object.freeze({ authoritySource: "https://www.triumphmotorcycles.com/owners/manuals", exactDocumentSource: "https://api.triumphtechnicalinformation.com/handbooks/documents/6493f9eab74cf69ba9a7301d/pdf", sourceClass: "official Triumph owner handbook", publicationId: "3850186_2-EN", publicationIssue: "issue 2, June 2023", exactDocumentAuthenticated: true, metadataOnly: true, routeAccessResult: "official PDF accessible" }), externalResearchPerformed: true, technicalValuesInspected: false, rawCandidatesCreated: 0, reviewQueueEntriesCreated: 0, humanReviewDecisionsCreated: 0, evidenceProcessingRecordsCreated: 0, evidenceRowsAdded: 0, researchedNoEvidenceAdded: 0, serviceCoreCoverageChanged: false, productionChanged: false, runtimeChanged: false, catalogueChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "One official Triumph Tier A owner-handbook prospect was authenticated for the representative MY2023 Street Triple 765 III identity, but the exact EU and base/R/RS applicability dimensions remain unresolved. Canonical readiness is therefore fail-closed and not execution-ready; no technical values were inspected.", risks: Object.freeze(["the official handbook explicitly combines S 660, R, R LRH and RS", "the global EN record does not establish EU market applicability by itself", "no base-only document identity was found in this bounded search"]), falsification: Object.freeze(["no technical values were inspected", "no service/manual values were extracted", "no downstream research or production stage was invoked"]) }), exactNextTask: "Resolve only the Triumph MY2023 EU and base/R/RS applicability metadata for the authenticated 3850186_2-EN handbook; do not acquire or inspect content while those dimensions remain unresolved." });
}

module.exports = Object.freeze({ target, prospect, buildReport });
