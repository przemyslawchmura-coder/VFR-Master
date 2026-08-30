// NON-PRODUCTION Honda Service Data Wave 1 report.
"use strict";
const crypto = require("node:crypto");
const { loadCatalog } = require("./motorcycle-catalog-report.js");
const dataset = require("../research/data/honda-service-wave1.js");
const catalog = loadCatalog();
const knownKeys = new Set(catalog.find(item => item.id === "honda").models.flatMap(model => model.variants.map(v => v.key)));
const canonical = new Set(require("../research/schema/research-coverage-standard.js").CATEGORIES ? Object.entries(require("../research/schema/research-coverage-standard.js").CATEGORIES).flatMap(([category, fields]) => fields.map(field => `${category}.${field}`)) : []);
function validate() {
  const errors = [];
  dataset.serviceCore.forEach(field => { if (!canonical.has(field)) errors.push(`unknown service-core field ${field}`); });
  dataset.targets.forEach(target => { if (!knownKeys.has(target.catalogVariantKey)) errors.push(`unknown target ${target.catalogVariantKey}`); if (target.years.from < 1990 || target.years.to > 2025) errors.push(`invalid years ${target.catalogVariantKey}`); });
  const ids = [...dataset.evidence, ...dataset.reviewedNoEvidence].map(item => item.id); if (new Set(ids).size !== ids.length) errors.push("duplicate evidence identity");
  const pairs = dataset.evidence.map(item => `${item.catalogVariantKey}|${item.field}`); if (new Set(pairs).size !== pairs.length) errors.push("duplicate evidence field identity");
  dataset.evidence.forEach(item => { if (!knownKeys.has(item.catalogVariantKey)) errors.push(`unknown evidence key ${item.catalogVariantKey}`); if (!dataset.sources.some(source => source.id === item.sourceId)) errors.push(`missing source ${item.sourceId}`); if (!item.rawValue || item.normalizedValue === null || item.normalizedValue === undefined) errors.push(`incomplete evidence ${item.id}`); });
  const sourceIds = dataset.sources.map(source => source.id); if (new Set(sourceIds).size !== sourceIds.length) errors.push("duplicate source ID");
  return errors;
}
function buildReport() {
  const errors = validate(); const slots = dataset.targets.length * dataset.serviceCore.length; const evidenceSlots = dataset.evidence.length; const noEvidence = dataset.reviewedNoEvidence.length;
  const byTarget = dataset.targets.map(target => { const found = dataset.evidence.filter(item => item.catalogVariantKey === target.catalogVariantKey).length; const missing = dataset.reviewedNoEvidence.filter(item => item.catalogVariantKey === target.catalogVariantKey).length; const pct = Math.round(found / dataset.serviceCore.length * 100); return { catalogVariantKey: target.catalogVariantKey, years: target.years, serviceCore: { total: dataset.serviceCore.length, evidenceFound: found, researchedNoEvidence: missing, notResearched: dataset.serviceCore.length - found - missing, coveragePercent: pct }, readiness: pct >= 80 ? "SERVICE-CORE-READY" : pct >= 50 ? "SERVICE-CORE-PARTIAL" : "RESEARCH-MORE" }; });
  return { schemaVersion: dataset.schemaVersion, canonicalFieldCount: dataset.canonicalFieldCount, serviceCoreFieldCount: dataset.serviceCore.length, targetVariants: dataset.targets.length, researchedVariants: byTarget.filter(item => item.serviceCore.evidenceFound > 0).length, serviceCoreSlots: slots, serviceCoreEvidence: evidenceSlots, serviceCoreCoveragePercent: Math.round(evidenceSlots / slots * 100), canonicalSlots: dataset.targets.length * dataset.canonicalFieldCount, canonicalEvidence: evidenceSlots, canonicalCoveragePercent: Math.round(evidenceSlots / (dataset.targets.length * dataset.canonicalFieldCount) * 100), evidenceFound: evidenceSlots, researchedNoEvidence: noEvidence, notResearched: slots - evidenceSlots - noEvidence, conflicting: 0, tier1Evidence: evidenceSlots, tier2Evidence: 0, tier3Evidence: 0, ownerManualEvidence: dataset.evidence.filter(item => item.sourceId.includes("cbr500r")).length, serviceWorkshopEvidence: 0, oemPartsEvidence: 0, readiness: { ready: byTarget.filter(item => item.readiness === "SERVICE-CORE-READY").length, partial: byTarget.filter(item => item.readiness === "SERVICE-CORE-PARTIAL").length, more: byTarget.filter(item => item.readiness === "RESEARCH-MORE").length }, byTarget, validation: { valid: errors.length === 0, errors }, deterministicHash: crypto.createHash("sha256").update(JSON.stringify({ serviceCore: dataset.serviceCore, targets: dataset.targets, evidence: dataset.evidence, reviewedNoEvidence: dataset.reviewedNoEvidence })).digest("hex") };
}
if (require.main === module) console.log(JSON.stringify(buildReport(), null, 2));
module.exports = Object.freeze({ validate, buildReport });
