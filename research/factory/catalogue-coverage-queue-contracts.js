// NON-PRODUCTION read-only catalogue-to-coverage queue projection contract.
"use strict";

const crypto = require("node:crypto");

const SCHEMA_VERSION = "revlog-catalogue-coverage-queue/v1";
const SOURCE_STATES = Object.freeze(["READY", "BLOCKED", "EXHAUSTED", "UNRESOLVED"]);
const RESEARCH_STATES = Object.freeze(["EVIDENCE-FOUND", "PARTIAL", "RESEARCHED-NO-EVIDENCE", "NOT-RESEARCHED"]);
const PROFILE_STATES = Object.freeze(["PRESENT", "ABSENT"]);
const QUEUE_DISPOSITIONS = Object.freeze(["NOT-NEEDED", "PLANNING-CANDIDATE", "BLOCKED", "EXHAUSTED", "UNRESOLVED"]);

function assert(condition, message) { if (!condition) throw new TypeError(message); }

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}

function deterministicId(value) {
  return `catalogue-coverage-queue.${crypto.createHash("sha256").update(stable(value)).digest("hex").slice(0, 24)}`;
}

function validateCatalog(catalog) {
  assert(Array.isArray(catalog) && catalog.length > 0, "catalogue is required");
  const variantKeys = new Set();
  const rows = [];
  catalog.forEach(brand => {
    assert(brand && typeof brand.id === "string" && Array.isArray(brand.models), "catalogue manufacturer is malformed");
    brand.models.forEach(model => {
      assert(model && typeof model.id === "string" && Array.isArray(model.variants), "catalogue family is malformed");
      model.variants.forEach(variant => {
        assert(variant && typeof variant.key === "string" && variant.key.length > 0, "catalogue variant key is required");
        assert(Number.isInteger(variant.yearFrom) && Number.isInteger(variant.yearTo) && variant.yearFrom <= variant.yearTo, `catalogue year range is invalid for ${variant.key}`);
        assert(!variantKeys.has(variant.key), `ambiguous duplicate catalogue identity: ${variant.key}`);
        variantKeys.add(variant.key);
        for (let year = variant.yearFrom; year <= variant.yearTo; year += 1) rows.push({ manufacturerId: brand.id, manufacturer: brand.name, familyId: model.id, family: model.name, variantId: variant.id, variantName: variant.name, catalogVariantKey: variant.key, year });
      });
    });
  });
  return Object.freeze(rows.sort((a, b) => a.catalogVariantKey.localeCompare(b.catalogVariantKey) || a.year - b.year));
}

function validateSourceProspects(prospects) {
  assert(Array.isArray(prospects), "source prospects are required");
  return Object.freeze(prospects.map(prospect => {
    assert(prospect && typeof prospect.id === "string" && typeof prospect.catalogVariantKey === "string", "source prospect identity is incomplete");
    assert(typeof prospect.classification === "string", `source prospect classification is missing: ${prospect.id}`);
    return Object.freeze({ id: prospect.id, catalogVariantKey: prospect.catalogVariantKey, classification: prospect.classification });
  }).sort((a, b) => a.id.localeCompare(b.id)));
}

function validateResearchCoverage(coverage) {
  assert(Array.isArray(coverage), "research coverage is required");
  const keys = new Set();
  return Object.freeze(coverage.map(item => {
    assert(item && typeof item.catalogVariantKey === "string", "research coverage identity is incomplete");
    assert(!keys.has(item.catalogVariantKey), `duplicate research coverage identity: ${item.catalogVariantKey}`);
    keys.add(item.catalogVariantKey);
    const evidenceFields = [...new Set(item.evidenceFields || [])].sort();
    const noEvidence = [...new Set(item.researchedNoEvidenceFields || [])].sort();
    assert(evidenceFields.every(field => typeof field === "string") && noEvidence.every(field => typeof field === "string"), "research coverage fields are malformed");
    return Object.freeze({ catalogVariantKey: item.catalogVariantKey, evidenceFields: Object.freeze(evidenceFields), researchedNoEvidenceFields: Object.freeze(noEvidence) });
  }).sort((a, b) => a.catalogVariantKey.localeCompare(b.catalogVariantKey)));
}

function validateProductionProfiles(profiles, coreFieldIds) {
  assert(Array.isArray(profiles) && Array.isArray(coreFieldIds) && coreFieldIds.length === 95, "production profiles and the 95-field Core are required");
  const ids = new Set();
  return Object.freeze(profiles.map(profile => {
    assert(profile && profile.descriptor && typeof profile.descriptor.profileId === "string", "production profile descriptor is incomplete");
    assert(!ids.has(profile.descriptor.profileId), `duplicate production profile: ${profile.descriptor.profileId}`);
    ids.add(profile.descriptor.profileId);
    assert(Array.isArray(profile.descriptor.catalogVariantKeys) && profile.descriptor.catalogVariantKeys.length > 0, "production profile catalogue identity is incomplete");
    const coreFields = [...new Set(profile.coreFieldIds || [])].sort();
    assert(coreFields.every(field => coreFieldIds.includes(field)), `production profile Core field is outside the 95-field matrix: ${profile.descriptor.profileId}`);
    return Object.freeze({ profileId: profile.descriptor.profileId, catalogVariantKeys: Object.freeze([...profile.descriptor.catalogVariantKeys].sort()), years: Object.freeze({ from: profile.descriptor.years.from, to: profile.descriptor.years.to }), coreFieldIds: Object.freeze(coreFields) });
  }).sort((a, b) => a.profileId.localeCompare(b.profileId)));
}

function sourceState(prospects) {
  const identityClasses = new Map();
  prospects.forEach(item => { const classes = identityClasses.get(item.id) || new Set(); classes.add(item.classification); identityClasses.set(item.id, classes); });
  if ([...identityClasses.values()].some(classes => classes.size > 1)) return "UNRESOLVED";
  if (prospects.some(item => item.classification === "EXECUTION-READY")) return "READY";
  if (prospects.some(item => item.classification === "EXHAUSTED / LOW-MARGINAL-YIELD")) return "EXHAUSTED";
  if (prospects.some(item => item.classification.includes("BLOCKED") || item.classification === "AUTHENTICATED-BUT-APPLICABILITY-PARTIAL")) return "BLOCKED";
  return "UNRESOLVED";
}

function researchState(record) {
  if (!record) return "NOT-RESEARCHED";
  if (record.evidenceFields.length > 0 && record.researchedNoEvidenceFields.length > 0) return "PARTIAL";
  if (record.evidenceFields.length > 0) return "EVIDENCE-FOUND";
  if (record.researchedNoEvidenceFields.length > 0) return "RESEARCHED-NO-EVIDENCE";
  return "NOT-RESEARCHED";
}

function projectCatalogueCoverageQueue(input) {
  assert(input && typeof input === "object", "projection input is required");
  const catalogueRows = validateCatalog(input.catalogue);
  const coreFieldIds = [...new Set(input.coreFieldIds || [])];
  const profiles = validateProductionProfiles(input.productionProfiles, coreFieldIds);
  const prospects = validateSourceProspects(input.sourceProspects);
  const researchCoverage = validateResearchCoverage(input.researchCoverage);
  const profileMatches = row => profiles.filter(profile => profile.catalogVariantKeys.includes(row.catalogVariantKey) && row.year >= profile.years.from && row.year <= profile.years.to);
  const prospectMap = new Map(); prospects.forEach(item => { const list = prospectMap.get(item.catalogVariantKey) || []; list.push(item); prospectMap.set(item.catalogVariantKey, list); });
  const researchMap = new Map(researchCoverage.map(item => [item.catalogVariantKey, item]));
  const targets = catalogueRows.map(row => {
    const matches = profileMatches(row);
    assert(matches.length <= 1, `ambiguous production profile identity for ${row.catalogVariantKey}/${row.year}`);
    const profile = matches[0] || null;
    const sourceProspects = [...(prospectMap.get(row.catalogVariantKey) || [])].sort((a, b) => a.id.localeCompare(b.id));
    const source = sourceState(sourceProspects);
    const research = researchState(researchMap.get(row.catalogVariantKey));
    const disposition = profile ? "NOT-NEEDED" : source === "READY" ? "PLANNING-CANDIDATE" : source;
    return Object.freeze({
      targetId: `${row.catalogVariantKey}.${row.year}`,
      manufacturer: row.manufacturer,
      family: row.family,
      generation: row.variantName,
      catalogVariantKey: row.catalogVariantKey,
      year: row.year,
      applicability: Object.freeze({ state: "UNKNOWN", market: null, abs: null, transmission: null, equipment: null, unresolvedDimensions: Object.freeze(["market", "abs", "transmission", "equipment"]) }),
      production: Object.freeze({ state: profile ? "PRESENT" : "ABSENT", profileId: profile?.profileId || null, coreFieldCount: profile?.coreFieldIds.length || 0, coreFieldTotal: coreFieldIds.length }),
      research: Object.freeze({ state: research, evidenceFieldCount: researchMap.get(row.catalogVariantKey)?.evidenceFields.length || 0, researchedNoEvidenceFieldCount: researchMap.get(row.catalogVariantKey)?.researchedNoEvidenceFields.length || 0 }),
      source: Object.freeze({ state: source, prospectIds: Object.freeze([...new Set(sourceProspects.map(item => item.id))]) }),
      queueDisposition: disposition
    });
  });
  const queue = targets.filter(item => item.queueDisposition === "PLANNING-CANDIDATE").map(item => Object.freeze({ targetId: item.targetId, catalogVariantKey: item.catalogVariantKey, year: item.year, researchState: item.research.state, sourceState: item.source.state, applicabilityState: item.applicability.state }));
  const counts = Object.freeze({ catalogueTargets: targets.length, productionProfilePresent: targets.filter(item => item.production.state === "PRESENT").length, productionProfileAbsent: targets.filter(item => item.production.state === "ABSENT").length, sourceReady: targets.filter(item => item.source.state === "READY").length, sourceBlocked: targets.filter(item => item.source.state === "BLOCKED").length, sourceExhausted: targets.filter(item => item.source.state === "EXHAUSTED").length, sourceUnresolved: targets.filter(item => item.source.state === "UNRESOLVED").length, queueCandidates: queue.length });
  const body = { schemaVersion: SCHEMA_VERSION, coreFieldCount: coreFieldIds.length, counts, targets, queue };
  return Object.freeze({ ...body, id: deterministicId(body) });
}

module.exports = Object.freeze({ SCHEMA_VERSION, SOURCE_STATES, RESEARCH_STATES, PROFILE_STATES, QUEUE_DISPOSITIONS, deterministicId, projectCatalogueCoverageQueue });
