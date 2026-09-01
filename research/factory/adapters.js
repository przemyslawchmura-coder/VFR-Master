// NON-PRODUCTION shape adapters. They do not mutate or migrate historical data.
"use strict";

const contracts = require("./contracts.js");

const knownSet = values => ({ state: "KNOWN", values: Array.isArray(values) ? values : [values] });
const unknownSet = () => ({ state: "UNKNOWN", values: [] });
const years = value => value && Number.isInteger(value.from) && Number.isInteger(value.to) ? { kind: value.from === value.to ? "EXACT" : "RANGE", from: value.from, to: value.to } : { kind: "UNKNOWN", from: null, to: null };
const hostPath = raw => {
  if (!raw || typeof raw !== "string" || !raw.includes(".")) return [];
  try { const url = new URL(raw.includes("://") ? raw : `https://${raw}`); return [{ host: url.host, path: url.pathname || "/" }]; }
  catch { return []; }
};
const accessFromLegacy = value => contracts.ACCESSIBILITY.includes(value) ? value : value === "acquired-content" ? "ACCESSIBLE-OFFICIAL" : value === "login-blocked" ? "ACCESS-BLOCKED-AUTH" : value === "unavailable" ? "ACCESS-BROKEN" : "UNKNOWN";
const transmissionSet = value => value === "manual" || value === "dct" ? knownSet([value]) : unknownSet();
const absSet = value => value === true || value === false ? knownSet([value]) : unknownSet();
const equipmentValues = value => {
  if (typeof value !== "string") return unknownSet();
  if (/^standard(?:;|-|$)/i.test(value) || /^standard-/i.test(value)) return knownSet(["standard"]);
  return knownSet([value]);
};

function fromLegacyResearchTarget(record, options = {}) {
  const snapshot = JSON.parse(JSON.stringify(record));
  const from = snapshot.year || snapshot.years?.from;
  const to = snapshot.year || snapshot.years?.to;
  const markets = snapshot.markets || (snapshot.market ? [snapshot.market] : snapshot.region ? [snapshot.region] : []);
  return contracts.validateResearchTarget({
    schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
    id: options.id || `target.${snapshot.catalogVariantKey}.${from || "unknown"}.${markets.join("-").toLowerCase() || "unknown"}`,
    catalogVariantKey: snapshot.catalogVariantKey,
    manufacturer: snapshot.manufacturer || options.manufacturer,
    family: snapshot.family || snapshot.model || snapshot.target || options.family || "unknown-family",
    scope: {
      schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
      model: knownSet([snapshot.catalogVariantKey]),
      generation: snapshot.generation || options.generation ? knownSet([snapshot.generation || options.generation]) : unknownSet(),
      years: years(from ? { from, to } : null),
      markets: markets.length ? knownSet(markets) : unknownSet(),
      transmissions: transmissionSet(snapshot.transmission ?? options.transmission),
      abs: absSet(snapshot.abs ?? options.abs),
      equipment: equipmentValues(snapshot.equipment ?? options.equipment)
    },
    sourcePriorityPolicyId: options.sourcePriorityPolicyId || "tier-ab-practical-marginal-v1",
    serviceCoreBaseline: { verified: options.verified ?? snapshot.evidenceCount ?? snapshot.before ?? 0, total: 44 },
    gapPlanRef: null,
    knownSourceRefs: options.knownSourceRefs || [],
    knownProspectRefs: options.knownProspectRefs || [],
    researchHistoryRefs: options.researchHistoryRefs || [],
    riskFlags: options.riskFlags || [],
    state: options.state || "RESEARCH-MORE"
  });
}

function publicationFromLegacy(record, relationship) {
  const raw = record.documentCode || record.publicationId || "UNKNOWN";
  const codes = String(raw).split(/\s*\/\s*/).filter(Boolean);
  return {
    relationship: relationship || (codes.length === 1 ? "SINGLE" : "RELATIONSHIP-UNRESOLVED"),
    identifiers: codes.map((value, index) => ({ value, namespace: record.publisher || record.manufacturer || "UNKNOWN", region: record.markets?.[index] || "UNKNOWN", type: "publication-code", proofState: record.authenticationState === "AUTHENTICATED" || /official/i.test(record.authenticationState || "") ? "AUTHENTICATED" : "CORROBORATED" }))
  };
}

function fromLegacySourceProspect(record, target, options = {}) {
  const snapshot = JSON.parse(JSON.stringify(record));
  const gate = snapshot.gate || {};
  const markets = options.markets || snapshot.markets || [];
  const sourceYears = options.years || snapshot.years;
  const scope = {
    schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
    model: gate.modelKnown === true ? knownSet([target.catalogVariantKey]) : unknownSet(),
    generation: gate.modelKnown === true && target.scope.generation.state === "KNOWN" ? knownSet(target.scope.generation.values) : unknownSet(),
    years: gate.yearKnown === true ? years(sourceYears) : years(options.provenYears),
    markets: gate.marketKnown === true && markets.length ? knownSet(markets) : unknownSet(),
    transmissions: options.transmissions ? knownSet(options.transmissions) : /manual/.test(snapshot.transmissionStatus || "") && !/not independently|likely/i.test(snapshot.transmissionStatus || "") ? knownSet(["manual"]) : unknownSet(),
    abs: options.absValues ? knownSet(options.absValues) : unknownSet(),
    equipment: options.equipmentValues ? knownSet(options.equipmentValues) : unknownSet()
  };
  const access = accessFromLegacy(snapshot.access);
  return contracts.validateSourceProspect({
    schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
    id: snapshot.id,
    targetId: target.id,
    documentClass: snapshot.documentClass || "UNKNOWN",
    authority: { name: snapshot.publisher || snapshot.manufacturer || "UNKNOWN", state: gate.authorityKnown === true ? "KNOWN" : "UNKNOWN" },
    documentIdentity: { title: snapshot.title || "", state: gate.documentIdentityKnown === true ? "KNOWN" : gate.documentIdentityKnown === false ? "PARTIAL" : "UNKNOWN" },
    publication: publicationFromLegacy(snapshot, options.identifierRelationship),
    officialLocations: hostPath(snapshot.officialHost),
    sourceTier: snapshot.sourceTier || "A",
    authenticationState: snapshot.classification === "REGISTERED-NOT-REAUTHENTICATED" ? "REGISTERED-NOT-REAUTHENTICATED" : snapshot.classification === "REJECTED-MISMATCH" ? "REJECTED-MISMATCH" : gate.authorityKnown ? "PARTIAL" : "UNKNOWN",
    accessibility: { metadata: options.metadataAccessibility || (snapshot.officialHost ? "ACCESSIBLE-OFFICIAL-HTML" : "UNKNOWN"), fullContent: access },
    applicability: scope,
    exhaustionState: gate.notExhausted === false ? "EXHAUSTED" : "ACTIVE",
    priorAttemptRefs: options.priorAttemptRefs || [],
    expectedMarginalGapClass: snapshot.expectedMarginalPracticalGapClass || "UNKNOWN",
    readinessClassification: snapshot.classification,
    blockers: snapshot.blockers || [],
    nextAction: snapshot.nextAction || ""
  });
}

function fromLegacyAcquiredSource(record, target, options = {}) {
  const snapshot = JSON.parse(JSON.stringify(record));
  const appliesToTarget = Array.isArray(snapshot.targets) && snapshot.targets.includes(target.catalogVariantKey);
  const sourceYears = snapshot.years || (snapshot.publicationDate ? { from: snapshot.publicationDate, to: snapshot.publicationDate } : null);
  const fullAccess = /403/.test(snapshot.accessResult || "") ? "ACCESS-BLOCKED-403" : accessFromLegacy(snapshot.disposition || snapshot.accessState);
  const authenticated = /official|authenticated/i.test(snapshot.authenticationState || "");
  return contracts.validateSourceProspect({
    schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
    id: options.id || `prospect.${snapshot.id}`,
    targetId: target.id,
    documentClass: snapshot.sourceClass || snapshot.type || "UNKNOWN",
    authority: { name: snapshot.publisher || "UNKNOWN", state: authenticated ? "KNOWN" : "UNKNOWN" },
    documentIdentity: { title: snapshot.title || "", state: authenticated ? "KNOWN" : "PARTIAL" },
    publication: publicationFromLegacy(snapshot, options.identifierRelationship),
    officialLocations: hostPath(snapshot.url || snapshot.officialHost),
    sourceTier: snapshot.tier || "A",
    authenticationState: snapshot.disposition === "wrong-applicability" ? "REJECTED-MISMATCH" : authenticated ? "AUTHENTICATED" : "PARTIAL",
    accessibility: { metadata: snapshot.officialHost || snapshot.url ? "ACCESSIBLE-OFFICIAL-HTML" : "UNKNOWN", fullContent: fullAccess },
    applicability: {
      schemaVersion: contracts.FACTORY_CONTRACT_VERSION,
      model: appliesToTarget ? knownSet([target.catalogVariantKey]) : unknownSet(),
      generation: appliesToTarget && target.scope.generation.state === "KNOWN" ? knownSet(target.scope.generation.values) : unknownSet(),
      years: years(sourceYears),
      markets: snapshot.markets?.length ? knownSet(snapshot.markets) : unknownSet(),
      transmissions: transmissionSet(snapshot.transmission),
      abs: absSet(snapshot.abs),
      equipment: equipmentValues(snapshot.equipment)
    },
    exhaustionState: snapshot.stopCondition ? "LOW-MARGINAL-YIELD" : "ACTIVE",
    priorAttemptRefs: [],
    expectedMarginalGapClass: options.expectedMarginalGapClass || "UNKNOWN",
    readinessClassification: snapshot.disposition === "wrong-applicability" ? "REJECTED-MISMATCH" : snapshot.stopCondition ? "EXHAUSTED / LOW-MARGINAL-YIELD" : "EXECUTION-READY",
    blockers: snapshot.stopCondition ? [snapshot.stopCondition] : [],
    nextAction: snapshot.stopCondition || ""
  });
}

module.exports = Object.freeze({ fromLegacyResearchTarget, fromLegacySourceProspect, fromLegacyAcquiredSource });
