// TRUSTED NON-PRODUCTION SERVER-SIDE FACTORY ADAPTER.
// It composes the existing Technical Research Factory with an explicitly
// supplied repository-backed deterministic result; it performs no acquisition.
"use strict";

const factory = require("../research/factory/index.js");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const json = require("../research/factory/json.js");

const clone = value => json.immutableClone(value);
const assert = (condition, message) => { if (!condition) throw new TypeError(message); };

function createRepositoryBackedFactoryExecutor({ context, resultResolver }) {
  assert(context && context.status === "ready" && context.context, "ready Factory context is required");
  assert(typeof resultResolver === "function", "repository-backed result resolver is required");

  return Object.freeze(async ({ demand, execution, checkpoint }) => {
    const canonicalDemand = reusable.validateReusableDemand(demand);
    const run = factory.executeFactoryBridge({ context, demand: canonicalDemand });
    const source = resultResolver({ demand: clone(canonicalDemand), factoryRun: run, execution: clone(execution), checkpoint: clone(checkpoint) });
    assert(source && typeof source === "object", "Factory result is required");
    assert(source.demandId === canonicalDemand.id, "Factory result demand identity does not match execution");
    assert(source.status === "REUSABLE", "Factory result is not eligible reusable knowledge");
    assert(source.value !== null && source.value !== undefined, "Factory result value is required");
    assert(source.rawValue !== null && source.rawValue !== undefined, "Factory raw value is required");
    assert(source.provenance && typeof source.provenance === "object", "Factory provenance is required");

    return Object.freeze({
      outcome: "SUCCESS",
      result: {
        demandId: canonicalDemand.id,
        status: source.status,
        value: clone(source.value),
        rawValue: clone(source.rawValue),
        provenance: clone(source.provenance),
        lineage: {
          ...(source.lineage === undefined ? {} : clone(source.lineage)),
          factoryBatchId: run.execution.snapshot.batch.id,
          sourceWorkItemId: run.execution.snapshot.sourceWorkItems[0].id,
          acquisitionResultId: run.execution.result.attemptId,
          boundary: "accepted-pre-evidence"
        }
      },
      checkpoint: {
        ...clone(checkpoint),
        phase: "FACTORY-COMPLETED",
        factoryBatchId: run.execution.snapshot.batch.id,
        sourceWorkItemId: run.execution.snapshot.sourceWorkItems[0].id,
        acquisitionResultId: run.execution.result.attemptId,
        productionMaterialized: false,
        externalAcquisition: false
      }
    });
  });
}

module.exports = Object.freeze({ createRepositoryBackedFactoryExecutor });
