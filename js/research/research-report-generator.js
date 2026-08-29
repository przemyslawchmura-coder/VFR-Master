"use strict";

const coverageAuditor = require("./research-coverage-auditor.js");
const coverageStandard = require("../../research/schema/research-coverage-standard.js");

function buildResearchMetrics(dataset) {
  const sourceById = new Map(dataset.sources.map(source => [source.id, source]));
  const manufacturers = [...new Set(dataset.catalog.map(record => record.manufacturer))].sort();
  const byManufacturer = Object.fromEntries(manufacturers.map(manufacturer => {
    const catalog = dataset.catalog.filter(record => record.manufacturer === manufacturer);
    const candidates = dataset.candidates.filter(record => record.manufacturer === manufacturer);
    const sources = dataset.sources.filter(source => source.manufacturer === manufacturer);
    return [manufacturer, {
      sources: sources.length,
      modelFamilies: new Set(catalog.map(record => record.family)).size,
      catalogRecords: catalog.length,
      knownModelCodes: catalog.filter(record => record.modelCode).length,
      proposedKeys: new Set(catalog.map(record => record.proposedCatalogVariantKey)).size,
      yearFrom: catalog.length ? Math.min(...catalog.map(record => record.years.from)) : null,
      yearTo: catalog.length ? Math.max(...catalog.map(record => record.years.to ?? record.years.from)) : null,
      technicalCandidates: candidates.length,
      officialSourceCandidates: candidates.filter(candidate => candidate.sourceIds.some(id => String((sourceById.get(id) || {}).type).startsWith("official-"))).length,
      candidatesWithSection: candidates.filter(candidate => candidate.sourceSection).length,
      candidatesWithPage: candidates.filter(candidate => candidate.sourcePage).length,
      normalizedCandidates: candidates.filter(candidate => candidate.normalizedCandidateValue !== null && candidate.normalizedCandidateValue !== undefined).length,
      unknownApplicabilityCandidates: candidates.filter(candidate => candidate.region === null || candidate.abs === null || candidate.equipment === null).length,
      conflicts: candidates.filter(candidate => candidate.status === "conflicting").length,
      readyForProfileReview: catalog.filter(record => record.status === "ready-for-profile-review").map(record => record.proposedCatalogVariantKey).sort(),
      candidatesByCategory: countBy(candidates, candidate => candidate.technicalField.split(".")[0]),
      sourcesByType: countBy(sources, source => source.type)
    }];
  }));
  return {
    schemaVersion: dataset.schemaVersion,
    totals: {
      sources: dataset.sources.length,
      manufacturers: manufacturers.length,
      modelFamilies: new Set(dataset.catalog.map(record => `${record.manufacturer}|${record.family}`)).size,
      catalogRecords: dataset.catalog.length,
      technicalCandidates: dataset.candidates.length,
      conflicts: dataset.candidates.filter(candidate => candidate.status === "conflicting").length
    },
    byManufacturer
  };
}

function countBy(values, selector) {
  return Object.fromEntries([...values.reduce((map, value) => map.set(selector(value), (map.get(selector(value)) || 0) + 1), new Map())].sort(([left], [right]) => left.localeCompare(right)));
}

const DEEP_CATEGORIES = Object.freeze(["engine", "lubrication", "cooling", "fuel", "ignition", "electrical", "transmission", "drive", "chassis", "brakes", "tires", "dimensions", "maintenance", "oem-parts"]);
const READINESS_POLICY = Object.freeze({
  minimumEvidencePercent: 60,
  maximumNotResearchedFields: 20,
  minimumServiceManualValues: 1,
  criticalFields: Object.freeze([
    "identity.manufacturer", "identity.model", "identity.generation", "identity.model-year",
    "lubrication.viscosity", "lubrication.capacity-drain", "lubrication.capacity-filter",
    "ignition.spark-plug-oem", "ignition.plug-gap",
    "final_drive.chain-size", "final_drive.chain-slack",
    "electrical.battery-specification", "electrical.charging-voltage",
    "brakes.brake-fluid", "tires_wheels.front-size", "tires_wheels.rear-size",
    "tires_wheels.solo-pressures", "maintenance.periodic-schedule",
    "maintenance.schedule-mileage-intervals", "torques.oil-drain-bolt"
  ])
});

function evaluateReadiness(audit, metrics) {
  const reasons = [];
  const blockers = [];
  const evidencePercent = Math.round((audit.counts["evidence-found"] / coverageStandard.FIELD_COUNT) * 100);
  if (evidencePercent < READINESS_POLICY.minimumEvidencePercent) reasons.push(`insufficient canonical field coverage (${evidencePercent}% < ${READINESS_POLICY.minimumEvidencePercent}%)`);
  if (audit.counts["not-researched"] > READINESS_POLICY.maximumNotResearchedFields) reasons.push(`too many not-researched fields (${audit.counts["not-researched"]})`);
  if (audit.counts.conflicting > 0) reasons.push(`conflicting fields present (${audit.counts.conflicting})`);
  if (metrics.serviceManualValues < READINESS_POLICY.minimumServiceManualValues) reasons.push("insufficient service-manual evidence");
  const missingCritical = READINESS_POLICY.criticalFields.filter(id => {
    const [category, field] = id.split(".");
    return !audit.categories[category] || audit.categories[category][field].status !== "evidence-found";
  });
  if (missingCritical.length) blockers.push(...missingCritical);
  if (missingCritical.length) reasons.push(`critical fields incomplete (${missingCritical.length})`);
  const recommendation = reasons.length === 0 && blockers.length === 0 ? "ready-for-human-profile-review" : "research-more";
  return { recommendation, reasons, blockers, missingCritical, evidencePercent };
}

function buildDeepProfileMetrics(dataset, keys) {
  const sourceById = new Map(dataset.sources.map(source => [source.id, source]));
  return Object.fromEntries(keys.map(key => {
    const candidates = dataset.candidates.filter(candidate => candidate.proposedCatalogVariantKey === key);
    const categories = new Set(candidates.map(candidate => candidate.technicalField.split(".")[0]));
    const covered = DEEP_CATEGORIES.filter(category => categories.has(category));
    const audit = coverageAuditor.auditProfile(dataset, key);
    const official = candidates.filter(candidate => candidate.sourceIds.some(id => String((sourceById.get(id) || {}).type).startsWith("official-"))).length;
    const serviceManualValues = candidates.filter(candidate => candidate.sourceIds.some(id => (sourceById.get(id) || {}).type === "official-service-manual")).length;
    const ownerManualValues = candidates.filter(candidate => candidate.sourceIds.some(id => (sourceById.get(id) || {}).type === "official-owner-manual")).length;
    const completenessPercent = Math.round((audit.counts["evidence-found"] / coverageStandard.FIELD_COUNT) * 100);
    const metrics = {
      totalCandidates: candidates.length,
      candidatesByCategory: countBy(candidates, candidate => candidate.technicalField.split(".")[0]),
      officialSourcePercent: candidates.length ? Math.round((official / candidates.length) * 100) : 0,
      candidatesWithPage: candidates.filter(candidate => candidate.sourcePage).length,
      candidatesWithSection: candidates.filter(candidate => candidate.sourceSection).length,
      normalizedValues: candidates.filter(candidate => candidate.normalizedCandidateValue !== null && candidate.normalizedCandidateValue !== undefined).length,
      unknownApplicability: candidates.filter(candidate => candidate.region === null || candidate.abs === null || candidate.equipment === null).length,
      conflicts: candidates.filter(candidate => candidate.status === "conflicting").length,
      serviceManualValues,
      ownerManualValues,
      torqueValues: candidates.filter(candidate => candidate.technicalField.startsWith("torque.")).length,
      maintenanceIntervals: candidates.filter(candidate => candidate.technicalField.startsWith("maintenance.")).length,
      oemPartNumbers: candidates.filter(candidate => candidate.technicalField.startsWith("oem-parts.")).length,
      coveredMajorCategories: covered,
      missingMajorCategories: DEEP_CATEGORIES.filter(category => !categories.has(category)),
      fieldCoverage: audit.counts,
      partialCategories: Object.entries(audit.categories).filter(([, value]) => value._status.status === "partial").map(([category]) => category),
      fieldAudit: audit,
      completenessPercent,
    };
    const readiness = evaluateReadiness(audit, metrics);
    return [key, { ...metrics, recommendation: readiness.recommendation, readinessReasons: readiness.reasons, readinessBlockers: readiness.blockers }];
  }));
}

function renderDeepProfileReadinessReport(dataset, keys) {
  const metrics = buildDeepProfileMetrics(dataset, keys);
  const lines = [
    "# Deep profile research readiness", "",
    "> **NON-PRODUCTION RESEARCH DATA. Completeness is informational and never promotes a profile automatically.**", "",
    "| Proposed key | Candidates | Major coverage | Official | Page / section | Service / owner manual values | Conflicts | Recommendation |",
    "|---|---:|---:|---:|---:|---:|---:|---|"
  ];
  keys.forEach(key => {
    const item = metrics[key];
    lines.push(`| ${key} | ${item.totalCandidates} | ${item.completenessPercent}% | ${item.officialSourcePercent}% | ${item.candidatesWithPage} / ${item.candidatesWithSection} | ${item.serviceManualValues} / ${item.ownerManualValues} | ${item.conflicts} | ${item.recommendation} |`);
  });
  lines.push("", "## Remaining gaps", "");
  keys.forEach(key => {
    const item = metrics[key];
    lines.push(`- **${key}:** ${item.missingMajorCategories.join(", ") || "none in the major-category checklist"}.`);
    lines.push(`  - Reasons: ${item.readinessReasons.join("; ") || "none"}.`);
    lines.push(`  - Critical blockers: ${item.readinessBlockers.join(", ") || "none"}.`);
  });
  lines.push("", "Readiness policy: at least 60% of canonical fields evidenced, no more than 20 not-researched fields, at least one service-manual value, no conflicts, and all critical identity/safety/service fields evidenced. This is informational only and never promotes data.", "");
  return lines.join("\n");
}

module.exports = Object.freeze({ buildResearchMetrics, buildDeepProfileMetrics, renderDeepProfileReadinessReport, evaluateReadiness, READINESS_POLICY, DEEP_CATEGORIES });
