const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = {
  window: {},
  localStorage: {
    getItem() { return null; },
    setItem() {}
  },
  console
};
context.window = context;
vm.createContext(context);

[
  "data/motorcycle-catalog.js",
  "js/motorcycle-catalog.js",
  "js/database.js"
].forEach(relativePath => {
  const filePath = path.join(__dirname, "..", relativePath);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, {
    filename: relativePath
  });
});

const database = context.MotorcycleDatabase;
const databaseState = [{ id: "database-state-must-not-change" }];
database.motorcycles = databaseState;
context.supabaseClient = new Proxy({}, {
  get() {
    throw new Error("Test executora nie może używać window.supabaseClient.");
  }
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createFakeSupabase(initialRows, responseForId = null) {
  const rows = clone(initialRows);
  const calls = [];

  return {
    rows,
    calls,
    client: {
      from(table) {
        assert.equal(table, "motorcycles");

        return {
          update(payload) {
            const call = { table, payload, id: null, nullColumn: null };
            calls.push(call);

            return {
              eq(column, id) {
                assert.equal(column, "id");
                call.id = id;

                return {
                  is(nullColumn, value) {
                    assert.equal(nullColumn, "catalog_variant_key");
                    assert.equal(value, null);
                    call.nullColumn = nullColumn;

                    return {
                      async select(columns) {
                        assert.equal(columns, "id, catalog_variant_key");
                        if (responseForId) {
                          const response = responseForId(id, payload);
                          if (response) {
                            if (response.throw) throw response.throw;
                            return response;
                          }
                        }
                        const row = rows.find(item =>
                          item.id === id &&
                          item.catalog_variant_key === null
                        );

                        if (!row) return { data: [], error: null };

                        row.catalog_variant_key =
                          payload.catalog_variant_key;
                        return {
                          data: [{
                            id: row.id,
                            catalog_variant_key: row.catalog_variant_key
                          }],
                          error: null
                        };
                      }
                    };
                  }
                };
              }
            };
          }
        };
      }
    }
  };
}

(async () => {
const oneOperation = {
  operations: [{
    id: "legacy-vfr",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  }]
};
const oneFake = createFakeSupabase([{
  id: "legacy-vfr",
  catalog_variant_key: null
}]);
const oneReport = clone(await database.executeLegacyMigrationPlan(
  oneOperation,
  oneFake.client
));
assert.deepEqual(oneReport, {
  total: 1,
  migrated: 1,
  skipped: 0,
  failed: 0,
  results: [{
    id: "legacy-vfr",
    toCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1",
    status: "migrated",
    reason: null
  }]
});

const conflictFake = createFakeSupabase([{
  id: "legacy-vfr",
  catalog_variant_key: "existing.key"
}]);
const conflictReport = clone(await database.executeLegacyMigrationPlan(
  oneOperation,
  conflictFake.client
));
assert.equal(conflictReport.migrated, 0);
assert.equal(conflictReport.skipped, 1);
assert.equal(conflictReport.results[0].reason, "no_match");
assert.equal(conflictFake.rows[0].catalog_variant_key, "existing.key");

const missingFake = createFakeSupabase([]);
const missingReport = clone(await database.executeLegacyMigrationPlan(
  oneOperation,
  missingFake.client
));
assert.equal(missingReport.migrated, 0);
assert.equal(missingReport.skipped, 1);
assert.equal(missingReport.results[0].reason, "no_match");

async function assertFailClosed(plan, client) {
  const callsBefore = client ? client.calls.length : 0;
  await assert.rejects(
    database.executeLegacyMigrationPlan(
      plan,
      client ? client.client : null
    )
  );
  if (client) assert.equal(client.calls.length, callsBefore);
}

const invalidFake = createFakeSupabase([{
  id: "must-not-change",
  catalog_variant_key: null
}]);
await assertFailClosed({ operations: [{
  id: null,
  fromCatalogVariantKey: null,
  toCatalogVariantKey: "valid.key"
}] }, invalidFake);
await assertFailClosed({ operations: [{
  id: "must-not-change",
  fromCatalogVariantKey: null,
  toCatalogVariantKey: ""
}] }, invalidFake);
await assertFailClosed({ operations: [{
  id: "must-not-change",
  fromCatalogVariantKey: "existing.key",
  toCatalogVariantKey: "valid.key"
}] }, invalidFake);
await assertFailClosed({ operations: null }, invalidFake);
await assertFailClosed(null, invalidFake);
await assertFailClosed(oneOperation, null);
assert.equal(invalidFake.rows[0].catalog_variant_key, null);

for (const invalidId of [null, undefined, "", "   "]) {
  const fake = createFakeSupabase([]);
  await assertFailClosed({ operations: [{
    id: invalidId,
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "valid.key"
  }] }, fake);
}

for (const invalidTargetKey of [
  null,
  undefined,
  "",
  "   ",
  ".",
  "a..b",
  "a b",
  "a/b"
]) {
  const fake = createFakeSupabase([]);
  await assertFailClosed({ operations: [{
    id: "valid-id",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: invalidTargetKey
  }] }, fake);
}

for (const validSourceKey of [null, undefined, "", "   "]) {
  const fake = createFakeSupabase([]);
  const report = clone(await database.executeLegacyMigrationPlan({
    operations: [{
      id: "valid-id",
      fromCatalogVariantKey: validSourceKey,
      toCatalogVariantKey: "valid.target.key"
    }]
  }, fake.client));
  assert.equal(report.skipped, 1);
  assert.equal(fake.calls.length, 1);
}

const completeValidationFake = createFakeSupabase([
  { id: "valid-one", catalog_variant_key: null },
  { id: "valid-two", catalog_variant_key: null }
]);
const completeValidationSnapshot = clone(completeValidationFake.rows);
await assertFailClosed({ operations: [
  {
    id: "valid-one",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "valid.one"
  },
  {
    id: "valid-two",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "valid.two"
  },
  {
    id: "invalid-three",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "a..b"
  }
] }, completeValidationFake);
assert.deepEqual(completeValidationFake.rows, completeValidationSnapshot);

const duplicateFake = createFakeSupabase([{
  id: "legacy-vfr",
  catalog_variant_key: null
}]);
await assertFailClosed({ operations: [
  {
    id: "legacy-vfr",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1"
  },
  {
    id: "legacy-vfr",
    fromCatalogVariantKey: null,
    toCatalogVariantKey: "some.other.valid.key"
  }
] }, duplicateFake);
assert.equal(duplicateFake.rows[0].catalog_variant_key, null);

const duplicateSource = {
  id: "natural-duplicate",
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  catalogVariantKey: null
};
const naturallyDuplicatedPlan = database.prepareLegacyMigration([
  duplicateSource,
  duplicateSource
]);
assert.deepEqual(
  clone(naturallyDuplicatedPlan.operations.map(operation => operation.id)),
  ["natural-duplicate", "natural-duplicate"]
);
const naturalDuplicateFake = createFakeSupabase([{
  id: "natural-duplicate",
  catalog_variant_key: null
}]);
await assertFailClosed(naturallyDuplicatedPlan, naturalDuplicateFake);
assert.equal(
  naturalDuplicateFake.rows[0].catalog_variant_key,
  null
);

function assertReportAccounting(report) {
  assert.equal(
    report.total,
    report.migrated + report.skipped + report.failed
  );
  assert.equal(report.results.length, report.total);
  ["migrated", "skipped", "failed"].forEach(status => {
    assert.equal(
      report.results.filter(result => result.status === status).length,
      report[status]
    );
  });
}

const dataCases = {
  empty: { data: [], error: null },
  one: {
    data: [{ id: "data-case", catalog_variant_key: "valid.key" }],
    error: null
  },
  two: {
    data: [
      { id: "data-case", catalog_variant_key: "valid.key" },
      { id: "data-case-2", catalog_variant_key: "valid.key" }
    ],
    error: null
  },
  null: { data: null, error: null }
};
const dataLengthReports = {};
for (const [name, response] of Object.entries(dataCases)) {
  const fake = createFakeSupabase([], () => response);
  const report = clone(await database.executeLegacyMigrationPlan({
    operations: [{
      id: "data-case",
      fromCatalogVariantKey: null,
      toCatalogVariantKey: "valid.key"
    }]
  }, fake.client));
  dataLengthReports[name] = report;
  assertReportAccounting(report);
}
assert.equal(dataLengthReports.empty.results[0].status, "skipped");
assert.equal(dataLengthReports.one.results[0].status, "migrated");
assert.equal(dataLengthReports.two.results[0].status, "skipped");
assert.equal(dataLengthReports.null.results[0].status, "skipped");

const errorFake = createFakeSupabase([], () => ({
  data: null,
  error: { message: "synthetic update error" }
}));
const errorReport = clone(await database.executeLegacyMigrationPlan(
  oneOperation,
  errorFake.client
));
assert.equal(errorReport.failed, 1);
assert.equal(errorReport.results[0].status, "failed");
assert.equal(errorReport.results[0].reason, "synthetic update error");
assertReportAccounting(errorReport);

const exceptionFake = createFakeSupabase([], () => ({
  throw: new Error("synthetic builder exception")
}));
const exceptionReport = clone(await database.executeLegacyMigrationPlan(
  oneOperation,
  exceptionFake.client
));
assert.equal(exceptionReport.failed, 1);
assert.equal(exceptionReport.results[0].status, "failed");
assert.equal(exceptionReport.results[0].reason, "synthetic builder exception");
assertReportAccounting(exceptionReport);

const continuationFake = createFakeSupabase(
  [{ id: "second", catalog_variant_key: null }],
  id => id === "first"
    ? { data: null, error: { message: "first failed" } }
    : null
);
const continuationReport = clone(await database.executeLegacyMigrationPlan({
  operations: [
    {
      id: "first",
      fromCatalogVariantKey: null,
      toCatalogVariantKey: "valid.first"
    },
    {
      id: "second",
      fromCatalogVariantKey: null,
      toCatalogVariantKey: "valid.second"
    }
  ]
}, continuationFake.client));
assert.equal(continuationReport.failed, 1);
assert.equal(continuationReport.migrated, 1);
assertReportAccounting(continuationReport);

const sourceMotorcycles = [
  {
    id: "legacy-fz1",
    brand: "Yamaha",
    model: "FZ1",
    year: 2006,
    catalogVariantKey: null
  },
  {
    id: "legacy-vfr",
    brand: "Honda",
    model: "VFR800 VTEC",
    year: 2002,
    catalogVariantKey: null
  },
  {
    id: "legacy-fz1s",
    brand: "Yamaha",
    model: "FZ1-S",
    year: 2006,
    catalogVariantKey: null
  }
];
const plan = database.prepareLegacyMigration(sourceMotorcycles);
const planSnapshot = JSON.stringify(plan);
const planReference = plan;
const operationsReference = plan.operations;
const operationReferences = [...plan.operations];
assert.deepEqual(
  clone(plan.operations.map(operation => operation.id)),
  ["legacy-vfr", "legacy-fz1s"]
);
assert.equal(
  plan.operations.some(operation => operation.id === "legacy-fz1"),
  false
);

const integrationFake = createFakeSupabase([
  { id: "legacy-fz1", catalog_variant_key: null },
  { id: "legacy-vfr", catalog_variant_key: null },
  { id: "legacy-fz1s", catalog_variant_key: null }
]);
const beforeIntegration = clone(integrationFake.rows);
const integrationReport = clone(
  await database.executeLegacyMigrationPlan(plan, integrationFake.client)
);
assert.deepEqual(integrationReport, {
  total: 2,
  migrated: 2,
  skipped: 0,
  failed: 0,
  results: [
    {
      id: "legacy-vfr",
      toCatalogVariantKey: "honda.vfr800.rc46.vtec.gen1",
      status: "migrated",
      reason: null
    },
    {
      id: "legacy-fz1s",
      toCatalogVariantKey: "yamaha.fz1.gen2.s",
      status: "migrated",
      reason: null
    }
  ]
});
assert.deepEqual(integrationFake.rows, [
  { id: "legacy-fz1", catalog_variant_key: null },
  {
    id: "legacy-vfr",
    catalog_variant_key: "honda.vfr800.rc46.vtec.gen1"
  },
  {
    id: "legacy-fz1s",
    catalog_variant_key: "yamaha.fz1.gen2.s"
  }
]);
assert.equal(JSON.stringify(plan), planSnapshot);
assert.equal(plan, planReference);
assert.equal(plan.operations, operationsReference);
operationReferences.forEach((operation, index) => {
  assert.equal(plan.operations[index], operation);
});
assert.equal(database.motorcycles, databaseState);

[
  oneReport,
  conflictReport,
  missingReport,
  integrationReport,
  continuationReport
].forEach(assertReportAccounting);

console.log(JSON.stringify({
  oneOperation: oneReport,
  existingKey: conflictReport,
  missingIdInDatabase: missingReport,
  failClosed: true,
  fullPlanValidatedBeforeUpdate: true,
  idValidation: true,
  targetKeyValidation: true,
  sourceKeyValidation: true,
  duplicateIdRejected: true,
  dataLengthReports,
  errorReport,
  exceptionReport,
  continuationReport,
  integration: {
    plan,
    before: beforeIntegration,
    report: integrationReport,
    after: integrationFake.rows
  },
  fz1NotMigrated: integrationFake.rows[0].catalog_variant_key === null,
  planNotModified: true,
  operationReferencesUnchanged: true,
  databaseStateNotModified: true,
  windowSupabaseNotCalled: true,
  status: "OK"
}, null, 2));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
