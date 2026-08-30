// NON-PRODUCTION Honda Service Data Wave 1 report.
"use strict";
const crypto = require("node:crypto");
const { loadCatalog } = require("./motorcycle-catalog-report.js");
const dataset = require("../research/data/honda-service-wave1.js");
const acquisition = require("../research/data/honda-service-acquisition-wave1.js");
const schema = require("../research/schema/research-coverage-standard.js");
const catalog = loadCatalog();
const knownKeys = new Set(catalog.find(item => item.id === "honda").models.flatMap(model => model.variants.map(v => v.key)));
const canonicalFields = Object.freeze(Object.entries(schema.CATEGORIES).flatMap(([category, fields]) => fields.map(field => `${category}.${field}`)));
const canonical = new Set(canonicalFields);
const statuses = ["evidence-found", "researched-no-evidence", "not-researched", "conflicting"];
const evidenceKey = item => `${item.catalogVariantKey}|${item.field}`;
function validate() {
  const errors = [];
  if (dataset.canonicalFieldCount !== canonicalFields.length) errors.push("canonical field count mismatch");
  dataset.serviceCore.forEach(field => { if (!canonical.has(field)) errors.push(`unknown service-core field ${field}`); });
  if (new Set(dataset.serviceCore).size !== dataset.serviceCore.length) errors.push("duplicate service-core field");
  dataset.targets.forEach(target => { if (!knownKeys.has(target.catalogVariantKey)) errors.push(`unknown target ${target.catalogVariantKey}`); if (target.years.from < 1990 || target.years.to > 2025 || target.years.from > target.years.to) errors.push(`invalid years ${target.catalogVariantKey}`); });
  const ids = [...dataset.evidence, ...dataset.reviewedNoEvidence].map(item => item.id); if (new Set(ids).size !== ids.length) errors.push("duplicate evidence identity");
  const pairs = dataset.evidence.map(evidenceKey); if (new Set(pairs).size !== pairs.length) errors.push("duplicate evidence field identity");
  const reviewedPairs = dataset.reviewedNoEvidence.map(evidenceKey); if (new Set(reviewedPairs).size !== reviewedPairs.length) errors.push("duplicate reviewed field identity");
  dataset.evidence.forEach(item => { if (!knownKeys.has(item.catalogVariantKey) || !canonical.has(item.field)) errors.push(`invalid evidence target/field ${item.id}`); if (!dataset.sources.some(source => source.id === item.sourceId)) errors.push(`missing source ${item.sourceId}`); if (!item.rawValue || item.normalizedValue === null || item.normalizedValue === undefined || !item.sourceSection || !item.sourcePage) errors.push(`incomplete evidence ${item.id}`); });
  dataset.reviewedNoEvidence.forEach(item => { if (!knownKeys.has(item.catalogVariantKey) || !canonical.has(item.field)) errors.push(`invalid no-evidence target/field ${item.id}`); if (!Array.isArray(item.sourceCategoriesSearched) || item.sourceCategoriesSearched.length === 0 || !Array.isArray(item.sourceIdsSearched) || !item.researchDate || item.result !== "no reliable evidence") errors.push(`incomplete audit trail ${item.id}`); });
  const sourceIds = dataset.sources.map(source => source.id); if (new Set(sourceIds).size !== sourceIds.length) errors.push("duplicate source ID");
  const attemptIds = acquisition.attempts.map(item => item.id); if (new Set(attemptIds).size !== attemptIds.length) errors.push("duplicate acquisition attempt ID");
  acquisition.attempts.forEach(item => { if (!knownKeys.has(item.target)) errors.push(`unknown acquisition target ${item.target}`); if (!item.document || !item.sourceClass || !item.accessResult || !item.disposition || !item.date) errors.push(`incomplete acquisition attempt ${item.id}`); });
  return errors;
}
function matrix(phase) {
  const evidence = new Map((phase === "pre" ? dataset.evidence.slice(0, 29) : dataset.evidence).map(item => [evidenceKey(item), item]));
  const noEvidence = new Set(phase === "pre" ? canonicalFields.flatMap(field => dataset.targets.map(target => `${target.catalogVariantKey}|${field}`)) : dataset.reviewedNoEvidence.map(evidenceKey));
  return dataset.targets.flatMap(target => canonicalFields.map(field => { const key = `${target.catalogVariantKey}|${field}`; return { catalogVariantKey: target.catalogVariantKey, field, status: evidence.has(key) ? "evidence-found" : noEvidence.has(key) ? "researched-no-evidence" : "not-researched" }; }));
}
function count(rows, fields) { const allowed = fields || null; return Object.fromEntries(statuses.map(status => [status, rows.filter(row => (!allowed || allowed.has(row.field)) && row.status === status).length])); }
function phaseSummary(rows, targetKey, fields) { const c = count(rows.filter(row => row.catalogVariantKey === targetKey), fields); const total = fields.size; return { total, evidenceFound: c["evidence-found"], researchedNoEvidence: c["researched-no-evidence"], notResearched: c["not-researched"], conflicting: c.conflicting, coveragePercent: Math.round(c["evidence-found"] / total * 100) }; }
function quality(targetKey) { const rows = dataset.evidence.filter(item => item.catalogVariantKey === targetKey); return { tier1: rows.length, tier2: 0, tier3: 0, ownerManual: rows.filter(item => item.sourceId.includes("cbr500r") && item.sourceId.includes("manual")).length, serviceManual: rows.filter(item => item.sourceId.includes("vfr800.2002-manual")).length, oemParts: 0 }; }
function attemptSummary(targetKey) { const rows = acquisition.attempts.filter(item => item.target === targetKey); return { attempted: rows.length, acquired: rows.filter(item => item.disposition === "acquired" || item.disposition === "acquired-content").length, authenticatedOfficial: rows.filter(item => (item.disposition === "acquired" || item.disposition === "acquired-content") && item.authorityResult && /Honda/.test(item.authorityResult)).length, workshopService: rows.filter(item => item.sourceClass.includes("service-manual") || item.sourceClass.includes("common-service")).length, ownerManual: rows.filter(item => item.sourceClass === "official-owner-manual").length, oemParts: rows.filter(item => item.sourceClass.includes("oem-parts")).length, technicalPublication: rows.filter(item => item.sourceClass.includes("technical")).length, blocked: rows.filter(item => /blocked|unverifiable|metadata-only/.test(item.disposition)).length, wrongApplicability: rows.filter(item => /not established|wrong/i.test(item.applicabilityResult)).length, weakAuthority: rows.filter(item => /not a workshop|could not be verified/i.test(item.authorityResult)).length, details: rows }; }
function buildReport() {
  const errors = validate(); const serviceFields = new Set(dataset.serviceCore); const pre = matrix("pre"); const post = matrix("post");
  const preCounts = count(pre); const postCounts = count(post);
  const byTarget = dataset.targets.map(target => { const preService = phaseSummary(pre, target.catalogVariantKey, serviceFields); const postService = phaseSummary(post, target.catalogVariantKey, serviceFields); const preCanonical = phaseSummary(pre, target.catalogVariantKey, canonical); const postCanonical = phaseSummary(post, target.catalogVariantKey, canonical); const readiness = postService.evidenceFound >= 0.8 * postService.total && postService.conflicting === 0 ? "SERVICE-CORE-READY" : postService.evidenceFound >= 0.5 * postService.total ? "SERVICE-CORE-PARTIAL" : "RESEARCH-MORE"; return { catalogVariantKey: target.catalogVariantKey, family: target.family, years: target.years, pre: { serviceCore: preService, canonical: preCanonical }, post: { serviceCore: postService, canonical: postCanonical }, deltaEvidence: postService.evidenceFound - preService.evidenceFound, sourceQuality: quality(target.catalogVariantKey), sourceAttempts: attemptSummary(target.catalogVariantKey), readiness, blockers: readiness === "SERVICE-CORE-READY" ? [] : ["critical service fields remain unresearched"] }; });
  const aggregate = (rows, fields) => { const c = count(rows, fields); const slots = Object.values(c).reduce((a, b) => a + b, 0); return { slots, evidence: c["evidence-found"], noEvidence: c["researched-no-evidence"], notResearched: c["not-researched"], conflicting: c.conflicting }; };
  const postService = aggregate(post, serviceFields); const postCanonical = aggregate(post, canonical);
  const result = { schemaVersion: dataset.schemaVersion, canonicalFieldCount: canonicalFields.length, canonicalFields, serviceCoreFieldCount: dataset.serviceCore.length, serviceCoreFields: dataset.serviceCore, targetVariants: dataset.targets.length, pre: { serviceCore: aggregate(pre, serviceFields), canonical: aggregate(pre, canonical) }, post: { serviceCore: postService, canonical: postCanonical }, serviceCoreSlots: postService.slots, serviceCoreEvidence: postService.evidence, serviceCoreCoveragePercent: Math.round(postService.evidence / postService.slots * 100), canonicalSlots: postCanonical.slots, canonicalEvidence: postCanonical.evidence, canonicalCoveragePercent: Math.round(postCanonical.evidence / postCanonical.slots * 100), evidenceFound: postService.evidence, researchedNoEvidence: postService.noEvidence, notResearched: postService.notResearched, conflicting: postService.conflicting, tier1Evidence: dataset.evidence.length, tier2Evidence: 0, tier3Evidence: 0, ownerManualEvidence: dataset.evidence.filter(item => item.sourceId.includes("cbr500r")).length, serviceWorkshopEvidence: 0, oemPartsEvidence: 0, readiness: { ready: byTarget.filter(item => item.readiness === "SERVICE-CORE-READY").length, partial: byTarget.filter(item => item.readiness === "SERVICE-CORE-PARTIAL").length, more: byTarget.filter(item => item.readiness === "RESEARCH-MORE").length }, byTarget, matrices: { pre, post }, validation: { valid: errors.length === 0, errors } };
  result.deterministicHash = crypto.createHash("sha256").update(JSON.stringify(result)).digest("hex");
  return result;
}
if (require.main === module) console.log(JSON.stringify(buildReport(), null, 2));
module.exports = Object.freeze({ validate, buildReport, canonicalFields });
