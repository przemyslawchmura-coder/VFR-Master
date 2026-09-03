// Generic production-compatible Rider Service Core record contracts.
// This module defines representation only; it does not create profile data.
"use strict";

const crypto = require("node:crypto");
const json = require("../../research/factory/json.js");

const SCHEMA_VERSION = "revlog-rider-service-core-record/v1";
const RECORD_TYPES = Object.freeze(["scalar", "structured", "repeating"]);
const STRUCTURED_TYPES = Object.freeze(["maintenance", "fuse", "lighting", "practical-torque", "consumable-reference", "tire-pressure", "generic-structured"]);
const ACTIONS = Object.freeze(["INSPECT", "REPLACE", "ADJUST", "CLEAN", "LUBRICATE"]);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };
const semanticId = input => `service-core-record.${crypto.createHash("sha256").update(json.canonicalSerialize(input)).digest("hex").slice(0, 24)}`;

function validateProvenance(value) {
  assert(value && typeof value === "object" && !Array.isArray(value), "Rider Service Core provenance is required");
  ["sourceId", "documentId", "sourceLocation"].forEach(key => assert(Object.prototype.hasOwnProperty.call(value, key), `Rider Service Core provenance.${key} is required`));
  return value;
}

function validateApplicability(value) {
  assert(value && typeof value === "object" && !Array.isArray(value), "Rider Service Core applicability is required");
  ["modelYear", "market", "equipment", "abs", "transmission"].forEach(key => assert(Object.prototype.hasOwnProperty.call(value, key), `Rider Service Core applicability.${key} is required`));
  return value;
}

function validateStructuredDetails(type, details) {
  assert(STRUCTURED_TYPES.includes(type), "Rider Service Core structured type is invalid");
  assert(details && typeof details === "object" && !Array.isArray(details), `Rider Service Core ${type} details are required`);
  assert(typeof details.sourceText === "string" && details.sourceText.length > 0, `Rider Service Core ${type}.sourceText is required`);
  if (type === "maintenance" && details.action !== null) assert(ACTIONS.includes(details.action), "Rider Service Core maintenance action is invalid");
  if (type === "fuse") assert(details.association && typeof details.association === "object", "Rider Service Core fuse association is required");
  if (type === "lighting") assert(details.technology === null || typeof details.technology === "string", "Rider Service Core lighting technology is invalid");
  return details;
}

function validateRecord(input) {
  json.assertJsonSafe(input);
  assert(input && input.schemaVersion === SCHEMA_VERSION, "Rider Service Core record schemaVersion is invalid");
  assert(typeof input.id === "string" && /^service-core-record\.[a-f0-9]{24}$/.test(input.id), "Rider Service Core record id is invalid");
  assert(typeof input.canonicalFieldId === "string" && input.canonicalFieldId.length > 0, "Rider Service Core canonicalFieldId is required");
  assert(RECORD_TYPES.includes(input.recordType), "Rider Service Core recordType is invalid");
  assert(input.value && typeof input.value === "object" && !Array.isArray(input.value), "Rider Service Core value is required");
  assert(Object.prototype.hasOwnProperty.call(input.value, "rawValue"), "Rider Service Core rawValue is required");
  assert(input.value.rawUnit === null || typeof input.value.rawUnit === "string", "Rider Service Core rawUnit is invalid");
  validateApplicability(input.applicability);
  validateProvenance(input.provenance);
  if (input.recordType !== "scalar") validateStructuredDetails(input.structureType, input.details);
  assert(input.id === semanticId({ canonicalFieldId: input.canonicalFieldId, recordType: input.recordType, structureType: input.structureType || null, value: input.value, details: input.details || null, applicability: input.applicability, provenance: input.provenance }), "Rider Service Core record id is unstable");
  return json.immutableClone(input);
}

function createRecord({ canonicalFieldId, recordType, structureType = null, rawValue, rawUnit = null, details = null, applicability, provenance }) {
  const input = { schemaVersion: SCHEMA_VERSION, id: "placeholder", canonicalFieldId, recordType, structureType, value: { rawValue, rawUnit }, details, applicability, provenance };
  input.id = semanticId({ canonicalFieldId, recordType, structureType, value: input.value, details, applicability, provenance });
  return validateRecord(input);
}

module.exports = Object.freeze({ SCHEMA_VERSION, RECORD_TYPES, STRUCTURED_TYPES, ACTIONS, semanticId, validateRecord, createRecord });
