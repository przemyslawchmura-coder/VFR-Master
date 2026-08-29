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
    return [key, {
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
      recommendation: audit.counts["evidence-found"] >= 40 && official === candidates.length && audit.counts.conflicting === 0 ? "ready-for-human-profile-review" : "research-more"
    }];
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
  keys.forEach(key => lines.push(`- **${key}:** ${metrics[key].missingMajorCategories.join(", ") || "none in the major-category checklist"}.`));
  lines.push("", "The percentage is evidence-found canonical fields divided by the full standard field set. It does not measure correctness, source authority inside a field, regional completeness, or production readiness.", "");
  return lines.join("\n");
}

module.exports = Object.freeze({ buildResearchMetrics, buildDeepProfileMetrics, renderDeepProfileReadinessReport, DEEP_CATEGORIES });
