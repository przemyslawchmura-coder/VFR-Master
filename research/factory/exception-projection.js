// NON-PRODUCTION deterministic read-only grouped exception projection.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");
const routing = require("./routing.js");

const EXCEPTION_PROJECTION_SCHEMA_VERSION = 1;
const fields = new Set(["schemaVersion", "id", "groups", "records", "externalSideEffects"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const withoutId = value => { const { id, ...rest } = value; return rest; };
const projectionId = value => `exception-projection.${digest(withoutId(value)).slice(0, 24)}`;
const routeRank = route => ({ YELLOW: 0, RED: 1 })[route];
const targetKey = record => record.targetIdentity && record.targetIdentity.id ? record.targetIdentity.id : "";

function project(routed) {
  assert(routed && Array.isArray(routed.routes), "Exception projection requires routing results");
  const records = routed.routes.filter(item => item.route !== "GREEN").map(item => ({ route: item.route, reason: item.reasonCodes[0], recordId: item.id, targetIdentity: item.targetIdentity, canonicalFieldId: item.canonicalFieldId, sourceIdentity: item.sourceIdentity, sourceLocation: item.sourceProvenance ? item.sourceProvenance.sourceLocation : null, rawValue: item.rawValue, rawUnit: item.rawUnit, applicability: item.applicability, condition: item.condition, failedInvariants: item.invariants.failed, nextLegalAction: item.nextLegalAction, upstreamIdentity: item.upstreamIdentity, upstreamDigest: item.upstreamDigest }));
  records.sort((a, b) => routeRank(a.route) - routeRank(b.route) || a.reason.localeCompare(b.reason) || targetKey(a).localeCompare(targetKey(b)) || a.recordId.localeCompare(b.recordId));
  const groups = [];
  const groupsByKey = new Map();
  records.forEach(record => {
    const key = `${record.route}|${record.reason}|${targetKey(record)}|${record.canonicalFieldId || ""}`;
    let group = groupsByKey.get(key);
    if (!group) { group = { groupId: `exception-group.${digest({ key }).slice(0, 24)}`, route: record.route, reason: record.reason, targetIdentity: record.targetIdentity, canonicalFieldId: record.canonicalFieldId, recordIds: [] }; groupsByKey.set(key, group); groups.push(group); }
    group.recordIds.push(record.recordId);
  });
  const result = { schemaVersion: EXCEPTION_PROJECTION_SCHEMA_VERSION, id: "placeholder", groups, records, externalSideEffects: false };
  result.id = projectionId(result);
  json.assertJsonSafe(result);
  assert(result.id === projectionId(result), "Exception projection.id is unstable");
  Object.keys(result).forEach(field => assert(fields.has(field), `Exception projection.${field} is unsupported`));
  return json.immutableClone(result);
}

module.exports = Object.freeze({ EXCEPTION_PROJECTION_SCHEMA_VERSION, project });
