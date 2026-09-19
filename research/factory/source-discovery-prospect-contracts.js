// NON-PRODUCTION source-discovery/prospect-registration foundation.
// Discovery is not authentication, applicability proof or acquisition.
"use strict";

const crypto = require("node:crypto");
const sourceContracts = require("./contracts.js");

const SCHEMA_VERSION = "revlog-source-discovery-prospect/v1";
const STATES = Object.freeze(["UNRESOLVED", "DISCOVERED", "AUTHENTICATED", "APPLICABILITY-PARTIAL", "EXECUTION-READY", "BLOCKED", "EXHAUSTED"]);
const KNOWLEDGE_STATES = Object.freeze(["KNOWN", "UNKNOWN", "PARTIAL"]);
const AUTHENTICATION_STATES = Object.freeze(["UNKNOWN", "PARTIAL", "AUTHENTICATED", "REJECTED-MISMATCH"]);
const ACCESS_STATES = Object.freeze(["UNKNOWN", "ACCESSIBLE-OFFICIAL", "ACCESS-BLOCKED", "ACCESS-BROKEN"]);
const EXHAUSTION_STATES = Object.freeze(["ACTIVE", "EXHAUSTED"]);

const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const clone = value => JSON.parse(JSON.stringify(value));
const stable = value => Array.isArray(value)
  ? `[${value.map(stable).join(",")}]`
  : value && typeof value === "object"
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`
    : JSON.stringify(value);
const digest = value => crypto.createHash("sha256").update(stable(value)).digest("hex").slice(0, 24);
const sourceDiscoveryCandidateId = value => `source-discovery-prospect.${digest(value)}`;
const isId = value => typeof value === "string" && /^[a-z0-9][a-z0-9._:/-]*$/i.test(value);

function knowledge(value, label, valuePredicate = item => typeof item === "string" && item.length > 0) {
  assert(value && typeof value === "object" && KNOWLEDGE_STATES.includes(value.state), `${label} is invalid`);
  const item = value.value === undefined ? null : value.value;
  if (value.state === "KNOWN") assert(valuePredicate(item), `${label}.value is required when KNOWN`);
  if (value.state === "UNKNOWN") assert(item === null, `${label}.value must be null when UNKNOWN`);
  return { state: value.state, value: item };
}

function validateApplicability(input) {
  assert(input && typeof input === "object", "applicability is required");
  const result = {
    model: knowledge(input.model, "applicability.model"),
    year: knowledge(input.year, "applicability.year", value => Number.isInteger(value)),
    market: knowledge(input.market, "applicability.market"),
    abs: knowledge(input.abs, "applicability.abs", value => value === true || value === false),
    transmission: knowledge(input.transmission, "applicability.transmission", value => sourceContracts.TRANSMISSIONS.includes(value)),
    equipment: knowledge(input.equipment, "applicability.equipment")
  };
  const unresolvedDimensions = Object.keys(result).filter(key => result[key].state !== "KNOWN").sort();
  if (input.unresolvedDimensions !== undefined) {
    assert(Array.isArray(input.unresolvedDimensions) && input.unresolvedDimensions.every(item => Object.prototype.hasOwnProperty.call(result, item)), "applicability.unresolvedDimensions is invalid");
    assert(stable([...input.unresolvedDimensions].sort()) === stable(unresolvedDimensions), "applicability unresolved dimensions do not match knowledge states");
  }
  return Object.freeze({ ...result, unresolvedDimensions: Object.freeze(unresolvedDimensions) });
}

function validateRoute(input) {
  assert(input && typeof input === "object", "source route is required");
  assert(KNOWLEDGE_STATES.includes(input.state), "source route state is invalid");
  if (input.state === "KNOWN") {
    assert(typeof input.officialUrl === "string" && /^https:\/\//.test(input.officialUrl), "known source route must be official HTTPS");
    const url = new URL(input.officialUrl);
    assert(url.hostname.length > 0 && url.pathname.length > 0, "known source route is incomplete");
    return Object.freeze({ state: input.state, officialUrl: url.toString(), host: url.host, path: url.pathname });
  }
  assert(input.officialUrl === null || input.officialUrl === undefined, "unknown source route cannot contain a URL");
  return Object.freeze({ state: input.state, officialUrl: null, host: null, path: null });
}

function validateCandidate(input) {
  assert(input && input.schemaVersion === SCHEMA_VERSION, `source-discovery schemaVersion must equal ${SCHEMA_VERSION}`);
  assert(typeof input.targetId === "string" && isId(input.targetId), "source-discovery targetId is invalid");
  assert(typeof input.catalogVariantKey === "string" && isId(input.catalogVariantKey), "source-discovery catalogVariantKey is invalid");
  assert(Number.isInteger(input.year) && input.year >= 1900 && input.year <= 2200, "source-discovery year is invalid");
  assert(input.identity && typeof input.identity === "object", "source-discovery identity is required");
  ["manufacturer", "model", "generation"].forEach(key => assert(typeof input.identity[key] === "string" && input.identity[key].length > 0, `source-discovery identity.${key} is required`));
  const route = validateRoute(input.sourceRoute);
  const authority = knowledge(input.authority, "authority");
  const publication = knowledge(input.publication, "publication");
  const applicability = validateApplicability(input.applicability);
  assert(AUTHENTICATION_STATES.includes(input.authenticationState), "authenticationState is invalid");
  assert(ACCESS_STATES.includes(input.accessState), "accessState is invalid");
  assert(EXHAUSTION_STATES.includes(input.exhaustionState), "exhaustionState is invalid");
  assert(Array.isArray(input.provenance) && input.provenance.every(item => typeof item === "string" && item.length > 0), "provenance must be a string array");
  assert(Array.isArray(input.blockers) && input.blockers.every(item => typeof item === "string" && item.length > 0), "blockers must be a string array");
  assert(typeof input.documentClass === "string" && input.documentClass.length > 0, "documentClass is required");
  const body = { schemaVersion: SCHEMA_VERSION, targetId: input.targetId, catalogVariantKey: input.catalogVariantKey, year: input.year, identity: clone(input.identity), sourceRoute: route, authority, publication, documentClass: input.documentClass, authenticationState: input.authenticationState, accessState: input.accessState, exhaustionState: input.exhaustionState, applicability, provenance: [...new Set(input.provenance)].sort(), blockers: [...new Set(input.blockers)].sort() };
  const expectedId = sourceDiscoveryCandidateId(body);
  if (input.id !== undefined) assert(input.id === expectedId, "source-discovery id does not match candidate semantics");
  const state = deriveState(body);
  if (input.state !== undefined) assert(input.state === state, `source-discovery state must be ${state}`);
  return Object.freeze({ ...body, id: expectedId, state });
}

function deriveState(candidate) {
  if (candidate.exhaustionState === "EXHAUSTED") return "EXHAUSTED";
  if (candidate.authenticationState === "REJECTED-MISMATCH" || candidate.accessState === "ACCESS-BLOCKED" || candidate.accessState === "ACCESS-BROKEN") return "BLOCKED";
  if (candidate.authenticationState === "AUTHENTICATED" && candidate.sourceRoute.state === "KNOWN" && candidate.authority.state === "KNOWN" && candidate.publication.state === "KNOWN" && candidate.applicability.unresolvedDimensions.length === 0 && candidate.accessState === "ACCESSIBLE-OFFICIAL") return "EXECUTION-READY";
  if (candidate.authenticationState === "AUTHENTICATED") return "APPLICABILITY-PARTIAL";
  if (candidate.sourceRoute.state === "KNOWN" || candidate.publication.state === "KNOWN") return "DISCOVERED";
  return "UNRESOLVED";
}

function candidateFromQueueTarget(target, sourceRoute = {}) {
  assert(target && typeof target.targetId === "string" && typeof target.catalogVariantKey === "string", "queue target identity is required");
  assert(Number.isInteger(target.year), "queue target year is required");
  const applicability = target.applicability || {};
  return validateCandidate({
    schemaVersion: SCHEMA_VERSION, targetId: target.targetId, catalogVariantKey: target.catalogVariantKey, year: target.year,
    identity: { manufacturer: target.manufacturer, model: target.family, generation: target.generation },
    sourceRoute: { state: sourceRoute.state || "UNKNOWN", officialUrl: sourceRoute.officialUrl || null },
    authority: { state: "UNKNOWN", value: null }, publication: { state: "UNKNOWN", value: null }, documentClass: "UNKNOWN",
    authenticationState: "UNKNOWN", accessState: "UNKNOWN", exhaustionState: "ACTIVE",
    applicability: { model: { state: "KNOWN", value: target.family }, year: { state: "KNOWN", value: target.year }, market: { state: applicability.market ? "KNOWN" : "UNKNOWN", value: applicability.market || null }, abs: { state: applicability.abs === true || applicability.abs === false ? "KNOWN" : "UNKNOWN", value: applicability.abs ?? null }, transmission: { state: applicability.transmission ? "KNOWN" : "UNKNOWN", value: applicability.transmission || null }, equipment: { state: applicability.equipment ? "KNOWN" : "UNKNOWN", value: applicability.equipment || null } },
    provenance: ["catalogue-coverage-queue"], blockers: ["SOURCE-IDENTITY-NOT-REGISTERED"]
  });
}

function toExistingSourceProspect(candidate) {
  const item = validateCandidate(candidate);
  assert(item.state === "EXECUTION-READY", "source-discovery candidate is not execution-ready");
  const publication = item.publication.value;
  const route = item.sourceRoute;
  const applicability = item.applicability;
  const prospect = sourceContracts.validateSourceProspect({
    schemaVersion: 1, id: `prospect.${item.id}`, targetId: item.targetId, documentClass: item.documentClass,
    authority: { name: item.authority.value, state: "KNOWN" }, documentIdentity: { title: publication, state: "KNOWN" },
    publication: { relationship: "SINGLE", identifiers: [{ value: publication, namespace: item.authority.value, proofState: "AUTHENTICATED" }] },
    officialLocations: [{ host: route.host, path: route.path }], sourceTier: "A", authenticationState: "AUTHENTICATED",
    accessibility: { metadata: "ACCESSIBLE-OFFICIAL", fullContent: "ACCESSIBLE-OFFICIAL" }, applicability: { schemaVersion: 1, model: { state: "KNOWN", values: [item.catalogVariantKey] }, generation: { state: "KNOWN", values: [item.identity.generation] }, years: { kind: "EXACT", from: item.year, to: item.year }, markets: { state: "KNOWN", values: [applicability.market.value] }, transmissions: { state: "KNOWN", values: [applicability.transmission.value] }, abs: { state: "KNOWN", values: [applicability.abs.value] }, equipment: { state: "KNOWN", values: [applicability.equipment.value] } },
    exhaustionState: "ACTIVE", priorAttemptRefs: [], expectedMarginalGapClass: "UNKNOWN", readinessClassification: "EXECUTION-READY", blockers: [], nextAction: "bounded acquisition"
  });
  return Object.freeze(prospect);
}

function registerCandidates(inputs) {
  assert(Array.isArray(inputs) && inputs.length > 0, "source-discovery candidates are required");
  const validated = inputs.map(validateCandidate);
  const byId = new Map();
  const byRoute = new Map();
  validated.forEach(candidate => {
    if (byId.has(candidate.id)) {
      assert(stable(byId.get(candidate.id)) === stable(candidate), "duplicate source-discovery candidate conflicts with existing identity");
      return;
    }
    const routeKey = `${candidate.targetId}|${candidate.catalogVariantKey}|${candidate.year}|${candidate.sourceRoute.officialUrl || "UNKNOWN-ROUTE"}`;
    const prior = byRoute.get(routeKey);
    if (prior) {
      assert(stable({ identity: prior.identity, authority: prior.authority, publication: prior.publication }) === stable({ identity: candidate.identity, authority: candidate.authority, publication: candidate.publication }), "conflicting source-discovery candidates remain unresolved");
    }
    byId.set(candidate.id, candidate);
    byRoute.set(routeKey, candidate);
  });
  return Object.freeze([...byId.values()].sort((a, b) => a.id.localeCompare(b.id)));
}

module.exports = Object.freeze({ SCHEMA_VERSION, STATES, KNOWLEDGE_STATES, AUTHENTICATION_STATES, ACCESS_STATES, EXHAUSTION_STATES, sourceDiscoveryCandidateId, validateCandidate, deriveState, candidateFromQueueTarget, registerCandidates, toExistingSourceProspect });
