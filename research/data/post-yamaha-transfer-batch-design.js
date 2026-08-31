// NON-PRODUCTION design only. No external source is accessed and no evidence is created here.
"use strict";

const honda = require("./high-value-source-acquisition-pilot-results.js").runPilot();
const yamaha = require("./yamaha-transfer-acquisition-batch-results.js").runBatch();

const sourceCertainty = Object.freeze(["KNOWN-AUTHENTICATED", "KNOWN-REGISTERED-NOT-REAUTHENTICATED", "PARTIAL", "UNKNOWN"]);
const baseline = Object.freeze({
  honda: Object.freeze({ targets: 5, documents: honda.metrics.documentsInspected, yieldingDocuments: honda.metrics.documentsYieldingEvidence, verifiedGain: honda.metrics.verifiedTargetSlotGain, practicalGain: honda.metrics.practicalServiceFieldGain, genericGain: honda.metrics.genericSpecificationGain, before: honda.metrics.serviceCoreBefore, after: honda.metrics.serviceCoreAfter, conflicts: honda.metrics.conflictsDiscovered, practicalPerYieldingDocument: honda.metrics.practicalServiceFieldGain / honda.metrics.documentsYieldingEvidence, practicalPerInspectedDocument: honda.metrics.practicalServiceFieldGain / honda.metrics.documentsInspected }),
  yamaha: Object.freeze({ targets: 2, documents: yamaha.metrics.documentsInspected, yieldingDocuments: yamaha.metrics.documentsYieldingEvidence, verifiedGain: yamaha.metrics.netNewVerifiedSlots, practicalGain: yamaha.metrics.practicalServiceFieldGain, genericGain: yamaha.metrics.genericSpecificationGain, before: yamaha.metrics.verifiedSlotsBefore, after: yamaha.metrics.verifiedSlotsAfter, conflicts: yamaha.metrics.conflictsDiscovered, practicalPerYieldingDocument: yamaha.metrics.practicalServiceFieldGain / yamaha.metrics.documentsYieldingEvidence, practicalPerInspectedDocument: yamaha.metrics.practicalServiceFieldGain / yamaha.metrics.documentsInspected })
});

const model = Object.freeze({
  name: "risk-adjusted expected marginal practical gain per authenticated primary document",
  formula: "((expectedPracticalMin + expectedPracticalMax) / 2 / expectedPrimaryDocuments) - source/applicability/safety penalties - duplicateResearchPenalty",
  eligibility: "UNKNOWN source prospects have score=null and cannot be selected. A concrete exact or partially mapped Tier A/B document identity is required.",
  marginalRule: "Remaining total gap is context only. Scoring uses the fields plausibly obtainable from the next source, never all missing fields.",
  penaltyScale: Object.freeze({ minor: 1, material: 2, severe: 4 }),
  caveat: "Ranges and scores are prioritization hypotheses, not probabilities or evidence."
});

const candidates = Object.freeze([
  {
    manufacturer: "Harley-Davidson", catalogVariantKey: "harley-davidson.revolution-max.sportster-s", model: "Sportster S / RH1250S", years: { from: 2022, to: 2022 }, markets: ["USA"], startingCoverage: 0, remainingPracticalGap: 37,
    researchHistory: "Repository registers a 2022 US 8-DOM Harley-Davidson owner-manual URL and maps three candidates to Sportster S: battery, charging output and spark-plug gap; no Service Core row is verified.",
    sourceProspect: Object.freeze({ identity: "2022 Harley-Davidson Owner's Manual, document path identifies 94001064 English (United States) 8 DOM", sourceClass: "official-owner-manual", tier: "A", url: "https://serviceinfo.harley-davidson.com/sip/service/document/original/1802738810358052210/2022-08-23%2094001064%20English%20%28United%20States%29%208%20DOM%20HARLEY-DAVIDSON%20OWNERS%20MANUAL.pdf", officialHost: "serviceinfo.harley-davidson.com", certainty: "KNOWN-REGISTERED-NOT-REAUTHENTICATED", richness: "PARTIAL: three technical candidates, but no stored pages/sections or complete content audit" }),
    confidence: Object.freeze({ identity: "MEDIUM", year: "HIGH", market: "HIGH" }), risks: Object.freeze({ abs: "HIGH", transmission: "LOW", equipment: "HIGH", safetyCriticalApplicability: "HIGH" }), expectedReuse: "LOW until exact included-model list is authenticated", duplicateResearchPenalty: 0,
    expectedPracticalGain: Object.freeze({ min: 6, max: 18 }), expectedPrimaryDocuments: 1, expectedPracticalGainPerDocument: Object.freeze({ min: 6, max: 18 }), riskPenalty: 4, score: 8,
    status: "SELECT", reason: "Only concrete new-manufacturer Tier A prospect; official host and existing Sportster S candidates justify a one-document authentication/yield test, with fail-closed applicability."
  },
  {
    manufacturer: "Yamaha", catalogVariantKey: "yamaha.mt-09.gen3", model: "MT-09 III", years: { from: 2021, to: 2021 }, markets: ["EU"], startingCoverage: 29, remainingPracticalGap: 10,
    researchHistory: "Owner manual yielded 27 practical slots; repository identifies service manual B7N-28197-E0 / LIT-11616-34-61 but has not inspected technical pages.",
    sourceProspect: Object.freeze({ identity: "MT-09 / MT-09 SP Service Manual B7N-28197-E0", sourceClass: "official-service-manual", tier: "A", officialHost: "not stored; OEM attribution observed through delivery metadata", certainty: "KNOWN-AUTHENTICATED", richness: "UNKNOWN technical-page yield; likely workshop-only marginal gaps" }),
    confidence: Object.freeze({ identity: "HIGH", year: "HIGH", market: "MEDIUM" }), risks: Object.freeze({ abs: "LOW", transmission: "LOW", equipment: "HIGH", safetyCriticalApplicability: "MEDIUM" }), expectedReuse: "MEDIUM if standard/SP tables are explicit", duplicateResearchPenalty: 2,
    expectedPracticalGain: Object.freeze({ min: 4, max: 8 }), expectedPrimaryDocuments: 1, expectedPracticalGainPerDocument: Object.freeze({ min: 4, max: 8 }), riskPenalty: 2, score: 2,
    status: "DEFER", reason: "Useful marginal workshop gaps, but not a new-manufacturer test and not a valid owner-manual process control."
  },
  {
    manufacturer: "Yamaha", catalogVariantKey: "yamaha.tenere-700.gen1", model: "Ténéré 700 I", years: { from: 2019, to: 2019 }, markets: ["EU"], startingCoverage: 29, remainingPracticalGap: 10,
    researchHistory: "Owner manual yielded 27 practical slots; repository identifies service manual BW3-F8197-E0 but content is inaccessible and unauthenticated.",
    sourceProspect: Object.freeze({ identity: "XTZ690 / XTZ690-U Service Manual BW3-F8197-E0", sourceClass: "official-service-manual", tier: "A", officialHost: "not stored", certainty: "KNOWN-REGISTERED-NOT-REAUTHENTICATED", richness: "UNKNOWN" }),
    confidence: Object.freeze({ identity: "MEDIUM", year: "MEDIUM", market: "MEDIUM" }), risks: Object.freeze({ abs: "LOW", transmission: "LOW", equipment: "HIGH", safetyCriticalApplicability: "HIGH" }), expectedReuse: "LOW", duplicateResearchPenalty: 2,
    expectedPracticalGain: Object.freeze({ min: 3, max: 8 }), expectedPrimaryDocuments: 1, expectedPracticalGainPerDocument: Object.freeze({ min: 3, max: 8 }), riskPenalty: 3, score: 0.5,
    status: "DEFER", reason: "Registered workshop identity is weaker than MT-09 and does not test a new manufacturer."
  },
  {
    manufacturer: "Honda", catalogVariantKey: "honda.cbr500r.pc70", model: "CBR500R PC70", years: { from: 2024, to: 2024 }, markets: ["USA", "Canada"], startingCoverage: 26, remainingPracticalGap: 16,
    researchHistory: "Owner manual exhausted at 26 slots; service manual family identified without publication code and blocked behind dealer/Helm access.",
    sourceProspect: Object.freeze({ identity: "2024 CB500F / CBR500R / NX500 Service Manual", sourceClass: "official-service-manual", tier: "A", officialHost: "dealer/Helm route", certainty: "PARTIAL", richness: "UNKNOWN" }),
    confidence: Object.freeze({ identity: "LOW", year: "HIGH", market: "HIGH" }), risks: Object.freeze({ abs: "MEDIUM", transmission: "LOW", equipment: "MEDIUM", safetyCriticalApplicability: "HIGH" }), expectedReuse: "MEDIUM if model tables are explicit", duplicateResearchPenalty: 3,
    expectedPracticalGain: Object.freeze({ min: 2, max: 6 }), expectedPrimaryDocuments: 1, expectedPracticalGainPerDocument: Object.freeze({ min: 2, max: 6 }), riskPenalty: 4, score: -3,
    status: "DEFER", reason: "No publication code or accessible exact content; prior owner source is exhausted."
  },
  {
    manufacturer: "Honda", catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", model: "VFR800 RC46 VTEC I", years: { from: 2002, to: 2002 }, markets: ["EU", "UK"], startingCoverage: 13, remainingPracticalGap: 25,
    researchHistory: "Rich mirror content exists, but publication identity and VFR800/VFR800A applicability remain uncertain; authenticated card is exhausted.",
    sourceProspect: Object.freeze({ identity: "VFR800/VFR800A service-manual mirror candidate; publication code unresolved", sourceClass: "official-service-manual content on third-party mirror", tier: "D for access / claimed A underlying document", officialHost: "none", certainty: "PARTIAL", richness: "HIGH content fingerprint, identity unresolved" }),
    confidence: Object.freeze({ identity: "LOW", year: "MEDIUM", market: "LOW" }), risks: Object.freeze({ abs: "HIGH", transmission: "LOW", equipment: "HIGH", safetyCriticalApplicability: "HIGH" }), expectedReuse: "MEDIUM only after identity resolution", duplicateResearchPenalty: 2,
    expectedPracticalGain: Object.freeze({ min: 4, max: 12 }), expectedPrimaryDocuments: 1, expectedPracticalGainPerDocument: Object.freeze({ min: 4, max: 12 }), riskPenalty: 6, score: 0,
    status: "REJECT", reason: "Underlying content cannot become verified until source identity and ABS/model scope are independently resolved."
  },
  ...[
    ["Suzuki", "suzuki.sv650.gen3", "SV650 III", 2016, 2025, "official specification and catalogue-history material only"],
    ["Kawasaki", "kawasaki.ninja-650.gen2", "Ninja 650 II", 2020, 2022, "official history/specification material only"],
    ["BMW", "bmw.f-roadster-xr.f900r-1", "F 900 R I", 2020, 2024, "official press, owner/service-documentation classes mentioned but no exact stored manual identity"],
    ["Ducati", "ducati.monster.937", "Monster 937", 2021, 2025, "official owner-manual library known, but no exact stored document identity for this target"],
    ["Triumph", "triumph.street-triple.765-3", "Street Triple 765 III", 2023, 2025, "official specification material only"]
  ].map(([manufacturer, catalogVariantKey, modelName, from, to, history]) => Object.freeze({
    manufacturer, catalogVariantKey, model: modelName, years: { from, to }, markets: ["UNKNOWN"], startingCoverage: 0, remainingPracticalGap: 37,
    researchHistory: history, sourceProspect: Object.freeze({ identity: "UNKNOWN exact Tier A/B document", sourceClass: "UNKNOWN", tier: null, officialHost: "UNKNOWN", certainty: "UNKNOWN", richness: "UNKNOWN" }),
    confidence: Object.freeze({ identity: "catalogue HIGH / source UNKNOWN", year: "UNKNOWN for source", market: "UNKNOWN" }), risks: Object.freeze({ abs: "UNKNOWN", transmission: "UNKNOWN", equipment: "UNKNOWN", safetyCriticalApplicability: "HIGH" }), expectedReuse: "UNKNOWN", duplicateResearchPenalty: 0,
    expectedPracticalGain: "UNKNOWN", expectedPrimaryDocuments: "UNKNOWN", expectedPracticalGainPerDocument: "UNKNOWN", riskPenalty: null, score: null,
    status: "DEFER", reason: "Exact repository-known Tier A/B prospect is absent; candidate remains unranked."
  }))
]);

const selectedBatch = Object.freeze([
  {
    catalogVariantKey: "harley-davidson.revolution-max.sportster-s", model: "Sportster S / RH1250S", years: { from: 2022, to: 2022 }, markets: ["USA"], abs: null, transmission: "manual", equipment: "standard Sportster S; exclude other 8-DOM models and special equipment", startingCoverage: 0,
    source: "registered official 2022 Harley-Davidson owner manual 94001064 on serviceinfo.harley-davidson.com", sourceCertainty: "KNOWN-REGISTERED-NOT-REAUTHENTICATED", preferredSourceClass: "Tier A official owner manual", expectedPracticalGain: { min: 6, max: 18 }, maximumPrimaryDocuments: 1,
    priorities: ["oil specification/capacity", "coolant", "spark plug/gap", "maintenance schedule", "final-drive service", "brake fluid", "cold tire pressures", "battery/fuses", "critical documented torques"],
    authenticationGate: "Confirm internal publication code, MY2022 USA scope and explicit RH1250S/Sportster S inclusion before extracting any value.",
    stopConditions: ["official URL or internal document identity cannot be authenticated", "Sportster S/RH1250S is not explicitly included", "MY2022 USA scope cannot be resolved", "ABS/equipment scope blocks safety-critical values", "first document yields fewer than 6 practical slots", "remaining gaps require inference", "one-document budget exhausted"]
  }
]);

const strategies = Object.freeze({
  newManufacturerOnly: Object.freeze({ outcome: "SELECT", reason: "One-document Harley test directly answers the next transfer question and has the only concrete new-manufacturer Tier A prospect." }),
  mixedWithControl: Object.freeze({ outcome: "REJECT", reason: "Honda/Yamaha already provide four high-yield controls; another document would consume budget and a Yamaha service manual would test a different source class, not control the owner-manual method." }),
  hondaYamahaOnly: Object.freeze({ outcome: "DEFER", reason: "Higher-confidence marginal workshop work exists, but it does not test broader transferability and its expected marginal yield is lower than the Harley owner-manual prospect." })
});

const acceptance = Object.freeze({
  minimumVerifiedGain: 8, minimumPracticalGain: 6, minimumPerYieldingTargetPracticalGain: 6,
  maximumPrimaryDocumentsPerTarget: 1, maximumPrimaryDocumentsOverall: 1, maximumTierCDPracticalContribution: 0,
  unresolvedSafetyCriticalConflicts: 0,
  newManufacturerSuccess: "The official manual authenticates for MY2022 USA Sportster S/RH1250S and yields at least 6 practical verified Service Core slots without Tier C/D support.",
  rationale: "The only stored content hints support roughly two Service Core fields, while four successful Honda/Yamaha owner manuals yielded 24–27 practical slots each. A six-slot gate is deliberately discounted for partial richness knowledge but still requires useful service value."
});

const audit = Object.freeze({
  classification: "ACCEPT-WITH-RISKS",
  controlIncluded: false,
  risks: ["the registered manual covers 8 domestic models and exact Sportster S inclusion must be reauthenticated", "stored candidates lack pages and sections", "expected 6–18 practical slots is a wide hypothesis", "one target tests only Harley-Davidson"],
  falsification: ["official document or internal publication identity cannot be authenticated", "Sportster S/RH1250S applicability is absent or ambiguous", "fewer than 6 practical slots are verified", "success requires Tier C/D material", "any unresolved safety-critical conflict remains", "row count is high but practical gain is below 6"],
  badUseCondition: "The document lacks an explicit included-model index or contains only generic ownership/legal material beyond the three already known candidates."
});

function buildReport() {
  return Object.freeze({ schemaVersion: "revlog-post-yamaha-transfer-design/v1", date: "2026-08-31", baseline, sourceCertainty, model, candidates, strategies, selectedBatch, acceptance, audit, evidenceAcquired: false, serviceCoreCoverageChanged: false, productionChanged: false, exactNextTask: "Execute the one-target MY2022 USA Harley-Davidson Sportster S/RH1250S owner-manual transfer batch: authenticate registered publication 94001064 and exact model applicability first, then extract only directly supported practical Service Core evidence under a one-primary-document, +8 verified/+6 practical, zero-conflict and non-production gate." });
}

module.exports = Object.freeze({ sourceCertainty, baseline, model, candidates, strategies, selectedBatch, acceptance, audit, buildReport });
