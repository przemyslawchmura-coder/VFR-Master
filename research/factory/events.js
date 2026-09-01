// NON-PRODUCTION immutable append-only research events.
"use strict";

const ids = require("./ids.js");
const contracts = require("./orchestrator-contracts.js");
const json = require("./json.js");

function createEvent({ batchId, sequence, type, payload = {} }) {
  json.assertJsonSafe(payload);
  if (!contracts.EVENT_TYPES.includes(type)) throw new TypeError(`unsupported ResearchEvent type: ${type}`);
  const canonicalPayload = json.canonicalize(payload);
  return contracts.validateResearchEvent({
    schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION,
    id: ids.eventId({ batchId, sequence, type, payload: canonicalPayload }),
    batchId,
    sequence,
    type,
    payload: canonicalPayload
  });
}

function appendEvent(events, input) {
  if (!Array.isArray(events)) throw new TypeError("events must be an array");
  const event = createEvent({ ...input, sequence: events.length + 1 });
  return Object.freeze([...events, event]);
}

module.exports = Object.freeze({ createEvent, appendEvent });
