// NON-PRODUCTION deterministic checkpoint and resume verification.
"use strict";

const crypto = require("node:crypto");
const foundation = require("./contracts.js");
const contracts = require("./orchestrator-contracts.js");
const ids = require("./ids.js");
const json = require("./json.js");
const { reduceEvents } = require("./reducer.js");

const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");

function createCheckpoint(events) {
  const snapshot = reduceEvents(events);
  const eventDigest = digest(events);
  return contracts.validateCheckpoint({ schemaVersion: contracts.ORCHESTRATOR_SCHEMA_VERSION, foundationContractVersion: foundation.FACTORY_CONTRACT_VERSION, id: ids.checkpointId({ batchId: snapshot.batch.id, eventCount: events.length, eventDigest }), batchId: snapshot.batch.id, eventCount: events.length, eventDigest, snapshotDigest: digest(snapshot), snapshot });
}

function resumeFromCheckpoint(checkpointInput, events) {
  const checkpoint = contracts.validateCheckpoint(checkpointInput);
  if (!Array.isArray(events) || events.length < checkpoint.eventCount) throw new Error("checkpoint event history is incomplete");
  const prefix = events.slice(0, checkpoint.eventCount);
  if (digest(prefix) !== checkpoint.eventDigest) throw new Error("checkpoint event history is incompatible");
  const replayed = reduceEvents(prefix);
  if (digest(replayed) !== checkpoint.snapshotDigest || json.canonicalSerialize(replayed) !== json.canonicalSerialize(checkpoint.snapshot)) throw new Error("checkpoint snapshot replay verification failed");
  const resumed = reduceEvents(events);
  if (resumed.batch.id !== checkpoint.batchId) throw new Error("checkpoint batch identity is incompatible");
  return resumed;
}

module.exports = Object.freeze({ createCheckpoint, resumeFromCheckpoint, digest });
