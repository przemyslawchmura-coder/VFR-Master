// NON-PRODUCTION, Node-only research orchestration. Never loaded by index.html.
"use strict";

const GRADES = Object.freeze(["A", "B", "C", "D"]);
const STATUSES = Object.freeze(["verified-evidence-candidate", "researched-no-evidence", "conflicting-evidence", "applicability-unresolved", "needs-human-review", "ready-for-profile-review"]);
const ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

function validateCandidates(candidates, { sources = {}, technicalValidator = null } = {}) {
  const errors = [], warnings = [], sourceIds = new Set(Array.isArray(sources) ? sources.map(item => item.id) : Object.keys(sources));
  const ids = new Set();
  (Array.isArray(candidates) ? candidates : []).forEach((candidate, index) => {
    const path = `candidates[${index}]`;
    if (!candidate || typeof candidate !== "object") return errors.push(issue("INVALID_CANDIDATE", path));
    if (!ID.test(candidate.id || "")) errors.push(issue("INVALID_CANDIDATE_ID", `${path}.id`));
    else if (ids.has(candidate.id)) errors.push(issue("DUPLICATE_CANDIDATE_ID", `${path}.id`));
    ids.add(candidate.id);
    ["manufacturer", "family", "generation", "category", "proposedEntryId"].forEach(field => {
      if (typeof candidate[field] !== "string" || !candidate[field].trim()) errors.push(issue("MISSING_FIELD", `${path}.${field}`));
    });
    if (!ID.test(candidate.proposedEntryId || "")) errors.push(issue("INVALID_ENTRY_ID", `${path}.proposedEntryId`));
    if (candidate.researchStatus !== "researched-no-evidence" && (!candidate.proposedEntry || typeof candidate.proposedEntry !== "object")) errors.push(issue("MISSING_PROPOSED_ENTRY", `${path}.proposedEntry`));
    if (!GRADES.includes(candidate.evidenceGrade)) errors.push(issue("INVALID_EVIDENCE_GRADE", `${path}.evidenceGrade`));
    if (!STATUSES.includes(candidate.researchStatus)) errors.push(issue("INVALID_RESEARCH_STATUS", `${path}.researchStatus`));
    if (!validYears(candidate.years)) errors.push(issue("INVALID_YEAR_SCOPE", `${path}.years`));
    validateScope(candidate.applicability, `${path}.applicability`, errors);
    const refs = Array.isArray(candidate.sourceIds) ? candidate.sourceIds : [];
    if (!refs.length && candidate.researchStatus !== "researched-no-evidence") errors.push(issue("MISSING_SOURCE", `${path}.sourceIds`));
    refs.forEach((sourceId, sourceIndex) => { if (!sourceIds.has(sourceId)) errors.push(issue("UNKNOWN_SOURCE", `${path}.sourceIds[${sourceIndex}]`)); });
    if (candidate.evidenceGrade === "A" && refs.length === 0) errors.push(issue("GRADE_A_WITHOUT_SOURCE", `${path}.evidenceGrade`));
    if (candidate.proposedEntry && technicalValidator) {
      const fixture = draftEnvelope(candidate, candidate.proposedEntry);
      const report = technicalValidator.validate ? technicalValidator.validate(fixture) : technicalValidator.validateTechnicalProfile(fixture);
      if (!report.valid) errors.push(issue("INVALID_PROPOSED_ENTRY", `${path}.proposedEntry`, report.errors));
    }
  });
  detectDuplicateCandidates(candidates).forEach(item => warnings.push(issue(item.safeToMerge ? "MERGE_OPPORTUNITY" : "DUPLICATE_REVIEW_REQUIRED", item.candidateIds.join(","))));
  return { valid: errors.length === 0, errors, warnings };
}

function isPromotionReady(candidate, options = {}) {
  const validation = validateCandidates([candidate], options);
  const blockers = validation.errors.map(item => item.code);
  if (candidate.evidenceGrade !== "A") blockers.push("EVIDENCE_POLICY");
  if (!["verified-evidence-candidate", "ready-for-profile-review"].includes(candidate.researchStatus)) blockers.push("RESEARCH_STATUS_NOT_PROMOTABLE");
  if (candidate.researchStatus === "conflicting-evidence") blockers.push("CONFLICTING_EVIDENCE");
  if (candidate.researchStatus === "applicability-unresolved") blockers.push("APPLICABILITY_UNRESOLVED");
  if ((options.candidates || []).some(other => other.id !== candidate.id && scopesOverlap(candidate, other) && other.proposedEntryId === candidate.proposedEntryId && !sameEvidence(candidate, other))) blockers.push("OVERLAPPING_CANDIDATE");
  return { ready: blockers.length === 0, status: blockers.length ? "needs-human-review" : "ready-for-profile-review", blockers: [...new Set(blockers)].sort() };
}

function composeLayers(layers, context) {
  const requiredContext = [];
  const scopes = (layers || []).flatMap(layer => [layer.scope, layer.evidenceScope]).filter(Boolean);
  if (!Number.isInteger(context.year) && scopes.some(scope => scope.years)) requiredContext.push("year");
  if (context.abs == null && scopes.some(scope => typeof scope.abs === "boolean")) requiredContext.push("abs");
  if (context.region == null && scopes.some(scope => Array.isArray(scope.regions) && !scope.regions.includes("ALL"))) requiredContext.push("region");
  if (context.equipment == null && scopes.some(scope => Array.isArray(scope.equipment) && scope.equipment.length)) requiredContext.push("equipment");
  if (requiredContext.length) return { status: "ambiguous-context", entries: [], conflicts: [], requiredContext: requiredContext.sort() };
  const applicable = (layers || []).filter(layer => scopeMatches(layer.scope, context) && scopeMatches(layer.evidenceScope, context));
  const conflicts = [];
  const ranked = applicable.map(layer => ({ layer, specificity: specificity(layer.scope) })).sort((a, b) => a.specificity - b.specificity || a.layer.id.localeCompare(b.layer.id));
  for (let i = 0; i < ranked.length; i += 1) for (let j = i + 1; j < ranked.length; j += 1) {
    const left = operationMap(ranked[i].layer), right = operationMap(ranked[j].layer);
    const leftContainsRight = scopeContains(ranked[i].layer.scope, ranked[j].layer.scope), rightContainsLeft = scopeContains(ranked[j].layer.scope, ranked[i].layer.scope);
    const orderedOverride = leftContainsRight !== rightContainsLeft;
    for (const id of left.keys()) if (right.has(id) && JSON.stringify(left.get(id)) !== JSON.stringify(right.get(id)) && !orderedOverride) conflicts.push({ entryId: id, layerIds: [ranked[i].layer.id, ranked[j].layer.id].sort() });
  }
  if (conflicts.length) return { status: "conflicting-layers", entries: [], conflicts: unique(conflicts) };
  const entries = new Map(), ownership = {};
  ranked.forEach(({ layer }) => (layer.operations || []).slice().sort((a, b) => a.entryId.localeCompare(b.entryId)).forEach(operation => {
    if (operation.action === "remove") { entries.delete(operation.entryId); delete ownership[operation.entryId]; return; }
    const existing = entries.get(operation.entryId);
    if (existing && operation.action !== "replace" && JSON.stringify(existing) !== JSON.stringify(operation.entry)) {
      conflicts.push({ entryId: operation.entryId, layerIds: [ownership[operation.entryId].owningLayerId, layer.id].sort() }); return;
    }
    entries.set(operation.entryId, clone(operation.entry));
    ownership[operation.entryId] = { owningLayerId: layer.id, evidenceScope: clone(layer.evidenceScope), inherited: specificity(layer.scope) < specificity(contextToScope(context)) };
  }));
  if (conflicts.length) return { status: "conflicting-layers", entries: [], conflicts: unique(conflicts) };
  return { status: "composed", entries: [...entries.values()].sort((a, b) => a.id.localeCompare(b.id)), ownership, appliedLayerIds: ranked.map(item => item.layer.id) };
}

function analyzeCoverage({ context = {}, productionEntries = [], candidates = [], standard, capabilities = [] }) {
  const capabilitySet = new Set(capabilities), production = new Map(productionEntries.map(entry => [entry.id, entry]));
  const fields = standard.fields.map(field => {
    if (field.importance === "conditional" && !capabilitySet.has(field.appliesWhen)) return { fieldId: field.id, category: field.category, status: "not-applicable" };
    const relevant = candidates.filter(candidate => (candidate.coverageField || candidate.category) === field.id && scopeMatches({ years: candidate.years, ...candidate.applicability }, context));
    const mappedProduction = production.get(field.productionEntryId || field.id);
    let status = mappedProduction && mappedProduction.status === "verified" ? "verified" : mappedProduction ? "covered" : "missing";
    if (relevant.some(item => item.researchStatus === "conflicting-evidence")) status = "conflicting";
    else if (relevant.some(item => item.researchStatus === "applicability-unresolved")) status = "applicability-unresolved";
    else if (relevant.some(item => item.researchStatus === "needs-human-review")) status = "needs-human-review";
    else if (relevant.some(item => item.researchStatus === "researched-no-evidence")) status = "researched-no-evidence";
    else if (!mappedProduction && relevant.length) status = "candidate";
    return { fieldId: field.id, category: field.category, importance: field.importance, status, candidateIds: relevant.map(item => item.id).sort() };
  });
  const desired = fields.filter(item => item.status !== "not-applicable");
  const counts = Object.fromEntries(["covered", "verified", "candidate", "missing", "researched-no-evidence", "conflicting", "applicability-unresolved", "not-applicable", "needs-human-review"].map(status => [status, fields.filter(item => item.status === status).length]));
  return { fields, counts, totalDesiredFacts: desired.length, verifiedCount: counts.verified, missingCount: counts.missing, conflictCount: counts.conflicting, coveragePercent: desired.length ? Number(((counts.verified + counts.covered) * 100 / desired.length).toFixed(2)) : 100 };
}

function generateResearchQueue(targets, reports) {
  return (targets || []).map(target => {
    const report = reports[target.catalogVariantKey] || { counts: {}, fields: [] };
    const missingCategories = [...new Set((report.fields || []).filter(item => item.status !== "verified" && item.status !== "covered" && item.status !== "not-applicable").map(item => item.category))].sort();
    const rank = !target.hasProductionGeneration ? 1 : missingCategories.some(item => ["brakes", "wheels", "final-drive", "maintenance", "electrical"].includes(item)) ? 2 : report.counts["applicability-unresolved"] ? 3 : report.counts.conflicting ? 4 : missingCategories.includes("oem-parts") ? 5 : 6;
    const reason = ["missing-generation", "core-safety-service-gap", "applicability-unresolved", "conflicting-evidence", "oem-service-parts-gap", "desirable-coverage-gap"][rank - 1];
    return { manufacturer: target.manufacturer, family: target.family, generation: target.generation, years: clone(target.years), context: clone(target.context || {}), missingCoverageCategories: missingCategories, priority: rank, reason, catalogVariantKey: target.catalogVariantKey };
  }).filter(item => item.missingCoverageCategories.length || item.priority === 1).sort((a, b) => a.priority - b.priority || a.manufacturer.localeCompare(b.manufacturer) || a.family.localeCompare(b.family) || a.generation.localeCompare(b.generation) || a.years.from - b.years.from || a.catalogVariantKey.localeCompare(b.catalogVariantKey));
}

function batchQueue(queue, { manufacturer = null, family = null, maxGenerations = Infinity, maxTargets = Infinity } = {}) {
  const filtered = queue.filter(item => (!manufacturer || item.manufacturer === manufacturer) && (!family || item.family === family));
  const generations = new Set(), result = [];
  for (const item of filtered) { const key = `${item.manufacturer}|${item.family}|${item.generation}`; if (!generations.has(key) && generations.size >= maxGenerations) continue; generations.add(key); if (result.length < maxTargets) result.push(clone(item)); }
  return result;
}

function detectDuplicateCandidates(candidates = []) {
  const groups = new Map();
  candidates.forEach(candidate => { const key = [candidate.proposedEntryId, JSON.stringify(candidate.proposedValue), JSON.stringify(candidate.conditions || null)].join("|"); (groups.get(key) || groups.set(key, []).get(key)).push(candidate); });
  return [...groups.values()].filter(group => group.length > 1).map(group => ({ candidateIds: group.map(item => item.id).sort(), safeToMerge: group.every(item => sameEvidence(group[0], item)), reason: group.every(item => sameEvidence(group[0], item)) ? "identical-value-and-evidence-scope" : "identical-value-different-evidence-scope" })).sort((a, b) => a.candidateIds[0].localeCompare(b.candidateIds[0]));
}

function generateDraftProposal({ identity, candidates, sources, technicalValidator }) {
  const decisions = candidates.map(candidate => ({ candidate, readiness: isPromotionReady(candidate, { candidates, sources, technicalValidator }) }));
  return { schemaVersion: "revlog-technical-draft-proposal/v1", production: false, registered: false, identity: clone(identity), proposals: decisions.filter(item => item.readiness.ready).map(item => ({ candidateId: item.candidate.id, proposedEntry: clone(item.candidate.proposedEntry), owningResearchScope: { years: clone(item.candidate.years), applicability: clone(item.candidate.applicability), sourceIds: clone(item.candidate.sourceIds) } })).sort((a, b) => a.candidateId.localeCompare(b.candidateId)), rejected: decisions.filter(item => !item.readiness.ready).map(item => ({ candidateId: item.candidate.id, blockers: item.readiness.blockers })) };
}

function scopeMatches(scope = {}, context = {}) { if (!scope) return true; if (scope.years && Number.isInteger(context.year) && (context.year < scope.years.from || context.year > scope.years.to)) return false; if (scope.regions && scope.regions.length && !scope.regions.includes("ALL") && (!context.region || !scope.regions.includes(context.region))) return false; if (typeof scope.abs === "boolean" && context.abs !== scope.abs) return false; if (scope.equipment && scope.equipment.length && (!Array.isArray(context.equipment) || !scope.equipment.every(item => context.equipment.includes(item)))) return false; return true; }
function specificity(scope = {}) { return (scope.years ? 1 + 1 / (scope.years.to - scope.years.from + 1) : 0) + (scope.regions && !scope.regions.includes("ALL") ? 2 : 0) + (typeof scope.abs === "boolean" ? 4 : 0) + (scope.equipment && scope.equipment.length ? 8 + scope.equipment.length : 0); }
function contextToScope(context) { return { years: Number.isInteger(context.year) ? { from: context.year, to: context.year } : null, regions: context.region ? [context.region] : null, abs: context.abs, equipment: context.equipment }; }
function operationMap(layer) { return new Map((layer.operations || []).map(operation => [operation.entryId, operation])); }
function validYears(years) { return years && Number.isInteger(years.from) && Number.isInteger(years.to) && years.from <= years.to; }
function validateScope(scope, path, errors) { if (!scope || typeof scope !== "object") return errors.push(issue("INVALID_APPLICABILITY", path)); if (scope.regions != null && (!Array.isArray(scope.regions) || scope.regions.some(item => typeof item !== "string" || !item))) errors.push(issue("INVALID_REGION_SCOPE", `${path}.regions`)); if (scope.abs !== null && scope.abs !== undefined && typeof scope.abs !== "boolean") errors.push(issue("INVALID_ABS_SCOPE", `${path}.abs`)); if (scope.equipment != null && (!Array.isArray(scope.equipment) || scope.equipment.some(item => typeof item !== "string" || !item))) errors.push(issue("INVALID_EQUIPMENT_SCOPE", `${path}.equipment`)); }
function scopesOverlap(a, b) { const ay = a.years, by = b.years; return ay.from <= by.to && by.from <= ay.to && compatible(a.applicability, b.applicability); }
function compatible(a = {}, b = {}) { if (typeof a.abs === "boolean" && typeof b.abs === "boolean" && a.abs !== b.abs) return false; if (a.regions && b.regions && !a.regions.some(item => b.regions.includes(item) || item === "ALL" || b.regions.includes("ALL"))) return false; return true; }
function scopeContains(outer = {}, inner = {}) { if (outer.years && (!inner.years || outer.years.from > inner.years.from || outer.years.to < inner.years.to)) return false; if (outer.regions && !outer.regions.includes("ALL") && (!inner.regions || inner.regions.some(item => !outer.regions.includes(item)))) return false; if (typeof outer.abs === "boolean" && outer.abs !== inner.abs) return false; if (outer.equipment && outer.equipment.length && (!inner.equipment || outer.equipment.some(item => !inner.equipment.includes(item)))) return false; return true; }
function sameEvidence(a, b) { return JSON.stringify(a.years) === JSON.stringify(b.years) && JSON.stringify(a.applicability) === JSON.stringify(b.applicability) && JSON.stringify((a.sourceIds || []).slice().sort()) === JSON.stringify((b.sourceIds || []).slice().sort()); }
function unique(items) { const seen = new Set(); return items.filter(item => { const key = JSON.stringify(item); if (seen.has(key)) return false; seen.add(key); return true; }); }
function issue(code, path, details) { return { code, path, ...(details ? { details } : {}) }; }
function clone(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }
function draftEnvelope(candidate, entry) {
  const documents = {}, citations = {};
  (candidate.sourceIds || []).forEach((sourceId, index) => {
    const documentId = `doc.research.validation.${index + 1}`;
    documents[documentId] = { id: documentId, type: "oem-service-manual", title: sourceId, manufacturer: candidate.manufacturer, years: candidate.years };
    citations[sourceId] = { id: sourceId, documentId, section: candidate.sourceSection || "Research candidate", pages: candidate.sourcePage == null ? [] : [String(candidate.sourcePage)] };
  });
  return { schemaVersion: "revlog-technical-profile/v1", profile: { id: "research.validation.draft", revision: 1, status: "draft" }, motorcycle: { applicability: { catalogVariantKeys: ["research.validation"], years: candidate.years } }, categories: [{ id: entry.categoryId, label: entry.categoryId }], documents, citations, entries: [entry] };
}

module.exports = Object.freeze({ EVIDENCE_GRADES: GRADES, RESEARCH_STATUSES: STATUSES, validateCandidates, isPromotionReady, composeLayers, analyzeCoverage, generateResearchQueue, batchQueue, detectDuplicateCandidates, generateDraftProposal, scopeMatches });
