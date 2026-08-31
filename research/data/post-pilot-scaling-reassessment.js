// NON-PRODUCTION research design. This module acquires no evidence and is never imported by runtime.
"use strict";

const rubric = Object.freeze({
  purpose: "prioritize expected practical verified Service Core gain per authenticated Tier A/B document inspected",
  rewards: Object.freeze({
    currentServiceCoreGap: 5,
    expectedPracticalGap: 10,
    tierABSourceProspect: 10,
    expectedDocumentRichness: 8,
    modelYearIdentityConfidence: 4,
    marketApplicabilityConfidence: 4,
    expectedReuse: 4,
  }),
  penalties: Object.freeze({
    absApplicabilityRisk: -2,
    transmissionApplicabilityRisk: -3,
    equipmentAmbiguity: -3,
    duplicationResearchHistory: -5,
    safetyCriticalApplicabilityRisk: -4,
  }),
  unknownRule: "If Tier A/B prospect or document richness is UNKNOWN, totalScore is null and the candidate is not selectable in this batch.",
  interpretation: "The score is a prioritization heuristic, not a probability or evidence claim.",
});

const candidates = Object.freeze([
  {
    manufacturer: "Yamaha", catalogVariantKey: "yamaha.mt-09.gen3", model: "MT-09 III", years: { from: 2021, to: 2023 }, currentVerified: 0,
    knownResearchHistory: "Repository has a 2021 EU official owner-manual source and 43 page-referenced owner-manual candidates; none is verified in the Service Core batch pipeline.",
    officialSourceProspects: "KNOWN-TIER-A", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "LOW", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "MEDIUM", expectedReuse: "MEDIUM", expectedPracticalYield: { min: 18, max: 24 },
    components: { currentServiceCoreGap: 5, expectedPracticalGap: 10, tierABSourceProspect: 10, expectedDocumentRichness: 8, modelYearIdentityConfidence: 4, marketApplicabilityConfidence: 4, expectedReuse: 3, absApplicabilityRisk: -1, transmissionApplicabilityRisk: 0, equipmentAmbiguity: -1, duplicationResearchHistory: -1, safetyCriticalApplicabilityRisk: -1 },
    totalScore: 40, disposition: "SELECTED", reason: "Known rich Tier A manual provides a bounded non-Honda transfer test; scope is narrowed to its proven 2021 edition and standard MT-09."
  },
  {
    manufacturer: "Yamaha", catalogVariantKey: "yamaha.tenere-700.gen1", model: "Ténéré 700 I", years: { from: 2019, to: 2024 }, currentVerified: 0,
    knownResearchHistory: "Repository has a 2019 EU official owner-manual source and 45 page-referenced owner-manual candidates; none is verified in the Service Core batch pipeline.",
    officialSourceProspects: "KNOWN-TIER-A", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "LOW", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "MEDIUM", expectedReuse: "HIGH", expectedPracticalYield: { min: 18, max: 24 },
    components: { currentServiceCoreGap: 5, expectedPracticalGap: 10, tierABSourceProspect: 10, expectedDocumentRichness: 8, modelYearIdentityConfidence: 4, marketApplicabilityConfidence: 4, expectedReuse: 4, absApplicabilityRisk: -1, transmissionApplicabilityRisk: 0, equipmentAmbiguity: -1, duplicationResearchHistory: -1, safetyCriticalApplicabilityRisk: -1 },
    totalScore: 41, disposition: "SELECTED", reason: "Known rich Tier A manual tests transferability in a different use class; scope is narrowed to MY2019 standard equipment."
  },
  {
    manufacturer: "Honda", catalogVariantKey: "honda.cbr500r.pc70", model: "CBR500R PC70", years: { from: 2024, to: 2025 }, currentVerified: 26,
    knownResearchHistory: "Authenticated MY2024 owner manual was exhausted in the pilot and yielded zero net-new slots.", officialSourceProspects: "KNOWN-TIER-A-EXHAUSTED", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "LOW", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "LOW", expectedReuse: "LOW", expectedPracticalYield: { min: 0, max: 4 },
    components: { currentServiceCoreGap: 2, expectedPracticalGap: 3, tierABSourceProspect: 3, expectedDocumentRichness: 0, modelYearIdentityConfidence: 4, marketApplicabilityConfidence: 4, expectedReuse: 1, absApplicabilityRisk: -1, transmissionApplicabilityRisk: 0, equipmentAmbiguity: 0, duplicationResearchHistory: -5, safetyCriticalApplicabilityRisk: -1 },
    totalScore: 10, disposition: "REJECTED", reason: "Repeat inspection would violate the pilot lesson that exhausted sources should not be re-researched."
  },
  {
    manufacturer: "Honda", catalogVariantKey: "honda.cbr-fireblade.sc82-1", model: "CBR1000RR-R Fireblade SC82 I", years: { from: 2020, to: 2021 }, currentVerified: 4,
    knownResearchHistory: "Four brochure-derived Service Core slots; no repository-authenticated owner/service manual for this exact target.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "MEDIUM", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "HIGH", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "Tier A/B prospect and standard/SP applicability are unknown."
  },
  {
    manufacturer: "Honda", catalogVariantKey: "honda.africa-twin.crf1100l-1", model: "CRF1100L Africa Twin I", years: { from: 2020, to: 2023 }, currentVerified: 5,
    knownResearchHistory: "Pilot rejected the known USA manual for EU/UK and standard/Adventure Sports applicability.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "HIGH", marketRisk: "HIGH", absRisk: "MEDIUM", transmissionRisk: "HIGH", equipmentRisk: "HIGH", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "The exact EU/UK standard-model Tier A/B prospect remains unknown and applicability risk is excessive."
  },
  {
    manufacturer: "Suzuki", catalogVariantKey: "suzuki.sv650.gen3", model: "SV650 III", years: { from: 2016, to: 2025 }, currentVerified: 0,
    knownResearchHistory: "Catalogue identity only; no Service Core acquisition history.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "HIGH", marketRisk: "UNKNOWN", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "LOW", expectedReuse: "HIGH", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "No repository-known Tier A/B source prospect; broad year span requires an edition decision first."
  },
  {
    manufacturer: "Kawasaki", catalogVariantKey: "kawasaki.ninja-650.gen2", model: "Ninja 650 II", years: { from: 2020, to: 2022 }, currentVerified: 0,
    knownResearchHistory: "Catalogue identity only; no Service Core acquisition history.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "UNKNOWN", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "LOW", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "No repository-known Tier A/B source prospect."
  },
  {
    manufacturer: "BMW", catalogVariantKey: "bmw.f-roadster-xr.f900r-1", model: "F 900 R I", years: { from: 2020, to: 2024 }, currentVerified: 0,
    knownResearchHistory: "Catalogue identity only; no Service Core acquisition history.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "UNKNOWN", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "HIGH", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "No repository-known Tier A/B source prospect and equipment packages raise applicability risk."
  },
  {
    manufacturer: "Ducati", catalogVariantKey: "ducati.monster.937", model: "Monster 937", years: { from: 2021, to: 2025 }, currentVerified: 0,
    knownResearchHistory: "Catalogue identity only; no Service Core acquisition history.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "UNKNOWN", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "MEDIUM", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "No repository-known Tier A/B source prospect."
  },
  {
    manufacturer: "Triumph", catalogVariantKey: "triumph.street-triple.765-3", model: "Street Triple 765 III", years: { from: 2023, to: 2025 }, currentVerified: 0,
    knownResearchHistory: "Catalogue identity only; no Service Core acquisition history.", officialSourceProspects: "UNKNOWN", identityConfidence: "HIGH", yearRisk: "MEDIUM", marketRisk: "UNKNOWN", absRisk: "MEDIUM", transmissionRisk: "LOW", equipmentRisk: "HIGH", expectedReuse: "MEDIUM", expectedPracticalYield: "UNKNOWN", totalScore: null, disposition: "DEFERRED", reason: "No repository-known Tier A/B source prospect and R/RS equipment boundaries are unresolved."
  },
]);

const selectedBatch = Object.freeze([
  {
    catalogVariantKey: "yamaha.mt-09.gen3", model: "MT-09 III", years: { from: 2021, to: 2021 }, markets: ["EU"], abs: null, transmission: "manual", equipment: "standard (exclude SP)", startingCoverage: 0,
    practicalPriorities: ["oil specification/capacities", "coolant specification/capacity", "spark plug/gap", "valve inspection interval", "maintenance schedule", "chain slack/service", "brake fluid/interval", "cold tire pressures", "battery/fuses", "oil/filter/spark-plug/rear-axle torques"],
    preferredSources: ["registered official 2021 owner manual", "official service-data or maintenance publication only if needed"], maximumPrimaryDocuments: 2,
    stopConditions: ["registered manual identity or MY2021 EU applicability cannot be reconfirmed", "standard versus SP scope is unresolved", "ABS scope is required but unresolved for a safety-critical value", "first primary document yields fewer than 10 practical slots", "second document is duplicate or adds no practical evidence", "two-document budget exhausted"],
    applicabilityRisks: ["catalogue generation extends beyond the selected MY2021 edition", "standard versus SP", "ABS scope for safety-critical values"], expectedPracticalGain: { min: 18, max: 24 }, expectedFailureModes: ["candidate field cannot be mapped to Service Core", "manual omits OEM parts and front-axle torque", "edition does not cover later generation years"]
  },
  {
    catalogVariantKey: "yamaha.tenere-700.gen1", model: "Ténéré 700 I", years: { from: 2019, to: 2019 }, markets: ["EU"], abs: null, transmission: "manual", equipment: "standard (exclude Rally/World Raid/Explore/Extreme)", startingCoverage: 0,
    practicalPriorities: ["oil specification/capacities", "coolant specification/capacity", "spark plug/gap", "valve inspection interval", "maintenance schedule", "chain slack/service", "brake fluid/interval", "cold road tire pressures and load distinctions", "battery/fuses", "oil/filter/spark-plug/rear-axle torques"],
    preferredSources: ["registered official 2019 owner manual", "official service-data or maintenance publication only if needed"], maximumPrimaryDocuments: 2,
    stopConditions: ["registered manual identity or MY2019 EU applicability cannot be reconfirmed", "standard versus later equipment edition is unresolved", "road/off-road pressure conditions cannot be kept distinct", "first primary document yields fewer than 10 practical slots", "second document is duplicate or adds no practical evidence", "two-document budget exhausted"],
    applicabilityRisks: ["catalogue generation extends beyond the selected MY2019 edition", "standard versus later named equipment variants", "road versus off-road tire-pressure conditions"], expectedPracticalGain: { min: 18, max: 24 }, expectedFailureModes: ["candidate field cannot be mapped to Service Core", "manual omits chain size, OEM parts and front-axle torque", "edition does not cover later generation years"]
  },
]);

const acceptance = Object.freeze({
  minimumVerifiedSlotGain: 24,
  minimumPracticalServiceSlotGain: 22,
  minimumPerYieldingTargetPracticalGain: 10,
  maximumPrimaryDocumentsPerTarget: 2,
  maximumPrimaryDocumentsOverall: 4,
  maximumTierCDPracticalEvidenceRows: 0,
  unresolvedSafetyCriticalConflicts: 0,
  applicabilityRule: "Blocked safety-critical or scope-dependent rows remain unverified; a target may end RESEARCHED-NO-EVIDENCE without replacement.",
  rationale: "The pilot yielded 24 practical slots per yielding Tier A document, but only 2/5 targets yielded. The next gate discounts per-document yield by roughly half while requiring both selected rich-manual prospects to be handled explicitly."
});

const audit = Object.freeze({
  classification: "ACCEPT-WITH-RISKS",
  supported: ["both selected targets have repository-registered official owner manuals", "existing page-referenced candidates demonstrate practical content without counting as verified evidence", "two models test Honda-to-Yamaha transfer across road and adventure use classes"],
  risks: ["only one new manufacturer is tested", "registered candidates use research keys that require explicit catalogue-key reconciliation", "manual editions cover one year, not the full catalogue generations", "expected gain ranges are heuristic"],
  falsifiesHypothesis: "Fewer than 22 practical verified slots overall, neither target reaches 10 practical slots, Tier A identity/applicability fails for either registered manual, or any unresolved safety-critical conflict remains.",
});

function buildReport() {
  return Object.freeze({
    schemaVersion: "revlog-post-pilot-scaling-reassessment/v1",
    date: "2026-08-31",
    pilotBaseline: Object.freeze({ classification: "ACCEPT-WITH-RISKS", targets: 5, serviceCoreBefore: 51, serviceCoreAfter: 101, verifiedGain: 50, practicalGain: 48, genericGain: 2, documentsInspected: 5, uniqueDocuments: 5, yieldingDocuments: 2, sourceTiers: Object.freeze({ A: 5, B: 0, C: 0, D: 0 }), evidenceRows: 52, conflicts: 0, sourceBudgetExceeded: false, productionChanged: false, vfrProductionChanged: false }),
    strategy: "single non-Honda manufacturer; two-target Yamaha transfer batch",
    rubric,
    candidates,
    selectedBatch,
    acceptance,
    audit,
    exactNextTask: "Execute the bounded two-target Yamaha owner-manual acquisition batch for MY2021 EU MT-09 III standard and MY2019 EU Ténéré 700 I standard, under the recorded applicability, budget, yield, audit and non-production gates."
  });
}

module.exports = Object.freeze({ rubric, candidates, selectedBatch, acceptance, audit, buildReport });
