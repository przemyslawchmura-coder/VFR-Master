// NON-PRODUCTION generic research pipeline helpers.
"use strict";

const crypto = require("node:crypto");
const coverage = require("../schema/research-coverage-standard.js");

const PROOF_STATUSES = Object.freeze([
  "VERIFIED-DIRECT", "VERIFIED-AUTHENTICATED-COPY", "SOURCE-IDENTITY-UNCERTAIN",
  "APPLICABILITY-UNCERTAIN", "PAGE-NOT-VERIFIED", "CONFLICT", "INVALID-EVIDENCE",
  "RESEARCHED-NO-EVIDENCE", "NOT-RESEARCHED"
]);
const ACQUISITION_DISPOSITIONS = Object.freeze([
  "acquired-content", "partial-content", "metadata-only", "login-blocked", "unavailable",
  "wrong-applicability", "identity-uncertain"
]);
const COMPARISONS = Object.freeze([
  "MATCH", "MATCH-NORMALIZED", "PRODUCTION-MISSING", "RESEARCH-MISSING",
  "APPLICABILITY-DIFFERENCE", "CONFLICT", "NOT-COMPARABLE"
]);
const serviceCoreFields = Object.freeze([
  "engine.configuration", "engine.displacement", "engine.idle-speed", "lubrication.oil-specification",
  "lubrication.viscosity", "lubrication.api-jaso", "lubrication.capacity-drain", "lubrication.capacity-filter",
  "lubrication.oil-filter", "cooling.coolant-specification", "cooling.capacity", "cooling.replacement-interval",
  "ignition.spark-plug-oem", "ignition.spark-plug-alternative", "ignition.plug-gap", "ignition.replacement-interval",
  "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.measurement-conditions", "valve_train.inspection-interval",
  "final_drive.chain-size", "final_drive.chain-slack", "final_drive.chain-inspection", "final_drive.chain-lubrication-interval",
  "brakes.brake-fluid", "brakes.fluid-interval", "brakes.front-rear-configuration", "brakes.oem-pad-numbers",
  "tires_wheels.front-size", "tires_wheels.rear-size", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures",
  "electrical.battery-specification", "electrical.battery-capacity", "electrical.main-fuse", "fuel_intake.tank-capacity",
  "maintenance.periodic-schedule", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals",
  "torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle"
]);
const canonicalFields = Object.freeze(Object.entries(coverage.CATEGORIES).flatMap(([category, fields]) => fields.map(field => `${category}.${field}`)));
const validProof = status => status === "VERIFIED-DIRECT" || status === "VERIFIED-AUTHENTICATED-COPY";
const evidenceKey = row => `${row.catalogVariantKey}|${row.canonicalFieldId || row.field}|${row.sourceId || ""}`;
const slotKey = row => `${row.catalogVariantKey}|${row.canonicalFieldId || row.field}`;

function assertSubset(fields, allowed) {
  if (!Array.isArray(fields) || new Set(fields).size !== fields.length || fields.some(field => !allowed.includes(field))) {
    throw new Error("field list must be a unique subset of the canonical schema");
  }
}

function documentIdentity(source) {
  if (source.documentId) return source.documentId;
  if (source.publisher && source.publicationId) return `${source.publisher}|${source.publicationId}`;
  if (source.contentHash) return `${source.publisher || "unknown"}|hash:${source.contentHash}`;
  return `${source.publisher || "unknown"}|${source.title || "untitled"}|${source.publicationDate || "unknown"}`;
}

function buildDocumentRegistry(sources) {
  const byIdentity = new Map();
  sources.forEach(source => {
    const id = documentIdentity(source);
    const current = byIdentity.get(id);
    const location = source.url || source.sourceLocation || null;
    if (current) {
      current.locations = Object.freeze([...new Set([...current.locations, location].filter(Boolean))].sort());
      current.mirrorCount = current.locations.length;
      return;
    }
    byIdentity.set(id, {
      documentId: id,
      sourceClass: source.sourceClass || source.type || null,
      title: source.title || null,
      publicationId: source.publicationId || null,
      publisher: source.publisher || null,
      publicationDate: source.publicationDate || source.documentYear || null,
      revision: source.revision || null,
      markets: Object.freeze(source.markets || (source.region ? [source.region] : [])),
      models: Object.freeze(source.models || []),
      years: Object.freeze(source.years || {}),
      locations: Object.freeze(location ? [location] : []),
      accessState: source.disposition || source.accessState || null,
      authenticationState: source.authenticationState || source.identityStatus || null,
      contentHash: source.contentHash || null,
      inspectedPages: Object.freeze(source.inspectedPages || []),
      mirrorCount: location ? 1 : 0
    });
  });
  return Object.freeze([...byIdentity.values()].sort((a, b) => a.documentId.localeCompare(b.documentId)));
}

function validateApplicability(applicability = {}) {
  for (const key of ["abs", "transmission"]) {
    if (!(applicability[key] === true || applicability[key] === false || applicability[key] === null || applicability[key] === undefined)) {
      throw new Error(`${key} applicability must be tri-state`);
    }
  }
  return Object.freeze({ ...applicability });
}

function normalizeValue(rawValue, unit) {
  if (rawValue === null || rawValue === undefined) return Object.freeze({ rawValue, normalizedValue: null, unit: unit || null, normalized: false });
  if (typeof rawValue !== "number") return Object.freeze({ rawValue, normalizedValue: rawValue, unit: unit || null, normalized: false });
  const conversions = { ml: ["L", value => value / 1000], L: ["L", value => value], psi: ["kPa", value => value * 6.894757], bar: ["kPa", value => value * 100], "N·m": ["N·m", value => value] };
  const conversion = conversions[unit];
  return conversion ? Object.freeze({ rawValue, normalizedValue: conversion[1](rawValue), unit: conversion[0], normalized: conversion[0] !== unit }) : Object.freeze({ rawValue, normalizedValue: rawValue, unit: unit || null, normalized: false });
}

function compareValues(research, production) {
  if (research === null || research === undefined) return "RESEARCH-MISSING";
  if (production === null || production === undefined) return "PRODUCTION-MISSING";
  const r = research.normalizedValue === undefined ? research : research.normalizedValue;
  const p = production.normalizedValue === undefined ? production : production.normalizedValue;
  const equal = JSON.stringify(r) === JSON.stringify(p);
  if (!equal) return "CONFLICT";
  return research.normalized || production.normalized ? "MATCH-NORMALIZED" : "MATCH";
}

function validateExtractionCandidate(candidate) {
  if (!candidate || !candidate.documentId || !candidate.page || !candidate.candidateField) throw new Error("extraction candidate requires document, page and field");
  assertSubset([candidate.candidateField], canonicalFields);
  return Object.freeze({ ...candidate, applicability: validateApplicability(candidate.applicability), extractionConfidence: candidate.extractionConfidence || "unrated", extractionMethod: candidate.extractionMethod || "manual" });
}

function detectConflicts(evidence) {
  const groups = new Map();
  evidence.filter(item => validProof(item.proofStatus)).forEach(item => { const key = `${slotKey(item)}|${JSON.stringify(item.applicability || {})}`; const list = groups.get(key) || []; list.push(item); groups.set(key, list); });
  return Object.freeze([...groups.entries()].filter(([, list]) => new Set(list.map(item => JSON.stringify(item.normalizedValue))).size > 1).map(([key, list]) => Object.freeze({ conflictGroup: key, evidenceIds: Object.freeze(list.map(item => item.id || evidenceKey(item)).sort()), status: "CONFLICT" })));
}

function calculateGaps(target, evidence, fields = serviceCoreFields) {
  assertSubset(fields, canonicalFields);
  const rows = fields.map(field => {
    const candidates = evidence.filter(item => item.catalogVariantKey === target.catalogVariantKey && (item.canonicalFieldId || item.field) === field);
    const verified = candidates.filter(item => validProof(item.proofStatus));
    const conflict = candidates.some(item => item.proofStatus === "CONFLICT");
    let status = "not-researched";
    if (conflict) status = "conflicting";
    else if (verified.length) status = "evidence-found";
    else if (candidates.some(item => item.proofStatus === "RESEARCHED-NO-EVIDENCE")) status = "researched-no-evidence";
    else if (candidates.length) status = "not-researched";
    return Object.freeze({ catalogVariantKey: target.catalogVariantKey, canonicalFieldId: field, status, sourceIds: Object.freeze(verified.map(item => item.sourceId).filter(Boolean).sort()), blockers: status === "not-researched" ? Object.freeze([candidates.length ? "unverified evidence candidate" : "no evidence candidate"]) : Object.freeze([]) });
  });
  return Object.freeze(rows);
}

function generateTargets(catalog, options = {}, evidence = []) {
  const wanted = options.manufacturers ? new Set(options.manufacturers.map(String)) : null;
  const explicit = options.catalogVariantKeys ? new Set(options.catalogVariantKeys) : null;
  return Object.freeze(catalog.flatMap(brand => brand.models.flatMap(model => model.variants.map(variant => ({ manufacturer: brand.name, family: model.name, generation: variant.name, catalogVariantKey: variant.key, years: { from: variant.yearFrom, to: variant.yearTo } })))).filter(target => (!wanted || wanted.has(target.manufacturer) || wanted.has(target.manufacturer.toLowerCase())) && (!explicit || explicit.has(target.catalogVariantKey))).map(target => {
    const gaps = calculateGaps(target, evidence);
    const evidenceCount = gaps.filter(row => row.status === "evidence-found").length;
    return Object.freeze({ ...target, gaps, evidenceCount, total: serviceCoreFields.length, blockers: Object.freeze(gaps.filter(row => row.status !== "evidence-found").map(row => row.canonicalFieldId)), priority: priorityScore(target, gaps, evidence) });
  }).sort((a, b) => b.priority - a.priority || a.catalogVariantKey.localeCompare(b.catalogVariantKey)));
}

function priorityScore(target, gaps, evidence = []) {
  const verified = gaps.filter(row => row.status === "evidence-found").length;
  const conflicts = gaps.filter(row => row.status === "conflicting").length;
  const sourceLeverage = new Set(evidence.filter(item => item.catalogVariantKey === target.catalogVariantKey).map(item => item.sourceId).filter(Boolean)).size;
  return conflicts * 100 + sourceLeverage * 10 + verified * 2 + (serviceCoreFields.length - verified);
}

function buildReviewQueue(targets) {
  return Object.freeze(targets.flatMap(target => target.gaps.filter(row => row.status !== "evidence-found").map(row => ({ catalogVariantKey: target.catalogVariantKey, field: row.canonicalFieldId, blocker: row.status === "conflicting" ? "CONFLICT" : row.blockers[0], priority: target.priority + (row.status === "conflicting" ? 100 : 0), reason: `unresolved ${row.status} Service Core field` }))).sort((a, b) => b.priority - a.priority || a.catalogVariantKey.localeCompare(b.catalogVariantKey) || a.field.localeCompare(b.field)));
}

function buildBatchReport(targets) {
  const byManufacturer = {};
  targets.forEach(target => {
    const row = { manufacturer: target.manufacturer, model: target.family, generation: target.generation, catalogVariantKey: target.catalogVariantKey, years: target.years, verified: target.evidenceCount, total: target.total, coveragePercent: Math.round(target.evidenceCount / target.total * 100), conflicts: target.gaps.filter(item => item.status === "conflicting").length, uncertain: target.gaps.filter(item => item.status === "not-researched").length, researchedNoEvidence: target.gaps.filter(item => item.status === "researched-no-evidence").length, readiness: target.evidenceCount >= 36 && !target.gaps.some(item => item.status === "conflicting") ? "SERVICE-CORE-READY" : target.evidenceCount >= 22 ? "SERVICE-CORE-PARTIAL" : "RESEARCH-MORE", highestPriorityBlocker: target.blockers[0] || null };
    (byManufacturer[target.manufacturer] ||= []).push(row);
  });
  return Object.freeze({ serviceCoreFieldCount: serviceCoreFields.length, targets: Object.freeze(targets.map(target => byManufacturer[target.manufacturer].find(row => row.catalogVariantKey === target.catalogVariantKey))), byManufacturer: Object.freeze(byManufacturer), deterministicHash: crypto.createHash("sha256").update(JSON.stringify(byManufacturer)).digest("hex") });
}

module.exports = Object.freeze({ PROOF_STATUSES, ACQUISITION_DISPOSITIONS, COMPARISONS, canonicalFields, serviceCoreFields, validProof, documentIdentity, buildDocumentRegistry, validateApplicability, normalizeValue, compareValues, validateExtractionCandidate, detectConflicts, calculateGaps, generateTargets, priorityScore, buildReviewQueue, buildBatchReport });
