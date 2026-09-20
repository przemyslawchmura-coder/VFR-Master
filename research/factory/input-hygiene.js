// NON-PRODUCTION deterministic input hygiene for bounded batch execution.
"use strict";

const crypto = require("node:crypto");
const json = require("./json.js");

const INPUT_HYGIENE_SCHEMA_VERSION = 1;
const STATUSES = Object.freeze(["EXACT-DUPLICATE", "CONFLICTING-DUPLICATE", "DISTINCT-CONDITIONAL-RECORD", "DISTINCT-APPLICABILITY-RECORD", "VALID-UNIQUE-RECORD", "MALFORMED-INPUT"]);
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function identityPayload(item) {
  return { canonicalFieldId: item && item.input ? item.input.canonicalFieldId : null, targetIdentity: item && item.input ? item.input.targetIdentity || null : null, sourceIdentity: item && item.input ? item.input.sourceIdentity || null : null, provenance: item && item.input ? item.input.provenance || null : null, applicability: item && item.input ? item.input.applicability || null : null, condition: item && item.input && Object.prototype.hasOwnProperty.call(item.input, "condition") ? item.input.condition : null, rawValue: item && item.input && Object.prototype.hasOwnProperty.call(item.input, "rawValue") ? item.input.rawValue : null, rawUnit: item && item.input && Object.prototype.hasOwnProperty.call(item.input, "rawUnit") ? item.input.rawUnit : null, ruleId: item && item.rule ? item.rule.id : null };
}
function basePayload(item) { const value = identityPayload(item); delete value.rawValue; delete value.rawUnit; delete value.condition; delete value.applicability; return value; }
function conditionPayload(item) { const value = identityPayload(item); return { ...basePayload(item), condition: value.condition }; }
function applicabilityPayload(item) { const value = identityPayload(item); return { ...basePayload(item), applicability: value.applicability }; }
function contextKey(item) { const value = identityPayload(item); return digest({ ...basePayload(item), condition: value.condition, applicability: value.applicability }); }
function semanticKey(item) { return digest(identityPayload(item)); }
function baseKey(item) { return digest(basePayload(item)); }
function malformedReason(item) {
  if (!item || typeof item !== "object" || !item.input || typeof item.input !== "object" || !item.rule) return "input record or rule is missing";
  if (typeof item.input.canonicalFieldId !== "string" || item.input.canonicalFieldId.length === 0) return "canonical field identity is missing";
  if (!item.input.sourceIdentity) return "source identity is missing";
  if (!item.input.provenance || !item.input.provenance.sourceLocation) return "source location provenance is missing";
  if (!item.input.applicability || typeof item.input.applicability !== "object") return "target applicability is missing";
  if (!Object.prototype.hasOwnProperty.call(item.input, "rawValue") || item.input.rawValue === null || item.input.rawValue === undefined || item.input.rawValue === "") return "raw value is missing";
  return null;
}
function analyzeBatch(items) {
  assert(Array.isArray(items) && items.length > 0, "Input hygiene batch is required");
  const entries = items.map((item, index) => { const malformed = malformedReason(item); return { item, index, semantic: semanticKey(item), base: baseKey(item), malformed }; });
  const semanticCounts = new Map(); const baseCounts = new Map(); const contextCounts = new Map();
  entries.forEach(entry => { entry.context = contextKey(entry.item); semanticCounts.set(entry.semantic, (semanticCounts.get(entry.semantic) || 0) + 1); baseCounts.set(entry.base, (baseCounts.get(entry.base) || 0) + 1); if (!entry.malformed) contextCounts.set(entry.context, (contextCounts.get(entry.context) || 0) + 1); });
  const result = entries.map(entry => {
    let status; let reason;
    if (entry.malformed) { status = "MALFORMED-INPUT"; reason = entry.malformed; }
    else if (semanticCounts.get(entry.semantic) > 1) { status = "EXACT-DUPLICATE"; reason = "semantic input occurs more than once"; }
    else if (contextCounts.get(entry.context) > 1) { status = "CONFLICTING-DUPLICATE"; reason = "same logical target/field/source/context has differing semantic content"; }
    else {
      const sameBase = entries.filter(candidate => candidate.base === entry.base);
      const conditionalDistinct = sameBase.some(candidate => json.canonicalSerialize(conditionPayload(candidate.item)) !== json.canonicalSerialize(conditionPayload(entry.item)));
      const applicabilityDistinct = sameBase.some(candidate => json.canonicalSerialize(applicabilityPayload(candidate.item)) !== json.canonicalSerialize(applicabilityPayload(entry.item)));
      status = conditionalDistinct ? "DISTINCT-CONDITIONAL-RECORD" : applicabilityDistinct ? "DISTINCT-APPLICABILITY-RECORD" : "VALID-UNIQUE-RECORD";
      reason = status === "VALID-UNIQUE-RECORD" ? "unique semantic input" : status === "DISTINCT-CONDITIONAL-RECORD" ? "condition distinguishes the record" : "applicability distinguishes the record";
    }
    const occurrence = entries.filter(candidate => candidate.semantic === entry.semantic).indexOf(entry) + 1;
    return { schemaVersion: INPUT_HYGIENE_SCHEMA_VERSION, id: `input-hygiene.${digest({ semantic: entry.semantic, status, occurrence }).slice(0, 24)}`, occurrence, inputIdentity: { id: entry.item && entry.item.input && typeof entry.item.input.id === "string" ? entry.item.input.id : null, digest: entry.semantic }, semanticKey: entry.semantic, baseKey: entry.base, status, reason, duplicateCount: semanticCounts.get(entry.semantic), conflictCount: baseCounts.get(entry.base), externalSideEffects: false };
  }).sort((a, b) => a.id.localeCompare(b.id));
  return json.immutableClone({ schemaVersion: INPUT_HYGIENE_SCHEMA_VERSION, id: `input-hygiene-batch.${digest(result).slice(0, 24)}`, records: result, externalSideEffects: false });
}
module.exports = Object.freeze({ INPUT_HYGIENE_SCHEMA_VERSION, STATUSES, semanticKey, baseKey, analyzeBatch });
