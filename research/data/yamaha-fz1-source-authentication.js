// NON-PRODUCTION Yamaha FZ1 source authentication and planning metadata.
// No source document was acquired and no technical value is introduced here.
"use strict";

const factory = require("../factory/index.js");
const mappingFixtures = require("./identity-mappings/fz1.js");

const unknown = () => ({ state: "UNKNOWN", values: [] });
const known = values => ({ state: "KNOWN", values: Array.isArray(values) ? values : [values] });
const range = (from, to) => ({ kind: "RANGE", from, to });
const exact = year => ({ kind: "EXACT", from: year, to: year });
const scope = ({ models, generations, years, markets = unknown(), transmissions = unknown(), abs = unknown(), equipment = unknown(), bodyStyles = unknown() }) => ({
  schemaVersion: 1,
  model: models,
  generation: generations,
  years,
  markets,
  transmissions,
  abs,
  equipment,
  bodyStyles
});

const target = factory.validateResearchTarget({
  schemaVersion: 1,
  id: "target.yamaha.fz1.gen2.2006-2015.unknown",
  catalogVariantKey: "yamaha.fz1.gen2",
  manufacturer: "Yamaha",
  family: "FZ1 / Fazer 1000",
  scope: scope({
    models: known(["FZ1-N", "FZ1-S", "FZ1 Fazer"]),
    generations: known(["II"]),
    years: range(2006, 2015),
    bodyStyles: known(["naked", "faired"])
  }),
  identityMapping: mappingFixtures.fz1Gen2,
  sourcePriorityPolicyId: "tier-ab-practical-marginal-v1",
  serviceCoreBaseline: { verified: 0, total: 44 },
  knownSourceRefs: [],
  knownProspectRefs: [
    "prospect.yamaha.fz1.service.2d1-28197-e0",
    "prospect.yamaha.fz1.owner.2d1x-2010"
  ],
  researchHistoryRefs: [],
  riskFlags: [
    "market is not selected",
    "ABS applicability is not selected",
    "equipment and emissions variants are not selected",
    "N/S body-style applicability must remain explicit per source"
  ],
  state: "PLANNED"
});

const common = {
  schemaVersion: 1,
  targetId: target.id,
  authority: { state: "KNOWN", name: "Yamaha Motor Co., Ltd." },
  sourceTier: "A",
  exhaustionState: "ACTIVE",
  expectedMarginalGapClass: "HIGH",
  priorAttemptRefs: [],
  blockers: [],
  nextAction: "Acquire only in a later bounded wave; do not inspect or extract in this planning wave."
};

const serviceProspect = factory.validateSourceProspect({
  ...common,
  id: "prospect.yamaha.fz1.service.2d1-28197-e0",
  documentClass: "service manual",
  documentIdentity: { state: "KNOWN", title: "FZ1-N(V) / FZ1-S(V) Service Manual" },
  publication: { relationship: "SINGLE", identifiers: [{ value: "2D1-28197-E0", namespace: "Yamaha-OEM", region: "UNKNOWN", type: "publication-code", proofState: "CORROBORATED" }] },
  officialLocations: [{ host: "rmi.yamaha-motor.eu", path: "/en/", role: "Yamaha-controlled repair and maintenance information route" }],
  authenticationState: "PARTIAL",
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL", fullContent: "ACCESS-BLOCKED-AUTH" },
  applicability: scope({
    models: known(["FZ1-N", "FZ1-S"]),
    generations: known(["II"]),
    years: exact(2006),
    bodyStyles: known(["naked", "faired"])
  }),
  readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL",
  blockers: [
    "publication code is recorded in the existing OEM source inventory but not directly exposed by the Yamaha public index inspected in this wave",
    "the 2006 publication is not proven for every target year 2006-2015",
    "market, ABS, equipment and emissions applicability remain unresolved",
    "full content requires authenticated RMI/dealer access"
  ],
  nextAction: "Later: authenticate exact Yamaha delivery metadata and acquire only within the resolved year/market/variant scope."
});

const ownerProspect = factory.validateSourceProspect({
  ...common,
  id: "prospect.yamaha.fz1.owner.2d1x-2010",
  documentClass: "owner manual",
  documentIdentity: { state: "KNOWN", title: "FZ1-N / FZ1-NA Owner's Manual" },
  publication: { relationship: "SINGLE", identifiers: [{ value: "2D1X", namespace: "Yamaha-Japan-owner-manual-index", region: "JP", type: "model-code", proofState: "AUTHENTICATED" }] },
  officialLocations: [{ host: "www2.yamaha-motor.co.jp", path: "/Manual/pdf/mc/20102D1X.pdf", role: "Yamaha official owner-manual download route listed by the official index" }],
  authenticationState: "AUTHENTICATED",
  accessibility: { metadata: "ACCESSIBLE-OFFICIAL-HTML", fullContent: "ACCESSIBLE-OFFICIAL" },
  applicability: scope({
    models: known(["FZ1-N", "FZ1-NA"]),
    generations: known(["II"]),
    years: exact(2010),
    bodyStyles: known(["naked"])
  }),
  expectedMarginalGapClass: "MEDIUM",
  readinessClassification: "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL",
  blockers: [
    "official index proves a 2010 FZ1-N/2D1X route, not applicability to the full 2006-2015 target range",
    "JP index region does not prove EU, UK or North-American applicability",
    "FZ1-NA ABS relationship is named but the target ABS state is intentionally unresolved",
    "owner-manual content was not acquired or inspected"
  ],
  nextAction: "Later: acquire only as an optional 2010 naked/JP-scoped source; do not generalize it to FZ1-S or other markets."
});

const prospects = Object.freeze([serviceProspect, ownerProspect]);

function buildReport() {
  const identityMapping = factory.resolveIdentityMapping(mappingFixtures.fz1Gen2, scope({
    models: unknown(),
    generations: unknown(),
    years: range(2006, 2015),
    bodyStyles: known(["naked", "faired"])
  }));
  const readiness = Object.freeze(prospects.map(prospect => ({ id: prospect.id, result: factory.evaluateReadiness(target, prospect) })));
  return Object.freeze({
    schemaVersion: "revlog-yamaha-fz1-source-authentication/v1",
    date: "2026-09-08",
    target,
    primaryModelYear: 2010,
    primaryModelYearBasis: "A 2010 FZ1-N official Yamaha owner-manual index route is the narrowest exact-year source lead in this bounded set; it does not redefine the target range.",
    identityMapping,
    prospects,
    authenticatedPublicationIds: Object.freeze(["2D1X"]),
    authenticationLeads: Object.freeze(["2D1-28197-E0"]),
    readiness,
    sourceBudget: Object.freeze({ maxPrimaryServicePublications: 1, maxOwnerManualPublications: 1, maxPartsPublications: 0, maxSupplements: 0, rationale: "One service publication plus one narrowly scoped owner-manual lead; stop before a broader Yamaha document catalogue." }),
    plannedRiderServiceCoreAreas: Object.freeze(["lubrication", "cooling", "spark/ignition", "tires/wheels", "maintenance intervals", "valve clearances", "chain slack", "brake fluid and limits", "battery/fuses", "service torques", "idle speed", "clutch adjustment"]),
    technicalValuesInspected: false,
    rawCandidatesCreated: 0,
    reviewQueueEntriesCreated: 0,
    humanReviewDecisionsCreated: 0,
    evidenceRowsAdded: 0,
    researchedNoEvidenceAdded: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    runtimeChanged: false,
    catalogueChanged: false,
    audit: Object.freeze({
      classification: "ACCEPT-WITH-RISKS",
      conclusion: "The FZ1 II grouping is deterministically mapped to the separate N and S catalogue identities. Yamaha official material authenticates the 2010 FZ1-N owner-manual route and official Yamaha delivery/provenance routes, while the 2D1 service publication remains an authenticated planning lead with partial public code proof. Year, market, ABS, equipment and emissions applicability remain fail-closed.",
      falsification: Object.freeze([
        "FZ1 gen1/FZS1000 remains outside the selected gen2 mapping.",
        "FZ1-N and FZ1-S remain separate runtime identities; no body-style merge is performed.",
        "The 2010 JP owner route is not generalized to EU/UK/USA or to FZ1-S.",
        "No source document was downloaded, opened or parsed, and no service value was created."
      ])
    }),
    exactNextTask: "Execute one bounded FZ1 source-acquisition wave for the authenticated 2010 FZ1-N/2D1X owner-manual route only; keep 2D1-28197-E0 as an authentication lead until its exact Yamaha publication metadata is re-established, and create no evidence automatically."
  });
}

module.exports = Object.freeze({ target, prospects, buildReport });
