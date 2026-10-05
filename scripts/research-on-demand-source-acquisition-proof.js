// NON-PRODUCTION local proof. Default is read-only preflight; --acquire uses
// exactly one official public PDF and temporary local custody, no database.
"use strict";
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const factory = require("../research/factory/index.js");
const reusable = require("../research/factory/reusable-knowledge-contracts.js");
const { route } = require("../research/data/research-on-demand-honda-route.js");
const { createFileArtifactStore } = require("../server/research-artifact-store.js");
const { createSourceAcquisitionExecutor } = require("../server/research-on-demand-acquisition.js");
const { createTrustedAsyncExecutionService, createLocalExecutionStore } = require("../server/research-on-demand-execution.js");

async function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 1 || args[0] !== "--acquire")) throw new TypeError("only --acquire is supported");
  const report = { schemaVersion: "rod-source-acquisition-proof/v1", mode: args.length ? "LOCAL-PUBLIC-SOURCE-PROOF" : "PREFLIGHT", routeId: route.id, readiness: factory.evaluateReadiness(route.target, route.prospect), externalAcquisition: false, liveSupabaseChanged: false, productionChanged: false, reusableKnowledgeCreated: false };
  if (!args.length) return report;
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "revlog-rod-source-proof-"));
  try {
    const artifactStore = createFileArtifactStore({ directory });
    const service = createTrustedAsyncExecutionService({ store: createLocalExecutionStore(), factoryExecutor: createSourceAcquisitionExecutor({ routes: [route], artifactStore }) });
    const demand = reusable.validateReusableDemand({ catalogVariantKey: route.target.catalogVariantKey, canonicalFieldId: route.fieldIds[0], operation: route.operation, applicability: route.target.scope, conditions: route.conditions, requiredApplicabilityDimensions: ["model", "generation", "year", "market", "abs", "transmission", "equipment"] });
    const created = service.ensure({ demand });
    const input = { demand, executionId: created.identity.executionId, workerId: "rod-source-local-proof" };
    const result = await service.runOnce(input);
    report.status = result.record.status;
    report.failure = result.record.lastFailure;
    report.checkpoint = result.record.checkpoint;
    report.externalAcquisition = report.checkpoint.phase === "SOURCE-ACQUIRED";
    report.custodyVerified = report.externalAcquisition && (await artifactStore.read(report.checkpoint.artifact.contentDigest)).length === report.checkpoint.artifact.byteLength;
    if (report.externalAcquisition) {
      const duplicate = await service.runOnce(input);
      report.duplicateStatus = duplicate.record.status;
      report.attemptCount = duplicate.record.attemptCount;
    } else {
      report.duplicateStatus = null;
      report.attemptCount = result.record.attemptCount;
    }
    return report;
  } finally { await fs.rm(directory, { recursive: true, force: true }); }
}
main().then(report => process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
