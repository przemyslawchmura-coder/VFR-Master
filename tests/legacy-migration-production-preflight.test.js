const assert = require("node:assert/strict");
const path = require("node:path");

const {
  loadMotorcycleDatabase
} = require("../scripts/legacy-motorcycle-read-only-audit.js");
const {
  evaluateControlledMigrationReadiness,
  prepareControlledMigrationPreflight,
  redactPreflightReport
} = require("../scripts/legacy-motorcycle-migration-preflight.js");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const database = loadMotorcycleDatabase(path.join(__dirname, ".."));
const databaseState = [{ id: "database-state-must-not-change" }];
database.motorcycles = databaseState;
let executorCalls = 0;
database.executeLegacyMigrationPlan = () => {
  executorCalls += 1;
  throw new Error("Preflight must stop before the executor.");
};

const initialRows = [
  {
    id: "legacy-vfr",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalog_variant_key: null
  },
  {
    id: "legacy-fz1s",
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2006,
    catalog_variant_key: null
  },
  {
    id: "already-mapped",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalog_variant_key: "honda.vfr800.rc46.vtec.gen1"
  }
];

function createSequentialSelectClient(firstRows, secondRows = firstRows) {
  const snapshots = [clone(firstRows), clone(secondRows)];
  const storedRows = clone(firstRows);
  let selectCount = 0;
  const calls = [];

  return {
    storedRows,
    snapshots,
    calls,
    client: {
      from(table) {
        assert.equal(table, "motorcycles");
        return {
          select(columns) {
            return {
              async order(column, options) {
                calls.push({ columns, column, options });
                const rows = snapshots[Math.min(selectCount, 1)];
                selectCount += 1;
                return { data: clone(rows), error: null };
              }
            };
          }
        };
      },
      update() { throw new Error("UPDATE is forbidden in preflight."); },
      insert() { throw new Error("INSERT is forbidden in preflight."); },
      upsert() { throw new Error("UPSERT is forbidden in preflight."); },
      delete() { throw new Error("DELETE is forbidden in preflight."); },
      rpc() { throw new Error("RPC is forbidden in preflight."); }
    }
  };
}

function evaluationInput(rows = initialRows) {
  const motorcycles = rows.map(row => database.deserializeMotorcycle(row));
  return {
    analysis: database.analyzeLegacyMotorcycles(motorcycles),
    plan: database.prepareLegacyMigration(motorcycles),
    initialMotorcycles: clone(motorcycles),
    currentMotorcycles: clone(motorcycles),
    database
  };
}

function cloneEvaluationInput(input) {
  return {
    ...clone({
      analysis: input.analysis,
      plan: input.plan,
      initialMotorcycles: input.initialMotorcycles,
      currentMotorcycles: input.currentMotorcycles
    }),
    database: input.database
  };
}

(async () => {
  const fake = createSequentialSelectClient(initialRows);
  const fakeSnapshot = JSON.stringify(fake.storedRows);
  const fetchedSnapshots = JSON.stringify(fake.snapshots);
  const report = await prepareControlledMigrationPreflight(
    fake.client,
    database
  );
  assert.equal(report.readyForControlledMigration, true);
  assert.equal(report.requestCount, 2);
  assert.equal(report.inputUnchanged, true);
  assert.equal(report.plan.operations.length, 2);
  assert.equal(report.sanity.every(result => result.valid), true);
  assert.equal(JSON.stringify(fake.storedRows), fakeSnapshot);
  assert.equal(JSON.stringify(fake.snapshots), fetchedSnapshots);
  assert.equal(fake.calls.length, 2);
  assert.equal(executorCalls, 0);
  assert.equal(database.motorcycles, databaseState);

  const redacted = redactPreflightReport(report);
  assert.equal(redacted.READY_FOR_CONTROLLED_MIGRATION, true);
  assert.equal(JSON.stringify(redacted).includes("legacy-vfr"), false);
  assert.equal(JSON.stringify(redacted).includes("legacy-fz1s"), false);
  assert.equal(JSON.stringify(redacted).includes("user_id"), false);
  assert.equal(JSON.stringify(redacted).includes("access_token"), false);

  const oneOperation = evaluationInput([
    initialRows[0],
    initialRows[2]
  ]);
  assert.equal(
    evaluateControlledMigrationReadiness(oneOperation)
      .readyForControlledMigration,
    false
  );

  const threeOperations = evaluationInput([
    initialRows[0],
    initialRows[1],
    {
      id: "legacy-fz1n",
      brand: "Yamaha",
      model: "FZ1-N",
      year: 2006,
      catalog_variant_key: null
    }
  ]);
  assert.equal(
    evaluateControlledMigrationReadiness(threeOperations)
      .readyForControlledMigration,
    false
  );

  const base = evaluationInput();
  const baseSnapshot = JSON.stringify(base);
  const analysisReference = base.analysis;
  const planReference = base.plan;
  const operationsReference = base.plan.operations;
  const operationReferences = [...base.plan.operations];
  assert.equal(
    evaluateControlledMigrationReadiness(base)
      .readyForControlledMigration,
    true
  );
  assert.equal(JSON.stringify(base), baseSnapshot);
  assert.equal(base.analysis, analysisReference);
  assert.equal(base.plan, planReference);
  assert.equal(base.plan.operations, operationsReference);
  operationReferences.forEach((operation, index) => {
    assert.equal(base.plan.operations[index], operation);
  });

  const wrongTotal = cloneEvaluationInput(base);
  wrongTotal.analysis.total = 4;
  wrongTotal.plan.total = 4;
  assert.equal(
    evaluateControlledMigrationReadiness(wrongTotal)
      .readyForControlledMigration,
    false
  );

  const wrongAlreadyMigrated = cloneEvaluationInput(base);
  wrongAlreadyMigrated.analysis.alreadyMigrated = 0;
  assert.equal(
    evaluateControlledMigrationReadiness(wrongAlreadyMigrated)
      .readyForControlledMigration,
    false
  );

  const wrongUnique = cloneEvaluationInput(base);
  wrongUnique.analysis.unique = 1;
  assert.equal(
    evaluateControlledMigrationReadiness(wrongUnique)
      .readyForControlledMigration,
    false
  );

  const wrongSafeCount = cloneEvaluationInput(base);
  wrongSafeCount.plan.safeToMigrate = 1;
  assert.equal(
    evaluateControlledMigrationReadiness(wrongSafeCount)
      .readyForControlledMigration,
    false
  );

  const ambiguous = cloneEvaluationInput(base);
  ambiguous.analysis.ambiguous = 1;
  ambiguous.analysis.unique = 1;
  assert.equal(
    evaluateControlledMigrationReadiness(ambiguous)
      .readyForControlledMigration,
    false
  );

  const notFound = cloneEvaluationInput(base);
  notFound.analysis.notFound = 1;
  notFound.analysis.unique = 1;
  assert.equal(
    evaluateControlledMigrationReadiness(notFound)
      .readyForControlledMigration,
    false
  );

  const missingId = cloneEvaluationInput(base);
  missingId.plan.skippedMissingId = 1;
  missingId.plan.safeToMigrate = 1;
  missingId.plan.operations.pop();
  missingId.plan.skipped.push({ reason: "missing_id" });
  assert.equal(
    evaluateControlledMigrationReadiness(missingId)
      .readyForControlledMigration,
    false
  );

  const invalidTarget = cloneEvaluationInput(base);
  invalidTarget.plan.operations[0].toCatalogVariantKey = "invalid key";
  assert.equal(
    evaluateControlledMigrationReadiness(invalidTarget)
      .readyForControlledMigration,
    false
  );

  const duplicatedTarget = cloneEvaluationInput(base);
  duplicatedTarget.plan.operations[1].toCatalogVariantKey =
    duplicatedTarget.plan.operations[0].toCatalogVariantKey;
  assert.equal(
    evaluateControlledMigrationReadiness(duplicatedTarget)
      .readyForControlledMigration,
    false
  );

  const nonNullSource = cloneEvaluationInput(base);
  nonNullSource.plan.operations[0].fromCatalogVariantKey = "existing.key";
  assert.equal(
    evaluateControlledMigrationReadiness(nonNullSource)
      .readyForControlledMigration,
    false
  );

  const emptyId = cloneEvaluationInput(base);
  emptyId.plan.operations[0].id = "   ";
  assert.equal(
    evaluateControlledMigrationReadiness(emptyId)
      .readyForControlledMigration,
    false
  );

  const duplicateId = cloneEvaluationInput(base);
  duplicateId.plan.operations[1].id = duplicateId.plan.operations[0].id;
  assert.equal(
    evaluateControlledMigrationReadiness(duplicateId)
      .readyForControlledMigration,
    false
  );

  const normalizedDuplicateId = cloneEvaluationInput(base);
  normalizedDuplicateId.plan.operations[1].id =
    ` ${normalizedDuplicateId.plan.operations[0].id} `;
  const normalizedDuplicateResult =
    evaluateControlledMigrationReadiness(normalizedDuplicateId);
  assert.equal(normalizedDuplicateResult.readyForControlledMigration, false);
  assert.equal(
    normalizedDuplicateResult.errors.includes("duplicate_operation_id"),
    true
  );

  const changedRows = clone(initialRows);
  changedRows[0].catalog_variant_key = "existing.concurrent.key";
  const changedFake = createSequentialSelectClient(initialRows, changedRows);
  const changedReport = await prepareControlledMigrationPreflight(
    changedFake.client,
    database
  );
  assert.equal(changedReport.readyForControlledMigration, false);
  assert.equal(changedReport.errors.includes("current_key_changed"), true);

  const missingRows = clone(initialRows).slice(1);
  const missingFake = createSequentialSelectClient(initialRows, missingRows);
  const missingReport = await prepareControlledMigrationPreflight(
    missingFake.client,
    database
  );
  assert.equal(missingReport.readyForControlledMigration, false);
  assert.equal(missingReport.errors.includes("current_record_missing"), true);

  for (const [field, value] of [
    ["brand", "Changed brand"],
    ["model", "Changed model"],
    ["year", 2003]
  ]) {
    const identityRows = clone(initialRows);
    identityRows[0][field] = value;
    const identityFake = createSequentialSelectClient(
      initialRows,
      identityRows
    );
    const identityReport = await prepareControlledMigrationPreflight(
      identityFake.client,
      database
    );
    assert.equal(identityReport.readyForControlledMigration, false);
    assert.equal(identityReport.errors.includes("identity_changed"), true);
  }

  const notUnique = cloneEvaluationInput(base);
  notUnique.currentMotorcycles[0].model = "Unknown";
  const notUniqueResult = evaluateControlledMigrationReadiness(notUnique);
  assert.equal(notUniqueResult.readyForControlledMigration, false);
  assert.equal(
    notUniqueResult.errors.includes("current_analysis_mismatch"),
    true
  );

  const differentTarget = cloneEvaluationInput(base);
  differentTarget.database = {
    analyzeLegacyMotorcycles() {
      return {
        results: [{
          status: "unique",
          proposedCatalogVariantKey: "some.other.valid.key"
        }]
      };
    }
  };
  const differentTargetResult =
    evaluateControlledMigrationReadiness(differentTarget);
  assert.equal(differentTargetResult.readyForControlledMigration, false);
  assert.equal(
    differentTargetResult.errors.includes("current_analysis_mismatch"),
    true
  );

  assert.equal(executorCalls, 0);
  assert.equal(database.motorcycles, databaseState);

  console.log(JSON.stringify({
    readyScenario: {
      ready: report.readyForControlledMigration,
      operations: report.plan.operations.length,
      sanity: report.sanity
    },
    oneOperationRejected: true,
    threeOperationsRejected: true,
    wrongTotalRejected: true,
    wrongAlreadyMigratedRejected: true,
    wrongUniqueRejected: true,
    wrongSafeCountRejected: true,
    ambiguousRejected: true,
    notFoundRejected: true,
    missingIdRejected: true,
    invalidTargetRejected: true,
    duplicateTargetRejected: true,
    nonNullSourceRejected: true,
    emptyIdRejected: true,
    duplicateIdRejected: true,
    normalizedDuplicateIdRejected: true,
    concurrentKeyChangeRejected: true,
    missingRecordRejected: true,
    brandChangeRejected: true,
    modelChangeRejected: true,
    yearChangeRejected: true,
    nonUniqueReanalysisRejected: true,
    changedTargetReanalysisRejected: true,
    analysisAndPlanImmutable: true,
    fetchedInputsImmutable: true,
    executorNotCalled: executorCalls === 0,
    fakeDataUnchanged: true,
    databaseStateUnchanged: database.motorcycles === databaseState,
    realSupabaseNotUsed: true,
    status: "OK"
  }, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
